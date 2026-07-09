"use client";

import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

/**
 * Lenis 기반 스무스 스크롤(관성 보간).
 * - 데스크탑 휠만 부드럽게 보간, 모바일 터치는 네이티브 유지(Lenis 기본값) → 모바일 이질감 방지.
 * - prefers-reduced-motion 사용자는 초기화하지 않음(네이티브 스크롤).
 * - 라우트 전환 시 내부 위치를 최상단으로 즉시 리셋(디자인의 "이동=최상단" 동작과 일치).
 */
let lenisInstance: Lenis | null = null;

/** TOP 버튼 등 부드러운 스크롤이 필요한 곳에서 사용. Lenis 미가동 시 네이티브로 폴백. */
export const smoothScrollTo = (target: number, opts?: { immediate?: boolean }) => {
	if (lenisInstance) {
		lenisInstance.scrollTo(target, { immediate: opts?.immediate });
		return;
	}
	window.scrollTo({ top: target, behavior: opts?.immediate ? "auto" : "smooth" });
};

export const SmoothScroll = () => {
	const pathname = usePathname();
	const isFirstRef = useRef(true);

	useEffect(() => {
		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

		const lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
		lenisInstance = lenis;

		let rafId = 0;
		const loop = (time: number) => {
			lenis.raf(time);
			rafId = requestAnimationFrame(loop);
		};
		rafId = requestAnimationFrame(loop);

		return () => {
			cancelAnimationFrame(rafId);
			lenis.destroy();
			lenisInstance = null;
		};
	}, []);

	// biome-ignore lint/correctness/useExhaustiveDependencies: pathname은 값을 쓰지 않고 라우트 전환 감지 트리거로만 사용
	useEffect(() => {
		if (isFirstRef.current) {
			isFirstRef.current = false;
			return;
		}
		lenisInstance?.scrollTo(0, { immediate: true });
	}, [pathname]);

	return null;
};
