import type { Metadata } from "next";
import { CTABand, PageHero, Process, ServicesGrid } from "@/components/site/sections";

export const metadata: Metadata = {
	title: "업무분야",
	description:
		"거소증(F-4)·영주권(F-5)·결혼비자(F-6)·외국인 연예인(E-6)·전문직(E-7) 비자, 국적회복 등 출입국·비자 전 분야를 시험 출신 행정사가 직접 진행합니다.",
};

export default function ServicesPage() {
	return (
		<>
			<PageHero
				eyebrow="Services"
				title="업무분야"
				sub="출입국·비자 전 분야를 시험 출신 행정사가 직접 다룹니다. 분야를 선택하면 대상·서류·절차·기간을 안내해 드립니다."
				crumbs={[{ label: "홈", route: "home" }, { label: "업무분야" }]}
			/>
			<ServicesGrid heading={false} />
			<Process />
			<CTABand />
		</>
	);
}
