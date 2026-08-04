import type { Metadata } from "next";
import { CTABand, PageHero, Process, ServicesGrid } from "@/components/site/sections";

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
				sub="출입국·비자 전 분야를 시험 출신 행정사가 직접 다룹니다. 분야를 선택하면 대상·서류·절차·기간을 안내해 드립니다."
				crumbs={[{ label: "홈", route: "home" }, { label: "업무분야" }]}
				image="/업무분야-hero.png"
				soft
				imagePosition="object-[center_62%]"
			/>
			<ServicesGrid heading={false} />
			<Process />
			<CTABand />
		</>
	);
}
