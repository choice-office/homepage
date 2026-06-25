import { Analytics } from "@vercel/analytics/next";
import type { Metadata, Viewport } from "next";
import { GoogleAnalytics } from "@/components/common/google-analytics";
import { Providers } from "@/components/providers";
import { SiteHeader } from "@/components/site/header";
import { ConsultBar, FloatRail, Footer } from "@/components/site/sections";
import { siteConfig } from "@/config/site";
import "./globals.css";

// 폰트: Pretendard (윈도우 렌더링 우수, 한글 웹 표준). CDN 로드 + globals.css 의 --font-sans 폴백.
const PRETENDARD_CSS =
	"https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css";

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
	alternates: {
		canonical: siteConfig.url,
	},
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
	"@type": "Organization",
	name: siteConfig.name,
	url: siteConfig.url,
	logo: siteConfig.ogImage,
	description: siteConfig.description,
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang={siteConfig.locale} className="h-full antialiased" suppressHydrationWarning>
			<body className="flex min-h-full flex-col">
				<link rel="stylesheet" href={PRETENDARD_CSS} precedence="default" />
				<script
					type="application/ld+json"
					// biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD structured data
					dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
				/>
				<Providers>
					<SiteHeader />
					<main id="main-content" className="flex-1">
						{children}
					</main>
					<Footer />
					<FloatRail />
					<ConsultBar />
				</Providers>
				{process.env.VERCEL && <Analytics />}
				{process.env.NEXT_PUBLIC_GA_ID && <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />}
			</body>
		</html>
	);
}
