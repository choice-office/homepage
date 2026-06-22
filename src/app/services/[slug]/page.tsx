import { ArrowLeft, ArrowRight, CalendarClock, FileText, Phone, Users } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FadeIn } from "@/components/common/fade-in";
import { contactInfo } from "@/config/site";
import { services } from "@/data/services";
import { buttonVariants } from "@/lib/button-variants";
import { cn } from "@/lib/utils";

const telHref = `tel:${contactInfo.tel.replace(/-/g, "")}`;

export const generateStaticParams = () => {
	return services.map((service) => ({ slug: service.slug }));
};

export const generateMetadata = async ({
	params,
}: {
	params: Promise<{ slug: string }>;
}): Promise<Metadata> => {
	const { slug } = await params;
	const service = services.find((s) => s.slug === slug);
	if (!service) return {};
	return {
		title: `${service.title} (${service.code})`,
		description: service.summary,
	};
};

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
	const { slug } = await params;
	const service = services.find((s) => s.slug === slug);
	if (!service) notFound();

	const detail = service.detail;

	return (
		<>
			<section className="border-border/40 border-b bg-accent/30 px-4 py-16 sm:px-6 lg:px-8">
				<FadeIn className="mx-auto max-w-3xl">
					<Link
						href="/services"
						className="inline-flex items-center gap-1.5 text-muted-foreground text-sm hover:text-foreground"
					>
						<ArrowLeft className="h-4 w-4" /> 업무분야
					</Link>
					<div className="mt-5 flex items-center gap-4">
						<div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
							<service.icon className="h-7 w-7 text-primary" />
						</div>
						<div>
							<p className="font-semibold text-muted-foreground text-sm tracking-wide">
								{service.code}
							</p>
							<h1 className="font-bold text-3xl tracking-tight sm:text-4xl">{service.title}</h1>
						</div>
					</div>
					<p className="mt-5 text-lg text-muted-foreground leading-relaxed">{service.summary}</p>
				</FadeIn>
			</section>

			<section className="px-4 py-16 sm:px-6 lg:px-8">
				<div className="mx-auto max-w-3xl space-y-10">
					{detail ? (
						<>
							{detail.target && (
								<div>
									<h2 className="flex items-center gap-2 font-semibold text-xl">
										<Users className="h-5 w-5 text-primary" /> 이런 분께 필요합니다
									</h2>
									<p className="mt-3 text-muted-foreground leading-relaxed">{detail.target}</p>
								</div>
							)}

							{detail.documents && detail.documents.length > 0 && (
								<div>
									<h2 className="flex items-center gap-2 font-semibold text-xl">
										<FileText className="h-5 w-5 text-primary" /> 주요 필요 서류
									</h2>
									<ul className="mt-3 space-y-2">
										{detail.documents.map((doc) => (
											<li key={doc} className="flex gap-2.5 text-muted-foreground leading-relaxed">
												<span
													aria-hidden
													className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary"
												/>
												{doc}
											</li>
										))}
									</ul>
								</div>
							)}

							{detail.process && detail.process.length > 0 && (
								<div>
									<h2 className="font-semibold text-xl">진행 절차</h2>
									<ol className="mt-3 space-y-2">
										{detail.process.map((step, i) => (
											<li key={step} className="flex gap-3 text-muted-foreground leading-relaxed">
												<span className="font-semibold text-primary">{i + 1}.</span>
												{step}
											</li>
										))}
									</ol>
								</div>
							)}

							{detail.duration && (
								<div>
									<h2 className="flex items-center gap-2 font-semibold text-xl">
										<CalendarClock className="h-5 w-5 text-primary" /> 예상 소요 기간
									</h2>
									<p className="mt-3 text-muted-foreground leading-relaxed">{detail.duration}</p>
								</div>
							)}
						</>
					) : (
						<p className="text-muted-foreground leading-relaxed">
							{service.title} 관련 상세 안내는 의뢰인의 상황에 따라 달라집니다. 무료 상담을 통해
							필요 서류와 절차, 예상 기간을 자세히 안내해 드리겠습니다.
						</p>
					)}

					<p className="rounded-lg bg-muted/60 p-4 text-muted-foreground text-sm leading-relaxed">
						※ 비자·출입국 결과는 개인별 요건과 심사에 따라 달라질 수 있습니다. 정확한 진단은 상담을
						통해 도와드리겠습니다.
					</p>

					<div className="flex flex-col gap-3 border-border/60 border-t pt-8 sm:flex-row">
						<Link href="/#contact" className={cn(buttonVariants({ size: "lg" }), "gap-2")}>
							이 분야 상담 신청 <ArrowRight className="h-4 w-4" />
						</Link>
						<a
							href={telHref}
							className={cn(buttonVariants({ size: "lg", variant: "outline" }), "gap-2")}
						>
							<Phone className="h-4 w-4" /> {contactInfo.tel}
						</a>
					</div>
				</div>
			</section>
		</>
	);
}
