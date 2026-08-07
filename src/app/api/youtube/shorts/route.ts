import { YOUTUBE_CHANNEL_ID } from "@/lib/site-data";

// 관리자 "최신 가져오기" 전용 — 채널의 최신 쇼츠 목록을 돌려준다.
//
// 왜 서버를 거치나: 어드민(choice-admin)은 브라우저 앱이라 유튜브 RSS 를 직접 못 부른다(CORS).
// 왜 API 키가 없나: 공개 RSS(feeds/videos.xml)만 쓴다 → YouTube Data API 키·쿼터 불필요.
// 쇼츠 판별: RSS 에는 길이 정보가 없다. /shorts/{id} 를 따라가 보면 쇼츠는 그대로,
//           일반 영상은 /watch 로 리다이렉트되므로 최종 URL 로 구분한다.
//
// 캐시: 10분(revalidate). 관리자가 연달아 눌러도 유튜브를 반복 호출하지 않는다.

const FEED = `https://www.youtube.com/feeds/videos.xml?channel_id=${YOUTUBE_CHANNEL_ID}`;
const REVALIDATE = 600;
const UA =
	"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";

// 어드민 오리진만 허용.
//   ① admin.kvisa1345.com — 관리자가 실제로 쓰는 도메인(★ 이게 빠지면 프로덕션에서 CORS 로 막힌다)
//   ② *.vercel.app — 미리보기 배포는 URL 이 매번 바뀌므로(choice-admin-<hash>-choice5) 패턴으로 본다
//   ③ localhost — 로컬 개발
const ALLOWED_ORIGIN =
	/^https:\/\/admin\.kvisa1345\.com$|^https:\/\/[a-z0-9-]*admin[a-z0-9-]*\.vercel\.app$|^http:\/\/localhost:\d+$/;

const corsHeaders = (origin: string | null): HeadersInit => ({
	"Access-Control-Allow-Origin": origin && ALLOWED_ORIGIN.test(origin) ? origin : "null",
	"Access-Control-Allow-Methods": "GET, OPTIONS",
	Vary: "Origin",
});

export const OPTIONS = (request: Request) =>
	new Response(null, { status: 204, headers: corsHeaders(request.headers.get("origin")) });

type Item = { id: string; title: string; published: string };

const parseFeed = (xml: string): Item[] => {
	const entries = xml.split("<entry>").slice(1);
	const items: Item[] = [];
	for (const e of entries) {
		const id = e.match(/<yt:videoId>([A-Za-z0-9_-]{11})<\/yt:videoId>/)?.[1];
		if (!id) continue;
		const title = (e.match(/<media:title>([\s\S]*?)<\/media:title>/)?.[1] ?? "")
			.replace(/&amp;/g, "&")
			.replace(/&lt;/g, "<")
			.replace(/&gt;/g, ">")
			.replace(/&quot;/g, '"')
			.replace(/&#39;/g, "'")
			.trim();
		items.push({ id, title, published: e.match(/<published>(.*?)<\/published>/)?.[1] ?? "" });
	}
	return items;
};

// 쇼츠인지 확인 — 리다이렉트를 따라가 최종 URL 에 /shorts/ 가 남아 있으면 쇼츠.
// 실패(네트워크·차단)하면 제외하지 않고 통과시킨다(목록이 통째로 비는 것보다 낫다).
const isShort = async (id: string): Promise<boolean> => {
	try {
		const res = await fetch(`https://www.youtube.com/shorts/${id}`, {
			method: "HEAD",
			headers: { "User-Agent": UA },
			redirect: "follow",
			next: { revalidate: REVALIDATE },
		});
		return res.url.includes("/shorts/");
	} catch {
		return true;
	}
};

export const GET = async (request: Request) => {
	const headers = corsHeaders(request.headers.get("origin"));
	try {
		const res = await fetch(FEED, {
			headers: { "User-Agent": UA },
			next: { revalidate: REVALIDATE },
		});
		if (!res.ok) {
			return Response.json({ error: "feed_unavailable" }, { status: 502, headers });
		}
		const items = parseFeed(await res.text());
		const flags = await Promise.all(items.map((i) => isShort(i.id)));
		return Response.json({ items: items.filter((_, i) => flags[i]) }, { headers });
	} catch {
		return Response.json({ error: "fetch_failed" }, { status: 502, headers });
	}
};
