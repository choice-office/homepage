"use client";

import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

/**
 * 스크롤 담당 — Lenis 관성 보간 + 이동 시 스크롤 위치 정책.
 *
 * 정책(웹 표준과 동일)
 * - 링크로 이동(push) → 최상단. 디자인의 "이동=최상단" 동작.
 * - 뒤로/앞으로(pop) → 떠날 때 보던 위치로 복원. Next.js <Link> 문서도 기본 동작을
 *   "maintain scroll position, similar to how browsers handle back and forwards navigation"로 규정한다.
 *
 * 복원을 브라우저에 맡기지 않고 직접 한다(`history.scrollRestoration = "manual"`).
 * Lenis는 자기 좌표계(animatedScroll)를 문서 scrollTop 으로 써 내려가므로, 브라우저가 복원한 위치와
 * 내부값이 어긋나면 첫 휠 입력에서 화면이 위로 튄다. 둘이 동시에 스크롤을 쓰면 서로를 덮어써서
 * 위치가 엉키기까지 한다(실측: 1400px 에서 떠났는데 240px, 첫 휠에 0 기준으로 이동).
 * 그래서 위치를 URL 별로 기록해 두고, pop 이면 우리가 한 번에 적용한다 — React Router·TanStack Router의
 * <ScrollRestoration> 과 같은 방식.
 *
 * - prefers-reduced-motion 사용자는 Lenis를 만들지 않고 네이티브 스크롤 + 같은 복원 정책만 적용.
 */

let lenisInstance: Lenis | null = null;

// popstate 직후 이 시간 안의 라우트 변경만 pop 으로 간주(해시 이동 등으로 플래그가 남는 것 방지).
const POP_GRACE_MS = 1000;
// 복원 적용 창 — 콘텐츠(문서 높이)가 아직 짧아 목표까지 못 가는 프레임을 넘기기 위한 재시도.
const APPLY_DEADLINE_MS = 600;
// 클릭 후 기록을 멈추는 시간. 이동이 아니었다면 이 시간 뒤 자동 해제된다.
const FREEZE_MS = 1500;
const STORAGE_KEY = "choice:scroll-positions";

/** 히스토리 항목별 스크롤 위치. 새로고침·외부 이동 후에도 남도록 sessionStorage 에 미러링한다. */
const positions = new Map<string, number>();
const urlKey = () => window.location.pathname + window.location.search;

const loadPositions = () => {
	try {
		const raw = sessionStorage.getItem(STORAGE_KEY);
		if (!raw) return;
		for (const [k, v] of Object.entries(JSON.parse(raw) as Record<string, number>)) {
			positions.set(k, v);
		}
	} catch {
		// 프라이빗 모드 등에서 sessionStorage 가 막혀 있으면 메모리만 사용
	}
};
const savePositions = () => {
	try {
		sessionStorage.setItem(STORAGE_KEY, JSON.stringify(Object.fromEntries(positions)));
	} catch {}
};

/** TOP 버튼 등 부드러운 스크롤이 필요한 곳에서 사용. Lenis 미가동 시 네이티브로 폴백. */
export const smoothScrollTo = (target: number, opts?: { immediate?: boolean }) => {
	if (lenisInstance) {
		lenisInstance.scrollTo(target, { immediate: opts?.immediate });
		return;
	}
	window.scrollTo({ top: target, behavior: opts?.immediate ? "auto" : "smooth" });
};

// 모바일 드로어/모달 열림 동안 배경 스크롤 잠금.
// Lenis(휠 관성) 정지 + html/body overflow:hidden 으로 루트 스크롤 차단(스크롤 위치 보존 → 복원 불필요).
// 단, stop 상태의 Lenis는 wheel/touch 를 preventDefault 하므로, 내부 스크롤이 필요한 요소(드로어 패널)에는
// data-lenis-prevent 를 붙여야 네이티브 스크롤이 살아난다(+ overscroll-behavior:contain 으로 배경 체이닝 차단).
export const lockBodyScroll = () => {
	lenisInstance?.stop();
	document.documentElement.style.overflow = "hidden";
	document.body.style.overflow = "hidden";
};
export const unlockBodyScroll = () => {
	document.documentElement.style.overflow = "";
	document.body.style.overflow = "";
	lenisInstance?.start();
};

export const SmoothScroll = () => {
	const pathname = usePathname();
	const isFirstRef = useRef(true);
	const popAtRef = useRef(0);
	// 마운트 effect 안에서 만든 적용 함수를 라우트 effect에서도 쓴다.
	const applyRef = useRef<((target: number) => void) | null>(null);

	useEffect(() => {
		const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		const prevRestoration = history.scrollRestoration;
		history.scrollRestoration = "manual";
		loadPositions();

		let rafId = 0;
		let lenis: Lenis | null = null;
		if (!reduce) {
			// stopInertiaOnNavigate: 내부 링크 클릭 시 남은 관성을 끊는다(Lenis 공식 옵션).
			// 관성이 살아 있는 채로 이동하면 새 페이지가 엉뚱한 위치에서 시작한다.
			lenis = new Lenis({ lerp: 0.13, smoothWheel: true, stopInertiaOnNavigate: true });
			lenisInstance = lenis;
			const loop = (time: number) => {
				lenis?.raf(time);
				rafId = requestAnimationFrame(loop);
			};
			rafId = requestAnimationFrame(loop);
		}

		// ── 현재 위치 기록 ────────────────────────────────────────────────────
		// 어느 URL 의 위치인지는 currentKey 로 명시해서 관리한다. location 을 스크롤 시점에 읽으면 안 된다:
		// 링크를 누르면 URL 이 바뀌기 전(실측 51ms, URL 변경은 101ms)에 새 페이지가 붙으면서 문서가 짧아져
		// 브라우저가 스크롤을 최대값으로 깎고(1500 → 240) 그 값이 이전 URL 의 위치로 저장돼 버린다.
		// 그래서 ① 클릭 순간 위치를 확정 저장하고 ② 전환 동안에는 기록을 멈춘다.
		let currentKey = urlKey();
		let isApplying = false;
		let isFrozen = false;
		let freezeTimer = 0;
		let recordRaf = 0;
		const onScroll = () => {
			if (recordRaf || isApplying || isFrozen) return;
			recordRaf = requestAnimationFrame(() => {
				recordRaf = 0;
				if (isApplying || isFrozen) return;
				// 우리가 모르는 사이 URL 이 바뀐 경우(예: ?page= 만 바뀌는 이동) 자연히 따라간다.
				if (urlKey() !== currentKey) currentKey = urlKey();
				positions.set(currentKey, Math.round(window.scrollY));
			});
		};
		window.addEventListener("scroll", onScroll, { passive: true });

		// 클릭(=이동 가능성) 순간의 위치를 확정하고, 전환이 끝날 때까지 기록을 멈춘다.
		const onClickCapture = () => {
			positions.set(currentKey, Math.round(window.scrollY));
			isFrozen = true;
			clearTimeout(freezeTimer);
			freezeTimer = window.setTimeout(() => {
				isFrozen = false;
			}, FREEZE_MS);
		};
		document.addEventListener("click", onClickCapture, { capture: true });

		// ── 위치 적용 ─────────────────────────────────────────────────────────
		// 문서가 아직 짧아 목표까지 못 가는 경우가 있어(전환 직후) 도달·안정될 때까지 프레임마다 재시도한다.
		// 사용자가 먼저 스크롤하면 즉시 중단해 입력을 방해하지 않는다.
		let applyRaf = 0;
		let stopInput: (() => void) | null = null;
		const applyScroll = (target: number) => {
			cancelAnimationFrame(applyRaf);
			stopInput?.();
			isApplying = true;
			currentKey = urlKey(); // 이 시점의 URL 이 앞으로 기록될 대상
			const until = performance.now() + APPLY_DEADLINE_MS;
			const finish = () => {
				cancelAnimationFrame(applyRaf);
				applyRaf = 0;
				stopInput?.();
				stopInput = null;
				isApplying = false;
				isFrozen = false;
				clearTimeout(freezeTimer);
				positions.set(currentKey, Math.round(window.scrollY));
			};
			// 사용자 입력이 오면 복원을 포기한다(뒤로 누른 직후 바로 스크롤하는 경우).
			const onInput = () => finish();
			for (const type of ["wheel", "touchstart", "keydown"] as const) {
				window.addEventListener(type, onInput, { passive: true, once: true });
			}
			stopInput = () => {
				for (const type of ["wheel", "touchstart", "keydown"] as const) {
					window.removeEventListener(type, onInput);
				}
			};
			// 새 콘텐츠가 붙기 전(문서가 짧을 때)에 한 번만 맞추면 브라우저가 뒤이어 값을 깎는다.
			// 그래서 창이 끝날 때까지 계속 확인한다 — 이미 목표에 있으면 쓰기는 no-op 이라 비용이 없다.
			let lastHeight = 0;
			const step = () => {
				if (lenis) {
					// 문서 높이가 바뀐 프레임에만 갱신(상세 12469 → 목록 2468). 매 프레임 resize 는 레이아웃 비용.
					const h = document.documentElement.scrollHeight;
					if (h !== lastHeight) {
						lastHeight = h;
						lenis.resize();
					}
					lenis.scrollTo(target, { immediate: true, force: true });
				} else {
					window.scrollTo({ top: target, behavior: "instant" });
				}
				if (performance.now() >= until) {
					finish();
					return;
				}
				applyRaf = requestAnimationFrame(step);
			};
			step();
		};
		applyRef.current = applyScroll;

		// ── 뒤로/앞으로 ───────────────────────────────────────────────────────
		// popstate 시점에 목표를 먼저 읽는다(전환 중 스크롤 이벤트가 저장값을 건드리기 전에).
		const onPopState = () => {
			popAtRef.current = performance.now();
			applyScroll(positions.get(urlKey()) ?? 0);
		};
		window.addEventListener("popstate", onPopState);
		// 새로고침·외부 이동으로 문서가 떠날 때: 현재 위치를 확정하고 저장(돌아오면 그 위치부터).
		const onPageHide = () => {
			if (!isApplying) positions.set(currentKey, Math.round(window.scrollY));
			savePositions();
		};
		window.addEventListener("pagehide", onPageHide);

		return () => {
			cancelAnimationFrame(rafId);
			cancelAnimationFrame(recordRaf);
			cancelAnimationFrame(applyRaf);
			clearTimeout(freezeTimer);
			stopInput?.();
			window.removeEventListener("scroll", onScroll);
			document.removeEventListener("click", onClickCapture, { capture: true });
			window.removeEventListener("popstate", onPopState);
			window.removeEventListener("pagehide", onPageHide);
			savePositions();
			history.scrollRestoration = prevRestoration;
			applyRef.current = null;
			lenis?.destroy();
			lenisInstance = null;
		};
	}, []);

	// biome-ignore lint/correctness/useExhaustiveDependencies: pathname은 값을 쓰지 않고 라우트 전환 감지 트리거로만 사용
	useEffect(() => {
		if (isFirstRef.current) {
			isFirstRef.current = false;
			return;
		}
		// pop 은 popstate 핸들러가 이미 복원했다. 플래그는 한 번 쓰고 지워 다음 링크 이동에 새지 않게 한다.
		if (performance.now() - popAtRef.current < POP_GRACE_MS) {
			popAtRef.current = 0;
			return;
		}
		applyRef.current?.(0);
	}, [pathname]);

	return null;
};
