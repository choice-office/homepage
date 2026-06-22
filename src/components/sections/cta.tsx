import { ArrowRight, Phone } from "lucide-react";
import { FadeIn } from "@/components/common/fade-in";
import { contactInfo } from "@/config/site";
import { ctaContent } from "@/data/home";
import { buttonVariants } from "@/lib/button-variants";
import { cn } from "@/lib/utils";

const telHref = `tel:${contactInfo.tel.replace(/-/g, "")}`;

export const CTA = () => {
	return (
		<section id="cta" className="px-4 py-24 sm:px-6 lg:px-8">
			<FadeIn>
				<div className="mx-auto max-w-4xl rounded-2xl bg-primary px-6 py-16 text-center text-primary-foreground sm:px-16">
					<h2 className="font-bold text-3xl tracking-tight sm:text-4xl">{ctaContent.headline}</h2>
					<p className="mx-auto mt-4 max-w-2xl text-lg text-primary-foreground/80">
						{ctaContent.subtitle}
					</p>
					<div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
						<a
							href="#contact"
							className={cn(buttonVariants({ size: "lg", variant: "secondary" }), "gap-2")}
						>
							온라인 상담 신청 <ArrowRight className="h-4 w-4" />
						</a>
						<a
							href={telHref}
							className="inline-flex items-center gap-2 font-medium text-primary-foreground/90 underline-offset-4 hover:text-primary-foreground hover:underline"
						>
							<Phone className="h-4 w-4" />
							{contactInfo.tel}
						</a>
					</div>
				</div>
			</FadeIn>
		</section>
	);
};
