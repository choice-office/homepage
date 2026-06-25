"use client";

import Image from "next/image";
import { type FormEvent, Fragment, useEffect, useState } from "react";
import { submitContact } from "@/app/actions/contact";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	BLOG,
	CHANNELS,
	FAQ,
	HERO_IMG,
	NAV,
	NAVER_BLOG,
	PROCESS,
	REVIEWS,
	type Review,
	SERVICES,
	STATS,
	STRENGTHS,
	VIDEOS,
	YOUTUBE_CHANNEL,
} from "@/lib/site-data";
import { Badge, Button, Card, CardBody, CardTitle, Input, Label, Textarea } from "./ds";
import { Icon } from "./icon";
import { useGo } from "./use-go";

const HERO_OVERLAY = 0.86;

type Crumb = { label: string; route?: string; param?: string };

export const SectionHead = ({
	eyebrow,
	title,
	sub,
	align = "center",
	light = false,
}: {
	eyebrow: string;
	title: string;
	sub?: string;
	align?: "center" | "left";
	light?: boolean;
}) => (
	<div
		data-reveal="blur"
		style={{
			textAlign: align,
			maxWidth: align === "center" ? "660px" : "none",
			margin: align === "center" ? "0 auto" : 0,
		}}
	>
		<span
			style={{
				fontSize: 13,
				fontWeight: 700,
				letterSpacing: ".12em",
				textTransform: "uppercase",
				color: light ? "var(--color-accent-soft)" : "var(--color-accent)",
			}}
		>
			{eyebrow}
		</span>
		<h2
			style={{
				fontSize: "clamp(28px, 4vw, 36px)",
				marginTop: 14,
				color: light ? "#fff" : "var(--text-heading)",
			}}
		>
			{title}
		</h2>
		{sub && (
			<p
				style={{
					fontSize: 17,
					color: light ? "rgba(255,255,255,.78)" : "var(--text-muted)",
					marginTop: 14,
					lineHeight: 1.7,
				}}
			>
				{sub}
			</p>
		)}
	</div>
);

export const PageHero = ({
	eyebrow,
	title,
	sub,
	crumbs,
}: {
	eyebrow?: string;
	title: string;
	sub?: string;
	crumbs?: Crumb[];
}) => {
	const go = useGo();
	return (
		<section
			style={{
				position: "relative",
				overflow: "hidden",
				padding: "152px 0 68px",
				background: "#241d16",
			}}
		>
			<Image
				src={HERO_IMG}
				alt=""
				fill
				priority
				sizes="100vw"
				style={{ objectFit: "cover", opacity: 0.32 }}
			/>
			<div
				style={{
					position: "absolute",
					inset: 0,
					background:
						"linear-gradient(120deg, rgba(82,70,54,0.94) 0%, rgba(82,70,54,0.82) 45%, rgba(36,29,22,0.68) 100%)",
				}}
			/>
			<div className="container" style={{ position: "relative", zIndex: 2 }}>
				{crumbs && (
					<nav
						style={{
							display: "flex",
							alignItems: "center",
							gap: 8,
							flexWrap: "wrap",
							marginBottom: 18,
							fontSize: 14,
							color: "rgba(255,255,255,0.75)",
						}}
					>
						{crumbs.map((c, i) => (
							<Fragment key={c.label}>
								{i > 0 && (
									<Icon n="chevron-right" style={{ width: 14, height: 14, opacity: 0.6 }} />
								)}
								{c.route ? (
									<button
										type="button"
										className="lk"
										onClick={() => go(c.route as string, c.param)}
										style={{
											background: "none",
											border: "none",
											padding: 0,
											font: "inherit",
											color: "rgba(255,255,255,0.8)",
											display: "inline-flex",
											alignItems: "center",
											gap: 5,
										}}
									>
										{i === 0 && <Icon n="home" style={{ width: 14, height: 14 }} />}
										{c.label}
									</button>
								) : (
									<span style={{ color: "#fff", fontWeight: 500 }}>{c.label}</span>
								)}
							</Fragment>
						))}
					</nav>
				)}
				{eyebrow && (
					<span
						style={{
							fontSize: 13,
							fontWeight: 700,
							letterSpacing: ".12em",
							textTransform: "uppercase",
							color: "var(--color-accent-soft)",
						}}
					>
						{eyebrow}
					</span>
				)}
				<h1 style={{ fontSize: "clamp(32px,5vw,46px)", marginTop: 12, color: "#fff" }}>{title}</h1>
				{sub && (
					<p
						style={{
							fontSize: 18,
							color: "rgba(255,255,255,.85)",
							marginTop: 16,
							maxWidth: 720,
							lineHeight: 1.7,
						}}
					>
						{sub}
					</p>
				)}
			</div>
		</section>
	);
};

export const PageSectionTitle = ({ title, sub }: { title: string; sub?: string }) => (
	<div data-reveal style={{ marginBottom: 40 }}>
		<h2 style={{ fontSize: "clamp(24px,3.4vw,32px)" }}>{title}</h2>
		<span
			style={{
				display: "block",
				width: 48,
				height: 3,
				background: "var(--color-accent)",
				borderRadius: 2,
				margin: "18px 0 0",
			}}
		/>
		{sub && (
			<p
				style={{
					fontSize: 17,
					color: "var(--text-muted)",
					marginTop: 18,
					lineHeight: 1.7,
					maxWidth: 720,
				}}
			>
				{sub}
			</p>
		)}
	</div>
);

export const Hero = () => {
	const go = useGo();
	const overlay = HERO_OVERLAY;
	return (
		<section
			style={{
				position: "relative",
				minHeight: "100vh",
				display: "flex",
				alignItems: "center",
				overflow: "hidden",
				background: "#1a1612",
			}}
		>
			<Image src={HERO_IMG} alt="" fill priority sizes="100vw" style={{ objectFit: "cover" }} />
			<div
				style={{
					position: "absolute",
					inset: 0,
					background: `linear-gradient(90deg, rgba(20,16,13,${overlay}) 0%, rgba(20,16,13,${overlay * 0.72}) 42%, rgba(20,16,13,0.18) 78%, rgba(20,16,13,0.05) 100%)`,
				}}
			/>
			<div
				className="container"
				style={{ position: "relative", zIndex: 2, width: "100%", paddingTop: 80 }}
			>
				<div style={{ maxWidth: 640, color: "#fff" }}>
					<span
						style={{
							display: "inline-flex",
							alignItems: "center",
							gap: 12,
							color: "var(--color-accent-soft)",
							fontSize: 15,
							fontWeight: 500,
							letterSpacing: ".02em",
						}}
					>
						<span style={{ height: 1, width: 32, background: "var(--color-accent-soft)" }} />
						출입국 · 비자 전문 행정사 사무소
					</span>
					<h1
						style={{
							marginTop: 24,
							fontSize: "clamp(38px, 6vw, 60px)",
							lineHeight: 1.18,
							color: "#fff",
						}}
					>
						복잡한 출입국 절차,
						<br />
						<span style={{ color: "var(--color-accent-soft)" }}>혼자 고민하지 마세요</span>
					</h1>
					<p
						style={{
							marginTop: 24,
							fontSize: "clamp(17px, 2.4vw, 20px)",
							lineHeight: 1.7,
							color: "rgba(255,255,255,0.86)",
						}}
					>
						거소증 · 영주권 · 결혼비자 · 국적회복까지,
						<br />
						시험 출신 행정사가 상담부터 접수까지 직접 책임집니다.
					</p>
					<div style={{ display: "flex", gap: 12, marginTop: 40, flexWrap: "wrap" }}>
						<Button
							variant="primary"
							size="lg"
							onClick={() => go("contact")}
							iconEnd={<Icon n="arrow-right" style={{ width: 18, height: 18 }} />}
						>
							무료 상담 신청
						</Button>
						<Button
							size="lg"
							onClick={() => go("services")}
							style={{
								background: "rgba(255,255,255,0.12)",
								color: "#fff",
								border: "1px solid rgba(255,255,255,0.32)",
							}}
						>
							업무분야 보기
						</Button>
					</div>
					<p style={{ marginTop: 32, fontSize: 14, color: "rgba(255,255,255,0.72)" }}>
						사무장 없는 사무소 · 법무부 등록 출입국민원 대행기관 · 한국어 · English 상담
					</p>
				</div>
			</div>
			<div
				className="hide-mobile"
				style={{
					position: "absolute",
					bottom: 28,
					left: "50%",
					transform: "translateX(-50%)",
					zIndex: 2,
					color: "rgba(255,255,255,.6)",
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					gap: 6,
					fontSize: 12,
					letterSpacing: ".1em",
				}}
			>
				SCROLL
				<Icon n="chevron-down" style={{ width: 18, height: 18 }} />
			</div>
		</section>
	);
};

export const TrustBand = () => {
	const items = [
		"거소증 F-4",
		"영주권 F-5",
		"결혼비자 F-6",
		"연예인 비자 E-6",
		"전문직 비자 E-7",
		"국적회복",
		"단기초청 C-3",
	];
	// marquee는 동일 목록을 3벌 이어붙여 무한 스크롤 → 복제본 라벨로 고유 key 부여
	const all = ["a", "b", "c"].flatMap((copy) => items.map((t) => ({ key: `${copy}-${t}`, t })));
	return (
		<div
			style={{
				background: "var(--color-primary-dark)",
				color: "rgba(255,255,255,0.88)",
				padding: "16px 0",
				overflow: "hidden",
				whiteSpace: "nowrap",
			}}
		>
			<div style={{ display: "inline-flex", animation: "marquee 32s linear infinite" }}>
				{all.map(({ key, t }) => (
					<span
						key={key}
						style={{ fontSize: 15, fontWeight: 500, display: "inline-flex", alignItems: "center" }}
					>
						<span style={{ padding: "0 28px" }}>{t}</span>
						<span style={{ color: "var(--color-primary-light)" }}>◆</span>
					</span>
				))}
			</div>
		</div>
	);
};

export const StrengthsRow = () => (
	<section className="section" style={{ background: "var(--surface-page)" }}>
		<div className="container">
			<SectionHead
				eyebrow="Why Choice"
				title="초이스 행정사를 선택하는 이유"
				sub="실력에 책임감을 더한, 출입국·비자 전문 행정사 사무소입니다."
			/>
			<div data-stagger="scale" className="grid-4" style={{ marginTop: 48 }}>
				{STRENGTHS.map((s) => (
					<Card key={s.title}>
						<div
							style={{
								width: 52,
								height: 52,
								borderRadius: "var(--radius)",
								background: "var(--color-accent-soft)",
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								marginBottom: 20,
							}}
						>
							<Icon
								n={s.icon}
								style={{ width: 26, height: 26, color: "var(--color-primary-dark)" }}
							/>
						</div>
						<CardTitle>{s.title}</CardTitle>
						<CardBody>{s.desc}</CardBody>
					</Card>
				))}
			</div>
		</div>
	</section>
);

export const ServicesGrid = ({ heading = true }: { heading?: boolean }) => {
	const go = useGo();
	return (
		<section className="section" style={{ background: "var(--surface-subtle)" }}>
			<div className="container">
				{heading && (
					<SectionHead
						eyebrow="Services"
						title="업무분야"
						sub="출입국·비자 전 분야를 시험 출신 행정사가 직접 다룹니다. 분야를 선택하면 자세히 안내해 드립니다."
					/>
				)}
				<div data-stagger className="grid-4" style={{ marginTop: heading ? 48 : 0 }}>
					{SERVICES.map((s) => (
						<Card
							key={s.id}
							padding="24px"
							style={{ cursor: "pointer", display: "flex", flexDirection: "column" }}
							onClick={() => go("service", s.id)}
						>
							<div
								style={{
									display: "flex",
									justifyContent: "space-between",
									alignItems: "flex-start",
									marginBottom: 16,
								}}
							>
								<div
									style={{
										width: 44,
										height: 44,
										borderRadius: "var(--radius)",
										background: "var(--color-accent-soft)",
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
									}}
								>
									<Icon
										n={s.icon}
										style={{ width: 22, height: 22, color: "var(--color-primary-dark)" }}
									/>
								</div>
								<Badge>{s.code}</Badge>
							</div>
							<CardTitle style={{ fontSize: 18 }}>{s.title}</CardTitle>
							<CardBody style={{ fontSize: 15, flex: 1 }}>{s.summary}</CardBody>
							<span
								style={{
									display: "inline-flex",
									alignItems: "center",
									gap: 6,
									marginTop: 16,
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
			</div>
		</section>
	);
};

export const Process = () => (
	<section className="section" style={{ background: "var(--surface-page)" }}>
		<div className="container">
			<SectionHead
				eyebrow="Process"
				title="진행 절차"
				sub="상담부터 결과 안내까지, 모든 과정을 행정사가 직접 챙깁니다."
			/>
			<div data-stagger="tilt" className="grid-4" style={{ marginTop: 48 }}>
				{PROCESS.map((p, i) => (
					<div key={p.title}>
						<div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
							<span
								style={{
									fontSize: 14,
									fontWeight: 700,
									color: "#fff",
									background: "var(--color-primary)",
									width: 32,
									height: 32,
									borderRadius: "50%",
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
								}}
							>
								{i + 1}
							</span>
							<Icon n={p.icon} style={{ width: 24, height: 24, color: "var(--color-primary)" }} />
						</div>
						<h3 style={{ fontSize: 18, marginBottom: 8 }}>{p.title}</h3>
						<p style={{ fontSize: 15, color: "var(--text-body)", lineHeight: 1.7 }}>{p.desc}</p>
					</div>
				))}
			</div>
		</div>
	</section>
);

export const Stats = () => (
	<section style={{ background: "var(--color-primary)", padding: "72px 0" }}>
		<div data-stagger="scale" className="grid-4 container" style={{ gap: 24 }}>
			{STATS.map((s) => (
				<div key={s.l} style={{ textAlign: "center", color: "#fff" }}>
					<div
						style={{ fontSize: "clamp(34px,5vw,44px)", fontWeight: 700, letterSpacing: "-0.02em" }}
					>
						{s.v}
					</div>
					<div style={{ fontSize: 16, fontWeight: 500, marginTop: 8 }}>{s.l}</div>
					<div style={{ fontSize: 14, color: "rgba(255,255,255,0.72)", marginTop: 4 }}>{s.d}</div>
				</div>
			))}
		</div>
	</section>
);

export const LangRemoteBand = () => {
	const items = [
		{
			icon: "languages",
			title: "한국어 · English · 中文(WeChat)",
			desc: "대표 행정사의 미국 어학연수 경험을 바탕으로 영어 상담이 가능하며, 위챗으로 중국 의뢰인도 편하게 상담합니다.",
		},
		{
			icon: "monitor-smartphone",
			title: "전국 · 해외 어디서나 비대면 상담",
			desc: "출입국 사무소를 직접 방문하지 않아도, 행정사 대행으로 상담부터 접수까지 원격으로 진행합니다.",
		},
	];
	return (
		<section style={{ background: "var(--surface-sunken)", padding: "64px 0" }}>
			<div className="container">
				<div data-stagger="split" className="grid-2" style={{ gap: 24 }}>
					{items.map((it) => (
						<div
							key={it.title}
							style={{
								display: "flex",
								gap: 18,
								alignItems: "flex-start",
								background: "var(--surface-card)",
								border: "1px solid var(--border-default)",
								borderRadius: "var(--radius)",
								padding: 28,
							}}
						>
							<div
								style={{
									flex: "0 0 auto",
									width: 52,
									height: 52,
									borderRadius: "var(--radius)",
									background: "var(--color-accent-soft)",
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
								}}
							>
								<Icon
									n={it.icon}
									style={{ width: 26, height: 26, color: "var(--color-primary-dark)" }}
								/>
							</div>
							<div>
								<h3 style={{ fontSize: 19 }}>{it.title}</h3>
								<p
									style={{ fontSize: 15, color: "var(--text-body)", lineHeight: 1.7, marginTop: 8 }}
								>
									{it.desc}
								</p>
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
};

export const VideoSection = () => (
	<section className="section" style={{ background: "var(--surface-page)" }}>
		<div className="container">
			<div
				style={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "flex-end",
					flexWrap: "wrap",
					gap: 16,
				}}
			>
				<SectionHead
					eyebrow="Video"
					title="영상으로 보는 비자 정보"
					sub="유튜브 ‘Korea Visa Master’에서 비자·체류 정보를 알기 쉽게 안내합니다."
					align="left"
				/>
				<a
					className="lk"
					href={YOUTUBE_CHANNEL}
					target="_blank"
					rel="noopener noreferrer"
					style={{
						display: "inline-flex",
						alignItems: "center",
						gap: 8,
						fontWeight: 600,
						color: "var(--color-primary)",
						whiteSpace: "nowrap",
					}}
				>
					채널 바로가기 <Icon n="external-link" style={{ width: 16, height: 16 }} />
				</a>
			</div>
			<div data-stagger="blur" className="grid-3" style={{ marginTop: 48 }}>
				{VIDEOS.map((v) => (
					<a
						key={v.title}
						className="lk"
						href={YOUTUBE_CHANNEL}
						target="_blank"
						rel="noopener noreferrer"
						style={{ display: "block" }}
					>
						<Card
							padding="0"
							style={{ overflow: "hidden", display: "flex", flexDirection: "column" }}
						>
							<div
								style={{
									position: "relative",
									height: 168,
									background:
										"linear-gradient(150deg, var(--color-primary) 0%, var(--color-primary-dark) 100%)",
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
								}}
							>
								<span
									style={{
										width: 56,
										height: 56,
										borderRadius: "50%",
										background: "rgba(255,255,255,0.92)",
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
									}}
								>
									<Icon
										n="play"
										style={{ width: 24, height: 24, color: "var(--color-primary-dark)" }}
									/>
								</span>
								<span
									style={{
										position: "absolute",
										bottom: 12,
										right: 12,
										background: "rgba(20,16,13,.7)",
										color: "#fff",
										fontSize: 12,
										fontWeight: 600,
										padding: "3px 8px",
										borderRadius: 4,
									}}
								>
									{v.dur}
								</span>
							</div>
							<div style={{ padding: 20 }}>
								<Badge>{v.tag}</Badge>
								<h3 style={{ fontSize: 17, lineHeight: 1.5, marginTop: 12 }}>{v.title}</h3>
							</div>
						</Card>
					</a>
				))}
			</div>
		</div>
	</section>
);

export const BlogPreview = () => (
	<section className="section" style={{ background: "var(--surface-subtle)" }}>
		<div className="container">
			<div
				style={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "flex-end",
					flexWrap: "wrap",
					gap: 16,
				}}
			>
				<SectionHead
					eyebrow="Blog"
					title="비자 정보 · 소식"
					sub="네이버 블로그에서 절차·요건을 사례 중심으로 정리해 전해드립니다."
					align="left"
				/>
				<a
					className="lk"
					href={NAVER_BLOG}
					target="_blank"
					rel="noopener noreferrer"
					style={{
						display: "inline-flex",
						alignItems: "center",
						gap: 8,
						fontWeight: 600,
						color: "var(--color-primary)",
						whiteSpace: "nowrap",
					}}
				>
					블로그 전체보기 <Icon n="external-link" style={{ width: 16, height: 16 }} />
				</a>
			</div>
			<div data-stagger className="grid-3" style={{ marginTop: 48 }}>
				{BLOG.slice(0, 3).map((b) => (
					<a
						key={b.title}
						className="lk"
						href={NAVER_BLOG}
						target="_blank"
						rel="noopener noreferrer"
						style={{ display: "block" }}
					>
						<Card
							padding="0"
							style={{
								overflow: "hidden",
								display: "flex",
								flexDirection: "column",
								height: "100%",
							}}
						>
							<div
								style={{
									height: 132,
									background:
										"linear-gradient(150deg, var(--color-surface-alt), var(--color-accent-soft))",
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
								}}
							>
								<Icon
									n="file-text"
									style={{ width: 38, height: 38, color: "var(--color-primary)", opacity: 0.55 }}
								/>
							</div>
							<div style={{ padding: 24, display: "flex", flexDirection: "column", flex: 1 }}>
								<div
									style={{
										display: "flex",
										justifyContent: "space-between",
										alignItems: "center",
										marginBottom: 12,
									}}
								>
									<Badge>{b.cat}</Badge>
									<span style={{ fontSize: 13, color: "var(--text-muted)" }}>{b.date}</span>
								</div>
								<CardTitle style={{ fontSize: 17 }}>{b.title}</CardTitle>
								<CardBody style={{ fontSize: 15, flex: 1 }}>{b.excerpt}</CardBody>
							</div>
						</Card>
					</a>
				))}
			</div>
		</div>
	</section>
);

export const ReviewCard = ({ r }: { r: Review }) => (
	<Card hover padding="28px" style={{ display: "flex", flexDirection: "column", height: "100%" }}>
		<div
			style={{
				display: "flex",
				justifyContent: "space-between",
				alignItems: "center",
				marginBottom: 16,
			}}
		>
			<Badge>{r.tag}</Badge>
			<span style={{ fontSize: 13, color: "var(--text-muted)" }}>
				{r.flag} {r.country}
			</span>
		</div>
		<Icon n="quote" style={{ width: 26, height: 26, color: "var(--color-primary-light)" }} />
		<h3 style={{ fontSize: 18, lineHeight: 1.5, marginTop: 12 }}>{r.title}</h3>
		<p
			style={{ fontSize: 15, color: "var(--text-body)", lineHeight: 1.75, marginTop: 12, flex: 1 }}
		>
			{r.body}
		</p>
		<div
			style={{
				display: "flex",
				alignItems: "center",
				gap: 12,
				marginTop: 22,
				paddingTop: 18,
				borderTop: "1px solid var(--border-default)",
			}}
		>
			<span
				style={{
					width: 40,
					height: 40,
					borderRadius: "50%",
					background: "var(--color-accent-soft)",
					color: "var(--color-primary-dark)",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					fontWeight: 700,
				}}
			>
				{r.initial}
			</span>
			<div>
				<div style={{ fontSize: 14, fontWeight: 600, color: "var(--text-heading)" }}>
					{r.initial}님 · {r.tag}
				</div>
				<div style={{ fontSize: 13, color: "var(--text-muted)" }}>{r.country} 거주 의뢰인</div>
			</div>
		</div>
	</Card>
);

export const ReviewsPreview = () => {
	const go = useGo();
	return (
		<section className="section" style={{ background: "var(--surface-page)" }}>
			<div className="container">
				<div
					style={{
						display: "flex",
						justifyContent: "space-between",
						alignItems: "flex-end",
						flexWrap: "wrap",
						gap: 16,
					}}
				>
					<SectionHead
						eyebrow="Client Reviews"
						title="의뢰인이 직접 전한 후기"
						sub="절차를 마친 의뢰인들이 남겨주신 실제 후기입니다."
						align="left"
					/>
					<button
						type="button"
						className="lk"
						onClick={() => go("reviews")}
						style={{
							background: "none",
							border: "none",
							padding: 0,
							font: "inherit",
							display: "inline-flex",
							alignItems: "center",
							gap: 8,
							fontWeight: 600,
							color: "var(--color-primary)",
							whiteSpace: "nowrap",
						}}
					>
						후기 전체보기 <Icon n="arrow-right" style={{ width: 16, height: 16 }} />
					</button>
				</div>
				<div data-stagger="tilt" className="grid-3" style={{ marginTop: 48 }}>
					{REVIEWS.slice(0, 3).map((r) => (
						<ReviewCard key={r.title} r={r} />
					))}
				</div>
				<p style={{ textAlign: "center", marginTop: 28, fontSize: 13, color: "var(--text-muted)" }}>
					※ 후기는 의뢰인의 동의를 받아 게시하며, 개인정보 보호를 위해 일부 내용을 각색했습니다.
					결과는 사안에 따라 다를 수 있습니다.
				</p>
			</div>
		</section>
	);
};

export const CTABand = () => {
	const go = useGo();
	return (
		<section
			style={{
				background:
					"linear-gradient(160deg, var(--color-primary) 0%, var(--color-primary-dark) 100%)",
				padding: "80px 0",
			}}
		>
			<div data-reveal="scale" className="container" style={{ textAlign: "center", color: "#fff" }}>
				<h2 style={{ fontSize: "clamp(26px,4vw,36px)", color: "#fff" }}>
					혼자 고민하지 마세요. 방향부터 함께 잡아드립니다.
				</h2>
				<p style={{ fontSize: 18, color: "rgba(255,255,255,.82)", marginTop: 16, lineHeight: 1.7 }}>
					상담은 무료입니다. 한국어 · English 상담 가능 · 시험 출신 행정사 직접 응대.
				</p>
				<div
					style={{
						display: "flex",
						gap: 12,
						justifyContent: "center",
						marginTop: 36,
						flexWrap: "wrap",
					}}
				>
					<Button
						variant="secondary"
						size="lg"
						onClick={() => go("contact")}
						iconEnd={<Icon n="arrow-right" style={{ width: 18, height: 18 }} />}
					>
						무료 상담 신청
					</Button>
					<Button
						href="tel:0269599886"
						size="lg"
						style={{
							background: "transparent",
							color: "#fff",
							border: "1px solid rgba(255,255,255,.4)",
						}}
						iconStart={<Icon n="phone" style={{ width: 17, height: 17 }} />}
					>
						02-6959-9886
					</Button>
				</div>
			</div>
		</section>
	);
};

/* 상담 희망 분야 드롭다운 — 인테이크 명시(업무분야 8종과 별개의 7종) */
const CONSULT_FIELDS = [
	{ v: "e6", label: "연예인 비자 (E-6)" },
	{ v: "e7", label: "전문직 비자 (E-7)" },
	{ v: "f4", label: "거소증 (F-4)" },
	{ v: "f5", label: "영주권 (F-5)" },
	{ v: "f6", label: "결혼비자 (F-6)" },
	{ v: "nat", label: "국적회복" },
	{ v: "etc", label: "기타" },
];

export const ContactForm = () => {
	const [sent, setSent] = useState(false);
	const [field, setField] = useState("");
	const [pending, setPending] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setError(null);
		setPending(true);
		const formData = new FormData(e.currentTarget);
		formData.set("consultField", field);
		const result = await submitContact(null, formData);
		setPending(false);
		if (result.success) {
			setSent(true);
		} else {
			setError(result.error ?? "접수 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");
		}
	};

	return (
		<Card hover={false} padding="32px">
			{sent ? (
				<div style={{ textAlign: "center", padding: "40px 0" }}>
					<div
						style={{
							width: 64,
							height: 64,
							borderRadius: "50%",
							background: "var(--color-accent-soft)",
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							margin: "0 auto 20px",
						}}
					>
						<Icon n="check" style={{ width: 30, height: 30, color: "var(--color-primary-dark)" }} />
					</div>
					<h3 style={{ fontSize: 22 }}>상담 신청이 접수되었습니다</h3>
					<p style={{ fontSize: 16, color: "var(--text-body)", marginTop: 12, lineHeight: 1.7 }}>
						빠른 시일 내에 행정사가 직접 연락드리겠습니다.
					</p>
					<Button variant="outline" style={{ marginTop: 24 }} onClick={() => setSent(false)}>
						다시 작성하기
					</Button>
				</div>
			) : (
				<form onSubmit={handleSubmit}>
					<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
						<div>
							<Label htmlFor="cn">성함</Label>
							<Input id="cn" name="name" placeholder="홍길동" required />
						</div>
						<div>
							<Label htmlFor="cp">연락처</Label>
							<Input id="cp" name="phone" placeholder="010-0000-0000" required />
						</div>
						<div>
							<Label htmlFor="ce">이메일</Label>
							<Input id="ce" name="email" type="email" placeholder="you@example.com" required />
						</div>
						<div>
							<Label htmlFor="cnat">국적</Label>
							<Input id="cnat" name="nationality" placeholder="예: 미국 · 中国" required />
						</div>
						<div>
							<Label htmlFor="cv">현재 체류자격</Label>
							<Input id="cv" name="currentVisa" placeholder="예: F-4, E-6, 없음" />
						</div>
						<div>
							<Label htmlFor="cf">상담 희망 분야</Label>
							<Select value={field} onValueChange={(v) => setField(v ?? "")}>
								<SelectTrigger
									id="cf"
									style={{ height: 48, width: "100%", fontSize: 16, borderRadius: "var(--radius)" }}
								>
									<SelectValue placeholder="분야를 선택해 주세요" />
								</SelectTrigger>
								<SelectContent align="start" alignItemWithTrigger={false}>
									{CONSULT_FIELDS.map((f) => (
										<SelectItem key={f.v} value={f.v}>
											{f.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
						<div style={{ gridColumn: "1 / -1" }}>
							<Label htmlFor="cm">문의 내용</Label>
							<Textarea
								id="cm"
								name="message"
								rows={4}
								placeholder="상담하고 싶은 내용을 간단히 적어 주세요."
							/>
						</div>
					</div>
					<label
						style={{
							display: "flex",
							alignItems: "center",
							gap: 8,
							marginTop: 16,
							fontSize: 14,
							color: "var(--text-muted)",
						}}
					>
						<input
							type="checkbox"
							name="privacyConsent"
							required
							style={{ width: 16, height: 16, accentColor: "var(--color-primary)" }}
						/>
						<span>
							<span style={{ color: "var(--color-primary)" }}>개인정보 수집·이용</span>에
							동의합니다.
						</span>
					</label>
					{error ? (
						<p
							style={{
								marginTop: 14,
								fontSize: 14,
								color: "var(--color-danger, #d92d20)",
								lineHeight: 1.6,
							}}
						>
							{error}
						</p>
					) : null}
					<Button
						type="submit"
						variant="primary"
						size="lg"
						disabled={pending}
						style={{ width: "100%", marginTop: 20 }}
					>
						{pending ? "접수 중…" : "무료 상담 신청"}
					</Button>
				</form>
			)}
		</Card>
	);
};

export const ContactInfo = () => (
	<div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
		{CHANNELS.map((c) => {
			const inner = (
				<>
					<span
						style={{
							width: 44,
							height: 44,
							borderRadius: "var(--radius)",
							background: "var(--color-accent-soft)",
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							flex: "0 0 auto",
						}}
					>
						<Icon
							n={c.icon}
							style={{ width: 20, height: 20, color: "var(--color-primary-dark)" }}
						/>
					</span>
					<span style={{ display: "flex", flexDirection: "column" }}>
						<span style={{ fontSize: 13, color: "var(--text-muted)" }}>
							{c.label}
							{c.note ? ` · ${c.note}` : ""}
						</span>
						<span
							style={{
								fontSize: 16,
								fontWeight: 600,
								color: "var(--text-heading)",
								whiteSpace: "nowrap",
							}}
						>
							{c.value}
						</span>
					</span>
				</>
			);
			return c.href ? (
				<a
					key={c.label}
					href={c.href}
					target={c.href.startsWith("http") ? "_blank" : undefined}
					rel="noopener noreferrer"
					style={{ display: "flex", alignItems: "center", gap: 14, color: "var(--text-body)" }}
				>
					{inner}
				</a>
			) : (
				<div
					key={c.label}
					style={{ display: "flex", alignItems: "center", gap: 14, color: "var(--text-body)" }}
				>
					{inner}
				</div>
			);
		})}
		<div style={{ display: "flex", alignItems: "center", gap: 14, color: "var(--text-body)" }}>
			<span
				style={{
					width: 44,
					height: 44,
					borderRadius: "var(--radius)",
					background: "var(--color-accent-soft)",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					flex: "0 0 auto",
				}}
			>
				<Icon n="map-pin" style={{ width: 20, height: 20, color: "var(--color-primary-dark)" }} />
			</span>
			<span style={{ display: "flex", flexDirection: "column" }}>
				<span style={{ fontSize: 13, color: "var(--text-muted)" }}>주소</span>
				<span style={{ fontSize: 16, fontWeight: 600, color: "var(--text-heading)" }}>
					서울특별시 중구 세종대로 136, 서울파이낸스센터 3층
				</span>
			</span>
		</div>
	</div>
);

// 실제 지도(구글 맵 임베드 — API 키 불필요). CSP frame-src 에 google.com 허용됨.
const MAP_QUERY = "서울파이낸스센터 서울특별시 중구 세종대로 136";
const MAP_EMBED_SRC = `https://www.google.com/maps?q=${encodeURIComponent(MAP_QUERY)}&z=16&hl=ko&output=embed`;

export const MapBlock = ({ height = 320 }: { height?: number }) => (
	<div
		style={{
			height,
			borderRadius: "var(--radius)",
			border: "1px solid var(--border-default)",
			background: "var(--surface-sunken)",
			overflow: "hidden",
		}}
	>
		<iframe
			src={MAP_EMBED_SRC}
			title="서울파이낸스센터 위치 지도"
			loading="lazy"
			referrerPolicy="no-referrer-when-downgrade"
			style={{ border: 0, width: "100%", height: "100%", display: "block" }}
		/>
	</div>
);

/* 오시는 길 — 프리미엄·미니멀 레이아웃 (주소 우선 + 구분선 행 + 큰 지도) */
const LOCATION_ROWS: { icon: string; label: string; value: string; href: string | null }[] = [
	{ icon: "phone", label: "전화 상담", value: "02-6959-9886", href: "tel:0269599886" },
	{
		icon: "phone-call",
		label: "긴급 상담",
		value: "010-8259-9890",
		href: "tel:01082599890",
	},
	{
		icon: "mail",
		label: "이메일",
		value: "choice@kvisa1345.com",
		href: "mailto:choice@kvisa1345.com",
	},
	{
		icon: "message-circle",
		label: "카카오 채널",
		value: "koreavisa8",
		href: "https://pf.kakao.com/",
	},
	{ icon: "clock", label: "상담 시간", value: "평일 09:00 – 18:00", href: null },
];

export const LocationDetail = () => (
	<div className="contact-grid container">
		<div>
			<div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
				<Icon
					n="map-pin"
					style={{
						width: 26,
						height: 26,
						color: "var(--color-primary)",
						flex: "0 0 auto",
						marginTop: 4,
					}}
				/>
				<div>
					<div
						style={{
							fontSize: 12,
							fontWeight: 600,
							letterSpacing: ".14em",
							textTransform: "uppercase",
							color: "var(--text-muted)",
						}}
					>
						Address
					</div>
					<p
						style={{
							marginTop: 8,
							fontSize: 22,
							fontWeight: 700,
							lineHeight: 1.5,
							color: "var(--text-heading)",
						}}
					>
						서울특별시 중구 세종대로 136
						<br />
						서울파이낸스센터 3층
					</p>
					<p style={{ marginTop: 6, fontSize: 14, color: "var(--text-muted)" }}>
						지하철 5호선 광화문역 인근
					</p>
				</div>
			</div>

			<div style={{ marginTop: 28, borderTop: "1px solid var(--border-default)" }}>
				{LOCATION_ROWS.map((r) => {
					const body = (
						<>
							<span
								style={{
									display: "inline-flex",
									alignItems: "center",
									gap: 10,
									minWidth: 124,
									flex: "0 0 auto",
									color: "var(--text-muted)",
									fontSize: 14,
								}}
							>
								<Icon n={r.icon} style={{ width: 18, height: 18, color: "var(--color-primary)" }} />
								{r.label}
							</span>
							<span style={{ fontSize: 16, fontWeight: 600, color: "var(--text-heading)" }}>
								{r.value}
							</span>
						</>
					);
					const rowStyle = {
						display: "flex",
						alignItems: "center",
						gap: 16,
						padding: "16px 0",
						borderBottom: "1px solid var(--border-default)",
					} as const;
					return r.href ? (
						<a
							key={r.label}
							href={r.href}
							target={r.href.startsWith("http") ? "_blank" : undefined}
							rel="noopener noreferrer"
							style={{ ...rowStyle, color: "var(--text-body)" }}
						>
							{body}
						</a>
					) : (
						<div key={r.label} style={rowStyle}>
							{body}
						</div>
					);
				})}
			</div>

			<a
				className="lk"
				href="https://map.naver.com/p/search/서울파이낸스센터"
				target="_blank"
				rel="noopener noreferrer"
				style={{
					marginTop: 20,
					display: "inline-flex",
					alignItems: "center",
					gap: 6,
					fontSize: 14,
					fontWeight: 600,
					color: "var(--color-primary)",
				}}
			>
				지도 앱에서 길찾기 <Icon n="external-link" style={{ width: 14, height: 14 }} />
			</a>

			<p style={{ marginTop: 18, fontSize: 13, lineHeight: 1.7, color: "var(--text-muted)" }}>
				외부 출장이 많아 내방 상담은 반드시 사전 연락 부탁드립니다.
				<br />
				상담 언어 한국어 · English · 中文(WeChat)
			</p>
		</div>
		<MapBlock height={520} />
	</div>
);

export const FAQ_ = ({
	banded = true,
	showHead = true,
}: {
	banded?: boolean;
	showHead?: boolean;
}) => {
	const [open, setOpen] = useState(0);
	return (
		<section
			className="section"
			style={{ background: banded ? "var(--surface-subtle)" : "var(--surface-page)" }}
		>
			<div className="container" style={{ maxWidth: 820 }}>
				{showHead && <SectionHead eyebrow="FAQ" title="자주 묻는 질문" />}
				<div
					style={{
						marginTop: showHead ? 40 : 0,
						display: "flex",
						flexDirection: "column",
						gap: 12,
					}}
				>
					{FAQ.map((f, i) => {
						const isOpen = open === i;
						return (
							<div
								key={f.q}
								style={{
									background: "var(--surface-card)",
									border: "1px solid var(--border-default)",
									borderRadius: "var(--radius)",
									overflow: "hidden",
								}}
							>
								<button
									type="button"
									className="lk"
									onClick={() => setOpen(isOpen ? -1 : i)}
									style={{
										width: "100%",
										display: "flex",
										justifyContent: "space-between",
										alignItems: "center",
										gap: 16,
										padding: "20px 24px",
										background: "none",
										border: "none",
										textAlign: "left",
										fontFamily: "var(--font-sans)",
									}}
								>
									<span style={{ fontSize: 17, fontWeight: 600, color: "var(--text-heading)" }}>
										{f.q}
									</span>
									<Icon
										n={isOpen ? "minus" : "plus"}
										style={{
											width: 20,
											height: 20,
											color: "var(--color-primary)",
											flex: "0 0 auto",
										}}
									/>
								</button>
								{isOpen && (
									<p
										style={{
											padding: "0 24px 22px",
											fontSize: 16,
											lineHeight: 1.8,
											color: "var(--text-body)",
										}}
									>
										{f.a}
									</p>
								)}
							</div>
						);
					})}
				</div>
			</div>
		</section>
	);
};

export const ConsultBar = () => {
	const go = useGo();
	const [visible, setVisible] = useState(false);
	const [svc, setSvc] = useState("");
	useEffect(() => {
		const on = () => setVisible(window.scrollY > 360);
		window.addEventListener("scroll", on, { passive: true });
		on();
		return () => window.removeEventListener("scroll", on);
	}, []);
	const mobileItems = [
		{ icon: "file-text", label: "블로그", onClick: () => go("blog") },
		{ icon: "message-square", label: "온라인 상담", onClick: () => go("contact") },
		{
			icon: "phone",
			label: "전화 상담",
			onClick: () => {
				window.location.href = "tel:0269599886";
			},
		},
	];
	return (
		<>
			<div
				className="consult-desktop"
				style={{
					position: "fixed",
					left: 0,
					right: 0,
					bottom: 0,
					zIndex: 40,
					background: "var(--color-primary-dark)",
					color: "#fff",
					transform: visible ? "translateY(0)" : "translateY(100%)",
					transition: "transform .35s ease",
					boxShadow: "0 -4px 20px rgba(34,34,34,.18)",
				}}
			>
				<div className="consult-bar-inner container" style={{ padding: "16px 24px" }}>
					<div style={{ display: "flex", alignItems: "center", gap: 12, whiteSpace: "nowrap" }}>
						<Icon
							n="phone-call"
							style={{ width: 22, height: 22, color: "var(--color-accent-soft)" }}
						/>
						<div>
							<div style={{ fontSize: 12, color: "rgba(255,255,255,.7)" }}>실시간 전화 상담</div>
							<a
								href="tel:0269599886"
								style={{ fontSize: 22, fontWeight: 700, color: "#fff", letterSpacing: "-.01em" }}
							>
								02-6959-9886
							</a>
						</div>
					</div>
					<form
						className="consult-form"
						onSubmit={(e) => {
							e.preventDefault();
							go("contact");
						}}
					>
						<span style={{ fontWeight: 600, whiteSpace: "nowrap" }}>신속 상담 신청</span>
						<Select value={svc} onValueChange={(v) => setSvc(v ?? "")}>
							<SelectTrigger
								className="border-none"
								style={{
									height: 44,
									flex: "0 1 180px",
									background: "#fff",
									borderRadius: "var(--radius)",
									fontSize: 15,
									color: "var(--text-body)",
								}}
							>
								<SelectValue placeholder="상담분야 선택" />
							</SelectTrigger>
							<SelectContent align="start" alignItemWithTrigger={false}>
								{SERVICES.map((s) => (
									<SelectItem key={s.id} value={s.id}>
										{s.title}
									</SelectItem>
								))}
								<SelectItem value="etc">기타</SelectItem>
							</SelectContent>
						</Select>
						<input
							placeholder="연락처"
							style={{
								height: 44,
								padding: "0 14px",
								borderRadius: "var(--radius)",
								border: "none",
								background: "#fff",
								fontFamily: "var(--font-sans)",
								fontSize: 15,
								color: "var(--text-body)",
								flex: "1 1 140px",
								minWidth: 0,
							}}
						/>
						<Button type="submit" variant="secondary" style={{ whiteSpace: "nowrap" }}>
							상담신청
						</Button>
					</form>
				</div>
			</div>

			<div
				className="consult-mobile"
				style={{
					position: "fixed",
					left: 0,
					right: 0,
					bottom: 0,
					zIndex: 40,
					background: "var(--color-primary-dark)",
					boxShadow: "0 -4px 20px rgba(34,34,34,.22)",
					paddingBottom: "env(safe-area-inset-bottom, 0px)",
				}}
			>
				{mobileItems.map((it, i) => (
					<button
						key={it.label}
						type="button"
						className="lk"
						onClick={it.onClick}
						style={{
							flex: 1,
							display: "flex",
							flexDirection: "column",
							alignItems: "center",
							justifyContent: "center",
							gap: 6,
							padding: "12px 4px",
							minHeight: 64,
							background: "none",
							border: "none",
							borderLeft: i ? "1px solid rgba(255,255,255,0.14)" : "none",
							color: "#fff",
							fontFamily: "var(--font-sans)",
						}}
					>
						<Icon
							n={it.icon}
							style={{ width: 21, height: 21, color: "var(--color-accent-soft)" }}
						/>
						<span style={{ fontSize: 13, fontWeight: 600 }}>{it.label}</span>
					</button>
				))}
			</div>
		</>
	);
};

export const FloatRail = () => {
	const go = useGo();
	const kakao = CHANNELS.find((c) => c.label === "카카오 채널")?.href ?? "#";
	return (
		<aside className="float-rail hide-mobile" aria-label="빠른 상담">
			<a className="float-rail-num" href="tel:0269599886" aria-label="전화 상담 02-6959-9886">
				<span className="float-rail-phone">
					<Icon n="phone-call" style={{ width: 20, height: 20 }} />
				</span>
				<span className="float-rail-tel">
					<span className="frl-eyebrow">전화상담</span>
					<strong>02</strong>
					<strong>6959-9886</strong>
				</span>
			</a>
			<a className="float-rail-cell" href={kakao} target="_blank" rel="noopener noreferrer">
				<Image src="/icons/kakao.svg" alt="" width={27} height={27} unoptimized />
				<span>카톡</span>
			</a>
			<a
				className="float-rail-cell"
				href={YOUTUBE_CHANNEL}
				target="_blank"
				rel="noopener noreferrer"
			>
				<Image src="/icons/youtube.svg" alt="" width={28} height={28} unoptimized />
				<span>유튜브</span>
			</a>
			<a className="float-rail-cell" href={NAVER_BLOG} target="_blank" rel="noopener noreferrer">
				<Image src="/icons/blog.svg" alt="" width={27} height={27} unoptimized />
				<span>블로그</span>
			</a>
			<button type="button" className="float-rail-cell" onClick={() => go("location")}>
				<span className="brand-chip brand-map" aria-hidden="true">
					<Icon n="map-pin" style={{ width: 16, height: 16, color: "#fff" }} />
				</span>
				<span>오시는 길</span>
			</button>
			<button
				type="button"
				className="float-rail-cell"
				onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
			>
				<Icon n="arrow-up" style={{ width: 22, height: 22 }} />
				<span>TOP</span>
			</button>
		</aside>
	);
};

export const Footer = () => {
	const go = useGo();
	return (
		<footer
			style={{
				background: "var(--color-primary-dark)",
				color: "rgba(255,255,255,0.72)",
				paddingBottom: 88,
			}}
		>
			<div className="container" style={{ padding: "56px 24px 0" }}>
				<div
					style={{
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
						borderBottom: "1px solid rgba(255,255,255,0.15)",
						paddingBottom: 28,
						flexWrap: "wrap",
						gap: 16,
					}}
				>
					<button
						type="button"
						className="lk"
						onClick={() => go("home")}
						style={{
							background: "none",
							border: "none",
							padding: 0,
							color: "#fff",
							fontWeight: 700,
							fontSize: 20,
							letterSpacing: "-0.02em",
						}}
					>
						초이스 행정사 사무소
					</button>
					<nav style={{ display: "flex", gap: 22, fontSize: 14, flexWrap: "wrap" }}>
						{NAV.map((n) => (
							<button
								key={n.label}
								type="button"
								className="lk"
								onClick={() => go(n.route)}
								style={{
									background: "none",
									border: "none",
									padding: 0,
									font: "inherit",
									color: "rgba(255,255,255,0.8)",
								}}
							>
								{n.label}
							</button>
						))}
					</nav>
				</div>
				<div style={{ marginTop: 28, fontSize: 14, lineHeight: 1.9 }}>
					<p>주소 서울특별시 중구 세종대로 136, 서울파이낸스센터 3층</p>
					<p>대표 행정사 최서연 · 전화 02-6959-9886 · 이메일 choice@kvisa1345.com</p>
					<p style={{ color: "rgba(255,255,255,0.5)" }}>
						사업자등록번호 464-11-00966 · 행정사 등록번호 18102025537 · 출입국민원 대행기관
						19-SB-RG-016
					</p>
					<p style={{ color: "rgba(255,255,255,0.45)", fontSize: 13, marginTop: 12 }}>
						© 2026 초이스 행정사 사무소. ALL RIGHTS RESERVED.
					</p>
				</div>
			</div>
		</footer>
	);
};
