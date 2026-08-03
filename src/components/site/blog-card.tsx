import Image from "next/image";
import Link from "next/link";
import { type BlogPostCard as BlogPostCardData, formatBlogDate } from "@/lib/blog";
import { cn } from "@/lib/utils";
import { Badge, Card, CardBody, CardTitle } from "./ds";

type BlogCardProps = { post: BlogPostCardData; compact?: boolean };

export const BlogCard = ({ post, compact = false }: BlogCardProps) => {
	// 커버는 cover_url 단일 출처(기존 글 백필 완료). 없으면 초이스 로고 플레이스홀더.
	const cover = post.cover;
	return (
		<Link className="lk block h-full" href={`/blog/${post.slug}`}>
			<Card className="flex h-full flex-col overflow-hidden p-0">
				<div className="relative aspect-[4/3] [background:linear-gradient(150deg,_var(--color-surface-alt),_var(--color-accent-soft))]">
					{cover ? (
						<Image
							src={cover}
							alt={post.coverAlt ?? ""}
							fill
							sizes="(max-width: 768px) 100vw, 33vw"
							className="object-cover"
						/>
					) : (
						<span className="absolute inset-0 flex items-center justify-center">
							<Image
								src="/brand/logo-mark.png"
								alt="초이스 행정사사무소"
								width={compact ? 92 : 116}
								height={compact ? 76 : 96}
								className="object-contain opacity-60"
							/>
						</span>
					)}
				</div>
				<div className={cn("flex flex-1 flex-col", compact ? "p-[18px]" : "p-[24px]")}>
					<div
						className={cn(
							"flex items-center justify-between gap-3",
							compact ? "mb-[10px]" : "mb-[12px]",
						)}
					>
						<Badge>{post.category}</Badge>
						<span
							className={cn(
								"whitespace-nowrap text-[color:var(--text-muted)]",
								compact ? "text-[12px]" : "text-[13px]",
							)}
						>
							{formatBlogDate(post.date)}
						</span>
					</div>
					{/* 전역 h1~h4 text-wrap:balance가 카드 제목(h3)에도 걸려 오른쪽을 비우며 일찍 끊김 →
					    카드에선 wrap(그리디)으로 오버라이드해 줄을 꽉 채운다.
					    (text-wrap엔 normal이 무효값이라 무시됨 → wrap 사용) keep-all로 단어 중간은 안 끊음. */}
					<CardTitle
						className={cn("break-keep [text-wrap:wrap]", compact ? "text-[16px]" : "text-[18px]")}
					>
						{post.title}
					</CardTitle>
					<CardBody
						className={cn("blog-excerpt flex-1", compact ? "text-[13.5px]" : "text-[15px]")}
					>
						{post.excerpt}
					</CardBody>
				</div>
			</Card>
		</Link>
	);
};
