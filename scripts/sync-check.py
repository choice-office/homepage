"""관리자(Supabase) ↔ 운영 홈페이지 동기화 점검.

관리자에서 바꾼 내용이 실제 사이트에 반영되는지 "DB 진실값 vs 배포된 HTML" 로 맞대어 본다.
데이터를 바꾸지 않는 읽기 전용 점검이라 아무 때나 돌려도 안전하다.

  python3 scripts/sync-check.py                 # 운영(kvisa1345.com)
  BASE=http://localhost:3001 python3 scripts/sync-check.py
"""

import json
import os
import re
import urllib.parse
import urllib.request

BASE = os.environ.get("BASE", "https://kvisa1345.com").rstrip("/")

env = {}
for line in open(".env.local", encoding="utf-8"):
    if "=" in line and not line.strip().startswith("#"):
        k, v = line.split("=", 1)
        env[k.strip()] = v.strip().strip('"').strip("'")
URL, KEY = env["SUPABASE_URL"], env["SUPABASE_SERVICE_ROLE_KEY"]

ok = warn = fail = 0


def db(table: str, params: dict, count: bool = False):
    req = urllib.request.Request(
        f"{URL}/rest/v1/{table}?{urllib.parse.urlencode(params)}",
        headers={
            "apikey": KEY,
            "Authorization": f"Bearer {KEY}",
            **({"Prefer": "count=exact", "Range": "0-0"} if count else {}),
        },
    )
    with urllib.request.urlopen(req, timeout=60) as r:
        body = r.read()
        if count:
            return int(r.headers["Content-Range"].split("/")[-1])
        return json.loads(body)


def page(path: str) -> tuple[str, str]:
    req = urllib.request.Request(f"{BASE}{path}", headers={"User-Agent": "sync-check"})
    with urllib.request.urlopen(req, timeout=60) as r:
        return r.read().decode("utf-8", "replace"), (r.headers.get("age") or "-")


def check(label: str, expected, actual, note: str = ""):
    global ok, warn, fail
    good = expected == actual
    mark = "✓" if good else "✗"
    if good:
        ok += 1
    else:
        fail += 1
    print(f"  {mark} {label}: DB {expected} / 사이트 {actual} {note}")


print(f"대상: {BASE}\n")

# ── 1. 후기 이미지 ─────────────────────────────────────────────────────────
print("① 의뢰인 후기(review_images)")
pub = db("review_images", {"select": "src,tag,quote", "is_published": "eq.true"})
feat = None
try:
    feat = db(
        "review_images",
        {"select": "src", "is_published": "eq.true", "is_featured": "eq.true"},
    )
except Exception:
    print("     (is_featured 컬럼 없음 — 마이그레이션 0003 미적용)")

html, age = page("/reviews")
# 갤러리는 클라이언트 페이지네이션(한 번에 6장)이라 HTML 에는 1페이지 분량만 들어 있다.
# 따라서 "1페이지 카드 수"와 "페이저의 마지막 페이지 번호"로 총량을 확인한다.
PER_PAGE = int(
    re.search(
        r"REVIEWS_PER_PAGE = (\d+)",
        open("src/components/site/review-gallery.tsx", encoding="utf-8").read(),
    ).group(1)
)
site_srcs = {urllib.parse.unquote(m) for m in re.findall(r'url=([^&"]+)&amp;w=', html)}
db_srcs = {r["src"] for r in pub}
first_page = len(db_srcs & site_srcs)
check("후기 목록 1페이지 카드", min(len(db_srcs), PER_PAGE), first_page, f"(age {age}s)")
pages = [int(n) for n in re.findall(r'aria-label="(\d+)페이지"', html)] or [
    int(n) for n in re.findall(r">(\d+)</button>", html)
]
expected_pages = -(-len(db_srcs) // PER_PAGE)
check("후기 목록 페이지 수", expected_pages, max(pages) if pages else "찾지 못함")
missing = db_srcs - site_srcs
if len(missing) > len(db_srcs) - min(len(db_srcs), PER_PAGE):
    for s in list(missing)[:3]:
        row = next(r for r in pub if r["src"] == s)
        print(f"       ↳ 1페이지에도 없음: {row['tag']} / {row['quote'][:24]}")

home, hage = page("/")
home_srcs = {urllib.parse.unquote(m) for m in re.findall(r'url=([^&"]+)&amp;w=', home)}
home_reviews = len(db_srcs & home_srcs)
if feat is not None and len(feat) > 0:
    check("홈 후기 섹션(대표만)", len({r["src"] for r in feat}), home_reviews, f"(age {hage}s)")
else:
    check("홈 후기 섹션(폴백=노출본 전체)", len(db_srcs), home_reviews, f"(age {hage}s)")

# ── 2. 블로그 ──────────────────────────────────────────────────────────────
print("\n② 블로그(blog_posts)")
n_pub = db("blog_posts", {"select": "slug", "status": "eq.published"}, count=True)
blog, bage = page("/blog")
m = re.search(r"전체</span><span class=\"blog-cat-n\">(\d+)</span>", blog) or re.search(
    r"전체.{0,80}?blog-cat-n[^>]*>(\d+)<", blog, re.S
)
check("발행글 총계(카테고리 '전체' 배지)", n_pub, int(m.group(1)) if m else "찾지 못함", f"(age {bage}s)")

cats = db("blog_categories", {"select": "slug,name,sort_order", "order": "sort_order"})
counts = {}
for r in db("blog_posts", {"select": "category:blog_categories(slug)", "status": "eq.published"}):
    s = (r.get("category") or {}).get("slug")
    counts[s] = counts.get(s, 0) + 1
bad = []
for c in cats:
    n = counts.get(c["slug"], 0)
    if n == 0:
        continue
    pat = re.escape(c["name"]) + r"</span><span class=\"blog-cat-n\">(\d+)</span>"
    mm = re.search(pat, blog)
    if not mm or int(mm.group(1)) != n:
        bad.append(f"{c['name']}(DB {n} / 사이트 {mm.group(1) if mm else '없음'})")
check("카테고리별 글 수 일치", "전부", "전부" if not bad else f"불일치 {len(bad)}건", "" if not bad else str(bad[:3]))

feat_posts = db(
    "blog_posts",
    {"select": "slug,title", "status": "eq.published", "is_featured": "is.true"},
)
home_slugs = set(re.findall(r'href="/blog/([^"]+)"', home))
hit = sum(1 for p in feat_posts if urllib.parse.quote(p["slug"], safe="") in {urllib.parse.quote(s, safe="") for s in home_slugs} or p["slug"] in home_slugs)
check("홈 대표글", len(feat_posts), hit, f"(age {hage}s)")

# 최신 발행글 상세가 실제로 열리는지(새 글 = SSG 미생성 경로)
latest = db(
    "blog_posts",
    {"select": "slug,title,published_at", "status": "eq.published", "order": "published_at.desc", "limit": "1"},
)[0]
try:
    _, dage = page("/blog/" + urllib.parse.quote(latest["slug"]))
    print(f"  ✓ 최신 글 상세 열림: {latest['title'][:28]} (age {dage}s)")
    ok += 1
except Exception as e:
    print(f"  ✗ 최신 글 상세 실패: {latest['slug']} → {e}")
    fail += 1

# ── 3. sitemap / feed ─────────────────────────────────────────────────────
print("\n③ 색인 산출물")
sm, sage = page("/sitemap.xml")
check("sitemap 의 블로그 URL 수", n_pub, len(re.findall(r"/blog/", sm)), f"(age {sage}s, revalidate 1h)")
fd, fage = page("/feed.xml")
print(f"  · feed.xml 항목 {len(re.findall(r'<item>', fd))}개 (age {fage}s, revalidate 1h — 최신 30개만 담는다)")

print(f"\n─────────── 통과 {ok} · 실패 {fail} ───────────")
