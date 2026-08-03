import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { BlogCard } from "@/components/site/blog-card";
import { Badge } from "@/components/site/ds";
import { Icon } from "@/components/site/icon";
import { siteConfig } from "@/config/site";
import {
	AUTHOR_PROFILE_PATH,
	type BlogPost,
	firstContentImage,
	formatBlogDate,
	getPostBySlug,
	getPostRefs,
	getRelatedPosts,
	serviceForCategory,
} from "@/lib/blog";
import { toJsonLd } from "@/lib/json-ld";
import { sanitizePostHtml } from "@/lib/sanitize-post-html";
import { NAVER_BLOG, YOUTUBE_CHANNEL } from "@/lib/site-data";
import { cn } from "@/lib/utils";

type Params = { params: Promise<{ id: string }> };

// ISR: 발행/수정 시 반영. 빌드 시 발행글을 정적 생성, 신규 글은 on-demand 렌더.
export const revalidate = 60;

export const generateStaticParams = async () => {
	const refs = await getPostRefs();
	return refs.map((r) => ({ id: r.slug }));
};

const postUrl = (slug: string) => `${siteConfig.url}/blog/${slug}`;

export const generateMetadata = async ({ params }: Params): Promise<Metadata> => {
	const { id } = await params;
	const post = await getPostBySlug(id);
	if (!post) return {};
	const url = postUrl(post.slug);
	const title = post.metaTitle ?? post.title;
	const description = post.metaDescription ?? post.excerpt;
	const ogImage = post.cover ?? firstContentImage(post.content);
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
			images: ogImage ? [{ url: ogImage }] : undefined,
		},
	};
};

// JSON-LD: BlogPosting + BreadcrumbList(+ FAQPage는 faq 있을 때만). docs/BLOG-SEO.md
const buildJsonLd = (post: BlogPost) => {
	const url = postUrl(post.slug);
	const image = post.cover ?? firstContentImage(post.content);
	const graph: Record<string, unknown>[] = [
		{
			"@type": "BlogPosting",
			headline: post.title,
			description: post.metaDescription ?? post.excerpt,
			image: image ? [image] : undefined,
			datePublished: post.date,
			dateModified: post.dateModified ?? post.date,
			author: {
				"@type": "Person",
				name: post.author,
				...(post.authorRole ? { jobTitle: post.authorRole } : {}),
				url: `${siteConfig.url}${AUTHOR_PROFILE_PATH}`,
				// E-E-A-T: 저자를 공식 채널(네이버블로그·유튜브)과 연결해 동일 인물임을 명시
				sameAs: [NAVER_BLOG, YOUTUBE_CHANNEL],
				worksFor: { "@type": "Organization", name: siteConfig.name },
			},
			publisher: {
				"@type": "Organization",
				name: siteConfig.name,
				logo: { "@type": "ImageObject", url: siteConfig.ogImage },
			},
			mainEntityOfPage: { "@type": "WebPage", "@id": url },
			articleSection: post.category,
			keywords: post.tags?.length ? post.tags.join(", ") : undefined,
			inLanguage: "ko",
		},
		{
			"@type": "BreadcrumbList",
			itemListElement: [
				{ "@type": "ListItem", position: 1, name: "홈", item: siteConfig.url },
				{ "@type": "ListItem", position: 2, name: "블로그", item: `${siteConfig.url}/blog` },
				{ "@type": "ListItem", position: 3, name: post.title, item: url },
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
	if (!post) redirect("/");

	const related = await getRelatedPosts(post, 3);
	const service = serviceForCategory(post.categorySlug);
	const safeContent = sanitizePostHtml(post.content);

	return (
		<>
			<script
				type="application/ld+json"
				// biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD 주입의 표준 방식(대안 없음). DB 필드 포함 → '<' 이스케이프로 하드닝 — toJsonLd
				dangerouslySetInnerHTML={{ __html: toJsonLd(buildJsonLd(post)) }}
			/>
			{/* 본문 글씨체(관리자 에디터에서 지정) 렌더용 웹폰트 — 블로그 상세에서만 로드 */}
			<link
				rel="stylesheet"
				precedence="default"
				href="https://fonts.googleapis.com/css2?family=Black+Han+Sans&family=Nanum+Brush+Script&family=Nanum+Gothic:wght@400;700;800&family=Nanum+Myeongjo:wght@400;700;800&display=swap"
			/>
			<header className={cn("section", "bg-[var(--surface-page)] pt-32 pb-0")}>
				<div className="blog-prose container">
					<nav
						aria-label="경로"
						className="mb-5 flex flex-wrap items-center gap-2 text-[14px] text-[color:var(--text-muted)]"
					>
						<Link className={cn("lk", "text-[color:var(--text-muted)]")} href="/">
							홈
						</Link>
						<Icon n="chevron-right" className="h-3.5 w-3.5 opacity-60" />
						<Link className={cn("lk", "text-[color:var(--text-muted)]")} href="/blog">
							블로그
						</Link>
						<Icon n="chevron-right" className="h-3.5 w-3.5 opacity-60" />
						<span className="font-medium text-[color:var(--text-heading)]">{post.category}</span>
					</nav>

					<Badge>{post.category}</Badge>
					<h1
						className={cn("blog-h1", "mt-4 text-[color:var(--text-heading)] leading-[1.35]")}
						style={{ fontSize: "clamp(23px, 3.2vw, 31px)" }}
					>
						{post.title}
					</h1>
					<div className="mt-5 flex flex-wrap items-center gap-4 text-[14px] text-[color:var(--text-muted)]">
						<span>{post.author}</span>
						<span aria-hidden="true">·</span>
						<time dateTime={post.date}>{formatBlogDate(post.date)}</time>
						<span aria-hidden="true">·</span>
						{/* E-E-A-T: 저자 전문성 근거로 구성원(자격·경력) 페이지 연결 (YMYL) */}
						<Link className="lk post-author-cred" href={AUTHOR_PROFILE_PATH}>
							자격·경력 보기
						</Link>
					</div>
				</div>
			</header>

			<article className={cn("section", "bg-[var(--surface-page)] pt-8")}>
				<div className="blog-prose container">
					{post.cover && (
						<div className="relative mb-9 aspect-video w-full overflow-hidden rounded-[var(--radius)] bg-[var(--surface-sunken)]">
							<Image
								src={post.cover}
								alt={post.coverAlt ?? ""}
								fill
								priority
								sizes="(max-width: 820px) 100vw, 760px"
								className="object-cover"
							/>
						</div>
					)}

					{post.tldr && (
						<aside className="post-tldr">
							<span className="post-tldr-label">
								<Icon n="badge-check" className="h-[13px] w-[13px]" />
								요점
							</span>
							<p>{post.tldr}</p>
						</aside>
					)}

					{/* 본문은 관리자 에디터가 출력한 HTML — 렌더 직전 허용목록으로 살균(저장형 XSS 차단).
					    허용목록은 발행글 전수 조사 기반이라 기존 렌더 결과는 그대로다(@/lib/sanitize-post-html). */}
					{/* biome-ignore lint/security/noDangerouslySetInnerHtml: sanitizePostHtml 통과 후 주입 */}
					<div className="prose" dangerouslySetInnerHTML={{ __html: safeContent }} />

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

					{service && (
						<Link className="post-service-cta lk" href={`/services/${service.id}`}>
							<span className="post-service-cta-eyebrow">이 글과 관련된 업무분야</span>
							<span className="post-service-cta-row">
								<span className="post-service-cta-main">
									<strong>{service.title}</strong>
									<span className="post-service-cta-code">{service.code}</span>
								</span>
								<span className="post-service-cta-go">
									자세히 보기
									<Icon n="arrow-right" className="h-4 w-4" />
								</span>
							</span>
						</Link>
					)}

					{post.sources && post.sources.length > 0 && (
						<section className="post-sources" aria-labelledby="sources-heading">
							<h2 id="sources-heading">참고 · 근거</h2>
							<ul>
								{post.sources.map((s) => (
									<li key={s.href}>
										<a href={s.href} target="_blank" rel="noopener noreferrer">
											{s.label}
											<Icon n="external-link" className="h-[13px] w-[13px]" />
										</a>
									</li>
								))}
							</ul>
						</section>
					)}

					{post.tags && post.tags.length > 0 && (
						<ul className="post-tags" aria-label="태그">
							{post.tags.map((t) => (
								<li className="post-tag" key={t}>
									#{t.replace(/^#/, "")}
								</li>
							))}
						</ul>
					)}

					<p className="post-disclaimer">
						본 글은 일반적인 정보 제공용이며 법률 자문이 아닙니다. 개별 사안은 사전 상담을 권합니다.
					</p>

					{post.sourceUrl && (
						<p className="mt-6 text-center">
							<a
								href={post.sourceUrl}
								target="_blank"
								rel="noopener noreferrer"
								className={cn(
									"lk",
									"inline-flex items-center gap-1.5 font-semibold text-[14px] text-[color:var(--color-primary)]",
								)}
							>
								네이버 블로그 원문 보기
								<Icon n="external-link" className="h-3.5 w-3.5" />
							</a>
						</p>
					)}
				</div>
			</article>

			{related.length > 0 && (
				<section className={cn("section", "bg-[var(--surface-subtle)]")}>
					<div className="container">
						<h2 className="mb-7" style={{ fontSize: "clamp(22px, 3vw, 28px)" }}>
							관련 글
						</h2>
						<div className="grid-3">
							{related.map((p) => (
								<BlogCard key={p.slug} post={p} />
							))}
						</div>
						<div className="mt-9 text-center">
							<Link
								className={cn(
									"lk",
									"inline-flex items-center gap-2 font-semibold text-[15px] text-[color:var(--color-primary)]",
								)}
								href="/blog"
							>
								목록으로 <Icon n="arrow-right" className="h-4 w-4" />
							</Link>
						</div>
					</div>
				</section>
			)}
		</>
	);
}
