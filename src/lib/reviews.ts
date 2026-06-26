import { createClient } from "@supabase/supabase-js";
import { REVIEWS, type Review } from "@/lib/site-data";

// 의뢰인 후기 공개 읽기 레이어 — Supabase(reviews)에서 노출(is_published) 후기만 읽는다(RLS).
// 작성/수정/노출 토글은 관리자(choice-admin)에서 처리. DB가 비어 있거나 미설정이면 정적 REVIEWS로 폴백.

type Row = {
	tag: string;
	country: string;
	initial: string;
	flag: string;
	title: string;
	body: string;
};

const client = () => {
	const url = process.env.SUPABASE_URL;
	const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
	if (!url || !key) return null;
	return createClient(url, key, { auth: { persistSession: false } });
};

export const getPublishedReviews = async (): Promise<Review[]> => {
	const supabase = client();
	if (!supabase) return REVIEWS;
	const { data, error } = await supabase
		.from("reviews")
		.select("tag,country,initial,flag,title,body")
		.eq("is_published", true)
		.order("sort_order", { ascending: true })
		.order("created_at", { ascending: false });
	if (error || !data || data.length === 0) return REVIEWS;
	return (data as Row[]).map((r) => ({
		tag: r.tag,
		country: r.country,
		initial: r.initial,
		flag: r.flag,
		title: r.title,
		body: r.body,
	}));
};
