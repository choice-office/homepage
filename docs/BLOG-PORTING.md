# 블로그 이식 워크플로우 — 네이버 글 링크 → 사이트 블로그

> onketing/homepage의 `docs/07-blog-porting.md`를 이 프로젝트에 맞게 이식한 것.
> **차이**: homepage는 MDX 파일(`src/content/blog/*.mdx` + REGISTRY)에 쓰지만,
> **이 프로젝트(choice)는 Supabase `blog_posts`(HTML) 테이블에 행을 넣는다.** 공개 렌더는 이미 구현됨(`docs/BLOG.md`, `docs/BLOG-SEO.md`).
> 관리자(choice-admin)에서 직접 등록하는 것과 **같은 테이블**에 쓰므로 두 방식이 공존한다.

트리거: 사용자가 `https://blog.naver.com/k-visa1345/{logNo}` 링크를 주며 "이식해줘 / 블로그에 올려줘" 라고 할 때. 매번 다시 설명받지 않고 아래 절차를 따른다.

전체 글 목록·카테고리 매핑: **`docs/BLOG-NAVER-INDEX.md`** (260편, 클릭 가능한 링크 + 분류).

---

## 1. 원문 가져오기 (WebFetch는 네이버 차단 → curl 모바일 UA)

```sh
UA="Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1"
curl -sL -A "$UA" "https://m.blog.naver.com/k-visa1345/{logNo}" -o /tmp/post.html
```
- 제목: `og:title`. 본문: `div.se-main-container`. 본문 이미지: `*.pstatic.net`의 `.jpg/.png`(프로필 썸네일 `blogpfthumb` 제외).

## 2. 중복·캐노니컬 (가장 중요)

- 이미 이식했는지: Supabase `blog_posts`에서 같은 주제/slug 확인.
- **자사 도메인을 원본(캐노니컬)** 으로 둔다. `canonical_url`에 **네이버 URL을 절대 넣지 않는다**(넣으면 자사 랭킹 포기).
- 같은 1차 키워드로 기존 글과 경쟁하지 않게 각도를 분리한다(카니발라이제이션 방지).

## 3. 변환 — SEO/AEO HTML (`blog_posts.content`)

`.prose`가 렌더하는 **HTML**로 작성(MDX 아님). `docs/BLOG-SEO.md`의 렌더 순서를 따른다:
- **TL;DR**은 `tldr` 필드로(본문 아님) → 상단 콜아웃 자동.
- 본문 `content`: 인트로 1~2문단(답-우선) → **질문형 `<h2>` 3개+**, 각 섹션에 `<table>`(featured snippet·AEO에 강함)·목록·`<figure><img alt>`.
- **FAQ**는 `faq` jsonb(`[{q,a}]`)로 → 가시 FAQ 블록 + `FAQPage` JSON-LD 자동. 답변은 각자 독립 완결.
- **출처**는 `sources` jsonb(`[{label,href}]`) — 공식 기관(하이코리아·법무부 등) E-E-A-T.
- `tags`(text[]): `#` 없이 단어만. `excerpt`(카드/메타 기본값), `meta_title`/`meta_description`(옵션).

## 4. 카테고리·작성자 매핑

- 작성자: `author_id` = `choice`(현재 유일).
- 카테고리: 아래 기존 slug에 매핑. 없으면 `blog_categories`에 신규 insert(sort_order 이어서).

| 네이버 분류 | 사이트 category slug |
|---|---|
| F4(거소증·연장·중국동포·남자·범죄·소지자정보) | `f4` (+연장류는 `extension`) |
| F5 영주권 | `f5` |
| F6 결혼 / F1·F2·F3 | `f6` |
| E6 연예인 | `e6` |
| E7 전문직 / D10 구직 / H2 방문취업 | `e7` |
| 국적회복·귀화 | `nat` |
| D7·D8 | `d8` |
| C3·C4 단기초청 | ⚠️ 신규 필요(`short` 등) |
| 아포스티유·공증·여권 | ⚠️ 신규 필요(`documents` 등) |
| 후기 | 블로그 아님 → 후기 페이지 |
| 공지·사무소·정보 | ⚠️ 신규 필요 or 생략 |

> ⚠️ 기존 `blog_categories.name`이 `거소증 · F-4` 등 **하이픈 표기**로 남아 있음 → 사이트 비자 표기(F4비자)와 통일하려면 함께 갱신 권장.

## 5. 이미지 → Supabase Storage `blog` 버킷(공개)

원문 이미지는 **재호스팅**(핫링크 깨짐·이미지 SEO). 후기 이미지와 동일 패턴(service_role 업로드):
```js
await sb.storage.from("blog").upload(`{slug}/1.jpg`, buf, { contentType: "image/jpeg", upsert: true });
// public URL = {SUPABASE_URL}/storage/v1/object/public/blog/{slug}/1.jpg → content <img src>·cover_url
```

## 6. 등록 — `blog_posts` upsert (service_role)

`.env.local`의 `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY`로 insert(=관리자와 동일 테이블). `scripts/seed-blog.ts` 패턴.
```js
await sb.from("blog_posts").upsert({
  slug, title, excerpt, content /* HTML */, cover_url, cover_alt,
  tldr, faq /* [{q,a}] */, sources /* [{label,href}] */, tags /* [] */,
  category_id /* FK: blog_categories.slug 조회 */, author_id /* choice */,
  status: "published", published_at: "<ISO, logNo 순서와 일치>",
  meta_title, meta_description,
}, { onConflict: "slug" });
```
- `slug`: kebab, **한글 허용** `^[a-z0-9가-힣]+(?:-[a-z0-9가-힣]+)*$`(예: `f4비자-연장-접수시기`). 한국어 검색 타깃이라 한글 slug 유리.
- 발행 즉시 ISR(`revalidate=60`)로 `/blog/{slug}` 노출.

## 7. 톤 (SITE_GUIDE 준수)

- 금지어: `가장 / 최고의 / 완벽한 / 압도적인 / 혁신적인` 등 과장 지양. 단정형(`~합니다`).
- 검증 가능한 숫자·고유명사·기관명 포함. YMYL(비자/법률)이라 정확성·출처 중요.

## 자동 처리되는 SEO/AEO (작성자가 신경 안 써도 됨)

`app/blog/[id]/page.tsx`가 필드로부터 생성: `<title>`·OG·canonical(자기 URL), BlogPosting+BreadcrumbList(+faq 있으면 FAQPage) JSON-LD, 하단 태그 칩·출처·면책 문구, 관련 글. `sitemap.ts`가 글을 자동 포함.
