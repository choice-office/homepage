import Image from "next/image";
import Link from "next/link";
import { type BlogPost, firstContentImage, formatBlogDate } from "@/lib/blog";
import { Badge, Card, CardBody, CardTitle } from "./ds";

type BlogCardProps = { post: BlogPost; compact?: boolean };

export const BlogCard = ({ post, compact = false }: BlogCardProps) => {
	// 커버 우선순위: 등록 썸네일 → 본문 첫 이미지 → (둘 다 없으면) 초이스 로고
	const cover = post.cover ?? firstContentImage(post.content);
	return (
		<Link className="lk" href={`/blog/${post.slug}`} style={{ display: "block", height: "100%" }}>
			<Card
				padding="0"
				style={{ overflow: "hidden", display: "flex", flexDirection: "column", height: "100%" }}
			>
				<div
					style={{
						position: "relative",
						aspectRatio: "4 / 3",
						background:
							"linear-gradient(150deg, var(--color-surface-alt), var(--color-accent-soft))",
					}}
				>
					{cover ? (
						<Image
							src={cover}
							alt={post.coverAlt ?? ""}
							fill
							sizes="(max-width: 768px) 100vw, 33vw"
							style={{ objectFit: "cover" }}
						/>
					) : (
						<span
							style={{
								position: "absolute",
								inset: 0,
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
							}}
						>
							<Image
								src="/brand/logo-mark.png"
								alt="초이스 행정사 사무소"
								width={compact ? 92 : 116}
								height={compact ? 76 : 96}
								style={{ opacity: 0.6, objectFit: "contain" }}
							/>
						</span>
					)}
				</div>
				<div
					style={{ padding: compact ? 18 : 24, display: "flex", flexDirection: "column", flex: 1 }}
				>
					<div
						style={{
							display: "flex",
							justifyContent: "space-between",
							alignItems: "center",
							marginBottom: compact ? 10 : 12,
							gap: 12,
						}}
					>
						<Badge>{post.category}</Badge>
						<span
							style={{
								fontSize: compact ? 12 : 13,
								color: "var(--text-muted)",
								whiteSpace: "nowrap",
							}}
						>
							{formatBlogDate(post.date)}
						</span>
					</div>
					{/* 전역 h1~h4 text-wrap:balance가 카드 제목(h3)에도 걸려 오른쪽을 비우며 일찍 끊김 →
					    카드에선 wrap(그리디)으로 오버라이드해 줄을 꽉 채운다.
					    (text-wrap엔 normal이 무효값이라 무시됨 → wrap 사용) keep-all로 단어 중간은 안 끊음. */}
					<CardTitle
						style={{ fontSize: compact ? 16 : 18, wordBreak: "keep-all", textWrap: "wrap" }}
					>
						{post.title}
					</CardTitle>
					<CardBody style={{ fontSize: compact ? 13.5 : 15, flex: 1 }}>{post.excerpt}</CardBody>
				</div>
			</Card>
		</Link>
	);
};
