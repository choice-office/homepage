/* 초이스 행정사 — 콘텐츠 데이터 (Claude Design 포팅) */

export const HERO_IMG =
	"https://images.unsplash.com/photo-1723174391641-59eab110dd4f?w=1920&q=80&auto=format&fit=crop";

/* 홈 히어로 전용 이미지(서브페이지 PageHero와 분리) */
export const HOME_HERO_IMG = "/home-hero.jpeg";

/* 인사말 사무소 전경 이미지 */
export const OFFICE_IMG = "/office.png";

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
		tab: "2019년부터 출입국·비자",
		icon: "globe-2",
		img: "/home-1.png",
		title: "출입국·비자 전문, 2019년부터",
		lines: [
			"2019년 사무소를 연 이후로,",
			"줄곧 출입국과 비자 한 분야만 붙잡아 왔습니다.",
			"거소증, 영주권, 결혼비자, 국적회복까지",
			"겉은 비슷해 보여도 사안마다 풀어가는 길이 다릅니다.",
			"그 차이를 읽어내는 것이 저희가 해 온 일입니다.",
		],
		highlightIndex: 1,
		cta: { label: "업무분야 보기", route: "services" },
	},
	{
		no: "02",
		tab: "시험 출신 · 직접 수행",
		icon: "badge-check",
		img: "/home-2.png",
		title: "상담부터 접수까지, 직접",
		lines: [
			"전화를 받는 사람, 서류를 준비하는 사람,",
			"결과를 안내하는 사람이 모두 같습니다.",
			"시험을 거쳐 자격을 딴 행정사가",
			"처음부터 끝까지 직접 맡습니다.",
			"중간에 담당이 바뀌는 일은 없습니다.",
		],
		highlightIndex: 3,
		cta: { label: "행정사 소개", route: "profile" },
	},
	{
		no: "03",
		tab: "현실적인 방향 제시",
		icon: "message-circle",
		img: "/home-3.png",
		title: "상황에 맞는 현실적 방향",
		lines: [
			"무리해서 된다고 말하지 않습니다.",
			"지금 가능한지, 무엇이 부족한지",
			"먼저 솔직하게 말씀드립니다.",
			"기간도 절차도 있는 그대로 안내하고,",
			"확실하지 않은 건 확실하지 않다고 합니다.",
		],
		highlightIndex: 2,
		cta: { label: "무료 상담 신청", route: "contact" },
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
		tags: ["거소증·영주권", "결혼비자", "연예인·전문직 비자", "국적회복"],
		career: [
			{ icon: "graduation-cap", text: "미국 어학연수 과정 수료" },
			{ icon: "award", text: "행정사 자격시험 합격 · 행정사 자격 취득" },
			{ icon: "heart-handshake", text: "다문화심리상담사 자격 보유" },
			{ icon: "building-2", text: "법무부 등록 출입국민원 대행기관 운영" },
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
					"행정사 · 제6회 행정사 자격시험 합격",
					"민원행정상담사",
					"행정처분구제분석사",
					"학교폭력예방상담사",
					"다문화심리상담사 1급",
				],
			},
			{
				label: "소속 · 자문",
				items: [
					"대한행정사회 정회원",
					"한국시험행정사회 정회원",
					"대한행정사협회 공로상 수상",
					"한국시험행정사회 자문위원",
				],
			},
			{
				label: "교육 이수",
				items: [
					"미국 어학연수 과정 수료 (Los Angeles, USA)",
					"대한행정사회 출입국업무 전문가과정 이수",
					"대한행정사회 출입국관리 실무과정 이수",
					"대한행정사회 출입국 VISA업무 실전과정 이수",
					"대한행정사회 중앙교육연수원 연수교육 이수",
					"공인행정사협회 역량강화 교육 이수 (행정심판 전문가과정 · 이민행정 체류실무특강 · 민사분쟁에서 행정사의 업무와 역할 외 다수)",
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
	address: "서울특별시 중구 세종대로 136, 서울파이낸스센터 3층",
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
		label: "긴급 상담 (휴대폰)",
		value: CONTACT.mobile.display,
		href: CONTACT.mobile.href,
		note: CONTACT.mobile.note as string | null,
	},
	{
		icon: "message-circle",
		label: "카카오 채널",
		value: CONTACT.kakao.handle,
		href: CONTACT.kakao.href as string | null,
		note: null as string | null,
	},
	{
		icon: "globe",
		label: "위챗 (WeChat)",
		value: CONTACT.wechat.handle,
		href: null as string | null,
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
};

/* 업무분야 — 메가메뉴 순서. 각 분야 상세 페이지 데이터 포함. */
export const SERVICES: Service[] = [
	{
		id: "short",
		icon: "user-plus",
		code: "C-3 · C-4",
		title: "단기초청",
		summary: "단기방문·단기취업 초청 및 사증 발급, 초청 사유별 서류 안내.",
		target: [
			"국내 행사·방문·단기취업을 위해 외국인을 초청하려는 개인 또는 기업",
			"관광·상용·친지 방문 등 단기 체류를 준비하는 외국인",
		],
		docs: [
			"초청 사유서 및 초청장",
			"초청인·피초청인 신분 증빙 서류",
			"체류 비용 부담 및 재정 증빙",
			"초청 목적별 추가 입증 자료",
		],
		steps: [
			"상황·초청 사유 상담",
			"사유별 필요 서류 안내·검토",
			"사증발급인정서 또는 사증 신청 대행",
			"접수 및 결과 안내",
		],
		period: "약 2 ~ 4주 (사안·재외공관 처리 일정에 따라 상이)",
	},
	{
		id: "resident",
		icon: "briefcase",
		code: "D-7 · D-8",
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
		period: "약 2 ~ 6주 (자격 종류 및 심사에 따라 상이)",
	},
	{
		id: "e6",
		icon: "mic",
		code: "E-6",
		title: "외국인 연예인 비자",
		summary: "모델·배우·가수 등 예술흥행(E-6) 활동을 위한 사증 발급 지원.",
		target: [
			"국내에서 공연·방송·광고·모델 활동을 하려는 외국인",
			"기획사·에이전시를 통해 외국인 아티스트를 초청하려는 기업",
		],
		docs: [
			"출연·공연 계약서",
			"활동 일정 및 공연·행사 계획서",
			"소속사·초청사 사업자 서류",
			"경력 증빙 및 영상·포트폴리오",
		],
		steps: [
			"활동 내용·자격 요건 상담",
			"계약·일정 서류 검토",
			"영상물등급위원회 공연추천서 등 사전 절차 안내",
			"사증발급인정서 신청·접수 및 결과 안내",
		],
		period: "약 2 ~ 3개월 (영상물등급위원회 공연추천·심사 절차에 따라 상이)",
	},
	{
		id: "e7",
		icon: "graduation-cap",
		code: "E-7",
		title: "전문직 비자",
		summary: "특정활동(전문인력, E-7) 체류자격 신청 및 자격 요건 검토.",
		target: [
			"국내 기업에 전문인력으로 취업하려는 외국인",
			"외국인 전문인력을 채용하려는 국내 기업",
		],
		docs: [
			"고용계약서 및 사업자등록증",
			"학위증·경력증명서",
			"직무 관련 자격 증빙",
			"회사 재무·고용 현황 서류",
		],
		steps: [
			"직무·학력·경력 요건 검토",
			"고용 기업 서류 준비 안내",
			"체류자격 신청 또는 변경 대행",
			"접수 및 결과 안내",
		],
		period: "약 3 ~ 5주 (직종·요건 충족 여부에 따라 상이)",
	},
	{
		id: "f4",
		icon: "globe",
		code: "F-4",
		title: "재외동포 · 거소증",
		summary: "재외동포(F-4) 자격 신청과 국내거소신고증(거소증) 발급 대행.",
		target: [
			"과거 대한민국 국적을 보유했거나 그 직계비속인 외국국적동포",
			"F-4 자격으로 국내 거소신고가 필요한 재외동포",
		],
		docs: [
			"동포 입증 서류(기본증명서·제적등본, 직계관계 증빙 등)",
			"외국 범죄경력증명서 + 아포스티유(또는 영사확인, 해당 시)",
			"시민권증서 등 외국국적 취득 증빙",
			"여권·사진, 한국어능력 입증(TOPIK 등, 해당 시)",
		],
		steps: [
			"동포 자격 입증 가능성 검토",
			"본국·국내 서류 안내 및 준비",
			"F-4 자격 신청 대행",
			"국내거소신고증(거소증) 발급 안내",
		],
		period: "약 2 ~ 5주 (서류 준비·심사에 따라 상이)",
	},
	{
		id: "f5",
		icon: "shield-check",
		code: "F-5",
		title: "영주권",
		summary: "영주(F-5) 자격 요건 검토 및 신청 대행, 점수제·요건별 준비 안내.",
		target: [
			"일정 기간 합법 체류 후 영주 자격을 준비하는 외국인",
			"점수제·투자·동포 등 영주 요건 해당 여부를 확인하려는 분",
		],
		docs: [
			"체류 이력 및 기존 체류자격 서류",
			"소득·재산 등 생계 유지 능력 증빙",
			"한국어·사회통합 관련 증빙(해당 시)",
			"범죄경력·건강 관련 서류",
		],
		steps: [
			"영주 자격 유형·요건 진단",
			"부족 요건 점검 및 보완 안내",
			"F-5 자격 신청 대행",
			"접수 및 결과 안내",
		],
		period: "약 1 ~ 3개월 (요건·심사 일정에 따라 상이)",
	},
	{
		id: "f6",
		icon: "heart",
		code: "F-6",
		title: "결혼비자",
		summary: "국민의 배우자(F-6) 사증·체류자격 신청 및 심사 대비 지원.",
		target: ["대한민국 국민과 혼인한 외국인 배우자", "국제결혼 후 국내 체류·정착을 준비하는 부부"],
		docs: [
			"혼인관계 증명 서류",
			"교제·관계 입증 자료",
			"초청인 소득·주거 증빙",
			"기초 한국어 요건 관련 증빙(해당 시)",
		],
		steps: [
			"혼인·요건 상담 및 진단",
			"관계 입증 및 재정 서류 준비 안내",
			"사증 또는 체류자격 신청 대행",
			"면접 대비 안내 및 결과 안내",
		],
		period: "약 1 ~ 2개월 (재외공관·심사 일정에 따라 상이)",
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
			"기본증명서 또는 제적등본(과거 국적 보유 입증)",
			"시민권증서 등 외국국적 취득 관련 서류",
			"국적회복 진술서·신원진술서, 가족관계통보서",
			"여권·사진(성명 변경 시 관련 서류 포함)",
		],
		steps: [
			"국적회복 가능성·결격 사유 검토",
			"본국·국내 서류 안내 및 준비",
			"국적회복 허가 신청 대행",
			"심사 진행 및 결과 안내",
		],
		period: "약 8개월 ~ 1년 이상 (심사 특성상 장기 소요)",
	},
];

export const PROCESS = [
	{
		icon: "message-square",
		title: "상담 신청",
		desc: "전화 또는 온라인으로 무료 초기 상담을 신청합니다.",
	},
	{
		icon: "clipboard-list",
		title: "검토 · 방향 진단",
		desc: "체류자격과 요건을 검토해 상황에 맞는 현실적인 방향을 제시합니다.",
	},
	{
		icon: "file-check-2",
		title: "서류 작성 · 준비",
		desc: "필요 서류를 안내하고 신청 서류를 정확하게 작성·준비합니다.",
	},
	{
		icon: "stamp",
		title: "접수 · 결과 안내",
		desc: "대행기관으로 직접 접수하고, 진행 상황과 결과를 안내드립니다.",
	},
];

export const STATS = [
	{ v: "2019", l: "사무소 개소", d: "출입국·비자 전문" },
	{ v: "8개+", l: "전문 취급 분야", d: "E·F 비자 및 국적 업무" },
	{ v: "법무부 등록", l: "출입국민원 대행기관", d: "19-SB-RG-016" },
	{ v: "1:1", l: "사건별 전담 상담", d: "한 사건을 끝까지" },
];

export type Review = {
	tag: string;
	country: string;
	initial: string;
	flag: string;
	title: string;
	body: string;
};

export const REVIEWS: Review[] = [
	{
		tag: "거소증 F-4",
		country: "미국",
		initial: "J",
		flag: "🇺🇸",
		title: "막막했던 거소증 발급, 처음부터 끝까지 안심하고 맡겼어요",
		body: "필요한 서류와 절차를 처음부터 차근차근 설명해 주셨습니다. 행정사님이 직접 챙겨주셔서 막막했던 과정을 안심하고 맡길 수 있었습니다.",
	},
	{
		tag: "결혼비자 F-6",
		country: "중국",
		initial: "L",
		flag: "🇨🇳",
		title: "제 상황에 맞춰 현실적으로 방향을 잡아주셨습니다",
		body: "처음 상담부터 접수까지 행정사님이 직접 챙겨 주셨습니다. 무리한 약속 대신 제 상황을 솔직하게 봐주셔서 더 믿음이 갔어요.",
	},
	{
		tag: "국적회복",
		country: "미국",
		initial: "K",
		flag: "🇺🇸",
		title: "오래 걸리는 절차, 예상 기간을 솔직하게 알려주셔서 신뢰가 갔어요",
		body: "오래 걸리는 절차라 걱정이 많았는데, 예상 기간과 준비물을 솔직하게 안내해 주셨습니다. 진행 상황도 그때그때 알려주셨습니다.",
	},
	{
		tag: "전문직 비자 E-7",
		country: "미국",
		initial: "M",
		flag: "🇺🇸",
		title: "자격 요건 검토부터 꼼꼼하게, 직접 응대해 주셨습니다",
		body: "E-7 자격이 될지 막연했는데 요건을 하나하나 검토해 주셨습니다. 담당이 바뀌지 않고 한 분이 끝까지 봐주셔서 편했습니다.",
	},
	{
		tag: "연예인 비자 E-6",
		country: "중국",
		initial: "W",
		flag: "🇨🇳",
		title: "활동 일정에 맞춰 사증 발급까지 빈틈없이 챙겨주셨어요",
		body: "예술흥행 비자는 서류가 까다로웠는데 필요한 자료를 정확히 짚어주셨습니다. 일정에 차질 없이 진행되어 감사했습니다.",
	},
	{
		tag: "영주권 F-5",
		country: "미국",
		initial: "S",
		flag: "🇺🇸",
		title: "요건을 미리 점검해 주셔서 준비 기간을 줄일 수 있었습니다",
		body: "지금 신청이 가능한지부터 솔직하게 봐주셨습니다. 부족한 요건을 먼저 알려주셔서 헛걸음 없이 준비할 수 있었습니다.",
	},
	{
		tag: "단기초청 C-3",
		country: "중국",
		initial: "H",
		flag: "🇨🇳",
		title: "초청 서류가 복잡했는데 사유별로 정리해 주셨어요",
		body: "어떤 서류가 필요한지 막막했는데 초청 사유에 맞춰 목록을 정리해 주셨습니다. 덕분에 한 번에 준비할 수 있었습니다.",
	},
	{
		tag: "주재원 D-7",
		country: "미국",
		initial: "R",
		flag: "🇺🇸",
		title: "회사 서류까지 함께 챙겨주셔서 파견 일정에 차질이 없었습니다",
		body: "개인 서류뿐 아니라 회사 측 준비 서류까지 안내해 주셨습니다. 부임 일정에 맞춰 처리되어 감사했습니다.",
	},
	{
		tag: "전문직 비자 E-7",
		country: "중국",
		initial: "C",
		flag: "🇨🇳",
		title: "변경 가능성을 솔직하게 짚어주셔서 결정에 도움이 됐어요",
		body: "무조건 된다고 하지 않고, 가능성과 보완할 점을 솔직하게 말씀해 주셨습니다. 그래서 더 신뢰가 갔습니다.",
	},
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
		a: "한국에 체류하고 있거나 체류하고자 하는 외국인과 관련된 비자를 중심으로 F-4·거소증, 영주권, 결혼비자, 외국인 연예인 비자, 전문직 비자, 국적회복 등을 전문으로 진행합니다.",
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

// ── 의뢰인 후기 이미지(카카오톡·이메일 캡처) — 매트 프레임 갤러리에서 노출 ──
// 원본(후기N.*)은 public/review/ 에 있고, 공개용은 개인정보 마스킹 후 review-NN 으로 정리한다.
// 모든 캡처는 성함·연락처·날짜·이메일 등을 가린 마스킹본이다.
// w/h 는 라이트박스에서 원본 비율을 정확히 보여주기 위한 실제 해상도.
// 나중에 admin(choice-admin)에서 등록하면 Supabase에서 읽어오고, 이 배열은 폴백/시드로 둔다
// (텍스트 후기 lib/reviews.ts 패턴과 동일).
export type ReviewImage = {
	src: string;
	w: number;
	h: number;
	tag: string; // 사건 유형
	quote: string; // 발췌 인용(각색 가능)
	meta: string; // 익명 속성
};

export const REVIEW_IMAGES: ReviewImage[] = [
	{
		src: "/review/review-04.jpg",
		w: 967,
		h: 1450,
		tag: "재외동포 · 거소증 갱신",
		quote: "진심으로 감사드립니다. 고맙습니다.",
		meta: "해외 거주 재외동포",
	},
	{
		src: "/review/review-01.jpg",
		w: 972,
		h: 1401,
		tag: "체류 연장 · 재방문",
		quote: "매번 문제 없이 바로 처리해 주셔서 감사합니다.",
		meta: "재방문 의뢰인",
	},
	{
		src: "/review/review-11.jpg",
		w: 972,
		h: 1469,
		tag: "체류 연장 · 우편 처리",
		quote: "늘 민첩하고 정확하게 일해 주셔서 고맙습니다.",
		meta: "체류 연장 의뢰인",
	},
	{
		src: "/review/review-06.jpg",
		w: 3524,
		h: 1252,
		tag: "비자 · 거소증 접수",
		quote: "처음부터 끝까지 정확한 정보와 빠른 일 처리에 감탄했습니다.",
		meta: "비자·거소증 의뢰인 (이메일)",
	},
	{
		src: "/review/review-02.jpg",
		w: 864,
		h: 1412,
		tag: "거소증 · 상담",
		quote: "공적인 걸 떠나 마음 편히 이야기할 수 있어 감사했어요.",
		meta: "거소증 의뢰인",
	},
	{
		src: "/review/review-08.jpg",
		w: 648,
		h: 617,
		tag: "거소증 · 지인 추천",
		quote: "깔끔하게 잘 해주셔서 친구들에게 소개했어요.",
		meta: "재방문·추천 의뢰인",
	},
	{
		src: "/review/review-09.jpg",
		w: 3428,
		h: 1785,
		tag: "거소증 신청 · 추천",
		quote: "복잡한 절차를 편하게 마쳤습니다. 주저 없이 소개하겠습니다.",
		meta: "거소증 의뢰인 (이메일)",
	},
	{
		src: "/review/review-05.jpg",
		w: 1019,
		h: 1369,
		tag: "거소증 발급 · 신속 처리",
		quote: "와, 엄청 빨리 잘 됐네요. 감사합니다!",
		meta: "거소증 발급 의뢰인",
	},
	{
		src: "/review/review-03.jpg",
		w: 1080,
		h: 555,
		tag: "재방문 · 감사 인사",
		quote: "늘 일 처리 잘해 주셔서 대단히 감사합니다.",
		meta: "재방문 의뢰인",
	},
	{
		src: "/review/review-07.png",
		w: 1360,
		h: 1157,
		tag: "거소증 · 서류 대행",
		quote: "모든 서류 과정을 문제없이 준비하고 배려해 주셨습니다.",
		meta: "거소증 의뢰인 (이메일)",
	},
	{
		src: "/review/review-10.jpg",
		w: 4400,
		h: 1271,
		tag: "고난도 건 · 해결",
		quote: "남들은 다 안 된다던 일을 끝까지 만들어 내셨습니다.",
		meta: "소개 의뢰인 (이메일)",
	},
];
