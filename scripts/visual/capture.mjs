/**
 * 시각 회귀 캡처 — 마이그레이션 전/후를 같은 조건으로 촬영한다.
 *
 * 결정성이 전부다. 애니메이션·캐러셀·lazy 로딩을 그대로 두면 같은 코드로 두 번 찍어도
 * 픽셀이 달라져 diff 가 무의미해진다. 아래 FREEZE_CSS + 대기 로직으로 상태를 고정한다.
 *
 *   node scripts/visual/capture.mjs before
 *   node scripts/visual/capture.mjs after
 */
import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const BASE = process.env.BASE_URL ?? "http://localhost:3001";
const label = process.argv[2];
if (!label) {
	console.error("사용법: node scripts/visual/capture.mjs <before|after>");
	process.exit(1);
}
const OUT = path.resolve("scripts/visual/shots", label);

const ROUTES = [
	["home", "/"],
	["greeting", "/greeting"],
	["members", "/members"],
	["services", "/services"],
	["service-f4", "/services/f4"],
	["service-e7", "/services/e7"],
	["reviews", "/reviews"],
	["blog", "/blog"],
	["blog-p2", "/blog?page=2"],
	["blog-cat-review", "/blog?category=review"],
	["blog-detail", "/blog/한국여권-부정사용-범칙금-시민권-취득"],
	["faq", "/faq"],
	["location", "/location"],
	["contact", "/contact"],
	["privacy", "/privacy"],
	["terms", "/terms"],
	["not-found", "/__no-such-page__"],
];

const VIEWPORTS = [
	["mobile", 390, 844],
	["tablet", 768, 1024],
	["desktop", 1440, 900],
];

/** 모든 움직임을 0초로 고정 + 캐러셀을 첫 슬라이드로 못박는다 */
const FREEZE_CSS = `
*, *::before, *::after {
  animation-duration: 0s !important;
  animation-delay: 0s !important;
  animation-iteration-count: 1 !important;
  animation-play-state: paused !important;
  transition-duration: 0s !important;
  transition-delay: 0s !important;
  caret-color: transparent !important;
}
/* 스크롤 리빌 요소를 모두 '보임' 상태로 — 스크롤 타이밍에 따른 흔들림 제거 */
[data-reveal], [data-stagger] > *, [data-reveal] * {
  opacity: 1 !important;
  transform: none !important;
  filter: none !important;
}
/* 마퀴/스윕 정지 */
.shine::after { display: none !important; }
/* 서드파티 iframe(구글맵)은 로드마다 타일이 달라 픽셀 비교가 불가능하다.
   visibility 로 감추면 레이아웃(높이)은 그대로 유지되므로 회귀 검증에는 영향 없다. */
iframe { visibility: hidden !important; }
`;

const settle = async (page) => {
	// 1) 폰트 로딩 완료 — 폰트가 늦게 붙으면 텍스트 폭이 달라진다
	await page.evaluate(() => document.fonts.ready);
	// 2) 전체를 훑어 lazy 이미지를 모두 트리거
	await page.evaluate(async () => {
		const step = Math.floor(window.innerHeight * 0.9);
		for (let y = 0; y < document.body.scrollHeight; y += step) {
			window.scrollTo(0, y);
			await new Promise((r) => requestAnimationFrame(() => setTimeout(r, 20)));
		}
		window.scrollTo(0, 0);
		await new Promise((r) => setTimeout(r, 100));
	});
	// 3) 이미지 디코드 대기 — 응답이 끝내 안 오는 요청이 하나라도 있으면 영원히 멈추므로 반드시 상한을 둔다
	await page.evaluate(async () => {
		const withTimeout = (pr, ms) =>
			Promise.race([pr, new Promise((r) => setTimeout(r, ms))]);
		// img.complete 는 '내려받음'일 뿐 '그릴 수 있음'이 아니다. decode() 까지 기다려야
		// 큰 이미지의 좌상단 일부만 그려진 상태로 촬영되는 편차가 사라진다.
		await withTimeout(
			Promise.all(
				[...document.images].map(async (img) => {
					if (!img.complete) {
						await new Promise((r) => {
							img.addEventListener("load", r, { once: true });
							img.addEventListener("error", r, { once: true });
						});
					}
					await img.decode?.().catch(() => {});
				}),
			),
			8000,
		);
	});
	// 4) 캐러셀을 첫 슬라이드로 고정(embla 는 transform 으로 이동)
	await page.evaluate(() => {
		for (const el of document.querySelectorAll(".embla__container, [class*='str-track']")) {
			el.style.transform = "translate3d(0px, 0px, 0px)";
		}
	});
	// 포커스 링(스킵 링크 등) 편차 제거 후 두 프레임 기다려 페인트를 확정한다
	await page.evaluate(async () => {
		document.activeElement instanceof HTMLElement && document.activeElement.blur();
		await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
	});
	await page.waitForTimeout(120);
};

/** 첫 요청은 ISR 생성·Supabase 조회 비용이 붙는다. 미리 한 번 훑어 서버를 데워
 *  캡처 패스에서 그 비용을 제거한다(느려서가 아니라, 타이밍 편차를 줄이려는 목적). */
const warmup = async () => {
	await Promise.all(
		ROUTES.map(([, route]) =>
			fetch(BASE + route).catch(() => {}),
		),
	);
};

const main = async () => {
	await mkdir(OUT, { recursive: true });
	await warmup();
	const browser = await chromium.launch();
	const results = [];

	for (const [vpName, width, height] of VIEWPORTS) {
		const ctx = await browser.newContext({
			viewport: { width, height },
			deviceScaleFactor: 1,
			reducedMotion: "reduce",
			colorScheme: "light",
			locale: "ko-KR",
			timezoneId: "Asia/Seoul",
		});
		await ctx.addInitScript(() => {
			// 시간 의존 렌더(카운트업 등) 고정
			Math.random = () => 0.42;
		});
		const page = await ctx.newPage();
		await page.addStyleTag({ content: FREEZE_CSS }).catch(() => {});

		for (const [name, route] of ROUTES) {
			const file = path.join(OUT, `${name}__${vpName}.png`);
			const t0 = Date.now();
			try {
				// networkidle 금지 — Next dev 의 HMR 웹소켓이 계속 열려 있어 영원히 idle 이 안 된다
				await Promise.race([
					(async () => {
						await page.goto(BASE + route, { waitUntil: "domcontentloaded", timeout: 60_000 });
						await page.waitForLoadState("load").catch(() => {});
						await page.addStyleTag({ content: FREEZE_CSS });
						await settle(page);
						// fullPage 는 뷰포트 밖 영역을 타일 합성한다. 첫 촬영 때 아직 래스터되지 않은
						// 타일이 섞여 좌상단에 16px 편차가 생기므로, 한 번 버리고 두 번째를 저장한다.
						await page.screenshot({ fullPage: true });
						await page.waitForTimeout(180);
						await page.screenshot({ path: file, fullPage: true });
					})(),
					new Promise((_, rej) => setTimeout(() => rej(new Error("route timeout 75s")), 75_000)),
				]);
				results.push(`  ✓ ${name} / ${vpName}  ${Date.now() - t0}ms`);
			} catch (e) {
				results.push(`  ✗ ${name} / ${vpName} — ${e.message.split("\n")[0]}`);
			}
		}
		await ctx.close();
	}
	await browser.close();
	console.log(results.join("\n"));
	console.log(`\n${label}: ${results.filter((r) => r.startsWith("  ✓")).length}장 저장 → ${OUT}`);
};

main();
