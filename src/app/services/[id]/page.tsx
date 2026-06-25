import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ServiceDetail } from "@/components/site/service-detail";
import { SERVICES } from "@/lib/site-data";

export const generateStaticParams = () => SERVICES.map((s) => ({ id: s.id }));

export const generateMetadata = async ({
	params,
}: {
	params: Promise<{ id: string }>;
}): Promise<Metadata> => {
	const { id } = await params;
	const s = SERVICES.find((x) => x.id === id);
	if (!s) return {};
	return { title: `${s.title} (${s.code})`, description: s.summary };
};

export default async function ServiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;
	const s = SERVICES.find((x) => x.id === id);
	if (!s) notFound();
	return <ServiceDetail id={id} />;
}
