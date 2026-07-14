import {
	Affiliations,
	BlogPreview,
	CTABand,
	Hero,
	LocationSection,
	ReviewsPreview,
	ServicesGrid,
	Stats,
	StrengthsCarousel,
	StrengthsRow,
	VideoSection,
} from "@/components/site/sections";
import { getPublishedPosts } from "@/lib/blog";
import { getPublishedReviewImages } from "@/lib/review-images";

// 홈의 블로그 미리보기·후기 이미지를 ISR로 가져온다(DB 미설정/빈 경우 로컬 폴백)
export const revalidate = 60;

export default async function Home() {
	const [latestPosts, reviewImages] = await Promise.all([
		getPublishedPosts(),
		getPublishedReviewImages(),
	]);
	return (
		<>
			<Hero />
			<StrengthsCarousel />
			<Stats />
			<ServicesGrid />
			<StrengthsRow />
			<ReviewsPreview images={reviewImages} />
			<Affiliations />
			<VideoSection />
			<BlogPreview posts={latestPosts} />
			<LocationSection />
			<CTABand />
		</>
	);
}
