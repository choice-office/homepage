"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { NAV, type NavItem, SERVICES } from "@/lib/site-data";
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
	const [openLabel, setOpenLabel] = useState<string | null>(null);
	const [drawer, setDrawer] = useState(false);
	const [hovered, setHovered] = useState<string | null>(null);
	const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

	useEffect(() => {
		const on = () => setScrolled(window.scrollY > 24);
		window.addEventListener("scroll", on, { passive: true });
		on();
		return () => window.removeEventListener("scroll", on);
	}, []);

	const anyOpen = !!openLabel;
	const transparent = route === "home" && !scrolled && !anyOpen;
	const cancel = () => {
		if (closeTimer.current) clearTimeout(closeTimer.current);
	};
	const enter = (label: string | null) => {
		cancel();
		setOpenLabel(label);
	};
	const leave = () => {
		closeTimer.current = setTimeout(() => setOpenLabel(null), 120);
	};

	const activeItem = NAV.find((n) => n.label === openLabel);
	const children = activeItem ? megaChildren(activeItem) : [];
	const txt = transparent ? "rgba(255,255,255,0.92)" : "var(--text-body)";
	const logoColor = transparent ? "#fff" : "var(--text-heading)";

	return (
		<>
			<header
				style={{
					position: "fixed",
					top: 0,
					left: 0,
					right: 0,
					zIndex: 100,
					backgroundColor: transparent ? "rgba(255,255,255,0)" : "rgba(255,255,255,0.97)",
					borderBottom: transparent ? "1px solid transparent" : "1px solid var(--border-default)",
					boxShadow: transparent ? "none" : "var(--shadow-sm)",
					backdropFilter: transparent ? "none" : "blur(8px)",
					transition: "box-shadow .3s ease, border-color .3s ease",
				}}
			>
				<div
					className="container"
					style={{
						height: 80,
						display: "flex",
						alignItems: "center",
						justifyContent: "space-between",
					}}
				>
					<button
						type="button"
						className="lk"
						onClick={() => {
							go("home");
							setOpenLabel(null);
						}}
						style={{
							background: "none",
							border: "none",
							padding: 0,
							fontWeight: 700,
							fontSize: 20,
							letterSpacing: "-0.02em",
							color: logoColor,
						}}
					>
						초이스 행정사 사무소
					</button>

					<nav className="nav-links" aria-label="메인 메뉴" style={{ height: "100%" }}>
						{NAV.map((n) => {
							const childRoutes = hasMega(n) ? megaChildren(n).map((c) => c.route) : [];
							const active =
								route === n.route ||
								(n.route === "services" && route === "service") ||
								childRoutes.includes(route);
							return (
								<div
									key={n.label}
									style={{
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
										height: 80,
										width: 112,
									}}
								>
									<button
										type="button"
										className="lk"
										onMouseEnter={() => {
											enter(hasMega(n) ? n.label : null);
											setHovered(n.label);
										}}
										onMouseLeave={() => {
											setHovered(null);
											leave();
										}}
										onClick={() => {
											go(n.route);
											setOpenLabel(null);
										}}
										style={{
											background: "none",
											border: "none",
											display: "flex",
											alignItems: "center",
											justifyContent: "center",
											width: "100%",
											height: "100%",
											fontSize: 15,
											fontWeight: active ? 700 : 500,
											transition: "color .15s ease",
											color: active
												? transparent
													? "#fff"
													: "var(--color-primary)"
												: hovered === n.label
													? transparent
														? "#fff"
														: "var(--color-primary-dark)"
													: txt,
										}}
									>
										{n.label}
									</button>
								</div>
							);
						})}
					</nav>

					<div style={{ display: "flex", alignItems: "center", gap: 10 }}>
						<button
							type="button"
							className="menu-toggle lk"
							onClick={() => setDrawer(true)}
							aria-label="메뉴 열기"
							style={{
								background: "none",
								border: "none",
								padding: 8,
								color: transparent ? "#fff" : "var(--text-heading)",
							}}
						>
							<Icon n="menu" style={{ width: 26, height: 26 }} />
						</button>
					</div>
				</div>

				{/* 메가메뉴 패널 */}
				<div
					style={{
						overflow: "hidden",
						background: "rgba(255,255,255,0.99)",
						borderTop: anyOpen ? "1px solid var(--border-default)" : "1px solid transparent",
						maxHeight: anyOpen ? 320 : 0,
						transition: "max-height .32s ease",
						boxShadow: anyOpen ? "var(--shadow-md)" : "none",
					}}
				>
					<div className="container" style={{ padding: anyOpen ? "28px 24px 32px" : "0 24px" }}>
						<div
							style={{
								fontSize: 13,
								fontWeight: 700,
								letterSpacing: ".1em",
								textTransform: "uppercase",
								color: "var(--color-accent)",
								marginBottom: 18,
							}}
						>
							{openLabel}
						</div>
						<div className="mega-row">
							{children.map((c) => (
								<button
									key={c.label}
									type="button"
									className="lk mega-link"
									onMouseEnter={cancel}
									onMouseLeave={leave}
									onClick={() => {
										go(c.route, c.param);
										setOpenLabel(null);
									}}
									style={{ background: "none", border: "none", textAlign: "left" }}
								>
									<span>{c.label}</span>
									{c.code && <span className="mega-code">{c.code}</span>}
								</button>
							))}
						</div>
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
		<div
			className={`drawer${open ? "open" : ""}`}
			style={{ pointerEvents: open ? "auto" : "none" }}
		>
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
