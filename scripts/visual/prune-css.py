"""globals.css 에서 지정한 클래스가 붙은 선택자를 제거한다.

deadcode.py 가 찾아낸 "소스·블로그 본문 어디에도 없는 클래스"를 실제로 걷어내는 도구.
선택자 목록(콤마)을 항목 단위로 보고, 죽은 클래스가 들어간 선택자만 지운다.
남은 선택자가 없으면 규칙 블록을 통째로 지운다.

  python3 scripts/visual/prune-css.py --check
  python3 scripts/visual/prune-css.py --write
"""

import re
import sys
from pathlib import Path

CSS = Path("src/app/globals.css")

# 소스(tsx/ts)·docs·scripts·블로그 본문(Supabase 237편) 어디에도 없는 클래스.
# .file-embed-link 는 제외 — 관리자 에디터(choice-admin)의 FileEmbed 가 만드는
# 저장 HTML(div[data-file-embed] > a.file-embed-link)용이라 앞으로 쓰인다.
DEAD = [
    "affiliation-note",
    "affiliations-label",
    "brand-chip",
    "brand-map",
    "header-phone",
    "member-single",
    "profile-reg",
    "profile-tagline",
    "reveal-instant",
    "review-card",
    "review-quote",
    "str-dot",
    "team-grid",
]
DEAD_RE = re.compile(r"\.(" + "|".join(map(re.escape, DEAD)) + r")\b")


def split_selectors(sel: str) -> list[str]:
    """콤마로 나누되 괄호 안의 콤마(:is(), :not() 등)는 무시한다."""
    out, depth, buf = [], 0, []
    for c in sel:
        if c in "([":
            depth += 1
        elif c in ")]":
            depth -= 1
        if c == "," and depth == 0:
            out.append("".join(buf))
            buf = []
            continue
        buf.append(c)
    out.append("".join(buf))
    return out


def prune(css: str) -> tuple[str, list[str]]:
    out, removed = [], []
    i, n = 0, len(css)
    while i < n:
        if css.startswith("/*", i):
            j = css.find("*/", i)
            j = n if j < 0 else j + 2
            out.append(css[i:j])
            i = j
            continue
        if css[i] == "{":
            # 선택자는 직전에 쌓아둔 텍스트 — at-rule 블록은 그대로 흘려보낸다
            out.append(css[i])
            i += 1
            continue
        # 다음 구분자까지 읽어 선택자/선언 판별
        j = i
        while j < n and css[j] not in "{};" and not css.startswith("/*", j):
            j += 1
        chunk = css[i:j]
        if j < n and css[j] == "{" and not chunk.strip().startswith("@"):
            # 규칙 블록 — 본문 끝까지 잘라낸다
            depth, k = 0, j
            while k < n:
                if css[k] == "{":
                    depth += 1
                elif css[k] == "}":
                    depth -= 1
                    if depth == 0:
                        break
                k += 1
            body_end = k + 1
            sels = split_selectors(chunk)
            keep = [s for s in sels if not DEAD_RE.search(s)]
            if not keep:
                removed.append(" ".join(chunk.split())[:80])
                # 규칙 앞의 공백/개행은 남기지 않는다
                while out and out[-1].strip() == "" and "\n" in out[-1]:
                    out.pop()
                i = body_end
                while i < n and css[i] == "\n":
                    i += 1
                continue
            if len(keep) != len(sels):
                dropped = [s for s in sels if DEAD_RE.search(s)]
                removed.append("(선택자만) " + ", ".join(" ".join(d.split()) for d in dropped)[:80])
                out.append(",".join(keep))
                out.append(css[j:body_end])
                i = body_end
                continue
            out.append(css[i:body_end])
            i = body_end
            continue
        out.append(chunk)
        i = j
        if i < n and css[i] in "{};":
            out.append(css[i])
            i += 1
    return "".join(out), removed


def main() -> int:
    css = CSS.read_text(encoding="utf-8")
    new, removed = prune(css)
    print(f"제거 대상 {len(removed)}건 · {len(css.splitlines())}줄 → {len(new.splitlines())}줄")
    for r in removed:
        print(f"    · {r}")
    if "--write" in sys.argv:
        CSS.write_text(new, encoding="utf-8")
        print("작성 완료")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
