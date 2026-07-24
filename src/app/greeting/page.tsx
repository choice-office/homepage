import type { Metadata } from "next";
import Image from "next/image";
import { Icon } from "@/components/site/icon";
import { CTABand, PageHero } from "@/components/site/sections";
import { OFFICE_IMG } from "@/lib/site-data";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
	title: "인사말",
	description:
		"초이스 행정사 사무소가 의뢰인께 드리는 인사말입니다. 혼자 고민하지 마시고 편하게 문을 두드려 주세요.",
	alternates: { canonical: "/greeting" },
};

const ABOUT_CRUMB = { label: "사무소 소개", route: "greeting" };

export default function GreetingPage() {
	return (
		<>
			<PageHero
				title="인사말"
				sub="초이스 행정사 사무소를 찾아주셔서 감사합니다."
				crumbs={[{ label: "홈", route: "home" }, ABOUT_CRUMB, { label: "인사말" }]}
				image="/인사말-hero.png"
				imagePosition="66% 72%"
			/>
			<section className={cn("section", "bg-[var(--surface-page)]")}>
				<div className="container">
					<div data-stagger="split" className={cn("grid-2 greeting-split", "items-stretch")}>
						<div className="flex flex-col justify-center">
							<Icon
								n="quote"
								style={{ width: 40, height: 40, color: "var(--color-primary-light)" }}
							/>
							<h2 className="mt-4 text-[clamp(26px,3.4vw,34px)] leading-[1.5]">
								복잡하게 느껴지는 출입국 절차,
								<br />그 곁에서 길을 함께 찾겠습니다.
							</h2>
							<div className="mt-7 flex flex-col gap-[18px] text-[16.5px] text-[color:var(--text-body)] leading-[1.9]">
								<p>안녕하십니까. '실력에 책임감을 더한' 초이스 행정사 사무소입니다.</p>
								<p>
									살다 보면 익숙하지 않은 행정 절차 앞에서 무엇부터 시작해야 할지, 어떤 정보가
									정확한지 판단하기 어려운 막막한 순간이 있습니다. 초이스 행정사 사무소는 그런
									상황에서 의뢰인의 입장에서 함께 길을 찾아드리는 역할을 하고 있습니다.
								</p>
								<p>
									2019년 사무소 개소 이후 외국인 체류 및 비자, 출입국 관련 행정 업무를 중심으로
									다양한 사례를 직접 다뤄오며 실무 경험을 쌓아왔습니다. 이러한 경험을 바탕으로
									의뢰인분들의 각 상황에 맞는 현실적인 방향을 안내드리고 있습니다.
								</p>
								<p>
									복잡한 행정 절차 앞에서 혼자 고민하지 마세요. 초이스 행정사 사무소가 곁에서
									함께하겠습니다.
								</p>
							</div>
							<div className="mt-8 border-t border-t-[color:var(--border-default)] pt-6">
								<div className="text-[15px] text-[color:var(--text-muted)]">마음을 다해,</div>
								<div className="mt-1.5 font-bold text-[22px] tracking-[-0.02em]">
									초이스 행정사 사무소{" "}
									<span className="font-medium text-[16px] text-[color:var(--text-muted)]">
										드림
									</span>
								</div>
							</div>
						</div>
						<div className="relative min-h-[460px] overflow-hidden rounded-[var(--radius-lg)] bg-[#241d16]">
							<Image
								src={OFFICE_IMG}
								alt="사무소 전경"
								fill
								sizes="(max-width: 960px) 100vw, 50vw"
								className="object-cover opacity-[0.95]"
							/>
							<div className="absolute inset-0 bg-[linear-gradient(160deg,rgba(82,70,54,0.22)_0%,rgba(36,29,22,0.42)_100%)]" />
						</div>
					</div>
				</div>
			</section>
			<CTABand />
		</>
	);
}
