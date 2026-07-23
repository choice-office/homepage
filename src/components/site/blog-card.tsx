import Image from "next/image";
import Link from "next/link";
import { type BlogPost, firstContentImage, formatBlogDate } from "@/lib/blog";
import { cn } from "@/lib/utils";
import { Badge, Card, CardBody, CardTitle } from "./ds";

type BlogCardProps = { post: BlogPost; compact?: boolean };

export const BlogCard = ({ post, compact = false }: BlogCardProps) => {
	// 커버 우선순위: 등록 썸네일 → 본문 첫 이미지 → (둘 다 없으면) 초이스 로고
	const cover = post.cover ?? firstContentImage(post.content);
	return (
		<Link className="lk block h-full" href={`/blog/${post.slug}`}>
			<Card padding="0" className="flex h-full flex-col overflow-hidden">
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
								alt="초이스 행정사 사무소"
								width={compact ? 92 : 116}
								height={compact ? 76 : 96}
								className="object-contain opacity-60"
							/>
						</span>
					)}
				</div>
				<div className="flex flex-1 flex-col" style={{ padding: compact ? 18 : 24 }}>
					<div
						className="flex items-center justify-between gap-3"
						style={{ marginBottom: compact ? 10 : 12 }}
					>
						<Badge>{post.category}</Badge>
						<span
							className="whitespace-nowrap text-[color:var(--text-muted)]"
							style={{ fontSize: compact ? 12 : 13 }}
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
					<CardBody
						className={cn("blog-excerpt", "flex-1")}
						style={{ fontSize: compact ? 13.5 : 15 }}
					>
						{post.excerpt}
					</CardBody>
				</div>
			</Card>
		</Link>
	);
};
