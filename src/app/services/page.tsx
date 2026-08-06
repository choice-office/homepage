import type { Metadata } from "next";
import { CTABand, PageHero, Process, ServicesGrid } from "@/components/site/sections";
import { bindMidDots } from "@/lib/utils";

export const metadata: Metadata = {
	title: "업무분야",
	description:
		"거소증(F4비자)·영주권(F5비자)·결혼비자(F6비자)·외국인 연예인(E6비자)·외국인 취업(E7비자), 국적회복 등 출입국·비자 전 분야를 시험 출신 행정사가 직접 진행합니다.",
	alternates: { canonical: "/services" },
};

export default function ServicesPage() {
	return (
		<>
			<PageHero
				title="업무분야"
				sub={
					// 두 문장은 항상 줄을 나눈다(PC·모바일 공통). 가운뎃점 뒤에서 줄이 끊기지 않게 bindMidDots.
					<>
						{bindMidDots("시험 출신 행정사가 출입국·비자 업무를 직접 상담하고 진행합니다.")}
						<br />
						{bindMidDots("업무분야를 선택하시면 대상·서류·절차·소요기간을 확인하실 수 있습니다.")}
					</>
				}
				crumbs={[{ label: "홈", route: "home" }, { label: "업무분야" }]}
				image="/업무분야-hero.png"
				imagePosition="object-[center_62%]"
			/>
			<ServicesGrid heading={false} />
			<Process />
			<CTABand />
		</>
	);
}
