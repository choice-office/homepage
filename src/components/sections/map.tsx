import { Clock, Mail, MapPin, Phone, Train } from "lucide-react";
import { FadeIn } from "@/components/common/fade-in";
import { contactInfo } from "@/config/site";

// 주소 기반 Google 지도 임베드 (API 키 불필요). 정밀 핀이 필요하면
// 카카오/네이버 "지도 퍼가기" iframe src 로 교체하세요.
const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(
	contactInfo.address,
)}&output=embed&hl=ko&z=17`;

const telHref = `tel:${contactInfo.tel.replace(/-/g, "")}`;

export const MapSection = () => {
	return (
		<section id="map" className="px-4 py-24 sm:px-6 lg:px-8">
			<div className="mx-auto max-w-6xl">
				<FadeIn className="mx-auto max-w-2xl text-center">
					<h2 className="font-bold text-3xl tracking-tight sm:text-4xl">찾아오시는 길</h2>
					<p className="mt-4 text-lg text-muted-foreground">{contactInfo.hoursNote}</p>
				</FadeIn>

				<div className="mt-16 grid gap-8 lg:grid-cols-5">
					<FadeIn className="lg:col-span-2">
						<div className="flex h-full flex-col gap-7 rounded-2xl bg-muted/50 p-8">
							<div className="flex gap-4">
								<MapPin className="h-5 w-5 shrink-0 text-primary" />
								<div>
									<p className="font-semibold">주소</p>
									<p className="mt-1 text-muted-foreground text-sm">{contactInfo.address}</p>
									<p className="text-muted-foreground text-sm">{contactInfo.addressSub}</p>
								</div>
							</div>

							<div className="flex gap-4">
								<Train className="h-5 w-5 shrink-0 text-primary" />
								<div>
									<p className="font-semibold">교통</p>
									<p className="mt-1 text-muted-foreground text-sm">{contactInfo.subway}</p>
								</div>
							</div>

							<div className="flex gap-4">
								<Phone className="h-5 w-5 shrink-0 text-primary" />
								<div>
									<p className="font-semibold">전화</p>
									<a
										href={telHref}
										className="mt-1 block text-muted-foreground text-sm hover:text-foreground"
									>
										{contactInfo.tel}
									</a>
								</div>
							</div>

							<div className="flex gap-4">
								<Mail className="h-5 w-5 shrink-0 text-primary" />
								<div>
									<p className="font-semibold">이메일</p>
									<a
										href={`mailto:${contactInfo.email}`}
										className="mt-1 block text-muted-foreground text-sm hover:text-foreground"
									>
										{contactInfo.email}
									</a>
								</div>
							</div>

							<div className="flex gap-4">
								<Clock className="h-5 w-5 shrink-0 text-primary" />
								<div>
									<p className="font-semibold">상담 시간</p>
									<dl className="mt-1 space-y-1">
										{contactInfo.hours.map(({ day, time }) => (
											<div key={day} className="flex gap-3 text-muted-foreground text-sm">
												<dt className="w-14 shrink-0">{day}</dt>
												<dd>{time}</dd>
											</div>
										))}
									</dl>
								</div>
							</div>
						</div>
					</FadeIn>

					<FadeIn delay={0.1} className="lg:col-span-3">
						<div className="relative h-full min-h-[400px] overflow-hidden rounded-2xl">
							<iframe
								src={mapSrc}
								title="초이스 행정사 사무소 오시는 길"
								className="absolute inset-0 h-full w-full border-0"
								loading="lazy"
								allowFullScreen
								referrerPolicy="no-referrer-when-downgrade"
							/>
						</div>
					</FadeIn>
				</div>
			</div>
		</section>
	);
};
