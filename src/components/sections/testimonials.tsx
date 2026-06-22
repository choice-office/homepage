import { ArrowRight, Quote } from "lucide-react";
import Link from "next/link";
import { FadeIn } from "@/components/common/fade-in";
import { Card, CardContent } from "@/components/ui/card";
import { reviews } from "@/data/reviews";

export const Testimonials = () => {
	return (
		<section id="reviews" className="bg-muted/40 px-4 py-24 sm:px-6 lg:px-8">
			<div className="mx-auto max-w-6xl">
				<FadeIn className="mx-auto max-w-2xl text-center">
					<h2 className="font-bold text-3xl tracking-tight sm:text-4xl">의뢰인 후기</h2>
					<p className="mt-4 text-lg text-muted-foreground">
						초이스 행정사 사무소와 함께한 의뢰인분들의 이야기입니다.
					</p>
				</FadeIn>

				<div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
					{reviews.map((item, i) => (
						<FadeIn key={item.id} delay={i * 0.08} className="h-full">
							<Card className="h-full">
								<CardContent className="flex h-full flex-col pt-6">
									<Quote className="mb-3 h-7 w-7 text-primary/30" />
									<p className="flex-1 text-foreground/90 leading-relaxed">{item.quote}</p>
									<div className="mt-6 flex items-center gap-3 border-border/60 border-t pt-4">
										<span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 font-bold text-primary">
											{item.initial}
										</span>
										<div className="min-w-0">
											<p className="font-medium text-sm">
												{item.initial} 님{item.location ? ` · ${item.location}` : ""}
											</p>
											<p className="text-muted-foreground text-xs">{item.field}</p>
										</div>
									</div>
								</CardContent>
							</Card>
						</FadeIn>
					))}
				</div>

				<FadeIn className="mt-12 text-center">
					<Link
						href="/reviews"
						className="inline-flex items-center gap-1.5 font-medium text-primary text-sm hover:underline"
					>
						후기 전체보기 <ArrowRight className="h-4 w-4" />
					</Link>
				</FadeIn>
			</div>
		</section>
	);
};
