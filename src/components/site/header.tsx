"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { CONTACT, NAV, type NavItem, routePath, SERVICES } from "@/lib/site-data";
import { cn } from "@/lib/utils";
import { Button } from "./ds";
import { Icon } from "./icon";
import { lockBodyScroll, smoothScrollTo, unlockBodyScroll } from "./smooth-scroll";
import { pathToRoute, useGo, usePrefetch } from "./use-go";

const SVC_SHORT: Record<string, string> = {
	short: "단기초청",
	resident: "주재원·고위임원",
	e6: "연예인 비자",
	e7: "외국인 취업비자",
	f4: "재외동포·거소증",
	f5: "영주권",
	f6: "결혼비자",
	nat: "국적회복",
};

type DropChild = { label: string; route: string; param?: string; code?: string | null };

function dropChildren(item: NavItem): DropChild[] {
	if (item.route === "services") {
		return SERVICES.map((s) => ({
			label: SVC_SHORT[s.id] || s.title,
			route: "service",
			param: s.id,
			code: s.id === "nat" ? null : s.code,
		}));
	}
	return (item.children || []).map((c) => ({
		label: c.label,
		route: c.route,
		param: undefined,
		code: null,
	}));
}

const hasDropdown = (item: NavItem) => item.route === "services" || !!item.children?.length;

export const SiteHeader = () => {
	const go = useGo();
	const prefetch = usePrefetch();
	const pathname = usePathname();
	const route = pathToRoute(pathname);
	const [scrolled, setScrolled] = useState(false);
	// 홈은 항상 히어로가 있으므로 초기값 true(첫 페인트 깜빡임 방지). 그 외는 감지로 결정.
	const [hasDarkHero, setHasDarkHero] = useState(route === "home");
	const [drawer, setDrawer] = useState(false);
	const [openMega, setOpenMega] = useState<string | null>(null);
	const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

	useEffect(() => {
		const on = () => setScrolled(window.scrollY > 24);
		window.addEventListener("scroll", on, { passive: true });
		on();
		return () => window.removeEventListener("scroll", on);
	}, []);

	// 페이지 최상단에 어두운 히어로(홈 히어로/PageHero)가 있으면 투명 헤더 사용.
	// 밝은 배경으로 시작하는 페이지(블로그 상세·약관 등)는 솔리드 유지.
	// async 서버컴포넌트(블로그 목록 등)는 히어로가 스트리밍으로 늦게 도착하므로 MutationObserver로 재감지.
	// biome-ignore lint/correctness/useExhaustiveDependencies: 경로 변경 시 히어로 재감지 목적
	useEffect(() => {
		const detect = () => setHasDarkHero(!!document.querySelector("[data-hero-dark]"));
		detect();
		const mo = new MutationObserver(detect);
		mo.observe(document.body, { childList: true, subtree: true });
		return () => mo.disconnect();
	}, [pathname]);

	// Esc 로 닫기
	useEffect(() => {
		const onKey = (e: KeyboardEvent) => {
			if (e.key === "Escape") {
				setOpenMega(null);
				(document.activeElement as HTMLElement | null)?.blur();
			}
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, []);

	useEffect(
		() => () => {
			if (closeTimer.current) clearTimeout(closeTimer.current);
		},
		[],
	);

	const atTop = hasDarkHero && !scrolled;

	const clearCloseTimer = () => {
		if (closeTimer.current) {
			clearTimeout(closeTimer.current);
			closeTimer.current = null;
		}
	};
	// 항목 hover/focus: 하위가 있으면 열고, 없으면 닫는다.
	const open = (item: NavItem) => {
		clearCloseTimer();
		setOpenMega(hasDropdown(item) ? item.label : null);
	};
	// 영역을 완전히 벗어나면 ~180ms 뒤 닫기(빈 공간 통과/대각선 이동 중 스쳐 닫힘 방지)
	const scheduleClose = () => {
		clearCloseTimer();
		closeTimer.current = setTimeout(() => setOpenMega(null), 180);
	};
	// 클릭: 이동 + 닫기 + 포커스 박스 제거
	const navigate = (r: string, p: string | undefined, el: HTMLElement | null) => {
		clearCloseTimer();
		go(r, p);
		setOpenMega(null);
		el?.blur();
	};

	const activeNav = openMega ? (NAV.find((n) => n.label === openMega) ?? null) : null;
	const activeChildren = activeNav ? dropChildren(activeNav) : [];

	return (
		<>
			<header className={cn("site-header", atTop && "at-top", openMega && "mega-open")}>
				<div className="site-header-bar container">
					<button
						type="button"
						className="lk site-logo"
						onClick={() => {
							// 홈에 있으면 최상단으로 스무스 스크롤, 다른 페이지면 홈으로 이동
							if (route === "home") smoothScrollTo(0);
							else go("home");
						}}
						aria-label="초이스 행정사 사무소 홈"
					>
						{/* 솔리드(흰 배경)용 원본 — 금색 나비 + 짙은 글자 */}
						<Image
							src="/brand/logo.png"
							alt="초이스 행정사 사무소"
							width={531}
							height={127}
							priority
							className="site-logo-img site-logo-light"
						/>
						{/* 투명 히어로(어두운 배경)용 — 금색 나비 유지 + 글자만 밝게 */}
						<Image
							src="/brand/logo-dark.png"
							alt=""
							aria-hidden="true"
							width={531}
							height={127}
							priority
							className="site-logo-img site-logo-dark"
						/>
					</button>

					<nav
						className="nav-links"
						aria-label="메인 메뉴"
						onMouseEnter={clearCloseTimer}
						onMouseLeave={scheduleClose}
					>
						{NAV.map((n) => {
							const drop = hasDropdown(n);
							const childRoutes = drop ? dropChildren(n).map((c) => c.route) : [];
							const active =
								route === n.route ||
								(n.route === "services" && route === "service") ||
								childRoutes.includes(route);
							const panelId = `nav-dd-${n.route}`;
							return (
								<div className={cn("nav-item", drop && "has-dropdown")} key={n.label}>
									<button
										type="button"
										className={cn("lk nav-link", active && "is-active")}
										aria-haspopup={drop ? "true" : undefined}
										aria-controls={drop ? panelId : undefined}
										aria-expanded={drop ? openMega === n.label : undefined}
										aria-current={active ? "page" : undefined}
										onClick={(e) => navigate(n.route, undefined, e.currentTarget)}
										onMouseEnter={() => {
											open(n);
											prefetch(n.route);
										}}
										onFocus={() => open(n)}
									>
										{n.label}
									</button>
								</div>
							);
						})}

						{/* 풀폭 슬라이드다운 시트 — nav 자손이라 패널 hover 시에도 nav의 mouseleave가 안 뜸.
						    활성 메뉴의 하위만 노출. 내용은 eyebrow + 4열 그리드(이전 디자인). */}
						<div
							className={cn("mega-panel", openMega && "is-open")}
							id={activeNav ? `nav-dd-${activeNav.route}` : undefined}
						>
							{activeNav && (
								<div className="mega-inner container">
									<div className="mega-eyebrow">{activeNav.label}</div>
									<div className="mega-row">
										{activeChildren.map((c) => {
											const isActive = routePath(c.route, c.param) === pathname;
											return (
												<button
													key={c.label}
													type="button"
													className={cn("lk mega-link", isActive && "is-active")}
													aria-current={isActive ? "page" : undefined}
													onClick={(e) => navigate(c.route, c.param, e.currentTarget)}
													onMouseEnter={() => prefetch(c.route, c.param)}
												>
													<span>{c.label}</span>
													{c.code && <span className="mega-code">{c.code}</span>}
												</button>
											);
										})}
									</div>
								</div>
							)}
						</div>
					</nav>

					<div className="site-header-actions">
						<button
							type="button"
							className="menu-toggle lk site-burger"
							onClick={() => setDrawer(true)}
							aria-label="메뉴 열기"
						>
							<Icon n="menu" style={{ width: 26, height: 26 }} />
						</button>
					</div>
				</div>
			</header>

			<MobileDrawer open={drawer} onClose={() => setDrawer(false)} route={route} />
		</>
	);
};

function MobileDrawer({
	open,
	onClose,
	route,
}: {
	open: boolean;
	onClose: () => void;
	route: string;
}) {
	const go = useGo();
	const pathname = usePathname();
	// 현재 페이지가 속한 드롭다운 그룹 라벨(없으면 null)
	const currentGroup =
		NAV.find((n) =>
			(hasDropdown(n) ? dropChildren(n) : []).some((c) => routePath(c.route, c.param) === pathname),
		)?.label ?? null;
	// 초기값 = 현재 페이지 그룹 → 드로어를 처음 열 때부터 이미 펼쳐진 상태로 보인다.
	const [exp, setExp] = useState<string | null>(currentGroup);
	// 드로어가 닫혀 있을 때(open=false)만 현재 그룹으로 되돌린다. 열려 있는 동안엔 사용자의 수동
	// 펼침을 유지하고, 닫히면 초기화 → 다음에 열면 이미 현재 그룹이 펼쳐진 상태라 "다른 그룹이
	// 닫히며 열리는" 깜빡임이 보이지 않는다.
	useEffect(() => {
		if (open) return;
		setExp(currentGroup);
	}, [open, currentGroup]);
	// 드로어 열림 동안 배경(본문) 스크롤 잠금 — Lenis 정지 + body 고정(모바일 터치까지 차단).
	// 스크롤은 드로어 패널(.panel, overflow-y:auto) 내부에서만.
	useEffect(() => {
		if (!open) return;
		lockBodyScroll();
		return () => unlockBodyScroll();
	}, [open]);
	const nav = (r: string, p?: string) => {
		go(r, p);
		onClose();
	};
	return (
		<div className={cn("drawer", open && "open")} style={{ pointerEvents: open ? "auto" : "none" }}>
			<button type="button" className="scrim" aria-label="메뉴 닫기" onClick={onClose} />
			{/* data-lenis-prevent: Lenis가 stop된 동안에도 이 컨테이너 내부는 네이티브 스크롤 허용
			    (없으면 lenis.stop()이 터치/휠 이벤트를 preventDefault해서 패널 스크롤이 막힘) */}
			<div className="panel" data-lenis-prevent>
				<div className="drawer-head">
					<Image
						className="drawer-head-logo"
						src="/brand/logo.png"
						alt="초이스 행정사 사무소"
						width={531}
						height={127}
					/>
					<button type="button" className="drawer-close lk" onClick={onClose} aria-label="닫기">
						<Icon n="x" style={{ width: 20, height: 20 }} />
					</button>
				</div>
				<nav className="flex flex-col">
					{NAV.map((n) => {
						const kids = hasDropdown(n) ? dropChildren(n) : null;
						const isExp = exp === n.label;
						// 하위(상세) 탭이 현재 페이지와 일치하면 그 하위에 표시하고, 부모 전체는 강조하지 않는다.
						const subMatch = !!kids?.some((c) => routePath(c.route, c.param) === pathname);
						return (
							<div
								key={n.label}
								className="drawer-item"
								data-active={route === n.route && !subMatch ? "true" : undefined}
							>
								<div className="flex items-center">
									<button type="button" className="drawer-link lk" onClick={() => nav(n.route)}>
										{n.label}
									</button>
									{kids && (
										<button
											type="button"
											className="drawer-chev lk"
											data-open={isExp ? "true" : undefined}
											onClick={() => setExp(isExp ? null : n.label)}
											aria-label="하위 메뉴"
											aria-expanded={isExp}
										>
											<Icon n="chevron-down" style={{ width: 18, height: 18 }} />
										</button>
									)}
								</div>
								{kids && (
									<div className="drawer-sub" data-open={isExp ? "true" : undefined}>
										<div className="drawer-sub-inner">
											{kids.map((c) => (
												<button
													key={c.label}
													type="button"
													className="drawer-sublink lk"
													data-active={
														routePath(c.route, c.param) === pathname ? "true" : undefined
													}
													onClick={() => nav(c.route, c.param)}
												>
													{c.label}
												</button>
											))}
										</div>
									</div>
								)}
							</div>
						);
					})}
				</nav>
				<div className="drawer-cta">
					<Button
						variant="primary"
						size="lg"
						style={{ width: "100%" }}
						onClick={() => nav("contact")}
					>
						상담 신청
					</Button>
					<Button
						href={CONTACT.phone.href}
						variant="outline"
						size="lg"
						style={{ width: "100%", marginTop: 10 }}
						iconStart={<Icon n="phone" style={{ width: 16, height: 16 }} />}
					>
						{CONTACT.phone.display}
					</Button>
				</div>
			</div>
		</div>
	);
}
