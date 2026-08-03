/**
 * globals.css 를 @layer components 로 감쌌을 때 "뒤집힐" 지점을 미리 찾는다.
 *
 * 현재: Tailwind 유틸리티 = @layer utilities / globals.css 커스텀 = 레이어 밖
 *       → 레이어 밖이 항상 이김 (globals 승)
 * 변경 후: globals 가 components 레이어로 들어가면 utilities 가 뒤에 오므로
 *       → 같은 속성을 두고 겨루던 곳은 유틸리티 승으로 '뒤집힌다' = 화면 변화
 *
 * 이 스크립트는 그 교집합(같은 요소·같은 속성)을 전부 뽑아 준다.
 * 여기 잡힌 건 레이어 전환 전에 개별 처리해야 화면이 안 바뀐다.
 *
 *   node scripts/visual/layer-risk.mjs
 */
import { chromium } from "playwright";

const BASE = process.env.BASE_URL ?? "http://localhost:3001";
const ROUTES = ["/", "/greeting", "/members", "/services", "/services/f4", "/reviews", "/blog", "/blog/한국여권-부정사용-범칙금-시민권-취득", "/faq", "/location", "/contact", "/privacy"];
const VIEWPORTS = [["mobile", 390, 844], ["tablet", 768, 1024], ["desktop", 1440, 900]];

const IN_PAGE = () => {
	// 레이어별로 규칙을 수집
	const layered = [];   // @layer utilities 등
	const unlayered = []; // globals.css 커스텀
	for (const s of document.styleSheets) {
		let rs; try { rs = s.cssRules; } catch { continue; }
		const scan = (list, layer, media) => {
			for (const r of list) {
				const t = r.constructor.name;
				if (t === "CSSLayerBlockRule") { scan(r.cssRules, r.name || "(anon)", media); continue; }
				if (t === "CSSMediaRule") { scan(r.cssRules, layer, r.conditionText); continue; }
				if (t === "CSSSupportsRule") { scan(r.cssRules, layer, media); continue; }
				if (r.selectorText && r.style) {
					(layer ? layered : unlayered).push({ sel: r.selectorText, style: r.style, layer, media });
				}
				if (r.cssRules?.length && t === "CSSStyleRule") scan(r.cssRules, layer, media);
			}
		};
		scan(rs, null, null);
	}

	// Tailwind preflight(base 레이어의 리셋)는 뒤집혀도 무해 → utilities 레이어만 본다
	const utilities = layered.filter((r) => r.layer === "utilities");

	const risks = new Map();
	for (const el of document.querySelectorAll("*")) {
		// 이 요소에 걸리는 utilities 규칙이 정한 속성
		const utilProps = new Map();
		for (const r of utilities) {
			let m = false; try { m = el.matches(r.sel); } catch { continue; }
			if (!m) continue;
			if (r.media && !window.matchMedia(r.media).matches) continue;
			for (const p of r.style) utilProps.set(p, { val: r.style.getPropertyValue(p), sel: r.sel });
		}
		if (!utilProps.size) continue;

		// 같은 속성을 unlayered 규칙도 정하고 있으면 → 지금은 unlayered 승, 전환 후 utility 승
		for (const r of unlayered) {
			let m = false; try { m = el.matches(r.sel); } catch { continue; }
			if (!m) continue;
			if (r.media && !window.matchMedia(r.media).matches) continue;
			for (const p of r.style) {
				if (!utilProps.has(p)) continue;
				const g = r.style.getPropertyValue(p);
				const u = utilProps.get(p);
				if (g.trim() === u.val.trim()) continue; // 값이 같으면 뒤집혀도 결과 동일
				const key = `${r.media ? `@media ${r.media} | ` : ""}${r.sel} { ${p}: ${g} }   vs   .${u.sel.replace(/^\./, "")} { ${p}: ${u.val} }`;
				risks.set(key, (risks.get(key) ?? 0) + 1);
			}
		}
	}
	return { risks: [...risks.entries()], utilityRules: utilities.length, unlayeredRules: unlayered.length };
};

const main = async () => {
	const browser = await chromium.launch();
	const agg = new Map();
	let meta = null;
	for (const [vp, width, height] of VIEWPORTS) {
		const ctx = await browser.newContext({ viewport: { width, height } });
		const page = await ctx.newPage();
		for (const route of ROUTES) {
			try {
				await page.goto(BASE + route, { waitUntil: "domcontentloaded", timeout: 60_000 });
				await page.waitForLoadState("load").catch(() => {});
				const r = await page.evaluate(IN_PAGE);
				meta ??= { utilityRules: r.utilityRules, unlayeredRules: r.unlayeredRules };
				for (const [k, n] of r.risks) {
					const key = `[${vp}] ${k}`;
					agg.set(key, (agg.get(key) ?? 0) + n);
				}
			} catch (e) {
				console.log(`  ! ${route} @${vp} — ${e.message.split("\n")[0]}`);
			}
		}
		await ctx.close();
	}
	await browser.close();

	console.log(`utilities 규칙 ${meta?.utilityRules} · unlayered(globals) 규칙 ${meta?.unlayeredRules}\n`);
	console.log(`════ 레이어 전환 시 뒤집힐 지점: ${agg.size}종 ════`);
	if (agg.size === 0) console.log("  ✓ 없음 — globals 를 @layer components 로 옮겨도 화면 변화 없음");
	for (const [k, n] of [...agg.entries()].sort((a, b) => b[1] - a[1])) {
		console.log(`  ${String(n).padStart(4)}개 요소  ${k}`);
	}
};

main();
