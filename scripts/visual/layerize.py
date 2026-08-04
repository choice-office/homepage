"""globals.css 의 컴포넌트 CSS 전체를 하나의 @layer components 로 감싼다.

왜 필요한가
-----------
Tailwind 유틸리티는 @layer utilities 안에 있다. 레이어에 속하지 않은 CSS 는 특정성과 무관하게
레이어 안의 CSS 를 항상 이긴다. 그래서 지금까지는 globals.css 의 규칙을 이길 방법이 인라인
style 뿐이었고, 인라인을 걷어내는 순간 그 자리가 조용히 죽는다(반응형 규칙이 되살아난다).

전체를 한 레이어에 넣으면
  - globals 규칙끼리의 우열은 그대로다(같은 레이어 → 특정성·순서 규칙이 이전과 동일).
  - 유틸리티는 globals 를 항상 이긴다 = 예전 인라인이 하던 역할을 그대로 물려받는다.

레이어 밖에 남기는 것: @import / @theme / @custom-variant / @utility / @layer base /
@keyframes / 전역 스크롤바 리셋 / :root · .dark (변수 선언).

  python3 scripts/visual/layerize.py --check   # 미리보기
  python3 scripts/visual/layerize.py --write
"""

import re
import sys
from pathlib import Path

SRC = Path("src/app/globals.css")

# 레이어 밖에 남길 선택자(변수 선언과 전역 리셋 — 유틸리티와 경쟁하지 않는다)
KEEP_OUTSIDE_SELECTORS = {"*", ":root", ".dark"}
# .prose 계열은 '본문 조판' 이라 호출부 유틸리티(text-sm, mt-3 …)를 이겨야 한다.
# (Tailwind typography 도 같은 규약 — 벗어나려면 not-prose 를 쓴다.) 그래서 레이어 밖에 둔다.
KEEP_OUTSIDE_PREFIX = ("::-webkit-scrollbar", ".prose", ".blog-prose")
KEEP_OUTSIDE_ATRULES = {"@import", "@theme", "@custom-variant", "@utility", "@keyframes"}

SKIP_WS = re.compile(r"\s+|/\*.*?\*/", re.S)


def top_level_items(css: str):
    """최상위 항목을 (텍스트, 헤드, 선택자) 로 잘라낸다. 앞의 공백·주석은 항목에 붙여 보존."""
    i, n = 0, len(css)
    out = []
    pending = ""
    while i < n:
        m = SKIP_WS.match(css, i)
        if m:
            pending += css[i : m.end()]
            i = m.end()
            continue
        start = i
        head = re.match(r"@[-\w]+", css[i:])
        head = head.group(0) if head else None
        j, depth, end = i, 0, None
        while j < n:
            c = css[j]
            if c == "{":
                depth += 1
            elif c == "}":
                depth -= 1
                if depth == 0:
                    end = j + 1
                    break
            elif c == ";" and depth == 0:
                end = j + 1
                break
            j += 1
        end = end or n
        text = css[start:end]
        sel = text.split("{")[0].strip()
        out.append((pending, text, head, sel))
        pending = ""
        i = end
    if pending:
        out.append((pending, "", None, ""))
    return out


def keep_outside(head: str | None, sel: str) -> bool:
    if head in KEEP_OUTSIDE_ATRULES:
        return True
    if head == "@layer" and sel.startswith("@layer base"):
        return True
    if head:
        return False
    s = sel.strip()
    return s in KEEP_OUTSIDE_SELECTORS or s.startswith(KEEP_OUTSIDE_PREFIX)


def unwrap_components(text: str) -> str:
    """@layer components 래퍼를 (중첩된 것까지) 벗겨 같은 레이어에 합류시킨다.

    @media 안에 중첩된 @layer components 를 그대로 두고 바깥을 또 감싸면 components.components
    하위 레이어가 되어 부모 레이어 규칙에 져버린다 — 실제로 .wrap 미디어 규칙이 이 함정에 걸렸다.
    """
    pat = re.compile(r"@layer\s+components\s*\{")
    while True:
        m = pat.search(text)
        if not m:
            return text
        i, j = m.start(), m.end() - 1
        depth, k = 0, j
        while k < len(text):
            if text[k] == "{":
                depth += 1
            elif text[k] == "}":
                depth -= 1
                if depth == 0:
                    break
            k += 1
        text = text[:i] + text[j + 1 : k] + text[k + 1 :]


def split_root(media_text: str):
    """@media 블록을 (:root/.dark 만 담은 블록, 나머지 블록) 으로 쪼갠다. 없으면 (None, None)."""
    head, _, body = media_text.partition("{")
    body = body.rstrip()
    assert body.endswith("}")
    body = body[:-1]
    kept, rest = [], []
    i, n = 0, len(body)
    pending = ""
    while i < n:
        m = SKIP_WS.match(body, i)
        if m:
            pending += body[i : m.end()]
            i = m.end()
            continue
        j, depth, end = i, 0, None
        while j < n:
            c = body[j]
            if c == "{":
                depth += 1
            elif c == "}":
                depth -= 1
                if depth == 0:
                    end = j + 1
                    break
            elif c == ";" and depth == 0:
                end = j + 1
                break
            j += 1
        end = end or n
        chunk = body[i:end]
        sel = chunk.split("{")[0].strip()
        (kept if sel in (":root", ".dark") else rest).append(pending + chunk)
        pending = ""
        i = end
    if not kept:
        return None, None
    return (
        head + "{\n" + "".join(kept).strip("\n") + "\n}\n",
        head + "{\n" + "".join(rest).strip("\n") + "\n}\n" if "".join(rest).strip() else "",
    )

def main() -> int:
    css = SRC.read_text(encoding="utf-8")
    if "@layer components {\n\t.section" in css or "\n@layer components {\n\t/*" in css:
        pass  # 이미 일부만 감싼 상태여도 아래 로직이 흡수한다

    items = top_level_items(css)
    outside, inside = [], []
    for pending, text, head, sel in items:
        if not text:
            outside.append(pending)
            continue
        if keep_outside(head, sel):
            outside.append(pending + text)
        elif head == "@media":
            # 미디어 블록 안의 :root(변수 재정의)는 레이어 밖으로 빼낸다.
            # 기본 :root 가 레이어 밖에 있으므로, 재정의만 레이어에 들어가면 레이어 없는 기본값에
            # 져서 조용히 무효가 된다(모바일 타이포 스케일이 통째로 죽는 사고).
            var_part, rest = split_root(text)
            if var_part:
                outside.append(pending + var_part)
                if rest:
                    inside.append("\n" + unwrap_components(rest))
            else:
                inside.append(pending + unwrap_components(text))
        else:
            inside.append(pending + unwrap_components(text))

    n_in = sum(1 for p, t, h, s in items if t and not keep_outside(h, s))
    n_out = sum(1 for p, t, h, s in items if t and keep_outside(h, s))
    print(f"레이어 안: {n_in}항목 · 레이어 밖 유지: {n_out}항목")

    if "--check" in sys.argv:
        return 0

    body = "".join(inside).strip("\n")
    out = (
        "".join(outside).rstrip()
        + "\n\n/* ── 이하 전부 @layer components ────────────────────────────────────────────\n"
        "   레이어 밖 CSS 는 특정성과 무관하게 Tailwind 유틸리티(@layer utilities)를 항상 이긴다.\n"
        "   그래서 예전에는 인라인 style 로만 이 규칙들을 덮을 수 있었고, 인라인을 걷어내면\n"
        "   덮여 있던 반응형 규칙이 되살아나 화면이 바뀌었다. 전부 같은 레이어에 넣으면\n"
        "   규칙끼리의 우열은 그대로 두면서(같은 레이어 → 특정성·순서) 호출부 유틸리티가 이긴다.\n"
        "   ※ 새 CSS 를 추가할 때도 반드시 이 블록 안에 넣을 것. */\n"
        "@layer components {\n" + body + "\n}\n"
    )
    SRC.write_text(out, encoding="utf-8")
    print(f"작성 완료: {SRC}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
