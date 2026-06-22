import { FadeIn } from "@/components/common/fade-in";
import { processSteps as steps } from "@/data/home";
import { cn } from "@/lib/utils";

export const Process = () => {
	return (
		<section id="process" className="bg-muted/50 px-4 py-24 sm:px-6 lg:px-8">
			<div className="mx-auto max-w-6xl">
				<FadeIn className="mx-auto max-w-2xl text-center">
					<h2 className="font-bold text-3xl tracking-tight sm:text-4xl">진행 과정</h2>
					<p className="mt-4 text-lg text-muted-foreground">
						간단하고 투명한 프로세스로 진행됩니다.
					</p>
				</FadeIn>

				{/* 데스크탑: 가로 배치, 모바일: 세로 배치 */}
				<div className="relative mt-16">
					{/* 연결선 (데스크탑만) */}
					<div
						aria-hidden
						className="absolute top-10 right-0 left-0 hidden h-px bg-border lg:block"
						style={{
							left: "calc(100% / (var(--steps) * 2))",
							right: "calc(100% / (var(--steps) * 2))",
						}}
					/>

					<div
						className="grid grid-cols-1 gap-8 lg:grid-cols-4"
						style={{ "--steps": steps.length } as React.CSSProperties}
					>
						{steps.map((step, i) => (
							<FadeIn key={step.title} delay={i * 0.12}>
								<div className="flex flex-col items-center text-center">
									{/* 아이콘 + 번호 버블 */}
									<div className="relative mb-6">
										<div className="flex h-20 w-20 items-center justify-center rounded-full bg-background shadow-md ring-1 ring-border">
											<step.icon className="h-8 w-8 text-primary" />
										</div>
										{/* 스텝 번호 */}
										<span
											className={cn(
												"absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full font-bold text-primary-foreground text-xs",
												"bg-primary",
											)}
										>
											{i + 1}
										</span>
									</div>

									<h3 className="font-semibold text-lg">{step.title}</h3>
									<p className="mt-2 text-muted-foreground text-sm leading-relaxed">
										{step.description}
									</p>
								</div>
							</FadeIn>
						))}
					</div>
				</div>
			</div>
		</section>
	);
};
