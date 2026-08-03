import type { Metadata } from "next";
import Image from "next/image";
import { Icon } from "@/components/site/icon";
import { CTABand, PageHero } from "@/components/site/sections";
import { OFFICE_IMG, TRADEMARK_IMG } from "@/lib/site-data";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
	title: "인사말",
	description:
		"초이스 행정사사무소가 의뢰인께 드리는 인사말입니다. 혼자 고민하지 마시고 편하게 문을 두드려 주세요.",
	alternates: { canonical: "/greeting" },
};

const ABOUT_CRUMB = { label: "사무소 소개", route: "greeting" };

// 상표등록 원부 발췌 — 증서에 적힌 사실만 그대로 옮긴다(등록번호·주소는 비공개)
const TRADEMARK_FACTS: { label: string; value: string }[] = [
	{ label: "출원일", value: "2019년 5월 8일" },
	{ label: "등록일", value: "2021년 10월 22일" },
	{ label: "상품류", value: "제45류 · 행정사업 등 2건" },
	{ label: "등록기관", value: "특허청 (KIPO)" },
];

// 「상표법」 제6장 상표권자의 보호 — 조문 취지만 한 줄로 압축(원문은 국가법령정보센터)
const TRADEMARK_LAW: { article: string; title: string; body: string }[] = [
	{
		article: "제107조",
		title: "권리침해에 대한 금지청구권 등",
		body: "침해의 금지·예방과 함께 침해물의 폐기, 침해에 제공된 설비의 제거 등 필요한 조치를 청구할 수 있습니다.",
	},
	{
		article: "제108조",
		title: "침해로 보는 행위",
		body: "등록상표와 동일·유사한 상표를 동일·유사한 상품에 사용하는 행위는 물론, 그 목적으로 교부·판매·위조·모조·소지하는 행위까지 침해로 봅니다.",
	},
	{
		article: "제109조",
		title: "손해배상의 청구",
		body: "고의 또는 과실로 상표권을 침해한 자에게 손해배상을 청구할 수 있습니다.",
	},
	{
		article: "제111조",
		title: "법정손해배상의 청구",
		body: "손해액을 따로 입증하지 않고 1억원(고의적 침해는 3억원) 이하의 범위에서 배상을 청구할 수 있습니다.",
	},
	{
		article: "제112조",
		title: "고의의 추정",
		body: "등록상표임을 표시한 상표권을 침해한 자는 그 상표가 이미 등록된 사실을 알았던 것으로 추정합니다.",
	},
	{
		article: "제113조",
		title: "상표권자 등의 신용회복",
		body: "법원은 손해배상에 갈음하거나 손해배상과 함께 업무상 신용회복에 필요한 조치를 명할 수 있습니다.",
	},
];

export default function GreetingPage() {
	return (
		<>
			<PageHero
				title="인사말"
				sub="초이스 행정사사무소를 찾아주셔서 감사합니다."
				crumbs={[{ label: "홈", route: "home" }, ABOUT_CRUMB, { label: "인사말" }]}
				image="/인사말-hero.png"
				imagePosition="66% 72%"
			/>
			<section className={cn("section", "bg-[var(--surface-page)]")}>
				<div className="wrap">
					<div data-stagger="split" className={cn("grid-2 greeting-split", "items-stretch")}>
						<div className="flex flex-col justify-center">
							<Icon n="quote" className="size-[40px] text-[color:var(--color-primary-light)]" />
							<h2 className="mt-4 text-[clamp(26px,3.4vw,34px)] leading-[1.5]">
								복잡하게 느껴지는 출입국 절차,
								<br />그 곁에서 길을 함께 찾겠습니다.
							</h2>
							<div className="mt-7 flex flex-col gap-[18px] text-[16.5px] text-[color:var(--text-body)] leading-[1.9]">
								<p>안녕하십니까. '실력에 책임감을 더한' 초이스 행정사사무소입니다.</p>
								<p>
									살다 보면 익숙하지 않은 행정 절차 앞에서 무엇부터 시작해야 할지, 어떤 정보가
									정확한지 판단하기 어려운 막막한 순간이 있습니다. 초이스 행정사사무소는 그런
									상황에서 의뢰인의 입장에서 함께 길을 찾아드리는 역할을 하고 있습니다.
								</p>
								<p>
									2019년 사무소 개소 이후 외국인 체류 및 비자, 출입국 관련 행정 업무를 중심으로
									다양한 사례를 직접 다뤄오며 실무 경험을 쌓아왔습니다. 이러한 경험을 바탕으로
									의뢰인분들의 각 상황에 맞는 현실적인 방향을 안내드리고 있습니다.
								</p>
								<p>
									복잡한 행정 절차 앞에서 혼자 고민하지 마세요. 초이스 행정사사무소가 곁에서
									함께하겠습니다.
								</p>
							</div>
							<div className="mt-8 border-t border-t-[color:var(--border-default)] pt-6">
								<div className="text-[15px] text-[color:var(--text-muted)]">마음을 다해,</div>
								<div className="mt-1.5 font-bold text-[22px] tracking-[-0.02em]">
									초이스 행정사사무소
								</div>
								<div className="mt-1 font-bold text-[18px] tracking-[-0.02em]">
									대표 행정사 최서연{" "}
									<span className="font-medium text-[15px] text-[color:var(--text-muted)]">
										드림
									</span>
								</div>
							</div>
						</div>
						<div className="relative min-h-[460px] overflow-hidden rounded-[var(--radius-lg)] bg-[#241d16]">
							{/* 사무소 사진은 보정·오버레이 없이 원본 그대로 */}
							<Image
								src={OFFICE_IMG}
								alt="사무소 전경"
								fill
								sizes="(max-width: 960px) 100vw, 50vw"
								className="object-cover"
							/>
						</div>
					</div>
				</div>
			</section>

			{/* 상표등록 — 홍보 배지가 아니라 등록 원부 발췌처럼 읽히게 조판한다 */}
			<section className={cn("section", "bg-[var(--surface-subtle)]")} aria-labelledby="tm-title">
				<div className="wrap">
					<div className="tm-grid">
						<figure className="tm-cert">
							<Image
								src={TRADEMARK_IMG}
								alt="초이스 행정사사무소 상표등록증 — 특허청 발급, 등록일 2021년 10월 22일"
								width={616}
								height={829}
								sizes="(max-width: 900px) 88vw, 300px"
							/>
							<figcaption>특허청 발급 상표등록증</figcaption>
						</figure>

						<div className="tm-body">
							<span className="tm-eyebrow">Trademark</span>
							<h2 id="tm-title" className="tm-title">
								등록된 상표입니다
							</h2>
							<p className="tm-lead">
								초이스 행정사사무소
								<span className="tm-en">CHOI’S Administrative Attorney Office</span>는 2019년 개업과
								동시에 상표를 출원하고,
								<br />
								불사용취소심판에서 승소하여 2021년 10월 22일 상표등록을 마쳤습니다.
							</p>

							<dl className="tm-facts">
								{TRADEMARK_FACTS.map((f) => (
									<div className="tm-fact" key={f.label}>
										<dt>{f.label}</dt>
										<dd>{f.value}</dd>
									</div>
								))}
							</dl>

							<p className="tm-warn">
								유사한 상호나 동일한 문자를 사용하는 경우 상표권 침해에 해당하며,
								<br />
								「상표법」 제230조에 따라 <strong>7년 이하의 징역 또는 1억원 이하의 벌금</strong>에
								처해질 수 있습니다.
							</p>

							<details className="tm-law">
								<summary>
									「상표법」 제6장 상표권자의 보호 — 제107조·제108조·제109조·제111조~제113조
								</summary>
								<ul>
									{TRADEMARK_LAW.map((l) => (
										<li key={l.article}>
											<span className="tm-law-head">
												{l.article} <em>{l.title}</em>
											</span>
											{l.body}
										</li>
									))}
								</ul>
								<p className="tm-law-note">
									조문 취지를 요약한 것으로, 정확한 내용은 국가법령정보센터의 원문을 따릅니다.
								</p>
							</details>
						</div>
					</div>
				</div>
			</section>
			<CTABand />
		</>
	);
}
