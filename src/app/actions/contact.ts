"use server";

import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

export type ContactResult = { success: boolean; error?: string };

const CONSULT_FIELD_VALUES = ["e6", "e7", "f4", "f5", "f6", "nat", "etc"] as const;
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

const text = (formData: FormData, key: string) => {
	const v = formData.get(key);
	return typeof v === "string" ? v.trim() : "";
};

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
	if (anyOk) return { success: true };
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

	// 필수값 — 문의하기(submitContact)와 동일한 기준으로 성함·동의를 함께 요구
	if (!name) return { success: false, error: "성함을 입력해 주세요." };
	if (!phone) return { success: false, error: "연락처를 입력해 주세요." };
	if (!privacyConsent) return { success: false, error: "개인정보 수집·이용에 동의해 주세요." };

	const consultLabel = CONSULT_LABELS[consultField] ?? "미선택";
	const rows: [string, string][] = [
		["성함", name],
		["상담분야", consultLabel],
		["연락처", phone],
	];

	const resendKey = process.env.RESEND_API_KEY;
	const contactEmail = process.env.CONTACT_EMAIL;
	if (!resendKey || !contactEmail) return { success: true }; // 미설정(개발) → placeholder

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
		if (error) {
			console.error("[quick-consult] Resend 실패:", error.message ?? error);
			return { success: false, error: "접수 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요." };
		}
		return { success: true };
	} catch (e) {
		console.error("[quick-consult] 예외:", e);
		return { success: false, error: "접수 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요." };
	}
};
