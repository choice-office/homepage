import { createClient } from "@supabase/supabase-js";
import { unstable_cache } from "next/cache";
import { SHORTS } from "./site-data";

// 홈 "영상으로 보는 비자 정보" 4칸 공개 읽기 레이어 — Supabase(home_shorts) 슬롯 1~4.
// 관리자(choice-admin)에서 링크를 넣으면 여기로 반영된다(60초 ISR). 쓰기는 관리자에서 authenticated 롤로.
// 스키마: supabase/migrations/0004_home_shorts.sql
//
// ★ 홈은 **항상 4칸을 채운다.** 칸이 비어 있거나 그 영상이 죽었으면 보관함
//   (youtube_shorts)의 최신 쇼츠로 그 자리를 메운다 → 3개만 나오거나 빈 카드가 생기지 않는다.
//   블로그 대표글과 같은 방식이다(고정 칸은 그 자리, 빈 칸은 자동으로 최신 것).
//
//   채우는 순서:
//     ① 관리자가 지정한 칸(home_shorts) — 살아 있으면 그 자리 그대로
//     ② 남은 칸을 보관함 최신순으로 — 이미 쓴 영상은 제외
//     ③ 그래도 모자라면 SHORTS(site-data.ts) 하드코딩 값
//   DB 미설정·조회 실패면 곧바로 ③.
//
// ★ 죽은 영상은 여기서 걸러낸다. 관리자에서 저장할 때 존재를 확인하지만, 저장한 뒤에
//   영상이 삭제·비공개로 바뀔 수 있다. 그대로 두면 홈에 검은 빈 카드 + 깨진 이미지 대체
//   텍스트가 그대로 노출된다(재생을 눌러도 유튜브 오류). 캐시(60초) 안에서 도니 요청마다
//   확인하지는 않는다.

export const HOME_SHORTS_COUNT = 4;

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

	const [slotRes, libRes] = await Promise.all([
		supabase.from("home_shorts").select("slot,youtube_id").order("slot", { ascending: true }),
		supabase
			.from("youtube_shorts")
			.select("youtube_id")
			.eq("is_hidden", false)
			.order("published_at", { ascending: false, nullsFirst: false })
			// 죽은 영상이 섞여 있어도 4칸을 채울 수 있게 넉넉히 받는다.
			.limit(HOME_SHORTS_COUNT * 4),
	]);
	if (slotRes.error || !slotRes.data) return SHORTS;

	const pinned = new Map<number, string>();
	for (const r of slotRes.data as Row[]) {
		if (r.youtube_id && r.slot >= 1 && r.slot <= HOME_SHORTS_COUNT)
			pinned.set(r.slot, r.youtube_id);
	}
	const library = ((libRes.data ?? []) as { youtube_id: string }[]).map((r) => r.youtube_id);

	// 재생 가능 여부는 후보 전체를 한 번에 확인한다(중복 제거 후 병렬).
	const candidates = [...new Set([...pinned.values(), ...library, ...SHORTS])];
	const alive = new Map(
		await Promise.all(candidates.map(async (id) => [id, await isPlayable(id)] as const)),
	);

	// ① 지정한 칸부터 자리 확정(죽은 건 빈 칸으로 취급)
	const result = new Map<number, string>();
	const used = new Set<string>();
	for (let slot = 1; slot <= HOME_SHORTS_COUNT; slot += 1) {
		const id = pinned.get(slot);
		if (id && alive.get(id) && !used.has(id)) {
			result.set(slot, id);
			used.add(id);
		}
	}
	// ② 남은 칸을 보관함 최신순 → ③ SHORTS 로 메운다
	const pool = [...library, ...SHORTS].filter((id) => alive.get(id) && !used.has(id));
	let next = 0;
	for (let slot = 1; slot <= HOME_SHORTS_COUNT; slot += 1) {
		if (result.has(slot)) continue;
		const id = pool[next++];
		if (!id) break;
		result.set(slot, id);
		used.add(id);
	}

	const ordered = Array.from({ length: HOME_SHORTS_COUNT }, (_, i) => result.get(i + 1)).filter(
		(v): v is string => !!v,
	);
	// 전부 죽은 극단적인 경우에도 섹션이 비지 않게 한다.
	return ordered.length > 0 ? ordered : SHORTS;
};

export const getHomeShorts = unstable_cache(fetchShorts, ["home-shorts"], {
	tags: ["home-shorts"],
	revalidate: 60,
});
