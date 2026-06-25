import type { Metadata } from "next";
import { Badge, Card, CardBody, CardTitle } from "@/components/site/ds";
import { Icon } from "@/components/site/icon";
import { PageHero } from "@/components/site/sections";
import { BLOG, NAVER_BLOG } from "@/lib/site-data";

export const metadata: Metadata = {
	title: "출입국·비자 칼럼",
	description: "자주 묻는 절차와 요건을, 사례 중심으로 알기 쉽게 정리한 출입국·비자 칼럼입니다.",
};

export default function BlogPage() {
	return (
		<>
			<PageHero
				eyebrow="Blog"
				title="출입국·비자 칼럼"
				sub="자주 묻는 절차와 요건을, 사례 중심으로 알기 쉽게 정리합니다."
				crumbs={[{ label: "홈", route: "home" }, { label: "블로그" }]}
			/>
			<section className="section" style={{ background: "var(--surface-page)" }}>
				<div className="container">
					<div data-stagger className="grid-3">
						{BLOG.map((b) => (
							<a
								key={b.title}
								className="lk"
								href={NAVER_BLOG}
								target="_blank"
								rel="noopener noreferrer"
								style={{ display: "block" }}
							>
								<Card
									padding="0"
									style={{
										overflow: "hidden",
										display: "flex",
										flexDirection: "column",
										height: "100%",
									}}
								>
									<div
										style={{
											height: 140,
											background:
												"linear-gradient(150deg, var(--color-surface-alt), var(--color-accent-soft))",
											display: "flex",
											alignItems: "center",
											justifyContent: "center",
										}}
									>
										<Icon
											n="file-text"
											style={{
												width: 40,
												height: 40,
												color: "var(--color-primary)",
												opacity: 0.55,
											}}
										/>
									</div>
									<div style={{ padding: 24, display: "flex", flexDirection: "column", flex: 1 }}>
										<div
											style={{
												display: "flex",
												justifyContent: "space-between",
												alignItems: "center",
												marginBottom: 12,
											}}
										>
											<Badge>{b.cat}</Badge>
											<span style={{ fontSize: 13, color: "var(--text-muted)" }}>{b.date}</span>
										</div>
										<CardTitle style={{ fontSize: 18 }}>{b.title}</CardTitle>
										<CardBody style={{ fontSize: 15, flex: 1 }}>{b.excerpt}</CardBody>
										<span
											style={{
												display: "inline-flex",
												alignItems: "center",
												gap: 8,
												marginTop: 16,
												fontSize: 13,
												color: "var(--text-muted)",
											}}
										>
											<Icon n="clock" style={{ width: 14, height: 14 }} /> 읽는 시간 {b.read}
										</span>
									</div>
								</Card>
							</a>
						))}
					</div>
					<p
						style={{ textAlign: "center", marginTop: 32, fontSize: 14, color: "var(--text-muted)" }}
					>
						네이버 블로그에서 더 많은 글을 보실 수 있습니다.
					</p>
				</div>
			</section>
		</>
	);
}
