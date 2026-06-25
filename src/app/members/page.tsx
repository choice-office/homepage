import type { Metadata } from "next";
import { Badge, Card } from "@/components/site/ds";
import { Icon } from "@/components/site/icon";
import { CTABand, PageHero } from "@/components/site/sections";
import { type Member, TEAM } from "@/lib/site-data";

export const metadata: Metadata = {
	title: "구성원",
	description: "상담부터 접수까지 직접 책임지는 시험 출신 행정사를 소개합니다.",
};

const ABOUT_CRUMB = { label: "사무소 소개", route: "greeting" };

function MemberCard({ m, single }: { m: Member; single?: boolean }) {
	const Photo = (
		<div
			style={{
				position: "relative",
				background:
					"linear-gradient(160deg, var(--color-primary) 0%, var(--color-primary-dark) 100%)",
				display: "flex",
				alignItems: "flex-end",
				padding: 28,
				minHeight: single ? 420 : 320,
				...(single ? { borderRadius: "var(--radius-lg) 0 0 var(--radius-lg)" } : {}),
			}}
		>
			<Icon
				n="user-round"
				style={{
					position: "absolute",
					top: "40%",
					left: "50%",
					transform: "translate(-50%,-50%)",
					width: single ? 110 : 88,
					height: single ? 110 : 88,
					color: "rgba(255,255,255,.5)",
				}}
			/>
			<div style={{ color: "#fff", zIndex: 1 }}>
				<Badge style={{ background: "rgba(255,255,255,.16)", color: "#fff" }}>{m.title}</Badge>
				<div style={{ fontSize: single ? 30 : 24, fontWeight: 700, marginTop: 12 }}>{m.name}</div>
				<div style={{ fontSize: 14, color: "rgba(255,255,255,.82)", marginTop: 6 }}>
					{m.summary}
				</div>
			</div>
		</div>
	);
	const Info = (
		<div
			style={{
				padding: single ? "40px 44px" : "26px 28px",
				display: "flex",
				flexDirection: "column",
				justifyContent: "center",
			}}
		>
			<div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
				{m.tags.map((t) => (
					<Badge key={t} variant="outline">
						{t}
					</Badge>
				))}
			</div>
			<div style={{ marginTop: 22, display: "flex", flexDirection: "column", gap: 13 }}>
				{m.career.map((c) => (
					<div key={c.text} style={{ display: "flex", alignItems: "center", gap: 14 }}>
						<span
							style={{
								width: 40,
								height: 40,
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
								style={{ width: 19, height: 19, color: "var(--color-primary-dark)" }}
							/>
						</span>
						<span style={{ fontSize: 15.5, color: "var(--text-body)" }}>{c.text}</span>
					</div>
				))}
			</div>
			<div
				style={{
					marginTop: 22,
					paddingTop: 18,
					borderTop: "1px solid var(--border-default)",
					fontSize: 13.5,
					color: "var(--text-muted)",
					lineHeight: 1.7,
				}}
			>
				{m.reg}
			</div>
		</div>
	);
	if (single) {
		return (
			<Card
				hover={false}
				padding="0"
				style={{ overflow: "hidden", maxWidth: 980, margin: "0 auto" }}
			>
				<div className="member-single">
					{Photo}
					{Info}
				</div>
			</Card>
		);
	}
	return (
		<Card
			hover
			padding="0"
			style={{ overflow: "hidden", display: "flex", flexDirection: "column" }}
		>
			{Photo}
			{Info}
		</Card>
	);
}

export default function MembersPage() {
	const single = TEAM.length === 1;
	return (
		<>
			<PageHero
				eyebrow="Members"
				title="구성원"
				sub="상담부터 접수까지 직접 책임지는 행정사를 소개합니다."
				crumbs={[{ label: "홈", route: "home" }, ABOUT_CRUMB, { label: "구성원" }]}
			/>
			<section className="section" style={{ background: "var(--surface-page)" }}>
				<div className="container">
					{single ? (
						<MemberCard m={TEAM[0]} single />
					) : (
						<div className="grid-3">
							{TEAM.map((m) => (
								<MemberCard key={m.name} m={m} />
							))}
						</div>
					)}
					<p
						style={{ textAlign: "center", marginTop: 36, fontSize: 15, color: "var(--text-muted)" }}
					>
						상담은 시험 출신 행정사가 직접 진행하며, 담당이 바뀌지 않고 한 사람이 끝까지 책임집니다.
					</p>
				</div>
			</section>
			<CTABand />
		</>
	);
}
