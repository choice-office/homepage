"""죽은 코드 탐지 — knip/biome 가 못 보는 영역(CSS 클래스·변수, public 자산, 아이콘 키)을 찾는다.

knip = 미사용 파일/export/의존성, biome = 미사용 변수/import 담당.
여기서는 "정적 분석 도구가 못 보는 문자열 기반 참조"를 훑는다:

  1) globals.css 의 클래스 선택자 중 소스에서 참조되지 않는 것
  2) globals.css 의 CSS 변수 중 아무도 읽지 않는 것
  3) public/ 자산 중 소스·콘텐츠에서 참조되지 않는 것
  4) icon.tsx 아이콘 맵 중 <Icon n="..."/> 로 쓰이지 않는 키

동적 조립(`ds-btn-${variant}`)과 외부 콘텐츠(네이버 원고의 .se-*)는 별도로 표시한다.

  python3 scripts/visual/deadcode.py
"""

import re
import unicodedata
from pathlib import Path

SRC = Path("src")
CSS = SRC / "app" / "globals.css"
PUBLIC = Path("public")

# 블로그 본문(HTML)은 Supabase 에 있고 네이버 원고 마크업을 그대로 쓴다 → 소스에 안 보여도 살아 있다
# 외부/관리자가 만드는 HTML 에 붙는 클래스 — 소스에 문자열로 없어도 살아 있다.
# se-*: 네이버 원고 마크업 · file-embed-link: 관리자 에디터(FileEmbed)의 저장 HTML
EXTERNAL_PREFIXES = ("se-", "prose", "file-embed")
# 라이브러리·프레임워크가 붙이는 클래스(우리 소스에 문자열로 없어도 살아 있음)
FRAMEWORK = {"dark", "group", "peer", "sr-only", "is-visible", "reveal-ready", "page-enter"}


def source_text() -> str:
    parts = []
    for ext in ("*.ts", "*.tsx"):
        for f in SRC.rglob(ext):
            parts.append(f.read_text(encoding="utf-8"))
    for extra in (Path("docs"), Path("scripts")):
        if extra.exists():
            for f in extra.rglob("*"):
                if f.is_file() and f.suffix in (".md", ".mjs", ".py", ".ts", ".json"):
                    parts.append(f.read_text(encoding="utf-8", errors="ignore"))
    return "\n".join(parts)


def css_classes(css: str) -> set[str]:
    # 선택자 부분에서만 .클래스 를 뽑는다(선언 블록 안의 값은 제외)
    names = set()
    depth = 0
    buf = []
    i = 0
    while i < len(css):
        c = css[i]
        if css.startswith("/*", i):
            j = css.find("*/", i)
            i = (j + 2) if j > 0 else len(css)
            continue
        if c == "{":
            sel = "".join(buf)
            if not sel.strip().startswith("@"):
                names.update(re.findall(r"\.(-?[A-Za-z_][\w-]*)", sel))
            buf = []
            depth += 1
        elif c == "}":
            depth -= 1
            buf = []
        elif depth == 0 or True:
            # 블록 안이면 선언이므로 버퍼에 쌓되, '{' 를 만날 때만 선택자로 해석한다
            buf.append(c)
            if c == ";":
                buf = []
        i += 1
    return names


def main() -> None:
    css = CSS.read_text(encoding="utf-8")
    src = source_text()

    # ── 1) 미사용 CSS 클래스 ────────────────────────────────────────────────
    classes = css_classes(css)
    unused, external, dynamic = [], [], []
    for name in sorted(classes):
        if name in FRAMEWORK:
            continue
        if name.startswith(EXTERNAL_PREFIXES):
            if not re.search(rf'["\s.]{re.escape(name)}[\s"\']', src):
                external.append(name)
            continue
        if re.search(rf'[\s"\'`]{re.escape(name)}[\s"\'`]', src) or f'"{name}"' in src:
            continue
        # 접두사 조립 흔적이 있으면 동적 사용으로 본다: ds-btn-primary ← `ds-btn-${variant}`
        head = name.rsplit("-", 1)[0]
        if head and (f"{head}-${{" in src or f'`{head}-' in src):
            dynamic.append(name)
            continue
        unused.append(name)

    print(f"════ 1. globals.css 클래스 {len(classes)}개 중 소스 미참조 ════")
    print(f"  미사용 후보 {len(unused)}개")
    for n in unused:
        print(f"    · .{n}")
    if dynamic:
        print(f"  동적 조립으로 살아 있음 {len(dynamic)}개: {', '.join('.' + d for d in dynamic[:12])}")
    if external:
        print(f"  외부 콘텐츠(네이버 원고 HTML) 대상 {len(external)}개: {', '.join('.' + e for e in external[:12])}")

    # ── 2) 미사용 CSS 변수 ──────────────────────────────────────────────────
    declared = set(re.findall(r"^\s*(--[\w-]+)\s*:", css, re.M))
    read_css = set(re.findall(r"var\((--[\w-]+)", css))
    read_src = set(re.findall(r"(--[\w-]+)", src))
    # @theme inline 로 매핑된 토큰은 Tailwind 유틸리티 이름으로 소비된다(--color-popover → bg-popover).
    # var() 참조가 없어도 유틸리티가 쓰이면 살아 있는 것이므로 별도로 본다.
    theme_alive = set()
    for v in declared:
        util = re.sub(r"^--color-", "", v).lstrip("-")
        if util != v.lstrip("-") and re.search(rf"[\s\"'`:\[-]{re.escape(util)}[\s\"'`\]/]", src):
            theme_alive.add(v)
    unused_vars = sorted(
        v for v in declared if v not in read_css and v not in read_src and v not in theme_alive
    )
    print(f"  (@theme 유틸리티로 소비 중: {len(theme_alive)}개)")
    print(f"\n════ 2. CSS 변수 {len(declared)}개 중 아무도 읽지 않는 것 {len(unused_vars)}개 ════")
    for v in unused_vars:
        print(f"    · {v}")

    # ── 3) 미사용 public 자산 ───────────────────────────────────────────────
    if PUBLIC.exists():
        assets = [p for p in PUBLIC.rglob("*") if p.is_file() and p.name != ".DS_Store"]
        unused_assets = []
        for p in assets:
            # macOS 는 한글 파일명을 NFD(분해형)로 저장한다. 소스는 NFC 라 정규화 없이 비교하면
            # 실제로 쓰는 파일이 전부 '미사용'으로 잡힌다.
            rel = unicodedata.normalize("NFC", "/" + p.relative_to(PUBLIC).as_posix())
            name = unicodedata.normalize("NFC", p.name)
            if rel in src or name in src:
                continue
            unused_assets.append((rel, p.stat().st_size))
        print(f"\n════ 3. public 자산 {len(assets)}개 중 소스 미참조 {len(unused_assets)}개 ════")
        for rel, size in sorted(unused_assets, key=lambda x: -x[1]):
            print(f"    · {rel}  ({size / 1024:.0f} KB)")

    # ── 4) 미사용 아이콘 키 ─────────────────────────────────────────────────
    icon = (SRC / "components" / "site" / "icon.tsx").read_text(encoding="utf-8")
    body = icon.split("const MAP", 1)[-1]
    keys = set(re.findall(r'^\t"?([\w-]+)"?:', body, re.M))
    used_keys = set(re.findall(r'n="([\w-]+)"', src)) | set(re.findall(r'icon: "([\w-]+)"', src))
    used_keys |= set(re.findall(r'"([\w-]+)"\s*,?\s*//', src))
    unused_icons = sorted(k for k in keys if k not in used_keys and f'"{k}"' not in src)
    print(f"\n════ 4. 아이콘 맵 {len(keys)}개 중 미사용 {len(unused_icons)}개 ════")
    for k in unused_icons:
        print(f"    · {k}")


if __name__ == "__main__":
    main()
