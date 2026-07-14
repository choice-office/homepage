"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { REVIEW_IMAGES, type ReviewImage } from "@/lib/site-data";
import { Icon } from "./icon";

// 그리드(/reviews)는 페이지당 6개씩 페이지네이션 — 1페이지여도 항상 페이저 표시
const REVIEWS_PER_PAGE = 6;

/**
 * 의뢰인 후기 이미지 갤러리 — 매트 프레임 카드(균일 4:5 크롭 + 하단 페이드) + 라이트박스.
 * 카톡/이메일 캡처를 크림 매트에 넣어 톤을 중화하고, 사건 태그·발췌 인용으로 증언처럼 큐레이션.
 * - variant="grid": 정적 3열 그리드(전체 열람용, /reviews)
 * - variant="marquee": 무한 수평 흐름(홈 프리뷰용). hover 시 정지, 클릭 시 라이트박스.
 * 라이트박스는 body로 포털 렌더 → 조상 stacking context/플로팅 레일 위에 확실히 표시.
 */
type ReviewImageGalleryProps = {
	variant?: "grid" | "marquee";
	images?: ReviewImage[];
};

export const ReviewImageGallery = ({
	variant = "grid",
	images = REVIEW_IMAGES,
}: ReviewImageGalleryProps) => {
	const items = images;
	const [open, setOpen] = useState<number | null>(null);
	const [page, setPage] = useState(1);
	const topRef = useRef<HTMLDivElement>(null);

	const totalPages = Math.max(1, Math.ceil(items.length / REVIEWS_PER_PAGE));
	const current = Math.min(page, totalPages);
	const start = (current - 1) * REVIEWS_PER_PAGE;
	const pageItems = items.slice(start, start + REVIEWS_PER_PAGE);

	const goTo = (p: number) => {
		if (p < 1 || p > totalPages || p === current) return;
		setPage(p);
		const el = topRef.current;
		if (el) {
			const top = el.getBoundingClientRect().top + window.scrollY - 110;
			window.scrollTo({ top, behavior: "smooth" });
		}
	};

	const close = useCallback(() => setOpen(null), []);
	// items는 prop이라 길이가 바뀔 수 있어 length를 의존성에 포함(라이트박스 순환 범위)
	const total = items.length;
	const step = useCallback(
		(dir: number) => setOpen((cur) => (cur === null ? cur : (cur + dir + total) % total)),
		[total],
	);

	useEffect(() => {
		if (open === null) return;
		const onKey = (e: KeyboardEvent) => {
			if (e.key === "Escape") close();
			else if (e.key === "ArrowRight") step(1);
			else if (e.key === "ArrowLeft") step(-1);
		};
		window.addEventListener("keydown", onKey);
		const prevOverflow = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		return () => {
			window.removeEventListener("keydown", onKey);
			document.body.style.overflow = prevOverflow;
		};
	}, [open, close, step]);

	const active = open === null ? null : items[open];

	const card = (r: ReviewImage, key: string, index: number) => (
		<button
			type="button"
			key={key}
			className="rv-card"
			onClick={() => setOpen(index)}
			aria-label={`${r.tag} 후기 전체 보기`}
		>
			<span className="rv-tag">
				<span className="rv-quotemark" aria-hidden="true">
					❝
				</span>
				{r.tag}
			</span>
			<span className="rv-window">
				<Image
					src={r.src}
					alt={`${r.tag} 의뢰인 후기`}
					width={r.w}
					height={r.h}
					className="rv-img"
					sizes="(max-width: 560px) 100vw, (max-width: 900px) 50vw, 33vw"
				/>
				<span className="rv-fade" aria-hidden="true" />
			</span>
			<span className="rv-quote">“{r.quote}”</span>
			<span className="rv-foot">
				<span className="rv-meta">— {r.meta}</span>
				<span className="rv-more">
					전체 보기
					<Icon n="arrow-right" style={{ width: 14, height: 14 }} />
				</span>
			</span>
		</button>
	);

	return (
		<>
			{variant === "marquee" ? (
				// 무한 흐름: 아이템을 두 벌 렌더해 -50% 이동으로 끊김 없이 순환
				<div className="rv-marquee">
					<div className="rv-marquee-track">
						{items.map((r, i) => card(r, `a-${r.src}`, i))}
						{items.map((r, i) => card(r, `b-${r.src}`, i))}
					</div>
				</div>
			) : (
				<div ref={topRef}>
					<div className="review-gallery" data-stagger>
						{pageItems.map((r, i) => card(r, r.src, start + i))}
					</div>
					<nav className="pager" aria-label="후기 페이지 이동">
						<button
							type="button"
							className="pager-arrow"
							onClick={() => goTo(current - 1)}
							disabled={current === 1}
							aria-label="이전 페이지"
						>
							<Icon
								n="chevron-right"
								style={{ width: 18, height: 18, transform: "rotate(180deg)" }}
							/>
						</button>
						{Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
							<button
								type="button"
								key={p}
								className="pager-num"
								data-active={p === current}
								aria-current={p === current ? "page" : undefined}
								onClick={() => goTo(p)}
							>
								{p}
							</button>
						))}
						<button
							type="button"
							className="pager-arrow"
							onClick={() => goTo(current + 1)}
							disabled={current === totalPages}
							aria-label="다음 페이지"
						>
							<Icon n="chevron-right" style={{ width: 18, height: 18 }} />
						</button>
					</nav>
				</div>
			)}

			{active &&
				createPortal(
					<div
						className="rv-lightbox"
						role="dialog"
						aria-modal="true"
						aria-label="후기 이미지 크게 보기"
					>
						<button type="button" className="rv-lb-scrim" aria-label="닫기" onClick={close} />
						<button type="button" className="rv-lb-close" aria-label="닫기" onClick={close}>
							<Icon n="x" style={{ width: 26, height: 26 }} />
						</button>
						<button
							type="button"
							className="rv-lb-nav rv-lb-prev"
							aria-label="이전 후기"
							onClick={() => step(-1)}
						>
							<Icon
								n="chevron-right"
								style={{ width: 28, height: 28, transform: "rotate(180deg)" }}
							/>
						</button>
						<figure className="rv-lb-figure">
							<span className="rv-lb-tag">{active.tag}</span>
							<Image
								src={active.src}
								alt={`${active.tag} 의뢰인 후기 전체`}
								width={active.w}
								height={active.h}
								className="rv-lb-img"
								sizes="(max-width: 640px) 92vw, 460px"
							/>
							<figcaption className="rv-lb-cap">
								“{active.quote}”<span>— {active.meta}</span>
							</figcaption>
						</figure>
						<button
							type="button"
							className="rv-lb-nav rv-lb-next"
							aria-label="다음 후기"
							onClick={() => step(1)}
						>
							<Icon n="chevron-right" style={{ width: 28, height: 28 }} />
						</button>
					</div>,
					document.body,
				)}
		</>
	);
};
