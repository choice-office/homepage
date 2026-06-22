import { FadeIn } from "@/components/common/fade-in";
import { strengths } from "@/data/home";

export const Strengths = () => {
	return (
		<section id="strengths" className="bg-muted/40 px-4 py-24 sm:px-6 lg:px-8">
			<div className="mx-auto max-w-6xl">
				<FadeIn className="mx-auto max-w-2xl text-center">
					<h2 className="font-bold text-3xl tracking-tight sm:text-4xl">초이스 행정사의 강점</h2>
					<p className="mt-4 text-lg text-muted-foreground">
						실력에 책임감을 더해, 의뢰인의 입장에서 함께합니다.
					</p>
				</FadeIn>

				<div className="mt-16 grid gap-8 md:grid-cols-3">
					{strengths.map((item, i) => (
						<FadeIn key={item.title} delay={i * 0.1}>
							<div className="flex flex-col items-center text-center">
								<div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
									<item.icon className="h-8 w-8 text-primary" />
								</div>
								<h3 className="mt-5 font-semibold text-xl">{item.title}</h3>
								<p className="mt-3 text-muted-foreground leading-relaxed">{item.description}</p>
							</div>
						</FadeIn>
					))}
				</div>
			</div>
		</section>
	);
};
