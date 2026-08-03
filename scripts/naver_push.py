"""파싱한 네이버 글 + 큐레이션 메타를 Supabase(blog_posts)에 넣는다.

  본문 이미지: 네이버 CDN → 내려받아 Supabase Storage(blog/naver/{logNo}/N.jpg)로 업로드
  cover_url  : 첫 이미지(목록 썸네일 — 목록 쿼리는 본문을 읽지 않으므로 반드시 채운다)

사용: /tmp/naverenv/bin/python scripts/naver_push.py plan.json [--dry]
plan.json 항목: logNo, slug, categorySlug, altBase, excerpt, tldr, tags, metaTitle,
                metaDescription, publishedAt, faq?, sources?
"""

import json
import sys
import urllib.error
import urllib.parse
import urllib.request

sys.path.insert(0, "scripts")
from naver_import import UA, env, get, parse, render  # noqa: E402

BUCKET = "blog"


def storage_base(url):
    return f"{url}/storage/v1/object/public/{BUCKET}/naver"


def upload(url, svc, path, data, content_type="image/jpeg"):
    req = urllib.request.Request(
        f"{url}/storage/v1/object/{BUCKET}/{path}",
        data=data,
        headers={
            "Authorization": f"Bearer {svc}",
            "apikey": svc,
            "Content-Type": content_type,
            "x-upsert": "true",
        },
        method="POST",
    )
    urllib.request.urlopen(req, timeout=120).read()


def rest(url, svc, path, payload=None, method="POST", prefer="return=representation"):
    req = urllib.request.Request(
        f"{url}/rest/v1/{path}",
        data=json.dumps(payload).encode() if payload is not None else None,
        headers={
            "apikey": svc,
            "Authorization": f"Bearer {svc}",
            "Content-Type": "application/json",
            "Prefer": prefer,
        },
        method=method,
    )
    try:
        body = urllib.request.urlopen(req, timeout=60).read()
    except urllib.error.HTTPError as err:
        raise SystemExit(f"{err.code} {path}\n{err.read().decode('utf-8', 'replace')[:800]}") from err
    return json.loads(body) if body else None


def main():
    dry = "--dry" in sys.argv
    plan = json.load(open(sys.argv[1], encoding="utf-8"))
    e = env()
    url, svc = e["SUPABASE_URL"], e["SUPABASE_SERVICE_ROLE_KEY"]
    base = storage_base(url)

    cats = {c["slug"]: c["id"] for c in rest(url, svc, "blog_categories?select=id,slug", method="GET")}
    author = rest(url, svc, "blog_authors?select=id&slug=eq.choice", method="GET")[0]["id"]

    for item in plan:
        log = item["logNo"]
        p = parse(log)
        content = render(p, item["altBase"], base)

        if not dry:
            for i, src in enumerate(p["images"], 1):
                try:
                    upload(url, svc, f"naver/{log}/{i}.jpg", get(src, binary=True))
                except urllib.error.HTTPError as err:
                    print(f"  ! 이미지 {i} 업로드 실패 {err.code} {src[:70]}")

        cover = f"{base}/{log}/1.jpg" if p["images"] else None
        row = {
            "slug": item["slug"],
            "title": p["title"],
            "excerpt": item["excerpt"],
            "content": content,
            "cover_url": cover,
            "cover_alt": f"{item['altBase']} 1" if cover else None,
            "tldr": item.get("tldr"),
            "faq": item.get("faq", []),
            "sources": item.get("sources", []),
            "category_id": cats[item["categorySlug"]],
            "author_id": author,
            "status": "published",
            "published_at": item["publishedAt"],
            "updated_at": item["publishedAt"],
            "meta_title": item.get("metaTitle"),
            "meta_description": item.get("metaDescription") or item["excerpt"],
            "tags": item.get("tags", []),
            "source_url": f"https://blog.naver.com/k-visa1345/{log}",
            "is_featured": False,
        }
        print(f"{'[dry] ' if dry else ''}{item['slug']}  이미지 {len(p['images'])}  본문 {len(content):,}B  · {p['title'][:40]}")
        if dry:
            continue
        rest(url, svc, "blog_posts?on_conflict=slug", [row], prefer="return=minimal,resolution=merge-duplicates")

    print(f"\n{'검토' if dry else '완료'}: {len(plan)}건")


if __name__ == "__main__":
    main()
