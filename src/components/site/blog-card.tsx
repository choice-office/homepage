import Image from "next/image";
import Link from "next/link";
import { type BlogPost, formatBlogDate } from "@/lib/blog";
import { HERO_IMG } from "@/lib/site-data";
import { Badge, Card, CardBody, CardTitle } from "./ds";

// 커버 이미지가 없는 글의 더미 커버 — 슬러그로 고르게 분배(로컬·허용 도메인만 사용)
const DUMMY_COVERS = [
	"/strengths/strength-1.jpg",
	"/strengths/strength-2.jpg",
	"/strengths/strength-3.jpg",
	HERO_IMG,
];
const dummyCover = (slug: string): string => {
	let h = 0;
	for (let i = 0; i < slug.length; i++) h = (h * 31 + slug.charCodeAt(i)) >>> 0;
	return DUMMY_COVERS[h % DUMMY_COVERS.length];
};

export const BlogCard = ({ post }: { post: BlogPost }) => (
	<Link className="lk" href={`/blog/${post.slug}`} style={{ display: "block", height: "100%" }}>
		<Card
			padding="0"
			style={{ overflow: "hidden", display: "flex", flexDirection: "column", height: "100%" }}
		>
			<div
				style={{
					position: "relative",
					aspectRatio: "4 / 3",
					background: "linear-gradient(150deg, var(--color-surface-alt), var(--color-accent-soft))",
				}}
			>
				<Image
					src={post.cover ?? dummyCover(post.slug)}
					alt={post.coverAlt ?? ""}
					fill
					sizes="(max-width: 768px) 100vw, 33vw"
					style={{ objectFit: "cover" }}
				/>
			</div>
			<div style={{ padding: 24, display: "flex", flexDirection: "column", flex: 1 }}>
				<div
					style={{
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
						marginBottom: 12,
						gap: 12,
					}}
				>
					<Badge>{post.category}</Badge>
					<span style={{ fontSize: 13, color: "var(--text-muted)", whiteSpace: "nowrap" }}>
						{formatBlogDate(post.date)}
					</span>
				</div>
				<CardTitle style={{ fontSize: 18 }}>{post.title}</CardTitle>
				<CardBody style={{ fontSize: 15, flex: 1 }}>{post.excerpt}</CardBody>
			</div>
		</Card>
	</Link>
);
