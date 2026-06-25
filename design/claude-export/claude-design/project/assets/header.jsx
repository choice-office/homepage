/* 초이스 행정사 — 메가메뉴 헤더 */
const { Button: HBtn } = window.DesignSystem_9e363e;

const SVC_SHORT = {
	short: "단기초청",
	resident: "주재원·고위임원",
	e6: "연예인 비자",
	e7: "전문직 비자",
	f4: "재외동포·거소증",
	f5: "영주권",
	f6: "결혼비자",
	nat: "국적회복",
};

function megaChildren(item) {
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
		param: c.hash,
		code: null,
	}));
}

function Header({ route, scrolled, onMenuOpenChange }) {
	const [openLabel, setOpenLabel] = React.useState(null);
	const [drawer, setDrawer] = React.useState(false);
	const closeTimer = React.useRef(null);

	const anyOpen = !!openLabel;
	React.useEffect(() => {
		onMenuOpenChange?.(anyOpen);
	}, [anyOpen, onMenuOpenChange]);

	const transparent = route === "home" && !scrolled && !anyOpen;

	const enter = (label) => {
		clearTimeout(closeTimer.current);
		setOpenLabel(label);
	};
	const leave = () => {
		closeTimer.current = setTimeout(() => setOpenLabel(null), 120);
	};
	const [hovered, setHovered] = React.useState(null);

	const activeItem = NAV.find((n) => n.label === openLabel);
	const children = activeItem ? megaChildren(activeItem) : [];
	const hasMega = (item) => item.route === "services" || item.children?.length;

	const txt = transparent ? "rgba(255,255,255,0.92)" : "var(--text-body)";
	const logoColor = transparent ? "#fff" : "var(--text-heading)";

	return (
		<>
			<header
				onMouseLeave={leave}
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
					<a
						className="lk"
						onClick={() => {
							go("home");
							setOpenLabel(null);
						}}
						style={{ fontWeight: 700, fontSize: 20, letterSpacing: "-0.02em", color: logoColor }}
					>
						초이스 행정사 사무소
					</a>

					<nav className="nav-links" style={{ height: "100%" }}>
						{NAV.map((n) => {
							const childRoutes = hasMega(n) ? megaChildren(n).map((c) => c.route) : [];
							const active =
								route === n.route ||
								(n.route === "services" && route === "service") ||
								childRoutes.includes(route);
							return (
								<div
									key={n.label}
									onMouseEnter={() => {
										enter(hasMega(n) ? n.label : null);
										setHovered(n.label);
									}}
									onMouseLeave={() => setHovered(null)}
									style={{
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
										height: 80,
										width: 112,
									}}
								>
									<a
										className="lk"
										onClick={() => {
											go(n.route);
											setOpenLabel(null);
										}}
										style={{
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
									</a>
								</div>
							);
						})}
					</nav>

					<div style={{ display: "flex", alignItems: "center", gap: 10 }}>
						<a
							href="tel:0269599886"
							className="hide-mobile"
							style={{
								display: "inline-flex",
								alignItems: "center",
								gap: 7,
								fontWeight: 700,
								fontSize: 15,
								whiteSpace: "nowrap",
								color: transparent ? "#fff" : "var(--color-primary)",
							}}
						>
							<Icon n="phone" style={{ width: 15, height: 15 }} />
							02-6959-9886
						</a>
						<button
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
					onMouseEnter={() => clearTimeout(closeTimer.current)}
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
								<a
									key={c.label}
									className="lk mega-link"
									onClick={() => {
										go(c.route, c.param);
										setOpenLabel(null);
									}}
								>
									<span>{c.label}</span>
									{c.code && <span className="mega-code">{c.code}</span>}
								</a>
							))}
						</div>
					</div>
				</div>
			</header>

			{/* 모바일 드로어 */}
			<MobileDrawer open={drawer} onClose={() => setDrawer(false)} route={route} />
		</>
	);
}

function MobileDrawer({ open, onClose, route }) {
	const [exp, setExp] = React.useState(null);
	const nav = (r, p) => {
		go(r, p);
		onClose();
	};
	return (
		<div
			className={`drawer${open ? "open" : ""}`}
			style={{ pointerEvents: open ? "auto" : "none" }}
		>
			<div
				className="scrim"
				onClick={onClose}
				style={{ opacity: open ? 1 : 0, transition: "none" }}
			></div>
			<div
				className="panel"
				style={{ transform: open ? "translateX(0)" : "translateX(100%)", transition: "none" }}
			>
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
						const kids = n.route === "services" || n.children?.length ? megaChildren(n) : null;
						const isExp = exp === n.label;
						return (
							<div key={n.label} style={{ borderBottom: "1px solid var(--border-default)" }}>
								<div style={{ display: "flex", alignItems: "center" }}>
									<a
										className="lk"
										onClick={() => nav(n.route)}
										style={{
											flex: 1,
											padding: "14px 6px",
											fontSize: 16,
											fontWeight: 600,
											color: route === n.route ? "var(--color-primary)" : "var(--text-heading)",
										}}
									>
										{n.label}
									</a>
									{kids && (
										<button
											className="lk"
											onClick={() => setExp(isExp ? null : n.label)}
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
											<a
												key={c.label}
												className="lk"
												onClick={() => nav(c.route, c.param)}
												style={{
													padding: "10px 6px 10px 18px",
													fontSize: 14,
													color: "var(--text-body)",
												}}
											>
												{c.label}
											</a>
										))}
									</div>
								)}
							</div>
						);
					})}
				</nav>
				<HBtn
					variant="primary"
					size="lg"
					style={{ width: "100%", marginTop: 22 }}
					onClick={() => nav("contact")}
				>
					무료 상담 신청
				</HBtn>
				<a href="tel:0269599886">
					<HBtn
						variant="outline"
						size="lg"
						style={{ width: "100%", marginTop: 10 }}
						iconStart={<Icon n="phone" style={{ width: 16, height: 16 }} />}
					>
						02-6959-9886
					</HBtn>
				</a>
			</div>
		</div>
	);
}

Object.assign(window, { Header, MobileDrawer });
