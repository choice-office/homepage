"use client";

import Autoplay from "embla-carousel-autoplay";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { FadeIn } from "@/components/common/fade-in";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@/components/ui/carousel";
import { buttonVariants } from "@/lib/button-variants";
import { cn } from "@/lib/utils";

// ★ 설정 — 이미지 경로(public/ 기준), 헤드라인, 서브텍스트를 수정하세요
// 이미지는 1920×1080 권장 / delay: 슬라이드 자동 전환 간격 (ms)
const PRIMARY_CTA = { label: "Get Started", href: "#contact" };
const SECONDARY_CTA = { label: "Learn More", href: "#features" };

const slides = [
	{
		image: "/carousel-1.jpg",
		headline: "Your First Headline",
		subtext: "A brief description for the first slide.",
	},
	{
		image: "/carousel-2.jpg",
		headline: "Your Second Headline",
		subtext: "A brief description for the second slide.",
	},
	{
		image: "/carousel-3.jpg",
		headline: "Your Third Headline",
		subtext: "A brief description for the third slide.",
	},
];

const AUTOPLAY_DELAY = 4000;

export const HeroCarousel = () => {
	return (
		<section className="relative min-h-[80vh]">
			<Carousel
				className="h-full w-full"
				opts={{ loop: true }}
				plugins={[Autoplay({ delay: AUTOPLAY_DELAY, stopOnInteraction: false })]}
			>
				<CarouselContent className="-ml-0">
					{slides.map((slide, i) => (
						<CarouselItem key={slide.headline} className="relative min-h-[80vh] pl-0">
							{/* 배경 이미지 */}
							<Image
								src={slide.image}
								alt={slide.headline}
								fill
								className="object-cover"
								priority={i === 0}
							/>

							{/* 어두운 오버레이 */}
							<div className="absolute inset-0 bg-black/50" />

							{/* 콘텐츠 */}
							<div className="absolute inset-0 flex items-center justify-center px-4 sm:px-6 lg:px-8">
								<div className="mx-auto max-w-4xl text-center text-white">
									<FadeIn>
										<h1 className="font-bold text-4xl tracking-tight sm:text-5xl md:text-6xl">
											{slide.headline}
										</h1>
									</FadeIn>

									<FadeIn delay={0.1}>
										<p className="mx-auto mt-6 max-w-2xl text-lg text-white/80">{slide.subtext}</p>
									</FadeIn>

									<FadeIn delay={0.2}>
										<div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
											<a
												href={PRIMARY_CTA.href}
												className={cn(buttonVariants({ size: "lg" }), "gap-2")}
											>
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
							</div>
						</CarouselItem>
					))}
				</CarouselContent>

				{/* 이전/다음 버튼 — 모바일에서는 숨김 */}
				<div className="hidden sm:block">
					<CarouselPrevious className="left-4" />
					<CarouselNext className="right-4" />
				</div>
			</Carousel>
		</section>
	);
};
