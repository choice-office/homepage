import { TrustBand } from "@/components/common/marquee";
import { Contact } from "@/components/sections/contact";
import { Credentials } from "@/components/sections/credentials";
import { CTA } from "@/components/sections/cta";
import { FAQ } from "@/components/sections/faq";
import { Features } from "@/components/sections/features";
import { Hero } from "@/components/sections/hero";
import { MapSection } from "@/components/sections/map";
import { Process } from "@/components/sections/process";
import { Stats } from "@/components/sections/stats";
import { Strengths } from "@/components/sections/strengths";
import { Team } from "@/components/sections/team";
import { Testimonials } from "@/components/sections/testimonials";

export default function Home() {
	return (
		<>
			<Hero />
			<TrustBand />
			<Testimonials />
			<Features />
			<Strengths />
			<Process />
			<Stats />
			<Team />
			<Credentials />
			<FAQ />
			<CTA />
			<MapSection />
			<Contact />
		</>
	);
}
