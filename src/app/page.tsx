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
import { getPublishedReviews } from "@/lib/reviews";

// 홈의 블로그·후기 미리보기를 위해 최신 데이터를 ISR로 가져온다
export const revalidate = 60;

export default async function Home() {
	const [latestPosts, reviews] = await Promise.all([getPublishedPosts(), getPublishedReviews()]);
	return (
		<>
			<Hero />
			<StrengthsCarousel />
			<Stats />
			<ServicesGrid />
			<StrengthsRow />
			<ReviewsPreview reviews={reviews} />
			<Affiliations />
			<VideoSection />
			<BlogPreview posts={latestPosts} />
			<LocationSection />
			<CTABand />
		</>
	);
}
