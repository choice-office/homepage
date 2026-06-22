import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
	title: `개인정보처리방침 | ${siteConfig.name}`,
	robots: { index: false },
};

// ★ 설정: 아래 항목을 클라이언트 정보에 맞게 교체하세요
const EFFECTIVE_DATE = "2026년 6월 22일"; // 시행일
const CONTACT_EMAIL = "choice@kvisa1345.com"; // 개인정보 문의 이메일
const CONTACT_TEL = "02-6959-9886"; // 개인정보 문의 전화
const OFFICER_NAME = "○○○"; // TODO: 개인정보 보호책임자 성함 확정 시 교체
const OFFICER_POSITION = "대표 행정사"; // 직책

export default function PrivacyPage() {
	const company = siteConfig.name;

	return (
		<main className="mx-auto max-w-3xl px-4 py-24 sm:px-6 lg:px-8">
			<h1 className="font-bold text-3xl tracking-tight sm:text-4xl">개인정보처리방침</h1>
			<p className="mt-4 text-muted-foreground text-sm">시행일: {EFFECTIVE_DATE}</p>

			<div className="prose prose-neutral dark:prose-invert mt-10 max-w-none space-y-10 text-sm leading-relaxed">
				<section>
					<h2 className="font-semibold text-base">제1조 (총칙)</h2>
					<p className="mt-3 text-muted-foreground">
						{company}(이하 &quot;회사&quot;)는 「개인정보 보호법」을 준수하며, 이용자의 개인정보를
						보호하기 위해 다음과 같이 개인정보처리방침을 수립·공개합니다.
					</p>
				</section>

				<section>
					<h2 className="font-semibold text-base">제2조 (수집하는 개인정보 항목)</h2>
					<p className="mt-3 text-muted-foreground">회사는 다음의 개인정보를 수집합니다.</p>
					<ul className="mt-2 list-disc space-y-1 pl-5 text-muted-foreground">
						<li>필수: 성함, 연락처, 상담 희망 분야, 문의 내용, 개인정보 수집·이용 동의 여부</li>
						<li>선택: 이메일, 국적, 현재 체류자격</li>
						<li>자동 수집: 접속 IP, 서비스 이용 기록, 쿠키 (Google Analytics 등)</li>
					</ul>
				</section>

				<section>
					<h2 className="font-semibold text-base">제3조 (개인정보의 수집 및 이용목적)</h2>
					<ul className="mt-3 list-disc space-y-1 pl-5 text-muted-foreground">
						<li>문의 접수 및 답변 처리</li>
						<li>서비스 개선 및 통계 분석</li>
					</ul>
				</section>

				<section>
					<h2 className="font-semibold text-base">제4조 (개인정보의 보유 및 이용기간)</h2>
					<p className="mt-3 text-muted-foreground">
						수집 목적이 달성된 후 즉시 파기합니다. 단, 관계 법령에 따라 보존 의무가 있는 경우 해당
						기간 동안 보관합니다.
					</p>
					<ul className="mt-2 list-disc space-y-1 pl-5 text-muted-foreground">
						<li>문의 기록: 처리 완료 후 3년 (소비자 보호에 관한 법률)</li>
						<li>접속 로그: 3개월 (통신비밀보호법)</li>
					</ul>
				</section>

				<section>
					<h2 className="font-semibold text-base">제5조 (개인정보의 제3자 제공)</h2>
					<p className="mt-3 text-muted-foreground">
						회사는 원칙적으로 이용자의 개인정보를 외부에 제공하지 않습니다. 다만, 이용자의 동의가
						있거나 법령에 근거한 경우는 예외입니다.
					</p>
				</section>

				<section>
					<h2 className="font-semibold text-base">제6조 (개인정보처리 위탁)</h2>
					<p className="mt-3 text-muted-foreground">
						회사는 서비스 제공을 위해 다음과 같이 개인정보 처리를 위탁합니다.
					</p>
					<ul className="mt-2 list-disc space-y-1 pl-5 text-muted-foreground">
						<li>수탁자: Vercel Inc. / 위탁 업무: 서비스 호스팅 및 인프라 운영</li>
						<li>
							수탁자: Supabase Inc. / 위탁 업무: 데이터베이스 운영 (문의 데이터 저장, 해당되는 경우)
						</li>
					</ul>
				</section>

				<section>
					<h2 className="font-semibold text-base">제7조 (정보주체의 권리·의무)</h2>
					<p className="mt-3 text-muted-foreground">
						이용자는 개인정보 열람, 정정, 삭제, 처리정지를 요구할 권리가 있습니다. 요청은 아래
						개인정보 보호책임자에게 연락하시기 바랍니다.
					</p>
				</section>

				<section>
					<h2 className="font-semibold text-base">제8조 (개인정보 보호책임자)</h2>
					<dl className="mt-3 space-y-1 text-muted-foreground">
						<div className="flex gap-2">
							<dt className="font-medium text-foreground">책임자</dt>
							<dd>
								{OFFICER_NAME} ({OFFICER_POSITION})
							</dd>
						</div>
						<div className="flex gap-2">
							<dt className="font-medium text-foreground">이메일</dt>
							<dd>
								<a href={`mailto:${CONTACT_EMAIL}`} className="underline underline-offset-2">
									{CONTACT_EMAIL}
								</a>
							</dd>
						</div>
						<div className="flex gap-2">
							<dt className="font-medium text-foreground">전화</dt>
							<dd>{CONTACT_TEL}</dd>
						</div>
					</dl>
				</section>

				<section>
					<h2 className="font-semibold text-base">제9조 (개인정보처리방침 변경)</h2>
					<p className="mt-3 text-muted-foreground">
						이 개인정보처리방침은 {EFFECTIVE_DATE}부터 시행됩니다. 변경 시 홈페이지를 통해
						공지합니다.
					</p>
				</section>
			</div>

			<div className="mt-12 border-t pt-8 text-muted-foreground text-xs">
				<p>
					{company} &mdash; 본 방침에 대한 문의:{" "}
					<a href={`mailto:${CONTACT_EMAIL}`} className="underline underline-offset-2">
						{CONTACT_EMAIL}
					</a>
				</p>
			</div>
		</main>
	);
}
