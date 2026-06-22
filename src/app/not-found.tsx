import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
	return (
		<section className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
			<h1 className="font-bold text-6xl">404</h1>
			<p className="mt-4 text-lg text-muted-foreground">페이지를 찾을 수 없습니다.</p>
			<Button render={<Link href="/" />} className="mt-8">
				홈으로 돌아가기
			</Button>
		</section>
	);
}
