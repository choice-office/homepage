import type { Metadata } from "next";
import { CTABand, FAQ_, PageHero } from "@/components/site/sections";
import { toJsonLd } from "@/lib/json-ld";
import { FAQ, faqAnswerText } from "@/lib/site-data";

export const metadata: Metadata = {
	title: "자주 묻는 질문",
	description: "상담 전 자주 묻는 질문을 모았습니다. 비용·기간·절차 등을 안내합니다.",
	alternates: { canonical: "/faq" },
};

// FAQPage 구조화 데이터 — 구글 리치결과·AI 답변(AEO) 노출용
const faqJsonLd = {
	"@context": "https://schema.org",
	"@type": "FAQPage",
	mainEntity: FAQ.map((f) => ({
		"@type": "Question",
		name: f.q,
		acceptedAnswer: { "@type": "Answer", text: faqAnswerText(f) },
	})),
};

export default function FaqPage() {
	return (
		<>
			<script
				type="application/ld+json"
				// biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD 주입의 표준 방식(대안 없음). '<' 이스케이프로 하드닝 — toJsonLd
				dangerouslySetInnerHTML={{ __html: toJsonLd(faqJsonLd) }}
			/>
			<PageHero
				title="자주 묻는 질문"
				sub={
					<>
						상담 전 자주 물어보시는 질문들을 모았습니다.
						<br className="sm:hidden" /> 더 궁금하신 점은 편하게 문의해 주세요.
					</>
				}
				crumbs={[{ label: "홈", route: "home" }, { label: "자주 묻는 질문" }]}
				image="/자주묻는질문-hero.png"
				imagePosition="object-[center_62%]"
			/>
			<FAQ_ banded={false} showHead={false} />
			<CTABand />
		</>
	);
}
