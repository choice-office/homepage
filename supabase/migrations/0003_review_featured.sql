-- 0003_review_featured.sql
-- 홈 화면 '의뢰인이 직접 전한 후기' 섹션에 올릴 대표 후기 표시.
-- 블로그 대표글(0002_blog_featured.sql)과 같은 규약 — 관리자(choice-admin)에서 별표로 지정한다.
--
-- 노출 규칙
--   후기 목록(/reviews)  : is_published = true 전부
--   홈 후기 섹션         : is_published = true AND is_featured = true
--                          (대표 지정이 0건이면 코드가 전체 노출본으로 폴백 → 섹션이 비지 않는다)
-- 공개 렌더: src/lib/review-images.ts

alter table public.review_images
  add column if not exists is_featured boolean not null default false;

comment on column public.review_images.is_featured is
  '홈 후기 섹션 노출 여부(관리자 별표). 목록 노출은 is_published 가 담당.';

-- 홈 조회(is_published + is_featured + 정렬) 최적화
create index if not exists review_images_featured_idx
  on public.review_images (is_published, is_featured, sort_order, created_at desc);

-- ── 초기 설정 ────────────────────────────────────────────────────────────
-- 지금 홈에서 돌아가던 노출본 중 앞쪽 12건을 대표로 지정한다(정렬은 사이트 표시 순서와 동일:
-- 등록일 최신 → 같은 날짜면 정렬값 오름차순). 이후에는 관리자에서 별표로 관리한다.
update public.review_images
set is_featured = true
where id in (
  select id
  from public.review_images
  where is_published = true
  order by created_at desc, sort_order asc
  limit 12
);
