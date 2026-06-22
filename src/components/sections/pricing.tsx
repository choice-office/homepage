import { Check } from "lucide-react";
import { FadeIn } from "@/components/common/fade-in";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

// ★ 설정 — 플랜 이름, 가격, 기능 목록을 수정하세요
const plans = [
	{
		name: "Starter",
		price: "$9",
		description: "Perfect for individuals and small projects.",
		features: ["1 user", "5 GB storage", "Basic support", "Core features"],
		popular: false,
	},
	{
		name: "Pro",
		price: "$29",
		description: "Best for growing teams and businesses.",
		features: ["10 users", "50 GB storage", "Priority support", "Advanced features", "Analytics"],
		popular: true,
	},
	{
		name: "Enterprise",
		price: "Custom",
		description: "For large organizations with custom needs.",
		features: [
			"Unlimited users",
			"Unlimited storage",
			"24/7 support",
			"All features",
			"Custom integrations",
			"SLA",
		],
		popular: false,
	},
];

export const Pricing = () => {
	return (
		<section id="pricing" className="px-4 py-24 sm:px-6 lg:px-8">
			<div className="mx-auto max-w-6xl">
				<FadeIn className="mx-auto max-w-2xl text-center">
					<h2 className="font-bold text-3xl tracking-tight sm:text-4xl">Pricing</h2>
					<p className="mt-4 text-lg text-muted-foreground">
						Choose the plan that works best for you.
					</p>
				</FadeIn>

				<div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
					{plans.map((plan, i) => (
						<FadeIn key={plan.name} delay={i * 0.1} className="h-full">
							<Card className={cn("relative h-full", plan.popular && "ring-2 ring-primary")}>
								{plan.popular && (
									<div className="absolute -top-3 left-1/2 -translate-x-1/2">
										<Badge>Most Popular</Badge>
									</div>
								)}
								<CardHeader>
									<CardTitle className="text-lg">{plan.name}</CardTitle>
									<CardDescription>{plan.description}</CardDescription>
									<div className="mt-4">
										<span className="font-bold text-4xl">{plan.price}</span>
										{plan.price !== "Custom" && (
											<span className="text-muted-foreground">/month</span>
										)}
									</div>
								</CardHeader>
								<CardContent className="flex-1">
									<ul className="space-y-3">
										{plan.features.map((feature) => (
											<li key={feature} className="flex items-center gap-2">
												<Check className="h-4 w-4 text-primary" />
												<span className="text-sm">{feature}</span>
											</li>
										))}
									</ul>
								</CardContent>
								<CardFooter>
									<Button className="w-full" variant={plan.popular ? "default" : "outline"}>
										{plan.price === "Custom" ? "Contact Sales" : "Get Started"}
									</Button>
								</CardFooter>
							</Card>
						</FadeIn>
					))}
				</div>
			</div>
		</section>
	);
};
