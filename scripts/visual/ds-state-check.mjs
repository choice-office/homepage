/** .ds-* 를 @layer components 로 옮긴 뒤, hover/focus 상태의 계산값이
 *  레이어 밖 다른 규칙에 뒤집히지 않는지 확인한다(스크린샷이 못 보는 영역). */
import { chromium } from "playwright";
const BASE = process.env.BASE_URL ?? "http://localhost:3200";
const CASES = [
  ["/contact", "button[type=submit].ds-btn", "hover"],
  ["/contact", "input.ds-field", "focus"],
  ["/contact", "textarea.ds-field", "focus"],
  ["/services", ".ds-card.is-hover", "hover"],
  ["/blog", ".ds-card", "hover"],
  ["/", ".ds-btn-primary", "hover"],
  ["/", ".ds-btn-secondary", "hover"],
];
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
for (const [route, sel, state] of CASES) {
  await p.goto(BASE + route, { waitUntil: "domcontentloaded" });
  await p.waitForLoadState("load").catch(() => {});
  const el = p.locator(sel).first();
  if (!(await el.count())) { console.log(`  - ${route} ${sel} 없음`); continue; }
  const before = await el.evaluate((e) => {
    const c = getComputedStyle(e);
    return { bg: c.backgroundColor, shadow: c.boxShadow, transform: c.transform, border: c.borderColor };
  });
  if (state === "hover") await el.hover(); else await el.focus();
  await p.waitForTimeout(400);
  const after = await el.evaluate((e) => {
    const c = getComputedStyle(e);
    return { bg: c.backgroundColor, shadow: c.boxShadow, transform: c.transform, border: c.borderColor };
  });
  const changed = Object.keys(before).filter((k) => before[k] !== after[k]);
  console.log(`  ${changed.length ? "✓" : "✗ 반응없음"} ${route} ${sel} :${state} → 변한 속성 [${changed.join(", ")}]`);
  for (const k of changed) console.log(`      ${k}: ${before[k]}  →  ${after[k]}`);
}
await b.close();
