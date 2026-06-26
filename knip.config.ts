import type { KnipConfig } from "knip";

const config: KnipConfig = {
	// Next.js 플러그인이 app/ 라우트(page, layout, error, loading 등)를 자동 인식
	// 섹션 템플릿/공통 컴포넌트/레이아웃/유틸은 선택적으로 쓰이므로 엔트리로 등록
	entry: [
		// Next.js app 라우트 (플러그인이 자동 처리)
		"src/app/**/*.{ts,tsx}",
		// 공통 컴포넌트 — GoogleAnalytics 등 layout에서만 쓰는 템플릿
		"src/components/common/**/*.{ts,tsx}",
		// 유틸/설정/타입
		"src/lib/**/*.ts",
		"src/config/**/*.ts",
		"src/types/**/*.ts",
	],

	// shadcn/ui — pnpx shadcn으로 관리. knip 분석 대상 제외
	// design/ — 클로드디자인 export 원본(참고용 산출물)이라 분석 제외
	ignore: ["src/components/ui/**", "design/**", "scripts/**"],

	ignoreDependencies: [
		// CLI 도구 — import 없이 pnpx로만 사용
		"shadcn",
		// @tailwindcss/postcss의 peer dependency — 직접 import 없이 PostCSS가 내부 참조
		"postcss",
		// shadcn carousel(ui/carousel.tsx) 전용 peer deps — knip이 ui/ 미추적이라 오탐
		"embla-carousel-react",
		"embla-carousel-autoplay",
	],

	// 파일 내부에서만 사용하는 export는 오탐 제외
	ignoreExportsUsedInFile: true,
};

export default config;
