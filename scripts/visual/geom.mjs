/**
 * DOM 기하 비교 — 기준 서버(HEAD 빌드)와 현재 서버의 같은 라우트를 열어 요소별 rect 를 맞대어 본다.
 *
 * 스크린샷 diff 는 "높이가 달라졌다"까지만 알려준다. 원인 요소를 특정하려면 같은 구조 경로의
 * 요소끼리 크기를 비교하는 게 가장 빠르다. 인라인 style → 유틸리티 전환에서 생기는 사고는
 * 대부분 "레이어 없는 globals 규칙이 유틸리티를 이겨버린 것"이라 이 표로 바로 잡힌다.
 *
 *   BASE_URL=http://localhost:3002 CURR_URL=http://localhost:3001 node scripts/visual/geom.mjs
 *   node scripts/visual/geom.mjs /greeting 390
 */
import { chromium } from "playwright";

const BASE = process.env.BASE_URL ?? "http://localhost:3002"; // 기준(HEAD)
const CURR = process.env.CURR_URL ?? "http://localhost:3001"; // 현재(작업본)

const ALL_ROUTES = [
	"/",
	"/greeting",
	"/members",
	"/services",
	"/services/f4",
	"/services/e7",
	"/reviews",
	"/blog",
	"/blog?page=2",
	"/blog?category=review",
	"/faq",
	"/location",
	"/contact",
	"/privacy",
	"/terms",
];
const ROUTES = process.argv[2] ? [process.argv[2]] : ALL_ROUTES;
const WIDTHS = process.argv[3] ? [Number(process.argv[3])] : [390, 768, 1440];

const FREEZE_CSS = `
*, *::before, *::after {
  animation-duration: 0s !important;
  animation-delay: 0s !important;
  animation-play-state: paused !important;
  transition-duration: 0s !important;
  transition-delay: 0s !important;
}
[data-reveal], [data-stagger] > *, [data-reveal] * {
  opacity: 1 !important;
  transform: none !important;
  filter: none !important;
}
`;

// 클래스는 마이그레이션으로 바뀌므로 요소 식별은 "구조 경로"로 한다.
const COLLECT = `(() => {
	const out = [];
	const walk = (el, path) => {
		const r = el.getBoundingClientRect();
		out.push({
			path,
			tag: el.tagName.toLowerCase(),
			cls: (typeof el.className === "string" ? el.className : "").slice(0, 100),
			w: Math.round(r.width * 10) / 10,
			h: Math.round(r.height * 10) / 10,
		});
		for (let i = 0; i < el.children.length; i++) walk(el.children[i], path + ">" + i);
	};
	walk(document.body, "body");
	return { nodes: out, docH: document.documentElement.scrollHeight };
})()`;

const snap = async (browser, url, width) => {
	const ctx = await browser.newContext({ deviceScaleFactor: 1, viewport: { width, height: 900 } });
	const page = await ctx.newPage();
	try {
		await page.goto(url, { waitUntil: "domcontentloaded", timeout: 45000 });
		// 애니메이션을 멈추지 않으면 흔들림 모션(.consult-ring 등) 때문에 rect 가 매번 달라진다
		await page.addStyleTag({ content: FREEZE_CSS });
		await page.evaluate(async () => {
			await document.fonts.ready;
		});
		// 이미지 디코딩까지 끝나야 높이가 확정된다(캡처 스크립트와 같은 조건)
		await page.evaluate(async () => {
			const imgs = [...document.images].map((i) =>
				i.decode ? i.decode().catch(() => {}) : Promise.resolve(),
			);
			await Promise.race([Promise.all(imgs), new Promise((r) => setTimeout(r, 6000))]);
		});
		await page.waitForTimeout(300);
		return await page.evaluate(COLLECT);
	} finally {
		await ctx.close();
	}
};

const run = async () => {
	const browser = await chromium.launch();
	let total = 0;
	try {
		for (const route of ROUTES) {
			for (const width of WIDTHS) {
				const a = await snap(browser, BASE + route, width);
				const b = await snap(browser, CURR + route, width);
				const mapA = new Map(a.nodes.map((x) => [x.path, x]));
				const rows = [];
				for (const y of b.nodes) {
					const x = mapA.get(y.path);
					if (!x) {
						rows.push({ ...y, note: "기준에 없는 노드(구조 변경)" });
						continue;
					}
					const dh = Math.round((y.h - x.h) * 10) / 10;
					const dw = Math.round((y.w - x.w) * 10) / 10;
					if (Math.abs(dh) >= 0.5 || Math.abs(dw) >= 0.5) rows.push({ ...y, dh, dw, ref: x });
				}
				// 부모는 자식 때문에 밀린 것이므로, 같은 Δ를 가진 더 깊은 자손이 있으면 부모는 버린다
				const leaf = rows.filter(
					(r) =>
						r.note ||
						!rows.some(
							(o) => o !== r && o.path.startsWith(`${r.path}>`) && o.dh === r.dh && o.dw === r.dw,
						),
				);
				const dDoc = b.docH - a.docH;
				if (leaf.length || dDoc !== 0) {
					console.log(`\n■ ${route} @${width}px  문서높이 ${a.docH}→${b.docH} (Δ${dDoc})`);
					for (const r of leaf.slice(0, 14)) {
						const d = r.note ?? `Δh=${r.dh} Δw=${r.dw}  (h ${r.ref.h}→${r.h}, w ${r.ref.w}→${r.w})`;
						console.log(`   ${r.path}  ${r.tag}.${r.cls || "-"}`);
						console.log(`      ${d}`);
					}
					if (leaf.length > 14) console.log(`   … 외 ${leaf.length - 14}건`);
					total += leaf.length;
				} else {
					console.log(`✓ ${route} @${width}px`);
				}
			}
		}
	} finally {
		await browser.close();
	}
	console.log(total ? `\n총 원인 후보 ${total}건` : "\n✓ 기하 차이 없음");
};

await run();
