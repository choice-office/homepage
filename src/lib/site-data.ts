/* 초이스 행정사 — 콘텐츠 데이터 (Claude Design 포팅) */

export const HERO_IMG = "/page-hero.png";

/* 홈 히어로 전용 이미지(서브페이지 PageHero와 분리) */
export const HOME_HERO_IMG = "/home/home-hero.png";

/* 인사말 사무소 전경 이미지 */
export const OFFICE_IMG = "/greeting/office.png";

export type NavItem = {
	label: string;
	route: string;
	children?: { label: string; route: string }[] | null;
};

/* 라우팅 메뉴 (메가메뉴 포함) */
export const NAV: NavItem[] = [
	{
		label: "사무소 소개",
		route: "greeting",
		children: [
			{ label: "인사말", route: "greeting" },
			{ label: "구성원", route: "profile" },
			{ label: "오시는 길", route: "location" },
			{ label: "자주 묻는 질문", route: "faq" },
		],
	},
	{ label: "업무분야", route: "services", children: null },
	{ label: "의뢰인 후기", route: "reviews" },
	{ label: "블로그", route: "blog" },
	{ label: "문의하기", route: "contact" },
];

/* 히어로 하단 강점 캐러셀(파운더스식 탭형 슬라이더). 슬라이드별 감성 카피 + 하이라이트 1줄. */
export type StrengthSlide = {
	no: string;
	tab: string;
	icon: string;
	img: string;
	title: string;
	lines: string[];
	highlightIndex: number;
	cta: { label: string; route: string };
};

export const STRENGTH_SLIDES: StrengthSlide[] = [
	{
		no: "01",
		tab: "출입국 업무 전문",
		icon: "globe-2",
		img: "/home/home-1.png",
		title: "수많은 경험이 쌓이면,\n해결 방법도 달라집니다.",
		lines: [
			"출입국 업무는 같은 비자를 준비하더라도",
			"개인의 상황에 따라 결과가 달라질 수 있습니다.",
			"초이스 행정사 사무소는",
			"다년간의 업무 경험을 바탕으로",
			"의뢰인에게 가장 적합한 방향을 찾아드립니다.",
		],
		highlightIndex: 1,
		cta: { label: "업무분야 보기", route: "services" },
	},
	{
		no: "02",
		tab: "사무장 없이 행정사가 직접 상담",
		icon: "badge-check",
		img: "/home/home-2.png",
		title: "사무장 없이,\n행정사가 직접 진행합니다.",
		lines: [
			"상담부터 서류 준비, 접수까지",
			"모든 과정을 시험 출신 행정사가 직접 담당합니다.",
			"의뢰인 한 분 한 분의 상황을 세심하게 살피고,",
			"책임감 있게 업무를 마무리합니다.",
		],
		highlightIndex: 1,
		cta: { label: "행정사 소개", route: "profile" },
	},
	{
		no: "03",
		tab: "비자·국적업무 누적 3,500건 이상",
		icon: "message-circle",
		img: "/home/home-3.png",
		title: "비자·국적업무\n누적 3,500건 이상",
		lines: [
			"수많은 상담과 다양한 업무 경험을 통해",
			"쌓아온 업무 노하우를 바탕으로",
			"복잡한 상황도 다각도로 검토하여",
			"의뢰인에게 적합한 해결 방향을 제시합니다.",
		],
		highlightIndex: 3,
		cta: { label: "상담 신청", route: "contact" },
	},
];

export type Member = {
	name: string;
	title: string;
	lead?: boolean;
	summary: string;
	tags: string[];
	career: { icon: string; text: string }[];
	reg: string;
	bio: { label: string; items: string[] }[];
};

/* 구성원 — 인원이 늘어도 자연스러운 구조(1명 → 2~3명 확장) */
export const TEAM: Member[] = [
	{
		name: "대표 행정사",
		title: "대표 행정사",
		lead: true,
		summary: "상담부터 접수까지 직접 책임지는 시험 출신 행정사",
		tags: [
			"F4비자 · 거소증",
			"영주권",
			"F6결혼비자",
			"외국인 연예인비자",
			"외국인 전문직 비자",
			"국적회복",
		],
		career: [
			{ icon: "graduation-cap", text: "숙명여자대학교 졸업" },
			{ icon: "building-2", text: "외국계기업 6년 근무" },
			{ icon: "award", text: "제6회 행정사 시험 합격" },
			{ icon: "badge-check", text: "한국시험행정사회 자문위원" },
		],
		reg: "행정사 등록번호 18102025537 · 출입국민원 대행기관 19-SB-RG-016",
		bio: [
			{ label: "학력", items: ["숙명여자대학교"] },
			{
				label: "주요 경력",
				items: [
					"現 초이스 행정사사무소 대표 행정사",
					"前 출입국업무 전문 행정사사무소 근무",
					"前 외국계기업 6년 근무",
				],
			},
			{
				label: "보유 자격",
				items: [
					"행정사",
					"민원행정상담사",
					"행정처분구제분석사",
					"학교폭력예방상담사",
					"다문화심리상담사 1급",
				],
			},
			{
				label: "소속",
				items: [
					"대한행정사회 정회원",
					"한국시험행정사회 정회원",
					"한국시험행정사회 자문위원",
					"대한행정사협회 공로상 수상",
				],
			},
			{
				label: "교육 이수",
				items: [
					"미국 어학연수",
					"대한행정사회 출입국업무 전문가과정 이수",
					"대한행정사회 출입국관리 실무과정 이수",
					"대한행정사회 출입국 VISA업무 실전과정 이수",
					"대한행정사회 중앙교육연수원 연수교육 이수",
					"공인행정사협회 역량강화 교육 이수",
					"행정심판 전문가과정",
					"이민행정업무 체류실무특강",
					"민사분쟁에서 행정사의 업무와 역할",
					"민간자격증·비영리법인 설립 외 다수",
				],
			},
			{
				label: "봉사활동",
				items: [
					"서울 국제 마라톤대회 자원봉사",
					"서울 국제 휠체어마라톤대회 자원봉사",
					"서울 Terry Fox Run 자원봉사",
					"한국여성재단 ‘엄마에게 희망을’ 모금봉사",
					"JA Korea 경제교육봉사단",
					"캄보디아 해외봉사",
					"서울 G-20 정상회담 자원봉사",
				],
			},
		],
	},
];

// ★ 연락처/주소 단일 출처 — 전화·주소·이메일은 여기만 바꾸면 사이트 전체에 반영된다.
export const CONTACT = {
	phone: { display: "02-6959-9886", href: "tel:0269599886" },
	mobile: { display: "010-8259-9890", href: "tel:01082599890", note: "외부 출장 중 급한 문의 시" },
	kakao: { handle: "koreavisa8", href: "https://pf.kakao.com/" },
	wechat: { handle: "koreavisa8" },
	email: "choice@kvisa1345.com",
	address: "서울특별시 중구 세종대로 136, 서울파이낸스센터 3층 (우)04520",
	addressNote: "5호선 광화문역 5번 출구 · 1호선 시청역 프레스센터 출구(4번 출구 방향)",
	hours: "평일 10:00 – 18:00",
} as const;

export const CHANNELS = [
	{
		icon: "phone",
		label: "전화 상담",
		value: CONTACT.phone.display,
		href: CONTACT.phone.href,
		note: null as string | null,
	},
	{
		icon: "phone-call",
		label: "전화 상담 (휴대폰)",
		value: CONTACT.mobile.display,
		href: CONTACT.mobile.href,
		note: null as string | null,
	},
	{
		icon: "message-circle",
		label: "카카오톡 & 微信(WeChat)",
		value: CONTACT.kakao.handle,
		href: CONTACT.kakao.href as string | null,
		note: null as string | null,
	},
	{
		icon: "mail",
		label: "이메일",
		value: CONTACT.email,
		href: `mailto:${CONTACT.email}`,
		note: null as string | null,
	},
];

/* 유튜브 쇼츠(세로 9:16) — 'Korea Visa Master' 채널. 값은 쇼츠 URL 뒤 영상 ID. */
export const SHORTS = ["bDbzEqjUZ8c", "R0b8ByqZybI", "RsoaBz7t1DM", "GoUMPDmAML0"];
export const YOUTUBE_CHANNEL = "https://www.youtube.com/@kvisa1345";
export const NAVER_BLOG = "https://blog.naver.com/k-visa1345";
export const INSTAGRAM = "https://www.instagram.com/hikoreavisa1345/";

export type Service = {
	id: string;
	icon: string;
	code: string;
	title: string;
	summary: string;
	target: string[];
	docs: string[];
	steps: string[];
	period: string;
	periodNote: string;
	ctaSubject: string;
	// 일부 분야에만 있는 세부 대상 요건 — 상세에서 접이식으로 노출(기본 접힘, DOM에 항상 존재해 색인·접근 가능)
	eligibility?: string[];
};

/* 업무분야 — 메가메뉴 순서. 각 분야 상세 페이지 데이터 포함. */
export const SERVICES: Service[] = [
	{
		id: "short",
		icon: "user-plus",
		code: "C3비자 · C4비자",
		title: "단기초청",
		summary: "단기방문·단기취업 초청, 초청 사유별 서류 안내.",
		target: [
			"국내 행사·방문·단기취업을 위해 외국인을 초청하려는 개인 또는 기업",
			"관광·상용·친지 방문 등 단기 체류를 준비하는 외국인",
		],
		docs: ["초청 사유서 및 초청장", "초청인·피초청인 신분 증빙 서류", "초청 목적별 추가 입증 자료"],
		steps: ["상담", "상황별 필요서류 안내 · 검토", "필요서류 준비 및 작성 대행", "결과 안내"],
		period: "약 6주~8주",
		periodNote: "의뢰인의 상황과 재외공관 상황에 따라 달라질 수 있습니다.",
		ctaSubject: "단기초청 비자",
		eligibility: [
			"외국기업 국내지사, 외국인 투자기업 등의 설치 준비를 위해 활동하거나 국내 지사 등과 업무 연락을 하는 자",
			"국내 공·사 기관의 초청으로 국내업체와 구매계약·시장조사·상담 등의 활동을 하려는 자",
			"수출입기계 등의 설치·보수·검수·운용요령 습득 등 목적으로 단기간 체류하려는 자",
			"그 외 상용목적으로 단기간 체류하려는 자",
			"수익을 목적으로 단기간 취업활동을 하려는 자",
		],
	},
	{
		id: "resident",
		icon: "briefcase",
		code: "D7비자 · D8비자",
		title: "주재원 · 고위임원",
		summary: "기업 주재원·투자기업 임직원의 체류자격 신청 및 연장 대행.",
		target: [
			"해외 본사에서 국내 지점·법인으로 파견되는 주재원",
			"외국인투자기업의 등기 임원 및 핵심 전문인력",
		],
		docs: [
			"파견 명령서 또는 임명 서류",
			"본사·국내 법인 간 관계 증빙",
			"사업자등록증·법인 등기부등본",
			"재직·급여 증빙 및 학력·경력 서류",
		],
		steps: [
			"체류자격 요건 검토",
			"회사·개인 서류 안내 및 준비",
			"체류자격 신청 또는 변경·연장 대행",
			"접수 및 결과 안내",
		],
		period: "약 6주~8주",
		periodNote: "의뢰인의 상황과 재외공관 및 출입국사무소의 심사 일정에 따라 달라질 수 있습니다.",
		ctaSubject: "주재원 · 고위임원 비자",
	},
	{
		id: "e6",
		icon: "mic",
		code: "E6비자",
		title: "외국인 연예인 비자",
		summary: "모델·배우·가수 등 예술흥행(E6비자) 활동을 위한 사증 발급 또는 비자 변경.",
		target: [
			"국내에서 공연·방송·광고·모델 활동을 하려는 외국인",
			"기획사·에이전시를 통해 외국인 아티스트를 초청하려는 기업",
		],
		docs: [
			"대중문화예술기획업등록증",
			"계약서·신원보증서",
			"활동계획서 및 증빙서류",
			"소속사 사업자 서류",
			"경력증빙 및 포트폴리오",
		],
		steps: [
			"문화체육관광부 추천서 접수",
			"출입국사무소 사증 신청",
			"재외공관에서 E6비자 접수",
			"외국인등록",
		],
		period: "약 2~3개월",
		periodNote:
			"의뢰인의 상황과 문화체육관광부 및 출입국사무소의 심사 일정에 따라 달라질 수 있습니다.",
		ctaSubject: "외국인 연예인 비자",
	},
	{
		id: "e7",
		icon: "graduation-cap",
		code: "E7비자",
		title: "외국인 취업비자",
		summary: "특정활동(전문인력, E7비자) 체류자격 신청 및 자격 요건 검토.",
		target: [
			"국내 기업에 전문인력으로 취업하려는 외국인",
			"외국인 전문인력을 채용하려는 국내 기업",
		],
		docs: [
			"고용계약서 및 사업자등록증",
			"학위증·경력증명서 아포스티유",
			"고용사유서 및 고용추천서",
			"회사 재무·고용 현황 서류",
		],
		steps: [
			"직무·학력·경력 요건 검토",
			"고용 기업 서류 준비 안내",
			"체류자격 신청 또는 변경 대행",
			"접수 및 결과 안내",
		],
		period: "약 6주~8주",
		periodNote: "의뢰인의 상황과 출입국사무소의 심사 일정에 따라 달라질 수 있습니다.",
		ctaSubject: "외국인 취업비자",
	},
	{
		id: "f4",
		icon: "globe",
		code: "F4비자",
		title: "재외동포 · 거소증",
		summary: "재외동포(F4비자) 자격 신청과 국내거소신고증(거소증) 발급 대행.",
		target: [
			"과거 대한민국 국적을 보유했거나 그 직계비속인 외국국적동포",
			"F4비자로 국내 거소신고가 필요한 재외동포",
		],
		docs: [
			"시민권증서 원본",
			"동포 입증 서류",
			"본국 범죄경력증명서 + 아포스티유 (아포스티유 미체결 국가는 영사확인)",
			"체류지 입증 서류",
		],
		steps: ["F4비자·거소증 접수", "심사", "국내거소신고증(거소증) 발급"],
		period: "약 2~5주",
		periodNote: "의뢰인의 상황과 출입국사무소의 심사 일정에 따라 달라질 수 있습니다.",
		ctaSubject: "재외동포비자 · 거소증",
	},
	{
		id: "f5",
		icon: "shield-check",
		code: "F5비자",
		title: "영주권",
		summary: "영주(F5비자) 자격 요건 검토 및 신청 대행, 점수제·요건별 준비 안내.",
		target: [
			"일정 기간 합법 체류 후 영주 자격을 준비하는 외국인",
			"점수제·투자·동포 등 영주 요건 해당 여부를 확인하려는 분",
		],
		docs: [
			"소득·재산 등 생계 유지 능력 증빙",
			"본국 범죄경력증명서 + 아포스티유",
			"사회통합프로그램 이수증(필요 시)",
			"체류지 입증 서류",
		],
		steps: [
			"영주 자격 유형·요건 진단",
			"부족 요건 점검 및 보완 안내",
			"F5비자 자격 신청 대행",
			"접수 및 결과 안내",
		],
		period: "약 8개월~1년 이상",
		periodNote: "의뢰인의 상황과 출입국사무소의 심사 일정에 따라 달라질 수 있습니다.",
		ctaSubject: "영주권(F5비자)",
	},
	{
		id: "f6",
		icon: "heart",
		code: "F6비자",
		title: "결혼비자",
		summary: "국민의 배우자(F6비자) 사증·체류자격 신청 및 심사 대비 지원.",
		target: ["대한민국 국민과 혼인한 외국인 배우자", "국제결혼 후 국내 체류·정착을 준비하는 부부"],
		docs: [
			"혼인관계 증빙 서류",
			"교제·관계 입증 서류",
			"초청인 소득 및 주거요건 증빙 서류",
			"한국어능력 관련 증빙 서류",
			"범죄경력증명서 및 건강검진결과(해당 시)",
		],
		steps: [
			"결혼비자 조건 진단",
			"관계 입증 및 소득 서류 안내",
			"사증 또는 체류자격 변경 서류 준비 및 작성 대행",
			"외국인등록",
		],
		period: "약 2~6개월",
		periodNote: "의뢰인의 상황과 재외공관 및 출입국사무소의 심사 일정에 따라 달라질 수 있습니다.",
		ctaSubject: "결혼비자(F6비자)",
	},
	{
		id: "nat",
		icon: "flag",
		code: "국적회복",
		title: "국적회복",
		summary: "과거 대한민국 국적을 보유했던 분의 국적회복 허가 신청 대행.",
		target: [
			"과거 대한민국 국적을 보유했다가 상실·이탈한 외국국적자",
			"만 65세 이상 재외동포 — 외국국적불행사 서약으로 복수국적 신청 가능",
		],
		docs: [
			"과거 한국국적 보유 입증 서류",
			"시민권증서 원본 등 외국국적 취득 관련 서류",
			"국적회복 진술서, 가족관계통보서",
			"성 또는 이름 변경 시 관련 입증 서류",
			"거소증 또는 외국인등록증",
		],
		steps: [
			"국적회복 가능성·결격 사유 검토",
			"본국·국내 서류 안내 및 준비",
			"국적회복 허가 신청 대행",
			"심사 진행 및 결과 안내",
		],
		period: "약 8개월~1년 이상",
		periodNote: "의뢰인의 상황과 출입국사무소의 심사 일정에 따라 달라질 수 있습니다.",
		ctaSubject: "국적회복",
	},
];

export const PROCESS = [
	{
		icon: "message-square",
		title: "상담",
		desc: "전화·카카오톡·이메일로\n초기 상담을 신청합니다.",
	},
	{
		icon: "clipboard-list",
		title: "검토 · 방향 제시",
		desc: "체류자격과 요건을 검토하여\n의뢰인에게 적합한 진행 방향을 제시합니다.",
	},
	{
		icon: "file-check-2",
		title: "서류 작성 · 준비",
		desc: "필요한 서류를 안내드리고, 신청 서류를 정확하게 작성·준비해 드립니다.",
	},
	{
		icon: "stamp",
		title: "접수 · 결과 안내",
		desc: "관할 출입국사무소에 접수하고,\n진행 상황과 심사 결과를 안내드립니다.",
	},
];

export const STATS = [
	{ v: "Since 2019", l: "출입국 업무 전문" },
	{ v: "3,500+", l: "수많은 업무 경험" },
	{ v: "법무부 등록", l: "출입국민원 대행기관" },
	{ v: "100%", l: "시험 출신 행정사 직접 진행" },
];

export const FAQ = [
	{
		q: "‘행정사’는 어떤 일을 하는 사람인가요?",
		a: "비자·출입국, 각종 인허가 등 행정기관에 제출하는 서류 작성과 신청을 대신 수행하는 국가공인 자격사입니다. 복잡한 행정 절차를 보다 정확하고 효율적으로 진행할 수 있도록 도움을 드립니다.",
	},
	{
		q: "어떤 행정사에게 의뢰하는 것이 좋을까요?",
		a: "비자·출입국 업무는 각자의 상황에 맞는 방향을 정확히 설정하는 것이 중요하고, 이를 위해선 다양한 사례를 다뤄본 실무 경험이 필요합니다. 해당 분야를 직접 다뤄봤는지, 상담부터 진행까지 행정사가 직접 책임지고 처리하는지 확인하시길 권합니다.",
	},
	{
		q: "행정사님께서 직접 상담해 주시나요?",
		a: "초이스 행정사 사무소는 사무장 없는 사무소로, 상담부터 전 과정을 행정사가 직접 진행합니다.",
	},
	{
		q: "비자·출입국 업무 경험이 많으신가요?",
		a: "2018년 외국인 체류자가 가장 많은 경기도 안산시 소재 행정사 사무소에서 업무를 시작으로, 2019년 개업 이후 외국인 체류·비자·출입국 관련 다양한 사례를 직접 다뤄오며 풍부한 실무 경험을 쌓아왔습니다.",
	},
	{
		q: "어떤 비자 업무를 주로 진행하시나요?",
		a: "한국에 체류하고 있거나 체류하고자 하는 외국인과 관련된 비자를 중심으로 F4비자·거소증, 영주권, 결혼비자, 외국인 연예인 비자, 외국인 취업비자, 국적회복 등을 전문으로 진행합니다.",
	},
	{
		q: "출입국사무소에 직접 방문하지 않아도 진행이 가능한가요?",
		a: "초이스 행정사 사무소는 법무부에 정식으로 등록된 출입국민원 대행기관으로, 의뢰인이 출입국사무소에 방문하지 않아도 행정사 대행으로 접수가 가능합니다. (관련 법령에 따라 일부 업무 제외)",
	},
];

/* 해시 route → Next 경로 매핑 */
export const routePath = (route: string, param?: string | null): string => {
	switch (route) {
		case "home":
			return "/";
		case "greeting":
			return "/greeting";
		case "profile":
			return "/members";
		case "location":
			return "/location";
		case "services":
			return "/services";
		case "service":
			return `/services/${param}`;
		case "reviews":
			return "/reviews";
		case "faq":
			return "/faq";
		case "blog":
			return "/blog";
		case "contact":
			return "/contact";
		default:
			return "/";
	}
};

// ── 의뢰인 후기 이미지 타입 ── 실데이터·이미지는 Supabase(review_images + storage)가 단일 출처.
// 공개 렌더: lib/review-images.ts. w/h = 라이트박스 원본 비율용 실측 해상도. (마스킹본만 등록)
export type ReviewImage = {
	src: string;
	w: number;
	h: number;
	tag: string; // 사건 유형
	quote: string; // 발췌 인용(각색 가능)
	meta: string; // 익명 속성
};
