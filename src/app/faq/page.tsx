import type { Metadata } from "next";
import { CTABand, FAQ_, PageHero } from "@/components/site/sections";

export const metadata: Metadata = {
	title: "자주 묻는 질문",
	description:
		"상담 전 자주 묻는 질문을 모았습니다. 비용·기간·절차, 영어 상담 가능 여부 등을 안내합니다.",
};

export default function FaqPage() {
	return (
		<>
			<PageHero
				eyebrow="FAQ"
				title="자주 묻는 질문"
				sub="상담 전 자주 묻는 질문을 모았습니다. 더 궁금한 점은 편하게 문의해 주세요."
				crumbs={[{ label: "홈", route: "home" }, { label: "자주 묻는 질문" }]}
			/>
			<FAQ_ banded={false} showHead={false} />
			<CTABand />
		</>
	);
}
