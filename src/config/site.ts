/**
 * 사이트 전역 설정 — 초이스 행정사 사무소
 * 이 파일만 수정하면 Header, Footer, SEO, 연락처가 일괄 반영됨.
 */

export const siteConfig = {
	name: "초이스 행정사 사무소",
	description:
		"출입국·비자 전문 초이스 행정사 사무소. 거소증(F-4), 영주권(F-5), 결혼비자(F-6), 외국인 연예인(E-6)·전문직(E-7) 비자, 국적회복까지 시험 출신 행정사가 상담부터 직접 책임집니다.",
	url: "https://kvisa1345.com",
	ogImage: "https://kvisa1345.com/og.png",
	locale: "ko",
} as const;

export const navLinks = [
	{ href: "/about", label: "사무소 소개" },
	{ href: "/services", label: "업무분야" },
	{ href: "/reviews", label: "의뢰인 후기" },
	{ href: "/#faq", label: "자주 묻는 질문" },
	{ href: "/posts", label: "블로그" },
	{ href: "/#contact", label: "문의하기" },
] as const;

export const footerLinks = [
	{ href: "/privacy", label: "개인정보처리방침" },
	{ href: "/terms", label: "이용약관" },
] as const;

// 외부 채널 — 값이 비어 있으면 Footer에서 자동 제외
export const socialLinks = [
	{ href: "https://blog.naver.com/k-visa1345", label: "네이버 블로그" },
	// TODO: 유튜브 채널 정확한 URL 로 교체 (현재 검색명: Korea Visa Master)
	{ href: "https://www.youtube.com/@KoreaVisaMaster", label: "유튜브" },
] as const;

// 연락처 — Header / FloatingCta / Map / Contact 가 공유
export const contactInfo = {
	tel: "02-6959-9886",
	mobile: "010-8259-9890", // 긴급 상담용
	email: "choice@kvisa1345.com",
	// TODO: 카카오 채널 홈 URL 정확히 교체 (검색 ID: koreavisa8)
	kakaoUrl: "https://pf.kakao.com/_koreavisa8",
	address: "서울특별시 중구 세종대로 136, 서울파이낸스센터 3층",
	addressSub: "초이스 행정사 사무소",
	subway: "5호선 광화문역 5번 출구 · 1호선 시청역 프레스센터(4번 출구 방향)",
	hours: [{ day: "평일", time: "10:00 – 18:00" }] as const,
	hoursNote: "외부 출장이 많아 내방 상담은 반드시 사전 연락 부탁드립니다.",
} as const;

type BusinessInfo = {
	companyName?: string;
	ceo?: string;
	regNo?: string; // 사업자등록번호
	adminRegNo?: string; // 행정사 등록번호
	immigrationAgencyNo?: string; // 출입국민원 대행기관 등록번호
	address?: string;
	tel?: string;
	email?: string;
};

// ★ 사업자정보 — Footer 하단에 노출. 등록번호는 이 업종의 핵심 신뢰지표라 표기 권장.
// TODO: ceo(대표 행정사 성함) 확정되면 "○○○" 교체.
export const businessInfo: BusinessInfo | null = {
	companyName: "초이스 행정사사무소",
	ceo: "○○○",
	regNo: "464-11-00966",
	adminRegNo: "18102025537",
	immigrationAgencyNo: "19-SB-RG-016",
	address: "서울특별시 중구 세종대로 136, 서울파이낸스센터 3층",
	tel: "02-6959-9886",
	email: "choice@kvisa1345.com",
};
