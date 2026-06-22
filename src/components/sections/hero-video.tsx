"use client";

import { useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { FadeIn } from "@/components/common/fade-in";
import { buttonVariants } from "@/lib/button-variants";
import { cn } from "@/lib/utils";

// ★ 설정 — 영상 경로, 헤드라인, 서브텍스트, 버튼 텍스트/링크를 수정하세요
// VIDEO_SRC: public/ 폴더에 넣은 영상 경로 (mp4 권장, 10MB 이하)
// POSTER_SRC: 영상 로드 전 또는 모션 감소 설정 시 보여줄 이미지 (권장)
const VIDEO_SRC = "/hero-video.mp4";
const POSTER_SRC = ""; // 예: "/hero-poster.jpg"
const HEADLINE = "Your Amazing";
const HEADLINE_HIGHLIGHT = " Headline Here";
const SUBTITLE =
	"A brief description of your product or service. Make it compelling and clear what value you provide to your customers.";
const PRIMARY_CTA = { label: "Get Started", href: "#contact" };
const SECONDARY_CTA = { label: "Learn More", href: "#features" };

export const HeroVideo = () => {
	const prefersReducedMotion = useReducedMotion();

	return (
		<section className="relative flex min-h-[80vh] items-center justify-center overflow-hidden">
			{/* 배경 영상 — 모션 감소 설정 시 autoPlay 비활성화 */}
			<video
				autoPlay={!prefersReducedMotion}
				muted
				loop
				playsInline
				poster={POSTER_SRC || undefined}
				className="absolute inset-0 h-full w-full object-cover"
				src={VIDEO_SRC}
			/>

			{/* 어두운 오버레이 — 텍스트 가독성 확보 */}
			<div className="absolute inset-0 bg-black/60" />

			{/* 콘텐츠 */}
			<div className="relative z-10 mx-auto max-w-4xl px-4 text-center text-white sm:px-6 lg:px-8">
				<FadeIn>
					<h1 className="font-bold text-4xl tracking-tight sm:text-5xl md:text-6xl">
						{HEADLINE}
						<span className="text-primary">{HEADLINE_HIGHLIGHT}</span>
					</h1>
				</FadeIn>

				<FadeIn delay={0.1}>
					<p className="mx-auto mt-6 max-w-2xl text-lg text-white/80">{SUBTITLE}</p>
				</FadeIn>

				<FadeIn delay={0.2}>
					<div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
						<a href={PRIMARY_CTA.href} className={cn(buttonVariants({ size: "lg" }), "gap-2")}>
							{PRIMARY_CTA.label} <ArrowRight className="h-4 w-4" />
						</a>
						<a
							href={SECONDARY_CTA.href}
							className={cn(
								buttonVariants({ size: "lg", variant: "outline" }),
								"border-white/50 text-white hover:bg-white/10",
							)}
						>
							{SECONDARY_CTA.label}
						</a>
					</div>
				</FadeIn>
			</div>
		</section>
	);
};
