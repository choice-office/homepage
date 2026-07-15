import { createClient } from "@supabase/supabase-js";

// 블로그 공개 읽기 레이어 — Supabase(blog_posts)에서 published 글만 읽는다(RLS).
// 쓰기(작성/수정)는 추후 관리자에서 service_role로. 데이터 설계: docs/BLOG.md, docs/BLOG-SEO.md

export type BlogFaq = { q: string; a: string };
export type BlogSource = { label: string; href: string };

export type BlogPost = {
	slug: string;
	category: string;
	title: string;
	excerpt: string;
	author: string;
	date: string; // yyyy-mm-dd (= published_at)
	content: string; // HTML
	cover?: string;
	coverAlt?: string;
	tldr?: string;
	faq?: BlogFaq[];
	sources?: BlogSource[];
	dateModified?: string; // yyyy-mm-dd (= updated_at)
	metaTitle?: string;
	metaDescription?: string;
	tags?: string[]; // 해시태그(= blog_posts.tags text[]). 칩 렌더 + BlogPosting.keywords
};

export const BLOG_PAGE_SIZE = 9;

export const formatBlogDate = (iso: string): string => iso.slice(0, 10).replaceAll("-", ".");

// tags 컬럼은 마이그레이션 후에만 존재 → 선택 시도 후 없으면 base로 폴백(아래 runSelect).
const SELECT_BASE =
	"slug,title,excerpt,content,cover_url,cover_alt,tldr,faq,sources,published_at,updated_at,meta_title,meta_description,category:blog_categories(name),author:blog_authors(name)";
const SELECT_WITH_TAGS = `${SELECT_BASE},tags`;

type Embedded = { name: string } | { name: string }[] | null;
const pickName = (e: Embedded): string => (Array.isArray(e) ? (e[0]?.name ?? "") : (e?.name ?? ""));

type Row = {
	slug: string;
	title: string;
	excerpt: string;
	content: string;
	cover_url: string | null;
	cover_alt: string | null;
	tldr: string | null;
	faq: BlogFaq[] | null;
	sources: BlogSource[] | null;
	published_at: string | null;
	updated_at: string | null;
	meta_title: string | null;
	meta_description: string | null;
	tags: string[] | null;
	category: Embedded;
	author: Embedded;
};

const toPost = (r: Row): BlogPost => ({
	slug: r.slug,
	category: pickName(r.category),
	title: r.title,
	excerpt: r.excerpt,
	author: pickName(r.author) || "초이스 행정사 사무소",
	date: (r.published_at ?? r.updated_at ?? "").slice(0, 10),
	content: r.content,
	cover: r.cover_url ?? undefined,
	coverAlt: r.cover_alt ?? undefined,
	tldr: r.tldr ?? undefined,
	faq: r.faq && r.faq.length > 0 ? r.faq : undefined,
	sources: r.sources && r.sources.length > 0 ? r.sources : undefined,
	dateModified: r.updated_at ? r.updated_at.slice(0, 10) : undefined,
	metaTitle: r.meta_title ?? undefined,
	metaDescription: r.meta_description ?? undefined,
	tags: r.tags && r.tags.length > 0 ? r.tags : undefined,
});

const client = () => {
	const url = process.env.SUPABASE_URL;
	const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
	if (!url || !key) return null;
	return createClient(url, key, { auth: { persistSession: false } });
};

export const getPublishedPosts = async (): Promise<BlogPost[]> => {
	const supabase = client();
	if (!supabase) return [];
	const run = (select: string) =>
		supabase
			.from("blog_posts")
			.select(select)
			.eq("status", "published")
			.order("published_at", { ascending: false });
	// tags 포함으로 먼저 시도 → 컬럼 미적용(마이그레이션 전) 환경이면 base로 폴백.
	let { data, error } = await run(SELECT_WITH_TAGS);
	if (error) ({ data, error } = await run(SELECT_BASE));
	if (error || !data) return [];
	return (data as unknown as Row[]).map(toPost);
};

export const getPostBySlug = async (slug: string): Promise<BlogPost | null> => {
	const supabase = client();
	if (!supabase) return null;
	const run = (select: string) =>
		supabase
			.from("blog_posts")
			.select(select)
			.eq("status", "published")
			.eq("slug", slug)
			.maybeSingle();
	let { data, error } = await run(SELECT_WITH_TAGS);
	if (error) ({ data, error } = await run(SELECT_BASE));
	if (error || !data) return null;
	return toPost(data as unknown as Row);
};

export const getRelatedPosts = async (post: BlogPost, limit = 3): Promise<BlogPost[]> => {
	const all = await getPublishedPosts();
	const same = all.filter((p) => p.slug !== post.slug && p.category === post.category);
	const rest = all.filter((p) => p.slug !== post.slug);
	return (same.length > 0 ? same : rest).slice(0, limit);
};
