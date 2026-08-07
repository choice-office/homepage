import { createClient } from "@supabase/supabase-js";
import type { ReviewImage } from "@/lib/site-data";

// 후기 이미지 공개 읽기 레이어 — Supabase(review_images)에서 노출(is_published)만 읽는다(RLS).
// 작성/수정/노출 토글·정렬은 관리자(choice-admin)에서 service_role로 처리한다.
// DB가 미설정이거나 비어 있거나 오류면 빈 배열(후기 섹션 미표시). 이미지·데이터는 Supabase가 단일 출처.
// blog_posts 공개읽기(lib/blog.ts)와 동일한 패턴. 스키마: supabase/migrations/0001_review_images.sql

type Row = {
	src: string;
	w: number;
	h: number;
	tag: string;
	quote: string;
	meta: string;
};

const client = () => {
	const url = process.env.SUPABASE_URL;
	const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
	if (!url || !key) return null;
	return createClient(url, key, { auth: { persistSession: false } });
};

const toImage = (r: Row): ReviewImage => ({
	src: r.src,
	w: r.w,
	h: r.h,
	tag: r.tag,
	quote: r.quote,
	meta: r.meta,
});

// 후기 목록(/reviews)용 — 노출본 전부
export const getPublishedReviewImages = async (): Promise<ReviewImage[]> => {
	const supabase = client();
	if (!supabase) return [];
	const { data, error } = await supabase
		.from("review_images")
		.select("src,w,h,tag,quote,meta")
		.eq("is_published", true)
		.order("sort_order", { ascending: true })
		.order("created_at", { ascending: false });
	if (error || !data || data.length === 0) return [];
	return (data as Row[]).map(toImage);
};

// 홈 후기 섹션(마퀴)에 흘릴 개수 — 관리자 화면과 같은 규칙.
// 최소: 마퀴가 끊겨 보이지 않을 만큼은 있어야 한다. 최대: 너무 길면 홈이 무거워진다.
const HOME_REVIEWS_MIN = 8;
const HOME_REVIEWS_MAX = 12;

// 홈 후기 섹션용 — 관리자(choice-admin `/home`)가 고른 대표 후기.
// **항상 8~12개를 유지한다**: 고른 것이 8개보다 적으면 남은 노출 후기로 채우고, 12개를 넘으면 자른다.
// 고른 것이 0건이거나(초기 상태) 조회가 실패하면 노출본 전체로 폴백한다 —
// 홈에서 후기 섹션이 통째로 비는 것보다 전체를 흘리는 편이 안전하다.
// 노출본이 8개보다 적으면 있는 만큼만 나간다(없는 걸 만들어낼 수는 없다).
export const getFeaturedReviewImages = async (): Promise<ReviewImage[]> => {
	const supabase = client();
	if (!supabase) return [];
	const { data, error } = await supabase
		.from("review_images")
		.select("src,w,h,tag,quote,meta,is_featured")
		.eq("is_published", true)
		.order("is_featured", { ascending: false })
		.order("sort_order", { ascending: true })
		.order("created_at", { ascending: false });
	if (error || !data || data.length === 0) return [];

	const rows = data as (Row & { is_featured: boolean | null })[];
	const featured = rows.filter((r) => r.is_featured);
	if (featured.length === 0) return rows.slice(0, HOME_REVIEWS_MAX).map(toImage);
	// 8개에 못 미치면 고르지 않은 노출 후기로 채운다(정렬 순서 그대로).
	const filler = rows.filter((r) => !r.is_featured);
	const picked = [...featured, ...filler].slice(
		0,
		Math.max(HOME_REVIEWS_MIN, Math.min(featured.length, HOME_REVIEWS_MAX)),
	);
	return picked.map(toImage);
};
