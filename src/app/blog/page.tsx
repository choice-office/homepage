import type { Metadata } from "next";
import Link from "next/link";
import { BlogCard } from "@/components/site/blog-card";
import { Icon } from "@/components/site/icon";
import { PageHero } from "@/components/site/sections";
import { BLOG_PAGE_SIZE, getCategories, getPublishedPosts } from "@/lib/blog";

export const metadata: Metadata = {
	title: "출입국·비자 칼럼",
	description: "자주 묻는 절차와 요건을, 사례 중심으로 알기 쉽게 정리한 출입국·비자 칼럼입니다.",
	alternates: { canonical: "/blog" },
};

// 글 등록(관리자) 시 반영되도록 ISR — 60초마다 재검증
export const revalidate = 60;

const buildHref = (page: number, category?: string) => {
	const p = new URLSearchParams();
	if (category) p.set("category", category);
	if (page > 1) p.set("page", String(page));
	const qs = p.toString();
	return qs ? `/blog?${qs}` : "/blog";
};

// 현재 페이지 주변 window(±1) + 처음/끝만 노출, 사이가 벌어지면 … (한 칸만 생략될 땐 실제 숫자 노출)
const buildPageList = (current: number, total: number): (number | "…")[] => {
	const nums = new Set<number>([1, total]);
	for (let i = current - 1; i <= current + 1; i++) {
		if (i >= 1 && i <= total) nums.add(i);
	}
	const sorted = [...nums].sort((a, b) => a - b);
	const out: (number | "…")[] = [];
	let prev = 0;
	for (const n of sorted) {
		if (prev && n - prev > 1) out.push(n - prev === 2 ? prev + 1 : "…");
		out.push(n);
		prev = n;
	}
	return out;
};

const Pagination = ({
	current,
	totalPages,
	category,
}: {
	current: number;
	totalPages: number;
	category?: string;
}) => {
	if (totalPages <= 1) return null;
	const items = buildPageList(current, totalPages);
	const base = {
		display: "inline-flex",
		alignItems: "center",
		justifyContent: "center",
		minWidth: 40,
		height: 40,
		borderRadius: "var(--radius)",
		fontSize: 15,
	} as const;
	const numStyle = (active: boolean) =>
		({
			...base,
			padding: "0 12px",
			border: "1px solid var(--border-default)",
			fontWeight: active ? 700 : 500,
			background: active ? "var(--color-primary)" : "var(--surface-card)",
			color: active ? "var(--color-primary-foreground, #fff)" : "var(--text-body)",
		}) as const;
	const arrowStyle = (disabled: boolean) =>
		({
			...base,
			padding: 0,
			border: "1px solid var(--border-default)",
			background: "var(--surface-card)",
			color: disabled ? "var(--text-muted)" : "var(--text-body)",
			opacity: disabled ? 0.4 : 1,
			pointerEvents: disabled ? "none" : "auto",
		}) as const;
	const ellipsisStyle = {
		...base,
		minWidth: 24,
		color: "var(--text-muted)",
	} as const;
	const prevDisabled = current <= 1;
	const nextDisabled = current >= totalPages;
	return (
		<nav
			aria-label="블로그 페이지"
			style={{
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				gap: 8,
				marginTop: 40,
				flexWrap: "wrap",
			}}
		>
			{prevDisabled ? (
				<span aria-disabled="true" style={arrowStyle(true)}>
					<Icon n="chevron-left" style={{ width: 18, height: 18 }} />
				</span>
			) : (
				<Link
					className="lk"
					href={buildHref(current - 1, category)}
					style={arrowStyle(false)}
					rel="prev"
					aria-label="이전 페이지"
				>
					<Icon n="chevron-left" style={{ width: 18, height: 18 }} />
				</Link>
			)}
			{items.map((item, i) =>
				item === "…" ? (
					// biome-ignore lint/suspicious/noArrayIndexKey: 정적 페이지 목록 — … 위치는 인덱스로 안정적
					<span key={`gap-${i}`} style={ellipsisStyle} aria-hidden="true">
						…
					</span>
				) : (
					<Link
						key={item}
						className="lk"
						href={buildHref(item, category)}
						aria-current={item === current ? "page" : undefined}
						style={numStyle(item === current)}
					>
						{item}
					</Link>
				),
			)}
			{nextDisabled ? (
				<span aria-disabled="true" style={arrowStyle(true)}>
					<Icon n="chevron-right" style={{ width: 18, height: 18 }} />
				</span>
			) : (
				<Link
					className="lk"
					href={buildHref(current + 1, category)}
					style={arrowStyle(false)}
					rel="next"
					aria-label="다음 페이지"
				>
					<Icon n="chevron-right" style={{ width: 18, height: 18 }} />
				</Link>
			)}
		</nav>
	);
};

export default async function BlogPage({
	searchParams,
}: {
	searchParams: Promise<{ page?: string; category?: string }>;
}) {
	const { page, category } = await searchParams;
	const [allPosts, allCategories] = await Promise.all([getPublishedPosts(), getCategories()]);

	// 네이버 블로그와 동일한 카테고리 전체를 sort_order 순으로 노출(글 0개도 표시).
	const countMap = new Map<string, number>();
	for (const p of allPosts) {
		if (!p.categorySlug) continue;
		countMap.set(p.categorySlug, (countMap.get(p.categorySlug) ?? 0) + 1);
	}
	const categories = allCategories.map((c) => ({
		slug: c.slug,
		name: c.name,
		count: countMap.get(c.slug) ?? 0,
	}));
	const validSlugs = new Set(allCategories.map((c) => c.slug));

	const active = category && validSlugs.has(category) ? category : undefined;
	const filtered = active ? allPosts.filter((p) => p.categorySlug === active) : allPosts;

	const totalPages = Math.max(1, Math.ceil(filtered.length / BLOG_PAGE_SIZE));
	const current = Math.min(totalPages, Math.max(1, Number(page) || 1));
	const start = (current - 1) * BLOG_PAGE_SIZE;
	const posts = filtered.slice(start, start + BLOG_PAGE_SIZE);

	return (
		<>
			<PageHero
				title="출입국·비자 칼럼"
				sub="자주 묻는 절차와 요건을, 사례 중심으로 알기 쉽게 정리합니다."
				crumbs={[{ label: "홈", route: "home" }, { label: "블로그" }]}
			/>
			<section className="section" style={{ background: "var(--surface-page)" }}>
				<div className="container blog-layout">
					<aside className="blog-cats" aria-label="카테고리">
						<Link className="blog-cat" data-active={!active} href={buildHref(1)}>
							<span>전체</span>
							<span className="blog-cat-n">{allPosts.length}</span>
						</Link>
						{categories.map((c) => (
							<Link
								key={c.slug}
								className="blog-cat"
								data-active={active === c.slug}
								href={buildHref(1, c.slug)}
							>
								<span>{c.name}</span>
								<span className="blog-cat-n">{c.count}</span>
							</Link>
						))}
					</aside>
					<div className="blog-main">
						{posts.length > 0 ? (
							<div data-stagger className="grid-3 blog-grid">
								{posts.map((p) => (
									<BlogCard key={p.slug} post={p} compact />
								))}
							</div>
						) : (
							<p style={{ textAlign: "center", color: "var(--text-muted)", padding: "48px 0" }}>
								등록된 글이 없습니다.
							</p>
						)}
						{posts.length > 0 && (
							<Pagination current={current} totalPages={totalPages} category={active} />
						)}
					</div>
				</div>
			</section>
		</>
	);
}
