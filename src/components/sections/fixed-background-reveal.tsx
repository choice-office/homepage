import Image from "next/image";
import { FadeIn } from "@/components/common/fade-in";
import { cn } from "@/lib/utils";

// ─────────────────────────────────────────────────────────────
// FixedBackgroundReveal — 배경이 화면에 고정된 상태에서 콘텐츠 블록이
// 위로 스크롤되고, 블록 사이 간격에서 배경이 조금씩 드러나는 효과.
//
// 교체할 것:
// 1. BACKGROUND_IMAGE — /public/ 기준 배경 이미지 (1920×1080 권장)
// 2. OVERLAY — 오버레이 농도 "none" | "light" | "medium" | "dark"
// 3. HERO_TITLE, HERO_SUBTITLE — 첫 화면 텍스트 (빈 문자열이면 숨김)
// 4. blocks 배열 — 콘텐츠 블록 (eyebrow, title, body, align)
//
// iOS Safari 참고: bg-attachment:fixed 버그를 우회하기 위해
// sticky + marginBottom:-100vh 트릭으로 배경 고정을 구현함.
// ─────────────────────────────────────────────────────────────

type RevealBlock = {
	eyebrow?: string;
	title: string;
	body: string;
	align?: "left" | "center" | "right";
};

// ★ 설정
const BACKGROUND_IMAGE = "/hero/reveal-bg.jpg";
const BACKGROUND_ALT = "배경 이미지";
const OVERLAY: "none" | "light" | "medium" | "dark" = "medium";
const HERO_TITLE = "잊지 못할 추억을 꿈꾸다";
const HERO_SUBTITLE = "PASSÉ POOL VILLA";

const blocks: RevealBlock[] = [
	{
		eyebrow: "ABOUT",
		title: "자연과 하나되는 공간",
		body: "도심을 벗어나 자연 속에서 온전한 휴식을 경험하세요. 세심하게 설계된 공간이 당신만의 특별한 시간을 선사합니다.",
		align: "center",
	},
	{
		eyebrow: "SERVICE",
		title: "프리미엄 서비스",
		body: "편지 서비스, 수영장, 카메라 대여까지. 세심하게 준비된 서비스로 특별한 시간을 완성합니다.",
		align: "center",
	},
	{
		eyebrow: "RESERVE",
		title: "지금 바로 예약하세요",
		body: "한정된 객실로 운영되어 미리 예약을 권장드립니다. 소중한 날을 함께 만들어보세요.",
		align: "center",
	},
];

const overlayClass = {
	none: "",
	light: "bg-black/20",
	medium: "bg-black/40",
	dark: "bg-black/60",
};

const textAlignClass = {
	left: "text-left",
	center: "text-center",
	right: "text-right",
};

export const FixedBackgroundReveal = () => {
	return (
		<div id="reveal" className="relative">
			{/* 배경 고정 — sticky + marginBottom:-100vh 으로 iOS Safari 호환 */}
			<div className="sticky top-0 -z-10 h-screen" style={{ marginBottom: "-100vh" }}>
				<Image src={BACKGROUND_IMAGE} alt={BACKGROUND_ALT} fill className="object-cover" priority />
				<div className={cn("absolute inset-0", overlayClass[OVERLAY])} />
			</div>

			{/* 첫 화면 — 배경만 보이는 구간 */}
			<div className="relative flex h-screen flex-col items-center justify-center px-4">
				{(HERO_TITLE || HERO_SUBTITLE) && (
					<FadeIn className="text-center">
						{HERO_SUBTITLE && (
							<p className="mb-4 font-medium text-sm text-white/80 uppercase tracking-widest">
								{HERO_SUBTITLE}
							</p>
						)}
						{HERO_TITLE && (
							<h2 className="font-bold text-4xl text-white tracking-tight sm:text-5xl lg:text-6xl">
								{HERO_TITLE}
							</h2>
						)}
					</FadeIn>
				)}

				{/* 스크롤 유도 인디케이터 */}
				<div className="absolute bottom-8 left-1/2 -translate-x-1/2">
					<div className="flex h-10 w-6 items-start justify-center rounded-full border-2 border-white/50 p-1">
						<div className="h-2 w-1 animate-bounce rounded-full bg-white/70" />
					</div>
				</div>
			</div>

			{/* 콘텐츠 블록 — 배경 위를 스크롤하며 블록 사이에서 배경 노출 */}
			{blocks.map((block, i) => (
				<div key={block.title}>
					<FadeIn>
						<div className="bg-background px-4 py-20 sm:px-6 lg:px-8">
							<div
								className={cn("mx-auto w-full max-w-3xl", textAlignClass[block.align ?? "center"])}
							>
								{block.eyebrow && (
									<p className="mb-3 font-medium text-primary text-sm uppercase tracking-widest">
										{block.eyebrow}
									</p>
								)}
								<h3 className="font-bold text-2xl tracking-tight sm:text-3xl">{block.title}</h3>
								<p className="mt-4 text-lg text-muted-foreground leading-relaxed">{block.body}</p>
							</div>
						</div>
					</FadeIn>

					{/* 블록 사이 투명 간격 — 여기서 배경이 드러남 */}
					{i < blocks.length - 1 && <div className="h-32 sm:h-48" />}
				</div>
			))}

			{/* 마지막 여백 */}
			<div className="h-24" />
		</div>
	);
};
