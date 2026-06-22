"use client";

import { useEffect } from "react";

export default function GlobalError({
	error,
	reset,
}: {
	error: globalThis.Error & { digest?: string };
	reset: () => void;
}) {
	useEffect(() => {
		console.error(error);
	}, [error]);

	return (
		<html lang="ko">
			<body className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center font-sans antialiased">
				<h1 className="font-bold text-4xl text-foreground">예상치 못한 오류가 발생했습니다</h1>
				<p className="mt-4 text-lg text-muted-foreground">잠시 후 다시 시도해주세요.</p>
				<button
					type="button"
					onClick={reset}
					className="mt-8 rounded-md bg-primary px-6 py-2.5 font-medium text-primary-foreground text-sm hover:bg-primary/90"
				>
					다시 시도
				</button>
			</body>
		</html>
	);
}
