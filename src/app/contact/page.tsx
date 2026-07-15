import type { Metadata } from "next";
import { ContactForm, ContactInfo, MapBlock, PageHero } from "@/components/site/sections";

export const metadata: Metadata = {
	title: "문의하기",
	description: "복잡한 출입국·비자 절차, 담당 행정사가 직접 확인하고 연락드립니다.",
	alternates: { canonical: "/contact" },
};

export default function ContactPage() {
	return (
		<>
			<PageHero
				title="문의하기"
				sub="복잡한 출입국·비자 절차, 담당 행정사가 직접 확인하고 연락드립니다."
				crumbs={[{ label: "홈", route: "home" }, { label: "문의하기" }]}
			/>
			<section className="section contact-section">
				<div className="contact-shell container">
					<div className="contact-col" data-reveal>
						<h2 className="contact-col-title">연락처</h2>
						<span className="contact-rule" />
						<div className="contact-aside">
							<ContactInfo tone="dark" />
							<div className="contact-hours">
								<p className="contact-hours-title">운영 시간 · 평일 09:00 – 18:00</p>
								<p className="contact-hours-note">
									외부 출장이 잦아, 내방 상담은 사전 연락 부탁드립니다.
								</p>
							</div>
						</div>
					</div>
					<div className="contact-col" data-reveal>
						<h2 className="contact-col-title">상담 신청</h2>
						<span className="contact-rule" />
						<ContactForm />
					</div>
				</div>
				<div className="contact-mapwrap container">
					<div className="contact-map" data-reveal>
						<MapBlock height={460} />
					</div>
				</div>
			</section>
		</>
	);
}
