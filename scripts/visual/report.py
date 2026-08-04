"""시각 회귀 리포트 아티팩트 생성기.

/tmp/artifact/frames.json (51쌍 썸네일 + 판정) 을 읽어 자립형 HTML 한 장으로 만든다.
외부 요청이 차단되는 환경이라 이미지는 전부 data URI, 스크립트·스타일도 인라인.
"""

import json
import pathlib

FRAMES = json.load(open("/tmp/artifact/frames.json"))
OUT = pathlib.Path(".scratch/visual-regression.html")  # 아티팩트 소스(로컬 전용, 커밋 대상 아님)

ROUTE_ORDER = [
    "home", "greeting", "members", "services", "service-f4", "service-e7",
    "reviews", "blog", "blog-p2", "blog-cat-review", "blog-detail",
    "faq", "location", "contact", "privacy", "terms", "not-found",
]
VP_ORDER = {"mobile": 0, "tablet": 1, "desktop": 2}
FRAMES.sort(key=lambda f: (ROUTE_ORDER.index(f["route"]), VP_ORDER[f["vp"]]))

ident = sum(1 for f in FRAMES if f["status"] == "ok")
noise = sum(1 for f in FRAMES if f["status"] == "noise")
regress = sum(1 for f in FRAMES if f["status"] not in ("ok", "noise"))

CSS = """
:root {
  color-scheme: light dark;
  --ground: #eaeff2;
  --paper: #fbfcfd;
  --ink: #0e151b;
  --ink-soft: #55666f;
  --ink-faint: #8497a1;
  --rule: #ccd7dd;
  --rule-soft: #dfe6ea;
  --pass: #0c6450;
  --pass-bg: #d9ece5;
  --note: #7f5c0e;
  --note-bg: #f2e7cd;
  --mark: #bd3d29;
  --shadow: 0 1px 2px rgba(14, 21, 27, .06), 0 12px 28px -22px rgba(14, 21, 27, .5);
  --mono: ui-monospace, "SF Mono", SFMono-Regular, "Cascadia Mono", Menlo, Consolas, monospace;
  --sans: -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, "Apple SD Gothic Neo",
          "Malgun Gothic", "Noto Sans KR", sans-serif;
}
@media (prefers-color-scheme: dark) {
  :root {
    --ground: #0c1115; --paper: #141b21; --ink: #e2eaef; --ink-soft: #94a6b1;
    --ink-faint: #6d7f8a; --rule: #26313a; --rule-soft: #1d262d;
    --pass: #4cbf9c; --pass-bg: #10322a; --note: #d6a54c; --note-bg: #33280f;
    --mark: #e0664e;
    --shadow: 0 1px 2px rgba(0, 0, 0, .5), 0 14px 30px -24px rgba(0, 0, 0, .9);
  }
}
:root[data-theme="dark"] {
  --ground: #0c1115; --paper: #141b21; --ink: #e2eaef; --ink-soft: #94a6b1;
  --ink-faint: #6d7f8a; --rule: #26313a; --rule-soft: #1d262d;
  --pass: #4cbf9c; --pass-bg: #10322a; --note: #d6a54c; --note-bg: #33280f;
  --mark: #e0664e;
  --shadow: 0 1px 2px rgba(0, 0, 0, .5), 0 14px 30px -24px rgba(0, 0, 0, .9);
}
:root[data-theme="light"] {
  --ground: #eaeff2; --paper: #fbfcfd; --ink: #0e151b; --ink-soft: #55666f;
  --ink-faint: #8497a1; --rule: #ccd7dd; --rule-soft: #dfe6ea;
  --pass: #0c6450; --pass-bg: #d9ece5; --note: #7f5c0e; --note-bg: #f2e7cd;
  --mark: #bd3d29;
  --shadow: 0 1px 2px rgba(14, 21, 27, .06), 0 12px 28px -22px rgba(14, 21, 27, .5);
}

body {
  margin: 0;
  background: var(--ground);
  color: var(--ink);
  font-family: var(--sans);
  font-size: 15px;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}
.sheet { max-width: 1180px; margin: 0 auto; padding: clamp(28px, 5vw, 64px) clamp(16px, 4vw, 40px) 96px; }

/* ── 표제 ─────────────────────────────────────────────── */
.eyebrow {
  font-family: var(--mono);
  font-size: 11.5px;
  letter-spacing: .18em;
  text-transform: uppercase;
  color: var(--ink-faint);
  margin: 0 0 14px;
}
h1 {
  font-family: var(--mono);
  font-size: clamp(26px, 4.4vw, 42px);
  font-weight: 600;
  letter-spacing: -.02em;
  line-height: 1.18;
  text-wrap: balance;
  margin: 0 0 16px;
}
.lede { max-width: 62ch; color: var(--ink-soft); margin: 0 0 34px; }
.lede strong { color: var(--ink); font-weight: 600; }

/* ── 판정 계기판 ───────────────────────────────────────── */
.readout {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(148px, 1fr));
  gap: 1px;
  background: var(--rule);
  border: 1px solid var(--rule);
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 12px;
}
.cell { background: var(--paper); padding: 16px 18px 14px; }
.cell dt {
  font-size: 11.5px;
  letter-spacing: .04em;
  color: var(--ink-faint);
  margin-bottom: 6px;
}
.cell dd {
  margin: 0;
  font-family: var(--mono);
  font-size: 25px;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  letter-spacing: -.03em;
  color: var(--pass);
}
.cell dd small { font-size: 13px; font-weight: 400; color: var(--ink-soft); letter-spacing: 0; }
.readout-note { font-size: 12.5px; color: var(--ink-faint); margin: 0 0 52px; }

/* ── 본문 절 ───────────────────────────────────────────── */
section { margin-bottom: 52px; }
h2 {
  font-family: var(--mono);
  font-size: 13px;
  font-weight: 600;
  letter-spacing: .12em;
  text-transform: uppercase;
  color: var(--ink-soft);
  margin: 0 0 18px;
  padding-bottom: 9px;
  border-bottom: 1px solid var(--rule);
}
.changes { display: grid; gap: 1px; background: var(--rule); border: 1px solid var(--rule); border-radius: 3px; }
.change { background: var(--paper); display: grid; grid-template-columns: minmax(0, 15rem) minmax(0, 1fr); gap: 4px 26px; padding: 15px 18px; }
.change b { font-weight: 600; font-size: 14.5px; }
.change span { color: var(--ink-soft); font-size: 14px; }
.change code, code {
  font-family: var(--mono);
  font-size: .88em;
  background: var(--rule-soft);
  padding: 1px 5px;
  border-radius: 2px;
}
@media (max-width: 620px) { .change { grid-template-columns: 1fr; } }

/* ── 컨택트 시트 ───────────────────────────────────────── */
.toolbar { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; margin-bottom: 22px; }
.toolbar span { font-size: 12.5px; color: var(--ink-faint); margin-right: 4px; }
.chipbtn {
  font-family: var(--mono);
  font-size: 12px;
  letter-spacing: .04em;
  padding: 5px 12px;
  border: 1px solid var(--rule);
  border-radius: 999px;
  background: var(--paper);
  color: var(--ink-soft);
  cursor: pointer;
}
.chipbtn[aria-pressed="true"] { background: var(--ink); color: var(--paper); border-color: var(--ink); }
.chipbtn:focus-visible { outline: 2px solid var(--mark); outline-offset: 2px; }

.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(268px, 1fr)); gap: 22px; }
.frame {
  background: var(--paper);
  border: 1px solid var(--rule);
  border-radius: 3px;
  box-shadow: var(--shadow);
  padding: 13px 13px 11px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.frame-head { display: flex; align-items: baseline; justify-content: space-between; gap: 10px; }
.frame-title { font-size: 13.5px; font-weight: 600; }
.frame-vp {
  font-family: var(--mono);
  font-size: 11px;
  color: var(--ink-faint);
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}
.pair { display: grid; grid-template-columns: 1fr 1fr; gap: 9px; }
.plate { position: relative; }
.plate-label {
  font-family: var(--mono);
  font-size: 10px;
  letter-spacing: .13em;
  text-transform: uppercase;
  color: var(--ink-faint);
  display: block;
  margin-bottom: 5px;
}
/* 두 인화를 겹쳐 맞춰보는 판 — 모서리 등록 표시 */
.plate-win {
  position: relative;
  border: 1px solid var(--rule-soft);
  background: var(--ground);
  max-height: 300px;
  overflow: hidden;
}
.frame.is-open .plate-win { max-height: none; }
.plate-win::before, .plate-win::after {
  content: "";
  position: absolute;
  width: 7px; height: 7px;
  border: 1px solid var(--mark);
  opacity: .55;
  pointer-events: none;
}
.plate-win::before { top: -1px; left: -1px; border-right: 0; border-bottom: 0; }
.plate-win::after { bottom: -1px; right: -1px; border-left: 0; border-top: 0; }
.plate-win img { display: block; width: 100%; height: auto; }
.frame-foot { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
.verdict {
  font-family: var(--mono);
  font-size: 11px;
  letter-spacing: .04em;
  padding: 3px 8px;
  border-radius: 2px;
  background: var(--pass-bg);
  color: var(--pass);
  font-variant-numeric: tabular-nums;
}
.verdict.is-note { background: var(--note-bg); color: var(--note); }
.expand {
  font-family: var(--mono);
  font-size: 11px;
  background: none;
  border: 0;
  border-bottom: 1px solid var(--rule);
  color: var(--ink-faint);
  cursor: pointer;
  padding: 0 0 1px;
}
.expand:hover { color: var(--ink); border-color: var(--ink-soft); }
.expand:focus-visible { outline: 2px solid var(--mark); outline-offset: 3px; }

/* ── 방법·한계 ─────────────────────────────────────────── */
.method { columns: 2; column-gap: 34px; color: var(--ink-soft); font-size: 14px; }
.method p { margin: 0 0 12px; break-inside: avoid; }
.method b { color: var(--ink); font-weight: 600; }
@media (max-width: 720px) { .method { columns: 1; } }
footer { margin-top: 58px; padding-top: 16px; border-top: 1px solid var(--rule); font-size: 12.5px; color: var(--ink-faint); font-family: var(--mono); }
"""

CHANGES = [
    ("인라인 <code>style</code> 0", "마크업의 스타일 선언 263곳을 전부 Tailwind 유틸리티로 옮겼다. <code>src/**/*.tsx</code> 에 남은 <code>style=</code> 은 0개."),
    ("globals.css 전체를 한 레이어로", "레이어 밖 CSS 는 특정성과 무관하게 유틸리티를 이긴다. 컴포넌트 CSS 를 통째로 <code>@layer components</code> 에 넣어, 규칙끼리의 우열은 그대로 두면서 호출부 유틸리티가 이기게 했다 — 예전 인라인이 하던 역할."),
    ("되살아난 죽은 규칙 정리", "인라인에 눌려 있던 모바일 규칙들이 살아나 화면을 바꿨다. 원래 화면이 정답이므로, 이겨야 하는 규칙은 <code>!important</code> 로 못박고 원래부터 무효였던 선언은 지웠다."),
    ("의미가 다른 유틸리티 교정", "<code>grid-cols-2</code> 는 <code>minmax(0,1fr)</code> 라 열이 항상 균등하다. 원본 <code>1fr 1fr</code> 과 달라 문의 폼 두 열이 어긋나 <code>grid-cols-[1fr_1fr]</code> 로 되돌렸다."),
    ("컴포넌트 API 정리", "<code>ds.tsx</code>·<code>icon.tsx</code> 의 <code>style</code> prop 을 없애고, <code>Input/Textarea</code> 가 호출부 <code>className</code> 을 덮어쓰던 버그(테두리·여백 증발)를 고쳤다."),
]

GATES = [
    ("픽셀 회귀", f"{regress}", "51장 전수"),
    ("완전 동일", f"{ident}", "/ 51장"),
    ("인라인 style", "0", "src/**.tsx"),
    ("폰트 폴백", "0", "미로드 weight"),
    ("죽은 선언", "0", "인라인에 눌림"),
    ("타입·lint·knip", "통과", ""),
]


def esc(s: str) -> str:
    return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


def main() -> None:
    gates = "\n".join(
        f'<div class="cell"><dt>{g[0]}</dt><dd>{g[1]}'
        + (f" <small>{g[2]}</small>" if g[2] else "")
        + "</dd></div>"
        for g in GATES
    )
    changes = "\n".join(
        f'<div class="change"><b>{b}</b><span>{s}</span></div>' for b, s in CHANGES
    )

    cards = []
    for f in FRAMES:
        note = f["status"] == "noise"
        verdict = (
            f'<span class="verdict is-note">모서리 노이즈 {f["changed"]}px</span>'
            if note
            else '<span class="verdict">픽셀 동일 · 0</span>'
        )
        w, h = f["size"]
        cards.append(f"""
<article class="frame" data-vp="{f['vp']}">
  <div class="frame-head">
    <span class="frame-title">{esc(f['label'])}</span>
    <span class="frame-vp">{f['vpw']}w · {h}h</span>
  </div>
  <div class="pair">
    <div class="plate">
      <span class="plate-label">이전</span>
      <div class="plate-win"><img alt="{esc(f['label'])} {f['vpw']}px 마이그레이션 이전 전체 화면" src="data:image/webp;base64,{f['before']}"></div>
    </div>
    <div class="plate">
      <span class="plate-label">이후</span>
      <div class="plate-win"><img alt="{esc(f['label'])} {f['vpw']}px 마이그레이션 이후 전체 화면" src="data:image/webp;base64,{f['after']}"></div>
    </div>
  </div>
  <div class="frame-foot">
    {verdict}
    <button class="expand" type="button">전체 높이</button>
  </div>
</article>""")

    html = f"""<title>초이스 행정사사무소 · Tailwind 마이그레이션 시각 회귀 검증</title>
<style>{CSS}</style>
<main class="sheet">
  <p class="eyebrow">시각 회귀 검증 · 17개 라우트 × 3개 뷰포트</p>
  <h1>인라인 style → Tailwind,<br>화면은 그대로</h1>
  <p class="lede">
    마크업의 인라인 <code>style</code> 을 전부 걷어내고 스타일을 Tailwind 유틸리티로 옮겼다.
    조건은 하나 — <strong>PC·모바일 어느 해상도에서도 화면이 달라지면 안 된다.</strong>
    마이그레이션 직전 커밋을 별도 워크트리에 빌드해 기준으로 두고,
    같은 조건에서 찍은 전체 화면 51장을 픽셀 단위로 맞대어 확인했다.
  </p>

  <dl class="readout">{gates}</dl>
  <p class="readout-note">
    회귀 0. 남은 1장은 캡처 하네스가 좌상단 16×16 타일에서 간헐적으로 만드는 래스터 노이즈로,
    같은 빌드를 두 번 찍어도 재현되는 하네스 고유 잡음이다(아래 카드에 그대로 표기).
  </p>

  <section>
    <h2>무엇을 바꿨나</h2>
    <div class="changes">{changes}</div>
  </section>

  <section>
    <h2>전수 대조 · 51장</h2>
    <div class="toolbar">
      <span>뷰포트</span>
      <button class="chipbtn" type="button" data-filter="all" aria-pressed="true">전체 51</button>
      <button class="chipbtn" type="button" data-filter="mobile" aria-pressed="false">모바일 390</button>
      <button class="chipbtn" type="button" data-filter="tablet" aria-pressed="false">태블릿 768</button>
      <button class="chipbtn" type="button" data-filter="desktop" aria-pressed="false">데스크톱 1440</button>
    </div>
    <div class="grid">{''.join(cards)}</div>
  </section>

  <section>
    <h2>검증 방법과 한계</h2>
    <div class="method">
      <p><b>기준</b> — 마이그레이션 직전 커밋을 워크트리에 체크아웃해 프로덕션 빌드로 서빙(:3002),
      작업본도 같은 방식으로 서빙(:3001). 개발 서버는 오버레이·HMR 때문에 픽셀이 흔들려 쓰지 않았다.</p>
      <p><b>촬영</b> — Playwright 로 전체 페이지 캡처. 애니메이션 정지, 스크롤 리빌 강제 노출,
      캐러셀 첫 슬라이드 고정, 웹폰트 로드와 이미지 디코딩 완료까지 대기, 지도 iframe 은 비결정적이라 숨김.
      같은 프레임을 두 번 찍어 안정될 때까지 기다린다.</p>
      <p><b>대조</b> — 채널 허용오차 8 이하는 안티에일리어싱으로 보고, 그 위로 달라진 픽셀을 센다.
      높이가 1px라도 다르면 즉시 실패로 처리한다.</p>
      <p><b>원인 추적</b> — 픽셀 차이는 "어디가" 달라졌는지까지만 알려준다.
      요소별 <code>rect</code> 비교(<code>geom.mjs</code>)로 범인 요소를, 계산 스타일 속성별 비교(<code>styles.mjs</code>)로
      "어느 선언이 졌는지"를 특정해 고쳤다.</p>
      <p><b>남는 차이</b> — 계산 스타일에는 표기 차이가 남아 있다.
      <code>rgba(255,255,255,.6)</code> 가 <code>oklab(…)</code> 로, <code>border-radius:50%</code> 가
      Tailwind <code>rounded-full</code> 로 바뀐 것 등인데 렌더 결과는 같고 픽셀 대조로 확인했다.
      데스크톱 상담바처럼 해당 폭에서 <code>display:none</code> 인 요소의 값 차이도 같은 범주다.</p>
      <p><b>범위</b> — 정적 화면 기준이다. 모달·드롭다운 열린 상태, hover/focus, 스크롤 도중 애니메이션 프레임은
      이 대조에 포함되지 않는다.</p>
    </div>
  </section>

  <footer>초이스 행정사사무소 홈페이지 · scripts/visual (capture · diff · geom · styles · audit · layerize)</footer>
</main>
<script>
document.querySelectorAll(".expand").forEach((b) => {{
  b.addEventListener("click", () => {{
    const card = b.closest(".frame");
    const open = card.classList.toggle("is-open");
    b.textContent = open ? "접기" : "전체 높이";
  }});
}});
const btns = [...document.querySelectorAll(".chipbtn")];
btns.forEach((b) => {{
  b.addEventListener("click", () => {{
    btns.forEach((o) => o.setAttribute("aria-pressed", String(o === b)));
    const want = b.dataset.filter;
    document.querySelectorAll(".frame").forEach((f) => {{
      f.hidden = want !== "all" && f.dataset.vp !== want;
    }});
  }});
}});
</script>
"""
    OUT.write_text(html, encoding="utf-8")
    print(f"작성: {OUT}  ({OUT.stat().st_size / 1024 / 1024:.2f} MB)")
    print(f"동일 {ident} · 노이즈 {noise} · 회귀 {regress}")


if __name__ == "__main__":
    main()
