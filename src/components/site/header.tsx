"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { NAV, type NavItem, SERVICES } from "@/lib/site-data";
import { cn } from "@/lib/utils";
import { Button } from "./ds";
import { Icon } from "./icon";
import { pathToRoute, useGo } from "./use-go";

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

type MegaChild = { label: string; route: string; param?: string; code?: string | null };

function megaChildren(item: NavItem): MegaChild[] {
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

const hasMega = (item: NavItem) => item.route === "services" || !!item.children?.length;

export const SiteHeader = () => {
	const go = useGo();
	const pathname = usePathname();
	const route = pathToRoute(pathname);
	const [scrolled, setScrolled] = useState(false);
	const [drawer, setDrawer] = useState(false);

	useEffect(() => {
		const on = () => setScrolled(window.scrollY > 24);
		window.addEventListener("scroll", on, { passive: true });
		on();
		return () => window.removeEventListener("scroll", on);
	}, []);

	const atTop = route === "home" && !scrolled;

	return (
		<>
			<header className={cn("site-header", atTop && "at-top")}>
				<div className="site-header-bar container">
					<button type="button" className="lk site-logo" onClick={() => go("home")}>
						초이스 행정사 사무소
					</button>

					<nav className="nav-links" aria-label="메인 메뉴">
						{NAV.map((n) => {
							const mega = hasMega(n);
							const childRoutes = mega ? megaChildren(n).map((c) => c.route) : [];
							const active =
								route === n.route ||
								(n.route === "services" && route === "service") ||
								childRoutes.includes(route);
							return (
								<div className={cn("nav-item", mega && "has-mega")} key={n.label}>
									<button
										type="button"
										className={cn("lk nav-link", active && "is-active")}
										aria-haspopup={mega || undefined}
										onClick={() => go(n.route)}
									>
										{n.label}
									</button>
									{mega && (
										<div className="mega-panel">
											<div className="mega-inner container">
												<div className="mega-eyebrow">{n.label}</div>
												<div className="mega-row">
													{megaChildren(n).map((c) => (
														<button
															key={c.label}
															type="button"
															className="lk mega-link"
															onClick={() => go(c.route, c.param)}
														>
															<span>{c.label}</span>
															{c.code && <span className="mega-code">{c.code}</span>}
														</button>
													))}
												</div>
											</div>
										</div>
									)}
								</div>
							);
						})}
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
						const kids = hasMega(n) ? megaChildren(n) : null;
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
					href="tel:0269599886"
					variant="outline"
					size="lg"
					style={{ width: "100%", marginTop: 10 }}
					iconStart={<Icon n="phone" style={{ width: 16, height: 16 }} />}
				>
					02-6959-9886
				</Button>
			</div>
		</div>
	);
}
