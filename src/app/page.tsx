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

export default function Home() {
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
			<BlogPreview />
			<CTABand />
		</>
	);
}
