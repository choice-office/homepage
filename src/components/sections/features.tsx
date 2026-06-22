import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { FadeIn } from "@/components/common/fade-in";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { services } from "@/data/services";

export const Features = () => {
	return (
		<section id="services" className="px-4 py-24 sm:px-6 lg:px-8">
			<div className="mx-auto max-w-6xl">
				<FadeIn className="mx-auto max-w-2xl text-center">
					<h2 className="font-bold text-3xl tracking-tight sm:text-4xl">업무분야</h2>
					<p className="mt-4 text-lg text-muted-foreground">
						외국인 체류·비자, 출입국, 국적 업무를 전문으로 진행합니다.
					</p>
				</FadeIn>

				<div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
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
			</div>
		</section>
	);
};
