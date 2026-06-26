import type { Metadata } from "next";
import { CTABand, LocationDetail, PageHero } from "@/components/site/sections";
import { CONTACT } from "@/lib/site-data";

export const metadata: Metadata = {
	title: "오시는 길",
	description: `${CONTACT.address}. 외부 출장이 많아 내방 상담은 사전 연락 부탁드립니다.`,
};

const ABOUT_CRUMB = { label: "사무소 소개", route: "greeting" };

export default function LocationPage() {
	return (
		<>
			<PageHero
				eyebrow="Location"
				title="오시는 길"
				sub="외부 출장이 많아 내방 상담은 반드시 사전 연락 부탁드립니다."
				crumbs={[{ label: "홈", route: "home" }, ABOUT_CRUMB, { label: "오시는 길" }]}
			/>
			<section className="section" style={{ background: "var(--surface-page)" }}>
				<LocationDetail />
			</section>
			<CTABand />
		</>
	);
}
