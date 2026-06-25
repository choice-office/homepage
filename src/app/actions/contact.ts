"use server";

import { createClient } from "@supabase/supabase-js";

export type ContactResult = { success: boolean; error?: string };

const CONSULT_FIELD_VALUES = ["e6", "e7", "f4", "f5", "f6", "nat", "etc"] as const;
const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

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

	const supabaseUrl = process.env.SUPABASE_URL;
	const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

	// 환경변수 미설정 시 개발 환경 placeholder 성공 응답
	if (!supabaseUrl || !serviceRoleKey) {
		return { success: true };
	}

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

		if (error) {
			console.error("[contact] insert 실패:", error.message);
			return { success: false, error: "접수 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요." };
		}

		return { success: true };
	} catch (e) {
		console.error("[contact] 예외:", e);
		return { success: false, error: "접수 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요." };
	}
};
