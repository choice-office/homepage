import type { Metadata } from "next";
import Link from "next/link";
import { BlogCard } from "@/components/site/blog-card";
import { Icon } from "@/components/site/icon";
import { ReviewImageGallery } from "@/components/site/review-gallery";
import { CTABand, PageHero } from "@/components/site/sections";
import { getPostPage } from "@/lib/blog";
import { getPublishedReviewImages } from "@/lib/review-images";
import { cn } from "@/lib/utils";

// 후기 이미지를 ISR로 가져온다(DB 미설정/빈 경우 로컬 폴백)
export const revalidate = 60;

// 블로그 「의뢰인 후기」 분류 — 이미지 후기 아래에 글로 쓴 후기를 함께 보여준다.
const REVIEW_CATEGORY = "review";
const REVIEW_POSTS = 6;

export const metadata: Metadata = {
	title: "의뢰인 후기",
	description:
		"실제 의뢰인분들이 보내주신 소중한 후기입니다. 개인정보 보호를 위해 일부를 가려 게재합니다.",
	alternates: { canonical: "/reviews" },
};

export default async function ReviewsPage() {
	const [images, { items: posts }] = await Promise.all([
		getPublishedReviewImages(),
		getPostPage(REVIEW_CATEGORY, 1, REVIEW_POSTS),
	]);
	return (
		<>
			<PageHero
				title="의뢰인 후기"
				sub="실제 의뢰인분들이 보내주신 소중한 후기입니다."
				crumbs={[{ label: "홈", route: "home" }, { label: "의뢰인 후기" }]}
				image="/의뢰인후기-hero.png"
				soft
				imagePosition="68% 55%"
			/>
			<section className="section" style={{ background: "var(--surface-page)" }}>
				<div className="container">
					<ReviewImageGallery images={images} />
					<p
						style={{
							textAlign: "center",
							marginTop: 36,
							fontSize: 13,
							color: "var(--text-muted)",
							wordBreak: "keep-all",
						}}
					>
						※ 실제 의뢰인이 보내주신 내용이며,
						<br />
						개인정보 보호를 위해 일부 정보는 비공개 처리하였습니다.
					</p>
				</div>
			</section>
			{posts.length > 0 && (
				<section className={cn("section", "bg-[var(--surface-subtle)]")}>
					<div className="container">
						<div style={{ marginBottom: 28 }}>
							<span className="font-bold text-[13px] text-[color:var(--color-accent)] uppercase tracking-[.12em]">
								Related
							</span>
							<h2 className="mt-3" style={{ fontSize: "clamp(21px,3vw,30px)" }}>
								의뢰인 후기 관련 글·사례
							</h2>
							<span className="mt-[18px] block h-[3px] w-12 bg-[var(--color-accent)]" />
						</div>
						<div className="grid-3">
							{posts.map((p) => (
								<BlogCard key={p.slug} post={p} />
							))}
						</div>
						<div className="mt-9 text-center">
							<Link
								className={cn(
									"lk",
									"inline-flex items-center gap-2 font-semibold text-[15px] text-[color:var(--color-primary)]",
								)}
								href={`/blog?category=${REVIEW_CATEGORY}`}
							>
								후기 글 더 보기 <Icon n="arrow-right" className="h-4 w-4" />
							</Link>
						</div>
					</div>
				</section>
			)}
			<CTABand />
		</>
	);
}
