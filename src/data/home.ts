import {
	CalendarCheck,
	ClipboardList,
	Compass,
	FileCheck2,
	type LucideIcon,
	MessageSquare,
	Stamp,
	UserCheck,
} from "lucide-react";

// ── Hero ────────────────────────────────────────────────────────────────────
export const heroContent = {
	eyebrow: "출입국 · 비자 전문 행정사",
	headline: "복잡한 행정 절차,",
	headlineHighlight: " 혼자 고민하지 마세요",
	subtitle:
		"거소증·영주권·결혼비자부터 외국인 연예인·전문직 비자, 국적회복까지 — 시험 출신 행정사가 상담부터 접수까지 직접 책임지고 함께합니다.",
	primaryCta: { label: "무료 상담 신청", href: "/#contact" },
	secondaryCta: { label: "업무분야 보기", href: "/services" },
	trustLine: "사무장 없는 사무소 · 시험 출신 행정사 직접 상담 · 법무부 등록 출입국민원 대행기관",
	// 임시 무료 스톡(Unsplash, 도심 마천루). 실제 광화문/사무실 사진 받으면 이 URL만 교체.
	image:
		"https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&q=80&auto=format&fit=crop",
};

// 신뢰 띠(TrustBand) 문구는 common/marquee.tsx 의 textItems 에서 관리합니다.

// ── 사무소 강점 / 차별점 ──────────────────────────────────────────────────────
export type Strength = { icon: LucideIcon; title: string; description: string };

export const strengths: Strength[] = [
	{
		icon: CalendarCheck,
		title: "비자 전문 사무소",
		description:
			"2019년 개소 이후 출입국·비자 업무를 전문으로 운영하며 다양한 사례를 직접 다뤄왔습니다.",
	},
	{
		icon: UserCheck,
		title: "행정사가 직접 책임",
		description:
			"사무장 없는 사무소. 상담부터 서류 작성·접수까지 전 과정을 시험 출신 행정사가 직접 수행합니다.",
	},
	{
		icon: Compass,
		title: "현실적인 방향 제시",
		description:
			"단정적 약속 대신, 의뢰인의 상황을 정확히 검토해 가능한 방향을 솔직하게 안내합니다.",
	},
];

// ── 처리 프로세스 ─────────────────────────────────────────────────────────────
export type ProcessStep = { icon: LucideIcon; title: string; description: string };

export const processSteps: ProcessStep[] = [
	{
		icon: MessageSquare,
		title: "상담 신청",
		description: "전화 또는 온라인으로 무료 초기 상담을 신청합니다.",
	},
	{
		icon: ClipboardList,
		title: "검토 · 방향 진단",
		description: "체류자격과 요건을 검토해 의뢰인 상황에 맞는 현실적인 방향을 제시합니다.",
	},
	{
		icon: FileCheck2,
		title: "서류 작성 · 준비",
		description: "필요 서류를 안내하고 신청 서류를 정확하게 작성·준비합니다.",
	},
	{
		icon: Stamp,
		title: "접수 · 대행 → 결과 안내",
		description: "출입국민원 대행기관으로 직접 접수하고, 진행 상황과 결과를 안내드립니다.",
	},
];

// ── 신뢰 지표 (카운트업) ──────────────────────────────────────────────────────
// 누적 상담 건수 등 실제 수치는 클라이언트 확인 후 교체 가능.
export type HomeStat = {
	value: number;
	prefix?: string;
	suffix?: string;
	label: string;
	description?: string;
};

export const stats: HomeStat[] = [
	{ value: 7, suffix: "년+", label: "비자·출입국 전문 경력", description: "2019년 개소 이후" },
	{ value: 8, suffix: "개+", label: "전문 취급 분야", description: "E·F 비자 및 국적 업무" },
	{ value: 100, suffix: "%", label: "행정사 직접 진행", description: "사무장 없는 1:1 책임 상담" },
	{ value: 2, suffix: "개 언어", label: "상담 가능", description: "한국어 · 영어" },
];

// ── 상담 안내 (CTA) ───────────────────────────────────────────────────────────
export const ctaContent = {
	headline: "상담이 필요하신가요?",
	subtitle:
		"외부 출장이 많아 내방 상담은 반드시 사전 연락 부탁드립니다. 전화 또는 온라인으로 편하게 문의해 주세요.",
};

// ── 인사말 (홈 소개 / 사무소 소개 페이지 공용) ─────────────────────────────────
export const greeting = {
	title: "‘실력에 책임감을 더한’ 초이스 행정사 사무소입니다.",
	paragraphs: [
		"안녕하십니까. ‘실력에 책임감을 더한’ 초이스 행정사 사무소입니다.",
		"살다 보면 익숙하지 않은 행정 절차 앞에서 무엇부터 시작해야 할지, 어떤 정보가 정확한지 판단하기 어려운 막막한 순간이 있습니다. 초이스 행정사 사무소는 그런 상황에서 의뢰인의 입장에서 함께 길을 찾아드리는 역할을 하고 있습니다.",
		"2019년 사무소 개소 이후 외국인 체류 및 비자, 출입국 관련 행정 업무를 중심으로 다양한 사례를 직접 다뤄오며 실무 경험을 쌓아왔습니다. 이러한 경험을 바탕으로 의뢰인분들의 각 상황에 맞는 현실적인 방향을 안내드리고 있습니다.",
		"복잡한 행정 절차 앞에서 혼자 고민하지 마세요. 초이스 행정사 사무소가 곁에서 함께하겠습니다.",
	],
};
