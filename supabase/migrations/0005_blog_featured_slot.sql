-- 0005_blog_featured_slot.sql
-- featured_order 의 의미를 "노출 순서(1..N 연속)" → "홈 4칸 중 몇 번 칸(1~4, 빈틈 허용)" 으로 재정의한다.
--
-- 왜: 예전 모델은 지정글을 전부 앞으로 모으고 뒤를 최신글로 채웠다. 그래서 2번 칸에 글을
--     고정해도 홈에서는 1번 자리에 나갔다 = 관리자 화면의 칸 번호가 홈 순서와 어긋났다.
--     새 모델에서는 칸마다 독립적으로 "고정" 또는 "자동(최신 발행글)" 이 된다.
--       featured_order = [ null, 2, null, null ]  →  홈 = [최신1, 고정글, 최신2, 최신3]
--     자동 칸은 글을 새로 발행하면 그대로 굴러가고, 고정 칸은 그 자리에 머문다.
--
-- 데이터 이관 불필요: 기존 지정은 1..N 연속이라 새 의미(1번 칸, 2번 칸 …)에서도 같은 결과다.
--
-- 공개 렌더: choice-homepage src/lib/blog.ts getFeaturedPosts
-- 관리자   : choice-admin  /home (홈 화면 관리) — src/lib/blog.ts setFeaturedSlot

comment on column public.blog_posts.featured_order is
	'홈 대표 블로그 칸 번호(1~4). is_featured=true 인 행에만 의미가 있고, 칸마다 최대 1개.';

-- 한 칸에 두 글이 앉는 상태를 DB 가 막는다(관리자 동시 조작·재시도에도 불변식 유지).
create unique index if not exists blog_posts_featured_slot_uq
	on public.blog_posts (featured_order)
	where is_featured;

-- 칸 번호는 1~4 만. 해제(is_featured=false)일 때는 featured_order 를 null 로 둔다.
alter table public.blog_posts
	drop constraint if exists blog_posts_featured_slot_ck;
alter table public.blog_posts
	add constraint blog_posts_featured_slot_ck check (
		case
			when is_featured then featured_order between 1 and 4
			else featured_order is null
		end
	);
