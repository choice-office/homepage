import type { Metadata } from "next";
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

// 홈 전용 메타: 브랜드만이 아닌 핵심 키워드를 title에 반영, canonical은 자기(홈) URL.
export const metadata: Metadata = {
	title: { absolute: "출입국·비자 전문 행정사 | 초이스 행정사 사무소" },
	alternates: { canonical: "/" },
};

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
