"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useRef } from "react";
import { buttonVariants } from "@/lib/button-variants";
import { cn } from "@/lib/utils";

// ─────────────────────────────────────────────────────────────
// ParallaxHero — 배경 이미지가 콘텐츠보다 느리게 스크롤되는 패럴랙스 히어로
//
// 교체할 것:
// 1. image — /public/ 기준 이미지 경로 (1920×1080 권장)
// 2. title, subtitle, cta 텍스트
// 3. overlayOpacity — "light" | "medium" | "dark"
// 4. parallaxStrength — 배경 이동 강도 (기본 150px, 클수록 효과 강함)
// ─────────────────────────────────────────────────────────────

type ParallaxHeroProps = {
	image: string;
	alt?: string;
	title: string;
	titleHighlight?: string;
	subtitle?: string;
	primaryCta?: { label: string; href: string };
	secondaryCta?: { label: string; href: string };
	overlayOpacity?: "light" | "medium" | "dark";
	align?: "left" | "center";
	minHeight?: string;
	parallaxStrength?: number;
};

// ★ 설정: 기본값을 수정하세요
const defaultProps: ParallaxHeroProps = {
	image: "/hero/parallax-bg.jpg",
	alt: "배경 이미지",
	title: "Your Compelling",
	titleHighlight: "Headline Here",
	subtitle:
		"A brief description of your product or service. Make it compelling and clear what value you provide.",
	primaryCta: { label: "Get Started", href: "#contact" },
	secondaryCta: { label: "Learn More", href: "#features" },
	overlayOpacity: "medium",
	align: "center",
	minHeight: "100vh",
	parallaxStrength: 150,
};

const overlayClass = {
	light: "bg-black/30",
	medium: "bg-black/50",
	dark: "bg-black/70",
};

export const ParallaxHero = (props: Partial<ParallaxHeroProps> = {}) => {
	const {
		image,
		alt,
		title,
		titleHighlight,
		subtitle,
		primaryCta,
		secondaryCta,
		overlayOpacity,
		align,
		minHeight,
		parallaxStrength,
	} = { ...defaultProps, ...props };

	const ref = useRef<HTMLElement>(null);
	const prefersReducedMotion = useReducedMotion();

	// 섹션이 스크롤될 때 배경을 다른 속도로 이동시킴
	const { scrollYProgress } = useScroll({
		target: ref,
		offset: ["start start", "end start"],
	});

	const strength = parallaxStrength ?? 150;
	// 모션 감소 설정 시 패럴랙스 비활성화
	const backgroundY = useTransform(
		scrollYProgress,
		[0, 1],
		prefersReducedMotion ? ["0%", "0%"] : ["0%", `${strength}px`],
	);

	return (
		<section ref={ref} className="relative overflow-hidden" style={{ minHeight }}>
			{/* 패럴랙스 배경 이미지 */}
			<motion.div
				className="absolute inset-0 will-change-transform"
				style={{
					backgroundImage: `url(${image})`,
					backgroundSize: "cover",
					backgroundPosition: "center",
					backgroundRepeat: "no-repeat",
					// 패럴랙스 여백 확보를 위해 상하로 여유분 추가 (reduced-motion이면 여백 불필요)
					top: prefersReducedMotion ? 0 : `-${strength}px`,
					bottom: prefersReducedMotion ? 0 : `-${strength}px`,
					y: backgroundY,
				}}
				role="img"
				aria-label={alt}
			/>

			{/* 오버레이 */}
			<div className={cn("absolute inset-0", overlayClass[overlayOpacity ?? "medium"])} />

			{/* 콘텐츠 */}
			<div
				className={cn(
					"relative z-10 flex items-center px-4 sm:px-6 lg:px-8",
					align === "center" ? "justify-center text-center" : "justify-start text-left",
				)}
				style={{ minHeight }}
			>
				<div className="mx-auto w-full max-w-4xl">
					<motion.h1
						className="font-bold text-4xl text-white tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
						initial={prefersReducedMotion ? false : { opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.7, ease: "easeOut" }}
					>
						{title}
						{titleHighlight && (
							<>
								{" "}
								<span className="text-primary">{titleHighlight}</span>
							</>
						)}
					</motion.h1>

					{subtitle && (
						<motion.p
							className={cn(
								"mt-6 max-w-2xl text-lg text-white/80 sm:text-xl",
								align === "center" && "mx-auto",
							)}
							initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
						>
							{subtitle}
						</motion.p>
					)}

					<motion.div
						className={cn(
							"mt-10 flex flex-col gap-4 sm:flex-row",
							align === "center" ? "justify-center" : "justify-start",
						)}
						initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
					>
						{primaryCta && (
							<a href={primaryCta.href} className={cn(buttonVariants({ size: "lg" }), "gap-2")}>
								{primaryCta.label} <ArrowRight className="h-4 w-4" />
							</a>
						)}
						{secondaryCta && (
							<a
								href={secondaryCta.href}
								className={cn(
									buttonVariants({ size: "lg", variant: "outline" }),
									"border-white/50 text-white hover:bg-white/10",
								)}
							>
								{secondaryCta.label}
							</a>
						)}
					</motion.div>
				</div>
			</div>

			{/* 하단 스크롤 인디케이터 */}
			<motion.div
				className="absolute bottom-8 left-1/2 -translate-x-1/2"
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ delay: 0.8 }}
			>
				<motion.div
					className="flex h-10 w-6 items-start justify-center rounded-full border-2 border-white/50 p-1"
					animate={{ y: [0, 6, 0] }}
					transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5, ease: "easeInOut" }}
				>
					<div className="h-2 w-1 rounded-full bg-white/70" />
				</motion.div>
			</motion.div>
		</section>
	);
};
