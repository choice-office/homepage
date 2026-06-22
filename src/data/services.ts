import {
	Briefcase,
	Flag,
	Globe,
	GraduationCap,
	Heart,
	type LucideIcon,
	Mic,
	ShieldCheck,
	UserPlus,
} from "lucide-react";

export type ServiceDetail = {
	target?: string; // 대상
	documents?: string[]; // 필요 서류
	process?: string[]; // 처리 절차
	duration?: string; // 예상 소요 기간
};

export type Service = {
	slug: string;
	code: string; // 비자 코드 표기
	title: string;
	summary: string;
	icon: LucideIcon;
	detail?: ServiceDetail; // 상세 페이지 콘텐츠 (확보된 분야만)
};

// ★ 업무분야 8종 — 클라이언트 확정 목록. detail 이 있는 분야만 상세 페이지가 풍부하게 채워짐.
export const services: Service[] = [
	{
		slug: "short-term-invitation",
		code: "C-3 · C-4",
		title: "단기초청",
		summary: "단기방문·단기취업 초청 및 사증 발급 지원, 초청 사유별 서류 안내.",
		icon: UserPlus,
	},
	{
		slug: "intra-company",
		code: "D-7 · D-8",
		title: "주재원 · 고위임원",
		summary: "기업 주재원·투자기업 임직원의 체류자격 신청 및 연장 대행.",
		icon: Briefcase,
	},
	{
		slug: "entertainer-e6",
		code: "E-6",
		title: "연예인 비자",
		summary: "한국에서 활동하려는 외국인 모델·배우·가수 등을 위한 예술흥행 비자.",
		icon: Mic,
		detail: {
			target: "한국에서 모델, 배우, 가수 등으로 활동하기를 희망하는 외국인",
			documents: ["문화체육관광부 추천서(필수)", "활동 계약서 등 활동 증빙", "신청인 신분 서류"],
			duration: "약 2 ~ 3개월",
		},
	},
	{
		slug: "professional-e7",
		code: "E-7",
		title: "전문직 비자",
		summary: "특정활동(전문인력) 체류자격 신청 및 자격 요건 검토.",
		icon: GraduationCap,
	},
	{
		slug: "overseas-korean-f4",
		code: "F-4",
		title: "재외동포 · 거소증",
		summary: "재외동포(F-4) 자격 신청과 국내거소신고증(거소증) 발급 대행.",
		icon: Globe,
		detail: {
			target: "재외동포 자격으로 국내 체류·거소신고를 원하는 분",
			documents: ["본국 범죄경력증명서 + 아포스티유", "시민권증서 원본"],
			duration: "약 2 ~ 5주",
		},
	},
	{
		slug: "permanent-residency-f5",
		code: "F-5",
		title: "영주권",
		summary: "영주(F-5) 자격 요건 검토 및 신청 대행.",
		icon: ShieldCheck,
	},
	{
		slug: "marriage-f6",
		code: "F-6",
		title: "결혼비자",
		summary: "국민의 배우자(F-6) 사증·체류자격 신청 및 심사 대비 지원.",
		icon: Heart,
	},
	{
		slug: "nationality-recovery",
		code: "국적회복",
		title: "국적회복",
		summary: "과거 대한민국 국적을 보유했던 분의 국적회복 허가 신청 대행.",
		icon: Flag,
		detail: {
			target: "대한민국 국적을 상실·이탈했던 분 (만 65세 이상 국적회복 포함)",
			documents: ["시민권증서 원본"],
			duration: "심사 기간 약 8개월 ~ 1년 이상",
		},
	},
];

// 문의 폼 "상담 희망 분야" 드롭다운 옵션 (클라이언트 지정)
export const consultFields = [
	"E-6 연예인 비자",
	"E-7 전문직 비자",
	"거소증 (F-4)",
	"영주권 (F-5)",
	"결혼비자 (F-6)",
	"국적회복",
	"기타",
] as const;
