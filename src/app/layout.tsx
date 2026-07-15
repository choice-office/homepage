import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata, Viewport } from "next";
import { Noto_Sans_KR } from "next/font/google";
import { GoogleAnalytics } from "@/components/common/google-analytics";
import { Providers } from "@/components/providers";
import { SiteHeader } from "@/components/site/header";
import { ScrollReveal } from "@/components/site/scroll-reveal";
import { ConsultBar, FloatRail, Footer } from "@/components/site/sections";
import { SmoothScroll } from "@/components/site/smooth-scroll";
import { siteConfig } from "@/config/site";
import { toJsonLd } from "@/lib/json-ld";
import { CONTACT, NAVER_BLOG, YOUTUBE_CHANNEL } from "@/lib/site-data";
import "./globals.css";

// 폰트: Noto Sans KR (next/font 자체 호스팅 — CDN/CSP 불필요, 한/영 동시 지원).
// CSS 변수 --font-noto-sans-kr 로 노출 → globals.css 의 --font-sans 가 이를 참조.
const fontSans = Noto_Sans_KR({
	subsets: ["latin"],
	weight: ["400", "500", "700"],
	variable: "--font-noto-sans-kr",
	display: "swap",
});

export const viewport: Viewport = {
	width: "device-width",
	initialScale: 1,
	themeColor: [
		{ media: "(prefers-color-scheme: light)", color: "#ffffff" },
		{ media: "(prefers-color-scheme: dark)", color: "#09090b" },
	],
};

export const metadata: Metadata = {
	metadataBase: new URL(siteConfig.url),
	title: {
		default: siteConfig.name,
		template: `%s | ${siteConfig.name}`,
	},
	description: siteConfig.description,
	// canonical은 루트에서 설정하지 않는다 — 여기서 지정하면 하위 페이지가 상속받아
	// 모든 페이지의 canonical이 홈으로 고정된다(중복 취급). 각 페이지가 자기 canonical을 선언한다.
	openGraph: {
		title: siteConfig.name,
		description: siteConfig.description,
		url: siteConfig.url,
		siteName: siteConfig.name,
		images: [{ url: siteConfig.ogImage, width: 1200, height: 630, alt: siteConfig.name }],
		type: "website",
		locale: siteConfig.locale,
	},
	twitter: {
		card: "summary_large_image",
		title: siteConfig.name,
		description: siteConfig.description,
		images: [siteConfig.ogImage],
	},
	robots: {
		index: true,
		follow: true,
		googleBot: { index: true, follow: true, "max-image-preview": "large" },
	},
};

const jsonLd = {
	"@context": "https://schema.org",
	"@type": ["Organization", "LegalService"],
	name: siteConfig.name,
	url: siteConfig.url,
	logo: siteConfig.ogImage,
	image: siteConfig.ogImage,
	description: siteConfig.description,
	sameAs: [NAVER_BLOG, YOUTUBE_CHANNEL],
	telephone: CONTACT.phone.display,
	email: CONTACT.email,
	address: {
		"@type": "PostalAddress",
		streetAddress: CONTACT.address,
		addressLocality: "서울",
		addressCountry: "KR",
	},
	areaServed: ["KR", "US"],
	openingHours: "Mo-Fr 10:00-18:00",
	knowsLanguage: ["ko"],
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html
			lang={siteConfig.locale}
			className={`${fontSans.variable} h-full antialiased`}
			suppressHydrationWarning
		>
			{/* suppressHydrationWarning: 일부 브라우저 확장프로그램이 <body>에 overscroll-behavior 등
			    인라인 스타일을 주입해 발생하는 하이드레이션 경고를 억제(해당 엘리먼트 속성에만 적용,
			    하위 컴포넌트의 실제 불일치는 그대로 노출됨). */}
			<body className="flex min-h-full flex-col" suppressHydrationWarning>
				<script
					type="application/ld+json"
					// biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD 주입의 표준 방식(대안 없음). '<' 이스케이프로 하드닝 — toJsonLd
					dangerouslySetInnerHTML={{ __html: toJsonLd(jsonLd) }}
				/>
				<Providers>
					<SmoothScroll />
					<ScrollReveal />
					<SiteHeader />
					<main id="main-content" className="flex-1">
						{children}
					</main>
					<Footer />
					<FloatRail />
					<ConsultBar />
				</Providers>
				{process.env.VERCEL && <Analytics />}
				{process.env.VERCEL && <SpeedInsights />}
				{process.env.NEXT_PUBLIC_GA_ID && <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />}
			</body>
		</html>
	);
}
