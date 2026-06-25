/**
 * 사이트 전역 설정 — 초이스 행정사 사무소
 * SEO 메타데이터(layout/sitemap/robots/opengraph)와 법적고지 페이지가 참조한다.
 * 헤더·푸터·연락처 등 화면 콘텐츠는 src/lib/site-data.ts 에서 관리한다.
 */

export const siteConfig = {
	name: "초이스 행정사 사무소",
	description:
		"출입국·비자 전문 초이스 행정사 사무소. 거소증(F-4), 영주권(F-5), 결혼비자(F-6), 외국인 연예인(E-6)·전문직(E-7) 비자, 국적회복까지 시험 출신 행정사가 상담부터 직접 책임집니다.",
	url: "https://kvisa1345.com",
	ogImage: "https://kvisa1345.com/og.png",
	locale: "ko",
} as const;
