import { ArrowRight, Phone } from "lucide-react";
import Image from "next/image";
import { FadeIn } from "@/components/common/fade-in";
import { contactInfo } from "@/config/site";
import { heroContent } from "@/data/home";
import { buttonVariants } from "@/lib/button-variants";
import { cn } from "@/lib/utils";

const telHref = `tel:${contactInfo.tel.replace(/-/g, "")}`;

export const Hero = () => {
	return (
		<section className="relative flex min-h-[86vh] items-center justify-center overflow-hidden bg-[#1a1612] px-4 py-24 sm:px-6 lg:px-8">
			{/* 배경 사진 (임시 스톡 — 실제 사진 받으면 heroContent.image URL 만 교체).
			    unoptimized: Next 서버 최적화 우회, 브라우저가 원본 직접 로드 */}
			<Image
				src={heroContent.image}
				alt=""
				fill
				priority
				unoptimized
				sizes="100vw"
				className="object-cover"
			/>
			{/* 가독성 + 브랜드(웜) 톤 오버레이 */}
			<div
				aria-hidden
				className="absolute inset-0"
				style={{
					background:
						"linear-gradient(180deg, rgba(26,22,18,0.68) 0%, rgba(26,22,18,0.48) 42%, rgba(26,22,18,0.72) 100%)",
				}}
			/>

			<div className="relative z-10 mx-auto max-w-3xl text-center text-white">
				<FadeIn>
					<span className="inline-flex items-center rounded-full border border-white/25 bg-white/10 px-4 py-1.5 font-medium text-sm text-white/90 backdrop-blur-sm">
						{heroContent.eyebrow}
					</span>
				</FadeIn>

				<FadeIn delay={0.05}>
					<h1 className="mt-6 font-bold text-4xl leading-tight tracking-tight sm:text-5xl md:text-6xl">
						{heroContent.headline}
						<span className="text-secondary">{heroContent.headlineHighlight}</span>
					</h1>
				</FadeIn>

				<FadeIn delay={0.1}>
					<p className="mx-auto mt-6 max-w-2xl text-lg text-white/85 leading-relaxed">
						{heroContent.subtitle}
					</p>
				</FadeIn>

				<FadeIn delay={0.2}>
					<div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
						<a
							href={heroContent.primaryCta.href}
							className={cn(buttonVariants({ size: "lg" }), "gap-2")}
						>
							{heroContent.primaryCta.label} <ArrowRight className="h-4 w-4" />
						</a>
						<a
							href={telHref}
							className={cn(
								buttonVariants({ size: "lg", variant: "outline" }),
								"gap-2 border-white/60 bg-transparent text-white hover:bg-white/10 hover:text-white",
							)}
						>
							<Phone className="h-4 w-4" />
							{contactInfo.tel}
						</a>
					</div>
				</FadeIn>

				<FadeIn delay={0.3}>
					<p className="mt-8 text-sm text-white/75">{heroContent.trustLine}</p>
				</FadeIn>
			</div>
		</section>
	);
};
