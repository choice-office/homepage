import { createClient } from "@supabase/supabase-js";
import { unstable_cache } from "next/cache";
import { SERVICES } from "./site-data";

// 블로그 공개 읽기 레이어 — Supabase(blog_posts)에서 published 글만 읽는다(RLS).
// 쓰기(작성/수정)는 추후 관리자에서 service_role로. 데이터 설계: docs/BLOG.md, docs/BLOG-SEO.md
//
// ★ 조회는 두 층이다 — 본문(content)은 정말 필요한 곳에서만 가져온다.
//   - 목록층(BlogPostCard): 카드 렌더 컬럼만 + DB에서 range 페이지네이션.
//   - 상세층(BlogPost): 본문 포함. 단건(getPostBySlug) 또는 RSS 상위 N건에서만.
//   전체 글을 본문까지 한 덩어리로 캐싱하던 이전 구조는 Next Data Cache의 2MB/엔트리
//   한도(incremental-cache: "items over 2MB can not be cached")에 근접해 있었고,
//   글이 몇 건만 늘어도 캐시 저장이 조용히 실패해 매 요청 풀조회로 떨어졌다.

export type BlogFaq = { q: string; a: string };
export type BlogSource = { label: string; href: string };

/** 카드/목록 렌더에 필요한 최소 필드 — 본문(content) 없음 */
export type BlogPostCard = {
	slug: string;
	category: string;
	categorySlug: string;
	title: string;
	excerpt: string;
	date: string; // yyyy-mm-dd (= published_at)
	cover?: string;
	coverAlt?: string;
	tags?: string[]; // 해시태그(= blog_posts.tags text[])
};

export type BlogPost = BlogPostCard & {
	author: string;
	authorRole?: string; // 저자 직함(예: 출입국·비자 전문 행정사) — E-E-A-T
	authorCredentials?: string; // 등록번호 등 검증 가능한 자격 — JSON-LD/표기
	content: string; // HTML
	tldr?: string;
	faq?: BlogFaq[];
	sources?: BlogSource[];
	dateModified?: string; // yyyy-mm-dd (= updated_at)
	metaTitle?: string;
	metaDescription?: string;
	isFeatured: boolean; // 홈 대표글 지정(관리자)
	featuredOrder?: number; // 대표글 노출 순서(작을수록 먼저)
	sourceUrl?: string; // 원문(네이버 블로그) 링크 — 상세 하단 "원문 보기"
};

export const BLOG_PAGE_SIZE = 9;

export const formatBlogDate = (iso: string): string => iso.slice(0, 10).replaceAll("-", ".");

// 커버 미등록 시 폴백 — 본문 첫 이미지. 상세 OG 이미지에서만 쓴다(본문이 이미 있는 자리).
// 목록은 cover_url이 채워져 있다는 전제(기존 글 백필 완료 + 신규 저장 시 기록).
export const firstContentImage = (html: string): string | undefined =>
	html.match(/<img[^>]+\bsrc=["']([^"']+)["']/i)?.[1];

// 저자(대표 행정사) 자격·경력 페이지 — E-E-A-T: 상세 바이라인·JSON-LD author.url에서 참조.
export const AUTHOR_PROFILE_PATH = "/members";

const CARD_SELECT =
	"slug,title,excerpt,cover_url,cover_alt,published_at,tags,category:blog_categories(name,slug)";
// 카테고리 slug로 거를 때는 임베드가 inner join이어야 한다.
const CARD_SELECT_INNER = CARD_SELECT.replace("blog_categories(", "blog_categories!inner(");
const FULL_SELECT = `${CARD_SELECT},content,updated_at,tldr,faq,sources,meta_title,meta_description,is_featured,featured_order,source_url,author:blog_authors(name,role,credentials)`;

type Embedded =
	| { name?: string; slug?: string; role?: string; credentials?: string }
	| { name?: string; slug?: string; role?: string; credentials?: string }[]
	| null;
const pick = (e: Embedded, k: "name" | "slug" | "role" | "credentials"): string =>
	(Array.isArray(e) ? e[0]?.[k] : e?.[k]) ?? "";

type CardRow = {
	slug: string;
	title: string;
	excerpt: string;
	cover_url: string | null;
	cover_alt: string | null;
	published_at: string | null;
	tags: string[] | null;
	category: Embedded;
};

type FullRow = CardRow & {
	content: string;
	updated_at: string | null;
	tldr: string | null;
	faq: BlogFaq[] | null;
	sources: BlogSource[] | null;
	meta_title: string | null;
	meta_description: string | null;
	is_featured: boolean;
	featured_order: number | null;
	source_url: string | null;
	author: Embedded;
};

const toCard = (r: CardRow): BlogPostCard => ({
	slug: r.slug,
	category: pick(r.category, "name"),
	categorySlug: pick(r.category, "slug"),
	title: r.title,
	excerpt: r.excerpt,
	date: (r.published_at ?? "").slice(0, 10),
	cover: r.cover_url ?? undefined,
	coverAlt: r.cover_alt ?? undefined,
	tags: r.tags && r.tags.length > 0 ? r.tags : undefined,
});

const toPost = (r: FullRow): BlogPost => ({
	...toCard(r),
	date: (r.published_at ?? r.updated_at ?? "").slice(0, 10),
	author: pick(r.author, "name") || "초이스 행정사사무소",
	authorRole: pick(r.author, "role") || undefined,
	authorCredentials: pick(r.author, "credentials") || undefined,
	content: r.content,
	tldr: r.tldr ?? undefined,
	faq: r.faq && r.faq.length > 0 ? r.faq : undefined,
	sources: r.sources && r.sources.length > 0 ? r.sources : undefined,
	dateModified: r.updated_at ? r.updated_at.slice(0, 10) : undefined,
	metaTitle: r.meta_title ?? undefined,
	metaDescription: r.meta_description ?? undefined,
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

/* ── 목록: 한 페이지 분량만 DB에서 잘라 온다 ───────────────────────────── */

export type BlogPage = { items: BlogPostCard[]; total: number };

const fetchPage = async (
	category: string | undefined,
	page: number,
	pageSize: number,
): Promise<BlogPage> => {
	const supabase = client();
	if (!supabase) return { items: [], total: 0 };
	const from = (page - 1) * pageSize;
	let q = supabase
		.from("blog_posts")
		.select(category ? CARD_SELECT_INNER : CARD_SELECT, { count: "exact" })
		.eq("status", "published");
	if (category) q = q.eq("category.slug", category);
	const { data, error, count } = await q
		.order("published_at", { ascending: false })
		.range(from, from + pageSize - 1);
	if (error || !data) return { items: [], total: 0 };
	return { items: (data as unknown as CardRow[]).map(toCard), total: count ?? 0 };
};

export const getPostPage = unstable_cache(fetchPage, ["blog:page"], {
	revalidate: 60,
	tags: ["blog-posts"],
});

/* ── 카테고리 + 글 수 ─────────────────────────────────────────────────── */

export type BlogCategory = { slug: string; name: string; sortOrder: number; count: number };

const fetchCategories = async (): Promise<BlogCategory[]> => {
	const supabase = client();
	if (!supabase) return [];
	// 카운트는 발행글의 카테고리 slug만 훑어 집계한다(본문 없이 ~12KB).
	const [cats, refs] = await Promise.all([
		supabase.from("blog_categories").select("slug,name,sort_order").order("sort_order"),
		supabase.from("blog_posts").select("category:blog_categories(slug)").eq("status", "published"),
	]);
	if (cats.error || !cats.data) return [];
	const counts = new Map<string, number>();
	for (const r of (refs.data ?? []) as unknown as { category: Embedded }[]) {
		const slug = pick(r.category, "slug");
		if (slug) counts.set(slug, (counts.get(slug) ?? 0) + 1);
	}
	return (cats.data as { slug: string; name: string; sort_order: number | null }[]).map((c) => ({
		slug: c.slug,
		name: c.name,
		sortOrder: c.sort_order ?? 999,
		count: counts.get(c.slug) ?? 0,
	}));
};

export const getCategories = unstable_cache(fetchCategories, ["blog:categories"], {
	revalidate: 60,
	tags: ["blog-posts"],
});

/* ── 상세(본문 포함) ──────────────────────────────────────────────────── */

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
	const { data, error } = await supabase
		.from("blog_posts")
		.select(FULL_SELECT)
		.eq("status", "published")
		.eq("slug", key)
		.maybeSingle();
	if (error || !data) return null;
	return toPost(data as unknown as FullRow);
};

/* ── 색인용(sitemap · generateStaticParams) — slug/날짜만 ─────────────── */

export type BlogPostRef = { slug: string; date: string; dateModified: string };

const fetchRefs = async (): Promise<BlogPostRef[]> => {
	const supabase = client();
	if (!supabase) return [];
	const { data, error } = await supabase
		.from("blog_posts")
		.select("slug,published_at,updated_at")
		.eq("status", "published")
		.order("published_at", { ascending: false });
	if (error || !data) return [];
	return (data as { slug: string; published_at: string | null; updated_at: string | null }[]).map(
		(r) => ({
			slug: r.slug,
			date: (r.published_at ?? "").slice(0, 10),
			dateModified: (r.updated_at ?? r.published_at ?? "").slice(0, 10),
		}),
	);
};

export const getPostRefs = unstable_cache(fetchRefs, ["blog:refs"], {
	revalidate: 300,
	tags: ["blog-posts"],
});

/* ── RSS — 본문이 필요한 유일한 목록. 상위 N건으로 제한 ────────────────── */

const fetchFeed = async (limit: number): Promise<BlogPost[]> => {
	const supabase = client();
	if (!supabase) return [];
	const { data, error } = await supabase
		.from("blog_posts")
		.select(FULL_SELECT)
		.eq("status", "published")
		.order("published_at", { ascending: false })
		.limit(limit);
	if (error || !data) return [];
	return (data as unknown as FullRow[]).map(toPost);
};

export const getFeedPosts = unstable_cache(fetchFeed, ["blog:feed"], {
	revalidate: 300,
	tags: ["blog-posts"],
});

/* ── 카테고리 → 업무분야 매핑 ─────────────────────────────────────────── */

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

const CATEGORIES_BY_SERVICE = Object.entries(SERVICE_BY_CATEGORY).reduce<Record<string, string[]>>(
	(acc, [cat, svc]) => {
		acc[svc] = [...(acc[svc] ?? []), cat];
		return acc;
	},
	{},
);

const fetchByCategories = async (slugs: string[], limit: number): Promise<BlogPostCard[]> => {
	const supabase = client();
	if (!supabase || slugs.length === 0) return [];
	const { data, error } = await supabase
		.from("blog_posts")
		.select(CARD_SELECT_INNER)
		.eq("status", "published")
		.in("category.slug", slugs)
		.order("published_at", { ascending: false })
		.limit(limit);
	if (error || !data) return [];
	return (data as unknown as CardRow[]).map(toCard);
};

const byCategories = unstable_cache(fetchByCategories, ["blog:by-categories"], {
	revalidate: 60,
	tags: ["blog-posts"],
});

// 특정 업무분야(서비스)에 해당하는 발행 글 — 서비스 상세의 "관련 글" 내부링크(SEO·전환·체류).
export const getPostsForService = async (serviceId: string, limit = 4): Promise<BlogPostCard[]> =>
	byCategories(CATEGORIES_BY_SERVICE[serviceId] ?? [], limit);

export const getRelatedPosts = async (
	post: Pick<BlogPost, "slug" | "categorySlug">,
	limit = 3,
): Promise<BlogPostCard[]> => {
	// 같은 카테고리 우선(자기 자신이 섞일 수 있어 +1건 받아 걸러낸다), 모자라면 최신글로 채움.
	const same = (await byCategories([post.categorySlug], limit + 1)).filter(
		(p) => p.slug !== post.slug,
	);
	if (same.length >= limit) return same.slice(0, limit);
	const latest = (await getPostPage(undefined, 1, limit + same.length + 1)).items.filter(
		(p) => p.slug !== post.slug && !same.some((s) => s.slug === p.slug),
	);
	return [...same, ...latest].slice(0, limit);
};

// 홈 대표글 — 칸(슬롯) 단위 모델.
// `featured_order` 는 노출 순서가 아니라 **몇 번 칸인지**(1~limit, 빈틈 허용)를 뜻한다.
//   [null, 2, null, null] → [최신1, 고정글, 최신2, 최신3]
// 고정 칸은 그 자리에 머물고, 빈 칸만 최신 발행글이 순서대로 채운다(글을 새로 쓰면 자동 갱신).
// 지정이 0개면 전부 자동 = 최신 발행글 limit 개. 스키마: supabase/migrations/0005_blog_featured_slot.sql
const fetchFeatured = async (limit: number): Promise<BlogPostCard[]> => {
	const supabase = client();
	if (!supabase) return [];
	const { data } = await supabase
		.from("blog_posts")
		// 카드 컬럼 + 칸 번호(featured_order) — 어느 칸에 앉힐지 알아야 한다.
		.select(`${CARD_SELECT},featured_order`)
		.eq("status", "published")
		.eq("is_featured", true)
		.order("featured_order", { ascending: true, nullsFirst: false })
		.limit(limit);
	// 칸 번호가 범위를 벗어나거나 비어 있는 행은 무시한다(제약이 막지만 방어적으로).
	const pinned = new Map<number, BlogPostCard>();
	for (const row of (data ?? []) as unknown as (CardRow & { featured_order: number | null })[]) {
		const slot = row.featured_order;
		if (!slot || slot < 1 || slot > limit || pinned.has(slot)) continue;
		pinned.set(slot, toCard(row));
	}
	const gaps = Array.from({ length: limit }, (_, i) => i + 1).filter((s) => !pinned.has(s));
	if (gaps.length === 0)
		return Array.from({ length: limit }, (_, i) => pinned.get(i + 1) as BlogPostCard);
	// 빈 칸을 채울 최신글 — 고정된 글이 중복되지 않게 넉넉히 받아 걸러낸다.
	const usedSlugs = new Set([...pinned.values()].map((p) => p.slug));
	const fill = (await getPostPage(undefined, 1, limit + pinned.size)).items.filter(
		(p) => !usedSlugs.has(p.slug),
	);
	for (const [i, slot] of gaps.entries()) {
		const post = fill[i];
		if (post) pinned.set(slot, post);
	}
	// 채울 글이 모자라면 그 칸은 빠진다(홈은 남은 카드만 렌더).
	return Array.from({ length: limit }, (_, i) => pinned.get(i + 1)).filter(
		(p): p is BlogPostCard => !!p,
	);
};

export const getFeaturedPosts = unstable_cache(fetchFeatured, ["blog:featured"], {
	revalidate: 60,
	tags: ["blog-posts"],
});
