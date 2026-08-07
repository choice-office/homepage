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
//
// ★ 죽은 영상은 여기서 걸러낸다. 관리자에서 저장할 때 존재를 확인하지만, 저장한 뒤에
//   영상이 삭제·비공개로 바뀔 수 있다. 그대로 두면 홈에 검은 빈 카드 + 깨진 이미지 대체
//   텍스트가 그대로 노출된다(재생을 눌러도 유튜브 오류). 서버에서 미리 빼면 사용자는
//   살아 있는 영상만 본다. 캐시(60초) 안에서 도니 요청마다 확인하지는 않는다.

type Row = { slot: number; youtube_id: string | null };

const client = () => {
	const url = process.env.SUPABASE_URL;
	const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
	if (!url || !key) return null;
	return createClient(url, key, { auth: { persistSession: false } });
};

// 홈 카드가 쓰는 썸네일. 쇼츠에만 있어서(일반 영상은 404) "살아 있는 쇼츠"인지 한 번에 판별된다.
const thumbnailUrl = (id: string) => `https://i.ytimg.com/vi/${id}/oardefault.jpg`;

// oEmbed — "이 영상을 여기에 임베드해서 재생할 수 있는가"를 유튜브가 직접 답해 준다.
//   200 = 가능 · 401/403 = 퍼가기 차단·비공개 · 400/404 = 없는 영상
// 썸네일만으로는 알 수 없다: 퍼가기를 막은 영상도 썸네일은 그대로 있어서 카드는 정상으로
// 보이고, 눌렀을 때만 "동영상을 재생할 수 없음" 이 뜬다.
const oembedUrl = (id: string) =>
	`https://www.youtube.com/oembed?url=${encodeURIComponent(
		`https://www.youtube.com/watch?v=${id}`,
	)}&format=json`;

// 네트워크가 흔들릴 때 멀쩡한 영상을 지우면 더 나쁘므로, 확인 실패는 통과시킨다(fail-open).
const ok = async (url: string, method: "GET" | "HEAD"): Promise<boolean> => {
	try {
		const res = await fetch(url, { method, next: { revalidate: 60 } });
		return res.ok;
	} catch {
		return true;
	}
};

// ① 세로 썸네일이 있어야 쇼츠다(일반 영상은 404) ② 임베드로 재생까지 돼야 한다.
const isPlayable = async (id: string): Promise<boolean> => {
	const [isShort, embeddable] = await Promise.all([
		ok(thumbnailUrl(id), "HEAD"),
		ok(oembedUrl(id), "GET"),
	]);
	return isShort && embeddable;
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
	if (ids.length === 0) return SHORTS;
	const alive = await Promise.all(ids.map(isPlayable));
	const playable = ids.filter((_, i) => alive[i]);
	return playable.length > 0 ? playable : SHORTS;
};

export const getHomeShorts = unstable_cache(fetchShorts, ["home-shorts"], {
	tags: ["home-shorts"],
	revalidate: 60,
});
