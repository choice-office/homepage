import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ServiceDetail } from "@/components/site/service-detail";
import { siteConfig } from "@/config/site";
import { toJsonLd } from "@/lib/json-ld";
import { SERVICE_SEO, SERVICES, type Service } from "@/lib/site-data";

export const generateStaticParams = () => SERVICES.map((s) => ({ id: s.id }));

export const generateMetadata = async ({
	params,
}: {
	params: Promise<{ id: string }>;
}): Promise<Metadata> => {
	const { id } = await params;
	const s = SERVICES.find((x) => x.id === id);
	if (!s) return {};
	const seo = SERVICE_SEO[s.id];
	// 검색 의도 키워드형 title/description(연구근거) 우선, 없으면 기본값. og:title=title 일치.
	const title = seo?.seoTitle ?? `${s.title} (${s.code})`;
	const description = seo?.seoDesc ?? s.summary;
	const url = `${siteConfig.url}/services/${s.id}`;
	return {
		title: { absolute: title },
		description,
		alternates: { canonical: `/services/${s.id}` },
		openGraph: { title, description, url, type: "website" },
	};
};

// Service + BreadcrumbList (+ FAQPage) 구조화 데이터 — 각 비자 분야가 자기 키워드로 검색·AI답변에 노출되도록.
// FAQPage: 화면에 실제 보이는 FAQ 본문과 1:1로 일치해야 유효(schema.org 요건). faqs 있을 때만 포함.
const buildJsonLd = (s: Service) => {
	const url = `${siteConfig.url}/services/${s.id}`;
	const faqs = SERVICE_SEO[s.id]?.faqs ?? [];
	const graph: Record<string, unknown>[] = [
		{
			"@type": "Service",
			name: `${s.title} (${s.code})`,
			serviceType: s.title,
			description: s.summary,
			category: "출입국·비자 행정 대행",
			provider: { "@type": "LegalService", name: siteConfig.name, url: siteConfig.url },
			areaServed: "KR",
			url,
		},
		{
			"@type": "BreadcrumbList",
			itemListElement: [
				{ "@type": "ListItem", position: 1, name: "홈", item: siteConfig.url },
				{
					"@type": "ListItem",
					position: 2,
					name: "업무분야",
					item: `${siteConfig.url}/services`,
				},
				{ "@type": "ListItem", position: 3, name: s.title, item: url },
			],
		},
	];
	if (faqs.length > 0) {
		graph.push({
			"@type": "FAQPage",
			mainEntity: faqs.map((f) => ({
				"@type": "Question",
				name: f.q,
				acceptedAnswer: { "@type": "Answer", text: f.a },
			})),
		});
	}
	return { "@context": "https://schema.org", "@graph": graph };
};

export default async function ServiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;
	const s = SERVICES.find((x) => x.id === id);
	if (!s) redirect("/");
	return (
		<>
			<script
				type="application/ld+json"
				// biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD 주입의 표준 방식(대안 없음). '<' 이스케이프로 하드닝 — toJsonLd
				dangerouslySetInnerHTML={{ __html: toJsonLd(buildJsonLd(s)) }}
			/>
			<ServiceDetail id={id} />
		</>
	);
}
