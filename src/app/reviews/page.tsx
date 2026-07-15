import type { Metadata } from "next";
import { ReviewImageGallery } from "@/components/site/review-gallery";
import { CTABand, PageHero } from "@/components/site/sections";
import { getPublishedReviewImages } from "@/lib/review-images";

// 후기 이미지를 ISR로 가져온다(DB 미설정/빈 경우 로컬 폴백)
export const revalidate = 60;

export const metadata: Metadata = {
	title: "의뢰인 후기",
	description:
		"절차를 마친 의뢰인들이 직접 남겨주신 실제 후기입니다. 개인정보 보호를 위해 일부를 가려 게재합니다.",
	alternates: { canonical: "/reviews" },
};

export default async function ReviewsPage() {
	const images = await getPublishedReviewImages();
	return (
		<>
			<PageHero
				title="의뢰인 후기"
				sub="절차를 마친 의뢰인들이 직접 남겨주신 실제 대화입니다."
				crumbs={[{ label: "홈", route: "home" }, { label: "의뢰인 후기" }]}
			/>
			<section className="section" style={{ background: "var(--surface-page)" }}>
				<div className="container">
					<ReviewImageGallery images={images} />
					<p
						style={{ textAlign: "center", marginTop: 36, fontSize: 13, color: "var(--text-muted)" }}
					>
						※ 후기는 의뢰인의 동의를 받아 게시하며, 개인정보 보호를 위해 성함·연락처·날짜 등 일부를
						가렸습니다. 결과는 사안에 따라 다를 수 있습니다.
					</p>
				</div>
			</section>
			<CTABand />
		</>
	);
}
