import { Award, BadgeCheck, GraduationCap, type LucideIcon } from "lucide-react";
import { FadeIn } from "@/components/common/fade-in";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { repProfile } from "@/data/profile";

type CredGroup = { icon: LucideIcon; title: string; items: readonly string[] };

const groups: CredGroup[] = [
	{ icon: BadgeCheck, title: "보유 자격증", items: repProfile.certifications },
	{ icon: Award, title: "소속 · 위촉 · 수상", items: repProfile.organizations },
	{ icon: GraduationCap, title: "전문 교육 이수", items: repProfile.training },
];

export const Credentials = () => {
	return (
		<section id="credentials" className="bg-muted/40 px-4 py-24 sm:px-6 lg:px-8">
			<div className="mx-auto max-w-6xl">
				<FadeIn className="mx-auto max-w-2xl text-center">
					<h2 className="font-bold text-3xl tracking-tight sm:text-4xl">자격 · 인증</h2>
					<p className="mt-4 text-lg text-muted-foreground">
						국가공인 자격과 지속적인 전문 교육으로 신뢰를 더합니다.
					</p>
				</FadeIn>

				<div className="mt-16 grid gap-6 md:grid-cols-3">
					{groups.map((group, i) => (
						<FadeIn key={group.title} delay={i * 0.1} className="h-full">
							<Card className="h-full">
								<CardHeader>
									<group.icon className="mb-2 h-9 w-9 text-primary" />
									<CardTitle className="text-lg">{group.title}</CardTitle>
								</CardHeader>
								<CardContent>
									<ul className="space-y-2.5">
										{group.items.map((item) => (
											<li
												key={item}
												className="flex gap-2.5 text-muted-foreground text-sm leading-relaxed"
											>
												<span
													aria-hidden
													className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary"
												/>
												{item}
											</li>
										))}
									</ul>
								</CardContent>
							</Card>
						</FadeIn>
					))}
				</div>
			</div>
		</section>
	);
};
