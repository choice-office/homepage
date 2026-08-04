import type { Metadata } from "next";
import Image from "next/image";
import { Fragment } from "react";
import { Badge } from "@/components/site/ds";
import { Icon } from "@/components/site/icon";
import { CTABand, PageHero } from "@/components/site/sections";
import { type Member, TEAM } from "@/lib/site-data";

export const metadata: Metadata = {
	title: "행정사 소개",
	description: "상담부터 접수까지 직접 책임지는 시험 출신 행정사를 소개합니다.",
	alternates: { canonical: "/members" },
};

const ABOUT_CRUMB = { label: "사무소 소개", route: "greeting" };

// 대표(lead) 인사말 — 사진 없이도 다크 플레이트를 의도적으로 채우는 서명형 메시지
// 좁은 폭에선 문장 단위로 끊어 읽히게 한다(PC 는 기존 흐름 유지)
const LEAD_MESSAGE = ["복잡하게 느껴지는 출입국 절차,", "그 곁에서 길을 함께 찾겠습니다."];

// 구성원 1인 프로필 블록 — 인원이 늘면 좌우 교차(짝수/홀수)로 리듬을 준다.
const MemberProfile = ({ m, index }: { m: Member; index: number }) => (
	<article className="member-block" data-reveal>
		<div className="profile-card" data-flip={index % 2 === 1}>
			{/* 좌: 아이덴티티 + (대표) 인사말 — 사진 대신 타이포·서명으로 채운 다크 플레이트 */}
			<div className="profile-aside">
				<Image
					className="profile-monogram"
					src="/brand/logo-mark.png"
					alt=""
					width={246}
					height={203}
					aria-hidden="true"
				/>
				<div className="profile-identity">
					<span className="profile-eyebrow">초이스 행정사사무소</span>
					<h2 className="profile-name">{m.name}</h2>
				</div>
				{m.lead && (
					<blockquote className="profile-quote">
						<Icon
							n="quote"
							className="size-[26px] text-[color:var(--color-accent-soft)] opacity-90"
						/>
						<p>
							{LEAD_MESSAGE[0]}
							<br className="sm:hidden" /> {LEAD_MESSAGE[1]}
						</p>
					</blockquote>
				)}
			</div>
			{/* 우: 전문분야 · 핵심 이력 요약 */}
			<div className="profile-main">
				<span className="profile-section-label">전문 분야</span>
				<div className="profile-tags">
					{m.tags.map((t) => (
						// 각 칩은 한 줄(nowrap). "E6외국인 연예인 비자" 뒤에서 줄을 강제로 바꿔 4개 / 2개로 배치.
						<Fragment key={t}>
							<Badge variant="outline">{t}</Badge>
							{t === "E6외국인 연예인 비자" && (
								<span aria-hidden="true" className="h-0 basis-full" />
							)}
						</Fragment>
					))}
				</div>
				<span className="profile-section-label mt-[30px]">핵심 이력</span>
				<div className="profile-highlights">
					{m.career.map((c) => (
						<div className="profile-hl" key={c.text}>
							<span className="profile-hl-icon" aria-hidden="true">
								<Icon n={c.icon} className="size-[19px]" />
							</span>
							<span className="profile-hl-text">{c.text}</span>
						</div>
					))}
				</div>
			</div>
		</div>

		{m.bio.length > 0 && (
			<dl className="profile-bio" data-stagger>
				{m.bio.map((b) => (
					<div className="profile-bio-row" key={b.label}>
						<dt className="profile-bio-label">{b.label}</dt>
						<dd className="profile-bio-wrap">
							<ul className="profile-bio-items">
								{b.items.map((it) =>
									typeof it === "string" ? (
										<li className="profile-bio-item" key={it}>
											{it}
										</li>
									) : (
										<li className="profile-bio-item" key={it.text}>
											{it.text}
											<ul className="profile-bio-sub">
												{it.sub.map((s) => (
													<li className="profile-bio-subitem" key={s}>
														{s}
													</li>
												))}
											</ul>
										</li>
									),
								)}
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
				title="행정사 소개"
				sub="전문성과 책임감을 갖춘 행정사를 소개합니다."
				crumbs={[{ label: "홈", route: "home" }, ABOUT_CRUMB, { label: "행정사 소개" }]}
				image="/구성원-hero.png"
			/>
			<section className="section bg-(--surface-page)">
				<div className="wrap">
					<div className="member-list">
						{TEAM.map((m, i) => (
							<MemberProfile key={m.name} m={m} index={i} />
						))}
					</div>
					<p className="mt-11 text-center text-(--text-muted) text-[15px]">
						초이스 행정사사무소는 사무장이 없는 행정사 사무소로, 상담부터 접수까지 모든 과정을
						행정사가 직접 진행합니다.
					</p>
				</div>
			</section>
			<CTABand />
		</>
	);
}
