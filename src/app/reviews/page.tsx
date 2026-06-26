import type { Metadata } from "next";
import { CTABand, PageHero, ReviewCard } from "@/components/site/sections";
import { getPublishedReviews } from "@/lib/reviews";

export const metadata: Metadata = {
	title: "의뢰인 후기",
	description:
		"절차를 마친 의뢰인들이 남겨주신 실제 후기입니다. 개인정보 보호를 위해 익명으로 게재합니다.",
};

// 후기 노출은 관리자에서 토글 — ISR로 주기적 반영
export const revalidate = 60;

export default async function ReviewsPage() {
	const reviews = await getPublishedReviews();
	return (
		<>
			<PageHero
				eyebrow="Client Reviews"
				title="의뢰인 후기"
				sub="절차를 마친 의뢰인들이 남겨주신 실제 후기입니다."
				crumbs={[{ label: "홈", route: "home" }, { label: "의뢰인 후기" }]}
			/>
			<section className="section" style={{ background: "var(--surface-page)" }}>
				<div className="container">
					<div data-stagger="tilt" className="grid-3">
						{reviews.map((r) => (
							<ReviewCard key={r.title} r={r} />
						))}
					</div>
					<p
						style={{ textAlign: "center", marginTop: 32, fontSize: 13, color: "var(--text-muted)" }}
					>
						※ 후기는 의뢰인의 동의를 받아 게시하며, 개인정보 보호를 위해 일부 내용을 각색했습니다.
						결과는 사안에 따라 다를 수 있습니다.
					</p>
				</div>
			</section>
			<CTABand />
		</>
	);
}
