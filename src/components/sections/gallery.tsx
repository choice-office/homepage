"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { FadeIn } from "@/components/common/fade-in";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";

type GalleryItem = {
	src: string;
	alt: string;
	caption?: string;
};

// ★ 설정: 갤러리 이미지를 수정하세요
const items: GalleryItem[] = [
	{ src: "/gallery/photo-1.jpg", alt: "작업 사진 1", caption: "프로젝트 A" },
	{ src: "/gallery/photo-2.jpg", alt: "작업 사진 2", caption: "프로젝트 B" },
	{ src: "/gallery/photo-3.jpg", alt: "작업 사진 3", caption: "프로젝트 C" },
	{ src: "/gallery/photo-4.jpg", alt: "작업 사진 4", caption: "프로젝트 D" },
	{ src: "/gallery/photo-5.jpg", alt: "작업 사진 5", caption: "프로젝트 E" },
	{ src: "/gallery/photo-6.jpg", alt: "작업 사진 6", caption: "프로젝트 F" },
	{ src: "/gallery/photo-7.jpg", alt: "작업 사진 7", caption: "프로젝트 G" },
	{ src: "/gallery/photo-8.jpg", alt: "작업 사진 8", caption: "프로젝트 H" },
];

export const Gallery = () => {
	const [selected, setSelected] = useState<number | null>(null);

	const prev = useCallback(() => {
		setSelected((s) => (s !== null ? (s - 1 + items.length) % items.length : null));
	}, []);

	const next = useCallback(() => {
		setSelected((s) => (s !== null ? (s + 1) % items.length : null));
	}, []);

	// 키보드 네비게이션
	useEffect(() => {
		if (selected === null) return;
		const handler = (e: KeyboardEvent) => {
			if (e.key === "ArrowLeft") prev();
			if (e.key === "ArrowRight") next();
		};
		window.addEventListener("keydown", handler);
		return () => window.removeEventListener("keydown", handler);
	}, [selected, prev, next]);

	return (
		<section id="gallery" className="px-4 py-24 sm:px-6 lg:px-8">
			<div className="mx-auto max-w-6xl">
				<FadeIn className="mx-auto max-w-2xl text-center">
					<h2 className="font-bold text-3xl tracking-tight sm:text-4xl">Gallery</h2>
					<p className="mt-4 text-lg text-muted-foreground">지금까지의 작업물들을 확인해보세요.</p>
				</FadeIn>

				{/* 이미지 그리드 */}
				<div className="mt-16 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
					{items.map((item, i) => (
						<FadeIn key={item.src} delay={i * 0.05}>
							<button
								type="button"
								className="group relative aspect-square w-full overflow-hidden rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
								onClick={() => setSelected(i)}
								aria-label={`${item.alt} 크게 보기`}
							>
								<Image
									src={item.src}
									alt={item.alt}
									fill
									className="object-cover transition-transform duration-300 group-hover:scale-110"
								/>
								{/* 호버 오버레이 */}
								<div className="absolute inset-0 flex items-end bg-black/0 p-3 transition-all duration-300 group-hover:bg-black/40">
									{item.caption && (
										<span className="translate-y-2 font-medium text-sm text-white opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
											{item.caption}
										</span>
									)}
								</div>
							</button>
						</FadeIn>
					))}
				</div>
			</div>

			{/* 라이트박스 */}
			<Dialog open={selected !== null} onOpenChange={(open) => !open && setSelected(null)}>
				<DialogContent className="max-w-5xl border-none bg-black/95 p-0">
					{selected !== null && (
						<div className="relative flex min-h-[60vh] flex-col items-center justify-center">
							{/* 이미지 */}
							<div className="relative h-[70vh] w-full">
								<Image
									src={items[selected].src}
									alt={items[selected].alt}
									fill
									className="object-contain"
								/>
							</div>

							{/* 캡션 */}
							{items[selected].caption && (
								<p className="mt-3 text-center text-sm text-white/60">{items[selected].caption}</p>
							)}

							{/* 카운터 */}
							<p className="mt-2 text-white/40 text-xs">
								{selected + 1} / {items.length}
							</p>

							{/* 이전/다음 버튼 */}
							<Button
								variant="ghost"
								size="icon"
								className="absolute top-1/2 left-2 -translate-y-1/2 text-white hover:bg-white/10"
								onClick={prev}
							>
								<ChevronLeft className="h-6 w-6" />
							</Button>
							<Button
								variant="ghost"
								size="icon"
								className="absolute top-1/2 right-2 -translate-y-1/2 text-white hover:bg-white/10"
								onClick={next}
							>
								<ChevronRight className="h-6 w-6" />
							</Button>
						</div>
					)}
				</DialogContent>
			</Dialog>
		</section>
	);
};
