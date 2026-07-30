import { createClient } from "@supabase/supabase-js";

// 보관기간 자동 정리 (Vercel Cron, 매일 1회) — 관리자 접속과 무관하게 서버에서 실행된다.
//
// ① 문의(contacts): 개인정보처리방침 "문의 기록: 처리 완료 후 3년" 그대로 적용.
//    - status='done'  → updated_at(처리 완료 시점) + 3년 경과 시 삭제
//    - 그 외 상태     → created_at(접수) + 3년 경과 시 삭제(미처리로 무기한 방치되는 것 방지)
// ② 블로그 임시저장(draft): 마지막 저장 후 30일 경과 시 삭제(어드민 표기와 동일 기준).
//    어드민에도 같은 정리가 있지만, 아무도 접속하지 않아도 지워지도록 여기서 한 번 더 돈다.
//
// 인증: Vercel Cron 은 CRON_SECRET 이 설정돼 있으면 Authorization: Bearer <CRON_SECRET> 을 붙여 호출한다.
//       시크릿이 없거나 불일치면 401 — 외부에서 임의로 삭제를 유발할 수 없다.

export const dynamic = "force-dynamic";

const CONTACT_RETENTION_DAYS = 365 * 3;
const DRAFT_RETENTION_DAYS = 30;
const THROTTLE_RETENTION_DAYS = 1;

const daysAgo = (days: number) => new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

export const GET = async (request: Request) => {
	const secret = process.env.CRON_SECRET;
	if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
		return Response.json({ error: "unauthorized" }, { status: 401 });
	}

	const url = process.env.SUPABASE_URL;
	const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
	if (!url || !key) return Response.json({ error: "supabase not configured" }, { status: 500 });
	const sb = createClient(url, key, { auth: { persistSession: false } });

	const cutoff = daysAgo(CONTACT_RETENTION_DAYS);
	const result: Record<string, number | string> = {};

	// ① 처리 완료(done) 후 3년 경과
	const doneCut = await sb
		.from("contacts")
		.delete()
		.eq("status", "done")
		.lt("updated_at", cutoff)
		.select("id");
	if (doneCut.error) result.contactsDoneError = doneCut.error.message;
	else result.contactsDoneDeleted = doneCut.data?.length ?? 0;

	// ① 접수 후 3년 경과(상태 무관)
	const oldCut = await sb.from("contacts").delete().lt("created_at", cutoff).select("id");
	if (oldCut.error) result.contactsOldError = oldCut.error.message;
	else result.contactsOldDeleted = oldCut.data?.length ?? 0;

	// ② 임시저장 30일 경과
	const drafts = await sb
		.from("blog_posts")
		.delete()
		.eq("status", "draft")
		.lt("updated_at", daysAgo(DRAFT_RETENTION_DAYS))
		.select("id");
	if (drafts.error) result.draftsError = drafts.error.message;
	else result.draftsDeleted = drafts.data?.length ?? 0;

	// 레이트리밋 기록도 함께 정리(하루 지난 것)
	const throttle = await sb
		.from("contact_throttle")
		.delete()
		.lt("created_at", daysAgo(THROTTLE_RETENTION_DAYS))
		.select("id");
	if (!throttle.error) result.throttleDeleted = throttle.data?.length ?? 0;

	console.info("[cron/retention]", JSON.stringify(result));
	return Response.json({ ok: true, ranAt: new Date().toISOString(), ...result });
};
