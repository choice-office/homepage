import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
	title: `이용약관 | ${siteConfig.name}`,
	robots: { index: false },
};

// ★ 설정: 아래 항목을 클라이언트 정보에 맞게 교체하세요
const EFFECTIVE_DATE = "2026년 6월 22일"; // 시행일
const CONTACT_EMAIL = "choice@kvisa1345.com"; // 문의 이메일
const SERVICE_NAME = "행정사 업무 안내 및 상담"; // 서비스 이름

export default function TermsPage() {
	const company = siteConfig.name;

	return (
		<main className="mx-auto max-w-3xl px-4 py-24 sm:px-6 lg:px-8">
			<h1 className="font-bold text-3xl tracking-tight sm:text-4xl">이용약관</h1>
			<p className="mt-4 text-muted-foreground text-sm">시행일: {EFFECTIVE_DATE}</p>

			<div className="prose prose-neutral dark:prose-invert mt-10 max-w-none space-y-10 text-sm leading-relaxed">
				<section>
					<h2 className="font-semibold text-base">제1조 (목적)</h2>
					<p className="mt-3 text-muted-foreground">
						이 약관은 {company}(이하 &quot;회사&quot;)가 제공하는 {SERVICE_NAME} 서비스(이하
						&quot;서비스&quot;)의 이용조건 및 절차, 회사와 이용자 간의 권리·의무 관계를 규정함을
						목적으로 합니다.
					</p>
				</section>

				<section>
					<h2 className="font-semibold text-base">제2조 (약관의 효력 및 변경)</h2>
					<ol className="mt-3 list-decimal space-y-1 pl-5 text-muted-foreground">
						<li>
							이 약관은 서비스 화면에 게시하거나 기타 방법으로 이용자에게 공지함으로써 효력이
							발생합니다.
						</li>
						<li>
							회사는 합리적인 사유가 있을 경우 약관을 변경할 수 있으며, 변경된 약관은 공지 후 효력이
							발생합니다.
						</li>
					</ol>
				</section>

				<section>
					<h2 className="font-semibold text-base">제3조 (서비스의 제공)</h2>
					<p className="mt-3 text-muted-foreground">회사는 다음과 같은 서비스를 제공합니다.</p>
					<ul className="mt-2 list-disc space-y-1 pl-5 text-muted-foreground">
						{/* ★ 서비스 항목을 실제 서비스 내용으로 교체하세요 */}
						<li>홈페이지를 통한 서비스 안내 및 문의 접수</li>
						<li>기타 회사가 정하는 서비스</li>
					</ul>
				</section>

				<section>
					<h2 className="font-semibold text-base">제4조 (서비스 이용)</h2>
					<ol className="mt-3 list-decimal space-y-1 pl-5 text-muted-foreground">
						<li>서비스는 연중무휴 24시간 제공을 원칙으로 합니다.</li>
						<li>
							회사는 시스템 점검·보수, 기타 기술적 문제로 인해 서비스를 일시 중단할 수 있으며, 이
							경우 사전에 공지합니다.
						</li>
					</ol>
				</section>

				<section>
					<h2 className="font-semibold text-base">제5조 (이용자의 의무)</h2>
					<p className="mt-3 text-muted-foreground">이용자는 다음 행위를 해서는 안 됩니다.</p>
					<ul className="mt-2 list-disc space-y-1 pl-5 text-muted-foreground">
						<li>타인의 정보를 도용하는 행위</li>
						<li>회사가 게시한 정보를 무단으로 변경하는 행위</li>
						<li>회사 또는 제3자의 지적재산권을 침해하는 행위</li>
						<li>기타 불법·부당한 행위</li>
					</ul>
				</section>

				<section>
					<h2 className="font-semibold text-base">제6조 (개인정보 보호)</h2>
					<p className="mt-3 text-muted-foreground">
						회사는 이용자의 개인정보를 보호하기 위해 별도의 개인정보처리방침을 수립·운영합니다.
						자세한 내용은{" "}
						<a href="/privacy" className="underline underline-offset-2">
							개인정보처리방침
						</a>
						을 참고하시기 바랍니다.
					</p>
				</section>

				<section>
					<h2 className="font-semibold text-base">제7조 (면책조항)</h2>
					<ol className="mt-3 list-decimal space-y-1 pl-5 text-muted-foreground">
						<li>
							회사는 천재지변, 불가항력적 사유로 서비스를 제공할 수 없는 경우 서비스 제공 의무를
							면합니다.
						</li>
						<li>회사는 이용자의 귀책사유로 인한 서비스 이용 장애에 대해 책임을 지지 않습니다.</li>
					</ol>
				</section>

				<section>
					<h2 className="font-semibold text-base">제8조 (준거법 및 관할법원)</h2>
					<p className="mt-3 text-muted-foreground">
						이 약관과 관련한 분쟁은 대한민국 법을 준거법으로 하며, 분쟁 발생 시 회사 소재지를
						관할하는 법원을 제1심 관할법원으로 합니다.
					</p>
				</section>

				<section>
					<h2 className="font-semibold text-base">부칙</h2>
					<p className="mt-3 text-muted-foreground">이 약관은 {EFFECTIVE_DATE}부터 시행합니다.</p>
				</section>
			</div>

			<div className="mt-12 border-t pt-8 text-muted-foreground text-xs">
				<p>
					{company} &mdash; 약관 관련 문의:{" "}
					<a href={`mailto:${CONTACT_EMAIL}`} className="underline underline-offset-2">
						{CONTACT_EMAIL}
					</a>
				</p>
			</div>
		</main>
	);
}
