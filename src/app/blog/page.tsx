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
// 좌우 여백을 두지 않아 한 자리("1")와 두 자리("20") 칸 폭이 같다 → 블록이 넘어가도 줄 폭 불변.
const CELL_CLS =
	"inline-flex h-[30px] min-w-[30px] items-center justify-center px-0 text-[13.5px] leading-none";
const numCls = (active: boolean) =>
	cn(
		CELL_CLS,
		"lk",
		// 현재 페이지가 가장 진해야 한다 — primary(#6c5d4c)는 본문색(#3f3a34)보다 밝아 오히려 흐려 보였다.
		active
			? "font-extrabold text-[color:var(--text-heading)]"
			: "font-medium text-[color:var(--text-muted)]",
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
	const block = buildPageBlock(current, totalPages);
	// 안 쓰이는 이동 버튼은 자리를 비워둔다(invisible) — 페이지를 넘겨도 버튼이 좌우로 밀리지 않게.
	const arrow = (show: boolean, icon: string, label: string, page: number, rel?: string) =>
		show ? (
			<Link
				className={ARROW_CLS}
				href={buildHref(page, category)}
				rel={rel}
				aria-label={label}
				key={label}
			>
				<Icon n={icon} className="size-[15px]" />
			</Link>
		) : (
			<span className={cn(ARROW_CLS, "invisible")} aria-hidden="true" key={label} />
		);
	return (
		<nav aria-label="블로그 페이지" className="mt-10 flex items-center justify-center gap-1">
			{block.reserveEdge && arrow(block.showFirst, "chevrons-left", "첫 페이지", 1)}
			{block.reserveStep &&
				arrow(block.showPrev, "chevron-left", "이전 페이지", current - 1, "prev")}
			{block.reserveStep && <span className={GAP_CLS} aria-hidden="true" />}
			{block.pages.map((page) => (
				<Link
					key={page}
					className={cn(numCls(page === current), !isMobilePage(page, current) && "max-sm:hidden")}
					href={buildHref(page, category)}
					aria-current={page === current ? "page" : undefined}
				>
					{page}
				</Link>
			))}
			{block.reserveStep && <span className={GAP_CLS} aria-hidden="true" />}
			{block.reserveStep &&
				arrow(block.showNext, "chevron-right", "다음 페이지", current + 1, "next")}
			{block.reserveEdge && arrow(block.showLast, "chevrons-right", "마지막 페이지", totalPages)}
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
						{/* blog-list: PC 에서는 게시글 목록(썸네일 좌 · 제목/내용 우) 한 행씩.
						    태블릿·모바일은 기존 카드 규칙(.blog-grid) 유지. 홈 프리뷰와 구분하려고 별도 클래스. */}
						{posts.length > 0 ? (
							<div data-stagger className="grid-3 blog-grid blog-list">
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
