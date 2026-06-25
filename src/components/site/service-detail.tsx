"use client";

import type { ReactNode } from "react";
import { SERVICES } from "@/lib/site-data";
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

export const ServiceDetail = ({ id }: { id: string }) => {
	const go = useGo();
	const s = SERVICES.find((x) => x.id === id) || SERVICES[0];
	const others = SERVICES.filter((x) => x.id !== s.id);
	return (
		<>
			<PageHero
				eyebrow={`Service · ${s.code}`}
				title={s.title}
				sub={s.summary}
				crumbs={[
					{ label: "홈", route: "home" },
					{ label: "업무분야", route: "services" },
					{ label: s.title },
				]}
			/>
			<section className="section" style={{ background: "var(--surface-page)" }}>
				<div className="container">
					<div className="grid-2" style={{ gap: 24 }}>
						<Block icon="users" title="이런 분께 권합니다">
							<List items={s.target} />
						</Block>
						<Block icon="folder-check" title="필요 서류">
							<List items={s.docs} />
						</Block>
					</div>
					<div className="grid-2" style={{ gap: 24, marginTop: 24 }}>
						<Block icon="route" title="처리 절차">
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
									실제 기간은 의뢰인의 상황과 심사 일정에 따라 달라질 수 있으며, 결과를 단정해
									약속드리지 않습니다.
								</p>
							</Card>
							<Card
								hover={false}
								padding="28px"
								style={{ display: "flex", flexDirection: "column", gap: 14 }}
							>
								<h3 style={{ fontSize: 18 }}>{s.title} 상담이 필요하신가요?</h3>
								<p style={{ fontSize: 15, color: "var(--text-body)", lineHeight: 1.7 }}>
									가능 여부와 준비 방향을 먼저 솔직하게 안내드립니다.
								</p>
								<Button
									variant="primary"
									size="lg"
									onClick={() => go("contact")}
									iconEnd={<Icon n="arrow-right" style={{ width: 18, height: 18 }} />}
								>
									무료 상담 신청
								</Button>
							</Card>
						</div>
					</div>
				</div>
			</section>
			<section className="section" style={{ background: "var(--surface-sunken)", paddingTop: 0 }}>
				<div className="container">
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
						<h2 style={{ fontSize: "clamp(24px,3vw,30px)", marginTop: 12 }}>다른 업무분야</h2>
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
								borderRadius: 2,
								marginTop: 18,
							}}
						/>
					</div>
					<div className="grid-4">
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
								<CardBody style={{ fontSize: 14.5, flex: 1 }}>{o.summary}</CardBody>
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
