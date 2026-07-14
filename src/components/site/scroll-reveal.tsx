"use client";

import { useEffect } from "react";

const SELECTOR = "[data-reveal], [data-stagger]";

/**
 * 스크롤 진입 시 [data-reveal] / [data-stagger] 요소를 부드럽게 등장시킨다.
 * - <html>.reveal-ready 부착 후에만 CSS 초기 숨김이 적용됨(JS 미작동 시 콘텐츠 항상 표시).
 * - prefers-reduced-motion 사용자는 즉시 노출.
 * - 라우트 전환으로 새로 마운트되는 DOM은 MutationObserver가 자동 관찰.
 * - 트리거: 요소가 뷰포트 안쪽(하단 -15%)까지 들어왔을 때 재생 → 스크롤로 들어오는 순간
 *   슬라이드/페이드가 눈에 보인다(화면 밖에서 미리 끝나 버리지 않음).
 * - threshold 0: 큰 블록도 화면에 걸치기만 하면 등장 → 첫 로드에 비어 보이는 문제 방지.
 * - reveal-once: 한 번 등장하면 관찰을 해제해, 위로 스크롤할 때 깜빡이거나 역재생되지 않게 한다.
 *
 * 하이드레이션 안전: App Router는 레이아웃과 페이지 세그먼트를 각각 하이드레이션한다.
 * 레이아웃에 있는 이 effect가 페이지보다 먼저 실행되어 is-visible를 붙이면, 뒤늦게
 * 하이드레이션되는 페이지의 className과 불일치가 난다. 그래서 초기 숨김 클래스만 즉시
 * 부여하고, 관찰/클래스 부여는 requestAnimationFrame으로 한 프레임 미뤄 모든 세그먼트
 * 하이드레이션 이후에 실행한다.
 */
export const ScrollReveal = () => {
	useEffect(() => {
		// 초기 숨김은 즉시 적용(첫 프레임 깜빡임 방지). is-visible 부여는 아래에서 지연.
		document.documentElement.classList.add("reveal-ready");
		const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

		const io = reduce
			? null
			: new IntersectionObserver(
					(entries, observer) => {
						for (const e of entries) {
							if (!e.isIntersecting) continue;
							e.target.classList.add("is-visible");
							observer.unobserve(e.target); // 한 번만 재생
						}
					},
					{ rootMargin: "0px 0px -15% 0px", threshold: 0 },
				);

		const observe = (el: Element) => {
			if (io) io.observe(el);
			else el.classList.add("is-visible");
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

		// 하이드레이션 완료 후(다음 프레임)에 관찰 시작 → className 불일치 방지
		const raf = requestAnimationFrame(() => {
			scan(document);
			mo.observe(document.body, { childList: true, subtree: true });
		});

		return () => {
			cancelAnimationFrame(raf);
			io?.disconnect();
			mo.disconnect();
		};
	}, []);

	return null;
};
