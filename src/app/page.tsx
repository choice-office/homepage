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

// 홈의 블로그 미리보기를 위해 최신 데이터를 ISR로 가져온다(후기는 이미지 갤러리 — 정적)
export const revalidate = 60;

export default async function Home() {
	const latestPosts = await getPublishedPosts();
	return (
		<>
			<Hero />
			<StrengthsCarousel />
			<Stats />
			<ServicesGrid />
			<StrengthsRow />
			<ReviewsPreview />
			<Affiliations />
			<VideoSection />
			<BlogPreview posts={latestPosts} />
			<LocationSection />
			<CTABand />
		</>
	);
}
