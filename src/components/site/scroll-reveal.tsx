"use client";

import { useEffect } from "react";

const SELECTOR = "[data-reveal], [data-stagger]";

/**
 * 스크롤 진입 시 [data-reveal] / [data-stagger] 요소를 부드럽게 등장시킨다.
 * - <html>.reveal-ready 부착 후에만 CSS 초기 숨김이 적용됨(JS 미작동 시 콘텐츠 항상 표시).
 * - prefers-reduced-motion 사용자는 즉시 노출.
 * - 라우트 전환으로 새로 마운트되는 DOM은 MutationObserver가 자동 관찰.
 */
export const ScrollReveal = () => {
	useEffect(() => {
		document.documentElement.classList.add("reveal-ready");
		const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

		const reveal = (el: Element) => el.classList.add("is-visible");

		const io = reduce
			? null
			: new IntersectionObserver(
					(entries) => {
						for (const e of entries) {
							if (e.isIntersecting) {
								reveal(e.target);
								io?.unobserve(e.target);
							}
						}
					},
					{ rootMargin: "0px 0px -12% 0px", threshold: 0.12 },
				);

		const observe = (el: Element) => {
			if (el.classList.contains("is-visible")) return;
			if (io) io.observe(el);
			else reveal(el);
		};

		const scan = (scope: ParentNode) => {
			for (const el of scope.querySelectorAll(SELECTOR)) observe(el);
		};
		scan(document);

		// 라우트 전환 등으로 새로 추가되는 reveal 대상 자동 관찰
		const mo = new MutationObserver((mutations) => {
			for (const m of mutations) {
				for (const node of m.addedNodes) {
					if (!(node instanceof Element)) continue;
					if (node.matches(SELECTOR)) observe(node);
					scan(node);
				}
			}
		});
		mo.observe(document.body, { childList: true, subtree: true });

		return () => {
			io?.disconnect();
			mo.disconnect();
		};
	}, []);

	return null;
};
