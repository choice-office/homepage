"use client";

import { motion, useAnimation, useReducedMotion } from "framer-motion";
import { useEffect, useRef } from "react";

type FadeInProps = {
	children: React.ReactNode;
	delay?: number;
	duration?: number;
	y?: number;
	className?: string;
};

export const FadeIn = ({ delay = 0, duration = 0.5, y = 20, className, children }: FadeInProps) => {
	const ref = useRef<HTMLDivElement>(null);
	const controls = useAnimation();
	const prefersReducedMotion = useReducedMotion();

	useEffect(() => {
		const element = ref.current;
		if (!element) return;

		// 모션 감소 설정 시 즉시 표시
		if (prefersReducedMotion) {
			controls.set({ opacity: 1, y: 0 });
			return;
		}

		// 마운트 시점에 이미 뷰포트 안(첫 화면)이면 그대로 유지 — 깜빡임/플래시 없음
		const rect = element.getBoundingClientRect();
		const alreadyInView = rect.top < window.innerHeight && rect.bottom > 0;
		if (alreadyInView) {
			controls.set({ opacity: 1, y: 0 });
			return;
		}

		// 뷰포트 밖(아래) 요소만 숨겼다가, 진입 시 한 번만 애니메이션
		controls.set({ opacity: 0, y });
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					controls.start({ opacity: 1, y: 0, transition: { delay, duration, ease: "easeOut" } });
					// 한 번 노출되면 더 이상 관찰하지 않음 → 스크롤 재진입 시 리셋(깜빡임) 방지
					observer.disconnect();
				}
			},
			{ threshold: 0.15 },
		);

		observer.observe(element);
		return () => observer.disconnect();
	}, [controls, delay, duration, y, prefersReducedMotion]);

	// SSR/no-JS: opacity 1 로 렌더 → 콘텐츠가 항상 보이고 LCP 안정.
	// 클라이언트 마운트 후, 뷰포트 밖 요소만 숨겼다가 진입 시 1회 페이드인.
	return (
		<motion.div ref={ref} initial={{ opacity: 1, y: 0 }} animate={controls} className={className}>
			{children}
		</motion.div>
	);
};
