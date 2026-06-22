"use client";

import { Button } from "@/components/ui/button";

export default function ErrorPage({
	reset,
}: {
	error: globalThis.Error & { digest?: string };
	reset: () => void;
}) {
	return (
		<section className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
			<h1 className="font-bold text-4xl">오류가 발생했습니다</h1>
			<p className="mt-4 text-lg text-muted-foreground">
				예상치 못한 오류가 발생했습니다. 다시 시도해주세요.
			</p>
			<Button onClick={reset} className="mt-8">
				다시 시도
			</Button>
		</section>
	);
}
