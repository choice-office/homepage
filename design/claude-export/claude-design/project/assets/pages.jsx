/* 초이스 행정사 — 페이지 구성 (각 메뉴/하위 메뉴 = 독립 페이지 + 배너) */
const PDS = window.DesignSystem_9e363e;
const { Button: PB, Badge: PBadge, Card: PCard, CardTitle: PCardTitle, CardBody: PCardBody } = PDS;

const ABOUT_CRUMB = { label: "사무소 소개", route: "greeting" };

/* ── 홈: 요약 + CTA 중심 ── */
function HomePage() {
	return (
		<>
			<Hero />
			<TrustBand />
			<LangRemoteBand />
			<StrengthsRow />
			<ServicesGrid />
			<Stats />
			<ReviewsPreview />
			<VideoSection />
			<BlogPreview />
			<CTABand />
		</>
	);
}

/* ── 사무소 소개 › 인사말 (메시지/편지 중심) ── */
function GreetingPage() {
	return (
		<>
			<PageHero
				eyebrow="Greetings"
				title="인사말"
				sub="초이스 행정사 사무소가 의뢰인께 드리는 말씀입니다."
				crumbs={[{ label: "홈", route: "home" }, ABOUT_CRUMB, { label: "인사말" }]}
			/>
			<section className="section" style={{ background: "var(--surface-page)" }}>
				<div className="container">
					<div className="grid-2" style={{ gap: 56, alignItems: "stretch" }}>
						<div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
							<Icon
								n="quote"
								style={{ width: 40, height: 40, color: "var(--color-primary-light)" }}
							/>
							<h2 style={{ fontSize: "clamp(26px,3.4vw,34px)", lineHeight: 1.5, marginTop: 16 }}>
								복잡하게 느껴지는 출입국 절차,
								<br />그 곁에서 길을 함께 찾겠습니다.
							</h2>
							<div
								style={{
									marginTop: 28,
									display: "flex",
									flexDirection: "column",
									gap: 18,
									fontSize: 16.5,
									lineHeight: 1.9,
									color: "var(--text-body)",
								}}
							>
								<p>안녕하세요. 초이스 행정사 사무소를 찾아주셔서 감사합니다.</p>
								<p>
									낯선 제도와 언어 속에서 체류와 비자 문제를 마주하는 일은, 그 자체로 막막하고
									외로운 과정일 수 있습니다. 작은 서류 하나, 절차 하나가 결과를 좌우하기에 더욱
									그렇습니다.
								</p>
								<p>
									초이스 행정사 사무소는 사무장을 거치지 않고, 시험 출신 행정사가 상담부터 서류
									작성과 접수까지 모든 과정을 직접 책임집니다. 무리한 약속을 드리기보다, 의뢰인의
									상황을 정확히 살피고 지금 가능한 방향을 솔직하게 말씀드리는 것을 가장 중요한
									원칙으로 삼고 있습니다.
								</p>
								<p>
									거소증·영주권·결혼비자·외국인 연예인(E-6)·전문직(E-7) 비자·국적회복까지, 한 분 한
									분의 사정을 끝까지 함께 살피겠습니다. 혼자 고민하지 마시고, 편하게 문을 두드려
									주세요.
								</p>
							</div>
							<div
								style={{
									marginTop: 32,
									paddingTop: 24,
									borderTop: "1px solid var(--border-default)",
								}}
							>
								<div style={{ fontSize: 15, color: "var(--text-muted)" }}>마음을 다해,</div>
								<div
									style={{ fontSize: 22, fontWeight: 700, marginTop: 6, letterSpacing: "-0.02em" }}
								>
									초이스 행정사 사무소{" "}
									<span style={{ fontSize: 16, fontWeight: 500, color: "var(--text-muted)" }}>
										드림
									</span>
								</div>
							</div>
						</div>
						<div
							style={{
								position: "relative",
								borderRadius: "var(--radius-lg)",
								overflow: "hidden",
								minHeight: 460,
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
									opacity: 0.62,
								}}
							/>
							<div
								style={{
									position: "absolute",
									inset: 0,
									background:
										"linear-gradient(160deg, rgba(82,70,54,0.55) 0%, rgba(36,29,22,0.8) 100%)",
								}}
							/>
							<div style={{ position: "absolute", left: 32, bottom: 32, color: "#fff", zIndex: 1 }}>
								<div
									style={{ fontSize: 14, letterSpacing: ".1em", color: "var(--color-accent-soft)" }}
								>
									OUR OFFICE
								</div>
								<div style={{ fontSize: 20, fontWeight: 700, marginTop: 6 }}>
									서울 중구 · 광화문 인근
								</div>
								<div style={{ fontSize: 14, color: "rgba(255,255,255,.8)", marginTop: 4 }}>
									한국어 · English · 中文 상담
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
			<CTABand />
		</>
	);
}

/* ── 사무소 소개 › 구성원 (인원 확장 대비 그리드) ── */
function MemberCard({ m, single }) {
	const Photo = (
		<div
			style={{
				position: "relative",
				background:
					"linear-gradient(160deg, var(--color-primary) 0%, var(--color-primary-dark) 100%)",
				display: "flex",
				alignItems: "flex-end",
				padding: 28,
				minHeight: single ? 420 : 320,
				...(single ? { borderRadius: "var(--radius-lg) 0 0 var(--radius-lg)" } : {}),
			}}
		>
			<Icon
				n="user-round"
				style={{
					position: "absolute",
					top: "40%",
					left: "50%",
					transform: "translate(-50%,-50%)",
					width: single ? 110 : 88,
					height: single ? 110 : 88,
					color: "rgba(255,255,255,.5)",
				}}
			/>
			<div style={{ color: "#fff", zIndex: 1 }}>
				<PBadge style={{ background: "rgba(255,255,255,.16)", color: "#fff" }}>{m.title}</PBadge>
				<div style={{ fontSize: single ? 30 : 24, fontWeight: 700, marginTop: 12 }}>{m.name}</div>
				<div style={{ fontSize: 14, color: "rgba(255,255,255,.82)", marginTop: 6 }}>
					{m.summary}
				</div>
			</div>
		</div>
	);
	const Info = (
		<div
			style={{
				padding: single ? "40px 44px" : "26px 28px",
				display: "flex",
				flexDirection: "column",
				justifyContent: "center",
			}}
		>
			<div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
				{m.tags.map((t) => (
					<PBadge key={t} variant="outline">
						{t}
					</PBadge>
				))}
			</div>
			<div style={{ marginTop: 22, display: "flex", flexDirection: "column", gap: 13 }}>
				{m.career.map((c, i) => (
					<div key={i} style={{ display: "flex", alignItems: "center", gap: 14 }}>
						<span
							style={{
								width: 40,
								height: 40,
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
								style={{ width: 19, height: 19, color: "var(--color-primary-dark)" }}
							/>
						</span>
						<span style={{ fontSize: 15.5, color: "var(--text-body)" }}>{c.text}</span>
					</div>
				))}
			</div>
			<div
				style={{
					marginTop: 22,
					paddingTop: 18,
					borderTop: "1px solid var(--border-default)",
					fontSize: 13.5,
					color: "var(--text-muted)",
					lineHeight: 1.7,
				}}
			>
				{m.reg}
			</div>
		</div>
	);
	if (single) {
		return (
			<PCard
				hover={false}
				padding="0"
				style={{ overflow: "hidden", maxWidth: 980, margin: "0 auto" }}
			>
				<div className="member-single">
					{Photo}
					{Info}
				</div>
			</PCard>
		);
	}
	return (
		<PCard
			hover={true}
			padding="0"
			style={{ overflow: "hidden", display: "flex", flexDirection: "column" }}
		>
			{Photo}
			{Info}
		</PCard>
	);
}

function MembersPage() {
	const single = TEAM.length === 1;
	return (
		<>
			<PageHero
				eyebrow="Members"
				title="구성원"
				sub="상담부터 접수까지 직접 책임지는 행정사를 소개합니다."
				crumbs={[{ label: "홈", route: "home" }, ABOUT_CRUMB, { label: "구성원" }]}
			/>
			<section className="section" style={{ background: "var(--surface-page)" }}>
				<div className="container">
					{single ? (
						<MemberCard m={TEAM[0]} single />
					) : (
						<div className="grid-3">
							{TEAM.map((m, i) => (
								<MemberCard key={i} m={m} />
							))}
						</div>
					)}
					<p
						style={{ textAlign: "center", marginTop: 36, fontSize: 15, color: "var(--text-muted)" }}
					>
						상담은 시험 출신 행정사가 직접 진행하며, 담당이 바뀌지 않고 한 사람이 끝까지 책임집니다.
					</p>
				</div>
			</section>
			<CTABand />
		</>
	);
}

/* ── 사무소 소개 › 자격 · 인증 ── */
function CredentialsPage() {
	return (
		<>
			<PageHero
				eyebrow="Credentials"
				title="자격 · 인증"
				sub="자격과 등록을 갖춘 행정사가, 적법한 절차로 직접 진행합니다."
				crumbs={[{ label: "홈", route: "home" }, ABOUT_CRUMB, { label: "자격 · 인증" }]}
			/>
			<section className="section" style={{ background: "var(--surface-page)" }}>
				<div className="container">
					<div className="grid-2">
						{CREDENTIALS.map((c) => (
							<PCard
								key={c.title}
								padding="28px"
								style={{ display: "flex", gap: 18, alignItems: "flex-start" }}
							>
								<div
									style={{
										width: 52,
										height: 52,
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
										style={{ width: 26, height: 26, color: "var(--color-primary-dark)" }}
									/>
								</div>
								<div>
									<PCardTitle style={{ fontSize: 19 }}>{c.title}</PCardTitle>
									<PCardBody style={{ fontSize: 15 }}>{c.desc}</PCardBody>
								</div>
							</PCard>
						))}
					</div>
					<div
						style={{
							marginTop: 28,
							padding: 24,
							background: "var(--surface-subtle)",
							border: "1px solid var(--border-default)",
							borderRadius: "var(--radius)",
							fontSize: 15,
							lineHeight: 1.8,
							color: "var(--text-muted)",
						}}
					>
						사업자등록번호 464-11-00966 · 행정사 등록번호 18102025537 · 출입국민원 대행기관
						19-SB-RG-016
						<br />
						결과를 단정해 약속드리지 않으며, 요건을 정확히 검토해 가능한 방향을 솔직하게
						안내드립니다.
					</div>
				</div>
			</section>
			<CTABand />
		</>
	);
}

/* ── 사무소 소개 › 오시는 길 ── */
function LocationPage() {
	return (
		<>
			<PageHero
				eyebrow="Location"
				title="오시는 길"
				sub="외부 출장이 많아 내방 상담은 반드시 사전 연락 부탁드립니다."
				crumbs={[{ label: "홈", route: "home" }, ABOUT_CRUMB, { label: "오시는 길" }]}
			/>
			<section className="section" style={{ background: "var(--surface-page)" }}>
				<div className="contact-grid container">
					<div>
						<PageSectionTitle title="연락처 · 위치" />
						<ContactInfo />
						<div
							style={{
								marginTop: 24,
								padding: 20,
								background: "var(--surface-subtle)",
								borderRadius: "var(--radius)",
								border: "1px solid var(--border-default)",
								fontSize: 14,
								lineHeight: 1.8,
								color: "var(--text-muted)",
							}}
						>
							지하철 5호선 광화문역 인근 · 운영 시간 평일 09:00 – 18:00 · 상담 언어 한국어 · English
							· 中文(WeChat)
						</div>
					</div>
					<MapBlock height={420} />
				</div>
			</section>
			<CTABand />
		</>
	);
}

/* ── 업무분야 목록 ── */
function ServicesPage() {
	return (
		<>
			<PageHero
				eyebrow="Services"
				title="업무분야"
				sub="출입국·비자 전 분야를 시험 출신 행정사가 직접 다룹니다. 분야를 선택하면 대상·서류·절차·기간을 안내해 드립니다."
				crumbs={[{ label: "홈", route: "home" }, { label: "업무분야" }]}
			/>
			<ServicesGrid heading={false} />
			<Process />
			<CTABand />
		</>
	);
}

/* ── 업무분야 상세 ── */
function ServiceDetailPage({ id }) {
	const s = SERVICES.find((x) => x.id === id) || SERVICES[0];
	const others = SERVICES.filter((x) => x.id !== s.id);
	const Block = ({ icon, title, children }) => (
		<PCard hover={false} padding="28px" style={{ height: "100%" }}>
			<div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
				<div
					style={{
						width: 40,
						height: 40,
						borderRadius: "var(--radius)",
						background: "var(--color-accent-soft)",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
					}}
				>
					<Icon n={icon} style={{ width: 20, height: 20, color: "var(--color-primary-dark)" }} />
				</div>
				<h3 style={{ fontSize: 19 }}>{title}</h3>
			</div>
			{children}
		</PCard>
	);
	const List = ({ items, ordered }) => (
		<ol
			style={{
				margin: 0,
				padding: 0,
				listStyle: "none",
				display: "flex",
				flexDirection: "column",
				gap: 12,
			}}
		>
			{items.map((t, i) => (
				<li
					key={i}
					style={{
						display: "flex",
						gap: 12,
						fontSize: 15,
						lineHeight: 1.6,
						color: "var(--text-body)",
					}}
				>
					{ordered ? (
						<span
							style={{
								flex: "0 0 auto",
								width: 24,
								height: 24,
								borderRadius: "50%",
								background: "var(--color-primary)",
								color: "#fff",
								fontSize: 13,
								fontWeight: 700,
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
							}}
						>
							{i + 1}
						</span>
					) : (
						<Icon
							n="check"
							style={{
								width: 18,
								height: 18,
								color: "var(--color-primary)",
								flex: "0 0 auto",
								marginTop: 2,
							}}
						/>
					)}
					<span>{t}</span>
				</li>
			))}
		</ol>
	);
	return (
		<>
			<PageHero
				eyebrow={`Service · ${s.code}`}
				title={s.title}
				sub={s.summary}
				crumbs={[
					{ label: "홈", route: "home" },
					{ label: "업무분야", route: "services" },
					{ label: s.title },
				]}
			/>
			<section className="section" style={{ background: "var(--surface-page)" }}>
				<div className="container">
					<div className="grid-2" style={{ gap: 24 }}>
						<Block icon="users" title="이런 분께 권합니다">
							<List items={s.target} />
						</Block>
						<Block icon="folder-check" title="필요 서류">
							<List items={s.docs} />
						</Block>
					</div>
					<div className="grid-2" style={{ gap: 24, marginTop: 24 }}>
						<Block icon="route" title="처리 절차">
							<List items={s.steps} ordered />
						</Block>
						<div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
							<PCard
								hover={false}
								padding="28px"
								style={{ background: "var(--color-primary)", color: "#fff", border: "none" }}
							>
								<div style={{ display: "flex", alignItems: "center", gap: 10 }}>
									<Icon
										n="clock"
										style={{ width: 22, height: 22, color: "var(--color-accent-soft)" }}
									/>
									<h3 style={{ fontSize: 19, color: "#fff" }}>예상 소요 기간</h3>
								</div>
								<p style={{ fontSize: 22, fontWeight: 700, marginTop: 16, lineHeight: 1.4 }}>
									{s.period}
								</p>
								<p
									style={{
										fontSize: 14,
										color: "rgba(255,255,255,.78)",
										marginTop: 12,
										lineHeight: 1.7,
									}}
								>
									실제 기간은 의뢰인의 상황과 심사 일정에 따라 달라질 수 있으며, 결과를 단정해
									약속드리지 않습니다.
								</p>
							</PCard>
							<PCard
								hover={false}
								padding="28px"
								style={{ display: "flex", flexDirection: "column", gap: 14 }}
							>
								<h3 style={{ fontSize: 18 }}>{s.title} 상담이 필요하신가요?</h3>
								<p style={{ fontSize: 15, color: "var(--text-body)", lineHeight: 1.7 }}>
									가능 여부와 준비 방향을 먼저 솔직하게 안내드립니다.
								</p>
								<PB
									variant="primary"
									size="lg"
									onClick={() => go("contact")}
									iconEnd={<Icon n="arrow-right" style={{ width: 18, height: 18 }} />}
								>
									무료 상담 신청
								</PB>
							</PCard>
						</div>
					</div>
				</div>
			</section>
			<section className="section" style={{ background: "var(--surface-sunken)", paddingTop: 0 }}>
				<div className="container">
					<div style={{ marginBottom: 36 }}>
						<span
							style={{
								fontSize: 13,
								fontWeight: 700,
								letterSpacing: ".12em",
								textTransform: "uppercase",
								color: "var(--color-accent)",
							}}
						>
							Other Services
						</span>
						<h2 style={{ fontSize: "clamp(24px,3vw,30px)", marginTop: 12 }}>다른 업무분야</h2>
						<p style={{ fontSize: 16, color: "var(--text-muted)", marginTop: 12, lineHeight: 1.7 }}>
							찾으시는 분야가 있다면 함께 살펴보세요. 분야를 선택하면 대상·서류·절차·기간을 안내해
							드립니다.
						</p>
						<span
							style={{
								display: "block",
								width: 48,
								height: 3,
								background: "var(--color-accent)",
								borderRadius: 2,
								marginTop: 18,
							}}
						/>
					</div>
					<div className="grid-4">
						{others.slice(0, 4).map((o) => (
							<PCard
								key={o.id}
								padding="26px"
								style={{
									cursor: "pointer",
									display: "flex",
									flexDirection: "column",
									background: "var(--surface-card)",
								}}
								onClick={() => {
									go("service", o.id);
									window.scrollTo({ top: 0 });
								}}
							>
								<div
									style={{
										display: "flex",
										justifyContent: "space-between",
										alignItems: "flex-start",
										marginBottom: 18,
									}}
								>
									<div
										style={{
											width: 46,
											height: 46,
											borderRadius: "var(--radius)",
											background: "var(--color-accent-soft)",
											display: "flex",
											alignItems: "center",
											justifyContent: "center",
										}}
									>
										<Icon
											n={o.icon}
											style={{ width: 23, height: 23, color: "var(--color-primary-dark)" }}
										/>
									</div>
									<PBadge>{o.code}</PBadge>
								</div>
								<PCardTitle style={{ fontSize: 18 }}>{o.title}</PCardTitle>
								<PCardBody style={{ fontSize: 14.5, flex: 1 }}>{o.summary}</PCardBody>
								<span
									style={{
										display: "inline-flex",
										alignItems: "center",
										gap: 6,
										marginTop: 18,
										fontSize: 14,
										fontWeight: 600,
										color: "var(--color-primary)",
									}}
								>
									자세히 보기 <Icon n="arrow-right" style={{ width: 15, height: 15 }} />
								</span>
							</PCard>
						))}
					</div>
					<div style={{ textAlign: "center", marginTop: 40 }}>
						<a
							className="lk"
							onClick={() => {
								go("services");
								window.scrollTo({ top: 0 });
							}}
							style={{
								display: "inline-flex",
								alignItems: "center",
								gap: 8,
								fontSize: 16,
								fontWeight: 600,
								color: "var(--color-primary)",
							}}
						>
							업무분야 전체 보기 <Icon n="arrow-right" style={{ width: 17, height: 17 }} />
						</a>
					</div>
				</div>
			</section>
		</>
	);
}

/* ── 의뢰인 후기 ── */
function ReviewsPage() {
	return (
		<>
			<PageHero
				eyebrow="Client Reviews"
				title="의뢰인 후기"
				sub="절차를 마친 의뢰인들이 남겨주신 실제 후기입니다."
				crumbs={[{ label: "홈", route: "home" }, { label: "의뢰인 후기" }]}
			/>
			<section className="section" style={{ background: "var(--surface-page)" }}>
				<div className="container">
					<div className="grid-3">
						{REVIEWS.map((r, i) => (
							<ReviewCard key={i} r={r} />
						))}
					</div>
					<p
						style={{ textAlign: "center", marginTop: 32, fontSize: 13, color: "var(--text-muted)" }}
					>
						※ 후기는 의뢰인의 동의를 받아 게시하며, 개인정보 보호를 위해 일부 내용을 각색했습니다.
						결과는 사안에 따라 다를 수 있습니다.
					</p>
				</div>
			</section>
			<CTABand />
		</>
	);
}

/* ── 자주 묻는 질문 ── */
function FaqPage() {
	return (
		<>
			<PageHero
				eyebrow="FAQ"
				title="자주 묻는 질문"
				sub="상담 전 자주 묻는 질문을 모았습니다. 더 궁금한 점은 편하게 문의해 주세요."
				crumbs={[{ label: "홈", route: "home" }, { label: "자주 묻는 질문" }]}
			/>
			<FAQ_ banded={false} showHead={false} />
			<CTABand />
		</>
	);
}

/* ── 블로그 ── */
function BlogPage() {
	return (
		<>
			<PageHero
				eyebrow="Blog"
				title="출입국·비자 칼럼"
				sub="자주 묻는 절차와 요건을, 사례 중심으로 알기 쉽게 정리합니다."
				crumbs={[{ label: "홈", route: "home" }, { label: "블로그" }]}
			/>
			<section className="section" style={{ background: "var(--surface-page)" }}>
				<div className="container">
					<div className="grid-3">
						{BLOG.map((b, i) => (
							<a
								key={i}
								className="lk"
								href={NAVER_BLOG}
								target="_blank"
								rel="noopener"
								style={{ display: "block" }}
							>
								<PCard
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
											height: 140,
											background:
												"linear-gradient(150deg, var(--color-surface-alt), var(--color-accent-soft))",
											display: "flex",
											alignItems: "center",
											justifyContent: "center",
										}}
									>
										<Icon
											n="file-text"
											style={{
												width: 40,
												height: 40,
												color: "var(--color-primary)",
												opacity: 0.55,
											}}
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
											<PBadge>{b.cat}</PBadge>
											<span style={{ fontSize: 13, color: "var(--text-muted)" }}>{b.date}</span>
										</div>
										<PCardTitle style={{ fontSize: 18 }}>{b.title}</PCardTitle>
										<PCardBody style={{ fontSize: 15, flex: 1 }}>{b.excerpt}</PCardBody>
										<span
											style={{
												display: "inline-flex",
												alignItems: "center",
												gap: 8,
												marginTop: 16,
												fontSize: 13,
												color: "var(--text-muted)",
											}}
										>
											<Icon n="clock" style={{ width: 14, height: 14 }} /> 읽는 시간 {b.read}
										</span>
									</div>
								</PCard>
							</a>
						))}
					</div>
					<p
						style={{ textAlign: "center", marginTop: 32, fontSize: 14, color: "var(--text-muted)" }}
					>
						네이버 블로그에서 더 많은 글을 보실 수 있습니다.
					</p>
				</div>
			</section>
		</>
	);
}

/* ── 문의하기 ── */
function ContactPage() {
	return (
		<>
			<PageHero
				eyebrow="Contact"
				title="문의하기"
				sub="상담은 무료입니다. 행정사가 직접 연락드립니다. (한국어 · English · 中文)"
				crumbs={[{ label: "홈", route: "home" }, { label: "문의하기" }]}
			/>
			<section className="section" style={{ background: "var(--surface-page)" }}>
				<div className="contact-grid container">
					<div>
						<PageSectionTitle title="연락처" />
						<ContactInfo />
						<div style={{ marginTop: 24 }}>
							<MapBlock height={240} />
						</div>
						<div
							style={{
								marginTop: 20,
								padding: 20,
								background: "var(--surface-subtle)",
								borderRadius: "var(--radius)",
								border: "1px solid var(--border-default)",
								fontSize: 14,
								lineHeight: 1.8,
								color: "var(--text-muted)",
							}}
						>
							운영 시간 평일 09:00 – 18:00 · 외부 출장이 많아 내방 상담은 반드시 사전 연락
							부탁드립니다.
						</div>
					</div>
					<div>
						<PageSectionTitle title="무료 상담 신청" />
						<ContactForm />
					</div>
				</div>
			</section>
		</>
	);
}

Object.assign(window, {
	HomePage,
	GreetingPage,
	ProfilePage: MembersPage,
	MembersPage,
	CredentialsPage,
	LocationPage,
	ServicesPage,
	ServiceDetailPage,
	ReviewsPage,
	FaqPage,
	BlogPage,
	ContactPage,
});
