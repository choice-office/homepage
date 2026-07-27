import { createClient } from "@supabase/supabase-js";
import { unstable_cache } from "next/cache";
import { SERVICES } from "./site-data";

// 블로그 공개 읽기 레이어 — Supabase(blog_posts)에서 published 글만 읽는다(RLS).
// 쓰기(작성/수정)는 추후 관리자에서 service_role로. 데이터 설계: docs/BLOG.md, docs/BLOG-SEO.md

export type BlogFaq = { q: string; a: string };
export type BlogSource = { label: string; href: string };

export type BlogPost = {
	slug: string;
	category: string;
	categorySlug: string;
	title: string;
	excerpt: string;
	author: string;
	authorRole?: string; // 저자 직함(예: 출입국·비자 전문 행정사) — E-E-A-T
	authorCredentials?: string; // 등록번호 등 검증 가능한 자격 — JSON-LD/표기
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
	isFeatured: boolean; // 홈 대표글 지정(관리자)
	featuredOrder?: number; // 대표글 노출 순서(작을수록 먼저)
	sourceUrl?: string; // 원문(네이버 블로그) 링크 — 상세 하단 "원문 보기"
};

export const BLOG_PAGE_SIZE = 9;

export const formatBlogDate = (iso: string): string => iso.slice(0, 10).replaceAll("-", ".");

// 커버(썸네일) 미등록 시 폴백 — 본문(HTML) 첫 이미지 URL. 없으면 undefined(카드는 로고로 대체).
export const firstContentImage = (html: string): string | undefined =>
	html.match(/<img[^>]+\bsrc=["']([^"']+)["']/i)?.[1];

// tags 컬럼은 마이그레이션 후에만 존재 → 선택 시도 후 없으면 base로 폴백(아래 runSelect).
const SELECT_BASE =
	"slug,title,excerpt,content,cover_url,cover_alt,tldr,faq,sources,published_at,updated_at,meta_title,meta_description,is_featured,featured_order,source_url,category:blog_categories(name,slug),author:blog_authors(name,role,credentials)";

// 저자(대표 행정사) 자격·경력 페이지 — E-E-A-T: 상세 바이라인·JSON-LD author.url에서 참조.
export const AUTHOR_PROFILE_PATH = "/members";
const SELECT_WITH_TAGS = `${SELECT_BASE},tags`;

type Embedded =
	| { name: string; slug?: string; role?: string; credentials?: string }
	| { name: string; slug?: string; role?: string; credentials?: string }[]
	| null;
const pickName = (e: Embedded): string => (Array.isArray(e) ? (e[0]?.name ?? "") : (e?.name ?? ""));
const pickSlug = (e: Embedded): string => (Array.isArray(e) ? (e[0]?.slug ?? "") : (e?.slug ?? ""));
const pickRole = (e: Embedded): string => (Array.isArray(e) ? (e[0]?.role ?? "") : (e?.role ?? ""));
const pickCred = (e: Embedded): string =>
	Array.isArray(e) ? (e[0]?.credentials ?? "") : (e?.credentials ?? "");

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
	is_featured: boolean;
	featured_order: number | null;
	source_url: string | null;
	category: Embedded;
	author: Embedded;
};

const toPost = (r: Row): BlogPost => ({
	slug: r.slug,
	category: pickName(r.category),
	categorySlug: pickSlug(r.category),
	title: r.title,
	excerpt: r.excerpt,
	author: pickName(r.author) || "초이스 행정사 사무소",
	authorRole: pickRole(r.author) || undefined,
	authorCredentials: pickCred(r.author) || undefined,
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
	isFeatured: r.is_featured ?? false,
	featuredOrder: r.featured_order ?? undefined,
	sourceUrl: r.source_url ?? undefined,
});

const client = () => {
	const url = process.env.SUPABASE_URL;
	const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
	if (!url || !key) return null;
	return createClient(url, key, { auth: { persistSession: false } });
};

const fetchPublishedPosts = async (): Promise<BlogPost[]> => {
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

// 발행글 전체(본문 포함 ~1MB)를 Data Cache로 캐싱한다. /blog는 searchParams로 동적 렌더라
// 페이지네이션 클릭마다 Supabase 전체를 재조회(≈2초)하던 것을 캐시 히트로 대체(즉시).
// 커버가 전부 본문 첫 이미지에서 파생되어 content가 필요하므로 트림 불가 → 전체 캐싱이 정답.
// revalidate 60s(페이지의 revalidate와 동일). 글 발행 시 즉시 반영이 필요하면 revalidateTag("blog-posts").
export const getPublishedPosts = unstable_cache(fetchPublishedPosts, ["blog:published-posts"], {
	revalidate: 60,
	tags: ["blog-posts"],
});

// 블로그 카테고리 전체(네이버 블로그와 동일) — 글 수와 무관하게 모두 노출한다.
export type BlogCategory = { slug: string; name: string; sortOrder: number };

// 블로그 카테고리 → 업무분야(서비스) 매핑. 상세 하단 "관련 업무분야" 내부링크·전환용.
// 해당 서비스가 없는 분류(해외서류·후기·공지 등)는 매핑에서 제외 → 링크 미노출.
const SERVICE_BY_CATEGORY: Record<string, string> = {
	c3: "short",
	c4: "short",
	d7d8: "resident",
	e6: "e6",
	e7: "e7",
	d10: "e7",
	h2: "e7",
	f123: "f6",
	f6: "f6",
	f4: "f4",
	"f4-male": "f4",
	"f4-extend": "f4",
	"f4-chinese": "f4",
	"residence-crime": "f4",
	"residence-info": "f4",
	f5: "f5",
	nationality: "nat",
	naturalization: "nat",
};

export const serviceForCategory = (
	categorySlug: string,
): { id: string; title: string; code: string } | null => {
	const id = SERVICE_BY_CATEGORY[categorySlug];
	if (!id) return null;
	const svc = SERVICES.find((s) => s.id === id);
	return svc ? { id, title: svc.title, code: svc.code } : null;
};

// 특정 업무분야(서비스)에 해당하는 발행 글 — 서비스 상세의 "관련 글" 내부링크(SEO·전환·체류).
// 카테고리→서비스 매핑(SERVICE_BY_CATEGORY)의 역방향으로 최신순 상위 N개.
export const getPostsForService = async (serviceId: string, limit = 4): Promise<BlogPost[]> => {
	const all = await getPublishedPosts(); // published, 최신순
	return all.filter((p) => SERVICE_BY_CATEGORY[p.categorySlug] === serviceId).slice(0, limit);
};

export const getCategories = async (): Promise<BlogCategory[]> => {
	const supabase = client();
	if (!supabase) return [];
	const { data, error } = await supabase
		.from("blog_categories")
		.select("slug,name,sort_order")
		.order("sort_order", { ascending: true });
	if (error || !data) return [];
	return (data as { slug: string; name: string; sort_order: number | null }[]).map((c) => ({
		slug: c.slug,
		name: c.name,
		sortOrder: c.sort_order ?? 999,
	}));
};

export const getPostBySlug = async (slug: string): Promise<BlogPost | null> => {
	const supabase = client();
	if (!supabase) return null;
	// Next는 동적 세그먼트(params.id)를 URL 인코딩된 상태로 넘길 수 있다.
	// DB slug는 한글 원문이므로 디코드해서 매칭한다(원문이 들어오면 no-op).
	let key = slug;
	try {
		key = decodeURIComponent(slug);
	} catch {
		// 잘못된 인코딩이면 원문 그대로 사용
	}
	const run = (select: string) =>
		supabase
			.from("blog_posts")
			.select(select)
			.eq("status", "published")
			.eq("slug", key)
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

// 홈 대표글 — 관리자 지정(is_featured, featured_order 순) 우선, 부족하면 최신 글로 채움.
export const getFeaturedPosts = async (limit = 3): Promise<BlogPost[]> => {
	const all = await getPublishedPosts(); // published, 최신순
	const featured = all
		.filter((p) => p.isFeatured)
		.sort((a, b) => (a.featuredOrder ?? 999) - (b.featuredOrder ?? 999));
	const out: BlogPost[] = [];
	const seen = new Set<string>();
	for (const p of [...featured, ...all]) {
		if (seen.has(p.slug)) continue;
		seen.add(p.slug);
		out.push(p);
		if (out.length >= limit) break;
	}
	return out;
};
