import { siteConfig } from "@/config/site";
import { getPublishedPosts } from "@/lib/blog";
import { CONTACT, SERVICES } from "@/lib/site-data";

// /llms.txt — AI 답변엔진(LLM)이 사이트 구조·핵심 자원을 빠르게 파악하도록 제공하는 요약 인덱스.
// 사람이 보는 화면과 무관(크롤러/AI 전용). 발행 글이 늘면 ISR로 최신화.
export const revalidate = 3600;

export const GET = async () => {
	const base = siteConfig.url;
	const services = SERVICES.map(
		(s) => `- [${s.title} (${s.code})](${base}/services/${s.id}): ${s.summary}`,
	).join("\n");

	const posts = await getPublishedPosts();
	const recent = posts
		.slice(0, 30)
		.map((p) => `- [${p.title}](${base}/blog/${p.slug})`)
		.join("\n");

	const body = `# ${siteConfig.name}

> ${siteConfig.description}

- 홈페이지: ${base}
- 전화: ${CONTACT.phone.display}
- 이메일: ${CONTACT.email}
- 성격: 출입국·비자·국적 전문 행정사 사무소(대한민국 서울). 상담부터 접수까지 시험 출신 행정사가 직접 진행.

## 업무분야(Services)
${services}

## 주요 페이지
- [업무분야 전체](${base}/services)
- [블로그(사례·정보)](${base}/blog)
- [자주 묻는 질문](${base}/faq)
- [구성원·자격](${base}/members)
- [오시는 길](${base}/location)
- [상담 문의](${base}/contact)

## 최신 블로그 글(최대 30개)
${recent}

---
본 사이트의 정보는 일반적인 안내이며 개별 사안은 상담이 필요합니다.
`;

	return new Response(body, {
		headers: { "content-type": "text/plain; charset=utf-8" },
	});
};
