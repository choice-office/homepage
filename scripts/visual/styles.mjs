/**
 * 계산된 스타일 비교 — 기준 서버(HEAD 빌드) vs 현재 서버를, 요소별 · 속성별로 맞대어 본다.
 *
 * geom.mjs 는 "이 요소 높이가 88px 줄었다"까지 알려준다. 원인 선언까지 특정하려면 계산값을
 * 봐야 한다: padding-top 56px→0px 이면 "레이어 없는 globals 규칙이 유틸리티를 이겼다"는 뜻이다.
 * (Tailwind 유틸리티는 @layer utilities 안에 있어, 레이어 없는 규칙에 항상 진다.)
 *
 *   node scripts/visual/styles.mjs                 # 전 라우트 × 3 뷰포트
 *   node scripts/visual/styles.mjs /members 390    # 한 라우트
 */
import { chromium } from "playwright";

const BASE = process.env.BASE_URL ?? "http://localhost:3002";
const CURR = process.env.CURR_URL ?? "http://localhost:3001";

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

// 레이아웃·타이포에 영향을 주는 속성만 고른다(전체를 뜨면 무의미한 잡음이 너무 많다)
const PROPS = [
	"display",
	"position",
	"flex-grow",
	"flex-shrink",
	"flex-basis",
	"flex-direction",
	"align-items",
	"justify-content",
	"gap",
	"grid-template-columns",
	"margin-top",
	"margin-right",
	"margin-bottom",
	"margin-left",
	"padding-top",
	"padding-right",
	"padding-bottom",
	"padding-left",
	"min-width",
	"min-height",
	"max-width",
	"max-height",
	"border-top-width",
	"border-right-width",
	"border-bottom-width",
	"border-left-width",
	"border-radius",
	"font-family",
	"font-stretch",
	"font-synthesis-weight",
	"word-spacing",
	"font-size",
	"font-weight",
	"line-height",
	"letter-spacing",
	"text-align",
	"white-space",
	"word-break",
	"color",
	"background-color",
	"background-image",
	"box-shadow",
	"opacity",
	"z-index",
	"overflow",
	"object-fit",
	"text-decoration-line",
	"transform",
];

const COLLECT = `(() => {
	const PROPS = ${JSON.stringify(PROPS)};
	const out = [];
	const walk = (el, path) => {
		const cs = getComputedStyle(el);
		const v = {};
		for (const p of PROPS) v[p] = cs.getPropertyValue(p);
		out.push({ path, tag: el.tagName.toLowerCase(), cls: (typeof el.className === "string" ? el.className : "").slice(0, 110), v });
		for (let i = 0; i < el.children.length; i++) walk(el.children[i], path + ">" + i);
	};
	walk(document.body, "body");
	return out;
})()`;

const snap = async (browser, url, width) => {
	const ctx = await browser.newContext({ deviceScaleFactor: 1, viewport: { width, height: 900 } });
	const page = await ctx.newPage();
	try {
		await page.goto(url, { waitUntil: "domcontentloaded", timeout: 45000 });
		await page.addStyleTag({ content: FREEZE_CSS });
		await page.evaluate(async () => {
			await document.fonts.ready;
		});
		await page.evaluate(async () => {
			const imgs = [...document.images].map((i) =>
				i.decode ? i.decode().catch(() => {}) : Promise.resolve(),
			);
			await Promise.race([Promise.all(imgs), new Promise((r) => setTimeout(r, 6000))]);
		});
		await page.waitForTimeout(250);
		return await page.evaluate(COLLECT);
	} finally {
		await ctx.close();
	}
};

// 같은 (클래스, 속성, 기준값→현재값) 조합은 한 번만 보고한다 — 반복 요소로 수백 줄 나오는 걸 막는다
const seen = new Map();

const run = async () => {
	const browser = await chromium.launch();
	try {
		for (const route of ROUTES) {
			for (const width of WIDTHS) {
				const a = await snap(browser, BASE + route, width);
				const b = await snap(browser, CURR + route, width);
				const mapA = new Map(a.map((x) => [x.path, x]));
				let n = 0;
				for (const y of b) {
					const x = mapA.get(y.path);
					if (!x) continue;
					for (const p of PROPS) {
						if (x.v[p] === y.v[p]) continue;
						// 서브픽셀 차이(0.5px 미만)는 폰트 메트릭 흔들림 — 선언 충돌이 아니다
						const na = Number.parseFloat(x.v[p]);
						const nb = Number.parseFloat(y.v[p]);
						if (Number.isFinite(na) && Number.isFinite(nb) && Math.abs(na - nb) < 0.5) continue;
						const key = `${width}|${y.cls}|${p}|${x.v[p]}→${y.v[p]}`;
						if (seen.has(key)) {
							seen.get(key).count++;
							continue;
						}
						seen.set(key, {
							count: 1,
							width,
							route,
							path: y.path,
							tag: y.tag,
							cls: y.cls,
							prop: p,
							from: x.v[p],
							to: y.v[p],
						});
						n++;
					}
				}
				console.log(`${n ? "■" : "✓"} ${route} @${width}px  새 차이 ${n}`);
			}
		}
	} finally {
		await browser.close();
	}

	const rows = [...seen.values()];
	console.log(`\n───── 고유 차이 ${rows.length}건 ─────`);
	// 클래스 단위로 묶어 보여준다(수정 단위가 곧 클래스이므로)
	const byCls = new Map();
	for (const r of rows) {
		const k = `${r.tag}.${r.cls}`;
		if (!byCls.has(k)) byCls.set(k, []);
		byCls.get(k).push(r);
	}
	for (const [k, list] of [...byCls.entries()].sort((a, b) => b[1].length - a[1].length)) {
		console.log(`\n● ${k}`);
		console.log(`   최초: ${list[0].route} @${list[0].width}px  ${list[0].path}`);
		for (const r of list) {
			console.log(`   - ${r.prop}: ${r.from} → ${r.to}   @${r.width}px ×${r.count}`);
		}
	}
};

await run();
