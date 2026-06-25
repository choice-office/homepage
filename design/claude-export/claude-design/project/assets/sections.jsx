/* 초이스 행정사 — 공용 섹션 / 빌딩 블록 */
const DS = window.DesignSystem_9e363e;
const { Button, Badge, Card, CardTitle, CardBody, Label, Input, Select, Textarea } = DS;

const go = (route, param) => window.__go?.(route, param);
const Icon = ({ n, style }) => <i data-lucide={n} style={style}></i>;
const refreshIcons = () => {
	if (window.lucide) window.lucide.createIcons({ attrs: { "stroke-width": 1.75 } });
};

function SectionHead({ eyebrow, title, sub, align = "center", light = false }) {
	return (
		<div
			style={{
				textAlign: align,
				maxWidth: align === "center" ? "660px" : "none",
				margin: align === "center" ? "0 auto" : 0,
			}}
		>
			<span
				style={{
					fontSize: 13,
					fontWeight: 700,
					letterSpacing: ".12em",
					textTransform: "uppercase",
					color: light ? "var(--color-accent-soft)" : "var(--color-accent)",
				}}
			>
				{eyebrow}
			</span>
			<h2
				style={{
					fontSize: "clamp(28px, 4vw, 36px)",
					marginTop: 14,
					color: light ? "#fff" : "var(--text-heading)",
				}}
			>
				{title}
			</h2>
			{sub && (
				<p
					style={{
						fontSize: 17,
						color: light ? "rgba(255,255,255,.78)" : "var(--text-muted)",
						marginTop: 14,
						lineHeight: 1.7,
					}}
				>
					{sub}
				</p>
			)}
		</div>
	);
}

/* 페이지 상단 히어로 배너 (홈 외 모든 페이지 공통) — 도심 사진 + 토프 오버레이 + breadcrumb */
function PageHero({ eyebrow, title, sub, crumbs }) {
	return (
		<section
			style={{
				position: "relative",
				overflow: "hidden",
				padding: "152px 0 68px",
				background: "#241d16",
			}}
		>
			<img
				src={HERO_IMG}
				alt=""
				style={{
					position: "absolute",
					inset: 0,
					width: "100%",
					height: "100%",
					objectFit: "cover",
					opacity: 0.32,
				}}
			/>
			<div
				style={{
					position: "absolute",
					inset: 0,
					background:
						"linear-gradient(120deg, rgba(82,70,54,0.94) 0%, rgba(82,70,54,0.82) 45%, rgba(36,29,22,0.68) 100%)",
				}}
			/>
			<div className="container" style={{ position: "relative", zIndex: 2 }}>
				{crumbs && (
					<nav
						style={{
							display: "flex",
							alignItems: "center",
							gap: 8,
							flexWrap: "wrap",
							marginBottom: 18,
							fontSize: 14,
							color: "rgba(255,255,255,0.75)",
						}}
					>
						{crumbs.map((c, i) => (
							<React.Fragment key={i}>
								{i > 0 && (
									<Icon n="chevron-right" style={{ width: 14, height: 14, opacity: 0.6 }} />
								)}
								{c.route ? (
									<a
										className="lk"
										onClick={() => go(c.route, c.param)}
										style={{
											color: "rgba(255,255,255,0.8)",
											display: "inline-flex",
											alignItems: "center",
											gap: 5,
										}}
									>
										{i === 0 && <Icon n="home" style={{ width: 14, height: 14 }} />}
										{c.label}
									</a>
								) : (
									<span style={{ color: "#fff", fontWeight: 500 }}>{c.label}</span>
								)}
							</React.Fragment>
						))}
					</nav>
				)}
				{eyebrow && (
					<span
						style={{
							fontSize: 13,
							fontWeight: 700,
							letterSpacing: ".12em",
							textTransform: "uppercase",
							color: "var(--color-accent-soft)",
						}}
					>
						{eyebrow}
					</span>
				)}
				<h1 style={{ fontSize: "clamp(32px,5vw,46px)", marginTop: 12, color: "#fff" }}>{title}</h1>
				{sub && (
					<p
						style={{
							fontSize: 18,
							color: "rgba(255,255,255,.85)",
							marginTop: 16,
							maxWidth: 720,
							lineHeight: 1.7,
						}}
					>
						{sub}
					</p>
				)}
			</div>
		</section>
	);
}

/* 페이지 내 섹션 제목 (배너 아래 본문용) */
function PageSectionTitle({ title, sub }) {
	return (
		<div style={{ marginBottom: 40 }}>
			<h2 style={{ fontSize: "clamp(24px,3.4vw,32px)" }}>{title}</h2>
			<span
				style={{
					display: "block",
					width: 48,
					height: 3,
					background: "var(--color-accent)",
					borderRadius: 2,
					margin: "18px 0 0",
				}}
			/>
			{sub && (
				<p
					style={{
						fontSize: 17,
						color: "var(--text-muted)",
						marginTop: 18,
						lineHeight: 1.7,
						maxWidth: 720,
					}}
				>
					{sub}
				</p>
			)}
		</div>
	);
}

/* ── Hero (홈) ── */
function Hero({ overlay }) {
	overlay = overlay != null ? overlay : window.__heroOverlay != null ? window.__heroOverlay : 0.86;
	return (
		<section
			style={{
				position: "relative",
				minHeight: "100vh",
				display: "flex",
				alignItems: "center",
				overflow: "hidden",
				background: "#1a1612",
			}}
		>
			<img
				src={HERO_IMG}
				alt=""
				style={{
					position: "absolute",
					inset: 0,
					width: "100%",
					height: "100%",
					objectFit: "cover",
				}}
			/>
			<div
				style={{
					position: "absolute",
					inset: 0,
					background: `linear-gradient(90deg, rgba(20,16,13,${overlay}) 0%, rgba(20,16,13,${overlay * 0.72}) 42%, rgba(20,16,13,0.18) 78%, rgba(20,16,13,0.05) 100%)`,
				}}
			/>
			<div
				className="container"
				style={{ position: "relative", zIndex: 2, width: "100%", paddingTop: 80 }}
			>
				<div style={{ maxWidth: 640, color: "#fff" }}>
					<span
						style={{
							display: "inline-flex",
							alignItems: "center",
							gap: 12,
							color: "var(--color-accent-soft)",
							fontSize: 15,
							fontWeight: 500,
							letterSpacing: ".02em",
						}}
					>
						<span style={{ height: 1, width: 32, background: "var(--color-accent-soft)" }} />
						출입국 · 비자 전문 행정사 사무소
					</span>
					<h1
						style={{
							marginTop: 24,
							fontSize: "clamp(38px, 6vw, 60px)",
							lineHeight: 1.18,
							color: "#fff",
						}}
					>
						복잡한 출입국 절차,
						<br />
						<span style={{ color: "var(--color-accent-soft)" }}>혼자 고민하지 마세요</span>
					</h1>
					<p
						style={{
							marginTop: 24,
							fontSize: "clamp(17px, 2.4vw, 20px)",
							lineHeight: 1.7,
							color: "rgba(255,255,255,0.86)",
						}}
					>
						거소증 · 영주권 · 결혼비자 · 국적회복까지,
						<br />
						시험 출신 행정사가 상담부터 접수까지 직접 책임집니다.
					</p>
					<div style={{ display: "flex", gap: 12, marginTop: 40, flexWrap: "wrap" }}>
						<Button
							variant="primary"
							size="lg"
							onClick={() => go("contact")}
							iconEnd={<Icon n="arrow-right" style={{ width: 18, height: 18 }} />}
						>
							무료 상담 신청
						</Button>
						<Button
							size="lg"
							onClick={() => go("services")}
							style={{
								background: "rgba(255,255,255,0.12)",
								color: "#fff",
								border: "1px solid rgba(255,255,255,0.32)",
							}}
						>
							업무분야 보기
						</Button>
					</div>
					<p style={{ marginTop: 32, fontSize: 14, color: "rgba(255,255,255,0.72)" }}>
						사무장 없는 사무소 · 법무부 등록 출입국민원 대행기관 · 한국어 · English 상담
					</p>
				</div>
			</div>
			<div
				className="hide-mobile"
				style={{
					position: "absolute",
					bottom: 28,
					left: "50%",
					transform: "translateX(-50%)",
					zIndex: 2,
					color: "rgba(255,255,255,.6)",
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					gap: 6,
					fontSize: 12,
					letterSpacing: ".1em",
				}}
			>
				SCROLL
				<Icon n="chevron-down" style={{ width: 18, height: 18 }} />
			</div>
		</section>
	);
}

function TrustBand() {
	const items = [
		"거소증 F-4",
		"영주권 F-5",
		"결혼비자 F-6",
		"연예인 비자 E-6",
		"전문직 비자 E-7",
		"국적회복",
		"단기초청 C-3",
	];
	const all = [...items, ...items, ...items];
	return (
		<div
			style={{
				background: "var(--color-primary-dark)",
				color: "rgba(255,255,255,0.88)",
				padding: "16px 0",
				overflow: "hidden",
				whiteSpace: "nowrap",
			}}
		>
			<div style={{ display: "inline-flex", animation: "marquee 32s linear infinite" }}>
				{all.map((t, i) => (
					<span
						key={i}
						style={{ fontSize: 15, fontWeight: 500, display: "inline-flex", alignItems: "center" }}
					>
						<span style={{ padding: "0 28px" }}>{t}</span>
						<span style={{ color: "var(--color-primary-light)" }}>◆</span>
					</span>
				))}
			</div>
		</div>
	);
}

/* 강점 3 (홈 요약) */
function StrengthsRow() {
	return (
		<section className="section" style={{ background: "var(--surface-page)" }}>
			<div className="container">
				<SectionHead
					eyebrow="Why Choice"
					title="초이스 행정사를 선택하는 이유"
					sub="실력에 책임감을 더한, 출입국·비자 전문 행정사 사무소입니다."
				/>
				<div className="grid-4" style={{ marginTop: 48 }}>
					{STRENGTHS.map((s) => (
						<Card key={s.title}>
							<div
								style={{
									width: 52,
									height: 52,
									borderRadius: "var(--radius)",
									background: "var(--color-accent-soft)",
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									marginBottom: 20,
								}}
							>
								<Icon
									n={s.icon}
									style={{ width: 26, height: 26, color: "var(--color-primary-dark)" }}
								/>
							</div>
							<CardTitle>{s.title}</CardTitle>
							<CardBody>{s.desc}</CardBody>
						</Card>
					))}
				</div>
			</div>
		</section>
	);
}

/* 업무분야 그리드 — clickable, 상세로 이동 */
function ServicesGrid({ heading = true }) {
	return (
		<section className="section" style={{ background: "var(--surface-subtle)" }}>
			<div className="container">
				{heading && (
					<SectionHead
						eyebrow="Services"
						title="업무분야"
						sub="출입국·비자 전 분야를 시험 출신 행정사가 직접 다룹니다. 분야를 선택하면 자세히 안내해 드립니다."
					/>
				)}
				<div className="grid-4" style={{ marginTop: heading ? 48 : 0 }}>
					{SERVICES.map((s) => (
						<Card
							key={s.id}
							padding="24px"
							style={{ cursor: "pointer", display: "flex", flexDirection: "column" }}
							onClick={() => go("service", s.id)}
						>
							<div
								style={{
									display: "flex",
									justifyContent: "space-between",
									alignItems: "flex-start",
									marginBottom: 16,
								}}
							>
								<div
									style={{
										width: 44,
										height: 44,
										borderRadius: "var(--radius)",
										background: "var(--color-accent-soft)",
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
									}}
								>
									<Icon
										n={s.icon}
										style={{ width: 22, height: 22, color: "var(--color-primary-dark)" }}
									/>
								</div>
								<Badge>{s.code}</Badge>
							</div>
							<CardTitle style={{ fontSize: 18 }}>{s.title}</CardTitle>
							<CardBody style={{ fontSize: 15, flex: 1 }}>{s.summary}</CardBody>
							<span
								style={{
									display: "inline-flex",
									alignItems: "center",
									gap: 6,
									marginTop: 16,
									fontSize: 14,
									fontWeight: 600,
									color: "var(--color-primary)",
								}}
							>
								자세히 보기 <Icon n="arrow-right" style={{ width: 15, height: 15 }} />
							</span>
						</Card>
					))}
				</div>
			</div>
		</section>
	);
}

/* 진행 절차 */
function Process() {
	return (
		<section className="section" style={{ background: "var(--surface-page)" }}>
			<div className="container">
				<SectionHead
					eyebrow="Process"
					title="진행 절차"
					sub="상담부터 결과 안내까지, 모든 과정을 행정사가 직접 챙깁니다."
				/>
				<div className="grid-4" style={{ marginTop: 48 }}>
					{PROCESS.map((p, i) => (
						<div key={p.title}>
							<div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
								<span
									style={{
										fontSize: 14,
										fontWeight: 700,
										color: "#fff",
										background: "var(--color-primary)",
										width: 32,
										height: 32,
										borderRadius: "50%",
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
									}}
								>
									{i + 1}
								</span>
								<Icon n={p.icon} style={{ width: 24, height: 24, color: "var(--color-primary)" }} />
							</div>
							<h3 style={{ fontSize: 18, marginBottom: 8 }}>{p.title}</h3>
							<p style={{ fontSize: 15, color: "var(--text-body)", lineHeight: 1.7 }}>{p.desc}</p>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}

function Stats() {
	return (
		<section style={{ background: "var(--color-primary)", padding: "72px 0" }}>
			<div className="grid-4 container" style={{ gap: 24 }}>
				{STATS.map((s) => (
					<div key={s.l} style={{ textAlign: "center", color: "#fff" }}>
						<div
							style={{
								fontSize: "clamp(34px,5vw,44px)",
								fontWeight: 700,
								letterSpacing: "-0.02em",
							}}
						>
							{s.v}
						</div>
						<div style={{ fontSize: 16, fontWeight: 500, marginTop: 8 }}>{s.l}</div>
						<div style={{ fontSize: 14, color: "rgba(255,255,255,0.72)", marginTop: 4 }}>{s.d}</div>
					</div>
				))}
			</div>
		</section>
	);
}

/* 다국어 · 비대면 원격 상담 강조 밴드 */
function LangRemoteBand() {
	const items = [
		{
			icon: "languages",
			title: "한국어 · English · 中文(WeChat)",
			desc: "대표 행정사의 미국 어학연수 경험을 바탕으로 영어 상담이 가능하며, 위챗으로 중국 의뢰인도 편하게 상담합니다.",
		},
		{
			icon: "monitor-smartphone",
			title: "전국 · 해외 어디서나 비대면 상담",
			desc: "출입국 사무소를 직접 방문하지 않아도, 행정사 대행으로 상담부터 접수까지 원격으로 진행합니다.",
		},
	];
	return (
		<section style={{ background: "var(--surface-sunken)", padding: "64px 0" }}>
			<div className="container">
				<div className="grid-2" style={{ gap: 24 }}>
					{items.map((it) => (
						<div
							key={it.title}
							style={{
								display: "flex",
								gap: 18,
								alignItems: "flex-start",
								background: "var(--surface-card)",
								border: "1px solid var(--border-default)",
								borderRadius: "var(--radius)",
								padding: 28,
							}}
						>
							<div
								style={{
									flex: "0 0 auto",
									width: 52,
									height: 52,
									borderRadius: "var(--radius)",
									background: "var(--color-accent-soft)",
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
								}}
							>
								<Icon
									n={it.icon}
									style={{ width: 26, height: 26, color: "var(--color-primary-dark)" }}
								/>
							</div>
							<div>
								<h3 style={{ fontSize: 19 }}>{it.title}</h3>
								<p
									style={{ fontSize: 15, color: "var(--text-body)", lineHeight: 1.7, marginTop: 8 }}
								>
									{it.desc}
								</p>
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}

/* 영상으로 보는 비자 정보 (YouTube: Korea Visa Master) */
function VideoSection() {
	return (
		<section className="section" style={{ background: "var(--surface-page)" }}>
			<div className="container">
				<div
					style={{
						display: "flex",
						justifyContent: "space-between",
						alignItems: "flex-end",
						flexWrap: "wrap",
						gap: 16,
					}}
				>
					<SectionHead
						eyebrow="Video"
						title="영상으로 보는 비자 정보"
						sub="유튜브 ‘Korea Visa Master’에서 비자·체류 정보를 알기 쉽게 안내합니다."
						align="left"
					/>
					<a
						className="lk"
						href={YOUTUBE_CHANNEL}
						target="_blank"
						rel="noopener"
						style={{
							display: "inline-flex",
							alignItems: "center",
							gap: 8,
							fontWeight: 600,
							color: "var(--color-primary)",
							whiteSpace: "nowrap",
						}}
					>
						채널 바로가기 <Icon n="external-link" style={{ width: 16, height: 16 }} />
					</a>
				</div>
				<div className="grid-3" style={{ marginTop: 48 }}>
					{VIDEOS.map((v, i) => (
						<a
							key={i}
							className="lk"
							href={YOUTUBE_CHANNEL}
							target="_blank"
							rel="noopener"
							style={{ display: "block" }}
						>
							<Card
								padding="0"
								style={{ overflow: "hidden", display: "flex", flexDirection: "column" }}
							>
								<div
									style={{
										position: "relative",
										height: 168,
										background:
											"linear-gradient(150deg, var(--color-primary) 0%, var(--color-primary-dark) 100%)",
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
									}}
								>
									<span
										style={{
											width: 56,
											height: 56,
											borderRadius: "50%",
											background: "rgba(255,255,255,0.92)",
											display: "flex",
											alignItems: "center",
											justifyContent: "center",
										}}
									>
										<Icon
											n="play"
											style={{ width: 24, height: 24, color: "var(--color-primary-dark)" }}
										/>
									</span>
									<span
										style={{
											position: "absolute",
											bottom: 12,
											right: 12,
											background: "rgba(20,16,13,.7)",
											color: "#fff",
											fontSize: 12,
											fontWeight: 600,
											padding: "3px 8px",
											borderRadius: 4,
										}}
									>
										{v.dur}
									</span>
								</div>
								<div style={{ padding: 20 }}>
									<Badge>{v.tag}</Badge>
									<h3 style={{ fontSize: 17, lineHeight: 1.5, marginTop: 12 }}>{v.title}</h3>
								</div>
							</Card>
						</a>
					))}
				</div>
			</div>
		</section>
	);
}

/* 네이버 블로그 최신 글 미리보기 */
function BlogPreview() {
	return (
		<section className="section" style={{ background: "var(--surface-subtle)" }}>
			<div className="container">
				<div
					style={{
						display: "flex",
						justifyContent: "space-between",
						alignItems: "flex-end",
						flexWrap: "wrap",
						gap: 16,
					}}
				>
					<SectionHead
						eyebrow="Blog"
						title="비자 정보 · 소식"
						sub="네이버 블로그에서 절차·요건을 사례 중심으로 정리해 전해드립니다."
						align="left"
					/>
					<a
						className="lk"
						href={NAVER_BLOG}
						target="_blank"
						rel="noopener"
						style={{
							display: "inline-flex",
							alignItems: "center",
							gap: 8,
							fontWeight: 600,
							color: "var(--color-primary)",
							whiteSpace: "nowrap",
						}}
					>
						블로그 전체보기 <Icon n="external-link" style={{ width: 16, height: 16 }} />
					</a>
				</div>
				<div className="grid-3" style={{ marginTop: 48 }}>
					{BLOG.slice(0, 3).map((b, i) => (
						<a
							key={i}
							className="lk"
							href={NAVER_BLOG}
							target="_blank"
							rel="noopener"
							style={{ display: "block" }}
						>
							<Card
								padding="0"
								style={{
									overflow: "hidden",
									display: "flex",
									flexDirection: "column",
									height: "100%",
								}}
							>
								<div
									style={{
										height: 132,
										background:
											"linear-gradient(150deg, var(--color-surface-alt), var(--color-accent-soft))",
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
									}}
								>
									<Icon
										n="file-text"
										style={{ width: 38, height: 38, color: "var(--color-primary)", opacity: 0.55 }}
									/>
								</div>
								<div style={{ padding: 24, display: "flex", flexDirection: "column", flex: 1 }}>
									<div
										style={{
											display: "flex",
											justifyContent: "space-between",
											alignItems: "center",
											marginBottom: 12,
										}}
									>
										<Badge>{b.cat}</Badge>
										<span style={{ fontSize: 13, color: "var(--text-muted)" }}>{b.date}</span>
									</div>
									<CardTitle style={{ fontSize: 17 }}>{b.title}</CardTitle>
									<CardBody style={{ fontSize: 15, flex: 1 }}>{b.excerpt}</CardBody>
								</div>
							</Card>
						</a>
					))}
				</div>
			</div>
		</section>
	);
}

/* 후기 카드 (재사용) */
function ReviewCard({ r }) {
	return (
		<Card
			hover={true}
			padding="28px"
			style={{ display: "flex", flexDirection: "column", height: "100%" }}
		>
			<div
				style={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
					marginBottom: 16,
				}}
			>
				<Badge>{r.tag}</Badge>
				<span style={{ fontSize: 13, color: "var(--text-muted)" }}>
					{r.flag} {r.country}
				</span>
			</div>
			<Icon n="quote" style={{ width: 26, height: 26, color: "var(--color-primary-light)" }} />
			<h3 style={{ fontSize: 18, lineHeight: 1.5, marginTop: 12 }}>{r.title}</h3>
			<p
				style={{
					fontSize: 15,
					color: "var(--text-body)",
					lineHeight: 1.75,
					marginTop: 12,
					flex: 1,
				}}
			>
				{r.body}
			</p>
			<div
				style={{
					display: "flex",
					alignItems: "center",
					gap: 12,
					marginTop: 22,
					paddingTop: 18,
					borderTop: "1px solid var(--border-default)",
				}}
			>
				<span
					style={{
						width: 40,
						height: 40,
						borderRadius: "50%",
						background: "var(--color-accent-soft)",
						color: "var(--color-primary-dark)",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						fontWeight: 700,
					}}
				>
					{r.initial}
				</span>
				<div>
					<div style={{ fontSize: 14, fontWeight: 600, color: "var(--text-heading)" }}>
						{r.initial}님 · {r.tag}
					</div>
					<div style={{ fontSize: 13, color: "var(--text-muted)" }}>{r.country} 거주 의뢰인</div>
				</div>
			</div>
		</Card>
	);
}

/* 후기 미리보기 (홈) */
function ReviewsPreview() {
	return (
		<section className="section" style={{ background: "var(--surface-page)" }}>
			<div className="container">
				<div
					style={{
						display: "flex",
						justifyContent: "space-between",
						alignItems: "flex-end",
						flexWrap: "wrap",
						gap: 16,
					}}
				>
					<SectionHead
						eyebrow="Client Reviews"
						title="의뢰인이 직접 전한 후기"
						sub="절차를 마친 의뢰인들이 남겨주신 실제 후기입니다."
						align="left"
					/>
					<a
						className="lk"
						onClick={() => go("reviews")}
						style={{
							display: "inline-flex",
							alignItems: "center",
							gap: 8,
							fontWeight: 600,
							color: "var(--color-primary)",
							whiteSpace: "nowrap",
						}}
					>
						후기 전체보기 <Icon n="arrow-right" style={{ width: 16, height: 16 }} />
					</a>
				</div>
				<div className="grid-3" style={{ marginTop: 48 }}>
					{REVIEWS.slice(0, 3).map((r, i) => (
						<ReviewCard key={i} r={r} />
					))}
				</div>
				<p style={{ textAlign: "center", marginTop: 28, fontSize: 13, color: "var(--text-muted)" }}>
					※ 후기는 의뢰인의 동의를 받아 게시하며, 개인정보 보호를 위해 일부 내용을 각색했습니다.
					결과는 사안에 따라 다를 수 있습니다.
				</p>
			</div>
		</section>
	);
}

/* CTA 밴드 */
function CTABand() {
	return (
		<section
			style={{
				background:
					"linear-gradient(160deg, var(--color-primary) 0%, var(--color-primary-dark) 100%)",
				padding: "80px 0",
			}}
		>
			<div className="container" style={{ textAlign: "center", color: "#fff" }}>
				<h2 style={{ fontSize: "clamp(26px,4vw,36px)", color: "#fff" }}>
					혼자 고민하지 마세요. 방향부터 함께 잡아드립니다.
				</h2>
				<p style={{ fontSize: 18, color: "rgba(255,255,255,.82)", marginTop: 16, lineHeight: 1.7 }}>
					상담은 무료입니다. 한국어 · English 상담 가능 · 시험 출신 행정사 직접 응대.
				</p>
				<div
					style={{
						display: "flex",
						gap: 12,
						justifyContent: "center",
						marginTop: 36,
						flexWrap: "wrap",
					}}
				>
					<Button
						variant="secondary"
						size="lg"
						onClick={() => go("contact")}
						iconEnd={<Icon n="arrow-right" style={{ width: 18, height: 18 }} />}
					>
						무료 상담 신청
					</Button>
					<a href="tel:0269599886">
						<Button
							size="lg"
							style={{
								background: "transparent",
								color: "#fff",
								border: "1px solid rgba(255,255,255,.4)",
							}}
							iconStart={<Icon n="phone" style={{ width: 17, height: 17 }} />}
						>
							02-6959-9886
						</Button>
					</a>
				</div>
			</div>
		</section>
	);
}

/* 상담 폼 (문의 페이지에서 사용) */
function ContactForm() {
	const [sent, setSent] = React.useState(false);
	return (
		<Card hover={false} padding="32px">
			{sent ? (
				<div style={{ textAlign: "center", padding: "40px 0" }}>
					<div
						style={{
							width: 64,
							height: 64,
							borderRadius: "50%",
							background: "var(--color-accent-soft)",
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							margin: "0 auto 20px",
						}}
					>
						<Icon n="check" style={{ width: 30, height: 30, color: "var(--color-primary-dark)" }} />
					</div>
					<h3 style={{ fontSize: 22 }}>상담 신청이 접수되었습니다</h3>
					<p style={{ fontSize: 16, color: "var(--text-body)", marginTop: 12, lineHeight: 1.7 }}>
						빠른 시일 내에 행정사가 직접 연락드리겠습니다.
					</p>
					<Button variant="outline" style={{ marginTop: 24 }} onClick={() => setSent(false)}>
						다시 작성하기
					</Button>
				</div>
			) : (
				<form
					onSubmit={(e) => {
						e.preventDefault();
						setSent(true);
					}}
				>
					<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
						<div>
							<Label htmlFor="cn">성함</Label>
							<Input id="cn" placeholder="홍길동" required />
						</div>
						<div>
							<Label htmlFor="cp">연락처</Label>
							<Input id="cp" placeholder="010-0000-0000" required />
						</div>
						<div style={{ gridColumn: "1 / -1" }}>
							<Label htmlFor="cf">상담 희망 분야</Label>
							<Select id="cf" defaultValue="">
								<option value="" disabled>
									분야를 선택해 주세요
								</option>
								{SERVICES.map((s) => (
									<option key={s.id}>
										{s.title} ({s.code})
									</option>
								))}
								<option>기타</option>
							</Select>
						</div>
						<div style={{ gridColumn: "1 / -1" }}>
							<Label htmlFor="cm">문의 내용</Label>
							<Textarea id="cm" rows={4} placeholder="현재 체류 자격과 상황을 간단히 적어주세요." />
						</div>
					</div>
					<label
						style={{
							display: "flex",
							alignItems: "center",
							gap: 8,
							marginTop: 16,
							fontSize: 14,
							color: "var(--text-muted)",
						}}
					>
						<input
							type="checkbox"
							required
							style={{ width: 16, height: 16, accentColor: "var(--color-primary)" }}
						/>
						<span>
							<a className="lk" style={{ color: "var(--color-primary)" }}>
								개인정보 수집·이용
							</a>
							에 동의합니다.
						</span>
					</label>
					<Button
						type="submit"
						variant="primary"
						size="lg"
						style={{ width: "100%", marginTop: 20 }}
					>
						무료 상담 신청
					</Button>
				</form>
			)}
		</Card>
	);
}

/* 연락처 정보 블록 (다채널: 전화·카카오·위챗·이메일 + 주소) */
function ContactInfo() {
	return (
		<div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
			{CHANNELS.map((c) => {
				const inner = (
					<>
						<span
							style={{
								width: 44,
								height: 44,
								borderRadius: "var(--radius)",
								background: "var(--color-accent-soft)",
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								flex: "0 0 auto",
							}}
						>
							<Icon
								n={c.icon}
								style={{ width: 20, height: 20, color: "var(--color-primary-dark)" }}
							/>
						</span>
						<span style={{ display: "flex", flexDirection: "column" }}>
							<span style={{ fontSize: 13, color: "var(--text-muted)" }}>
								{c.label}
								{c.note ? ` · ${c.note}` : ""}
							</span>
							<span
								style={{
									fontSize: 16,
									fontWeight: 600,
									color: "var(--text-heading)",
									whiteSpace: "nowrap",
								}}
							>
								{c.value}
							</span>
						</span>
					</>
				);
				return c.href ? (
					<a
						key={c.label}
						href={c.href}
						target={c.href.startsWith("http") ? "_blank" : undefined}
						rel="noopener"
						style={{ display: "flex", alignItems: "center", gap: 14, color: "var(--text-body)" }}
					>
						{inner}
					</a>
				) : (
					<div
						key={c.label}
						style={{ display: "flex", alignItems: "center", gap: 14, color: "var(--text-body)" }}
					>
						{inner}
					</div>
				);
			})}
			<div style={{ display: "flex", alignItems: "center", gap: 14, color: "var(--text-body)" }}>
				<span
					style={{
						width: 44,
						height: 44,
						borderRadius: "var(--radius)",
						background: "var(--color-accent-soft)",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						flex: "0 0 auto",
					}}
				>
					<Icon n="map-pin" style={{ width: 20, height: 20, color: "var(--color-primary-dark)" }} />
				</span>
				<span style={{ display: "flex", flexDirection: "column" }}>
					<span style={{ fontSize: 13, color: "var(--text-muted)" }}>주소</span>
					<span style={{ fontSize: 16, fontWeight: 600, color: "var(--text-heading)" }}>
						서울특별시 중구 세종대로 136, 서울파이낸스센터 3층
					</span>
				</span>
			</div>
		</div>
	);
}

/* 지도 플레이스홀더 */
function MapBlock({ height = 320 }) {
	return (
		<div
			style={{
				height,
				borderRadius: "var(--radius)",
				border: "1px solid var(--border-default)",
				background: "var(--surface-sunken)",
				position: "relative",
				overflow: "hidden",
			}}
		>
			<div
				style={{
					position: "absolute",
					inset: 0,
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					justifyContent: "center",
					gap: 10,
					color: "var(--text-muted)",
				}}
			>
				<Icon n="map" style={{ width: 36, height: 36, color: "var(--color-primary-light)" }} />
				<span style={{ fontSize: 14 }}>서울파이낸스센터 (광화문 인근) · 지도</span>
				<a
					className="lk"
					style={{
						fontSize: 14,
						fontWeight: 600,
						color: "var(--color-primary)",
						display: "inline-flex",
						alignItems: "center",
						gap: 6,
					}}
				>
					지도 앱에서 열기 <Icon n="external-link" style={{ width: 14, height: 14 }} />
				</a>
			</div>
		</div>
	);
}

/* FAQ 아코디언 */
function FAQ_({ banded = true, showHead = true }) {
	const [open, setOpen] = React.useState(0);
	return (
		<section
			className="section"
			style={{ background: banded ? "var(--surface-subtle)" : "var(--surface-page)" }}
		>
			<div className="container" style={{ maxWidth: 820 }}>
				{showHead && <SectionHead eyebrow="FAQ" title="자주 묻는 질문" />}
				<div
					style={{
						marginTop: showHead ? 40 : 0,
						display: "flex",
						flexDirection: "column",
						gap: 12,
					}}
				>
					{FAQ.map((f, i) => {
						const isOpen = open === i;
						return (
							<div
								key={i}
								style={{
									background: "var(--surface-card)",
									border: "1px solid var(--border-default)",
									borderRadius: "var(--radius)",
									overflow: "hidden",
								}}
							>
								<button
									className="lk"
									onClick={() => setOpen(isOpen ? -1 : i)}
									style={{
										width: "100%",
										display: "flex",
										justifyContent: "space-between",
										alignItems: "center",
										gap: 16,
										padding: "20px 24px",
										background: "none",
										border: "none",
										textAlign: "left",
										fontFamily: "var(--font-sans)",
									}}
								>
									<span style={{ fontSize: 17, fontWeight: 600, color: "var(--text-heading)" }}>
										{f.q}
									</span>
									<Icon
										n={isOpen ? "minus" : "plus"}
										style={{
											width: 20,
											height: 20,
											color: "var(--color-primary)",
											flex: "0 0 auto",
										}}
									/>
								</button>
								{isOpen && (
									<p
										style={{
											padding: "0 24px 22px",
											fontSize: 16,
											lineHeight: 1.8,
											color: "var(--text-body)",
										}}
									>
										{f.a}
									</p>
								)}
							</div>
						);
					})}
				</div>
			</div>
		</section>
	);
}

/* 하단 고정 상담 바 */
function ConsultBar({ visible }) {
	const mobileItems = [
		{ icon: "file-text", label: "블로그", onClick: () => go("blog") },
		{ icon: "message-square", label: "온라인 상담", onClick: () => go("contact") },
		{
			icon: "phone",
			label: "전화 상담",
			onClick: () => {
				location.href = "tel:0269599886";
			},
		},
	];
	return (
		<>
			{/* 데스크탑: 전화 + 신속 상담 폼 */}
			<div
				className="consult-desktop"
				style={{
					position: "fixed",
					left: 0,
					right: 0,
					bottom: 0,
					zIndex: 90,
					background: "var(--color-primary-dark)",
					color: "#fff",
					transform: visible ? "translateY(0)" : "translateY(100%)",
					transition: "transform .35s ease",
					boxShadow: "0 -4px 20px rgba(34,34,34,.18)",
				}}
			>
				<div className="consult-bar-inner container" style={{ padding: "16px 24px" }}>
					<div style={{ display: "flex", alignItems: "center", gap: 12, whiteSpace: "nowrap" }}>
						<Icon
							n="phone-call"
							style={{ width: 22, height: 22, color: "var(--color-accent-soft)" }}
						/>
						<div>
							<div style={{ fontSize: 12, color: "rgba(255,255,255,.7)" }}>실시간 전화 상담</div>
							<a
								href="tel:0269599886"
								style={{ fontSize: 22, fontWeight: 700, color: "#fff", letterSpacing: "-.01em" }}
							>
								02-6959-9886
							</a>
						</div>
					</div>
					<form
						className="consult-form"
						onSubmit={(e) => {
							e.preventDefault();
							go("contact");
						}}
					>
						<span style={{ fontWeight: 600, whiteSpace: "nowrap" }}>신속 상담 신청</span>
						<select
							style={{
								height: 44,
								padding: "0 14px",
								borderRadius: "var(--radius)",
								border: "none",
								fontFamily: "var(--font-sans)",
								fontSize: 15,
								color: "var(--text-body)",
								flex: "0 1 180px",
							}}
						>
							<option>상담분야 선택</option>
							{SERVICES.map((s) => (
								<option key={s.id}>{s.title}</option>
							))}
							<option>기타</option>
						</select>
						<input
							placeholder="연락처"
							style={{
								height: 44,
								padding: "0 14px",
								borderRadius: "var(--radius)",
								border: "none",
								fontFamily: "var(--font-sans)",
								fontSize: 15,
								flex: "1 1 140px",
								minWidth: 0,
							}}
						/>
						<Button type="submit" variant="secondary" style={{ whiteSpace: "nowrap" }}>
							상담신청
						</Button>
					</form>
				</div>
			</div>

			{/* 모바일: 3분할 하단 액션 바 */}
			<div
				className="consult-mobile"
				style={{
					position: "fixed",
					left: 0,
					right: 0,
					bottom: 0,
					zIndex: 90,
					background: "var(--color-primary-dark)",
					boxShadow: "0 -4px 20px rgba(34,34,34,.22)",
					paddingBottom: "env(safe-area-inset-bottom, 0px)",
				}}
			>
				{mobileItems.map((it, i) => (
					<button
						key={it.label}
						className="lk"
						onClick={it.onClick}
						style={{
							flex: 1,
							display: "flex",
							flexDirection: "column",
							alignItems: "center",
							justifyContent: "center",
							gap: 6,
							padding: "12px 4px",
							minHeight: 64,
							background: "none",
							border: "none",
							borderLeft: i ? "1px solid rgba(255,255,255,0.14)" : "none",
							color: "#fff",
							fontFamily: "var(--font-sans)",
						}}
					>
						<Icon
							n={it.icon}
							style={{ width: 21, height: 21, color: "var(--color-accent-soft)" }}
						/>
						<span style={{ fontSize: 13, fontWeight: 600 }}>{it.label}</span>
					</button>
				))}
			</div>
		</>
	);
}

function FloatRail() {
	return (
		<div
			className="hide-mobile"
			style={{
				position: "fixed",
				right: 20,
				bottom: 110,
				zIndex: 95,
				display: "flex",
				flexDirection: "column",
				gap: 10,
			}}
		>
			{[
				[
					"phone",
					"전화",
					() => {
						location.href = "tel:0269599886";
					},
				],
				["message-circle", "카톡", () => go("contact")],
				["globe", "위챗", () => go("contact")],
				["arrow-up", "TOP", () => window.scrollTo({ top: 0, behavior: "smooth" })],
			].map(([ic, lb, fn]) => (
				<button
					key={lb}
					className="lk"
					onClick={fn}
					title={lb}
					style={{
						width: 52,
						height: 52,
						borderRadius: "50%",
						background: "var(--color-primary)",
						color: "#fff",
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
						justifyContent: "center",
						gap: 2,
						boxShadow: "var(--shadow-md)",
						border: "none",
					}}
				>
					<Icon n={ic} style={{ width: 18, height: 18, color: "#fff" }} />
					<span style={{ fontSize: 10 }}>{lb}</span>
				</button>
			))}
		</div>
	);
}

function Footer() {
	return (
		<footer
			style={{
				background: "var(--color-primary-dark)",
				color: "rgba(255,255,255,0.72)",
				paddingBottom: 88,
			}}
		>
			<div className="container" style={{ padding: "56px 24px 0" }}>
				<div
					style={{
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
						borderBottom: "1px solid rgba(255,255,255,0.15)",
						paddingBottom: 28,
						flexWrap: "wrap",
						gap: 16,
					}}
				>
					<span
						className="lk"
						onClick={() => go("home")}
						style={{ color: "#fff", fontWeight: 700, fontSize: 20, letterSpacing: "-0.02em" }}
					>
						초이스 행정사 사무소
					</span>
					<nav style={{ display: "flex", gap: 22, fontSize: 14, flexWrap: "wrap" }}>
						{NAV.map((n) => (
							<a
								key={n.label}
								className="lk"
								onClick={() => go(n.route)}
								style={{ color: "rgba(255,255,255,0.8)" }}
							>
								{n.label}
							</a>
						))}
					</nav>
				</div>
				<div style={{ marginTop: 28, fontSize: 14, lineHeight: 1.9 }}>
					<p>주소 서울특별시 중구 세종대로 136, 서울파이낸스센터 3층</p>
					<p>대표 행정사 ○○○ · 전화 02-6959-9886 · 이메일 choice@kvisa1345.com</p>
					<p style={{ color: "rgba(255,255,255,0.5)" }}>
						사업자등록번호 464-11-00966 · 행정사 등록번호 18102025537 · 출입국민원 대행기관
						19-SB-RG-016
					</p>
					<p style={{ color: "rgba(255,255,255,0.45)", fontSize: 13, marginTop: 12 }}>
						© 2026 초이스 행정사 사무소. ALL RIGHTS RESERVED.
					</p>
				</div>
			</div>
		</footer>
	);
}

Object.assign(window, {
	go,
	Icon,
	refreshIcons,
	SectionHead,
	PageHero,
	Hero,
	TrustBand,
	StrengthsRow,
	ServicesGrid,
	Process,
	Stats,
	ReviewCard,
	ReviewsPreview,
	CTABand,
	ContactForm,
	ContactInfo,
	MapBlock,
	FAQ_,
	ConsultBar,
	FloatRail,
	Footer,
	LangRemoteBand,
	VideoSection,
	BlogPreview,
	PageSectionTitle,
});
