import {
	BlogPreview,
	CTABand,
	Hero,
	LangRemoteBand,
	ReviewsPreview,
	ServicesGrid,
	Stats,
	StrengthsRow,
	TrustBand,
	VideoSection,
} from "@/components/site/sections";
import { getPublishedPosts } from "@/lib/blog";

// 홈의 블로그 미리보기를 위해 최신 글을 ISR로 가져온다
export const revalidate = 60;

export default async function Home() {
	const latestPosts = await getPublishedPosts();
	return (
		<>
			<Hero />
			<TrustBand />
			<LangRemoteBand />
			<StrengthsRow />
			<ServicesGrid />
			<Stats />
			<ReviewsPreview />
			<VideoSection />
			<BlogPreview posts={latestPosts} />
			<CTABand />
		</>
	);
}
