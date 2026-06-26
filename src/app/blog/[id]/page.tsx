import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BlogCard } from "@/components/site/blog-card";
import { Badge } from "@/components/site/ds";
import { Icon } from "@/components/site/icon";
import { siteConfig } from "@/config/site";
import { BLOG_POSTS, formatBlogDate, getBlogPost } from "@/lib/blog-data";

type Params = { params: Promise<{ id: string }> };

export const generateStaticParams = () => BLOG_POSTS.map((p) => ({ id: p.slug }));

export const generateMetadata = async ({ params }: Params): Promise<Metadata> => {
	const { id } = await params;
	const post = getBlogPost(id);
	if (!post) return {};
	const url = `${siteConfig.url}/blog/${post.slug}`;
	return {
		title: post.title,
		description: post.excerpt,
		alternates: { canonical: url },
		openGraph: {
			type: "article",
			title: post.title,
			description: post.excerpt,
			url,
			images: post.cover ? [{ url: post.cover }] : undefined,
		},
	};
};

export default async function BlogDetailPage({ params }: Params) {
	const { id } = await params;
	const post = getBlogPost(id);
	if (!post) notFound();

	const sameCategory = BLOG_POSTS.filter(
		(p) => p.slug !== post.slug && p.category === post.category,
	);
	const fallback = BLOG_POSTS.filter((p) => p.slug !== post.slug);
	const related = (sameCategory.length > 0 ? sameCategory : fallback).slice(0, 3);

	return (
		<>
			<header
				className="section"
				style={{ paddingTop: 128, paddingBottom: 0, background: "var(--surface-page)" }}
			>
				<div className="blog-prose container">
					<nav
						aria-label="경로"
						style={{
							display: "flex",
							alignItems: "center",
							gap: 8,
							fontSize: 14,
							color: "var(--text-muted)",
							marginBottom: 20,
							flexWrap: "wrap",
						}}
					>
						<Link className="lk" href="/" style={{ color: "var(--text-muted)" }}>
							홈
						</Link>
						<Icon n="chevron-right" style={{ width: 14, height: 14, opacity: 0.6 }} />
						<Link className="lk" href="/blog" style={{ color: "var(--text-muted)" }}>
							블로그
						</Link>
						<Icon n="chevron-right" style={{ width: 14, height: 14, opacity: 0.6 }} />
						<span style={{ color: "var(--text-heading)", fontWeight: 500 }}>{post.category}</span>
					</nav>

					<Badge>{post.category}</Badge>
					<h1
						style={{
							fontSize: "clamp(28px, 4.4vw, 40px)",
							lineHeight: 1.3,
							marginTop: 16,
							color: "var(--text-heading)",
						}}
					>
						{post.title}
					</h1>
					<div
						style={{
							display: "flex",
							alignItems: "center",
							gap: 16,
							marginTop: 20,
							flexWrap: "wrap",
							fontSize: 14,
							color: "var(--text-muted)",
						}}
					>
						<span>{post.author}</span>
						<span aria-hidden="true">·</span>
						<time dateTime={post.date}>{formatBlogDate(post.date)}</time>
						<span aria-hidden="true">·</span>
						<span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
							<Icon n="clock" style={{ width: 14, height: 14 }} /> 읽는 시간 {post.readingMinutes}분
						</span>
					</div>
				</div>
			</header>

			<article className="section" style={{ paddingTop: 32, background: "var(--surface-page)" }}>
				<div className="blog-prose container">
					{post.cover && (
						<div
							style={{
								position: "relative",
								width: "100%",
								aspectRatio: "16 / 9",
								borderRadius: "var(--radius)",
								overflow: "hidden",
								marginBottom: 36,
								background: "var(--surface-sunken)",
							}}
						>
							<Image
								src={post.cover}
								alt=""
								fill
								priority
								sizes="(max-width: 820px) 100vw, 760px"
								style={{ objectFit: "cover" }}
							/>
						</div>
					)}
					{/* 본문은 관리자 에디터가 출력한 HTML. 추후 Supabase 저장 시 입력 단계에서 sanitize 권장. */}
					{/* biome-ignore lint/security/noDangerouslySetInnerHtml: 1차 제공(관리자 작성) 블로그 본문 HTML */}
					<div className="prose" dangerouslySetInnerHTML={{ __html: post.content }} />
				</div>
			</article>

			{related.length > 0 && (
				<section className="section" style={{ background: "var(--surface-subtle)" }}>
					<div className="container">
						<h2 style={{ fontSize: "clamp(22px, 3vw, 28px)", marginBottom: 28 }}>관련 글</h2>
						<div className="grid-3">
							{related.map((p) => (
								<BlogCard key={p.slug} post={p} />
							))}
						</div>
						<div style={{ textAlign: "center", marginTop: 36 }}>
							<Link
								className="lk"
								href="/blog"
								style={{
									display: "inline-flex",
									alignItems: "center",
									gap: 8,
									fontSize: 15,
									fontWeight: 600,
									color: "var(--color-primary)",
								}}
							>
								목록으로 <Icon n="arrow-right" style={{ width: 16, height: 16 }} />
							</Link>
						</div>
					</div>
				</section>
			)}
		</>
	);
}
