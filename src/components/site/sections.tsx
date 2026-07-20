"use client";

import Image from "next/image";
import Link from "next/link";
import { type FormEvent, Fragment, type ReactNode, useEffect, useState } from "react";
import { submitContact, submitQuickConsult } from "@/app/actions/contact";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import type { BlogPost } from "@/lib/blog";
import {
	CHANNELS,
	CONTACT,
	FAQ,
	HERO_IMG,
	HOME_HERO_IMG,
	INSTAGRAM,
	NAV,
	NAVER_BLOG,
	PROCESS,
	type ReviewImage,
	SERVICES,
	SHORTS,
	STATS,
	STRENGTH_SLIDES,
	YOUTUBE_CHANNEL,
} from "@/lib/site-data";
import { BlogCard } from "./blog-card";
import { Badge, Button, Card, CardBody, CardTitle, Input, Label, Textarea } from "./ds";
import { Icon } from "./icon";
import { ReviewImageGallery } from "./review-gallery";
import { smoothScrollTo } from "./smooth-scroll";
import { useGo } from "./use-go";

const HERO_OVERLAY = 0.86;

type Crumb = { label: string; route?: string; param?: string };

export const SectionHead = ({
	title,
	sub,
	align = "center",
	light = false,
}: {
	title: string;
	sub?: string;
	align?: "center" | "left";
	light?: boolean;
}) => (
	<div
		data-reveal="blur"
		style={{
			textAlign: align,
			maxWidth: align === "center" ? "700px" : "none",
			margin: align === "center" ? "0 auto" : 0,
		}}
	>
		<h2
			style={{
				fontSize: "clamp(24px, 3.2vw, 34px)",
				fontWeight: 800,
				letterSpacing: "-0.015em",
				lineHeight: 1.25,
				color: light ? "#fff" : "var(--text-heading)",
			}}
		>
			{title}
		</h2>
		{sub && (
			<p
				style={{
					fontSize: 16,
					color: light ? "rgba(255,255,255,.78)" : "var(--text-muted)",
					marginTop: 16,
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
	image,
	imagePosition,
}: {
	eyebrow?: string;
	title: string;
	sub?: ReactNode;
	crumbs?: Crumb[];
	image?: string; // 페이지별 히어로 배경(미지정 시 공통 HERO_IMG)
	imagePosition?: string; // object-position(미지정 시 center). 피사체가 상·하단에 치우친 이미지 크롭 보정용
}) => {
	const go = useGo();
	return (
		<section
			data-hero-dark
			style={{
				position: "relative",
				overflow: "hidden",
				padding: "176px 0 84px",
				background: "#241d16",
			}}
		>
			<Image
				src={image ?? HERO_IMG}
				alt=""
				fill
				priority
				sizes="100vw"
				style={{ objectFit: "cover", objectPosition: imagePosition ?? "center", opacity: 0.45 }}
			/>
			<div
				style={{
					position: "absolute",
					inset: 0,
					background:
						"linear-gradient(115deg, rgba(30,24,18,0.78) 0%, rgba(52,43,33,0.58) 44%, rgba(82,70,54,0.3) 100%)",
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
				<h1
					style={{
						fontSize: "clamp(29px, 4.6vw, 44px)",
						fontWeight: 800,
						letterSpacing: "-0.02em",
						lineHeight: 1.14,
						marginTop: 14,
						color: "#fff",
					}}
				>
					{title}
				</h1>
				<span
					style={{
						display: "block",
						width: 56,
						height: 3,
						borderRadius: 0,
						background: "var(--color-accent-soft)",
						marginTop: 22,
					}}
				/>
				{sub && (
					<p
						style={{
							fontSize: "clamp(15px, 1.7vw, 17px)",
							color: "rgba(255,255,255,.82)",
							marginTop: 22,
							maxWidth: 640,
							lineHeight: 1.75,
							wordBreak: "keep-all",
						}}
					>
						{sub}
					</p>
				)}
			</div>
		</section>
	);
};

export const Hero = () => {
	const go = useGo();
	const overlay = HERO_OVERLAY;
	return (
		<section
			data-hero-dark
			style={{
				position: "relative",
				minHeight: "100vh",
				display: "flex",
				alignItems: "center",
				overflow: "hidden",
				background: "#1a1612",
			}}
		>
			<Image
				src={HOME_HERO_IMG}
				alt=""
				fill
				priority
				sizes="100vw"
				style={{ objectFit: "cover" }}
			/>
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
						법무부 등록 출입국민원 대행기관
					</span>
					<h1
						style={{
							marginTop: 24,
							fontSize: "clamp(31px, 5vw, 50px)",
							lineHeight: 1.18,
							color: "#fff",
						}}
					>
						출입국 업무는
						<br />
						<span style={{ color: "var(--color-accent-soft)" }}>경험이 결과를 만듭니다.</span>
					</h1>
					<p
						style={{
							marginTop: 24,
							fontSize: "clamp(16px, 2vw, 18px)",
							lineHeight: 1.7,
							color: "rgba(255,255,255,0.86)",
						}}
					>
						<strong style={{ color: "#fff", fontWeight: 700 }}>
							좋은 결과는 실력 있는 전문가 선택에서 시작됩니다.
						</strong>
						<br />
						거소증 · 영주권 · 결혼비자 · 국적회복까지
						<br />
						누적 3,500건 이상의 업무 경험을 바탕으로
						<br />
						대표 행정사가 상담부터 전 과정을 직접 진행합니다.
					</p>
					<div style={{ display: "flex", gap: 12, marginTop: 40, flexWrap: "wrap" }}>
						<Button
							variant="primary"
							size="lg"
							onClick={() => go("contact")}
							iconEnd={<Icon n="arrow-right" style={{ width: 18, height: 18 }} />}
						>
							상담 신청
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

/* 히어로 바로 아래 — 초이스만의 강점(파운더스식 탭형 캐러셀) */
export const StrengthsCarousel = () => {
	const go = useGo();
	const [active, setActive] = useState(0);
	const [paused, setPaused] = useState(false);
	const [dir, setDir] = useState(1); // 전환 방향(1: 다음, -1: 이전) — 패널 슬라이드 방향 결정
	const total = STRENGTH_SLIDES.length;

	// 자동 전환(6초). 마우스 오버 시 정지, prefers-reduced-motion 시 미동작.
	useEffect(() => {
		if (paused) return;
		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
		const timer = setInterval(() => {
			setDir(1);
			setActive((i) => (i + 1) % total);
		}, 6000);
		return () => clearInterval(timer);
	}, [paused]);

	const move = (delta: number) => {
		setDir(delta > 0 ? 1 : -1);
		setActive((i) => (i + delta + total) % total);
	};
	const slide = STRENGTH_SLIDES[active];

	return (
		<section className="section soft-bg" style={{ background: "var(--surface-subtle)" }}>
			<div className="container">
				<h2 className="str-title" data-reveal>
					초이스의 강점
				</h2>

				<div
					className="str-stage"
					data-reveal
					data-paused={paused}
					role="group"
					aria-roledescription="carousel"
					aria-label="초이스만의 강점"
					onMouseEnter={() => setPaused(true)}
					onMouseLeave={() => setPaused(false)}
				>
					<button
						type="button"
						className="str-arrow"
						aria-label="이전 강점"
						onClick={() => move(-1)}
					>
						<Icon
							n="chevron-right"
							style={{ width: 22, height: 22, transform: "rotate(180deg)" }}
						/>
					</button>

					{/* 패널 전체(번호·제목·글·CTA·이미지)를 한 덩어리로 방향성 슬라이드+페이드 전환 */}
					<div className="str-panel" key={active} data-dir={dir}>
						<div className="str-text">
							<span className="str-no">
								{slide.no}
								<span className="str-no-total"> / 0{total}</span>
							</span>
							<h3 className="str-headline" style={{ whiteSpace: "pre-line" }}>
								{slide.title}
							</h3>
							<p className="str-copy">
								{slide.lines.map((line, i) => (
									<Fragment key={line}>
										{i === slide.highlightIndex ? <span className="str-hl">{line}</span> : line}
										{i < slide.lines.length - 1 && <br />}
									</Fragment>
								))}
							</p>
							<button type="button" className="str-cta" onClick={() => go(slide.cta.route)}>
								{slide.cta.label}
								<Icon n="arrow-right" style={{ width: 18, height: 18 }} />
							</button>
						</div>

						{/* 우: 이미지 — 오프셋 액센트 블록으로 에디토리얼 깊이 */}
						<div className="str-figure">
							<span className="str-figure-accent" aria-hidden="true" />
							<div className="str-visual">
								<Image
									src={slide.img}
									alt=""
									fill
									sizes="(max-width: 900px) 100vw, 45vw"
									style={{ objectFit: "cover" }}
								/>
							</div>
						</div>
					</div>

					<button
						type="button"
						className="str-arrow"
						aria-label="다음 강점"
						onClick={() => move(1)}
					>
						<Icon n="chevron-right" style={{ width: 22, height: 22 }} />
					</button>
				</div>

				{/* 하단 탭 */}
				<div className="str-tabs" data-reveal>
					{STRENGTH_SLIDES.map((s, i) => (
						<button
							type="button"
							key={s.no}
							className="str-tab"
							data-active={i === active}
							onClick={() => {
								setDir(i >= active ? 1 : -1);
								setActive(i);
							}}
						>
							<span className="str-tab-no">{s.no}</span>
							<span className="str-tab-label">{s.tab}</span>
							{i === active && <span className="str-tab-bar" key={active} aria-hidden="true" />}
						</button>
					))}
				</div>
			</div>
		</section>
	);
};

export const StrengthsRow = () => (
	<section className="section soft-bg" style={{ background: "var(--surface-page)" }}>
		<div className="container">
			<SectionHead
				title="상담부터 접수까지, 행정사가 직접 진행합니다."
				sub="행정사가 상담·검토·서류 작성·접수·결과 안내까지 직접 진행합니다."
			/>
			<div className="proc-timeline" data-reveal>
				<span className="proc-track" aria-hidden="true">
					<span className="proc-track-fill" />
					<span className="proc-track-beam" />
				</span>
				<ol className="proc-steps" data-stagger>
					{PROCESS.map((p, i) => (
						<li className="proc-step" key={p.title}>
							<span className="proc-node">{`0${i + 1}`}</span>
							<span className="proc-step-icon" aria-hidden="true">
								<Icon n={p.icon} style={{ width: 24, height: 24 }} />
							</span>
							<h3 className="proc-step-title">{p.title}</h3>
							<p className="proc-step-desc">{p.desc}</p>
						</li>
					))}
				</ol>
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
					<div data-reveal="blur" style={{ maxWidth: 780, margin: "0 auto", textAlign: "center" }}>
						<span
							style={{
								display: "inline-block",
								fontSize: 13,
								fontWeight: 700,
								letterSpacing: ".14em",
								color: "var(--color-accent)",
							}}
						>
							업무분야
						</span>
						<h2
							style={{
								marginTop: 16,
								fontSize: "clamp(22px, 2.8vw, 32px)",
								lineHeight: 1.42,
								color: "var(--text-heading)",
							}}
						>
							출입국·비자 전 분야를
							<br />
							<span className="svc-hl">시험 출신 행정사</span>가 직접 책임집니다.
						</h2>
					</div>
				)}
				<div data-stagger className="grid-4 svc-grid" style={{ marginTop: heading ? 56 : 0 }}>
					{SERVICES.map((s) => (
						<Card
							key={s.id}
							padding="28px"
							style={{ cursor: "pointer", display: "flex", flexDirection: "column" }}
							onClick={() => go("service", s.id)}
						>
							<div
								style={{
									display: "flex",
									justifyContent: "space-between",
									alignItems: "center",
									marginBottom: 22,
								}}
							>
								<span className="svc-icon" aria-hidden="true">
									<Icon n={s.icon} style={{ width: 26, height: 26 }} />
								</span>
								<Badge>{s.code}</Badge>
							</div>
							<CardTitle style={{ fontSize: 20 }}>{s.title}</CardTitle>
							<CardBody style={{ fontSize: 16, lineHeight: 1.7, flex: 1 }}>{s.summary}</CardBody>
							<span
								className="svc-more"
								style={{
									display: "inline-flex",
									alignItems: "center",
									gap: 6,
									marginTop: 22,
									fontSize: 15,
									fontWeight: 600,
									color: "var(--color-primary)",
								}}
							>
								자세히 보기 <Icon n="arrow-right" style={{ width: 16, height: 16 }} />
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
						<p
							style={{
								fontSize: 15,
								color: "var(--text-body)",
								lineHeight: 1.7,
								whiteSpace: "pre-line",
							}}
						>
							{p.desc}
						</p>
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
						style={{
							fontSize: "clamp(29px,4.2vw,38px)",
							fontWeight: 700,
							letterSpacing: "-0.02em",
						}}
					>
						{s.v}
					</div>
					<div style={{ fontSize: 16, fontWeight: 500, marginTop: 8 }}>{s.l}</div>
				</div>
			))}
		</div>
	</section>
);

// 유튜브 쇼츠 파사드 — 로드 시 무거운 iframe 4개를 미리 띄우지 않고 썸네일+재생버튼만 표시.
// 클릭하면 그때 실제 iframe(autoplay) 로드 → 스크롤 렉 제거 + 초기 로드 경량화(유튜브 JS 0).
const ShortEmbed = ({ id }: { id: string }) => {
	const [play, setPlay] = useState(false);
	if (play) {
		return (
			<iframe
				src={`https://www.youtube.com/embed/${id}?autoplay=1`}
				title="초이스 행정사 쇼츠"
				allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
				referrerPolicy="strict-origin-when-cross-origin"
				allowFullScreen
			/>
		);
	}
	return (
		<button
			type="button"
			className="short-facade"
			onClick={() => setPlay(true)}
			aria-label="영상 재생"
		>
			<Image
				src={`https://i.ytimg.com/vi/${id}/oardefault.jpg`}
				alt=""
				fill
				sizes="(max-width: 640px) 90vw, 340px"
				style={{ objectFit: "cover" }}
			/>
			<span className="short-play" aria-hidden="true">
				<Icon n="play" style={{ width: 24, height: 24 }} />
			</span>
		</button>
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
					title="영상으로 보는 비자 정보"
					sub="유튜브 ‘초이스 행정사’에서 최신 비자 정보와 실제 허가 사례까지 확인해 보세요."
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
			<div data-stagger="blur" className="shorts-grid" style={{ marginTop: 48 }}>
				{SHORTS.map((id) => (
					<div className="short-embed" key={id}>
						<ShortEmbed id={id} />
					</div>
				))}
			</div>
		</div>
	</section>
);

export const BlogPreview = ({ posts }: { posts: BlogPost[] }) => (
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
					title="비자 정보 · 소식"
					sub="절차·요건을 사례 중심으로 알기 쉽게 정리해 전해드립니다."
					align="left"
				/>
				<Link
					className="lk"
					href="/blog"
					style={{
						display: "inline-flex",
						alignItems: "center",
						gap: 8,
						fontWeight: 600,
						color: "var(--color-primary)",
						whiteSpace: "nowrap",
					}}
				>
					블로그 전체보기 <Icon n="arrow-right" style={{ width: 16, height: 16 }} />
				</Link>
			</div>
			<div data-stagger className="grid-4" style={{ marginTop: 48 }}>
				{posts.slice(0, 4).map((p) => (
					<BlogCard key={p.slug} post={p} compact />
				))}
			</div>
		</div>
	</section>
);

export const ReviewsPreview = ({ images }: { images: ReviewImage[] }) => {
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
						title="의뢰인이 직접 전한 후기"
						sub="절차를 마친 의뢰인들이 직접 남겨주신 실제 대화입니다."
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
			</div>
			{/* 마퀴는 전체 폭으로 흐르게(컨테이너 밖) — 좌우 마스크 페이드로 자연스럽게 사라짐 */}
			<div style={{ marginTop: 44 }}>
				<ReviewImageGallery variant="marquee" images={images} />
			</div>
			<div className="container">
				<p style={{ textAlign: "center", marginTop: 28, fontSize: 13, color: "var(--text-muted)" }}>
					※ 실제 의뢰인이 보내주신 내용이며, 개인정보 보호를 위해 일부 정보는 비공개 처리하였습니다.
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
				<h2 style={{ fontSize: "clamp(23px,3.4vw,32px)", color: "#fff" }}>
					혼자 고민하지 마세요. 경험이 결과를 바꿉니다.
				</h2>
				<p style={{ fontSize: 17, color: "rgba(255,255,255,.82)", marginTop: 16, lineHeight: 1.7 }}>
					3,500건 이상의 업무 경험을 바탕으로 최적의 해결 방향을 제시해 드립니다.
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
						상담 신청
					</Button>
					<Button
						href={CONTACT.phone.href}
						size="lg"
						style={{
							background: "transparent",
							color: "#fff",
							border: "1px solid rgba(255,255,255,.4)",
						}}
						iconStart={<Icon n="phone" style={{ width: 17, height: 17 }} />}
					>
						{CONTACT.phone.display}
					</Button>
				</div>
			</div>
		</section>
	);
};

/* 상담 희망 분야 드롭다운 — 인테이크 명시(업무분야 8종과 별개의 7종) */
const CONSULT_FIELDS = [
	{ v: "short", label: "단기초청 (C3비자·C4비자)" },
	{ v: "resident", label: "주재원·고위임원 (D7비자·D8비자)" },
	{ v: "e6", label: "외국인 연예인 비자 (E6비자)" },
	{ v: "e7", label: "외국인 취업비자 (E7비자)" },
	{ v: "f4", label: "재외동포·거소증 (F4비자)" },
	{ v: "f5", label: "영주권 (F5비자)" },
	{ v: "f6", label: "결혼비자 (F6비자)" },
	{ v: "nat", label: "국적회복" },
	{ v: "etc", label: "기타" },
];

// 입력값을 010-xxxx-xxxx 형태로 자동 정리(숫자만 추출 후 3-4-4 하이픈)
const formatKrPhone = (raw: string) => {
	const d = raw.replace(/\D/g, "").slice(0, 11);
	if (d.length < 4) return d;
	if (d.length < 8) return `${d.slice(0, 3)}-${d.slice(3)}`;
	return `${d.slice(0, 3)}-${d.slice(3, 7)}-${d.slice(7)}`;
};

export const ContactForm = () => {
	const [sent, setSent] = useState(false);
	const [field, setField] = useState("");
	const [phone, setPhone] = useState("");
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
		<Card hover={false} padding="36px" className="contact-form-card">
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
					<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
						<div>
							<Label htmlFor="cn">성함</Label>
							<Input id="cn" name="name" placeholder="홍길동" required />
						</div>
						<div>
							<Label htmlFor="cp">연락처</Label>
							<Input
								id="cp"
								name="phone"
								type="tel"
								inputMode="numeric"
								maxLength={13}
								placeholder="010-0000-0000"
								required
								value={phone}
								onChange={(e) => setPhone(formatKrPhone(e.target.value))}
							/>
						</div>
						<div>
							<Label htmlFor="ce">이메일</Label>
							<Input id="ce" name="email" type="email" placeholder="you@example.com" required />
						</div>
						<div>
							<Label htmlFor="cnat">국적</Label>
							<Input id="cnat" name="nationality" placeholder="예: 미국, 중국" required />
						</div>
						<div>
							<Label htmlFor="cv">현재 체류자격</Label>
							<Input id="cv" name="currentVisa" placeholder="예: F4비자, E6비자, 없음" />
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
								style={{ height: 140, resize: "none" }}
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
						{pending ? "접수 중…" : "상담 신청"}
					</Button>
				</form>
			)}
		</Card>
	);
};

export const ContactInfo = ({ tone = "light" }: { tone?: "light" | "dark" }) => {
	const rows = [
		...CHANNELS.map((c) => ({
			key: c.label,
			icon: c.icon,
			label: c.note ? `${c.label} · ${c.note}` : c.label,
			value: c.value,
			href: c.href ?? null,
		})),
		{ key: "addr", icon: "map-pin", label: "주소", value: CONTACT.address, href: null },
	];
	return (
		<ul className="contact-info" data-tone={tone}>
			{rows.map((r) => {
				const inner = (
					<>
						<span className="contact-info-icon" aria-hidden="true">
							<Icon n={r.icon} style={{ width: 20, height: 20 }} />
						</span>
						<span className="contact-info-text">
							<span className="contact-info-label">{r.label}</span>
							<span className="contact-info-value">{r.value}</span>
						</span>
					</>
				);
				return (
					<li className="contact-info-row" key={r.key}>
						{r.href ? (
							<a
								className="contact-info-link"
								href={r.href}
								target={r.href.startsWith("http") ? "_blank" : undefined}
								rel="noopener noreferrer"
							>
								{inner}
							</a>
						) : (
							<div className="contact-info-static">{inner}</div>
						)}
					</li>
				);
			})}
		</ul>
	);
};

// 실제 지도(구글 맵 임베드 — API 키 불필요). CSP frame-src 에 google.com 허용됨.
const MAP_QUERY = CONTACT.address;
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
	{
		icon: "phone",
		label: "전화",
		value: `${CONTACT.phone.display}, ${CONTACT.mobile.display}`,
		href: CONTACT.phone.href,
	},
	{ icon: "mail", label: "이메일", value: CONTACT.email, href: `mailto:${CONTACT.email}` },
	{
		icon: "message-circle",
		label: "카카오톡 & 微信(WeChat)",
		value: CONTACT.kakao.handle,
		href: CONTACT.kakao.href,
	},
	{ icon: "clock", label: "업무 시간", value: CONTACT.hours, href: null },
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
							fontSize: 13,
							fontWeight: 700,
							letterSpacing: ".02em",
							color: "var(--text-muted)",
						}}
					>
						주소
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
						{CONTACT.address}
					</p>
					<p style={{ marginTop: 6, fontSize: 14, color: "var(--text-muted)" }}>
						{CONTACT.addressNote}
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
									width: 192,
									flex: "0 0 192px",
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
				외부 출장이 많은 관계로 내방상담을 원하시는 분들은 반드시 사전에 연락주시기 바랍니다.
			</p>
		</div>
		<MapBlock height={520} />
	</div>
);

/* 홈 하단 — 오시는 길(주소 + 지도). 로어스 CONTACT US 대응 */
export const LocationSection = () => (
	<section className="section soft-bg" style={{ background: "var(--surface-page)" }}>
		<div className="container">
			<SectionHead align="left" title="오시는 길" />
		</div>
		<div style={{ marginTop: "clamp(36px, 4vw, 52px)" }}>
			<LocationDetail />
		</div>
	</section>
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
				{showHead && <SectionHead title="자주 묻는 질문" />}
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
	const [phone, setPhone] = useState("");
	const [sending, setSending] = useState(false);
	const [done, setDone] = useState(false);
	const [err, setErr] = useState("");
	const submitQuick = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (sending) return;
		if (!phone.trim()) {
			setErr("연락처를 입력해 주세요.");
			return;
		}
		setSending(true);
		setErr("");
		const fd = new FormData();
		fd.set("consultField", svc);
		fd.set("phone", phone.trim());
		const res = await submitQuickConsult(null, fd);
		setSending(false);
		if (res.success) {
			setDone(true);
			setPhone("");
			setSvc("");
		} else {
			setErr(res.error ?? "접수 중 오류가 발생했습니다.");
		}
	};
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
				window.location.href = CONTACT.phone.href;
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
							<a
								href={CONTACT.phone.href}
								style={{ fontSize: 22, fontWeight: 700, color: "#fff", letterSpacing: "-.01em" }}
							>
								{CONTACT.phone.display}
							</a>
						</div>
					</div>
					<form className="consult-form" onSubmit={submitQuick}>
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
								{CONSULT_FIELDS.map((f) => (
									<SelectItem key={f.v} value={f.v}>
										{f.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						<input
							value={phone}
							onChange={(e) => setPhone(e.target.value)}
							inputMode="tel"
							aria-label="연락처"
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
								flex: "1 1 auto",
								minWidth: 0,
							}}
						/>
						<Button
							type="submit"
							variant="secondary"
							disabled={sending || done}
							style={{ whiteSpace: "nowrap" }}
						>
							{sending ? "신청 중..." : done ? "완료" : "상담신청"}
						</Button>
						{done && (
							<span
								style={{ fontWeight: 600, color: "var(--color-accent-soft)", whiteSpace: "nowrap" }}
							>
								✓ 접수되었습니다. 곧 연락드리겠습니다.
							</span>
						)}
						{err && (
							<span style={{ color: "#ffd7d0", fontSize: 13, whiteSpace: "nowrap" }}>{err}</span>
						)}
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
	// 카톡·위챗 QR 팝오버 — 한 번에 하나만 열림(상호배타)
	const [pop, setPop] = useState<"kakao" | "wechat" | null>(null);
	const isKakao = pop === "kakao";
	return (
		<Fragment>
			{pop && (
				<div
					className="float-wechat-pop hide-mobile"
					role="dialog"
					aria-label={isKakao ? "카카오톡 QR 코드" : "위챗 QR 코드"}
				>
					<button
						type="button"
						className="float-wechat-close"
						onClick={() => setPop(null)}
						aria-label="닫기"
					>
						<Icon n="x" style={{ width: 16, height: 16 }} />
					</button>
					<Image
						src={isKakao ? "/contact/kakao-qr.jpeg" : "/contact/wechat-qr.png"}
						alt={
							isKakao
								? "초이스 행정사 사무소 카카오톡 QR 코드"
								: "초이스 행정사 사무소 위챗 QR 코드"
						}
						width={188}
						height={188}
						unoptimized
					/>
					<p>
						{isKakao
							? "QR을 스캔해 카카오톡으로 상담해 주세요"
							: "QR을 스캔해 위챗 친구로 추가해 주세요"}
					</p>
				</div>
			)}
			<aside className="float-rail hide-mobile" aria-label="빠른 상담">
				<a
					className="float-rail-num"
					href={CONTACT.phone.href}
					aria-label={`전화 상담 ${CONTACT.phone.display}`}
				>
					<span className="float-rail-phone">
						<Icon n="phone-call" style={{ width: 20, height: 20 }} />
					</span>
					<span className="float-rail-tel">
						<span className="frl-eyebrow">전화상담</span>
						<strong>02</strong>
						<strong>6959-9886</strong>
					</span>
				</a>
				<button
					type="button"
					className="float-rail-cell"
					onClick={() => setPop((v) => (v === "kakao" ? null : "kakao"))}
					aria-expanded={isKakao}
				>
					<Image src="/icons/kakao.svg" alt="" width={26} height={26} unoptimized />
					<span>카톡</span>
				</button>
				<button
					type="button"
					className="float-rail-cell"
					onClick={() => setPop((v) => (v === "wechat" ? null : "wechat"))}
					aria-expanded={pop === "wechat"}
				>
					<Image src="/icons/wechat.svg" alt="" width={26} height={26} unoptimized />
					<span>위챗</span>
				</button>
				<a className="float-rail-cell" href={NAVER_BLOG} target="_blank" rel="noopener noreferrer">
					<Image src="/icons/blog.svg" alt="" width={26} height={26} unoptimized />
					<span>블로그</span>
				</a>
				<a
					className="float-rail-cell"
					href={YOUTUBE_CHANNEL}
					target="_blank"
					rel="noopener noreferrer"
				>
					<Image src="/icons/youtube.svg" alt="" width={26} height={26} unoptimized />
					<span>유튜브</span>
				</a>
				<a className="float-rail-cell" href={INSTAGRAM} target="_blank" rel="noopener noreferrer">
					<Image src="/icons/instagram.svg" alt="" width={26} height={26} unoptimized />
					<span>인스타</span>
				</a>
				<button type="button" className="float-rail-cell" onClick={() => smoothScrollTo(0)}>
					<Icon n="arrow-up" style={{ width: 22, height: 22 }} />
					<span>TOP</span>
				</button>
			</aside>
		</Fragment>
	);
};

/* 공식 등록·소속 밴드 — 메인 하단 신뢰 지표.
 * 현재는 emblem 아이콘 자리표시. 협회 공식 로고 SVG 를 받으면 public/badges/ 에 넣고
 * .affiliation-emblem 자리를 <Image>(또는 인라인 svg)로 교체하면 된다. (docs 안내 참고) */
/* 법무부는 문양(crest)만 제공 → 문양+명칭 표기, 협회 2곳은 공식 로고 락업(가로형)을 그대로 노출 */
type Affiliation =
	| { kind: "emblem"; emblem: string; name: string }
	| { kind: "logo"; logo: string; alt: string; w: number; h: number; boxH?: number };
const AFFILIATIONS: Affiliation[] = [
	{
		kind: "emblem",
		emblem: "/affiliations/moj-logo.png",
		name: "법무부 등록 출입국민원 대행기관",
	},
	{
		kind: "logo",
		logo: "/affiliations/daehan-lockup.png",
		alt: "대한행정사회",
		w: 191,
		h: 50,
		// 이 락업은 내용이 캔버스를 꽉 채워(여백 0) 기본 높이면 시험행정사회(내용 51%)보다 커 보임 →
		// boxH로 렌더 내용 높이를 시험행정사회(≈29px)에 근접하게 축소(눈높이 미세조정: 36)
		boxH: 36,
	},
	{
		kind: "logo",
		logo: "/affiliations/siheom-lockup.png",
		alt: "한국시험행정사회",
		w: 800,
		h: 200,
		boxH: 56,
	},
];

export const Affiliations = () => (
	<section className="affiliations">
		<div className="container">
			<ul className="affiliations-row">
				{AFFILIATIONS.map((a) => (
					<li className="affiliation" key={a.kind === "emblem" ? a.name : a.alt}>
						<span className="affiliation-mark">
							{a.kind === "emblem" ? (
								<>
									<span className="affiliation-emblem" aria-hidden="true">
										<Image
											src={a.emblem}
											alt=""
											width={46}
											height={46}
											style={{ width: 46, height: 46, objectFit: "contain" }}
										/>
									</span>
									<span className="affiliation-name">{a.name}</span>
								</>
							) : (
								<Image
									className="affiliation-lockup"
									src={a.logo}
									alt={a.alt}
									width={a.w}
									height={a.h}
									style={a.boxH ? { height: a.boxH } : undefined}
								/>
							)}
						</span>
					</li>
				))}
			</ul>
		</div>
	</section>
);

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
			<div className="container" style={{ padding: "56px 24px 32px" }}>
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
						aria-label="초이스 행정사 사무소 홈"
						style={{ background: "none", border: "none", padding: 0 }}
					>
						<span className="footer-logo">
							<Image
								src="/brand/logo-dark.png"
								alt="초이스 행정사 사무소"
								width={531}
								height={127}
								className="footer-logo-img"
							/>
						</span>
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
					<p>주소 : {CONTACT.address}</p>
					<p>
						전화 {CONTACT.phone.display}, {CONTACT.mobile.display} · 이메일 {CONTACT.email}
					</p>
					<p style={{ color: "rgba(255,255,255,0.45)", fontSize: 13, marginTop: 12 }}>
						© 2026 초이스 행정사 사무소. ALL RIGHTS RESERVED.
					</p>
				</div>
			</div>
		</footer>
	);
};
