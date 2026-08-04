"""인라인 style={{...}} → Tailwind 유틸리티 변환기.

들여쓰기·줄바꿈에 의존하지 않는다. style 속성의 중괄호를 균형 맞춰 잘라내고
CSS-in-JS 프로퍼티를 파싱해 1:1 로 클래스에 매핑한다. 값이 하나라도 매핑표에
없으면 그 블록은 건드리지 않고 보고만 한다(= 사람이 판단할 것만 남긴다).

같은 JSX 태그에 className 이 이미 있으면 거기에 합친다(중복 속성 방지).

  /tmp/naverenv/bin/python scripts/visual/style-to-tw.py <파일...>          # 미리보기
  /tmp/naverenv/bin/python scripts/visual/style-to-tw.py --write <파일...>  # 적용
"""

import re
import sys
from pathlib import Path

PX = lambda v: f"{v}px" if re.fullmatch(r"-?\d+(\.\d+)?", str(v)) else arb(str(v))


def arb(v: str) -> str:
    """임의값 안의 공백은 _ 로 (Tailwind 문법)"""
    return str(v).strip().replace(" ", "_")


WEIGHT = {"400": "font-normal", "500": "font-medium", "600": "font-semibold",
          "700": "font-bold", "800": "font-extrabold", "900": "font-black"}
ALIGN = {"center": "items-center", "flex-start": "items-start", "flex-end": "items-end",
         "stretch": "items-stretch", "baseline": "items-baseline"}
JUSTIFY = {"center": "justify-center", "space-between": "justify-between",
           "flex-start": "justify-start", "flex-end": "justify-end", "space-around": "justify-around"}
DISPLAY = {"flex": "flex", "inline-flex": "inline-flex", "block": "block", "inline-block": "inline-block",
           "grid": "grid", "none": "hidden", "inline": "inline"}
SIDE = {"Top": "t", "Right": "r", "Bottom": "b", "Left": "l"}


def color_cls(prefix: str, v: str) -> str:
    if v == "#fff" or v == "#ffffff":
        return "text-white" if prefix == "text" else f"{prefix}-white"
    if v.startswith("var("):
        return f"{prefix}-[color:{v}]" if prefix == "text" else f"{prefix}-[{v}]"
    return f"{prefix}-[{arb(v)}]"


def convert(prop: str, v: str):
    """(prop, value) → 클래스 문자열 또는 None(매핑 실패)"""
    num = re.fullmatch(r"-?\d+(\.\d+)?", v)

    if prop == "display":
        return DISPLAY.get(v)
    if prop == "position":
        return v if v in ("relative", "absolute", "fixed", "sticky", "static") else None
    if prop == "alignItems":
        return ALIGN.get(v)
    if prop == "justifyContent":
        return JUSTIFY.get(v)
    if prop == "flexDirection":
        return {"column": "flex-col", "row": "flex-row", "column-reverse": "flex-col-reverse"}.get(v)
    if prop == "flexWrap":
        return {"wrap": "flex-wrap", "nowrap": "flex-nowrap"}.get(v)
    if prop in ("gap", "rowGap", "columnGap"):
        p = {"gap": "gap", "rowGap": "gap-y", "columnGap": "gap-x"}[prop]
        return f"{p}-[{PX(v)}]"
    if prop == "flex":
        return {"0 0 auto": "flex-none", "1": "flex-1", "1 1 auto": "flex-auto"}.get(v, f"flex-[{arb(v)}]")
    if prop in ("margin", "padding"):
        p = "m" if prop == "margin" else "p"
        parts = v.split()
        if v == "0 auto":
            return "mx-auto" if p == "m" else None
        if len(parts) == 1:
            return f"{p}-[{PX(parts[0])}]"
        if len(parts) == 2:
            return f"{p}y-[{PX(parts[0])}] {p}x-[{PX(parts[1])}]"
        if len(parts) == 3:
            return f"{p}t-[{PX(parts[0])}] {p}x-[{PX(parts[1])}] {p}b-[{PX(parts[2])}]"
        if len(parts) == 4:
            return f"{p}t-[{PX(parts[0])}] {p}r-[{PX(parts[1])}] {p}b-[{PX(parts[2])}] {p}l-[{PX(parts[3])}]"
        return None
    m = re.fullmatch(r"(margin|padding)(Top|Right|Bottom|Left)", prop)
    if m:
        p = "m" if m.group(1) == "margin" else "p"
        return f"{p}{SIDE[m.group(2)]}-[{PX(v)}]"
    if prop == "fontSize":
        return f"text-[{PX(v)}]"
    if prop == "fontWeight":
        return WEIGHT.get(v)
    if prop == "lineHeight":
        return f"[line-height:{arb(v)}]"
    if prop == "letterSpacing":
        return f"tracking-[{arb(v)}]"
    if prop == "color":
        return color_cls("text", v)
    if prop in ("background", "backgroundColor"):
        return "bg-none" if v == "none" else ("bg-transparent" if v == "transparent" else color_cls("bg", v))
    if prop in ("width", "height"):
        p = "w" if prop == "width" else "h"
        if v == "100%":
            return f"{p}-full"
        if v == "auto":
            return f"{p}-auto"
        return f"{p}-[{PX(v)}]"
    if prop in ("maxWidth", "minWidth", "maxHeight", "minHeight"):
        p = {"maxWidth": "max-w", "minWidth": "min-w", "maxHeight": "max-h", "minHeight": "min-h"}[prop]
        return f"{p}-none" if v == "none" else f"{p}-[{PX(v)}]"
    if prop == "borderRadius":
        return {"50%": "rounded-full", "0": "rounded-none"}.get(v, f"rounded-[{arb(v)}]")
    if prop == "textAlign":
        return f"text-{v}" if v in ("center", "left", "right", "justify") else None
    if prop == "whiteSpace":
        return {"nowrap": "whitespace-nowrap", "pre-line": "whitespace-pre-line",
                "pre-wrap": "whitespace-pre-wrap", "normal": "whitespace-normal"}.get(v)
    if prop == "wordBreak":
        return {"keep-all": "break-keep", "break-all": "break-all"}.get(v)
    if prop == "overflow":
        return f"overflow-{v}" if v in ("hidden", "auto", "visible", "scroll", "clip") else None
    if prop == "zIndex":
        return f"z-[{v}]"
    if prop == "opacity":
        return f"opacity-[{v}]" if not num else (f"opacity-{int(float(v) * 100)}" if float(v) * 100 % 1 == 0 else f"opacity-[{v}]")
    if prop == "objectFit":
        return f"object-{v}" if v in ("cover", "contain", "fill", "none") else None
    if prop == "inset":
        return "inset-0" if v == "0" else f"inset-[{PX(v)}]"
    if prop in ("top", "right", "bottom", "left"):
        if v == "50%":
            return {"left": "left-1/2", "top": "top-1/2", "right": "right-1/2", "bottom": "bottom-1/2"}[prop]
        if v == "0":
            return f"{prop}-0"
        return f"{prop}-[{PX(v)}]"
    if prop == "border":
        if v == "none" or v == "0":
            return "border-none"
        m2 = re.fullmatch(r"1px solid (.+)", v)
        return f"border border-[{arb(m2.group(1))}]" if m2 else None
    m = re.fullmatch(r"border(Top|Right|Bottom|Left)", prop)
    if m:
        d = SIDE[m.group(1)]
        if v == "none":
            return f"border-{d}-0"
        m2 = re.fullmatch(r"1px solid (.+)", v)
        return f"border-{d} border-{d}-[{arb(m2.group(1))}]" if m2 else None
    if prop == "transform":
        return {"translateX(-50%)": "-translate-x-1/2", "rotate(180deg)": "rotate-180",
                "none": "transform-none", "translateY(0)": "translate-y-0",
                "translateY(100%)": "translate-y-full"}.get(v)
    if prop == "textDecoration":
        return {"underline": "underline", "none": "no-underline", "line-through": "line-through"}.get(v)
    if prop == "textUnderlineOffset":
        return f"underline-offset-[{PX(v)}]"
    if prop == "textTransform":
        return v if v in ("uppercase", "lowercase", "capitalize") else None
    if prop == "cursor":
        return f"cursor-{v}"
    if prop == "resize":
        return {"none": "resize-none", "vertical": "resize-y", "horizontal": "resize-x"}.get(v)
    if prop == "pointerEvents":
        return {"none": "pointer-events-none", "auto": "pointer-events-auto"}.get(v)
    if prop == "gridTemplateColumns":
        # grid-cols-N 은 repeat(N, minmax(0,1fr)) 이라 "1fr 1fr"(자동 최소폭 존재)과 다르다.
        # 이름 유틸리티로 바꾸면 열 폭 분배가 달라지므로 임의값으로 그대로 옮긴다.
        return f"grid-cols-[{arb(v)}]"
    if prop == "gridColumn":
        return "col-span-full" if v == "1 / -1" else f"col-[{arb(v)}]"
    if prop == "boxShadow":
        return "shadow-none" if v == "none" else f"shadow-[{arb(v)}]"
    if prop == "fontFamily":
        return f"font-[family-name:{v}]" if v.startswith("var(") else None
    if prop == "font":
        return "[font:inherit]" if v == "inherit" else None
    if prop == "accentColor":
        return f"accent-[{v}]"
    if prop == "filter":
        return f"[filter:{arb(v)}]"
    if prop == "boxSizing":
        return {"border-box": "box-border", "content-box": "box-content"}.get(v)
    if prop == "outline":
        return "outline-none" if v == "none" else None
    if prop == "appearance":
        return "appearance-none" if v == "none" else None
    if prop == "listStyle":
        return "list-none" if v == "none" else None
    return None


STYLE_RE = re.compile(r"style=\{\{")


def find_blocks(text):
    """style={{ ... }} 블록의 (start, end) 인덱스 목록"""
    out = []
    for m in STYLE_RE.finditer(text):
        i = m.end() - 2  # '{{' 의 첫 '{'
        depth = 0
        j = i
        while j < len(text):
            if text[j] == "{":
                depth += 1
            elif text[j] == "}":
                depth -= 1
                if depth == 0:
                    break
            j += 1
        if j + 1 < len(text) and text[j + 1] == "}":
            j += 1
        out.append((m.start(), j + 1))
    return out


def parse_props(body):
    """style 객체 본문 → [(prop, value)] / 파싱 불가면 None"""
    inner = body.strip()
    assert inner.startswith("{{") and inner.endswith("}}")
    inner = inner[2:-2]
    props = []
    depth = 0
    buf = ""
    for ch in inner:
        if ch in "([{":
            depth += 1
        elif ch in ")]}":
            depth -= 1
        if ch == "," and depth == 0:
            props.append(buf)
            buf = ""
        else:
            buf += ch
    props.append(buf)
    out = []
    for raw in props:
        raw = re.sub(r"//.*", "", raw).strip()
        if not raw:
            continue
        m = re.fullmatch(r'([A-Za-z]+)\s*:\s*(.+)', raw, re.S)
        if not m:
            return None
        name, val = m.group(1), m.group(2).strip()
        if val.startswith('"') and val.endswith('"'):
            val = val[1:-1]
        elif val.startswith("'") and val.endswith("'"):
            val = val[1:-1]
        elif re.fullmatch(r"-?\d+(\.\d+)?", val):
            pass
        else:
            return None  # 변수·삼항·템플릿 등 런타임 값
        out.append((name, val))
    return out


def tag_start(text, pos):
    """pos 앞쪽에서 여는 '<' 위치 찾기"""
    i = text.rfind("<", 0, pos)
    return i


def apply_file(path: Path, write: bool):
    text = path.read_text(encoding="utf-8")
    blocks = find_blocks(text)
    converted = skipped = 0
    reasons = []
    # 뒤에서부터 치환(인덱스 밀림 방지)
    for start, end in reversed(blocks):
        body = text[start + len("style="):end]
        props = parse_props(body)
        if props is None:
            skipped += 1
            reasons.append(("런타임값", re.sub(r"\s+", " ", text[start:end])[:90]))
            continue
        classes = []
        fail = None
        for name, val in props:
            c = convert(name, val)
            if c is None:
                fail = f"{name}: {val}"
                break
            classes.extend(c.split())
        if fail:
            skipped += 1
            reasons.append((f"미매핑 {fail}", re.sub(r"\s+", " ", text[start:end])[:70]))
            continue
        # 같은 태그에 className 이 있으면 합친다
        ts = tag_start(text, start)
        tag = text[ts:end]
        m = re.search(r'className="([^"]*)"', tag)
        newcls = " ".join(classes)
        if m:
            merged = f'className="{m.group(1)} {newcls}"'
            abs_s = ts + m.start()
            abs_e = ts + m.end()
            # style 블록 제거 + className 교체 (style 이 className 뒤에 있음 보장)
            text = text[:start] + text[end:]
            text = text[:abs_s] + merged + text[abs_e:]
        else:
            text = text[:start] + f'className="{newcls}"' + text[end:]
        converted += 1

    print(f"{path}  변환 {converted}  건너뜀 {skipped}")
    for why, snippet in reasons:
        print(f"    · {why}  ⟵ {snippet}")
    if write and converted:
        path.write_text(text, encoding="utf-8")


if __name__ == "__main__":
    args = sys.argv[1:]
    write = "--write" in args
    files = [Path(a) for a in args if a != "--write"]
    for f in files:
        apply_file(f, write)
