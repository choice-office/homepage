import type { Metadata } from "next";
import Image from "next/image";
import { FadeIn } from "@/components/common/fade-in";
import { PageHeader } from "@/components/common/page-header";
import { MapSection } from "@/components/sections/map";
import { greeting } from "@/data/home";
import { repProfile } from "@/data/profile";

export const metadata: Metadata = {
	title: "사무소 소개",
	description:
		"실력에 책임감을 더한 초이스 행정사 사무소. 대표 행정사 인사말과 약력·자격·경력을 소개합니다.",
};

const CredList = ({ title, items }: { title: string; items: readonly string[] }) => {
	return (
		<div>
			<h3 className="font-semibold text-lg">{title}</h3>
			<ul className="mt-3 space-y-2">
				{items.map((item) => (
					<li key={item} className="flex gap-2.5 text-muted-foreground text-sm leading-relaxed">
						<span aria-hidden className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
						{item}
					</li>
				))}
			</ul>
		</div>
	);
};

export default function AboutPage() {
	return (
		<>
			<PageHeader
				title="사무소 소개"
				description="‘실력에 책임감을 더한’ 초이스 행정사 사무소입니다."
			/>

			{/* 인사말 */}
			<section className="px-4 py-20 sm:px-6 lg:px-8">
				<FadeIn className="mx-auto max-w-3xl">
					<p className="font-medium text-primary text-sm">인사말</p>
					<h2 className="mt-3 font-bold text-2xl tracking-tight sm:text-3xl">{greeting.title}</h2>
					<div className="mt-6 space-y-4 text-muted-foreground leading-relaxed">
						{greeting.paragraphs.map((p) => (
							<p key={p.slice(0, 12)}>{p}</p>
						))}
					</div>
				</FadeIn>
			</section>

			{/* 대표 프로필 */}
			<section className="bg-muted/40 px-4 py-20 sm:px-6 lg:px-8">
				<div className="mx-auto max-w-5xl">
					<div className="grid gap-10 md:grid-cols-5">
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
							<div className="mt-5 text-center md:text-left">
								<p className="font-medium text-primary text-sm">{repProfile.title}</p>
								<p className="mt-1 font-bold text-2xl">{repProfile.name}</p>
								<p className="mt-3 text-muted-foreground text-sm leading-relaxed">
									“{repProfile.oneLiner}”
								</p>
							</div>
						</FadeIn>

						<FadeIn delay={0.1} className="space-y-8 md:col-span-3">
							<CredList title="학력" items={repProfile.education} />
							<CredList title="주요 경력" items={repProfile.career} />
							<CredList title="보유 자격증" items={repProfile.certifications} />
							<CredList title="소속 · 수상 · 위촉" items={repProfile.organizations} />
							<CredList title="교육 이수" items={repProfile.training} />
							<CredList title="봉사 활동" items={repProfile.volunteer} />
						</FadeIn>
					</div>
				</div>
			</section>

			<MapSection />
		</>
	);
}
