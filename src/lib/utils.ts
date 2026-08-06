import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

// 가운뎃점(·) 뒤에서 줄이 끊겨 다음 줄이 점으로 시작하는 것을 막는다.
// word-break: keep-all 이어도 브라우저는 · 뒤를 줄바꿈 기회로 보므로, U+2060(word joiner)으로 양옆을 묶는다.
// 좁은 카드( "대상·서류·절차 안내" 등 )에서 필요. 공백이 있는 " · "는 공백에서 정상적으로 끊긴다.
export const bindMidDots = (text: string) => text.replace(/·/g, "\u2060·\u2060");

// 업무분야 요약문의 공통 꼬리말 — 8개 분야가 모두 이 문구로 끝난다(2026-08-05 수정요청).
const SUMMARY_TAIL = "대상·서류·절차 안내";

// 카드에서는 꼬리말을 항상 둘째 줄로 내려 8장의 리듬을 맞춘다(1줄=업무 범위 / 2줄=안내 항목).
// 꼬리말이 없는 문장은 그대로 한 덩어리로 반환한다.
export const splitSummaryTail = (text: string): [string, string | null] =>
	text.endsWith(SUMMARY_TAIL)
		? [text.slice(0, -SUMMARY_TAIL.length).trimEnd(), SUMMARY_TAIL]
		: [text, null];
