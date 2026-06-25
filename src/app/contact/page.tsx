import type { Metadata } from "next";
import {
	ContactForm,
	ContactInfo,
	MapBlock,
	PageHero,
	PageSectionTitle,
} from "@/components/site/sections";

export const metadata: Metadata = {
	title: "문의하기",
	description: "상담은 무료입니다. 행정사가 직접 연락드립니다. (한국어 · English · 中文)",
};

export default function ContactPage() {
	return (
		<>
			<PageHero
				eyebrow="Contact"
				title="문의하기"
				sub="상담은 무료입니다. 행정사가 직접 연락드립니다. (한국어 · English · 中文)"
				crumbs={[{ label: "홈", route: "home" }, { label: "문의하기" }]}
			/>
			<section className="section" style={{ background: "var(--surface-page)" }}>
				<div className="contact-grid container">
					<div>
						<PageSectionTitle title="연락처" />
						<ContactInfo />
						<div style={{ marginTop: 24 }}>
							<MapBlock height={400} />
						</div>
						<div style={{ marginTop: 16, fontSize: 13, lineHeight: 1.7 }}>
							<p style={{ fontWeight: 600, color: "var(--text-body)" }}>
								운영 시간 · 평일 09:00 – 18:00
							</p>
							<p style={{ marginTop: 4, color: "var(--text-muted)" }}>
								외부 출장이 잦아, 내방 상담은 사전 연락 부탁드립니다.
							</p>
						</div>
					</div>
					<div>
						<PageSectionTitle title="무료 상담 신청" />
						<ContactForm />
					</div>
				</div>
			</section>
		</>
	);
}
