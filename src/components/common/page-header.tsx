import { FadeIn } from "@/components/common/fade-in";

type PageHeaderProps = {
	title: string;
	description?: string;
};

export const PageHeader = ({ title, description }: PageHeaderProps) => {
	return (
		<section className="border-border/40 border-b bg-accent/30 px-4 py-16 sm:px-6 lg:px-8">
			<FadeIn className="mx-auto max-w-6xl">
				<h1 className="font-bold text-3xl tracking-tight sm:text-4xl">{title}</h1>
				{description && (
					<p className="mt-3 max-w-2xl text-lg text-muted-foreground leading-relaxed">
						{description}
					</p>
				)}
			</FadeIn>
		</section>
	);
};
