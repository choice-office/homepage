"""네이버 블로그 글 → Supabase(blog_posts) 이관기.

기존 205건과 동일한 본문 마크업 규약으로 변환한다.
  - 이미지  <figure><img src="{Storage URL}" alt="…" loading="lazy" /></figure>
  - 문단    <p class="se-t">줄1<br>줄2</p>          (se-text 컴포넌트 1개 = <p> 1개)
  - 밑줄인용 <div class="se-q se-q-u">…</div>
  - 가운데인용 <blockquote class="se-q se-q-c">…</blockquote>
  - 장소     <a class="se-map" …>  (네이버 지도 검색 링크)
본문 이미지는 네이버 CDN을 직접 참조하지 않고 Supabase Storage(blog/naver/{logNo}/N.jpg)로 복사한다.

사용:
  /tmp/naverenv/bin/python scripts/naver_import.py fetch 224365061108 …   # 파싱 결과만 출력(쓰기 없음)
  /tmp/naverenv/bin/python scripts/naver_import.py push  plan.json        # 실제 삽입
"""

import html as htmllib
import json
import re
import sys
import urllib.parse
import urllib.request

from bs4 import BeautifulSoup

BLOG_ID = "k-visa1345"
UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36"
POST_URL = (
    "https://blog.naver.com/PostView.naver?blogId={blog}&logNo={log}"
    "&redirect=Dlog&widgetTypeCall=true&directAccess=false"
)
IMG_VARIANT = "?type=w966"  # 기존 이관본과 동일한 폭


def env(path=".env.local"):
    out = {}
    for line in open(path, encoding="utf-8"):
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        k, v = line.split("=", 1)
        out[k] = v.split("#")[0].strip().strip('"').strip("'")
    return out


def get(url, binary=False, timeout=60):
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Referer": "https://blog.naver.com/"})
    raw = urllib.request.urlopen(req, timeout=timeout).read()
    return raw if binary else raw.decode("utf-8", "replace")


def esc(t):
    return htmllib.escape(t, quote=True)


def inline_html(node):
    """문단 내부를 <strong>만 남기고 평문화한다."""
    parts = []
    for el in node.descendants:
        if getattr(el, "name", None) is not None:
            continue
        text = str(el).replace("​", "")
        if not text:
            continue
        bold = any(p.name in ("b", "strong") for p in el.parents if getattr(p, "name", None))
        parts.append(f"<strong>{esc(text)}</strong>" if bold else esc(text))
    # 인접한 <strong> 병합
    return re.sub(r"</strong><strong>", "", "".join(parts))


def parse(log_no):
    soup = BeautifulSoup(get(POST_URL.format(blog=BLOG_ID, log=log_no)), "lxml")
    main = soup.select_one(".se-main-container")
    if not main:
        raise SystemExit(f"{log_no}: se-main-container 없음")

    title_el = soup.select_one(".se-title-text") or soup.select_one("title")
    title = re.sub(r"\s*:\s*네이버 블로그$", "", title_el.get_text(" ", strip=True))
    cat_el = soup.select_one(".blog2_series") or soup.select_one(".blog2_category")
    category = cat_el.get_text(strip=True) if cat_el else ""

    blocks, images = [], []
    for comp in main.select(":scope > .se-component"):
        cls = set(comp.get("class", []))

        if "se-image" in cls:
            img = comp.select_one("img")
            if not img:
                continue
            src = img.get("data-lazy-src") or img.get("src") or ""
            src = src.split("?")[0] + IMG_VARIANT
            images.append(src)
            blocks.append({"t": "img", "i": len(images)})

        elif "se-text" in cls:
            lines = [inline_html(p) for p in comp.select(".se-text-paragraph")]
            while lines and not lines[0].strip():
                lines.pop(0)
            while lines and not lines[-1].strip():
                lines.pop()
            if lines:
                blocks.append({"t": "p", "html": "<br>".join(lines)})

        elif "se-quotation" in cls:
            q = comp.select_one(".se-quote")
            if not q:
                continue
            lines = [inline_html(p) for p in q.select(".se-text-paragraph")]
            text = "<br>".join(x for x in lines if x.strip())
            if text:
                underline = "se-l-quotation_underline" in cls
                blocks.append({"t": "qu" if underline else "qc", "html": text})

        elif "se-placesMap" in cls:
            name_el = comp.select_one(".se-map-title, .se-placesmap-title, strong")
            spans = [s.get_text(" ", strip=True) for s in comp.select("span, strong, p")]
            spans = [s for s in spans if s]
            name = name_el.get_text(strip=True) if name_el else (spans[0] if spans else "")
            addr = next((s for s in spans if s != name and len(s) > len(name)), "")
            if name:
                blocks.append({"t": "map", "name": name, "addr": addr})

    return {"logNo": str(log_no), "title": title, "naverCategory": category,
            "blocks": blocks, "images": images}


MAP_SVG = (
    '<svg width="22" height="22" viewBox="0 0 24 24" fill="#2db400" aria-hidden="true">'
    '<path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z"/>'
    "</svg>"
)


def normalize(text):
    """사이트 표기 규칙에 맞춘다 — 사무소명은 붙여 쓴다."""
    return text.replace("초이스 행정사 사무소", "초이스 행정사사무소")


def render(parsed, alt_base, storage_base):
    out = []
    for b in parsed["blocks"]:
        if b["t"] == "img":
            url = f"{storage_base}/{parsed['logNo']}/{b['i']}.jpg"
            out.append(f'<figure><img src="{url}" alt="{esc(alt_base)} {b["i"]}" loading="lazy" /></figure>')
        elif b["t"] == "p":
            out.append(f'<p class="se-t">{b["html"]}</p>')
        elif b["t"] == "qu":
            out.append(f'<div class="se-q se-q-u">{b["html"]}</div>')
        elif b["t"] == "qc":
            out.append(f'<blockquote class="se-q se-q-c">{b["html"]}</blockquote>')
        elif b["t"] == "map":
            href = "https://map.naver.com/p/search/" + urllib.parse.quote(b["name"])
            out.append(
                f'<a class="se-map" href="{href}" target="_blank" rel="noopener noreferrer">'
                f'<span class="se-map-pin">{MAP_SVG}</span><span class="se-map-body">'
                f'<span class="se-map-name">{esc(b["name"])}</span>'
                f'<span class="se-map-addr">{esc(b["addr"])}</span></span></a>'
            )
    return normalize("\n".join(out))


def plain_text(parsed):
    """요약(excerpt) 산출용 평문 — <br>은 공백으로 바꿔 단어가 붙지 않게 한다."""
    chunks = [
        re.sub(r"<[^>]+>", "", b["html"].replace("<br>", " "))
        for b in parsed["blocks"]
        if b["t"] in ("p", "qu", "qc")
    ]
    return re.sub(r"\s+", " ", htmllib.unescape(" ".join(chunks))).strip()


if __name__ == "__main__":
    if len(sys.argv) < 3 or sys.argv[1] != "fetch":
        raise SystemExit(__doc__)
    result = [parse(x) for x in sys.argv[2:]]
    print(json.dumps(result, ensure_ascii=False, indent=1))
