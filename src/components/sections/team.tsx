import { ArrowRight, Award, Briefcase } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FadeIn } from "@/components/common/fade-in";
import { repProfile } from "@/data/profile";
import { buttonVariants } from "@/lib/button-variants";
import { cn } from "@/lib/utils";

export const Team = () => {
	return (
		<section id="team" className="px-4 py-24 sm:px-6 lg:px-8">
			<div className="mx-auto max-w-6xl">
				<FadeIn className="mx-auto max-w-2xl text-center">
					<h2 className="font-bold text-3xl tracking-tight sm:text-4xl">대표 행정사</h2>
					<p className="mt-4 text-lg text-muted-foreground">
						상담부터 접수까지, 한 사람이 끝까지 책임집니다.
					</p>
				</FadeIn>

				<div className="mt-16 grid items-center gap-10 md:grid-cols-5">
					<FadeIn className="md:col-span-2">
						<div className="relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden rounded-2xl bg-muted">
							<Image
								src={repProfile.image}
								alt={`${repProfile.title} ${repProfile.name}`}
								fill
								sizes="(max-width: 768px) 100vw, 40vw"
								className="object-cover"
							/>
						</div>
					</FadeIn>

					<FadeIn delay={0.1} className="md:col-span-3">
						<p className="font-medium text-primary text-sm">{repProfile.title}</p>
						<p className="mt-1 font-bold text-2xl">{repProfile.name}</p>
						<p className="mt-4 text-lg text-muted-foreground leading-relaxed">
							“{repProfile.oneLiner}”
						</p>

						<div className="mt-8 grid gap-6 sm:grid-cols-2">
							<div>
								<p className="flex items-center gap-2 font-semibold text-sm">
									<Briefcase className="h-4 w-4 text-primary" /> 주요 경력
								</p>
								<ul className="mt-3 space-y-1.5">
									{repProfile.career.map((item) => (
										<li key={item} className="text-muted-foreground text-sm">
											{item}
										</li>
									))}
								</ul>
							</div>
							<div>
								<p className="flex items-center gap-2 font-semibold text-sm">
									<Award className="h-4 w-4 text-primary" /> 보유 자격
								</p>
								<ul className="mt-3 space-y-1.5">
									{repProfile.certifications.slice(0, 4).map((item) => (
										<li key={item} className="text-muted-foreground text-sm">
											{item}
										</li>
									))}
								</ul>
							</div>
						</div>

						<Link
							href="/about"
							className={cn(buttonVariants({ variant: "outline" }), "mt-8 gap-2")}
						>
							프로필 자세히 보기 <ArrowRight className="h-4 w-4" />
						</Link>
					</FadeIn>
				</div>
			</div>
		</section>
	);
};
