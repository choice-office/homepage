import Image from "next/image";
import Link from "next/link";
import { type BlogPost, formatBlogDate } from "@/lib/blog-data";
import { Badge, Card, CardBody, CardTitle } from "./ds";
import { Icon } from "./icon";

export const BlogCard = ({ post }: { post: BlogPost }) => (
	<Link className="lk" href={`/blog/${post.slug}`} style={{ display: "block", height: "100%" }}>
		<Card
			padding="0"
			style={{ overflow: "hidden", display: "flex", flexDirection: "column", height: "100%" }}
		>
			<div
				style={{
					position: "relative",
					height: 180,
					background: "linear-gradient(150deg, var(--color-surface-alt), var(--color-accent-soft))",
				}}
			>
				{post.cover ? (
					<Image
						src={post.cover}
						alt=""
						fill
						sizes="(max-width: 768px) 100vw, 33vw"
						style={{ objectFit: "cover" }}
					/>
				) : (
					<div
						style={{
							position: "absolute",
							inset: 0,
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
						}}
					>
						<Icon
							n="file-text"
							style={{ width: 40, height: 40, color: "var(--color-primary)", opacity: 0.5 }}
						/>
					</div>
				)}
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
