# 블로그 시스템 — 현재 구조 & 관리자/Supabase 연동 로드맵

## 현재 (정적 데이터 기반)
- 데이터: `src/lib/blog-data.ts`
  ```ts
  type BlogPost = {
    slug: string;          // URL: /blog/{slug}
    category: string;
    title: string;
    excerpt: string;
    author: string;
    date: string;          // ISO yyyy-mm-dd (정렬·표시 기준)
    cover?: string;        // 목록·상세 상단 이미지(없으면 그라데이션)
    content: string;       // ★ 본문 = 에디터가 출력하는 HTML 문자열
  };
  // BLOG_POSTS(최신순 정렬), BLOG_PAGE_SIZE=9, getBlogPost(slug), formatBlogDate(iso)
  ```
- 목록: `app/blog/page.tsx` — 9개/페이지, **페이지네이션을 `searchParams.page`로 관리**(서버에서 `slice`). `<Link href="/blog?page=N">`.
- 상세: `app/blog/[id]/page.tsx` — 라우트 파라미터명은 `id`지만 값은 **slug**. `generateStaticParams`로 SSG, `generateMetadata`(OG 포함). 본문은 `<div className="prose" dangerouslySetInnerHTML={{__html: post.content}} />`.
- 본문 스타일: `globals.css`의 `.prose`(+`.blog-prose` 760px 폭). h2/h3/p/ul/ol/blockquote/a/strong/code/hr/**figure·img**(글 중간 이미지) 지원.
- 카드: `components/site/blog-card.tsx`(서버 컴포넌트, 내부 `<Link>`). 홈 `BlogPreview`와 상세 "관련 글"이 재사용.
- sitemap: `app/sitemap.ts`가 `BLOG_POSTS`로 글 URL 자동 포함.

## 본문(content)을 HTML로 둔 이유 (설계 의도)
관리자 글쓰기 에디터(첨부 스크린샷 = Tiptap류 리치 에디터: 굵게/기울임/밑줄/취소선/코드/색상/하이라이트/링크/이미지/첨부/정렬/목록/체크리스트/인용/구분선)는 **HTML을 출력**한다. 그래서 본문을 HTML 문자열로 저장하면:
- 글 중간 이미지·제목·목록·인용을 **있는 그대로** 표현.
- 관리자에서 등록한 결과가 상세 페이지에 **그대로** 나온다(렌더 경로 불변).

## 다음 단계 — 관리자(velog식) + Supabase 연동
목표: 관리자 페이지에서 글을 작성/등록하면 `/blog`와 `/blog/[slug]`에 자동 노출.

### 권장 데이터 스키마 (Supabase `posts`)
```sql
create table posts (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  category text not null,
  title text not null,
  excerpt text not null,
  author text not null,
  cover text,
  content text not null,            -- 에디터 출력 HTML
  published boolean not null default false,
  published_at timestamptz,         -- 정렬 기준
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
-- RLS 활성화: 공개 읽기는 published=true만, 쓰기는 service_role(관리자)만.
```
- `BlogPost`(공개용)와 컬럼이 1:1 대응되도록 유지 → 프런트 렌더 코드 변경 최소화.

### 연동 시 바꿀 것 (최소 변경 원칙)
1. `lib/blog-data.ts`의 정적 배열을 **Supabase fetch로 교체**하되, `getBlogPost`/`BLOG_POSTS` 같은 **함수 시그니처는 유지**(페이지 코드 불변).
2. 목록/상세 페이지에 `export const revalidate = 60`(ISR) 추가 → 글 등록 후 자동 갱신. `generateStaticParams`는 published slug 목록을 fetch.
3. 본문 이미지/커버를 Supabase Storage에 올리면 도메인이 `*.supabase.co` → 이미 `next.config.ts` remotePatterns에 등록됨.
4. **보안(중요)**: 본문 HTML은 신뢰 경로(관리자)라도 **저장 시 sanitize** 권장(예: `sanitize-html`/`isomorphic-dompurify`로 허용 태그·속성 화이트리스트). 현재 정적 단계에선 1차 제공 데이터라 그대로 렌더(`dangerouslySetInnerHTML`, biome-ignore 주석 있음).
5. 관리자 라우트는 인증 뒤에 둔다(Supabase Auth 또는 별도 보호). 작성 폼은 Tiptap 등으로 HTML 출력 → `posts.content`에 저장.

### 에디터 → 저장 → 표시 흐름
```
관리자 에디터(HTML 출력) → [sanitize] → Supabase posts.content
        ↓ (ISR fetch)
/blog 목록(BlogCard) · /blog/[slug] 상세(.prose 렌더)
```
