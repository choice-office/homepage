"use server";

import { createHash } from "node:crypto";
import { createClient } from "@supabase/supabase-js";
import { headers } from "next/headers";
import { Resend } from "resend";

export type ContactResult = { success: boolean; error?: string };

// 폼(ContactSection·상담바)이 제공하는 값 전체 — DB CHECK(contacts_consult_field_check)와 반드시 일치시킨다
const CONSULT_FIELD_VALUES = [
	"short",
	"resident",
	"e6",
	"e7",
	"f4",
	"f5",
	"f6",
	"nat",
	"etc",
] as const;
const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

// 상담분야 코드 → 이메일 표기용 라벨
const CONSULT_LABELS: Record<string, string> = {
	short: "단기초청(C3·C4)",
	resident: "주재원·고위임원(D7·D8)",
	e6: "외국인 연예인 비자(E6)",
	e7: "외국인 취업비자(E7)",
	f4: "재외동포·거소증(F4)",
	f5: "영주권(F5)",
	f6: "결혼비자(F6)",
	nat: "국적회복",
	etc: "기타",
};

const esc = (s: string) =>
	s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c] ?? c);

// 브랜드(웜 골드) 스타일 이메일 HTML — 다크 헤더(나비 로고) + 골드 아이브로 + 표 + 푸터.
// 이메일 클라이언트 호환을 위해 table 레이아웃 + 인라인 스타일만 사용.
const EMAIL_FONT = "'Apple SD Gothic Neo','Malgun Gothic','Noto Sans KR',sans-serif";
const renderEmailHtml = (eyebrow: string, title: string, rows: [string, string][]) =>
	`<div style="margin:0;padding:0;background:#f5f3ef"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f5f3ef;padding:32px 12px"><tr><td align="center"><table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border:1px solid #e2ddd3;border-radius:14px;overflow:hidden"><tr><td style="background:#241d16;padding:24px 32px"><table role="presentation" cellpadding="0" cellspacing="0"><tr><td style="vertical-align:middle"><img src="https://kvisa1345.com/brand/mark-square.png" width="32" height="32" alt="" style="display:block"></td><td style="vertical-align:middle;padding-left:11px;color:#ffffff;font:700 16px/1.2 ${EMAIL_FONT};letter-spacing:-.01em">초이스 행정사 사무소</td></tr></table></td></tr><tr><td style="padding:28px 32px 4px"><div style="font:700 12px/1 ${EMAIL_FONT};letter-spacing:.1em;color:#7c6346">${eyebrow}</div><div style="margin:12px 0 0;font:700 23px/1.3 ${EMAIL_FONT};color:#222222;letter-spacing:-.02em">${title}</div><div style="width:44px;height:3px;background:#7c6346;margin-top:16px"></div></td></tr><tr><td style="padding:14px 32px 10px"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font:400 15px/1.65 ${EMAIL_FONT};color:#3f3a34">${rows
		.map(
			([k, v], i) =>
				`<tr><td width="94" style="padding:12px 16px 12px 0;color:#888888;font-size:13.5px;white-space:nowrap;vertical-align:top${i > 0 ? ";border-top:1px solid #efe9df" : ""}">${esc(k)}</td><td style="padding:12px 0;vertical-align:top;white-space:pre-wrap${i > 0 ? ";border-top:1px solid #efe9df" : ""}">${esc(v)}</td></tr>`,
		)
		.join(
			"",
		)}</table></td></tr><tr><td style="background:#f5f3ef;padding:18px 32px;border-top:1px solid #e2ddd3;font:400 12.5px/1.7 ${EMAIL_FONT};color:#888888"><strong style="color:#524636">초이스 행정사 사무소</strong> · 02-6959-9886 · choice@kvisa1345.com<br>홈페이지에서 자동 발송된 알림입니다.</td></tr></table></td></tr></table></div>`;

// 입력 길이 상한 — 초장문 payload 로 DB·메일을 부풀리는 것 방지(정상 입력에는 걸리지 않는 값)
const LIMITS = {
	name: 40,
	phone: 20,
	email: 120,
	nationality: 40,
	currentVisa: 60,
	consultField: 20,
	message: 2000,
} as const;

const text = (formData: FormData, key: string) => {
	const v = formData.get(key);
	const raw = typeof v === "string" ? v.trim() : "";
	const limit = LIMITS[key as keyof typeof LIMITS];
	return limit ? raw.slice(0, limit) : raw;
};

// 봇 트랩 — 사람에게는 보이지 않는 입력(website)이 채워져 있으면 조용히 버린다.
const isBot = (formData: FormData) => {
	const trap = formData.get("website");
	return typeof trap === "string" && trap.trim().length > 0;
};

// 접수 레이트리밋 — 같은 IP 에서 10분 내 5건까지. 기록은 IP 해시만 남긴다.
// 어떤 이유로든 조회에 실패하면 통과시킨다(정상 문의를 잃지 않는 쪽으로 실패).
const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_MAX = 5;

const serviceClient = () => {
	const url = process.env.SUPABASE_URL;
	const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
	if (!url || !key) return null;
	return createClient(url, key, { auth: { persistSession: false } });
};

const clientIpHash = async (): Promise<string | null> => {
	try {
		const h = await headers();
		const ip = (h.get("x-forwarded-for") ?? "").split(",")[0].trim() || h.get("x-real-ip") || "";
		if (!ip) return null;
		return createHash("sha256").update(`choice-contact:${ip}`).digest("hex").slice(0, 40);
	} catch {
		return null;
	}
};

type Throttle = { blocked: boolean; record: () => Promise<void> };

const checkThrottle = async (): Promise<Throttle> => {
	const pass: Throttle = { blocked: false, record: async () => {} };
	const sb = serviceClient();
	const ipHash = await clientIpHash();
	if (!sb || !ipHash) return pass;
	try {
		const since = new Date(Date.now() - RATE_WINDOW_MS).toISOString();
		const { count, error } = await sb
			.from("contact_throttle")
			.select("id", { count: "exact", head: true })
			.eq("ip_hash", ipHash)
			.gte("created_at", since);
		if (error) return pass;
		if ((count ?? 0) >= RATE_MAX) return { blocked: true, record: async () => {} };
		return {
			blocked: false,
			record: async () => {
				await sb.from("contact_throttle").insert({ ip_hash: ipHash });
				// 하루 지난 기록은 접수 때 함께 정리(별도 배치 불필요)
				await sb
					.from("contact_throttle")
					.delete()
					.lt("created_at", new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());
			},
		};
	} catch {
		return pass;
	}
};

const TOO_MANY =
	"짧은 시간에 여러 번 접수되었습니다. 10분 후 다시 시도해 주시거나 전화로 연락 주세요.";

// useActionState 호환 시그니처: (prevState, formData) => Promise<Result>
export const submitContact = async (
	_prevState: ContactResult | null,
	formData: FormData,
): Promise<ContactResult> => {
	const name = text(formData, "name");
	const phone = text(formData, "phone");
	const email = text(formData, "email");
	const nationality = text(formData, "nationality");
	const currentVisa = text(formData, "currentVisa");
	const consultField = text(formData, "consultField");
	const message = text(formData, "message");
	const privacyConsent = formData.get("privacyConsent") === "on";

	// 봇이 채운 트랩 필드 → 성공처럼 응답하고 버린다(봇에게 실패 신호를 주지 않음)
	if (isBot(formData)) return { success: true };

	// 유효성 검사 — 필수 필드 + 형식
	if (!name || !phone || !email || !nationality) {
		return { success: false, error: "필수 항목을 모두 입력해 주세요." };
	}
	if (!EMAIL_RE.test(email)) {
		return { success: false, error: "올바른 이메일 주소를 입력해 주세요." };
	}
	if (!privacyConsent) {
		return { success: false, error: "개인정보 수집·이용에 동의해 주세요." };
	}

	const throttle = await checkThrottle();
	if (throttle.blocked) return { success: false, error: TOO_MANY };

	const consultLabel = CONSULT_LABELS[consultField] ?? "-";
	const rows: [string, string][] = [
		["이름", name],
		["연락처", phone],
		["이메일", email],
		["국적", nationality],
		["현재 비자", currentVisa || "-"],
		["상담분야", consultLabel],
		["문의내용", message || "-"],
	];

	let anyConfigured = false;
	let anyOk = false;

	// 1) 이메일 알림 (Resend) — 문의를 관리자 메일(CONTACT_EMAIL)로 수신
	const resendKey = process.env.RESEND_API_KEY;
	const contactEmail = process.env.CONTACT_EMAIL;
	if (resendKey && contactEmail) {
		anyConfigured = true;
		try {
			const resend = new Resend(resendKey);
			// 발신자는 Resend에서 인증한 도메인 주소여야 함. 미설정 시 테스트용 공용 도메인.
			const from = process.env.RESEND_FROM ?? "초이스 행정사 사무소 <onboarding@resend.dev>";
			const html = renderEmailHtml("홈페이지 문의", "새 문의가 접수되었습니다", rows);
			const { error } = await resend.emails.send({
				from,
				to: contactEmail,
				replyTo: email,
				subject: `[홈페이지 문의] ${name} · ${consultLabel}`,
				text: rows.map(([k, v]) => `${k}: ${v}`).join("\n"),
				html,
			});
			if (error) console.error("[contact] Resend 실패:", error.message ?? error);
			else anyOk = true;
		} catch (e) {
			console.error("[contact] Resend 예외:", e);
		}
	}

	// 2) Supabase 저장 (문의 DB 기록) — 설정 시 함께 저장
	const supabaseUrl = process.env.SUPABASE_URL;
	const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
	if (supabaseUrl && serviceRoleKey) {
		anyConfigured = true;
		try {
			const supabase = createClient(supabaseUrl, serviceRoleKey, {
				auth: { persistSession: false },
			});
			const { error } = await supabase.from("contacts").insert({
				name,
				phone,
				email,
				nationality,
				current_visa: currentVisa || null,
				consult_field: CONSULT_FIELD_VALUES.includes(
					consultField as (typeof CONSULT_FIELD_VALUES)[number],
				)
					? consultField
					: null,
				message: message || null,
				privacy_consent: true,
				source: "contact_page",
			});
			if (error) console.error("[contact] insert 실패:", error.message);
			else anyOk = true;
		} catch (e) {
			console.error("[contact] Supabase 예외:", e);
		}
	}

	// 아무 채널도 미설정(개발) → placeholder 성공. 하나라도 성공하면 접수 완료(제출 유실 방지).
	if (!anyConfigured) return { success: true };
	if (anyOk) {
		await throttle.record();
		return { success: true };
	}
	return { success: false, error: "접수 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요." };
};

// 신속 상담 신청(하단 상담바) — 상담분야 + 연락처만. 문의하기 폼과 이메일이 구분되도록
// 제목·헤딩을 "신속 상담"으로 달리한다(수신 메일에서 어떤 경로인지 즉시 구분).
export const submitQuickConsult = async (
	_prevState: ContactResult | null,
	formData: FormData,
): Promise<ContactResult> => {
	const name = text(formData, "name");
	const consultField = text(formData, "consultField");
	const phone = text(formData, "phone");
	const privacyConsent = formData.get("privacyConsent") === "on";

	if (isBot(formData)) return { success: true };

	// 필수값 — 문의하기(submitContact)와 동일한 기준으로 성함·동의를 함께 요구
	if (!name) return { success: false, error: "성함을 입력해 주세요." };
	if (!phone) return { success: false, error: "연락처를 입력해 주세요." };
	if (!privacyConsent) return { success: false, error: "개인정보 수집·이용에 동의해 주세요." };

	const throttle = await checkThrottle();
	if (throttle.blocked) return { success: false, error: TOO_MANY };

	const consultLabel = CONSULT_LABELS[consultField] ?? "미선택";
	const rows: [string, string][] = [
		["성함", name],
		["상담분야", consultLabel],
		["연락처", phone],
	];

	// 상담분야 코드 검증 — 문의하기 폼과 동일 기준(허용 목록 밖이면 null)
	const consultFieldValue = CONSULT_FIELD_VALUES.includes(
		consultField as (typeof CONSULT_FIELD_VALUES)[number],
	)
		? consultField
		: null;

	let anyConfigured = false;
	let anyOk = false;

	// 1) Supabase 저장 — 신속 상담도 문의 DB(contacts)에 기록해 관리자에 노출.
	// 이메일·국적은 신속 상담 폼에 없으므로 email=""(NOT NULL 대응), source로 유입 경로 구분.
	const supabaseUrl = process.env.SUPABASE_URL;
	const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
	if (supabaseUrl && serviceRoleKey) {
		anyConfigured = true;
		try {
			const supabase = createClient(supabaseUrl, serviceRoleKey, {
				auth: { persistSession: false },
			});
			const { error } = await supabase.from("contacts").insert({
				name,
				phone,
				email: null,
				consult_field: consultFieldValue,
				privacy_consent: true,
				source: "consult_bar",
			});
			if (error) console.error("[quick-consult] insert 실패:", error.message);
			else anyOk = true;
		} catch (e) {
			console.error("[quick-consult] Supabase 예외:", e);
		}
	}

	// 2) 이메일 알림 (Resend)
	const resendKey = process.env.RESEND_API_KEY;
	const contactEmail = process.env.CONTACT_EMAIL;
	if (resendKey && contactEmail) {
		anyConfigured = true;
		try {
			const resend = new Resend(resendKey);
			const from = process.env.RESEND_FROM ?? "초이스 행정사 사무소 <onboarding@resend.dev>";
			const html = renderEmailHtml("신속 상담 · 하단 상담바", "⚡ 신속 상담 신청", rows);
			const { error } = await resend.emails.send({
				from,
				to: contactEmail,
				subject: `[⚡신속 상담] ${name} · ${consultLabel} · ${phone}`,
				text: `[신속 상담 신청 · 홈페이지 하단 상담바]\n성함: ${name}\n상담분야: ${consultLabel}\n연락처: ${phone}`,
				html,
			});
			if (error) console.error("[quick-consult] Resend 실패:", error.message ?? error);
			else anyOk = true;
		} catch (e) {
			console.error("[quick-consult] Resend 예외:", e);
		}
	}

	// 아무 채널도 미설정(개발) → placeholder 성공. 하나라도 성공하면 접수 완료.
	if (!anyConfigured) return { success: true };
	if (anyOk) {
		await throttle.record();
		return { success: true };
	}
	return { success: false, error: "접수 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요." };
};
