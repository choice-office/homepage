"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import Image from "next/image";
import { useRef, useState } from "react";
import { FadeIn } from "@/components/common/fade-in";
import { cn } from "@/lib/utils";

// ─────────────────────────────────────────────────────────────
// StickyScrollReveal — 섹션이 화면에 고정된 상태에서 스크롤로 내용이 전환
//
// 교체할 것:
// 1. SECTION_TITLE, SECTION_SUBTITLE — 섹션 상단 텍스트
// 2. steps 배열 — eyebrow, title, description, image 경로
// 3. 이미지 경로: /public/sticky/ 폴더에 배치 (1200×900 권장)
// ─────────────────────────────────────────────────────────────

type StickyStep = {
	eyebrow: string;
	title: string;
	description: string;
	image: string;
	alt?: string;
};

// ★ 설정
const SECTION_TITLE = "우리의 공간";
const SECTION_SUBTITLE = "각 공간은 저마다의 이야기를 담고 있습니다";

const steps: StickyStep[] = [
	{
		eyebrow: "01",
		title: "P.S. 푸른",
		description: "자연을 담은 프리미엄 풀빌라. 아침 햇살이 물 위에 일렁이는 특별한 공간입니다.",
		image: "/sticky/room-1.jpg",
		alt: "P.S. 푸른 룸",
	},
	{
		eyebrow: "02",
		title: "P.S. 우리",
		description: "두 사람을 위한 프라이빗 풀빌라. 오롯이 당신들만의 시간을 선사합니다.",
		image: "/sticky/room-2.jpg",
		alt: "P.S. 우리 룸",
	},
	{
		eyebrow: "03",
		title: "P.S. 추억",
		description: "가족과 함께하는 넓은 공간. 소중한 추억을 만들어갈 최적의 장소입니다.",
		image: "/sticky/room-3.jpg",
		alt: "P.S. 추억 룸",
	},
];

export const StickyScrollReveal = () => {
	const containerRef = useRef<HTMLDivElement>(null);
	const [activeIndex, setActiveIndex] = useState(0);

	const { scrollYProgress } = useScroll({
		target: containerRef,
		offset: ["start start", "end end"],
	});

	useMotionValueEvent(scrollYProgress, "change", (latest) => {
		const idx = Math.min(Math.floor(latest * steps.length), steps.length - 1);
		setActiveIndex(idx);
	});

	return (
		<section id="about">
			{/* 섹션 헤더 */}
			<FadeIn className="px-4 py-16 text-center sm:px-6 lg:px-8">
				<p className="font-medium text-primary text-sm uppercase tracking-widest">
					{SECTION_SUBTITLE}
				</p>
				<h2 className="mt-3 font-bold text-3xl tracking-tight sm:text-4xl">{SECTION_TITLE}</h2>
			</FadeIn>

			{/* 모바일: 일반 스택 레이아웃 */}
			<div className="space-y-8 px-4 pb-16 sm:px-6 md:hidden">
				{steps.map((step, i) => (
					<FadeIn key={step.eyebrow} delay={i * 0.05}>
						<div className="overflow-hidden rounded-2xl bg-muted/30">
							<div className="relative aspect-video w-full">
								<Image
									src={step.image}
									alt={step.alt ?? step.title}
									fill
									className="object-cover"
								/>
							</div>
							<div className="p-6">
								<span className="font-mono text-primary text-sm">{step.eyebrow}</span>
								<h3 className="mt-2 font-bold text-xl">{step.title}</h3>
								<p className="mt-3 text-muted-foreground leading-relaxed">{step.description}</p>
							</div>
						</div>
					</FadeIn>
				))}
			</div>

			{/* 데스크탑: sticky 스크롤 레이아웃 */}
			<div
				ref={containerRef}
				className="hidden md:block"
				style={{ height: `${steps.length * 100}vh` }}
			>
				<div className="sticky top-0 h-screen overflow-hidden">
					<div className="grid h-full grid-cols-2">
						{/* 왼쪽: 텍스트 + 진행 인디케이터 */}
						<div className="flex flex-col justify-center px-12 lg:px-20">
							{/* 진행 바 */}
							<div className="mb-10 flex gap-2">
								{steps.map((step, i) => (
									<div
										key={step.eyebrow}
										className={cn(
											"h-0.5 flex-1 rounded-full transition-all duration-500",
											i <= activeIndex ? "bg-primary" : "bg-border",
										)}
									/>
								))}
							</div>

							<AnimatePresence mode="wait">
								<motion.div
									key={activeIndex}
									initial={{ opacity: 0, y: 24 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: -24 }}
									transition={{ duration: 0.4, ease: "easeOut" }}
								>
									<span className="font-mono text-primary text-sm tracking-widest">
										{steps[activeIndex].eyebrow}
									</span>
									<h3 className="mt-4 font-bold text-3xl tracking-tight lg:text-4xl">
										{steps[activeIndex].title}
									</h3>
									<p className="mt-6 max-w-md text-lg text-muted-foreground leading-relaxed">
										{steps[activeIndex].description}
									</p>
								</motion.div>
							</AnimatePresence>
						</div>

						{/* 오른쪽: 이미지 크로스페이드 */}
						<div className="relative overflow-hidden">
							<AnimatePresence mode="wait">
								<motion.div
									key={activeIndex}
									className="absolute inset-0"
									initial={{ opacity: 0, scale: 1.04 }}
									animate={{ opacity: 1, scale: 1 }}
									exit={{ opacity: 0, scale: 0.97 }}
									transition={{ duration: 0.5, ease: "easeOut" }}
								>
									<Image
										src={steps[activeIndex].image}
										alt={steps[activeIndex].alt ?? steps[activeIndex].title}
										fill
										className="object-cover"
									/>
								</motion.div>
							</AnimatePresence>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};
