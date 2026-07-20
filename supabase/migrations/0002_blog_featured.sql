-- 0002_blog_featured.sql
-- 홈 화면 대표(featured) 블로그 글 선택 기능.
-- 관리자(choice-admin)에서 최대 3개를 지정하면 홈 블로그 프리뷰가 그 글을 노출한다.
-- 지정이 3개 미만이면 최신 글로 나머지 슬롯을 채운다(공개 렌더: lib/blog.ts getFeaturedPosts).

alter table public.blog_posts add column if not exists is_featured boolean not null default false;
-- 대표글 노출 순서(작을수록 먼저, null은 뒤로). 최대 3개 지정 전제.
alter table public.blog_posts add column if not exists featured_order integer;

-- 대표글 조회 최적화
create index if not exists blog_posts_featured_idx on public.blog_posts (is_featured, featured_order);
