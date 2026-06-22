import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { FadeIn } from "@/components/common/fade-in";
import { PageHeader } from "@/components/common/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { services } from "@/data/services";

export const metadata: Metadata = {
	title: "업무분야",
	description:
		"거소증(F-4), 영주권(F-5), 결혼비자(F-6), 외국인 연예인(E-6)·전문직(E-7) 비자, 국적회복 등 출입국·비자 업무를 전문으로 진행합니다.",
};

export default function ServicesPage() {
	return (
		<>
			<PageHeader
				title="업무분야"
				description="외국인 체류·비자, 출입국, 국적 업무를 전문으로 진행합니다. 분야를 선택하면 자세한 안내를 확인하실 수 있습니다."
			/>

			<section className="px-4 py-20 sm:px-6 lg:px-8">
				<div className="mx-auto grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
					{services.map((service, i) => (
						<FadeIn key={service.slug} delay={i * 0.06} className="h-full">
							<Link href={`/services/${service.slug}`} className="group block h-full">
								<Card className="h-full transition-shadow hover:shadow-md">
									<CardHeader>
										<service.icon className="mb-2 h-10 w-10 text-primary" />
										<span className="font-semibold text-muted-foreground text-xs tracking-wide">
											{service.code}
										</span>
										<CardTitle className="text-lg">{service.title}</CardTitle>
									</CardHeader>
									<CardContent className="flex-1">
										<p className="text-muted-foreground text-sm leading-relaxed">
											{service.summary}
										</p>
										<span className="mt-4 inline-flex items-center gap-1 font-medium text-primary text-sm">
											자세히 보기
											<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
										</span>
									</CardContent>
								</Card>
							</Link>
						</FadeIn>
					))}
				</div>
			</section>
		</>
	);
}
