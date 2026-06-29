"use client";

import { useEffect } from "react";

const SELECTOR = "[data-reveal], [data-stagger]";

/**
 * 스크롤 진입 시 [data-reveal] / [data-stagger] 요소를 부드럽게 등장시킨다.
 * - <html>.reveal-ready 부착 후에만 CSS 초기 숨김이 적용됨(JS 미작동 시 콘텐츠 항상 표시).
 * - prefers-reduced-motion 사용자는 즉시 노출.
 * - 라우트 전환으로 새로 마운트되는 DOM은 MutationObserver가 자동 관찰.
 * - 재진입 시 재생: 화면을 벗어나면 즉시(트랜지션 없이) 초기 상태로 되돌리고,
 *   다시 진입할 때 등장 애니메이션을 재생한다. 위로 스크롤할 때 역재생되지 않도록
 *   리셋은 .reveal-instant 로 트랜지션을 끈 채 적용한다.
 */
export const ScrollReveal = () => {
	useEffect(() => {
		document.documentElement.classList.add("reveal-ready");
		const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

		const io = reduce
			? null
			: new IntersectionObserver(
					(entries) => {
						for (const e of entries) {
							const el = e.target as HTMLElement;
							if (e.isIntersecting) {
								el.classList.add("is-visible");
							} else if (el.classList.contains("is-visible")) {
								// 화면 밖으로 나가면 트랜지션 없이 즉시 초기 상태로 리셋
								// → 다시 아래로 스크롤해 진입할 때 등장 애니메이션이 재생된다.
								el.classList.add("reveal-instant");
								el.classList.remove("is-visible");
								void el.offsetWidth; // reflow 강제 → 리셋을 트랜지션 없이 확정
								el.classList.remove("reveal-instant");
							}
						}
					},
					{ rootMargin: "0px 0px -12% 0px", threshold: 0.12 },
				);

		const observe = (el: Element) => {
			if (io) io.observe(el);
			else el.classList.add("is-visible");
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
