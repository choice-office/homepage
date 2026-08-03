/**
 * "설정했는데 무시되는 CSS" 탐지기.
 *
 * 이번에 겪은 두 종류를 자동으로 잡는다.
 *   A. font-weight 800 을 줬는데 폰트가 700 까지만 로드돼 700 으로 폴백 → 시각적으로 변화 없음
 *   B. @media 로 준 규칙을 인라인 style 이 덮어써 영원히 죽어 있음
 * 여기에 미정의 CSS 변수 참조까지 함께 본다.
 *
 *   node scripts/visual/audit.mjs
 */
import { chromium } from "playwright";

const BASE = process.env.BASE_URL ?? "http://localhost:3001";
const ROUTES = ["/", "/greeting", "/members", "/services", "/services/f4", "/reviews", "/blog", "/faq", "/location", "/contact"];
const VIEWPORTS = [
	["mobile", 390, 844],
	["desktop", 1440, 900],
];

const IN_PAGE = () => {
	const rules = [];
	const walk = (list) => {
		for (const r of list) {
			// CSS 중첩 지원 브라우저에선 일반 규칙도 cssRules 를 갖는다 → selectorText 를 먼저 본다
			if (r.selectorText && r.style) rules.push({ sel: r.selectorText, style: r.style, media: r.parentRule?.conditionText ?? null });
			if (r.cssRules?.length) walk(r.cssRules);
		}
	};
	for (const s of document.styleSheets) { try { walk(s.cssRules); } catch {} }

	// ── A. 선언한 font-weight 중 실제 로드된 페이스가 없는 것
	const declared = new Set();
	for (const el of document.querySelectorAll("*")) {
		const w = getComputedStyle(el).fontWeight;
		if (w) declared.add(w);
	}
	const fontFallback = [...declared]
		.filter((w) => /^\d+$/.test(w))
		.map((w) => ({ weight: w, available: document.fonts.check(`${w} 16px "Noto Sans KR"`) }))
		.filter((x) => !x.available);

	// ── B. 인라인 style 이 CSS 규칙을 덮어써 규칙이 죽은 곳
	//    Tailwind preflight(`*`, `img,video` 등 리셋)는 덮이는 게 정상이라 제외
	const RESET = /^(\*|\*,|:root|html|body|button|input|select|optgroup|textarea|img|video|h1|h2|h3|h4|::)/;
	const dead = new Map();
	for (const el of document.querySelectorAll("[style]")) {
		if (!el.style.length) continue;
		for (const r of rules) {
			if (RESET.test(r.sel.trim())) continue;
			let m = false;
			try { m = el.matches(r.sel); } catch { continue; }
			if (!m) continue;
			for (const p of el.style) {
				const cssVal = r.style.getPropertyValue(p);
				if (!cssVal) continue;
				const inlineVal = el.style.getPropertyValue(p);
				if (cssVal.trim() === inlineVal.trim()) continue;
				const key = `${r.media ? `@media ${r.media} ` : ""}${r.sel} { ${p}: ${cssVal} }  ← 인라인 ${inlineVal}`;
				dead.set(key, (dead.get(key) ?? 0) + 1);
			}
		}
	}

	// ── C. 정의되지 않은 CSS 변수 참조(폴백 없는 것만)
	const undef = new Set();
	const rootStyle = getComputedStyle(document.documentElement);
	for (const r of rules) {
		for (const p of r.style) {
			const v = r.style.getPropertyValue(p);
			for (const m of v.matchAll(/var\((--[a-zA-Z0-9-]+)\s*\)/g)) {
				if (!rootStyle.getPropertyValue(m[1]).trim()) undef.add(`${r.sel} { ${p}: ${m[1]} }`);
			}
		}
	}

	return {
		fontFallback,
		dead: [...dead.entries()].sort((a, b) => b[1] - a[1]).map(([k, v]) => ({ rule: k, elements: v })),
		undefinedVars: [...undef],
		inlineCount: document.querySelectorAll("[style]").length,
	};
};

const main = async () => {
	const browser = await chromium.launch();
	const agg = { fontFallback: new Set(), dead: new Map(), undefinedVars: new Set(), inline: 0 };

	for (const [vpName, width, height] of VIEWPORTS) {
		const ctx = await browser.newContext({ viewport: { width, height } });
		const page = await ctx.newPage();
		for (const route of ROUTES) {
			try {
				await page.goto(BASE + route, { waitUntil: "domcontentloaded", timeout: 60_000 });
				await page.waitForLoadState("load").catch(() => {});
				await page.evaluate(() => document.fonts.ready);
				const r = await page.evaluate(IN_PAGE);
				for (const f of r.fontFallback) agg.fontFallback.add(f.weight);
				for (const d of r.dead) {
					const k = `[${vpName}] ${d.rule}`;
					agg.dead.set(k, (agg.dead.get(k) ?? 0) + d.elements);
				}
				for (const u of r.undefinedVars) agg.undefinedVars.add(u);
				agg.inline += r.inlineCount;
			} catch (e) {
				console.log(`  ! ${route} @${vpName} — ${e.message.split("\n")[0]}`);
			}
		}
		await ctx.close();
	}
	await browser.close();

	const fail = [];
	console.log("════ A. 로드되지 않아 폴백되는 font-weight ════");
	if (agg.fontFallback.size === 0) console.log("  ✓ 없음");
	else { console.log(`  ✗ ${[...agg.fontFallback].join(", ")} — next/font weight 목록에 추가 필요`); fail.push("font"); }

	console.log("\n════ B. 인라인에 덮여 죽은 CSS 규칙 ════");
	if (agg.dead.size === 0) console.log("  ✓ 없음");
	else { for (const [k, v] of agg.dead) console.log(`  ✗ ${v}개 요소  ${k}`); fail.push("dead"); }

	console.log("\n════ C. 정의되지 않은 CSS 변수 참조 ════");
	if (agg.undefinedVars.size === 0) console.log("  ✓ 없음");
	else { for (const u of agg.undefinedVars) console.log(`  ✗ ${u}`); fail.push("var"); }

	console.log(`\n인라인 style 요소 총계(중복 포함): ${agg.inline}`);
	process.exit(fail.length ? 1 : 0);
};

main();
