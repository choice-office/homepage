"use client";

import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import Link from "next/link";
import { type FormEvent, Fragment, type ReactNode, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { submitContact, submitQuickConsult } from "@/app/actions/contact";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import type { BlogPostCard } from "@/lib/blog";
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

const HERO_OVERLAY = 0.78;

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
				fontSize: "clamp(20px, 3.2vw, 34px)",
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
					whiteSpace: "pre-line",
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
	soft = false,
}: {
	eyebrow?: string;
	title: string;
	sub?: ReactNode;
	crumbs?: Crumb[];
	image?: string; // 페이지별 히어로 배경(미지정 시 공통 HERO_IMG)
	imagePosition?: string; // object-position(미지정 시 center). 피사체가 상·하단에 치우친 이미지 크롭 보정용
	soft?: boolean; // 원본 색이 진한 사진 — 채도·농도를 낮춰 톤을 눌러준다
}) => {
	const go = useGo();
	return (
		<section
			data-hero-dark
			className="page-hero-section"
			style={{
				position: "relative",
				overflow: "hidden",
				padding: "176px 0 84px",
				background: "#3a2f24",
			}}
		>
			<Image
				src={image ?? HERO_IMG}
				alt={title}
				fill
				priority
				sizes="100vw"
				style={{
					objectFit: "cover",
					objectPosition: imagePosition ?? "center",
					opacity: soft ? 0.6 : 0.72,
					filter: soft ? "saturate(0.78) brightness(1.06)" : undefined,
				}}
			/>
			{/* 좌측(텍스트 영역)만 충분히 어둡게, 우측으로 갈수록 이미지가 밝게 드러나도록 그라디언트 완화 */}
			<div
				style={{
					position: "absolute",
					inset: 0,
					background:
						"linear-gradient(115deg, rgba(28,22,16,0.72) 0%, rgba(45,37,28,0.42) 46%, rgba(70,58,44,0.12) 100%)",
				}}
			/>
			<div className="wrap" style={{ position: "relative", zIndex: 2 }}>
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
						fontSize: "clamp(24px, 4.6vw, 44px)",
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
						className="page-hero-sub"
						style={{
							fontSize: "clamp(14px, 1.7vw, 17px)",
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
			className="home-hero-full"
			style={{
				position: "relative",
				display: "flex",
				alignItems: "center",
				overflow: "hidden",
				background: "#1a1612",
			}}
		>
			<Image
				src={HOME_HERO_IMG}
				alt="출입국·비자·체류자격 전문 초이스 행정사사무소"
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
				className="home-hero-inner wrap"
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
							fontSize: "clamp(26px, 5vw, 50px)",
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
							fontSize: "clamp(15px, 2vw, 18px)",
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
						{/* 히어로 주 CTA — 빛 사선 스윕(.shine)으로 첫 화면에서 눈이 먼저 가게 */}
						<Button
							variant="primary"
							size="lg"
							className="shine"
							style={{ fontWeight: 800 }}
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
	const total = STRENGTH_SLIDES.length;
	const sectionRef = useRef<HTMLElement>(null);
	const [selected, setSelected] = useState(0);

	// 무한 루프 + 마우스 드래그. Embla가 transform·드래그·루프를 구동한다.
	const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start", duration: 25 });

	// 선택 동기화(탭 활성·inert) + 자동전환(6초).
	// 게이지(CSS 진행 바)와 항상 동기되도록 슬라이드 전환(select)마다 타이머를 리셋한다 →
	// hover·스크롤·단순 클릭엔 멈추지 않고 계속 흐른다(사용자 요청). reduced-motion 시 자동전환 없음.
	useEffect(() => {
		if (!emblaApi) return;
		const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		let timer: ReturnType<typeof setInterval> | undefined;
		const restart = () => {
			if (reduce) return;
			clearInterval(timer);
			timer = setInterval(() => emblaApi.scrollNext(), 6000);
		};
		const onSelect = () => {
			setSelected(emblaApi.selectedScrollSnap());
			restart();
		};
		emblaApi.on("select", onSelect).on("reInit", onSelect);
		onSelect();
		return () => {
			clearInterval(timer);
			emblaApi.off("select", onSelect).off("reInit", onSelect);
		};
	}, [emblaApi]);

	// 스크롤을 아래로 내려 섹션에 진입할 때마다 리빌 애니메이션 재생(위로 스크롤 시엔 즉시 표시).
	// 전역 ScrollReveal(1회성)과 분리하기 위해 data-reveal 대신 전용 클래스(sr-*)로 처리.
	useEffect(() => {
		const el = sectionRef.current;
		if (!el) return;
		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
			el.classList.add("sr-shown");
			return;
		}
		el.classList.add("sr-hidden");
		let lastY = window.scrollY;
		let down = true;
		const onScroll = () => {
			const y = window.scrollY;
			if (y !== lastY) down = y > lastY;
			lastY = y;
		};
		window.addEventListener("scroll", onScroll, { passive: true });
		const io = new IntersectionObserver(
			(entries) => {
				for (const e of entries) {
					if (e.isIntersecting) {
						if (down) {
							// 리셋 → 리플로우 → 재생(스크롤-다운마다 애니메이션 재시작)
							el.classList.remove("sr-in", "sr-shown");
							el.classList.add("sr-hidden");
							void el.offsetWidth;
							el.classList.remove("sr-hidden");
							el.classList.add("sr-in");
						} else {
							el.classList.remove("sr-hidden", "sr-in");
							el.classList.add("sr-shown");
						}
					} else if (el.getBoundingClientRect().top > 0) {
						// 뷰포트 아래로 벗어남 → 다음 스크롤-다운에 재생되도록 리셋
						el.classList.remove("sr-in", "sr-shown");
						el.classList.add("sr-hidden");
					}
				}
			},
			{ threshold: 0.25 },
		);
		io.observe(el);
		return () => {
			io.disconnect();
			window.removeEventListener("scroll", onScroll);
		};
	}, []);

	return (
		<section
			ref={sectionRef}
			className="section soft-bg str-section"
			style={{ background: "var(--surface-subtle)" }}
		>
			<div className="wrap">
				<h2 className="str-title">초이스의 강점</h2>

				<div
					className="str-stage"
					role="group"
					aria-roledescription="carousel"
					aria-label="초이스만의 강점"
				>
					<button
						type="button"
						className="str-arrow"
						aria-label="이전 강점"
						onClick={() => emblaApi?.scrollPrev()}
					>
						<Icon
							n="chevron-right"
							style={{ width: 22, height: 22, transform: "rotate(180deg)" }}
						/>
					</button>

					{/* Embla 캐러셀: 드래그·무한 루프. ref=뷰포트, 첫 자식=트랙(컨테이너), 그 자식들=슬라이드 */}
					<div className="str-viewport" ref={emblaRef}>
						<div className="str-track">
							{STRENGTH_SLIDES.map((s, i) => (
								<div className="str-panel" key={s.no} inert={i !== selected}>
									<div className="str-text">
										<span className="str-no">
											{s.no}
											<span className="str-no-total"> / 0{total}</span>
										</span>
										<h3 className="str-headline" style={{ whiteSpace: "pre-line" }}>
											{s.title}
										</h3>
										<p className="str-copy">
											{s.lines.map((line, j) => (
												<Fragment key={line}>
													{j === s.highlightIndex ? <span className="str-hl">{line}</span> : line}
													{j < s.lines.length - 1 && <br />}
												</Fragment>
											))}
										</p>
										<button type="button" className="str-cta" onClick={() => go(s.cta.route)}>
											{s.cta.label}
											<Icon n="arrow-right" style={{ width: 18, height: 18 }} />
										</button>
									</div>

									{/* 우: 이미지 — 오프셋 액센트 블록으로 에디토리얼 깊이 */}
									<div className="str-figure">
										<span className="str-figure-accent" aria-hidden="true" />
										<div className="str-visual">
											<Image
												src={s.img}
												alt={s.tab}
												fill
												sizes="(max-width: 900px) 100vw, 45vw"
												style={{ objectFit: "cover" }}
											/>
										</div>
									</div>
								</div>
							))}
						</div>
					</div>

					<button
						type="button"
						className="str-arrow"
						aria-label="다음 강점"
						onClick={() => emblaApi?.scrollNext()}
					>
						<Icon n="chevron-right" style={{ width: 22, height: 22 }} />
					</button>
				</div>

				{/* 하단 탭 */}
				<div className="str-tabs">
					{STRENGTH_SLIDES.map((s, i) => (
						<button
							type="button"
							key={s.no}
							className="str-tab"
							data-active={i === selected}
							onClick={() => emblaApi?.scrollTo(i)}
						>
							<span className="str-tab-no">{s.no}</span>
							<span className="str-tab-label">{s.tab}</span>
							{i === selected && <span className="str-tab-bar" key={selected} aria-hidden="true" />}
						</button>
					))}
				</div>
			</div>
		</section>
	);
};

export const StrengthsRow = () => (
	<section className="section soft-bg" style={{ background: "var(--surface-page)" }}>
		<div className="wrap">
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
							<div className="proc-step-body">
								<span className="proc-step-icon" aria-hidden="true">
									<Icon n={p.icon} style={{ width: 24, height: 24 }} />
								</span>
								<h3 className="proc-step-title">{p.title}</h3>
								<p className="proc-step-desc">{p.desc}</p>
							</div>
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
			<div className="wrap">
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
								fontSize: "clamp(19px, 2.8vw, 32px)",
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
		<div className="wrap">
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

// 통계 항목별 lucide 아이콘 (STATS 순서: Since 2019 / 3,500+ / 법무부 등록 / 100%)
const STAT_ICONS = ["award", "clipboard-list", "badge-check", "user-check"];

export const Stats = () => (
	<section
		className="stats-section"
		style={{ background: "var(--color-primary)", padding: "72px 0" }}
	>
		<div data-stagger="scale" className="grid-4 stats-grid wrap" style={{ gap: 24 }}>
			{STATS.map((s, i) => (
				<div
					key={s.l}
					className="stat-cell"
					style={{
						textAlign: "center",
						color: "#fff",
						// 항목 사이 세로 구분선(마지막 제외). 모바일 2×2는 globals.css가 별도 처리.
						borderRight: i < STATS.length - 1 ? "1px solid rgba(255,255,255,0.16)" : undefined,
					}}
				>
					<Icon
						n={STAT_ICONS[i]}
						style={{
							width: 34,
							height: 34,
							display: "block",
							margin: "0 auto 14px",
							color: "rgba(255,255,255,0.8)",
						}}
					/>
					<div
						className="stat-value"
						style={{
							fontSize: "clamp(24px,4.2vw,38px)",
							fontWeight: 700,
							letterSpacing: "-0.02em",
						}}
					>
						{s.v}
					</div>
					<div className="stat-label" style={{ fontSize: 16, fontWeight: 500, marginTop: 8 }}>
						{s.l}
					</div>
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
				alt="초이스 행정사 유튜브 쇼츠 썸네일"
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
		<div className="wrap">
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

export const BlogPreview = ({ posts }: { posts: BlogPostCard[] }) => (
	<section className="section" style={{ background: "var(--surface-subtle)" }}>
		<div className="wrap">
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
			<div
				data-stagger
				className="grid-4 blog-grid home-blog-grid"
				style={{ marginTop: "clamp(20px, 5vw, 48px)" }}
			>
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
			<div className="wrap">
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
						sub="실제 의뢰인분들이 보내주신 소중한 후기입니다."
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
			<div className="wrap">
				<p
					style={{
						textAlign: "center",
						marginTop: 28,
						fontSize: 13,
						color: "var(--text-muted)",
						wordBreak: "keep-all",
					}}
				>
					※ 실제 의뢰인이 보내주신 내용이며,
					<br />
					개인정보 보호를 위해 일부 정보는 비공개 처리하였습니다.
				</p>
			</div>
		</section>
	);
};

export const CTABand = () => {
	const go = useGo();
	return (
		<section
			className="cta-band"
			style={{
				background:
					"linear-gradient(160deg, var(--color-primary) 0%, var(--color-primary-dark) 100%)",
				padding: "80px 0",
			}}
		>
			<div data-reveal="scale" className="wrap" style={{ textAlign: "center", color: "#fff" }}>
				<h2
					className="cta-title"
					style={{ fontSize: "clamp(20px,3.4vw,32px)", color: "#fff", wordBreak: "keep-all" }}
				>
					혼자 고민하지 마세요. 경험이 결과를 만듭니다.
				</h2>
				<p
					className="cta-sub"
					style={{
						fontSize: 17,
						color: "rgba(255,255,255,.82)",
						marginTop: 16,
						lineHeight: 1.7,
						wordBreak: "keep-all",
					}}
				>
					3,500건 이상의 업무 경험을 바탕으로 최적의 해결&nbsp;방향을 제시해 드립니다.
				</p>
				<div
					className="cta-actions"
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
						className="shine"
						style={{ fontWeight: 800 }}
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
						iconStart={
							<span className="consult-ring" aria-hidden="true">
								<Icon n="phone" style={{ width: 17, height: 17 }} />
							</span>
						}
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
	{ v: "resident", label: "주재원·임원 (D7비자·D8비자)" },
	{ v: "e6", label: "외국인 연예인 비자 (E6비자)" },
	{ v: "e7", label: "외국인 취업비자 (E7비자)" },
	{ v: "f4", label: "재외동포·거소증 (F4비자)" },
	{ v: "f5", label: "영주권 (F5비자)" },
	{ v: "f6", label: "결혼비자 (F6비자)" },
	{ v: "nat", label: "국적회복" },
	{ v: "etc", label: "기타" },
];

// Base UI Select 는 items 를 받아야 트리거에 값(e6·f5) 대신 라벨을 표시한다
const CONSULT_FIELD_ITEMS = CONSULT_FIELDS.map((f) => ({ value: f.v, label: f.label }));

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
		<Card
			hover={false}
			padding="clamp(28px, 4vw, 36px) clamp(18px, 5vw, 36px)"
			className="contact-form-card"
		>
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
					{/* 봇 트랩(허니팟) — 사람에게 보이지 않고, 채워지면 서버가 조용히 버린다 */}
					<input
						type="text"
						name="website"
						tabIndex={-1}
						autoComplete="off"
						aria-hidden="true"
						style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }}
					/>
					<div
						className="contact-form-grid"
						style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}
					>
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
							<Select
								items={CONSULT_FIELD_ITEMS}
								value={field}
								onValueChange={(v) => setField(v ?? "")}
							>
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
							<a
								href="/privacy"
								target="_blank"
								rel="noopener noreferrer"
								style={{
									color: "var(--color-primary)",
									textDecoration: "underline",
									textUnderlineOffset: 2,
								}}
							>
								개인정보 수집·이용
							</a>
							에 동의합니다.
						</span>
					</label>
					<p
						style={{
							marginTop: 8,
							fontSize: 12.5,
							color: "var(--text-muted)",
							lineHeight: 1.6,
						}}
					>
						수집 항목: 성함·연락처·이메일·국적(필수), 현재 체류자격·상담 분야·문의 내용(선택) · 이용
						목적: 상담 문의 접수 및 답변 · 보유 기간: 처리 완료 후 3년 · 동의를 거부할 수 있으며, 이
						경우 상담 접수가 제한될 수 있습니다.
					</p>
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
						className="shine"
						style={{ width: "100%", marginTop: 20, fontSize: 18, fontWeight: 800 }}
					>
						{pending ? "접수 중…" : "상담 신청"}
					</Button>
				</form>
			)}
		</Card>
	);
};

// 카톡·위챗 QR 모달 — 둘 다 ID 딥링크가 없어 QR/아이디로 안내한다.
// 문의 페이지 채널 목록과 모바일 하단 상담바에서 공용으로 쓴다.
const QR_INFO = {
	kakao: {
		title: "카카오톡",
		src: "/contact/kakao-qr.jpeg",
		alt: "초이스 행정사사무소 카카오톡 QR 코드",
		scan: "카카오톡 > 코드스캔",
		icon: "message-circle",
		handle: CONTACT.kakao.handle,
	},
	wechat: {
		title: "微信(WeChat)",
		src: "/contact/wechat-qr.png",
		alt: "초이스 행정사사무소 위챗 QR 코드",
		scan: "위챗 > 스캔",
		icon: "message-square",
		handle: CONTACT.wechat.handle,
	},
} as const;

type QrKind = keyof typeof QR_INFO;
const QR_KINDS: QrKind[] = ["kakao", "wechat"];

const QrDialog = ({ kind, onClose }: { kind: QrKind; onClose: () => void }) => {
	const info = QR_INFO[kind];
	// Esc 로도 닫는다(바깥 클릭은 아래 scrim 버튼이 처리)
	useEffect(() => {
		const onKey = (e: KeyboardEvent) => {
			if (e.key === "Escape") onClose();
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [onClose]);
	// body로 포털 — 스크롤 리빌 래퍼(.contact-col)의 will-change가 fixed 컨테이닝 블록을 만들어
	// 제자리에 두면 오버레이가 뷰포트가 아니라 그 래퍼 기준으로 잘린다.
	return createPortal(
		<div
			className="consult-qr"
			role="dialog"
			aria-modal="true"
			aria-label={`${info.title} QR 코드`}
		>
			{/* 바깥(어두운 영역) 클릭 시 닫기 — 드로어 scrim 과 동일하게 button 으로 둬 키보드도 지원 */}
			<button type="button" className="consult-qr-scrim" onClick={onClose} aria-label="닫기" />
			<div className="consult-qr-card">
				<button type="button" className="consult-qr-close" onClick={onClose} aria-label="닫기">
					<Icon n="x" style={{ width: 18, height: 18 }} />
				</button>
				<Image src={info.src} alt={info.alt} width={200} height={200} unoptimized />
				<p className="consult-qr-title">{info.title}</p>
				<p className="consult-qr-desc">
					QR을 캡처해 {info.scan} &gt; 앨범에서 선택하거나, 아이디 <strong>{info.handle}</strong> 로
					검색해 추가해 주세요.
				</p>
			</div>
		</div>,
		document.body,
	);
};

// CHANNELS의 "카카오톡 & 微信(WeChat)" 합본 행 — 여기서는 반반으로 나눠 각각 QR을 띄운다.
const MESSAGING_LABEL = "카카오톡 & 微信(WeChat)";

export const ContactInfo = ({ tone = "light" }: { tone?: "light" | "dark" }) => {
	const [qr, setQr] = useState<QrKind | null>(null);
	const rows = [
		...CHANNELS.filter((c) => c.label !== MESSAGING_LABEL).map((c) => ({
			key: c.label,
			icon: c.icon,
			label: c.note ? `${c.label} · ${c.note}` : c.label,
			value: c.value,
			href: c.href ?? null,
		})),
		{ key: "addr", icon: "map-pin", label: "주소", value: CONTACT.address, href: null },
	];
	// 메신저 행은 이메일 앞(= CHANNELS 원래 순서)에 끼워 넣는다.
	const messagingAt = CHANNELS.findIndex((c) => c.label === MESSAGING_LABEL);
	return (
		<>
			{qr && <QrDialog kind={qr} onClose={() => setQr(null)} />}
			<ul className="contact-info" data-tone={tone}>
				{rows.map((r, i) => {
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
						<Fragment key={r.key}>
							{/* 카카오톡·위챗은 한 줄씩. 행 오른쪽 끝의 'QR 보기'만 버튼이다. */}
							{i === messagingAt &&
								QR_KINDS.map((k) => (
									<li className="contact-info-row" key={k}>
										<div className="contact-info-static">
											<span className="contact-info-icon" aria-hidden="true">
												<Icon n={QR_INFO[k].icon} style={{ width: 20, height: 20 }} />
											</span>
											<span className="contact-info-text">
												<span className="contact-info-label">{QR_INFO[k].title}</span>
												<span className="contact-info-value">{QR_INFO[k].handle}</span>
											</span>
											<button
												type="button"
												className="contact-qr-btn"
												onClick={() => setQr(k)}
												aria-haspopup="dialog"
											>
												QR 보기
											</button>
										</div>
									</li>
								))}
							<li className="contact-info-row">
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
						</Fragment>
					);
				})}
			</ul>
		</>
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
// 카카오톡·위챗은 딥링크가 없어 각각 QR 모달로 연다(qr). 나머지는 일반 링크(href).
type LocationRow = {
	icon: string;
	label: string;
	value: string;
	href?: string | null;
	qr?: QrKind;
};

const LOCATION_ROWS: LocationRow[] = [
	{
		icon: "phone",
		label: "전화",
		value: `${CONTACT.phone.display}, ${CONTACT.mobile.display}`,
		href: CONTACT.phone.href,
	},
	{ icon: "mail", label: "이메일", value: CONTACT.email, href: `mailto:${CONTACT.email}` },
	{
		icon: "message-circle",
		label: "카카오톡",
		value: CONTACT.kakao.handle,
		qr: "kakao",
	},
	{
		icon: "message-square",
		label: "微信(WeChat)",
		value: CONTACT.wechat.handle,
		qr: "wechat",
	},
	{ icon: "clock", label: "업무 시간", value: CONTACT.hours },
];

export const LocationDetail = () => {
	const [qr, setQr] = useState<QrKind | null>(null);
	return (
		<div className="contact-grid wrap">
			{qr && <QrDialog kind={qr} onClose={() => setQr(null)} />}
			<div>
				<div style={{ borderTop: "1px solid var(--border-default)" }}>
					<div
						className="loc-row"
						style={{
							display: "flex",
							alignItems: "flex-start",
							gap: 16,
							padding: "16px 0",
							borderBottom: "1px solid var(--border-default)",
						}}
					>
						<span
							className="loc-row-label"
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
							<span className="loc-row-ic" aria-hidden="true">
								<Icon
									n="map-pin"
									style={{ width: 18, height: 18, color: "var(--color-primary)" }}
								/>
							</span>
							주소
						</span>
						<span
							className="loc-row-val"
							style={{ fontSize: 16, fontWeight: 600, color: "var(--text-heading)" }}
						>
							{CONTACT.address}
							<span
								style={{
									display: "block",
									marginTop: 4,
									fontSize: 13,
									fontWeight: 400,
									color: "var(--text-muted)",
								}}
							>
								{/* 지하철 안내를 노선별로 줄바꿈(" · " 기준) → 각 노선 안내가 한 줄에 오게 */}
								{CONTACT.addressNote.split(" · ").map((line) => (
									<span key={line} style={{ display: "block" }}>
										{line}
									</span>
								))}
							</span>
						</span>
					</div>
					{LOCATION_ROWS.map((r) => {
						const body = (
							<>
								<span
									className="loc-row-label"
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
									<span className="loc-row-ic" aria-hidden="true">
										<Icon
											n={r.icon}
											style={{ width: 18, height: 18, color: "var(--color-primary)" }}
										/>
									</span>
									{r.label}
								</span>
								<span
									className="loc-row-val"
									style={{ fontSize: 16, fontWeight: 600, color: "var(--text-heading)" }}
								>
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
						if (r.qr) {
							return (
								<button
									key={r.label}
									type="button"
									className="loc-row"
									onClick={() => setQr(r.qr as QrKind)}
									aria-haspopup="dialog"
									// border 축약형 금지 — 스프레드로 이미 자리를 잡은 borderBottom 을 뒤에서 통째로
									// 지워버려(객체 키 순서 규칙) 구분선이 사라진다. 지울 변만 개별 지정한다.
									style={{
										...rowStyle,
										width: "100%",
										borderTop: "none",
										borderLeft: "none",
										borderRight: "none",
										background: "none",
										font: "inherit",
										textAlign: "left",
										cursor: "pointer",
										color: "var(--text-body)",
									}}
								>
									{body}
								</button>
							);
						}
						return r.href ? (
							<a
								key={r.label}
								className="loc-row"
								href={r.href}
								target={r.href.startsWith("http") ? "_blank" : undefined}
								rel="noopener noreferrer"
								style={{ ...rowStyle, color: "var(--text-body)" }}
							>
								{body}
							</a>
						) : (
							<div key={r.label} className="loc-row" style={rowStyle}>
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
};

/* 홈 하단 — 오시는 길(주소 + 지도). 로어스 CONTACT US 대응 */
export const LocationSection = () => (
	<section className="section soft-bg" style={{ background: "var(--surface-page)" }}>
		<div className="wrap">
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
			<div className="wrap" style={{ maxWidth: 820 }}>
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
	const [visible, setVisible] = useState(false);
	const [qr, setQr] = useState<QrKind | null>(null); // 모바일 카톡·위챗 QR 팝업
	const [svc, setSvc] = useState("");
	const [phone, setPhone] = useState("");
	const [name, setName] = useState("");
	const [agree, setAgree] = useState(false);
	const [sending, setSending] = useState(false);
	const [toast, setToast] = useState<{ kind: "ok" | "err"; msg: string } | null>(null);
	// 같은 번호로 연속 신청 방지 — 이번 세션에서 접수 성공한 번호(숫자만)를 기억
	const submittedPhones = useRef<Set<string>>(new Set());
	const showToast = (kind: "ok" | "err", msg: string) => {
		setToast({ kind, msg });
		window.setTimeout(() => setToast(null), kind === "ok" ? 3500 : 2400);
	};
	const submitQuick = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (sending) return;
		if (!name.trim()) {
			showToast("err", "성함을 입력해 주세요.");
			return;
		}
		if (!svc) {
			showToast("err", "상담분야를 선택해 주세요.");
			return;
		}
		if (!phone.trim()) {
			showToast("err", "연락처를 입력해 주세요.");
			return;
		}
		if (!agree) {
			showToast("err", "개인정보 수집·이용에 동의해 주세요.");
			return;
		}
		const digits = phone.replace(/\D/g, "");
		if (submittedPhones.current.has(digits)) {
			showToast("err", "이미 상담 신청하신 번호입니다.");
			return;
		}
		setSending(true);
		const fd = new FormData();
		fd.set("name", name.trim());
		fd.set("consultField", svc);
		fd.set("phone", phone.trim());
		fd.set("privacyConsent", "on");
		const res = await submitQuickConsult(null, fd);
		setSending(false);
		if (res.success) {
			submittedPhones.current.add(digits);
			setPhone("");
			setSvc("");
			setName("");
			setAgree(false);
			showToast("ok", "상담 신청이 접수되었습니다");
		} else {
			showToast("err", res.error ?? "접수 중 오류가 발생했습니다.");
		}
	};
	useEffect(() => {
		const on = () => setVisible(window.scrollY > 360);
		window.addEventListener("scroll", on, { passive: true });
		on();
		return () => window.removeEventListener("scroll", on);
	}, []);
	// 모바일 하단 바 — 전화상담 + 소셜 4개(카톡·인스타·블로그·유튜브).
	// 카톡은 딥링크가 없어 QR 모달로 안내한다(위챗은 PC 레일·문의 페이지에서만 노출).
	// img(브랜드 svg)가 있으면 이미지, 없으면 lucide(icon). href면 <a>, onClick이면 <button>.
	const mobileItems: {
		label: string;
		icon?: string;
		img?: string;
		href?: string;
		onClick?: () => void;
	}[] = [
		{
			icon: "phone-call",
			label: "전화상담",
			onClick: () => {
				window.location.href = CONTACT.phone.href;
			},
		},
		{ img: "/icons/kakao.svg", label: "카톡", onClick: () => setQr("kakao") },
		{ img: "/icons/instagram.svg", label: "인스타", href: INSTAGRAM },
		{ img: "/icons/blog.svg", label: "블로그", href: NAVER_BLOG },
		{ img: "/icons/youtube.svg", label: "유튜브", href: YOUTUBE_CHANNEL },
	];
	return (
		<>
			{toast && (
				<div className={`consult-toast consult-toast--${toast.kind}`} role="status">
					<span className="consult-toast-ic" aria-hidden="true">
						<Icon
							n={toast.kind === "ok" ? "check" : "x"}
							style={toast.kind === "ok" ? { width: 19, height: 19 } : { width: 14, height: 14 }}
						/>
					</span>
					<span className="consult-toast-txt">
						<strong>{toast.msg}</strong>
						{toast.kind === "ok" && "곧 연락드리겠습니다."}
					</span>
				</div>
			)}
			{qr && <QrDialog kind={qr} onClose={() => setQr(null)} />}
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
				<div className="consult-bar-inner wrap" style={{ padding: "24px 24px", gap: 20 }}>
					<div style={{ display: "flex", alignItems: "center", gap: 12, whiteSpace: "nowrap" }}>
						{/* 전화 아이콘 — 벨 울리듯 살짝 흔들려 시선을 끈다(PC 레일과 동일 모션) */}
						<span className="consult-ring" aria-hidden="true">
							<Icon
								n="phone-call"
								style={{ width: 22, height: 22, color: "var(--color-accent-soft)" }}
							/>
						</span>
						<div style={{ display: "flex", flexDirection: "column", lineHeight: 1.15 }}>
							<span
								style={{
									fontSize: 12.5,
									fontWeight: 800,
									color: "var(--color-accent-soft)",
									letterSpacing: ".02em",
								}}
							>
								신속 상담
							</span>
							<a
								href={CONTACT.phone.href}
								style={{ fontSize: 20, fontWeight: 800, color: "#fff", letterSpacing: "-.01em" }}
							>
								{CONTACT.phone.display}
							</a>
						</div>
					</div>
					<form
						className="consult-form"
						onSubmit={submitQuick}
						style={{ flex: "0 1 1060px", gap: 10 }}
					>
						<input
							value={name}
							onChange={(e) => setName(e.target.value)}
							aria-label="성함"
							placeholder="성함"
							style={{
								height: 44,
								padding: "0 14px",
								borderRadius: "var(--radius)",
								border: "none",
								background: "#fff",
								fontFamily: "var(--font-sans)",
								fontSize: 15,
								color: "var(--text-body)",
								flex: "0 1 210px",
								minWidth: 0,
							}}
						/>
						<Select items={CONSULT_FIELD_ITEMS} value={svc} onValueChange={(v) => setSvc(v ?? "")}>
							<SelectTrigger
								className="border-none"
								style={{
									height: 44,
									flex: "0 1 175px",
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
							onChange={(e) => setPhone(formatKrPhone(e.target.value))}
							inputMode="tel"
							aria-label="연락처"
							placeholder="010-0000-0000"
							style={{
								height: 44,
								padding: "0 14px",
								borderRadius: "var(--radius)",
								border: "none",
								background: "#fff",
								fontFamily: "var(--font-sans)",
								fontSize: 15,
								color: "var(--text-body)",
								flex: "0 1 340px",
								maxWidth: 340,
								minWidth: 0,
							}}
						/>
						<label
							style={{
								display: "flex",
								alignItems: "center",
								gap: 6,
								flex: "0 0 auto",
								whiteSpace: "nowrap",
								fontSize: 13,
								color: "rgba(255,255,255,0.82)",
								cursor: "pointer",
							}}
						>
							<input
								type="checkbox"
								checked={agree}
								onChange={(e) => setAgree(e.target.checked)}
								style={{ width: 16, height: 16, accentColor: "var(--color-accent)" }}
							/>
							<span>
								<a
									href="/privacy"
									target="_blank"
									rel="noopener noreferrer"
									onClick={(e) => e.stopPropagation()}
									style={{ color: "inherit", textDecoration: "underline", textUnderlineOffset: 2 }}
								>
									개인정보 수집·이용
								</a>{" "}
								동의
							</span>
						</label>
						{/* PC 상담바 CTA도 모바일 전화상담 셀처럼 빛 사선 스윕(.shine)으로 시선을 끈다 */}
						<Button
							type="submit"
							variant="secondary"
							disabled={sending}
							className="shine"
							style={{ whiteSpace: "nowrap", minWidth: 132, fontWeight: 800 }}
						>
							{sending ? "신청 중..." : "상담신청"}
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
					transform: visible ? "translateY(0)" : "translateY(100%)",
					transition: "transform .35s ease",
				}}
			>
				{mobileItems.map((it, i) => {
					const cellStyle = {
						flex: 1,
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
						justifyContent: "center",
						gap: 5,
						padding: "12px 2px",
						minHeight: 60,
						background: "none",
						border: "none",
						borderLeft: i ? "1px solid rgba(255,255,255,0.14)" : "none",
						color: "#fff",
						fontFamily: "var(--font-sans)",
						textDecoration: "none",
					} as const;
					const inner = (
						<>
							{it.img ? (
								<Image src={it.img} alt="" width={21} height={21} unoptimized />
							) : (
								<Icon
									n={it.icon as string}
									style={{ width: 20, height: 20, color: "var(--color-accent-soft)" }}
								/>
							)}
							<span style={{ fontSize: 12, fontWeight: 600, whiteSpace: "nowrap" }}>
								{it.label}
							</span>
						</>
					);
					// 전화상담 셀만 PC 레일 전화패널처럼 빛 사선 스윕(반짝임) 부여
					const cls = it.label === "전화상담" ? "lk shine" : "lk";
					return it.href ? (
						<a
							key={it.label}
							className={cls}
							href={it.href}
							target="_blank"
							rel="noopener noreferrer"
							style={cellStyle}
						>
							{inner}
						</a>
					) : (
						<button
							key={it.label}
							type="button"
							className={cls}
							onClick={it.onClick}
							style={cellStyle}
						>
							{inner}
						</button>
					);
				})}
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
							isKakao ? "초이스 행정사사무소 카카오톡 QR 코드" : "초이스 행정사사무소 위챗 QR 코드"
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
		boxH: 43,
	},
	{
		kind: "logo",
		logo: "/affiliations/siheom-lockup.png",
		alt: "한국시험행정사회",
		w: 800,
		h: 200,
		boxH: 67,
	},
];

export const Affiliations = () => (
	<section className="affiliations">
		<div className="wrap">
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
											width={56}
											height={56}
											style={{ width: 56, height: 56, objectFit: "contain" }}
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
			<div className="wrap" style={{ padding: "56px 24px 32px" }}>
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
					{/* 실제 링크(<Link>)로 둔다 — 커서·새 탭 열기·크롤러 모두 정상 동작 */}
					<Link href="/" className="lk" aria-label="초이스 행정사사무소 홈">
						<span className="footer-logo">
							<Image
								src="/brand/logo-dark.png"
								alt="초이스 행정사사무소"
								width={531}
								height={127}
								className="footer-logo-img"
							/>
						</span>
					</Link>
					<nav
						style={{ display: "flex", columnGap: 22, rowGap: 6, fontSize: 14, flexWrap: "wrap" }}
					>
						{NAV.map((n) => (
							<Fragment key={n.label}>
								{/* 모바일에서 '블로그'부터 다음 줄로 내리는 강제 줄바꿈(데스크톱은 CSS로 미표시) */}
								{n.label === "블로그" && <span className="footer-nav-break" aria-hidden="true" />}
								<button
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
							</Fragment>
						))}
					</nav>
				</div>
				<div className="footer-info" style={{ marginTop: 28, fontSize: 14, lineHeight: 1.9 }}>
					{/* 라벨(고정폭)+값 2열 → 콜론 정렬 + 주소 줄바꿈 시 둘째 줄이 값 시작선에 맞춰짐.
					    PC(≥961px)에선 아래 CSS로 블록 전체를 오른쪽 정렬. */}
					<p style={{ wordBreak: "keep-all" }}>
						주소 : {CONTACT.address.split(", ")[0]}
						{", "}
						{/* 모바일에서만 건물명부터 줄바꿈, PC(≥961px)에선 br 숨겨 한 줄로 */}
						<br className="br-mobile" />
						{CONTACT.address.split(", ").slice(1).join(", ")}
					</p>
					<p>
						전화 : {CONTACT.phone.display}, {CONTACT.mobile.display}
					</p>
					<p>이메일 : {CONTACT.email}</p>
					<p
						style={{
							marginTop: 14,
							display: "flex",
							gap: 16,
							flexWrap: "wrap",
							justifyContent: "flex-end",
						}}
					>
						<Link href="/privacy" style={{ color: "#fff", fontWeight: 600 }}>
							개인정보처리방침
						</Link>
						<Link href="/terms" style={{ color: "rgba(255,255,255,0.8)" }}>
							이용약관
						</Link>
					</p>
					<p style={{ color: "rgba(255,255,255,0.45)", fontSize: 13, marginTop: 12 }}>
						© 2026 초이스 행정사사무소. ALL RIGHTS RESERVED.
					</p>
				</div>
			</div>
		</footer>
	);
};
