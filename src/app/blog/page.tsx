import type { Metadata } from "next";
import Link from "next/link";
import { BlogCard } from "@/components/site/blog-card";
import { Icon } from "@/components/site/icon";
import { PageHero } from "@/components/site/sections";
import { BLOG_PAGE_SIZE, getCategories, getPostPage } from "@/lib/blog";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
	title: "출입국·비자 칼럼",
	description: "자주 묻는 절차와 요건을, 사례 중심으로 알기 쉽게 정리한 출입국·비자 칼럼입니다.",
	alternates: {
		canonical: "/blog",
		types: {
			"application/rss+xml": [{ url: "/feed.xml", title: "초이스 행정사사무소 · 블로그" }],
		},
	},
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
			className="mt-10 flex flex-wrap items-center justify-center gap-2"
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
	const allCategories = await getCategories();

	// 카테고리는 sort_order 순으로 노출하되, 글이 0개인 분류는 숨긴다.
	const categories = allCategories.filter((c) => c.count > 0);
	const active = category && allCategories.some((c) => c.slug === category) ? category : undefined;
	const totalAll = allCategories.reduce((n, c) => n + c.count, 0);

	// 요청 페이지 분량만 DB에서 잘라 온다(range) — 전체 조회 없음.
	const requested = Math.max(1, Number(page) || 1);
	const first = await getPostPage(active, requested, BLOG_PAGE_SIZE);
	const totalPages = Math.max(1, Math.ceil(first.total / BLOG_PAGE_SIZE));
	// 범위를 벗어난 page= 로 들어오면 마지막 페이지로 보정해 다시 한 번만 조회한다.
	const current = Math.min(totalPages, requested);
	const { items: posts } =
		current === requested ? first : await getPostPage(active, current, BLOG_PAGE_SIZE);

	return (
		<>
			<PageHero
				title="출입국·비자 칼럼"
				sub="자주 묻는 절차와 요건을, 사례 중심으로 알기 쉽게 정리합니다."
				crumbs={[{ label: "홈", route: "home" }, { label: "블로그" }]}
			/>
			<section className={cn("section", "bg-(--surface-page)")}>
				<div className="blog-layout container">
					<aside className="blog-cats" aria-label="카테고리">
						<Link className="blog-cat" data-active={!active} href={buildHref(1)}>
							<span>전체</span>
							<span className="blog-cat-n">{totalAll}</span>
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
							<p className="py-12 text-center text-(--text-muted)">등록된 글이 없습니다.</p>
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
