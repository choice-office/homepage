"use client";

import { useEffect } from "react";

const SELECTOR = "[data-reveal], [data-stagger]";
// 진입선 — CSS의 rootMargin 하단 -15%와 동일 기준(뷰포트 상단 85% 지점).
const REVEAL_RATIO = 0.85;
// 뒤로/앞으로 복원 창 — React 재마운트 + 스크롤 복원이 끝날 때까지 애니메이션을 끈다.
// 최소 시간(스크롤 복원 대기) · DOM 삽입이 멎은 뒤 여유 · 상한(데이터를 다시 받아오는 경우 대비).
const RESTORE_MIN_MS = 300;
const RESTORE_QUIET_MS = 150;
const RESTORE_MAX_MS = 2500;

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
 *
 * 뒤로/앞으로 이동(popstate): 앱 내부 이동은 DOM이 파괴되므로 돌아오면 카드가 다시
 * opacity 0에서 시작해 "이미 본 화면"이 최대 2.2초에 걸쳐 재등장한다(멈칫+깜빡임).
 * 그래서 popstate 직후 RESTORE_MS 동안 <html>.reveal-restore 로 트랜지션을 끄고,
 * 매 프레임 도달 검사를 돌려(스크롤 복원이 늦게 적용돼도) 화면에 든 요소를 즉시 노출한다.
 * 화면 밖 요소는 그대로 남겨 두어 이후 스크롤에서는 정상적으로 등장한다.
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
		// (복원 창 종료 시점 계산용으로 마지막 삽입 시각을 남긴다)
		let lastInsertAt = 0;
		const mo = new MutationObserver((mutations) => {
			for (const m of mutations) {
				for (const node of m.addedNodes) {
					if (!(node instanceof Element)) continue;
					lastInsertAt = performance.now();
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

		// 뒤로/앞으로 복원 — 애니메이션을 끈 채로 화면에 든 요소를 즉시 노출한다.
		// popstate는 React 재렌더보다 먼저 오므로, 새 DOM이 삽입될 때부터 트랜지션이 꺼져 있다.
		let restoreRaf = 0;
		const onPopState = () => {
			if (reduce) return;
			document.documentElement.classList.add("reveal-restore");
			const startedAt = performance.now();
			lastInsertAt = startedAt;
			const pump = () => {
				for (const el of [...pending]) revealIfReached(el);
				const now = performance.now();
				// 재마운트(DOM 삽입)가 멎고 여유 시간이 지나면 종료. 데이터를 다시 받아와
				// 삽입이 늦어지면 그만큼 기다리되 상한을 넘기지 않는다.
				const done =
					now - startedAt >= RESTORE_MIN_MS &&
					(now - lastInsertAt >= RESTORE_QUIET_MS || now - startedAt >= RESTORE_MAX_MS);
				if (!done) {
					restoreRaf = requestAnimationFrame(pump);
					return;
				}
				restoreRaf = 0;
				document.documentElement.classList.remove("reveal-restore");
			};
			cancelAnimationFrame(restoreRaf);
			restoreRaf = requestAnimationFrame(pump);
		};
		window.addEventListener("popstate", onPopState);

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
			cancelAnimationFrame(restoreRaf);
			document.documentElement.classList.remove("reveal-restore");
			io?.disconnect();
			mo.disconnect();
			window.removeEventListener("popstate", onPopState);
			window.removeEventListener("scroll", onScroll);
			window.removeEventListener("resize", onScroll);
		};
	}, []);

	return null;
};
