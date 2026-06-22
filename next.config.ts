import type { NextConfig } from "next";

// ─────────────────────────────────────────────────────────────────────────────
// 보안 헤더 — 프로덕션 빌드 전용 (dev에서는 적용 안 함)
//
// CSP(Content Security Policy) 커스터마이징 가이드:
// - YouTube 섹션 사용 시: frame-src 에 'https://www.youtube.com' 이미 포함
// - Google Analytics 사용 시: script-src 에 'https://www.googletagmanager.com' 포함
// - 카카오맵 사용 시: script-src 에 't1.daumcdn.net' 포함, frame-src 에 'https://map.kakao.com' 추가
// - 네이버맵 임베드 사용 시: frame-src 에 'https://map.naver.com' 추가
// - 구글맵 임베드 사용 시: frame-src 에 'https://www.google.com/maps/embed' 추가
// - 외부 폰트/이미지 추가 시 해당 도메인을 CSP에 추가할 것
// - Supabase Storage 이미지 사용 시: img-src 에 '*.supabase.co' 추가
// ─────────────────────────────────────────────────────────────────────────────
const securityHeaders = [
	// 클릭재킹(Clickjacking) 방지
	{
		key: "X-Frame-Options",
		// DENY로 바꾸면 더 엄격. 카카오지도 iframe 등 사용 시 SAMEORIGIN 유지
		value: "SAMEORIGIN",
	},

	// MIME 타입 스니핑 방지
	{
		key: "X-Content-Type-Options",
		value: "nosniff",
	},

	// Referrer 정책 — 외부 링크 이동 시 full URL 대신 origin만 전달
	{
		key: "Referrer-Policy",
		value: "strict-origin-when-cross-origin",
	},

	// 브라우저 기능 권한 제한 (결제 위젯 사용 시 payment 항목 제거)
	{
		key: "Permissions-Policy",
		value: "camera=(), microphone=(), geolocation=()",
	},

	// DNS 프리페치 허용 (성능 향상)
	{
		key: "X-DNS-Prefetch-Control",
		value: "on",
	},

	// HTTPS 강제 (배포 환경에서만 의미 있음)
	{
		key: "Strict-Transport-Security",
		value: "max-age=63072000; includeSubDomains; preload",
	},

	// Content Security Policy
	{
		key: "Content-Security-Policy",
		value: [
			"default-src 'self'",
			// 스크립트: self + GA + Vercel Analytics + 카카오맵
			"script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://va.vercel-scripts.com https://t1.daumcdn.net",
			// 스타일: self + inline (Tailwind, shadcn)
			"style-src 'self' 'unsafe-inline'",
			// 이미지: self + 모든 https + data URI (next/image 최적화)
			"img-src 'self' data: blob: https:",
			// 폰트: self (next/font가 빌드 시 자체 호스팅)
			"font-src 'self'",
			// 연결: self + Supabase + GA + Vercel Analytics
			"connect-src 'self' https://*.supabase.co https://www.google-analytics.com https://va.vercel-scripts.com",
			// iframe: YouTube + Google Maps 임베드(오시는 길)
			"frame-src 'self' https://www.youtube.com https://www.google.com https://maps.google.com",
			// 미디어: self + blob (영상 배경 등)
			"media-src 'self' blob:",
			// 워커: self + blob
			"worker-src 'self' blob:",
		].join("; "),
	},
];

const nextConfig: NextConfig = {
	async headers() {
		// dev에서는 CSP가 Turbopack HMR WebSocket을 차단하므로 비활성화
		if (process.env.NODE_ENV !== "production") return [];
		return [
			{
				source: "/(.*)",
				headers: securityHeaders,
			},
		];
	},

	images: {
		remotePatterns: [
			{
				// TODO(배포 전): 모든 https 도메인 허용 → 실제 사용 도메인으로 좁힐 것
				// 예) { protocol: "https", hostname: "images.unsplash.com" }
				//     { protocol: "https", hostname: "*.supabase.co" }
				protocol: "https",
				hostname: "**",
			},
		],
	},
};

export default nextConfig;
