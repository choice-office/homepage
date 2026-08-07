-- 0007_youtube_shorts_public_read.sql
-- 보관함을 공개(anon) 읽기 허용 — 홈 4칸을 **항상 4개로 채우기** 위해 필요하다.
--
-- 배경: 홈 4칸 중 비어 있거나 영상이 죽은 칸이 있으면 그 자리를 건너뛰어 3개만 나갔다.
--   "네 개를 유지하고 싶다" → 빈 칸은 보관함의 최신 쇼츠로 자동 채운다(블로그 대표글과 같은 방식).
--   그러려면 공개 렌더(lib/home-shorts.ts)가 보관함을 읽어야 한다.
--
-- 공개해도 되는 데이터인가: 유튜브에 이미 공개된 영상의 ID·제목·발행일뿐이다. 민감정보 없음.
--   숨김 처리한 항목(is_hidden)은 내보내지 않는다.

drop policy if exists "public read shorts library" on public.youtube_shorts;
create policy "public read shorts library" on public.youtube_shorts
	for select to anon using (is_hidden = false);

grant select on public.youtube_shorts to anon;
