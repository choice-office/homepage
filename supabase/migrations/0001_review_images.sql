-- 0001_review_images.sql
-- 의뢰인 후기 이미지(카카오톡·이메일 캡처, 개인정보 마스킹본).
-- 공개(anon)는 is_published=true 만 읽고, 쓰기(등록/수정/노출·정렬)는 관리자(choice-admin)가 service_role로 처리한다.
-- 공개 렌더: src/lib/review-images.ts  ·  로컬 폴백/시드: REVIEW_IMAGES(src/lib/site-data.ts)
-- 텍스트 후기(reviews)·블로그(blog_posts)와 동일한 공개읽기+RLS 패턴.

create table if not exists public.review_images (
  id           uuid primary key default gen_random_uuid(),
  src          text not null unique,          -- 이미지 URL(Supabase Storage) 또는 /public 경로
  w            integer not null,              -- 원본 픽셀 폭(카드/라이트박스 비율 계산용)
  h            integer not null,              -- 원본 픽셀 높이
  tag          text not null,                 -- 사건 유형 (예: "거소증 · 상담")
  quote        text not null,                 -- 발췌 인용(각색 가능)
  meta         text not null,                 -- 익명 속성 (예: "재방문 의뢰인")
  is_published boolean not null default false,
  sort_order   integer not null default 0,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- 공개 정렬 조회 최적화(getPublishedReviewImages: is_published + sort_order + created_at)
create index if not exists review_images_published_idx
  on public.review_images (is_published, sort_order, created_at desc);

-- updated_at 자동 갱신 트리거
create or replace function public.set_current_timestamp_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_review_images_updated_at on public.review_images;
create trigger set_review_images_updated_at
  before update on public.review_images
  for each row execute function public.set_current_timestamp_updated_at();

-- RLS: 공개(anon/authenticated)는 노출본만 SELECT. service_role은 RLS를 우회하므로 관리자 쓰기에 별도 정책 불필요.
alter table public.review_images enable row level security;

drop policy if exists "review_images public read" on public.review_images;
create policy "review_images public read"
  on public.review_images
  for select
  to anon, authenticated
  using (is_published = true);
