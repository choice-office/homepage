import { createClient } from "@supabase/supabase-js";
import { unstable_cache } from "next/cache";
import { SHORTS } from "./site-data";

// 홈 "영상으로 보는 비자 정보" 4칸 공개 읽기 레이어 — Supabase(home_shorts) 슬롯 1~4.
// 관리자(choice-admin)에서 링크를 넣으면 여기로 반영된다(60초 ISR). 쓰기는 관리자에서 authenticated 롤로.
// 스키마: supabase/migrations/0004_home_shorts.sql
//
// 폴백: DB 미설정·테이블 없음·조회 실패·전 칸 비어 있음 → SHORTS(site-data.ts) 하드코딩 값.
// 홈 섹션이 통째로 비는 것보다 기존 영상을 계속 보여주는 편이 안전하다.
// 슬롯이 일부만 채워진 경우 채워진 것만 순서대로 노출한다(빈 칸은 건너뛴다).

type Row = { slot: number; youtube_id: string | null };

const client = () => {
	const url = process.env.SUPABASE_URL;
	const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
	if (!url || !key) return null;
	return createClient(url, key, { auth: { persistSession: false } });
};

const fetchShorts = async (): Promise<string[]> => {
	const supabase = client();
	if (!supabase) return SHORTS;
	const { data, error } = await supabase
		.from("home_shorts")
		.select("slot,youtube_id")
		.order("slot", { ascending: true });
	if (error || !data) return SHORTS;
	const ids = (data as Row[]).map((r) => r.youtube_id).filter((v): v is string => !!v);
	return ids.length > 0 ? ids : SHORTS;
};

export const getHomeShorts = unstable_cache(fetchShorts, ["home-shorts"], {
	tags: ["home-shorts"],
	revalidate: 60,
});
