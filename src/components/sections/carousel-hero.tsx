"use client";

import Autoplay from "embla-carousel-autoplay";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { buttonVariants } from "@/components/ui/button";
import {
	Carousel,
	type CarouselApi,
	CarouselContent,
	CarouselItem,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

type Slide = {
	image: string;
	alt: string;
	eyebrow?: string;
	title: string;
	subtitle?: string;
	cta?: { label: string; href: string };
	overlayOpacity?: "light" | "medium" | "dark";
};

// ★ 설정: 슬라이드 내용을 수정하세요
const slides: Slide[] = [
	{
		image: "/hero/slide-1.jpg", // /public/hero/slide-1.jpg
		alt: "슬라이드 1",
		eyebrow: "Welcome",
		title: "First Compelling Headline",
		subtitle: "A brief supporting description that explains your value proposition clearly.",
		cta: { label: "Get Started", href: "#contact" },
		overlayOpacity: "medium",
	},
	{
		image: "/hero/slide-2.jpg",
		alt: "슬라이드 2",
		eyebrow: "Our Service",
		title: "Second Amazing Feature",
		subtitle: "Another strong message that resonates with your target audience.",
		cta: { label: "Learn More", href: "#features" },
		overlayOpacity: "dark",
	},
	{
		image: "/hero/slide-3.jpg",
		alt: "슬라이드 3",
		title: "Third Powerful Statement",
		cta: { label: "Contact Us", href: "#contact" },
		overlayOpacity: "medium",
	},
];

const overlayClass = {
	light: "bg-black/30",
	medium: "bg-black/50",
	dark: "bg-black/70",
};

// ★ 설정: 자동 슬라이드 간격 (ms)
const AUTOPLAY_DELAY = 5000;

export const CarouselHero = () => {
	const [api, setApi] = useState<CarouselApi>();
	const [current, setCurrent] = useState(0);
	const plugin = useRef(Autoplay({ delay: AUTOPLAY_DELAY, stopOnInteraction: false }));

	useEffect(() => {
		if (!api) return;
		api.on("select", () => setCurrent(api.selectedScrollSnap()));
	}, [api]);

	const scrollTo = useCallback(
		(index: number) => {
			api?.scrollTo(index);
		},
		[api],
	);

	return (
		<section className="relative min-h-[90vh]">
			<Carousel setApi={setApi} plugins={[plugin.current]} opts={{ loop: true }} className="h-full">
				<CarouselContent className="-ml-0">
					{slides.map((slide, i) => (
						<CarouselItem key={slide.title} className="relative min-h-[90vh] pl-0">
							{/* 배경 이미지 */}
							<Image
								src={slide.image}
								alt={slide.alt}
								fill
								className="object-cover"
								priority={i === 0}
							/>

							{/* 오버레이 */}
							<div
								className={cn("absolute inset-0", overlayClass[slide.overlayOpacity ?? "medium"])}
							/>

							{/* 슬라이드 콘텐츠 */}
							<div className="relative z-10 flex min-h-[90vh] items-center justify-center px-4 sm:px-6 lg:px-8">
								<div className="mx-auto max-w-4xl text-center text-white">
									{slide.eyebrow && (
										<p className="mb-4 font-semibold text-sm text-white/70 uppercase tracking-widest">
											{slide.eyebrow}
										</p>
									)}
									<h1 className="font-bold text-4xl tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
										{slide.title}
									</h1>
									{slide.subtitle && (
										<p className="mx-auto mt-6 max-w-2xl text-lg text-white/80 sm:text-xl">
											{slide.subtitle}
										</p>
									)}
									{slide.cta && (
										<div className="mt-10">
											<a
												href={slide.cta.href}
												className={cn(buttonVariants({ size: "lg" }), "gap-2")}
											>
												{slide.cta.label} <ArrowRight className="h-4 w-4" />
											</a>
										</div>
									)}
								</div>
							</div>
						</CarouselItem>
					))}
				</CarouselContent>

				{/* 닷 인디케이터 */}
				<div className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 gap-2">
					{slides.map((slide, i) => (
						<button
							key={slide.title}
							type="button"
							onClick={() => scrollTo(i)}
							className={cn(
								"h-2 rounded-full transition-all duration-300",
								current === i ? "w-8 bg-white" : "w-2 bg-white/40 hover:bg-white/70",
							)}
							aria-label={`슬라이드 ${i + 1}`}
						/>
					))}
				</div>
			</Carousel>
		</section>
	);
};
