"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { submitContact } from "@/app/actions/contact";
import { FadeIn } from "@/components/common/fade-in";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { consultFields } from "@/data/services";

const labelClass = "font-medium text-sm";
const selectClass =
	"flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

export const Contact = () => {
	const [state, action, isPending] = useActionState(submitContact, null);
	const [formKey, setFormKey] = useState(0);

	return (
		<section id="contact" className="bg-muted/40 px-4 py-24 sm:px-6 lg:px-8">
			<div className="mx-auto max-w-2xl">
				<FadeIn className="text-center">
					<h2 className="font-bold text-3xl tracking-tight sm:text-4xl">온라인 상담 신청</h2>
					<p className="mt-4 text-lg text-muted-foreground">
						아래 내용을 남겨주시면 확인 후 빠르게 연락드리겠습니다.
					</p>
				</FadeIn>

				<FadeIn delay={0.1} className="mt-12">
					<Card>
						<CardHeader>
							<CardTitle>상담 신청서</CardTitle>
						</CardHeader>
						<CardContent>
							{state?.success ? (
								<div className="py-8 text-center">
									<p className="font-medium text-lg">상담 신청이 접수되었습니다.</p>
									<p className="mt-2 text-muted-foreground">
										확인 후 빠르게 연락드리겠습니다. 감사합니다.
									</p>
									<Button
										variant="outline"
										className="mt-6"
										onClick={() => setFormKey((k) => k + 1)}
									>
										다시 작성하기
									</Button>
								</div>
							) : (
								<form key={formKey} className="space-y-5" action={action}>
									{/* Honeypot — 봇 방지용 숨김 필드 */}
									<div
										aria-hidden="true"
										style={{
											position: "absolute",
											left: "-9999px",
											opacity: 0,
											height: 0,
											overflow: "hidden",
										}}
									>
										<label htmlFor="_hp">웹사이트</label>
										<input id="_hp" name="_hp" type="text" tabIndex={-1} autoComplete="off" />
									</div>

									<div className="grid gap-4 sm:grid-cols-2">
										<div className="space-y-2">
											<label htmlFor="name" className={labelClass}>
												성함 <span className="text-primary">*</span>
											</label>
											<Input
												id="name"
												name="name"
												placeholder="홍길동"
												autoComplete="name"
												required
											/>
										</div>
										<div className="space-y-2">
											<label htmlFor="phone" className={labelClass}>
												연락처 <span className="text-primary">*</span>
											</label>
											<Input
												id="phone"
												name="phone"
												type="tel"
												placeholder="010-0000-0000"
												autoComplete="tel"
												required
											/>
										</div>
									</div>

									<div className="grid gap-4 sm:grid-cols-2">
										<div className="space-y-2">
											<label htmlFor="email" className={labelClass}>
												이메일
											</label>
											<Input
												id="email"
												name="email"
												type="email"
												placeholder="you@example.com"
												autoComplete="email"
											/>
										</div>
										<div className="space-y-2">
											<label htmlFor="nationality" className={labelClass}>
												국적
											</label>
											<Input id="nationality" name="nationality" placeholder="예) 미국, 중국" />
										</div>
									</div>

									<div className="grid gap-4 sm:grid-cols-2">
										<div className="space-y-2">
											<label htmlFor="currentVisa" className={labelClass}>
												현재 체류자격
											</label>
											<Input
												id="currentVisa"
												name="currentVisa"
												placeholder="예) F-4, 단기방문 등"
											/>
										</div>
										<div className="space-y-2">
											<label htmlFor="field" className={labelClass}>
												상담 희망 분야 <span className="text-primary">*</span>
											</label>
											<select
												id="field"
												name="field"
												required
												defaultValue=""
												className={selectClass}
											>
												<option value="" disabled>
													선택해주세요
												</option>
												{consultFields.map((field) => (
													<option key={field} value={field}>
														{field}
													</option>
												))}
											</select>
										</div>
									</div>

									<div className="space-y-2">
										<label htmlFor="message" className={labelClass}>
											문의 내용 <span className="text-primary">*</span>
										</label>
										<Textarea
											id="message"
											name="message"
											rows={4}
											required
											placeholder="상담받고 싶은 내용을 자유롭게 적어주세요."
										/>
									</div>

									<label className="flex items-start gap-2.5 text-muted-foreground text-sm">
										<input
											type="checkbox"
											name="consent"
											required
											className="mt-0.5 h-4 w-4 shrink-0 accent-primary"
										/>
										<span>
											개인정보 수집·이용에 동의합니다. (필수){" "}
											<Link
												href="/privacy"
												className="text-primary underline-offset-2 hover:underline"
											>
												개인정보처리방침
											</Link>
										</span>
									</label>

									{state?.success === false && (
										<p className="text-destructive text-sm">{state.error}</p>
									)}

									<Button type="submit" className="w-full sm:w-auto" disabled={isPending}>
										{isPending ? "전송 중..." : "상담 신청하기"}
									</Button>
								</form>
							)}
						</CardContent>
					</Card>
				</FadeIn>
			</div>
		</section>
	);
};
