"use client";

import { type ReactNode, useState } from "react";
import { SERVICE_SEO, SERVICES } from "@/lib/site-data";
import { Badge, Button, Card, CardBody, CardTitle } from "./ds";
import { Icon } from "./icon";
import { PageHero } from "./sections";
import { useGo } from "./use-go";

const Block = ({ icon, title, children }: { icon: string; title: string; children: ReactNode }) => (
	<Card hover={false} padding="28px" style={{ height: "100%" }}>
		<div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
			<div
				style={{
					width: 40,
					height: 40,
					borderRadius: "var(--radius)",
					background: "var(--color-accent-soft)",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
				}}
			>
				<Icon n={icon} style={{ width: 20, height: 20, color: "var(--color-primary-dark)" }} />
			</div>
			<h3 style={{ fontSize: 19 }}>{title}</h3>
		</div>
		{children}
	</Card>
);

const List = ({ items, ordered }: { items: string[]; ordered?: boolean }) => (
	<ol
		style={{
			margin: 0,
			padding: 0,
			listStyle: "none",
			display: "flex",
			flexDirection: "column",
			gap: 12,
		}}
	>
		{items.map((t, i) => (
			<li
				key={t}
				style={{
					display: "flex",
					gap: 12,
					fontSize: 15,
					lineHeight: 1.6,
					color: "var(--text-body)",
				}}
			>
				{ordered ? (
					<span
						style={{
							flex: "0 0 auto",
							width: 24,
							height: 24,
							borderRadius: "50%",
							background: "var(--color-primary)",
							color: "#fff",
							fontSize: 13,
							fontWeight: 700,
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
						}}
					>
						{i + 1}
					</span>
				) : (
					<Icon
						n="check"
						style={{
							width: 18,
							height: 18,
							color: "var(--color-primary)",
							flex: "0 0 auto",
							marginTop: 2,
						}}
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
		<details onToggle={(e) => setOpen(e.currentTarget.open)} style={{ marginTop: 24 }}>
			<summary
				style={{
					listStyle: "none",
					cursor: "pointer",
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
					gap: 12,
					padding: "18px 24px",
					borderRadius: "var(--radius)",
					border: "1px solid var(--border-default)",
					background: "var(--surface-card)",
					fontSize: 16,
					fontWeight: 600,
				}}
			>
				<span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
					<Icon
						n="clipboard-list"
						style={{ width: 20, height: 20, color: "var(--color-primary)", flex: "0 0 auto" }}
					/>
					{title}
				</span>
				<Icon
					n="chevron-down"
					style={{
						width: 20,
						height: 20,
						color: "var(--text-muted)",
						flex: "0 0 auto",
						transition: "transform .2s ease",
						transform: open ? "rotate(180deg)" : "none",
					}}
				/>
			</summary>
			<div style={{ padding: "20px 24px 4px" }}>
				<List items={items} />
			</div>
		</details>
	);
};

// 자주 묻는 질문 — 네이티브 <details>로 접혀도 답변이 DOM/HTML에 항상 존재(색인 O).
// 연구근거: FAQ 리치결과는 폐지됐으나 "화면에 보이는 직접 답변형 본문"이 검색·AI 인용에 핵심.
const FaqItem = ({ q, a }: { q: string; a: string }) => {
	const [open, setOpen] = useState(false);
	return (
		<details onToggle={(e) => setOpen(e.currentTarget.open)}>
			<summary
				style={{
					listStyle: "none",
					cursor: "pointer",
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
					gap: 12,
					padding: "20px 24px",
					fontSize: 16.5,
					fontWeight: 600,
					lineHeight: 1.5,
				}}
			>
				<span style={{ display: "inline-flex", alignItems: "baseline", gap: 10 }}>
					<span style={{ color: "var(--color-primary)", fontWeight: 700, flex: "0 0 auto" }}>
						Q
					</span>
					{q}
				</span>
				<Icon
					n="chevron-down"
					style={{
						width: 20,
						height: 20,
						color: "var(--text-muted)",
						flex: "0 0 auto",
						transition: "transform .2s ease",
						transform: open ? "rotate(180deg)" : "none",
					}}
				/>
			</summary>
			<div
				style={{
					padding: "0 24px 22px 46px",
					fontSize: 15,
					lineHeight: 1.8,
					color: "var(--text-body)",
				}}
			>
				{a}
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
				eyebrow={`업무분야 · ${s.code}`}
				title={s.title}
				sub={s.summary}
				crumbs={[
					{ label: "홈", route: "home" },
					{ label: "업무분야", route: "services" },
					{ label: s.title },
				]}
				image="/업무분야-hero.png"
				imagePosition="center 62%"
			/>
			<section className="section" style={{ background: "var(--surface-page)" }}>
				<div className="wrap">
					<div data-stagger="split" className="grid-2" style={{ gap: 24 }}>
						<Block icon="users" title="이런 분께 권합니다">
							<List items={s.target} />
						</Block>
						<Block icon="folder-check" title="필요 서류">
							<List items={s.docs} />
						</Block>
					</div>
					{s.eligibility && s.eligibility.length > 0 && (
						<Eligibility title="단기상용·단기취업 대상 자세히 보기" items={s.eligibility} />
					)}
					<div data-stagger className="grid-2" style={{ gap: 24, marginTop: 24 }}>
						<Block icon="route" title="업무 절차">
							<List items={s.steps} ordered />
						</Block>
						<div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
							<Card
								hover={false}
								padding="28px"
								style={{ background: "var(--color-primary)", color: "#fff", border: "none" }}
							>
								<div style={{ display: "flex", alignItems: "center", gap: 10 }}>
									<Icon
										n="clock"
										style={{ width: 22, height: 22, color: "var(--color-accent-soft)" }}
									/>
									<h3 style={{ fontSize: 19, color: "#fff" }}>예상 소요 기간</h3>
								</div>
								<p style={{ fontSize: 22, fontWeight: 700, marginTop: 16, lineHeight: 1.4 }}>
									{s.period}
								</p>
								<p
									style={{
										fontSize: 14,
										color: "rgba(255,255,255,.78)",
										marginTop: 12,
										lineHeight: 1.7,
									}}
								>
									{s.periodNote}
								</p>
							</Card>
							<Card
								hover={false}
								padding="28px"
								style={{ display: "flex", flexDirection: "column", gap: 14 }}
							>
								<h3 className="svc-cta-title">{s.ctaSubject} 상담이 필요하신가요?</h3>
								<p style={{ fontSize: 15, color: "var(--text-body)", lineHeight: 1.7 }}>
									가능 여부와 준비 방향을 안내해 드립니다.
								</p>
								<Button
									variant="primary"
									size="lg"
									onClick={() => go("contact")}
									iconEnd={<Icon n="arrow-right" style={{ width: 18, height: 18 }} />}
								>
									상담 신청
								</Button>
							</Card>
						</div>
					</div>
				</div>
			</section>
			{faqs.length > 0 && (
				<section className="section" style={{ background: "var(--surface-page)", paddingTop: 8 }}>
					<div className="wrap">
						<div style={{ marginBottom: 28 }}>
							<span
								style={{
									fontSize: 13,
									fontWeight: 700,
									letterSpacing: ".12em",
									textTransform: "uppercase",
									color: "var(--color-accent)",
								}}
							>
								FAQ
							</span>
							<h2 style={{ fontSize: "clamp(21px,3vw,30px)", marginTop: 12 }}>
								{s.title} 자주 묻는 질문
							</h2>
							<span
								style={{
									display: "block",
									width: 48,
									height: 3,
									background: "var(--color-accent)",
									marginTop: 18,
								}}
							/>
						</div>
						<Card hover={false} padding="4px 4px">
							{faqs.map((f, i) => (
								<div
									key={f.q}
									style={{ borderTop: i > 0 ? "1px solid var(--border-default)" : "none" }}
								>
									<FaqItem q={f.q} a={f.a} />
								</div>
							))}
						</Card>
					</div>
				</section>
			)}
			<section className="section" style={{ background: "var(--surface-sunken)", paddingTop: 72 }}>
				<div className="wrap">
					<div style={{ marginBottom: 36 }}>
						<span
							style={{
								fontSize: 13,
								fontWeight: 700,
								letterSpacing: ".12em",
								textTransform: "uppercase",
								color: "var(--color-accent)",
							}}
						>
							Other Services
						</span>
						<h2 style={{ fontSize: "clamp(21px,3vw,30px)", marginTop: 12 }}>다른 업무분야</h2>
						<p style={{ fontSize: 16, color: "var(--text-muted)", marginTop: 12, lineHeight: 1.7 }}>
							찾으시는 분야가 있다면 함께 살펴보세요. 분야를 선택하면 대상·서류·절차·기간을 안내해
							드립니다.
						</p>
						<span
							style={{
								display: "block",
								width: 48,
								height: 3,
								background: "var(--color-accent)",
								borderRadius: 0,
								marginTop: 18,
							}}
						/>
					</div>
					<div data-stagger="scale" className="grid-4">
						{others.slice(0, 4).map((o) => (
							<Card
								key={o.id}
								padding="26px"
								style={{
									cursor: "pointer",
									display: "flex",
									flexDirection: "column",
									background: "var(--surface-card)",
								}}
								onClick={() => {
									go("service", o.id);
									window.scrollTo({ top: 0 });
								}}
							>
								<div
									style={{
										display: "flex",
										justifyContent: "space-between",
										alignItems: "flex-start",
										marginBottom: 18,
									}}
								>
									<div
										style={{
											width: 46,
											height: 46,
											borderRadius: "var(--radius)",
											background: "var(--color-accent-soft)",
											display: "flex",
											alignItems: "center",
											justifyContent: "center",
										}}
									>
										<Icon
											n={o.icon}
											style={{ width: 23, height: 23, color: "var(--color-primary-dark)" }}
										/>
									</div>
									<Badge>{o.code}</Badge>
								</div>
								<CardTitle style={{ fontSize: 18 }}>{o.title}</CardTitle>
								<CardBody className="svc-other-desc" style={{ fontSize: 14.5, flex: 1 }}>
									{o.summary}
								</CardBody>
								<span
									style={{
										display: "inline-flex",
										alignItems: "center",
										gap: 6,
										marginTop: 18,
										fontSize: 14,
										fontWeight: 600,
										color: "var(--color-primary)",
									}}
								>
									자세히 보기 <Icon n="arrow-right" style={{ width: 15, height: 15 }} />
								</span>
							</Card>
						))}
					</div>
					<div style={{ textAlign: "center", marginTop: 40 }}>
						<button
							type="button"
							className="lk"
							onClick={() => {
								go("services");
								window.scrollTo({ top: 0 });
							}}
							style={{
								background: "none",
								border: "none",
								display: "inline-flex",
								alignItems: "center",
								gap: 8,
								fontSize: 16,
								fontWeight: 600,
								color: "var(--color-primary)",
							}}
						>
							업무분야 전체 보기 <Icon n="arrow-right" style={{ width: 17, height: 17 }} />
						</button>
					</div>
				</div>
			</section>
		</>
	);
};
