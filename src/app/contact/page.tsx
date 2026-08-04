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
				sub={
					<>
						복잡한 출입국·비자 절차, 담당 행정사가
						<br className="sm:hidden" /> 직접 확인하고 연락드립니다.
					</>
				}
				crumbs={[{ label: "홈", route: "home" }, { label: "문의하기" }]}
				image="/문의하기-hero.png"
			/>
			<section className="section contact-section">
				<div className="contact-shell wrap">
					<div className="contact-col" data-reveal>
						<h2 className="contact-col-title">연락처</h2>
						<span className="contact-rule" />
						<div className="contact-aside">
							<ContactInfo tone="dark" />
							<div className="contact-hours">
								<p className="contact-hours-title">업무 시간 : 평일 10:00 – 18:00</p>
								<p className="contact-hours-note">
									외부 출장이 많은 관계로 내방상담을 원하시는 분들은
									반드시&nbsp;사전에&nbsp;연락주시기&nbsp;바랍니다.
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
				<div className="contact-mapwrap wrap">
					<div className="contact-map" data-reveal>
						<MapBlock className="h-[460px]" />
					</div>
				</div>
			</section>
		</>
	);
}
