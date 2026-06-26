// 블로그 글 데이터 — 추후 관리자(velog식 에디터)에서 등록하면 동일 구조로 Supabase에 저장된다.
// 본문(content)은 에디터가 출력하는 HTML 문자열. 상세 페이지에서 .prose 컨테이너에 렌더하므로
// 제목/목록/인용/이미지(글 중간 삽입)까지 자연스럽게 표현된다.

export type BlogPost = {
	slug: string; // URL: /blog/{slug}
	category: string;
	title: string;
	excerpt: string;
	author: string;
	date: string; // ISO yyyy-mm-dd (정렬·표시 기준)
	readingMinutes: number;
	cover?: string; // 목록·상세 상단 커버 이미지(없으면 그라데이션 플레이스홀더)
	content: string; // 에디터 출력 HTML
};

// 최신순 정렬을 코드가 보장하도록 date 기준 내림차순으로 노출한다.
const POSTS: BlogPost[] = [
	{
		slug: "f4-overseas-korean-residence-card",
		category: "거소증 · F-4",
		title: "재외동포(F-4)와 거소증, 무엇이 어떻게 다른가요?",
		excerpt: "F-4 자격과 국내거소신고증(거소증)의 관계, 발급 순서와 준비 서류를 정리했습니다.",
		author: "초이스 행정사 사무소",
		date: "2026-05-18",
		readingMinutes: 5,
		cover:
			"https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1200&q=70",
		content: `
<p>재외동포(F-4) 자격과 <strong>국내거소신고증(거소증)</strong>은 자주 혼동되지만, 둘은 성격이 다릅니다. F-4가 <em>체류자격</em>이라면, 거소증은 그 자격을 가진 분이 국내에 거소를 신고하고 발급받는 <em>증명서</em>입니다.</p>
<h2>1. 발급 순서</h2>
<p>일반적으로 다음 순서로 진행됩니다.</p>
<ol>
<li>F-4 자격 요건 확인(혈통·출생 등 재외동포 입증)</li>
<li>비자 또는 자격변경 신청</li>
<li>국내 거소 신고 → 거소증 발급</li>
</ol>
<figure>
<img src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1200&q=70" alt="서류를 검토하는 모습" loading="lazy" />
<figcaption>거소 신고 시에는 주소를 입증할 수 있는 서류가 필요합니다.</figcaption>
</figure>
<h2>2. 준비 서류</h2>
<ul>
<li>여권 및 사진</li>
<li>재외동포 입증 서류(가족관계·제적등본 등)</li>
<li>국내 거소 입증(임대차계약서 등)</li>
</ul>
<blockquote>혈통 입증 서류는 국가·세대에 따라 요구 범위가 달라집니다. 사전에 점검하면 보정 요청을 크게 줄일 수 있습니다.</blockquote>
<p>서류의 적격 여부는 개별 사정에 따라 달라지므로, 신청 전에 한 번 점검받는 것을 권합니다.</p>
`,
	},
	{
		slug: "f6-marriage-visa-relationship-proof",
		category: "결혼비자 · F-6",
		title: "결혼비자(F-6) 심사, 관계 입증은 어디까지 준비해야 할까",
		excerpt:
			"교제 과정·관계 입증 자료의 범위와, 면접에서 자주 묻는 사항을 사례 중심으로 살펴봅니다.",
		author: "초이스 행정사 사무소",
		date: "2026-04-30",
		readingMinutes: 6,
		cover:
			"https://images.unsplash.com/photo-1529634597503-139d3726fed5?auto=format&fit=crop&w=1200&q=70",
		content: `
<p>결혼비자(F-6) 심사의 핵심은 <strong>관계의 진정성</strong>입니다. 단순히 혼인신고가 되어 있다는 사실보다, 교제부터 현재까지의 과정을 일관되게 설명할 수 있는지가 중요합니다.</p>
<h2>관계 입증 자료의 범위</h2>
<ul>
<li>교제 과정을 보여주는 사진·메신저 대화</li>
<li>왕래 기록(출입국 사실, 항공권 등)</li>
<li>경제적 부양 능력 입증(소득·재직 등)</li>
</ul>
<h2>면접에서 자주 묻는 것</h2>
<p>상대방의 가족관계, 만남의 경위, 향후 거주 계획 등 <em>두 사람의 답변이 일치하는지</em>를 확인합니다. 준비 단계에서 서로의 기억을 맞춰 두는 것이 좋습니다.</p>
<blockquote>자료는 많을수록 좋은 것이 아니라, <strong>일관성</strong>이 있어야 합니다.</blockquote>
`,
	},
	{
		slug: "f5-permanent-residence-requirements",
		category: "영주권 · F-5",
		title: "영주(F-5) 요건, 지금 신청이 가능한지 먼저 확인하세요",
		excerpt: "유형별 영주 요건과 점수제, 신청 전에 점검해야 할 체류·소득 요건을 안내합니다.",
		author: "초이스 행정사 사무소",
		date: "2026-04-12",
		readingMinutes: 7,
		content: `
<p>영주(F-5)는 유형이 매우 다양하고, 유형별로 요구하는 체류기간·소득·자격이 다릅니다. <strong>본인이 어떤 유형에 해당하는지</strong>를 먼저 확정해야 합니다.</p>
<h2>대표적인 점검 항목</h2>
<ol>
<li>현재 체류자격과 누적 체류기간</li>
<li>소득 요건(전년도 기준 등)</li>
<li>기본 소양·납세 등 부가 요건</li>
</ol>
<p>요건을 충족하지 못한 상태에서 신청하면 불허로 이어질 수 있으므로, 신청 시점을 잡는 것 자체가 전략입니다.</p>
`,
	},
	{
		slug: "e7-professional-visa-requirements",
		category: "전문직 · E-7",
		title: "E-7 전문직 비자, 직종과 학력·경력 요건 핵심 정리",
		excerpt: "특정활동(E-7) 자격에서 자주 문제되는 직종 적합성과 경력 입증 포인트를 짚어봅니다.",
		author: "초이스 행정사 사무소",
		date: "2026-03-25",
		readingMinutes: 6,
		content: `
<p>특정활동(E-7)은 <strong>직종 적합성</strong>이 가장 자주 문제됩니다. 채용하려는 직무가 허용 직종에 해당하는지, 학력·경력이 그 직종과 연결되는지를 함께 봅니다.</p>
<h2>자주 문제되는 지점</h2>
<ul>
<li>전공·경력과 채용 직무의 연관성</li>
<li>업체의 매출·고용 등 초청 능력</li>
<li>국민 고용 비율 등 쿼터 요건</li>
</ul>
<p>경력 입증은 재직증명서만으로 부족한 경우가 많아, 업무 내용을 구체적으로 보여주는 자료가 도움이 됩니다.</p>
`,
	},
	{
		slug: "e6-entertainer-visa-invitation",
		category: "연예인 · E-6",
		title: "외국인 연예인(E-6) 초청, 공연추천 절차부터 이해하기",
		excerpt: "예술흥행 비자의 사전 추천 절차와 계약·일정 서류 준비 순서를 설명합니다.",
		author: "초이스 행정사 사무소",
		date: "2026-03-08",
		readingMinutes: 5,
		content: `
<p>예술흥행(E-6)은 사전 <strong>공연추천</strong> 절차가 핵심입니다. 추천 단계에서 계약 조건과 일정, 공연 장소가 일관되게 정리되어 있어야 합니다.</p>
<h2>준비 순서</h2>
<ol>
<li>계약서·공연 일정 확정</li>
<li>관할 기관 공연추천</li>
<li>사증발급인정 신청</li>
</ol>
<p>일정이 촉박한 경우가 많으므로, 추천 단계의 리드타임을 미리 확보하는 것이 중요합니다.</p>
`,
	},
	{
		slug: "nationality-restoration-process",
		category: "국적회복",
		title: "국적회복, 절차가 오래 걸리는 이유와 준비 방법",
		excerpt: "국적회복 허가의 심사 특성과 결격 사유, 장기 절차를 대비하는 방법을 안내합니다.",
		author: "초이스 행정사 사무소",
		date: "2026-02-20",
		readingMinutes: 8,
		content: `
<p>국적회복은 심사 범위가 넓고 관계 기관 조회가 수반되어 <strong>절차가 비교적 깁니다</strong>. 결격 사유가 없는지 사전에 점검하는 것이 시간을 줄이는 가장 확실한 방법입니다.</p>
<h2>대비 방법</h2>
<ul>
<li>과거 출입국·체류 이력 정리</li>
<li>범죄·세금 등 결격 사유 사전 확인</li>
<li>가족관계·제적 등 신분 서류 일관성 점검</li>
</ul>
<p>보정 요청이 반복되면 기간이 더 길어지므로, 첫 제출 단계의 완성도가 전체 기간을 좌우합니다.</p>
`,
	},
	{
		slug: "visa-extension-checklist",
		category: "체류 · 연장",
		title: "체류기간 연장, 신청 전에 꼭 확인할 체크리스트",
		excerpt: "연장 신청의 시점, 필요 서류, 자주 놓치는 요건을 한 번에 정리했습니다.",
		author: "초이스 행정사 사무소",
		date: "2026-02-02",
		readingMinutes: 4,
		content: `
<p>체류기간 연장은 <strong>만료 전</strong>에 신청하는 것이 원칙입니다. 자격별로 요구하는 소득·재직·거주 요건이 달라 사전 점검이 필요합니다.</p>
<h2>체크리스트</h2>
<ul>
<li>현재 체류자격과 만료일</li>
<li>자격 유지 요건(소득·재직 등)</li>
<li>주소·연락처 변경 신고 여부</li>
</ul>
<p>요건이 바뀐 경우 연장보다 자격변경이 더 적합할 수 있으니, 두 경로를 함께 검토하세요.</p>
`,
	},
	{
		slug: "d8-investor-visa-basics",
		category: "투자 · D-8",
		title: "기업투자(D-8) 비자, 처음 준비할 때 알아야 할 기본",
		excerpt: "법인 설립과 투자금 요건, 사업의 실재성 입증까지 기본 흐름을 정리합니다.",
		author: "초이스 행정사 사무소",
		date: "2026-01-19",
		readingMinutes: 6,
		content: `
<p>기업투자(D-8)는 <strong>투자금 요건</strong>과 <strong>사업의 실재성</strong>을 함께 봅니다. 법인 설립과 투자 송금, 사업장 확보가 일관되게 연결되어야 합니다.</p>
<h2>기본 흐름</h2>
<ol>
<li>법인 설립·사업자 등록</li>
<li>투자금 송금 및 입증</li>
<li>사업장·사업계획의 실재성 정리</li>
</ol>
<p>형식적 요건만 갖추고 실제 사업 활동이 보이지 않으면 심사에서 문제될 수 있습니다.</p>
`,
	},
	{
		slug: "overstay-voluntary-departure",
		category: "출국 · 사면",
		title: "초과체류, 자진출국과 입국규제 완화 어떻게 접근할까",
		excerpt: "초과체류 상태에서의 선택지와, 자진출국 시 규제 완화의 일반적 기준을 살펴봅니다.",
		author: "초이스 행정사 사무소",
		date: "2026-01-05",
		readingMinutes: 5,
		content: `
<p>초과체류 상태라면 <strong>현재 상황을 정확히 진단</strong>하는 것이 먼저입니다. 체류 경위와 기간에 따라 선택지와 결과가 크게 달라집니다.</p>
<h2>일반적 접근</h2>
<ul>
<li>체류 경위·기간 정리</li>
<li>자진출국 시 규제 완화 여부 확인</li>
<li>향후 재입국 계획에 맞춘 전략 수립</li>
</ul>
<blockquote>개별 사정에 따라 결과가 달라지므로, 자가 판단보다 사전 상담을 권합니다.</blockquote>
`,
	},
	{
		slug: "f2-to-f5-pathway",
		category: "영주권 · F-5",
		title: "거주(F-2)에서 영주(F-5)로, 경로 설계의 핵심",
		excerpt: "F-2 단계에서 미리 관리해야 영주 신청이 수월해지는 요건들을 정리합니다.",
		author: "초이스 행정사 사무소",
		date: "2025-12-15",
		readingMinutes: 6,
		content: `
<p>영주(F-5)는 갑자기 준비하기보다, <strong>F-2 단계에서부터 요건을 관리</strong>하는 편이 훨씬 수월합니다. 특히 소득과 체류 연속성이 중요합니다.</p>
<h2>미리 관리할 항목</h2>
<ul>
<li>연속 체류기간의 단절 방지</li>
<li>소득 요건을 충족하는 재직·납세 이력</li>
<li>기본 소양 요건(필요 유형의 경우)</li>
</ul>
<p>경로를 일찍 설계할수록 선택지가 넓어집니다.</p>
`,
	},
	{
		slug: "e9-employment-permit-basics",
		category: "비전문 · E-9",
		title: "고용허가(E-9) 기본, 사업주와 근로자가 함께 볼 포인트",
		excerpt: "고용허가제의 기본 구조와, 자격변경·체류관리에서 자주 묻는 사항을 정리합니다.",
		author: "초이스 행정사 사무소",
		date: "2025-11-28",
		readingMinutes: 5,
		content: `
<p>고용허가(E-9)는 사업주의 <strong>고용허가서</strong>를 전제로 합니다. 근로자 입장에서는 사업장 변경과 체류관리 요건을 함께 이해해야 합니다.</p>
<h2>자주 묻는 사항</h2>
<ul>
<li>사업장 변경의 사유와 절차</li>
<li>체류기간 관리와 연장</li>
<li>장기근속 시 자격변경 가능성</li>
</ul>
<p>요건은 제도 변경의 영향을 받으므로, 신청 시점의 기준을 확인하는 것이 안전합니다.</p>
`,
	},
	{
		slug: "d2-to-e7-after-graduation",
		category: "전문직 · E-7",
		title: "졸업 후 유학(D-2)에서 취업(E-7)으로 전환하기",
		excerpt: "전공과 직무의 연결, 그리고 전환 시점에서 자주 막히는 부분을 짚어봅니다.",
		author: "초이스 행정사 사무소",
		date: "2025-11-10",
		readingMinutes: 6,
		content: `
<p>유학(D-2)에서 취업(E-7)으로의 전환은 <strong>전공과 채용 직무의 연관성</strong>이 핵심입니다. 졸업 직후가 가장 흔한 전환 시점입니다.</p>
<h2>자주 막히는 부분</h2>
<ul>
<li>전공과 직무의 연관성 입증</li>
<li>업체의 초청 요건(매출·고용 등)</li>
<li>전환 공백 없는 일정 설계</li>
</ul>
<p>채용이 확정되었다면, 입사 시점과 자격변경 일정을 미리 맞추는 것이 좋습니다.</p>
`,
	},
];

export const BLOG_POSTS: BlogPost[] = [...POSTS].sort((a, b) => (a.date < b.date ? 1 : -1));

export const BLOG_PAGE_SIZE = 9;

export const getBlogPost = (slug: string): BlogPost | undefined =>
	BLOG_POSTS.find((p) => p.slug === slug);

export const formatBlogDate = (iso: string): string => iso.replaceAll("-", ".");
