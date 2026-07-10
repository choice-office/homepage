import type { Metadata } from "next";
import Image from "next/image";
import { Badge } from "@/components/site/ds";
import { Icon } from "@/components/site/icon";
import { CTABand, PageHero } from "@/components/site/sections";
import { type Member, TEAM } from "@/lib/site-data";

export const metadata: Metadata = {
	title: "구성원",
	description: "상담부터 접수까지 직접 책임지는 시험 출신 행정사를 소개합니다.",
};

const ABOUT_CRUMB = { label: "사무소 소개", route: "greeting" };

// 대표(lead) 인삿말 — 사진 없이도 다크 플레이트를 의도적으로 채우는 서명형 메시지
const LEAD_MESSAGE = "복잡하게 느껴지는 출입국 절차, 그 곁에서 길을 함께 찾겠습니다.";

// 구성원 1인 프로필 블록 — 인원이 늘면 좌우 교차(짝수/홀수)로 리듬을 준다.
const MemberProfile = ({ m, index }: { m: Member; index: number }) => (
	<article className="member-block" data-reveal>
		<div className="profile-card" data-flip={index % 2 === 1}>
			{/* 좌: 아이덴티티 + (대표) 인삿말 — 사진 대신 타이포·서명으로 채운 다크 플레이트 */}
			<div className="profile-aside">
				<Image
					className="profile-monogram"
					src="/logo-mark.png"
					alt=""
					width={246}
					height={203}
					aria-hidden="true"
				/>
				<div className="profile-identity">
					<span className="profile-eyebrow">CHOICE · {m.title}</span>
					<h2 className="profile-name">{m.name}</h2>
					<p className="profile-tagline">{m.summary}</p>
				</div>
				{m.lead && (
					<blockquote className="profile-quote">
						<Icon
							n="quote"
							style={{ width: 26, height: 26, color: "var(--color-accent-soft)", opacity: 0.9 }}
						/>
						<p>{LEAD_MESSAGE}</p>
						<cite>
							— {m.title} {m.name}
						</cite>
					</blockquote>
				)}
			</div>
			{/* 우: 전문분야 · 핵심 이력 요약 */}
			<div className="profile-main">
				<span className="profile-section-label">전문 분야</span>
				<div className="profile-tags">
					{m.tags.map((t) => (
						<Badge key={t} variant="outline">
							{t}
						</Badge>
					))}
				</div>
				<span className="profile-section-label" style={{ marginTop: 30 }}>
					핵심 이력
				</span>
				<div className="profile-highlights">
					{m.career.map((c) => (
						<div className="profile-hl" key={c.text}>
							<span className="profile-hl-icon" aria-hidden="true">
								<Icon n={c.icon} style={{ width: 19, height: 19 }} />
							</span>
							<span className="profile-hl-text">{c.text}</span>
						</div>
					))}
				</div>
				<div className="profile-reg">{m.reg}</div>
			</div>
		</div>

		{m.bio.length > 0 && (
			<dl className="profile-bio" data-stagger>
				{m.bio.map((b) => (
					<div className="profile-bio-row" key={b.label}>
						<dt className="profile-bio-label">{b.label}</dt>
						<dd className="profile-bio-wrap">
							<ul className="profile-bio-items">
								{b.items.map((it) => (
									<li className="profile-bio-item" key={it}>
										{it}
									</li>
								))}
							</ul>
						</dd>
					</div>
				))}
			</dl>
		)}
	</article>
);

export default function MembersPage() {
	return (
		<>
			<PageHero
				title="구성원"
				sub="상담부터 접수까지 직접 책임지는 행정사를 소개합니다."
				crumbs={[{ label: "홈", route: "home" }, ABOUT_CRUMB, { label: "구성원" }]}
			/>
			<section className="section" style={{ background: "var(--surface-page)" }}>
				<div className="container">
					<div className="member-list">
						{TEAM.map((m, i) => (
							<MemberProfile key={m.name} m={m} index={i} />
						))}
					</div>
					<p
						style={{ textAlign: "center", marginTop: 44, fontSize: 15, color: "var(--text-muted)" }}
					>
						상담은 시험 출신 행정사가 직접 진행하며, 담당이 바뀌지 않고 한 사람이 끝까지 책임집니다.
					</p>
				</div>
			</section>
			<CTABand />
		</>
	);
}
