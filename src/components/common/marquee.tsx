"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";

// ─────────────────────────────────────────────
// 사용 예시 1: 텍스트 티커 (공지, 신뢰 문구 등)
// <Marquee items={textItems} />
//
// 사용 예시 2: 파트너 로고 슬라이더
// <Marquee items={logoItems} gap={48} speed={40} />
//
// 사용 예시 3: 고객 후기 한 줄 띠
// <Marquee items={reviewItems} direction="right" pauseOnHover />
// ─────────────────────────────────────────────

export type MarqueeTextItem = {
	type: "text";
	text: string;
};

export type MarqueeLogoItem = {
	type: "logo";
	src: string;
	alt: string;
	width?: number;
	height?: number;
};

export type MarqueeItem = MarqueeTextItem | MarqueeLogoItem;

type MarqueeProps = {
	items: MarqueeItem[];
	speed?: number; // 초. 클수록 느림 (기본 30)
	gap?: number; // 아이템 간격 px (기본 48)
	direction?: "left" | "right";
	pauseOnHover?: boolean;
	className?: string;
	itemClassName?: string;
	showDivider?: boolean; // 아이템 사이 구분자 표시
};

// ★ 설정: 기본 아이템 — 텍스트 또는 로고로 교체하세요
export const textItems: MarqueeItem[] = [
	{ type: "text", text: "✔ 무료 초기 상담" },
	{ type: "text", text: "✔ 비밀 보장" },
	{ type: "text", text: "✔ 시험 출신 행정사 직접 진행" },
	{ type: "text", text: "✔ 법무부 등록 출입국민원 대행기관" },
	{ type: "text", text: "✔ 현실적인 방향 제시" },
	{ type: "text", text: "✔ 한국어 · 영어 상담" },
];

export const logoItems: MarqueeItem[] = [
	{ type: "logo", src: "/partners/partner-1.png", alt: "파트너사 1", width: 120, height: 48 },
	{ type: "logo", src: "/partners/partner-2.png", alt: "파트너사 2", width: 120, height: 48 },
	{ type: "logo", src: "/partners/partner-3.png", alt: "파트너사 3", width: 120, height: 48 },
	{ type: "logo", src: "/partners/partner-4.png", alt: "파트너사 4", width: 120, height: 48 },
	{ type: "logo", src: "/partners/partner-5.png", alt: "파트너사 5", width: 120, height: 48 },
	{ type: "logo", src: "/partners/partner-6.png", alt: "파트너사 6", width: 120, height: 48 },
];

const MarqueeItemRenderer = ({ item, className }: { item: MarqueeItem; className?: string }) => {
	if (item.type === "logo") {
		return (
			<div className={cn("flex items-center justify-center", className)}>
				<Image
					src={item.src}
					alt={item.alt}
					width={item.width ?? 120}
					height={item.height ?? 48}
					className="h-10 w-auto object-contain opacity-60 grayscale transition-all hover:opacity-100 hover:grayscale-0"
				/>
			</div>
		);
	}
	return (
		<span className={cn("whitespace-nowrap font-medium text-sm", className)}>{item.text}</span>
	);
};

export const Marquee = ({
	items,
	speed = 30,
	gap = 48,
	direction = "left",
	pauseOnHover = true,
	className,
	itemClassName,
	showDivider = false,
}: MarqueeProps) => {
	const prefersReducedMotion = useReducedMotion();

	// 아이템 수에 비례한 애니메이션 duration
	const duration = items.length * speed;
	const xStart = direction === "left" ? "0%" : "-50%";
	const xEnd = direction === "left" ? "-50%" : "0%";

	// 모션 감소 설정 시 정적 목록으로 표시
	if (prefersReducedMotion) {
		return (
			<div
				className={cn(
					"flex flex-wrap items-center justify-center gap-6 overflow-hidden",
					className,
				)}
				style={{ gap }}
			>
				{items.map((item) => {
					const id = item.type === "text" ? item.text : item.src;
					return (
						<div key={id} className="flex shrink-0 items-center">
							<MarqueeItemRenderer item={item} className={itemClassName} />
						</div>
					);
				})}
			</div>
		);
	}

	return (
		<div className={cn("overflow-hidden", className)}>
			<motion.div
				className="flex w-max"
				animate={{ x: [xStart, xEnd] }}
				transition={{ duration, ease: "linear", repeat: Number.POSITIVE_INFINITY }}
				// hover 시 정지
				whileHover={pauseOnHover ? { animationPlayState: "paused" } : undefined}
				style={{ gap }}
			>
				{/* 원본 + 복사본 (무한 루프용) — group prefix로 key 중복 방지 */}
				{(["a", "b"] as const).flatMap((group) =>
					items.map((item) => {
						const id = item.type === "text" ? item.text : item.src;
						return (
							<div key={`${group}-${id}`} className="flex shrink-0 items-center" style={{ gap }}>
								<MarqueeItemRenderer item={item} className={itemClassName} />
								{showDivider && (
									<span className="text-muted-foreground/30" aria-hidden>
										·
									</span>
								)}
							</div>
						);
					}),
				)}
			</motion.div>
		</div>
	);
};

// ─────────────────────────────────────────────
// 섹션 래퍼: 파트너사 로고 띠로 바로 쓸 수 있음
// <LogoBand /> 로 바로 import해서 사용 가능
// ─────────────────────────────────────────────
export const LogoBand = () => {
	return (
		<section className="border-y bg-muted/30 py-10">
			<p className="mb-6 text-center font-medium text-muted-foreground text-sm">
				함께하는 파트너사
			</p>
			<Marquee items={logoItems} gap={64} speed={40} showDivider={false} />
		</section>
	);
};

// ─────────────────────────────────────────────
// 섹션 래퍼: 신뢰도 텍스트 띠
// <TrustBand /> 로 바로 import해서 사용 가능
// ─────────────────────────────────────────────
export const TrustBand = () => {
	return (
		<section className="border-border/60 border-y bg-secondary/40 py-3.5">
			<Marquee
				items={textItems}
				gap={64}
				speed={20}
				showDivider
				itemClassName="font-medium text-secondary-foreground/90 text-sm"
			/>
		</section>
	);
};
