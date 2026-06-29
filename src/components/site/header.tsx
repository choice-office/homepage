"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { CONTACT, NAV, type NavItem, SERVICES } from "@/lib/site-data";
import { cn } from "@/lib/utils";
import { Button } from "./ds";
import { Icon } from "./icon";
import { pathToRoute, useGo, usePrefetch } from "./use-go";

const SVC_SHORT: Record<string, string> = {
	short: "단기초청",
	resident: "주재원·고위임원",
	e6: "연예인 비자",
	e7: "전문직 비자",
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
	const [drawer, setDrawer] = useState(false);
	const [openMega, setOpenMega] = useState<string | null>(null);
	const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

	useEffect(() => {
		const on = () => setScrolled(window.scrollY > 24);
		window.addEventListener("scroll", on, { passive: true });
		on();
		return () => window.removeEventListener("scroll", on);
	}, []);

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

	const atTop = route === "home" && !scrolled;

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
					<button type="button" className="lk site-logo" onClick={() => go("home")}>
						초이스 행정사 사무소
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
										{activeChildren.map((c) => (
											<button
												key={c.label}
												type="button"
												className="lk mega-link"
												onClick={(e) => navigate(c.route, c.param, e.currentTarget)}
												onMouseEnter={() => prefetch(c.route, c.param)}
											>
												<span>{c.label}</span>
												{c.code && <span className="mega-code">{c.code}</span>}
											</button>
										))}
									</div>
								</div>
							)}
						</div>
					</nav>

					<div className="site-header-actions">
						<div className="header-desktop-actions">
							<a className="lk header-phone" href={CONTACT.phone.href}>
								<Icon n="phone" style={{ width: 16, height: 16 }} />
								<span>{CONTACT.phone.display}</span>
							</a>
							<Button variant="primary" size="sm" onClick={() => go("contact")}>
								무료 상담
							</Button>
						</div>
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
	const [exp, setExp] = useState<string | null>(null);
	const nav = (r: string, p?: string) => {
		go(r, p);
		onClose();
	};
	return (
		<div className={cn("drawer", open && "open")} style={{ pointerEvents: open ? "auto" : "none" }}>
			<button type="button" className="scrim" aria-label="메뉴 닫기" onClick={onClose} />
			<div className="panel">
				<div
					style={{
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
						marginBottom: 20,
					}}
				>
					<span style={{ fontWeight: 700, fontSize: 17 }}>초이스 행정사</span>
					<button
						type="button"
						className="lk"
						onClick={onClose}
						aria-label="닫기"
						style={{ background: "none", border: "none", padding: 6 }}
					>
						<Icon n="x" style={{ width: 24, height: 24 }} />
					</button>
				</div>
				<nav style={{ display: "flex", flexDirection: "column" }}>
					{NAV.map((n) => {
						const kids = hasDropdown(n) ? dropChildren(n) : null;
						const isExp = exp === n.label;
						return (
							<div key={n.label} style={{ borderBottom: "1px solid var(--border-default)" }}>
								<div style={{ display: "flex", alignItems: "center" }}>
									<button
										type="button"
										className="lk"
										onClick={() => nav(n.route)}
										style={{
											flex: 1,
											textAlign: "left",
											background: "none",
											border: "none",
											padding: "14px 6px",
											fontSize: 16,
											fontWeight: 600,
											color: route === n.route ? "var(--color-primary)" : "var(--text-heading)",
										}}
									>
										{n.label}
									</button>
									{kids && (
										<button
											type="button"
											className="lk"
											onClick={() => setExp(isExp ? null : n.label)}
											aria-label="하위 메뉴"
											style={{ background: "none", border: "none", padding: 10 }}
										>
											<Icon
												n={isExp ? "chevron-up" : "chevron-down"}
												style={{ width: 18, height: 18, color: "var(--text-muted)" }}
											/>
										</button>
									)}
								</div>
								{kids && isExp && (
									<div style={{ display: "flex", flexDirection: "column", paddingBottom: 8 }}>
										{kids.map((c) => (
											<button
												key={c.label}
												type="button"
												className="lk"
												onClick={() => nav(c.route, c.param)}
												style={{
													textAlign: "left",
													background: "none",
													border: "none",
													padding: "10px 6px 10px 18px",
													fontSize: 14,
													color: "var(--text-body)",
												}}
											>
												{c.label}
											</button>
										))}
									</div>
								)}
							</div>
						);
					})}
				</nav>
				<Button
					variant="primary"
					size="lg"
					style={{ width: "100%", marginTop: 22 }}
					onClick={() => nav("contact")}
				>
					무료 상담 신청
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
	);
}
