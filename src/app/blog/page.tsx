import type { Metadata } from "next";
import Link from "next/link";
import { BlogCard } from "@/components/site/blog-card";
import { Icon } from "@/components/site/icon";
import { PageHero } from "@/components/site/sections";
import { BLOG_PAGE_SIZE, getCategories, getPostPage } from "@/lib/blog";
import { buildPageBlock, isMobilePage } from "@/lib/pagination";
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

// 페이지 버튼 공통 골격 — 30x30, 숫자는 테두리 없이 글자만 / 이동 버튼만 테두리 상자
const CELL_CLS =
	"inline-flex h-[30px] min-w-[30px] items-center justify-center text-[13.5px] leading-none";
const numCls = (active: boolean) =>
	cn(
		CELL_CLS,
		"lk px-[7px]",
		active
			? "font-bold text-[color:var(--color-primary)]"
			: "font-medium text-[color:var(--text-body)]",
	);
const ARROW_CLS = cn(
	CELL_CLS,
	"lk rounded-[var(--radius)] border border-[var(--border-default)] bg-[var(--surface-card)] text-[color:var(--text-body)]",
);
// 이동 버튼 묶음과 숫자 사이 간격
const GAP_CLS = "w-1.5";

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
	const { pages, showFirst, showPrev, showNext, showLast } = buildPageBlock(current, totalPages);
	return (
		<nav
			aria-label="블로그 페이지"
			className="mt-10 flex flex-wrap items-center justify-center gap-1"
		>
			{showFirst && (
				<Link className={ARROW_CLS} href={buildHref(1, category)} aria-label="첫 페이지">
					<Icon n="chevrons-left" className="size-[15px]" />
				</Link>
			)}
			{showPrev && (
				<Link
					className={ARROW_CLS}
					href={buildHref(current - 1, category)}
					rel="prev"
					aria-label="이전 페이지"
				>
					<Icon n="chevron-left" className="size-[15px]" />
				</Link>
			)}
			{(showFirst || showPrev) && <span className={GAP_CLS} aria-hidden="true" />}
			{pages.map((n) => (
				<Link
					key={n}
					className={cn(numCls(n === current), !isMobilePage(n, current) && "max-sm:hidden")}
					href={buildHref(n, category)}
					aria-current={n === current ? "page" : undefined}
				>
					{n}
				</Link>
			))}
			{(showNext || showLast) && <span className={GAP_CLS} aria-hidden="true" />}
			{showNext && (
				<Link
					className={ARROW_CLS}
					href={buildHref(current + 1, category)}
					rel="next"
					aria-label="다음 페이지"
				>
					<Icon n="chevron-right" className="size-[15px]" />
				</Link>
			)}
			{showLast && (
				<Link
					className={ARROW_CLS}
					href={buildHref(totalPages, category)}
					aria-label="마지막 페이지"
				>
					<Icon n="chevrons-right" className="size-[15px]" />
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
				image="/블로그-hero.png"
				imagePosition="object-[center_72%]"
			/>
			<section className={cn("section", "bg-(--surface-page)")}>
				<div className="blog-layout wrap">
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
