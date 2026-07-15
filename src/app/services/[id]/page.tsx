import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ServiceDetail } from "@/components/site/service-detail";
import { siteConfig } from "@/config/site";
import { toJsonLd } from "@/lib/json-ld";
import { SERVICES, type Service } from "@/lib/site-data";

export const generateStaticParams = () => SERVICES.map((s) => ({ id: s.id }));

export const generateMetadata = async ({
	params,
}: {
	params: Promise<{ id: string }>;
}): Promise<Metadata> => {
	const { id } = await params;
	const s = SERVICES.find((x) => x.id === id);
	if (!s) return {};
	return {
		title: `${s.title} (${s.code})`,
		description: s.summary,
		alternates: { canonical: `/services/${s.id}` },
	};
};

// Service + BreadcrumbList 구조화 데이터 — 각 비자 분야가 자기 키워드로 검색·AI답변에 노출되도록.
const buildJsonLd = (s: Service) => {
	const url = `${siteConfig.url}/services/${s.id}`;
	return {
		"@context": "https://schema.org",
		"@graph": [
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
		],
	};
};

export default async function ServiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;
	const s = SERVICES.find((x) => x.id === id);
	if (!s) notFound();
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
