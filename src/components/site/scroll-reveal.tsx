"use client";

import { useEffect } from "react";

const SELECTOR = "[data-reveal], [data-stagger]";
// 진입선 — CSS의 rootMargin 하단 -15%와 동일 기준(뷰포트 상단 85% 지점).
const REVEAL_RATIO = 0.85;

/**
 * 스크롤 진입 시 [data-reveal] / [data-stagger] 요소를 부드럽게 등장시킨다.
 * - <html>.reveal-ready 부착 후에만 CSS 초기 숨김이 적용됨(JS 미작동 시 콘텐츠 항상 표시).
 * - prefers-reduced-motion 사용자는 즉시 노출.
 * - 라우트 전환으로 새로 마운트되는 DOM은 MutationObserver가 자동 관찰.
 * - 트리거: 요소가 뷰포트 안쪽(하단 -15%)까지 들어왔을 때 재생.
 * - reveal-once: 한 번 등장하면 관찰 해제(위로 스크롤 시 역재생 방지).
 *
 * 빠른(관성) 스크롤 대응: IntersectionObserver는 프레임 단위로 교차를 샘플링하므로,
 * 한 프레임 사이에 요소가 뷰포트를 통째로 건너뛰면 isIntersecting이 false→false가 되어
 * 콜백이 아예 호출되지 않는다(=카드가 내려간 채 고정되는 버그). 이를 막기 위해
 * ① 스캔 시점에 이미 진입선에 도달한 요소는 즉시 노출하고,
 * ② scroll/resize 안전망(rAF 스로틀)으로 IO가 놓친 요소를 도달 즉시 노출한다.
 * 모두 노출되면 안전망 리스너를 해제해 상시 비용을 없앤다.
 *
 * 하이드레이션 안전: 초기 숨김 클래스만 즉시 부여하고, 관찰/클래스 부여는
 * requestAnimationFrame으로 한 프레임 미뤄 모든 세그먼트 하이드레이션 이후 실행한다.
 */
export const ScrollReveal = () => {
	useEffect(() => {
		// 초기 숨김은 즉시 적용(첫 프레임 깜빡임 방지). is-visible 부여는 아래에서 지연.
		document.documentElement.classList.add("reveal-ready");
		const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

		const pending = new Set<Element>();

		const reveal = (el: Element) => {
			el.classList.add("is-visible");
			pending.delete(el);
			io?.unobserve(el);
		};

		// 요소의 상단이 진입선(뷰포트 85%) 위로 올라왔으면 = 화면에 들어왔거나 이미 지나침 → 노출.
		const revealIfReached = (el: Element) => {
			if (el.getBoundingClientRect().top <= window.innerHeight * REVEAL_RATIO) reveal(el);
		};

		const io = reduce
			? null
			: new IntersectionObserver(
					(entries) => {
						for (const e of entries) if (e.isIntersecting) reveal(e.target);
					},
					{ rootMargin: "0px 0px -15% 0px", threshold: 0 },
				);

		const observe = (el: Element) => {
			if (el.classList.contains("is-visible")) return;
			if (reduce) {
				el.classList.add("is-visible");
				return;
			}
			pending.add(el);
			io?.observe(el);
			revealIfReached(el); // 스캔 시점에 이미 도달한 요소(로드 직후 스크롤됨) 즉시 처리
		};
		const scan = (scope: ParentNode) => {
			for (const el of scope.querySelectorAll(SELECTOR)) observe(el);
		};

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

		// scroll/resize 안전망 — IO가 건너뛴 요소를 도달 즉시 노출. 모두 노출되면 스스로 해제.
		let ticking = false;
		const sweep = () => {
			ticking = false;
			for (const el of [...pending]) revealIfReached(el);
			if (pending.size === 0) {
				window.removeEventListener("scroll", onScroll);
				window.removeEventListener("resize", onScroll);
			}
		};
		const onScroll = () => {
			if (ticking) return;
			ticking = true;
			requestAnimationFrame(sweep);
		};

		// 하이드레이션 완료 후(다음 프레임)에 관찰 시작 → className 불일치 방지
		const raf = requestAnimationFrame(() => {
			scan(document);
			mo.observe(document.body, { childList: true, subtree: true });
			if (!reduce) {
				window.addEventListener("scroll", onScroll, { passive: true });
				window.addEventListener("resize", onScroll, { passive: true });
			}
		});

		return () => {
			cancelAnimationFrame(raf);
			io?.disconnect();
			mo.disconnect();
			window.removeEventListener("scroll", onScroll);
			window.removeEventListener("resize", onScroll);
		};
	}, []);

	return null;
};
