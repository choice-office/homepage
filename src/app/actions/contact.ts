"use server";

type ContactResult = {
	success: boolean;
	error?: string;
};

// 이메일 형식 검증
const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// useActionState와 호환되는 시그니처: (prevState, formData) => Promise<ContactResult>
export const submitContact = async (
	_prevState: ContactResult | null,
	formData: FormData,
): Promise<ContactResult> => {
	const name = formData.get("name") as string;
	const email = formData.get("email") as string;
	const phone = formData.get("phone") as string;
	const message = formData.get("message") as string;
	const consent = formData.get("consent") as string;
	const _hp = formData.get("_hp") as string;
	// 참고: nationality / currentVisa / field 도 함께 전송됨.
	// Supabase 저장을 연동할 때 아래 Step 1 블록에서 formData.get 으로 읽어 insert 하세요.

	// Honeypot: 봇이 숨겨진 _hp 필드를 채우면 조용히 성공 처리
	if (_hp) {
		return { success: true };
	}

	// 필수 필드 검증 (성함 · 연락처 · 문의 내용 · 개인정보 동의)
	if (!name?.trim() || !message?.trim()) {
		return { success: false, error: "성함과 문의 내용을 입력해주세요." };
	}
	if (!phone?.trim() && !email?.trim()) {
		return { success: false, error: "연락 가능한 전화번호 또는 이메일을 입력해주세요." };
	}
	if (consent !== "on") {
		return { success: false, error: "개인정보 수집·이용에 동의해주세요." };
	}

	// 필드 길이 제한 (DoS 방어)
	if (name.length > 100) return { success: false, error: "이름이 너무 깁니다." };
	if (phone && phone.length > 40) return { success: false, error: "전화번호가 너무 깁니다." };
	if (email && email.length > 254) return { success: false, error: "이메일이 너무 깁니다." };
	if (message.length > 5000) return { success: false, error: "메시지가 너무 깁니다." };

	// 이메일 형식 검증 (입력한 경우에만)
	if (email?.trim() && !isValidEmail(email)) {
		return { success: false, error: "올바른 이메일 주소를 입력해주세요." };
	}

	try {
		// ── Step 1: Supabase contacts 테이블에 저장 (기본) ──────────────────────
		// 설정: .env.local 에 SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY 입력 후 주석 해제
		// 패키지: pnpm add @supabase/supabase-js
		//
		// if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
		//   const { createClient } = await import("@supabase/supabase-js");
		//   const supabase = createClient(
		//     process.env.SUPABASE_URL,
		//     process.env.SUPABASE_SERVICE_ROLE_KEY,
		//   );
		//   const { error: dbError } = await supabase
		//     .from("contacts")
		//     .insert({ name: name.trim(), email: email.trim(), message: message.trim() });
		//   if (dbError) throw dbError;
		// }

		// ── Step 2: Resend 알림 이메일 (선택 — Step 1과 동시 사용 가능) ──────────
		// 설정: .env.local 에 RESEND_API_KEY + CONTACT_EMAIL 입력 후 주석 해제
		// 패키지: pnpm add resend
		// 주의: Resend 대시보드에서 발신 도메인을 Verified Domain 으로 등록해야 발송됨
		//
		// if (process.env.RESEND_API_KEY && process.env.CONTACT_EMAIL) {
		//   const { Resend } = await import("resend");
		//   const resend = new Resend(process.env.RESEND_API_KEY);
		//   await resend.emails.send({
		//     from: "noreply@클라이언트도메인.com", // ★ Verified Domain 으로 교체
		//     to: process.env.CONTACT_EMAIL,
		//     subject: `[문의] ${name}`,
		//     text: `이름: ${name}\n이메일: ${email}\n\n${message}`,
		//   });
		// }

		// ── Step 3 (선택): Upstash Rate Limiting — IP당 스팸 방지 강화 ──────────
		// 패키지: pnpm add @upstash/ratelimit @upstash/redis
		//
		// import { headers } from "next/headers";
		// import { Ratelimit } from "@upstash/ratelimit";
		// import { Redis } from "@upstash/redis";
		// const ratelimit = new Ratelimit({
		//   redis: Redis.fromEnv(),
		//   limiter: Ratelimit.slidingWindow(3, "1 h"),
		// });
		// const ip = (await headers()).get("x-forwarded-for") ?? "unknown";
		// const { success: allowed } = await ratelimit.limit(ip);
		// if (!allowed) return { success: false, error: "잠시 후 다시 시도해주세요." };

		return { success: true };
	} catch {
		return { success: false, error: "전송에 실패했습니다. 잠시 후 다시 시도해주세요." };
	}
};
