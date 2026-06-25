import type { Metadata } from "next";
import Image from "next/image";
import { Icon } from "@/components/site/icon";
import { CTABand, PageHero } from "@/components/site/sections";
import { HERO_IMG } from "@/lib/site-data";

export const metadata: Metadata = {
	title: "인사말",
	description:
		"초이스 행정사 사무소가 의뢰인께 드리는 인사말입니다. 혼자 고민하지 마시고 편하게 문을 두드려 주세요.",
};

const ABOUT_CRUMB = { label: "사무소 소개", route: "greeting" };

export default function GreetingPage() {
	return (
		<>
			<PageHero
				eyebrow="Greetings"
				title="인사말"
				sub="초이스 행정사 사무소가 의뢰인께 드리는 말씀입니다."
				crumbs={[{ label: "홈", route: "home" }, ABOUT_CRUMB, { label: "인사말" }]}
			/>
			<section className="section" style={{ background: "var(--surface-page)" }}>
				<div className="container">
					<div data-stagger="split" className="grid-2" style={{ gap: 56, alignItems: "stretch" }}>
						<div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
							<Icon
								n="quote"
								style={{ width: 40, height: 40, color: "var(--color-primary-light)" }}
							/>
							<h2 style={{ fontSize: "clamp(26px,3.4vw,34px)", lineHeight: 1.5, marginTop: 16 }}>
								복잡하게 느껴지는 출입국 절차,
								<br />그 곁에서 길을 함께 찾겠습니다.
							</h2>
							<div
								style={{
									marginTop: 28,
									display: "flex",
									flexDirection: "column",
									gap: 18,
									fontSize: 16.5,
									lineHeight: 1.9,
									color: "var(--text-body)",
								}}
							>
								<p>안녕하십니까. ‘실력에 책임감을 더한’ 초이스 행정사 사무소입니다.</p>
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
							<div
								style={{
									marginTop: 32,
									paddingTop: 24,
									borderTop: "1px solid var(--border-default)",
								}}
							>
								<div style={{ fontSize: 15, color: "var(--text-muted)" }}>마음을 다해,</div>
								<div
									style={{ fontSize: 22, fontWeight: 700, marginTop: 6, letterSpacing: "-0.02em" }}
								>
									초이스 행정사 사무소{" "}
									<span style={{ fontSize: 16, fontWeight: 500, color: "var(--text-muted)" }}>
										드림
									</span>
								</div>
							</div>
						</div>
						<div
							style={{
								position: "relative",
								borderRadius: "var(--radius-lg)",
								overflow: "hidden",
								minHeight: 460,
								background: "#241d16",
							}}
						>
							<Image
								src={HERO_IMG}
								alt="사무소 전경"
								fill
								sizes="(max-width: 960px) 100vw, 50vw"
								style={{ objectFit: "cover", opacity: 0.62 }}
							/>
							<div
								style={{
									position: "absolute",
									inset: 0,
									background:
										"linear-gradient(160deg, rgba(82,70,54,0.55) 0%, rgba(36,29,22,0.8) 100%)",
								}}
							/>
							<div style={{ position: "absolute", left: 32, bottom: 32, color: "#fff", zIndex: 1 }}>
								<div
									style={{ fontSize: 14, letterSpacing: ".1em", color: "var(--color-accent-soft)" }}
								>
									OUR OFFICE
								</div>
								<div style={{ fontSize: 20, fontWeight: 700, marginTop: 6 }}>
									서울 중구 · 광화문 인근
								</div>
								<div style={{ fontSize: 14, color: "rgba(255,255,255,.8)", marginTop: 4 }}>
									한국어 · English · 中文 상담
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
			<CTABand />
		</>
	);
}
