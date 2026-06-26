// 블로그 시드 — 초기 정적 데이터(scripts/seed-data.ts)를 Supabase에 삽입(upsert).
// 실행: SUPABASE_URL/SUPABASE_SERVICE_ROLE_KEY 환경변수 세팅 후
//   npx tsx scripts/seed-blog.ts
// (service_role 키 사용 → RLS 우회. 관리자 작성기능 구현 전까지의 초기 데이터.)
import { createClient } from "@supabase/supabase-js";
import { BLOG_POSTS } from "./seed-data";

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
	console.error("SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY 필요");
	process.exit(1);
}
const sb = createClient(url, key, { auth: { persistSession: false } });

const CAT_SLUG: Record<string, string> = {
	"거소증 · F-4": "f4",
	"결혼비자 · F-6": "f6",
	"영주권 · F-5": "f5",
	"전문직 · E-7": "e7",
	"연예인 · E-6": "e6",
	국적회복: "nat",
	"체류 · 연장": "extension",
	"투자 · D-8": "d8",
	"출국 · 사면": "departure",
	"비전문 · E-9": "e9",
};

const kstIso = (yyyymmdd: string) => new Date(`${yyyymmdd}T09:00:00+09:00`).toISOString();

const main = async () => {
	// 1) 작성자
	const { data: author, error: aErr } = await sb
		.from("blog_authors")
		.upsert(
			{
				slug: "choice",
				name: "초이스 행정사 사무소",
				role: "행정사",
				credentials: "행정사 등록번호 18102025537 · 출입국민원 대행기관 19-SB-RG-016",
			},
			{ onConflict: "slug" },
		)
		.select("id")
		.single();
	if (aErr || !author) throw new Error(`author: ${aErr?.message}`);

	// 2) 카테고리(글에서 distinct 추출)
	const names = [...new Set(BLOG_POSTS.map((p) => p.category))];
	const catRows = names.map((name, i) => ({ slug: CAT_SLUG[name] ?? name, name, sort_order: i }));
	const { error: cErr } = await sb.from("blog_categories").upsert(catRows, { onConflict: "slug" });
	if (cErr) throw new Error(`categories: ${cErr.message}`);
	const { data: cats } = await sb.from("blog_categories").select("id,name");
	const catId = new Map((cats ?? []).map((c) => [c.name as string, c.id as string]));

	// 3) 글
	for (const p of BLOG_POSTS) {
		const { error } = await sb.from("blog_posts").upsert(
			{
				slug: p.slug,
				title: p.title,
				excerpt: p.excerpt,
				content: p.content,
				cover_url: p.cover ?? null,
				tldr: p.tldr ?? null,
				faq: p.faq ?? [],
				sources: p.sources ?? [],
				category_id: catId.get(p.category) ?? null,
				author_id: author.id,
				status: "published",
				published_at: kstIso(p.date),
				updated_at: kstIso(p.dateModified ?? p.date),
				meta_title: p.metaTitle ?? null,
				meta_description: p.metaDescription ?? null,
			},
			{ onConflict: "slug" },
		);
		if (error) throw new Error(`post ${p.slug}: ${error.message}`);
	}

	console.log(`seeded: ${BLOG_POSTS.length} posts, ${catRows.length} categories, 1 author`);
};

main().catch((e) => {
	console.error(e);
	process.exit(1);
});
