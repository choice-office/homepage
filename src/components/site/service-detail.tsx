"use client";

import { Fragment, type ReactNode, useState } from "react";
import { SERVICE_SEO, SERVICES, type ServiceFaq } from "@/lib/site-data";
import { bindMidDots, cn } from "@/lib/utils";
import { Badge, Button, Card, CardBody, CardTitle } from "./ds";
import { Icon } from "./icon";
import { PageHero, SummaryLines } from "./sections";
import { useGo } from "./use-go";

const Block = ({ icon, title, children }: { icon: string; title: string; children: ReactNode }) => (
	<Card hover={false} className="h-full p-[28px]">
		<div className="mb-[16px] flex items-center gap-[10px]">
			<div className="flex h-[40px] w-[40px] items-center justify-center rounded-[var(--radius)] bg-[var(--color-accent-soft)]">
				<Icon n={icon} className="size-[20px] text-[color:var(--color-primary-dark)]" />
			</div>
			<h3 className="text-[19px]">{title}</h3>
		</div>
		{children}
	</Card>
);

const List = ({ items, ordered }: { items: string[]; ordered?: boolean }) => (
	<ol className="m-[0px] flex list-none flex-col gap-[12px] p-[0px]">
		{items.map((t, i) => (
			<li
				key={t}
				className="flex gap-[12px] text-[15px] text-[color:var(--text-body)] [line-height:1.6]"
			>
				{ordered ? (
					<span className="flex h-[24px] w-[24px] flex-none items-center justify-center rounded-full bg-[var(--color-primary)] font-bold text-[13px] text-white">
						{i + 1}
					</span>
				) : (
					<Icon
						n="check"
						className="mt-[2px] h-[18px] w-[18px] flex-none text-[color:var(--color-primary)]"
					/>
				)}
				<span>{t}</span>
			</li>
		))}
	</ol>
);

// 세부 대상 요건 접이식 — 네이티브 <details>라 접혀도 콘텐츠가 DOM/HTML에 항상 존재(색인 O),
// 사용자가 펼쳐 볼 수 있어 숨김 텍스트 스팸에 해당하지 않음. open 상태는 셰브런 회전용으로만 사용.
const Eligibility = ({ title, items }: { title: string; items: string[] }) => {
	const [open, setOpen] = useState(false);
	return (
		<details onToggle={(e) => setOpen(e.currentTarget.open)} className="mt-[24px]">
			<summary className="flex cursor-pointer list-none items-center justify-between gap-[12px] rounded-[var(--radius)] border border-[var(--border-default)] bg-[var(--surface-card)] px-[24px] py-[18px] font-semibold text-[16px]">
				<span className="inline-flex items-center gap-[10px]">
					<Icon
						n="clipboard-list"
						className="size-[20px] flex-none text-[color:var(--color-primary)]"
					/>
					{title}
				</span>
				<Icon
					n="chevron-down"
					className={cn(
						"size-[20px] flex-none text-[color:var(--text-muted)] transition-transform duration-200 ease-[ease]",
						open && "rotate-180",
					)}
				/>
			</summary>
			<div className="px-[24px] pt-[20px] pb-[4px]">
				<List items={items} />
			</div>
		</details>
	);
};

// 자주 묻는 질문 — 네이티브 <details>로 접혀도 답변이 DOM/HTML에 항상 존재(색인 O).
// 연구근거: FAQ 리치결과는 폐지됐으나 "화면에 보이는 직접 답변형 본문"이 검색·AI 인용에 핵심.
const FaqItem = ({ q, a, bullets, note }: ServiceFaq) => {
	const [open, setOpen] = useState(false);
	const hasBullets = !!bullets && bullets.length > 0;
	return (
		<details onToggle={(e) => setOpen(e.currentTarget.open)}>
			<summary className="flex cursor-pointer list-none items-center justify-between gap-[12px] px-[24px] py-[20px] font-semibold text-[16.5px] [line-height:1.5]">
				<span className="inline-flex items-baseline gap-[10px]">
					<span className="flex-none font-bold text-[color:var(--color-primary)]">Q</span>
					{q}
				</span>
				<Icon
					n="chevron-down"
					className={cn(
						"size-[20px] flex-none text-[color:var(--text-muted)] transition-transform duration-200 ease-[ease]",
						open && "rotate-180",
					)}
				/>
			</summary>
			<div className="pt-[0px] pr-[24px] pb-[22px] pl-[46px] text-[15px] text-[color:var(--text-body)] [line-height:1.8]">
				{a && (
					<p>
						{/* 원고의 줄바꿈("\n")을 그대로 조판 — 문장 경계에서 줄을 나눈다. */}
						{a.split("\n").map((line, i) => (
							<Fragment key={line}>
								{i > 0 && <br />}
								{line}
							</Fragment>
						))}
						{/* 목록이 없는 답변의 부기는 문장 끝에 인라인으로 붙인다(줄만 작게). */}
						{note && !hasBullets && <span className="faq-answer-note-inline"> {note}</span>}
					</p>
				)}
				{hasBullets && (
					<ul className={cn("faq-answer-list", a && "mt-[12px]")}>
						{bullets?.map((b) => (
							<li key={b}>
								<Icon n="check" className="faq-answer-check" />
								<span>{b}</span>
							</li>
						))}
					</ul>
				)}
				{note && hasBullets && <p className="faq-answer-note">{note}</p>}
			</div>
		</details>
	);
};

export const ServiceDetail = ({ id }: { id: string }) => {
	const go = useGo();
	const s = SERVICES.find((x) => x.id === id) || SERVICES[0];
	const others = SERVICES.filter((x) => x.id !== s.id);
	const faqs = SERVICE_SEO[s.id]?.faqs ?? [];
	return (
		<>
			<PageHero
				eyebrow={s.code}
				title={s.title}
				sub={bindMidDots(s.summary)}
				crumbs={[
					{ label: "홈", route: "home" },
					{ label: "업무분야", route: "services" },
					{ label: s.title },
				]}
				image="/업무분야-hero.png"
				imagePosition="object-[center_62%]"
			/>
			<section className="section bg-[var(--surface-page)]">
				<div className="wrap">
					<div data-stagger="split" className="grid-2 gap-[24px]">
						<Block icon="users" title="이런 분께 권합니다">
							<List items={s.target} />
						</Block>
						<Block icon="folder-check" title="필요 서류">
							<List items={s.docs} />
						</Block>
					</div>
					{s.eligibility && s.eligibility.length > 0 && (
						// NBSP 로 "자세히 보기"를 묶는다 — 좁은 폭에서 "보기"만 다음 줄에 남던 문제
						<Eligibility title={"단기상용·단기취업 대상 자세히\u00a0보기"} items={s.eligibility} />
					)}
					<div data-stagger className="grid-2 mt-[24px] gap-[24px]">
						<Block icon="route" title="업무 절차">
							<List items={s.steps} ordered />
						</Block>
						<div className="flex flex-col gap-[24px]">
							<Card
								hover={false}
								className="border-none bg-[var(--color-primary)] p-[28px] text-white"
							>
								<div className="flex items-center gap-[10px]">
									<Icon n="clock" className="size-[22px] text-[color:var(--color-accent-soft)]" />
									<h3 className="text-[19px] text-white">예상 소요 기간</h3>
								</div>
								<p className="mt-[16px] font-bold text-[22px] [line-height:1.4]">{s.period}</p>
								<p className="mt-[12px] text-[14px] text-[rgba(255,255,255,.78)] [line-height:1.7]">
									{s.periodNote}
								</p>
							</Card>
							<Card hover={false} className="flex flex-col gap-[14px] p-[28px]">
								<h3 className="svc-cta-title">{s.ctaSubject} 상담이 필요하신가요?</h3>
								<p className="text-[15px] text-[color:var(--text-body)] [line-height:1.7]">
									가능 여부와 준비 방향을 안내해 드립니다.
								</p>
								<Button
									variant="primary"
									size="lg"
									onClick={() => go("contact")}
									iconEnd={<Icon n="arrow-right" className="size-[18px]" />}
								>
									상담 신청
								</Button>
							</Card>
						</div>
					</div>
				</div>
			</section>
			{faqs.length > 0 && (
				<section className="section bg-[var(--surface-page)] pt-[8px]">
					<div className="wrap">
						<div className="mb-[28px]">
							<span className="font-bold text-[13px] text-[color:var(--color-accent)] uppercase tracking-[.12em]">
								FAQ
							</span>
							<h2 className="mt-[12px] text-[clamp(21px,3vw,30px)]">{s.title} 자주 묻는 질문</h2>
							<span className="mt-[18px] block h-[3px] w-[48px] bg-[var(--color-accent)]" />
						</div>
						<Card hover={false} className="p-[4px]">
							{faqs.map((f, i) => (
								<div key={f.q} className={cn(i > 0 && "border-t border-t-[var(--border-default)]")}>
									<FaqItem q={f.q} a={f.a} bullets={f.bullets} note={f.note} />
								</div>
							))}
						</Card>
					</div>
				</section>
			)}
			<section className="section bg-[var(--surface-sunken)] pt-[72px]">
				<div className="wrap">
					<div className="mb-[36px]">
						<span className="font-bold text-[13px] text-[color:var(--color-accent)] uppercase tracking-[.12em]">
							Other Services
						</span>
						<h2 className="mt-[12px] text-[clamp(21px,3vw,30px)]">다른 업무분야</h2>
						<p className="mt-[12px] text-[16px] text-[color:var(--text-muted)] [line-height:1.7]">
							찾으시는 분야가 있다면 함께 살펴보세요. 분야를 선택하면 대상·서류·절차·기간을 안내해
							드립니다.
						</p>
						<span className="mt-[18px] block h-[3px] w-[48px] rounded-none bg-[var(--color-accent)]" />
					</div>
					<div data-stagger="scale" className="grid-4">
						{others.slice(0, 4).map((o) => (
							<Card
								key={o.id}
								className="flex cursor-pointer flex-col bg-[var(--surface-card)] p-[26px]"
								onClick={() => {
									go("service", o.id);
									window.scrollTo({ top: 0 });
								}}
							>
								<div className="mb-[18px] flex items-start justify-between">
									<div className="flex h-[46px] w-[46px] items-center justify-center rounded-[var(--radius)] bg-[var(--color-accent-soft)]">
										<Icon
											n={o.icon}
											className="size-[23px] text-[color:var(--color-primary-dark)]"
										/>
									</div>
									<Badge>{o.code}</Badge>
								</div>
								<CardTitle className="text-[18px]">{o.title}</CardTitle>
								<CardBody className="svc-other-desc flex-1 text-[14.5px]">
									<SummaryLines text={o.summary} />
								</CardBody>
								<span className="mt-[18px] inline-flex items-center gap-[6px] font-semibold text-[14px] text-[color:var(--color-primary)]">
									자세히 보기 <Icon n="arrow-right" className="size-[15px]" />
								</span>
							</Card>
						))}
					</div>
					<div className="mt-[40px] text-center">
						<button
							type="button"
							className="lk inline-flex items-center gap-[8px] border-none bg-none font-semibold text-[16px] text-[color:var(--color-primary)]"
							onClick={() => {
								go("services");
								window.scrollTo({ top: 0 });
							}}
						>
							업무분야 전체 보기 <Icon n="arrow-right" className="size-[17px]" />
						</button>
					</div>
				</div>
			</section>
		</>
	);
};
