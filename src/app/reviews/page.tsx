import { Quote } from "lucide-react";
import type { Metadata } from "next";
import { FadeIn } from "@/components/common/fade-in";
import { PageHeader } from "@/components/common/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { reviews } from "@/data/reviews";

export const metadata: Metadata = {
	title: "의뢰인 후기",
	description: "초이스 행정사 사무소와 함께한 의뢰인분들의 후기입니다.",
};

export default function ReviewsPage() {
	return (
		<>
			<PageHeader
				title="의뢰인 후기"
				description="초이스 행정사 사무소와 함께한 의뢰인분들의 이야기입니다. 개인정보 보호를 위해 익명으로 게재합니다."
			/>

			<section className="px-4 py-20 sm:px-6 lg:px-8">
				<div className="mx-auto grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
					{reviews.map((item, i) => (
						<FadeIn key={item.id} delay={i * 0.06} className="h-full">
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
			</section>
		</>
	);
}
