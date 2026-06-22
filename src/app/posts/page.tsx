import { PenLine } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/common/page-header";
import { buttonVariants } from "@/lib/button-variants";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
	title: "블로그",
	description: "비자·출입국·국적 관련 정보와 소식을 전합니다.",
};

export default function PostsPage() {
	return (
		<>
			<PageHeader title="블로그" description="비자·출입국·국적 관련 정보와 소식을 전합니다." />

			<section className="px-4 py-24 sm:px-6 lg:px-8">
				<div className="mx-auto flex max-w-xl flex-col items-center text-center">
					<div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
						<PenLine className="h-8 w-8 text-primary" />
					</div>
					<h2 className="mt-6 font-semibold text-xl">블로그를 준비하고 있습니다</h2>
					<p className="mt-3 text-muted-foreground leading-relaxed">
						유용한 비자·출입국 정보를 곧 이곳에서 만나보실 수 있습니다. 그동안 궁금하신 점은 네이버
						블로그 또는 상담을 통해 문의해 주세요.
					</p>
					<div className="mt-8 flex flex-col gap-3 sm:flex-row">
						<a
							href="https://blog.naver.com/k-visa1345"
							target="_blank"
							rel="noopener noreferrer"
							className={buttonVariants({ variant: "outline" })}
						>
							네이버 블로그 바로가기
						</a>
						<Link href="/#contact" className={cn(buttonVariants())}>
							상담 신청하기
						</Link>
					</div>
				</div>
			</section>
		</>
	);
}
