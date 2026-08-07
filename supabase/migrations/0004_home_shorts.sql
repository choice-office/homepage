-- 0004_home_shorts.sql
-- 홈 "영상으로 보는 비자 정보" 4칸에 나가는 유튜브 쇼츠.
-- 이전에는 src/lib/site-data.ts 의 SHORTS 상수(하드코딩)라서 영상 교체에 배포가 필요했다.
-- 이제 관리자(choice-admin)에서 링크만 넣으면 홈에 반영된다(ISR 60초).
--
-- 슬롯 고정형: 홈 그리드가 4칸이라 slot 1~4 행을 미리 만들어 두고 값만 갱신한다.
-- (목록형이 아니라 슬롯형이라 "몇 번째 칸에 무엇" 이 한눈에 보이고, 정렬 로직이 필요 없다)
-- 공개 렌더: src/lib/home-shorts.ts  ·  폴백: SHORTS(src/lib/site-data.ts)
-- review_images / blog_posts 와 동일한 공개읽기 + RLS 패턴.

create table if not exists public.home_shorts (
  slot         smallint primary key check (slot between 1 and 4),
  youtube_id   text,                          -- 쇼츠 영상 ID(11자). null = 빈 칸(폴백 사용)
  title        text,                          -- 관리자 메모/식별용(홈 렌더에는 쓰지 않음)
  updated_at   timestamptz not null default now()
);

-- youtube_id 형식 보증 — 11자 [A-Za-z0-9_-]. URL 을 그대로 넣는 실수를 DB 단계에서 막는다.
alter table public.home_shorts drop constraint if exists home_shorts_youtube_id_format;
alter table public.home_shorts add constraint home_shorts_youtube_id_format
  check (youtube_id is null or youtube_id ~ '^[A-Za-z0-9_-]{11}$');

-- updated_at 자동 갱신(0001 에서 만든 공용 트리거 함수 재사용)
drop trigger if exists set_home_shorts_updated_at on public.home_shorts;
create trigger set_home_shorts_updated_at
  before update on public.home_shorts
  for each row execute function public.set_current_timestamp_updated_at();

-- 4칸 시드 — 기존 하드코딩 값(SHORTS)을 그대로 옮겨 배포 직후에도 홈이 동일하게 보이게 한다.
insert into public.home_shorts (slot, youtube_id, title) values
  (1, 'bDbzEqjUZ8c', null),
  (2, 'R0b8ByqZybI', null),
  (3, 'RsoaBz7t1DM', null),
  (4, 'GoUMPDmAML0', null)
on conflict (slot) do nothing;

-- RLS: 공개(anon)는 읽기만, 관리자(authenticated)는 읽기+수정.
-- 슬롯은 마이그레이션에서 4개만 만들고 이후 추가/삭제하지 않으므로 insert/delete 정책은 두지 않는다.
alter table public.home_shorts enable row level security;

drop policy if exists "home_shorts public read" on public.home_shorts;
create policy "home_shorts public read"
  on public.home_shorts for select
  to anon using (true);

drop policy if exists "home_shorts authenticated read" on public.home_shorts;
create policy "home_shorts authenticated read"
  on public.home_shorts for select
  to authenticated using (true);

drop policy if exists "home_shorts authenticated update" on public.home_shorts;
create policy "home_shorts authenticated update"
  on public.home_shorts for update
  to authenticated using (true) with check (true);
