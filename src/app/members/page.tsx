import type { Metadata } from "next";
import Image from "next/image";
import { Badge } from "@/components/site/ds";
import { Icon } from "@/components/site/icon";
import { CTABand, PageHero } from "@/components/site/sections";
import { TEAM } from "@/lib/site-data";

export const metadata: Metadata = {
	title: "구성원",
	description: "상담부터 접수까지 직접 책임지는 시험 출신 행정사를 소개합니다.",
};

const ABOUT_CRUMB = { label: "사무소 소개", route: "greeting" };

export default function MembersPage() {
	const m = TEAM[0];
	return (
		<>
			<PageHero
				title="구성원"
				sub="상담부터 접수까지 직접 책임지는 행정사를 소개합니다."
				crumbs={[{ label: "홈", route: "home" }, ABOUT_CRUMB, { label: "구성원" }]}
			/>
			<section className="section" style={{ background: "var(--surface-page)" }}>
				<div className="container">
					<div className="profile-card" data-reveal>
						<div className="profile-aside">
							<Image
								className="profile-emblem"
								src="/logo-mark.png"
								alt=""
								width={246}
								height={203}
							/>
							<span className="profile-role">{m.title}</span>
							<div className="profile-name">{m.name}</div>
							<p className="profile-tagline">{m.summary}</p>
						</div>
						<div className="profile-main">
							<div className="profile-tags">
								{m.tags.map((t) => (
									<Badge key={t} variant="outline">
										{t}
									</Badge>
								))}
							</div>
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
