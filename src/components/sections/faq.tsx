import { FadeIn } from "@/components/common/fade-in";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { faqs } from "@/data/faqs";

export const FAQ = () => {
	return (
		<section id="faq" className="bg-muted/50 px-4 py-24 sm:px-6 lg:px-8">
			<div className="mx-auto max-w-3xl">
				<FadeIn className="text-center">
					<h2 className="font-bold text-3xl tracking-tight sm:text-4xl">자주 묻는 질문</h2>
					<p className="mt-4 text-lg text-muted-foreground">
						상담 전에 궁금하신 점을 확인해 보세요.
					</p>
				</FadeIn>

				<FadeIn delay={0.1} className="mt-12">
					<Accordion>
						{faqs.map((faq) => (
							<AccordionItem key={faq.question} value={faq.question}>
								<AccordionTrigger>{faq.question}</AccordionTrigger>
								<AccordionContent>
									<p>{faq.answer}</p>
								</AccordionContent>
							</AccordionItem>
						))}
					</Accordion>
				</FadeIn>
			</div>
		</section>
	);
};
