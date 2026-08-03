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
			// 스타일: self + inline (Tailwind, shadcn) + Google Fonts(블로그 글씨체)
			"style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
			// 이미지: self + 모든 https + data URI (next/image 최적화)
			"img-src 'self' data: blob: https:",
			// 폰트: self(Noto Sans KR next/font 자체 호스팅) + Google Fonts(블로그 글씨체)
			"font-src 'self' https://fonts.gstatic.com",
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

// Supabase Storage 이미지 호스트 — Next 16.2.1/Turbopack에서 next/image hostname 와일드카드(`*`/`**`)가
// project-ref 서브도메인(예: xxxx.supabase.co)을 매칭하지 못하는 회귀가 있다. exact 호스트는 정상 매칭되므로
// SUPABASE_URL에서 정확한 호스트를 뽑아 등록한다. 빌드 시 env가 비는 경우(프리뷰 등) 대비 알려진 호스트를 폴백으로 둔다.
const supabaseHosts = (() => {
	const hosts = new Set<string>(["pohfmrzgtoxdbwdsrckt.supabase.co"]);
	const url = process.env.SUPABASE_URL;
	if (url) {
		try {
			hosts.add(new URL(url).hostname);
		} catch {}
	}
	return [...hosts];
})();

const nextConfig: NextConfig = {
	// 빌드 산출물 위치. 기본은 .next 이지만, 시각 회귀 검증용 프로덕션 빌드는
	// 실행 중인 dev 서버와 .next 를 공유하면 서로를 깨뜨리므로 별도 디렉터리로 뺀다.
	//   NEXT_DIST_DIR=.next-visual pnpm build
	distDir: process.env.NEXT_DIST_DIR || ".next",

	// 프레임워크 정보(X-Powered-By: Next.js) 노출 제거 — 버전별 취약점 정찰 차단
	poweredByHeader: false,

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
		// AVIF 우선(더 작음) → WebP 폴백. next/image가 소스 포맷과 무관하게 최적 포맷으로 변환·전송.
		formats: ["image/avif", "image/webp"],
		// 실제 사용 도메인만 허용(오픈 이미지 프록시 방지). 새 출처 추가 시 여기에 등록.
		remotePatterns: [
			{ protocol: "https", hostname: "images.unsplash.com" },
			// 관리자에서 업로드한 블로그/후기 이미지(Supabase Storage) — exact 호스트로 등록(위 supabaseHosts 참고)
			...supabaseHosts.map((hostname) => ({ protocol: "https" as const, hostname })),
			// 유튜브 쇼츠 파사드 썸네일(클릭 전 표시)
			{ protocol: "https", hostname: "i.ytimg.com" },
		],
	},
};

export default nextConfig;
