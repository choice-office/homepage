import { createClient } from "@supabase/supabase-js";
import { REVIEW_IMAGES, type ReviewImage } from "@/lib/site-data";

// 후기 이미지 공개 읽기 레이어 — Supabase(review_images)에서 노출(is_published)만 읽는다(RLS).
// 작성/수정/노출 토글·정렬은 관리자(choice-admin)에서 service_role로 처리한다.
// DB가 미설정이거나 비어 있거나 오류면 정적 REVIEW_IMAGES(로컬 시드/폴백)로 대체한다.
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

export const getPublishedReviewImages = async (): Promise<ReviewImage[]> => {
	const supabase = client();
	if (!supabase) return REVIEW_IMAGES;
	const { data, error } = await supabase
		.from("review_images")
		.select("src,w,h,tag,quote,meta")
		.eq("is_published", true)
		.order("sort_order", { ascending: true })
		.order("created_at", { ascending: false });
	if (error || !data || data.length === 0) return REVIEW_IMAGES;
	return (data as Row[]).map((r) => ({
		src: r.src,
		w: r.w,
		h: r.h,
		tag: r.tag,
		quote: r.quote,
		meta: r.meta,
	}));
};
