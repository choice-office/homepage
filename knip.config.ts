import type { KnipConfig } from "knip";

const config: KnipConfig = {
	// Next.js 플러그인이 app/ 라우트(page, layout, error, loading 등)를 자동 인식
	// 섹션 템플릿/공통 컴포넌트/레이아웃/유틸은 선택적으로 쓰이므로 엔트리로 등록
	entry: [
		// Next.js app 라우트 (플러그인이 자동 처리)
		"src/app/**/*.{ts,tsx}",
		// 섹션 — 프로젝트마다 일부만 page.tsx에 넣는 구조이므로 엔트리 취급
		"src/components/sections/**/*.{ts,tsx}",
		// 공통 컴포넌트 — FadeIn, Marquee 등 재사용 템플릿
		"src/components/common/**/*.{ts,tsx}",
		// 레이아웃 — Header, Footer
		"src/components/layout/**/*.{ts,tsx}",
		// 유틸/설정/타입
		"src/lib/**/*.ts",
		"src/config/**/*.ts",
		"src/types/**/*.ts",
	],

	// shadcn/ui — pnpx shadcn으로 관리. knip 분석 대상 제외
	ignore: ["src/components/ui/**"],

	ignoreDependencies: [
		// CLI 도구 — import 없이 pnpx로만 사용
		"shadcn",
		// @tailwindcss/postcss의 peer dependency — 직접 import 없이 PostCSS가 내부 참조
		"postcss",
	],

	// 파일 내부에서만 사용하는 export는 오탐 제외
	ignoreExportsUsedInFile: true,
};

export default config;
