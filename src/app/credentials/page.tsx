import type { Metadata } from "next";
import { Card, CardBody, CardTitle } from "@/components/site/ds";
import { Icon } from "@/components/site/icon";
import { CTABand, PageHero } from "@/components/site/sections";
import { CREDENTIALS } from "@/lib/site-data";

export const metadata: Metadata = {
	title: "자격 · 인증",
	description:
		"자격과 등록을 갖춘 행정사가, 적법한 절차로 직접 진행합니다. 출입국민원 대행기관·행정사 등록.",
};

const ABOUT_CRUMB = { label: "사무소 소개", route: "greeting" };

export default function CredentialsPage() {
	return (
		<>
			<PageHero
				eyebrow="Credentials"
				title="자격 · 인증"
				sub="자격과 등록을 갖춘 행정사가, 적법한 절차로 직접 진행합니다."
				crumbs={[{ label: "홈", route: "home" }, ABOUT_CRUMB, { label: "자격 · 인증" }]}
			/>
			<section className="section" style={{ background: "var(--surface-page)" }}>
				<div className="container">
					<div className="grid-2">
						{CREDENTIALS.map((c) => (
							<Card
								key={c.title}
								padding="28px"
								style={{ display: "flex", gap: 18, alignItems: "flex-start" }}
							>
								<div
									style={{
										width: 52,
										height: 52,
										borderRadius: "var(--radius)",
										background: "var(--color-accent-soft)",
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
										flex: "0 0 auto",
									}}
								>
									<Icon
										n={c.icon}
										style={{ width: 26, height: 26, color: "var(--color-primary-dark)" }}
									/>
								</div>
								<div>
									<CardTitle style={{ fontSize: 19 }}>{c.title}</CardTitle>
									<CardBody style={{ fontSize: 15 }}>{c.desc}</CardBody>
								</div>
							</Card>
						))}
					</div>
					<div
						style={{
							marginTop: 28,
							padding: 24,
							background: "var(--surface-subtle)",
							border: "1px solid var(--border-default)",
							borderRadius: "var(--radius)",
							fontSize: 15,
							lineHeight: 1.8,
							color: "var(--text-muted)",
						}}
					>
						사업자등록번호 464-11-00966 · 행정사 등록번호 18102025537 · 출입국민원 대행기관
						19-SB-RG-016
						<br />
						결과를 단정해 약속드리지 않으며, 요건을 정확히 검토해 가능한 방향을 솔직하게
						안내드립니다.
					</div>
				</div>
			</section>
			<CTABand />
		</>
	);
}
