import type { Metadata } from "next";
import Link from "next/link";
import { BlogCard } from "@/components/site/blog-card";
import { PageHero } from "@/components/site/sections";
import { BLOG_PAGE_SIZE, getPublishedPosts } from "@/lib/blog";

export const metadata: Metadata = {
	title: "출입국·비자 칼럼",
	description: "자주 묻는 절차와 요건을, 사례 중심으로 알기 쉽게 정리한 출입국·비자 칼럼입니다.",
};

// 글 등록(관리자) 시 반영되도록 ISR — 60초마다 재검증
export const revalidate = 60;

const pageHref = (n: number) => (n <= 1 ? "/blog" : `/blog?page=${n}`);

const Pagination = ({ current, totalPages }: { current: number; totalPages: number }) => {
	const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
	const itemStyle = (active: boolean) => ({
		display: "inline-flex",
		alignItems: "center",
		justifyContent: "center",
		minWidth: 40,
		height: 40,
		padding: "0 12px",
		borderRadius: "var(--radius)",
		border: "1px solid var(--border-default)",
		fontSize: 15,
		fontWeight: active ? 700 : 500,
		background: active ? "var(--color-primary)" : "var(--surface-card)",
		color: active ? "var(--color-primary-foreground, #fff)" : "var(--text-body)",
	});
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
			{current > 1 && (
				<Link className="lk" href={pageHref(current - 1)} style={itemStyle(false)} rel="prev">
					이전
				</Link>
			)}
			{pages.map((n) => (
				<Link
					key={n}
					className="lk"
					href={pageHref(n)}
					aria-current={n === current ? "page" : undefined}
					style={itemStyle(n === current)}
				>
					{n}
				</Link>
			))}
			{current < totalPages && (
				<Link className="lk" href={pageHref(current + 1)} style={itemStyle(false)} rel="next">
					다음
				</Link>
			)}
		</nav>
	);
};

export default async function BlogPage({
	searchParams,
}: {
	searchParams: Promise<{ page?: string }>;
}) {
	const { page } = await searchParams;
	const allPosts = await getPublishedPosts();
	const totalPages = Math.max(1, Math.ceil(allPosts.length / BLOG_PAGE_SIZE));
	const current = Math.min(totalPages, Math.max(1, Number(page) || 1));
	const start = (current - 1) * BLOG_PAGE_SIZE;
	const posts = allPosts.slice(start, start + BLOG_PAGE_SIZE);

	return (
		<>
			<PageHero
				eyebrow="Blog"
				title="출입국·비자 칼럼"
				sub="자주 묻는 절차와 요건을, 사례 중심으로 알기 쉽게 정리합니다."
				crumbs={[{ label: "홈", route: "home" }, { label: "블로그" }]}
			/>
			<section className="section" style={{ background: "var(--surface-page)" }}>
				<div className="container">
					<div data-stagger className="grid-3">
						{posts.map((p) => (
							<BlogCard key={p.slug} post={p} />
						))}
					</div>
					{totalPages > 1 && <Pagination current={current} totalPages={totalPages} />}
				</div>
			</section>
		</>
	);
}
