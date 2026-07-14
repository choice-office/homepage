-- 0002_reviews_storage.sql
-- 후기 이미지(마스킹 캡처) 업로드용 공개 스토리지 버킷 'reviews'.
-- 관리자(choice-admin)가 authenticated 세션으로 업로드하고, 공개 페이지는 public URL로 읽는다.
-- 기존 'blog' 버킷과 동일 패턴(공개 읽기 + authenticated 쓰기).

insert into storage.buckets (id, name, public)
values ('reviews', 'reviews', true)
on conflict (id) do nothing;

drop policy if exists "reviews bucket public read" on storage.objects;
create policy "reviews bucket public read"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'reviews');

drop policy if exists "reviews bucket authenticated insert" on storage.objects;
create policy "reviews bucket authenticated insert"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'reviews');

drop policy if exists "reviews bucket authenticated update" on storage.objects;
create policy "reviews bucket authenticated update"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'reviews')
  with check (bucket_id = 'reviews');

drop policy if exists "reviews bucket authenticated delete" on storage.objects;
create policy "reviews bucket authenticated delete"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'reviews');
