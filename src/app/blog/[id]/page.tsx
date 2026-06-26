import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BlogCard } from "@/components/site/blog-card";
import { Badge } from "@/components/site/ds";
import { Icon } from "@/components/site/icon";
import { siteConfig } from "@/config/site";
import {
	type BlogPost,
	formatBlogDate,
	getPostBySlug,
	getPublishedPosts,
	getRelatedPosts,
} from "@/lib/blog";

type Params = { params: Promise<{ id: string }> };

// ISR: 발행/수정 시 반영. 빌드 시 발행글을 정적 생성, 신규 글은 on-demand 렌더.
export const revalidate = 60;

export const generateStaticParams = async () => {
	const posts = await getPublishedPosts();
	return posts.map((p) => ({ id: p.slug }));
};

const postUrl = (slug: string) => `${siteConfig.url}/blog/${slug}`;

export const generateMetadata = async ({ params }: Params): Promise<Metadata> => {
	const { id } = await params;
	const post = await getPostBySlug(id);
	if (!post) return {};
	const url = postUrl(post.slug);
	const title = post.metaTitle ?? post.title;
	const description = post.metaDescription ?? post.excerpt;
	return {
		title,
		description,
		alternates: { canonical: url },
		openGraph: {
			type: "article",
			title,
			description,
			url,
			publishedTime: post.date,
			modifiedTime: post.dateModified ?? post.date,
			images: post.cover ? [{ url: post.cover }] : undefined,
		},
	};
};

// JSON-LD: BlogPosting + BreadcrumbList(+ FAQPage는 faq 있을 때만). docs/BLOG-SEO.md
const buildJsonLd = (post: BlogPost) => {
	const url = postUrl(post.slug);
	const graph: Record<string, unknown>[] = [
		{
			"@type": "BlogPosting",
			headline: post.title,
			description: post.metaDescription ?? post.excerpt,
			image: post.cover ? [post.cover] : undefined,
			datePublished: post.date,
			dateModified: post.dateModified ?? post.date,
			author: { "@type": "Person", name: post.author },
			publisher: {
				"@type": "Organization",
				name: siteConfig.name,
				logo: { "@type": "ImageObject", url: siteConfig.ogImage },
			},
			mainEntityOfPage: { "@type": "WebPage", "@id": url },
			articleSection: post.category,
			inLanguage: "ko",
		},
		{
			"@type": "BreadcrumbList",
			itemListElement: [
				{ "@type": "ListItem", position: 1, name: "홈", item: siteConfig.url },
				{ "@type": "ListItem", position: 2, name: "블로그", item: `${siteConfig.url}/blog` },
				{ "@type": "ListItem", position: 3, name: post.category },
				{ "@type": "ListItem", position: 4, name: post.title, item: url },
			],
		},
	];
	if (post.faq?.length) {
		graph.push({
			"@type": "FAQPage",
			mainEntity: post.faq.map((f) => ({
				"@type": "Question",
				name: f.q,
				acceptedAnswer: { "@type": "Answer", text: f.a },
			})),
		});
	}
	return { "@context": "https://schema.org", "@graph": graph };
};

export default async function BlogDetailPage({ params }: Params) {
	const { id } = await params;
	const post = await getPostBySlug(id);
	if (!post) notFound();

	const related = await getRelatedPosts(post, 3);
	const modified = post.dateModified && post.dateModified !== post.date ? post.dateModified : null;

	return (
		<>
			<script
				type="application/ld+json"
				// biome-ignore lint/security/noDangerouslySetInnerHtml: 구조화 데이터(JSON-LD)
				dangerouslySetInnerHTML={{ __html: JSON.stringify(buildJsonLd(post)) }}
			/>
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
						{modified && (
							<>
								<span aria-hidden="true">·</span>
								<span>
									수정 <time dateTime={modified}>{formatBlogDate(modified)}</time>
								</span>
							</>
						)}
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
								alt={post.coverAlt ?? ""}
								fill
								priority
								sizes="(max-width: 820px) 100vw, 760px"
								style={{ objectFit: "cover" }}
							/>
						</div>
					)}

					{post.tldr && (
						<aside className="post-tldr">
							<span className="post-tldr-label">요점</span>
							<p>{post.tldr}</p>
						</aside>
					)}

					{/* 본문은 관리자 에디터가 출력한 HTML. 추후 Supabase 저장 시 입력 단계에서 sanitize 권장. */}
					{/* biome-ignore lint/security/noDangerouslySetInnerHtml: 1차 제공(관리자 작성) 블로그 본문 HTML */}
					<div className="prose" dangerouslySetInnerHTML={{ __html: post.content }} />

					{post.faq && post.faq.length > 0 && (
						<section className="post-faq" aria-labelledby="faq-heading">
							<h2 id="faq-heading">자주 묻는 질문</h2>
							{post.faq.map((f) => (
								<div key={f.q} className="post-faq-item">
									<h3>{f.q}</h3>
									<p>{f.a}</p>
								</div>
							))}
						</section>
					)}

					{post.sources && post.sources.length > 0 && (
						<section className="post-sources" aria-labelledby="sources-heading">
							<h2 id="sources-heading">참고 · 근거</h2>
							<ul>
								{post.sources.map((s) => (
									<li key={s.href}>
										<a href={s.href} target="_blank" rel="noopener noreferrer">
											{s.label}
											<Icon n="external-link" style={{ width: 13, height: 13 }} />
										</a>
									</li>
								))}
							</ul>
						</section>
					)}

					<p className="post-disclaimer">
						본 글은 일반적인 정보 제공을 위한 것으로 법률 자문이 아니며, 개별 사안은 사실관계에 따라
						결론이 달라질 수 있어 사전 상담을 권합니다.
					</p>
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
