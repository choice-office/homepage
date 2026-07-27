import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

// AI 답변엔진·검색 크롤러 명시 허용(AEO). 기본(*)도 전체 허용이지만, 주요 AI/검색 봇을
// 명시해 "학습·인용 허용" 의도를 분명히 한다(일부 봇은 명시 규칙을 우선 참조).
const AI_SEARCH_BOTS = [
	"GPTBot", // OpenAI 학습
	"OAI-SearchBot", // ChatGPT Search
	"ChatGPT-User", // ChatGPT 브라우징
	"PerplexityBot", // Perplexity 색인
	"Perplexity-User", // Perplexity 브라우징
	"Google-Extended", // Gemini/Vertex 학습
	"GoogleOther",
	"ClaudeBot", // Anthropic 학습
	"Claude-Web",
	"anthropic-ai",
	"Applebot-Extended", // Apple Intelligence
	"Amazonbot",
	"Bytespider", // TikTok/Doubao
	"CCBot", // Common Crawl(다수 LLM의 원천)
	"cohere-ai",
	"Meta-ExternalAgent", // Meta AI
];

export default function robots(): MetadataRoute.Robots {
	return {
		rules: [
			{ userAgent: "*", allow: "/" },
			...AI_SEARCH_BOTS.map((userAgent) => ({ userAgent, allow: "/" })),
		],
		sitemap: `${siteConfig.url}/sitemap.xml`,
		host: siteConfig.url,
	};
}
