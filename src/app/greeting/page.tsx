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
					<div className="grid-2" style={{ gap: 56, alignItems: "stretch" }}>
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
								<p>안녕하세요. 초이스 행정사 사무소를 찾아주셔서 감사합니다.</p>
								<p>
									낯선 제도와 언어 속에서 체류와 비자 문제를 마주하는 일은, 그 자체로 막막하고
									외로운 과정일 수 있습니다. 작은 서류 하나, 절차 하나가 결과를 좌우하기에 더욱
									그렇습니다.
								</p>
								<p>
									초이스 행정사 사무소는 사무장을 거치지 않고, 시험 출신 행정사가 상담부터 서류
									작성과 접수까지 모든 과정을 직접 책임집니다. 무리한 약속을 드리기보다, 의뢰인의
									상황을 정확히 살피고 지금 가능한 방향을 솔직하게 말씀드리는 것을 가장 중요한
									원칙으로 삼고 있습니다.
								</p>
								<p>
									거소증·영주권·결혼비자·외국인 연예인(E-6)·전문직(E-7) 비자·국적회복까지, 한 분 한
									분의 사정을 끝까지 함께 살피겠습니다. 혼자 고민하지 마시고, 편하게 문을 두드려
									주세요.
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
