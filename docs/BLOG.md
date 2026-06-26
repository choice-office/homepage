# 블로그 시스템 — 구조 & 상태

## 현재 상태 (Supabase 가동 중)
- **공개 읽기 = Supabase 구현 완료.** 정적 `blog-data.ts`는 제거됨. 데이터는 `blog_posts` 등 3개 테이블에서 온다.
- **관리자(작성/수정) = 미구현(TODO).** 설계만: `docs/BLOG-AUTHORING.md`. 현재 데이터는 `scripts/seed-blog.ts`로 1회 시드.

### 읽기 레이어 — `src/lib/blog.ts`
```ts
type BlogPost = { slug; category; title; excerpt; author; date; content;
                  cover?; coverAlt?; tldr?; faq?; sources?; dateModified?; metaTitle?; metaDescription? };
// getPublishedPosts(): Promise<BlogPost[]>   (published만, 최신순, RLS)
// getPostBySlug(slug): Promise<BlogPost|null>
// getRelatedPosts(post, n): Promise<BlogPost[]>
// formatBlogDate(iso), BLOG_PAGE_SIZE=9
```
- Supabase **anon 키 + RLS**로 서버에서 읽음(published만 노출). 컬럼(snake_case)→`BlogPost`(camel) 매핑은 `lib/blog.ts`의 `toPost`.

### 페이지 (모두 ISR `revalidate=60`)
- 목록 `app/blog/page.tsx` — `getPublishedPosts()` → 9개/페이지, **페이지네이션 `searchParams.page`**.
- 상세 `app/blog/[id]/page.tsx` — `getPostBySlug` (param명 `id`=slug). `generateStaticParams`=published slugs(빌드 시 fetch) + on-demand(신규글). 본문 `.prose dangerouslySetInnerHTML`. JSON-LD/구조 블록은 `docs/BLOG-SEO.md`.
- 홈 `app/page.tsx`(async) — `getPublishedPosts()` → `<BlogPreview posts={...} />`(prop). 
- `app/sitemap.ts`(async) — published 글 URL 포함.
- 카드 `components/site/blog-card.tsx` — 내부 `<Link>`, 홈/관련글 재사용.

## Supabase 스키마 (생성 완료)
프로젝트 ref: `pohfmrzgtoxdbwdsrckt`. 테이블 3개 + enum + RLS + storage 버킷.
```
post_status enum: draft | published | archived

blog_categories (id, slug uniq, name, sort_order, created_at)
blog_authors    (id, slug uniq, name, role, credentials, bio, avatar_url, created_at)
blog_posts (
  id, slug uniq(소문자-kebab CHECK), title, excerpt, content(HTML),
  cover_url, cover_alt, tldr,
  faq jsonb [{q,a}], sources jsonb [{label,href}],
  category_id → blog_categories, author_id → blog_authors,
  status post_status default draft, published_at(정렬),
  meta_title, meta_description, canonical_url,
  created_at, updated_at(트리거 자동)
)
index: blog_posts(status, published_at desc), blog_posts(category_id)
RLS: 공개 SELECT = blog_posts(status=published) / categories·authors(true). 쓰기 정책 없음 → service_role만.
storage bucket 'blog' (public read) — 본문·커버 이미지용. 업로드 정책은 관리자 구현 시.
```
- **설계 의도**: 공유 엔티티(카테고리·작성자)는 정규화(FK), 글-종속 값객체(faq·sources)는 jsonb. `BlogPost`와 컬럼 1:1 매핑 → 렌더 코드 변경 최소.
- `dateModified` = `updated_at`(시드 시 명시 입력, 이후 UPDATE 트리거 자동), `date` = `published_at`.

## 시드 (`scripts/seed-blog.ts`, 1회용)
- 초기 글 12편 + 카테고리 10 + 작성자 1을 service_role로 upsert. 데이터: `scripts/seed-data.ts`.
- 재실행: `export SUPABASE_URL=… SUPABASE_SERVICE_ROLE_KEY=…; npx tsx scripts/seed-blog.ts` (slug upsert라 멱등).
- `scripts/`는 dev 도구라 tsgo/biome/knip 대상에서 제외(tsconfig·biome·knip 설정).

## 본문(content)을 HTML로 둔 이유
관리자 리치 에디터(Tiptap류)는 **HTML을 출력** → 글 중간 이미지·제목·목록·인용을 그대로 표현하고, 등록 결과가 상세에 **그대로** 나온다(렌더 경로 불변).

## 다음 단계 — 관리자(velog식) 작성기능 [TODO]
설계: `docs/BLOG-AUTHORING.md` (**AI 없이 + 극단적 단순함** 원칙). 요지:
1. Tiptap 시맨틱 WYSIWYG(제목 드롭다운, 붙여넣기 정리) + 빈칸 채우기 템플릿.
2. 사이드바 폼 = `BlogPost`의 옵션 필드(tldr/faq/sources/작성자/카테고리/커버+alt/slug/meta) — 이미 렌더·JSON-LD가 이 필드들을 소비하므로 **폼만 얹으면** 동작.
3. 이미지 업로드 → Storage `blog` 버킷(+alt 강제). slug 자동(규칙, AI 없음). 발행 시 `status=published`, `published_at` 세팅 → ISR로 즉시 노출.
4. 본문 HTML **저장 시 sanitize** 권장. 관리자 라우트는 인증 뒤에.
5. (선택, 나중) "URL에서 불러오기"는 라이브러리(readability+turndown)로 초안만 — `docs/BLOG-AUTHORING.md` 참고.
