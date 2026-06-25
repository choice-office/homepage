/* 초이스 행정사 — 콘텐츠 데이터 (Claude Design 포팅) */

export const HERO_IMG =
	"https://images.unsplash.com/photo-1723174391641-59eab110dd4f?w=1920&q=80&auto=format&fit=crop";

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
			{ label: "자격 · 인증", route: "credentials" },
			{ label: "오시는 길", route: "location" },
			{ label: "자주 묻는 질문", route: "faq" },
		],
	},
	{ label: "업무분야", route: "services", children: null },
	{ label: "의뢰인 후기", route: "reviews" },
	{ label: "블로그", route: "blog" },
	{ label: "문의하기", route: "contact" },
];

export const STRENGTHS = [
	{
		icon: "user-check",
		title: "사무장 없는 사무소",
		desc: "상담부터 서류 작성·접수까지 전 과정을 시험 출신 행정사가 직접 수행합니다. 중간 상담 직원을 거치지 않습니다.",
	},
	{
		icon: "stamp",
		title: "법무부 등록 대행기관",
		desc: "출입국민원 대행기관으로 정식 등록되어, 사증·체류·국적 민원을 적법한 절차로 직접 접수·대행합니다.",
	},
	{
		icon: "compass",
		title: "현실적인 방향 안내",
		desc: "단정적인 결과 약속 대신, 의뢰인의 상황을 정확히 검토해 가능한 방향을 솔직하게 안내드립니다.",
	},
	{
		icon: "heart-handshake",
		title: "외국인의 입장을 이해",
		desc: "대표 행정사가 미국 어학연수 경험과 다문화심리상담사 자격을 갖춰, 외국인 의뢰인의 상황과 정서를 이해하며 상담합니다.",
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
};

/* 구성원 — 인원이 늘어도 자연스러운 구조(1명 → 2~3명 확장) */
export const TEAM: Member[] = [
	{
		name: "최서연",
		title: "대표 행정사",
		lead: true,
		summary: "상담부터 접수까지 직접 책임지는 시험 출신 행정사",
		tags: ["거소증·영주권", "결혼비자", "연예인·전문직 비자", "국적회복"],
		career: [
			{ icon: "graduation-cap", text: "미국 어학연수 — 영어 상담 가능" },
			{ icon: "award", text: "행정사 자격시험 합격 · 행정사 자격 취득" },
			{ icon: "heart-handshake", text: "다문화심리상담사 자격 보유" },
			{ icon: "building-2", text: "법무부 등록 출입국민원 대행기관 운영" },
		],
		reg: "행정사 등록번호 18102025537 · 출입국민원 대행기관 19-SB-RG-016",
	},
];

export const CHANNELS = [
	{
		icon: "phone",
		label: "전화 상담",
		value: "02-6959-9886",
		href: "tel:0269599886",
		note: null as string | null,
	},
	{
		icon: "phone-call",
		label: "긴급 상담 (휴대폰)",
		value: "010-8259-9890",
		href: "tel:01082599890",
		note: "외부 출장 중 급한 문의 시",
	},
	{
		icon: "message-circle",
		label: "카카오 채널",
		value: "koreavisa8",
		href: "https://pf.kakao.com/",
		note: null as string | null,
	},
	{
		icon: "globe",
		label: "위챗 (WeChat)",
		value: "koreavisa8",
		href: null as string | null,
		note: "中文 상담",
	},
	{
		icon: "mail",
		label: "이메일",
		value: "choice@kvisa1345.com",
		href: "mailto:choice@kvisa1345.com",
		note: null as string | null,
	},
];

/* 영상 — 유튜브 'Korea Visa Master' */
export const VIDEOS = [
	{ tag: "거소증 · F-4", title: "재외동포(F-4)와 거소증, 5분 정리", dur: "6:12" },
	{ tag: "결혼비자 · F-6", title: "결혼비자(F-6) 준비, 관계 입증은 어떻게", dur: "8:40" },
	{ tag: "영주권 · F-5", title: "영주권(F-5) 요건, 지금 신청 가능할까", dur: "7:05" },
];
export const YOUTUBE_CHANNEL = "https://www.youtube.com/results?search_query=Korea+Visa+Master";
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
			"공연추천서 등 사전 절차 안내",
			"사증발급인정서 신청·접수 및 결과 안내",
		],
		period: "약 2 ~ 3개월 (문화체육관광부 추천·심사 절차에 따라 상이)",
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
			"동포 입증 서류(가족관계·제적등본 등)",
			"외국 국적 취득 증빙",
			"여권 및 사진",
			"거소신고용 국내 주소 증빙",
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
			"국적회복을 통해 국내 정착을 준비하는 동포",
		],
		docs: [
			"과거 국적 보유 입증 서류(제적등본 등)",
			"외국 국적 취득 경위 서류",
			"범죄경력 증명 및 신원 서류",
			"생계·품행 관련 증빙",
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
		desc: "전화 또는 온라인으로 무료 초기 상담을 신청합니다. 한국어·영어 상담 가능합니다.",
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
	{ v: "직접", l: "행정사 1:1 책임", d: "사무장 없는 상담" },
	{ v: "2개 언어", l: "상담 지원", d: "한국어 · English" },
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

export const CREDENTIALS = [
	{
		icon: "award",
		title: "시험 출신 행정사",
		desc: "행정사 자격시험을 거쳐 자격을 취득한 행정사가 직접 업무를 수행합니다.",
	},
	{
		icon: "building-2",
		title: "출입국민원 대행기관",
		desc: "법무부에 등록된 출입국민원 대행기관입니다. (등록번호 19-SB-RG-016)",
	},
	{
		icon: "badge-check",
		title: "행정사 등록",
		desc: "관할 행정청에 정식 등록된 행정사 사무소입니다. (등록번호 18102025537)",
	},
	{
		icon: "globe-2",
		title: "한·영·中 상담",
		desc: "한국어·English 상담과 위챗(WeChat)을 통한 中文 상담을 지원합니다.",
	},
];

export const BLOG = [
	{
		cat: "거소증 · F-4",
		date: "2026.05.18",
		title: "재외동포(F-4)와 거소증, 무엇이 어떻게 다른가요?",
		excerpt: "F-4 자격과 국내거소신고증(거소증)의 관계, 발급 순서와 준비 서류를 정리했습니다.",
		read: "5분",
	},
	{
		cat: "결혼비자 · F-6",
		date: "2026.04.30",
		title: "결혼비자(F-6) 심사, 관계 입증은 어디까지 준비해야 할까",
		excerpt:
			"교제 과정·관계 입증 자료의 범위와, 면접에서 자주 묻는 사항을 사례 중심으로 살펴봅니다.",
		read: "6분",
	},
	{
		cat: "영주권 · F-5",
		date: "2026.04.12",
		title: "영주(F-5) 요건, 지금 신청이 가능한지 먼저 확인하세요",
		excerpt: "유형별 영주 요건과 점수제, 신청 전에 점검해야 할 체류·소득 요건을 안내합니다.",
		read: "7분",
	},
	{
		cat: "전문직 · E-7",
		date: "2026.03.25",
		title: "E-7 전문직 비자, 직종과 학력·경력 요건 핵심 정리",
		excerpt: "특정활동(E-7) 자격에서 자주 문제되는 직종 적합성과 경력 입증 포인트를 짚어봅니다.",
		read: "6분",
	},
	{
		cat: "연예인 · E-6",
		date: "2026.03.08",
		title: "외국인 연예인(E-6) 초청, 공연추천 절차부터 이해하기",
		excerpt: "예술흥행 비자의 사전 추천 절차와 계약·일정 서류 준비 순서를 설명합니다.",
		read: "5분",
	},
	{
		cat: "국적회복",
		date: "2026.02.20",
		title: "국적회복, 절차가 오래 걸리는 이유와 준비 방법",
		excerpt: "국적회복 허가의 심사 특성과 결격 사유, 장기 절차를 대비하는 방법을 안내합니다.",
		read: "8분",
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
		case "credentials":
			return "/credentials";
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
