"use client";

import { ThemeProvider } from "next-themes";

// 행정사 사무소 — 밝은 톤 고정(로어스/파운더스 모두 라이트 전용). 다크모드 비활성화.
export const Providers = ({ children }: { children: React.ReactNode }) => {
	return (
		<ThemeProvider
			attribute="class"
			defaultTheme="light"
			enableSystem={false}
			disableTransitionOnChange
		>
			{children}
		</ThemeProvider>
	);
};
