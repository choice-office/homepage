"use client";

import { useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { FadeIn } from "@/components/common/fade-in";
import { buttonVariants } from "@/lib/button-variants";
import { cn } from "@/lib/utils";

type VideoHeroProps = {
	title: string;
	titleHighlight?: string;
	subtitle?: string;
	primaryCta?: { label: string; href: string };
	secondaryCta?: { label: string; href: string };
	videoSrc: string;
	poster?: string;
	overlayOpacity?: "light" | "medium" | "dark";
	align?: "left" | "center";
};

// ★ 설정: 비디오 src, 텍스트, CTA 버튼을 수정하세요
const defaultProps: VideoHeroProps = {
	title: "Your Compelling",
	titleHighlight: "Headline Here",
	subtitle:
		"A brief description of your product or service. Make it compelling and clear what value you provide.",
	primaryCta: { label: "Get Started", href: "#contact" },
	secondaryCta: { label: "Learn More", href: "#features" },
	videoSrc: "/video/hero.mp4", // /public/video/hero.mp4 에 영상 파일 배치
	poster: "/video/hero-poster.jpg", // 영상 로드 전 또는 모션 감소 설정 시 노출
	overlayOpacity: "medium",
	align: "center",
};

const overlayClass = {
	light: "bg-black/30",
	medium: "bg-black/50",
	dark: "bg-black/70",
};

export const VideoHero = (props: Partial<VideoHeroProps> = {}) => {
	const prefersReducedMotion = useReducedMotion();
	const {
		title,
		titleHighlight,
		subtitle,
		primaryCta,
		secondaryCta,
		videoSrc,
		poster,
		overlayOpacity,
		align,
	} = {
		...defaultProps,
		...props,
	};

	return (
		<section className="relative flex min-h-[90vh] items-center overflow-hidden">
			{/* 배경 비디오 — 모션 감소 설정 시 autoPlay 비활성화 */}
			<video
				className="absolute inset-0 h-full w-full object-cover"
				src={videoSrc}
				poster={poster}
				autoPlay={!prefersReducedMotion}
				muted
				loop
				playsInline
			/>

			{/* 오버레이 */}
			<div className={cn("absolute inset-0", overlayClass[overlayOpacity ?? "medium"])} />

			{/* 콘텐츠 */}
			<div
				className={cn(
					"relative z-10 mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8",
					align === "center" ? "text-center" : "text-left",
				)}
			>
				<FadeIn>
					<h1 className="font-bold text-4xl text-white tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
						{title}
						{titleHighlight && (
							<>
								{" "}
								<span className="text-primary">{titleHighlight}</span>
							</>
						)}
					</h1>
				</FadeIn>

				{subtitle && (
					<FadeIn delay={0.1}>
						<p
							className={cn(
								"mt-6 max-w-2xl text-lg text-white/80 sm:text-xl",
								align === "center" && "mx-auto",
							)}
						>
							{subtitle}
						</p>
					</FadeIn>
				)}

				<FadeIn delay={0.2}>
					<div
						className={cn(
							"mt-10 flex flex-col gap-4 sm:flex-row",
							align === "center" ? "justify-center" : "justify-start",
						)}
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
					</div>
				</FadeIn>
			</div>

			{/* 하단 스크롤 인디케이터 */}
			<div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
				<div className="flex h-10 w-6 items-start justify-center rounded-full border-2 border-white/50 p-1">
					<div className="h-2 w-1 rounded-full bg-white/70" />
				</div>
			</div>
		</section>
	);
};
