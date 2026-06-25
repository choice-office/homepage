/* 초이스 행정사 — 라우터 / 앱 조립 */
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/ {
	heroOverlay: 0.86,
	accent: "#7c6346",
	showConsultBar: true,
} /*EDITMODE-END*/;

function parseHash() {
	const h = (location.hash || "").replace(/^#\/?/, "");
	const [route = "home", param = null] = h.split("/");
	return { route: route || "home", param };
}

window.__go = (route, param) => {
	location.hash = `#/${route}${param ? `/${param}` : ""}`;
};

function App() {
	const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
	const [loc, setLoc] = React.useState(parseHash());
	const [scrolled, setScrolled] = React.useState(false);
	const [showBar, setShowBar] = React.useState(false);
	const [_menuOpen, setMenuOpen] = React.useState(false);

	React.useEffect(() => {
		const onHash = () => {
			const next = parseHash();
			setLoc(next);
			// 서브 앵커(예: about/greeting)로 스크롤, 아니면 최상단
			requestAnimationFrame(() => {
				window.scrollTo({ top: 0 });
			});
		};
		window.addEventListener("hashchange", onHash);
		return () => window.removeEventListener("hashchange", onHash);
	}, []);

	React.useEffect(() => {
		const on = () => {
			const y = window.scrollY;
			setScrolled(y > 24);
			setShowBar(y > 360);
		};
		window.addEventListener("scroll", on, { passive: true });
		on();
		return () => window.removeEventListener("scroll", on);
	}, []);

	React.useEffect(() => {
		refreshIcons();
	});
	React.useEffect(() => {
		document.documentElement.style.setProperty("--color-accent", t.accent);
	}, [t.accent]);
	window.__heroOverlay = t.heroOverlay;

	const { route, param } = loc;
	let page;
	switch (route) {
		case "greeting":
			page = <GreetingPage />;
			break;
		case "profile":
			page = <MembersPage />;
			break;
		case "credentials":
			page = <CredentialsPage />;
			break;
		case "location":
			page = <LocationPage />;
			break;
		case "services":
			page = <ServicesPage />;
			break;
		case "service":
			page = <ServiceDetailPage id={param} />;
			break;
		case "reviews":
			page = <ReviewsPage />;
			break;
		case "faq":
			page = <FaqPage />;
			break;
		case "blog":
			page = <BlogPage />;
			break;
		case "contact":
			page = <ContactPage />;
			break;
		default:
			page = <HomePage />;
	}

	return (
		<div>
			<Header route={route} scrolled={scrolled} onMenuOpenChange={setMenuOpen} />
			<main>{page}</main>
			<Footer />
			<FloatRail />
			<ConsultBar visible={showBar && t.showConsultBar} />

			<TweaksPanel>
				<TweakSection label="히어로" />
				<TweakSlider
					label="배경 어둡기"
					value={t.heroOverlay}
					min={0.5}
					max={0.95}
					step={0.01}
					onChange={(v) => setTweak("heroOverlay", v)}
				/>
				<TweakSection label="브랜드" />
				<TweakColor
					label="포인트 색"
					value={t.accent}
					options={["#7c6346", "#6c5d4c", "#8c7d6a", "#5a6b5a"]}
					onChange={(v) => setTweak("accent", v)}
				/>
				<TweakSection label="레이아웃" />
				<TweakToggle
					label="하단 상담 바"
					value={t.showConsultBar}
					onChange={(v) => setTweak("showConsultBar", v)}
				/>
			</TweaksPanel>
		</div>
	);
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
