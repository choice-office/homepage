-- 0006_youtube_shorts.sql
-- 유튜브 쇼츠 "보관함" — 행정사님 채널의 쇼츠를 DB로 관리한다.
--
-- 왜 테이블을 나누나: home_shorts 는 "홈 4칸에 무엇을 걸까"(slot → youtube_id)만 담는다.
--   채널에 올라온 쇼츠 전체를 관리하려면 목록 자체를 담는 곳이 따로 있어야 한다.
--     youtube_shorts : 보관함(채널 쇼츠 목록)
--     home_shorts    : 홈 4칸 배정
--   FK 는 걸지 않는다 — 보관함에서 지운 영상 때문에 홈 칸이 조용히 비는 사고를 피하려고,
--   두 테이블을 느슨하게 두고 관리자 화면에서만 "보관함에서 고르기"로 유도한다.
--
-- 중복 방지: youtube_id 가 PK 다. "보관함 갱신"은 upsert(ignoreDuplicates)로 돌려서
--   RSS 가 준 15개 중 **이미 있는 건 건너뛰고 새로 올라온 것만** 추가된다.
--
-- 한계: 유튜브 공개 RSS 는 최근 업로드 15개까지만 준다(API 키 없이 쓰는 대가).
--   그보다 예전 쇼츠는 관리자 화면의 "링크로 추가"로 넣는다.

create table if not exists public.youtube_shorts (
	youtube_id   text primary key,
	title        text not null default '',
	published_at timestamptz,
	-- 목록에서 감추기 — 지우지 않고 숨기고 싶을 때(잘못 올린 영상 등).
	is_hidden    boolean not null default false,
	created_at   timestamptz not null default now(),
	updated_at   timestamptz not null default now()
);

comment on table public.youtube_shorts is
	'유튜브 쇼츠 보관함. 홈 4칸(home_shorts)은 여기서 골라 배정한다. youtube_id PK 로 중복 불가.';

-- 11자 영상 ID 형식만 허용(home_shorts 와 같은 규칙).
alter table public.youtube_shorts
	drop constraint if exists youtube_shorts_id_format;
alter table public.youtube_shorts
	add constraint youtube_shorts_id_format check (youtube_id ~ '^[A-Za-z0-9_-]{11}$');

-- 목록 정렬은 발행일 최신순.
create index if not exists youtube_shorts_published_idx
	on public.youtube_shorts (is_hidden, published_at desc nulls last);

-- 수정 시각 자동 갱신
create or replace function public.youtube_shorts_touch()
returns trigger language plpgsql as $$
begin
	new.updated_at := now();
	return new;
end $$;

drop trigger if exists youtube_shorts_touch on public.youtube_shorts;
create trigger youtube_shorts_touch
	before update on public.youtube_shorts
	for each row execute function public.youtube_shorts_touch();

-- RLS — 관리자 전용. 공개 페이지는 이 표를 읽지 않는다(홈은 home_shorts 만 본다).
alter table public.youtube_shorts enable row level security;

drop policy if exists "admin read shorts library" on public.youtube_shorts;
create policy "admin read shorts library" on public.youtube_shorts
	for select to authenticated using (public.is_admin());

drop policy if exists "admin write shorts library" on public.youtube_shorts;
create policy "admin write shorts library" on public.youtube_shorts
	for all to authenticated using (public.is_admin()) with check (public.is_admin());

grant select, insert, update, delete on public.youtube_shorts to authenticated;
