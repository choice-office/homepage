// FloatingCta 사용법:
// layout.tsx 또는 page.tsx 최하단에 추가하세요.
//
// import { FloatingCta } from "@/components/common/floating-cta";
// <FloatingCta />

import { Phone } from "lucide-react";
import { contactInfo } from "@/config/site";
import { cn } from "@/lib/utils";

type FloatingButton = {
	label: string;
	href: string;
	icon: React.ReactNode;
	className?: string;
};

// ★ 설정: 버튼 정보 — 연락처는 config/site.ts(contactInfo) 에서 관리
const buttons: FloatingButton[] = [
	{
		label: "전화 상담",
		href: `tel:${contactInfo.tel.replace(/-/g, "")}`,
		icon: <Phone className="h-5 w-5" />,
		className: "bg-primary text-primary-foreground hover:bg-primary/90",
	},
	{
		label: "카카오 상담",
		href: contactInfo.kakaoUrl,
		icon: (
			// 카카오 말풍선 아이콘 (SVG)
			<svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" role="img" aria-label="카카오톡">
				<title>카카오톡</title>
				<path d="M12 3C6.48 3 2 6.92 2 11.75c0 2.98 1.73 5.61 4.36 7.2L5.2 22.2a.5.5 0 0 0 .72.55l4.1-2.52c.64.09 1.3.14 1.98.14 5.52 0 10-3.92 10-8.75C22 6.92 17.52 3 12 3Z" />
			</svg>
		),
		className: "bg-[#FAE300] text-[#3A1D1D] hover:bg-[#FAE300]/90",
	},
];

// ★ 설정: 위치 — "right" | "left"
const POSITION = "right" as const;

export const FloatingCta = () => {
	return (
		<div
			className={cn(
				"fixed bottom-6 z-40 flex flex-col gap-3",
				POSITION === "right" ? "right-4 sm:right-6" : "left-4 sm:left-6",
			)}
		>
			{buttons.map((btn) => (
				<a
					key={btn.label}
					href={btn.href}
					target={btn.href.startsWith("http") ? "_blank" : undefined}
					rel={btn.href.startsWith("http") ? "noopener noreferrer" : undefined}
					aria-label={btn.label}
					className={cn(
						"group relative flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-all duration-200 hover:scale-110 hover:shadow-xl",
						btn.className,
					)}
				>
					{btn.icon}

					{/* 호버 툴팁 */}
					<span
						className={cn(
							"pointer-events-none absolute top-1/2 -translate-y-1/2 whitespace-nowrap rounded-md bg-foreground px-3 py-1.5 font-medium text-background text-xs opacity-0 shadow transition-opacity group-hover:opacity-100",
							POSITION === "right" ? "right-16" : "left-16",
						)}
					>
						{btn.label}
					</span>
				</a>
			))}
		</div>
	);
};
