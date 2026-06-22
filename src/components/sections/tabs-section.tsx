import type { LucideIcon } from "lucide-react";
import { Building2, Settings, Star, Users } from "lucide-react";
import Image from "next/image";
import { FadeIn } from "@/components/common/fade-in";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

type Tab = {
	id: string;
	icon: LucideIcon;
	label: string;
	title: string;
	description: string;
	features?: string[];
	image?: string; // /public/tabs/tab-1.jpg
};

// ★ 설정: 탭 내용을 수정하세요
const tabs: Tab[] = [
	{
		id: "service1",
		icon: Star,
		label: "레이저 절곡",
		title: "정밀 레이저 절곡 가공",
		description:
			"최신 레이저 장비를 통해 0.1mm 단위의 정밀 절곡 가공을 제공합니다. 다양한 금속 재료를 처리할 수 있으며, 대량 주문 시 단가 협의가 가능합니다.",
		features: [
			"SUS, 철판, 알루미늄 가공",
			"최대 4m 길이 작업 가능",
			"CAD 도면 기반 정밀 시공",
			"납기 준수 보장",
		],
		image: "/tabs/laser.jpg",
	},
	{
		id: "service2",
		icon: Settings,
		label: "금속 제작",
		title: "맞춤형 금속 구조물 제작",
		description:
			"설계부터 제작·설치까지 원스톱 서비스를 제공합니다. 고객의 도면이나 아이디어를 현실로 만들어드립니다.",
		features: ["3D 설계 → 제작 → 설치 일괄", "다품종 소량 생산 가능", "현장 실측 무료"],
		image: "/tabs/metal.jpg",
	},
	{
		id: "service3",
		icon: Building2,
		label: "전기차 캐노피",
		title: "전기차 충전소 캐노피 시공",
		description:
			"아파트, 빌딩, 주차장 등 다양한 환경에 적합한 전기차 충전 캐노피를 시공합니다. 내구성과 미관을 모두 갖춘 설계입니다.",
		features: ["구조 안전 계산서 제공", "방수·방풍 설계", "LED 조명 옵션"],
		image: "/tabs/canopy.jpg",
	},
	{
		id: "service4",
		icon: Users,
		label: "금속 무늬 패널",
		title: "인테리어 금속 무늬 패널",
		description:
			"건물 내·외부 인테리어에 활용 가능한 다양한 패턴의 금속 무늬 패널을 공급합니다. 규격품 및 주문 제작 모두 가능합니다.",
		features: ["50종 이상의 패턴 보유", "컬러 도장 가능", "규격·특수 주문 제작"],
		image: "/tabs/panel.jpg",
	},
];

export const TabsSection = () => {
	return (
		<section id="services" className="px-4 py-24 sm:px-6 lg:px-8">
			<div className="mx-auto max-w-6xl">
				<FadeIn className="mx-auto max-w-2xl text-center">
					<h2 className="font-bold text-3xl tracking-tight sm:text-4xl">사업 분야</h2>
					<p className="mt-4 text-lg text-muted-foreground">
						다양한 분야의 전문 서비스를 제공합니다.
					</p>
				</FadeIn>

				<div className="mt-12">
					<Tabs defaultValue={tabs[0].id}>
						{/* 탭 버튼 — role="tablist", aria-selected, 화살표 키 네비 자동 처리 */}
						<TabsList className="flex h-auto w-full flex-wrap justify-center gap-2 rounded-none bg-transparent p-0">
							{tabs.map((tab) => (
								<TabsTrigger
									key={tab.id}
									value={tab.id}
									className={cn(
										"flex items-center gap-2 rounded-full px-5 py-2.5 font-medium text-sm",
										"bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground",
										"data-active:bg-primary data-active:text-primary-foreground data-active:shadow",
									)}
								>
									<tab.icon className="h-4 w-4" />
									{tab.label}
								</TabsTrigger>
							))}
						</TabsList>

						{/* 탭 콘텐츠 패널 */}
						{tabs.map((tab) => (
							<TabsContent key={tab.id} value={tab.id}>
								<div className="mt-10 grid gap-8 overflow-hidden rounded-2xl bg-muted/30 p-6 lg:grid-cols-2 lg:p-10">
									{/* 텍스트 */}
									<div className="flex h-full flex-col justify-center">
										<h3 className="font-bold text-2xl">{tab.title}</h3>
										<p className="mt-4 text-muted-foreground leading-relaxed">{tab.description}</p>
										{tab.features && (
											<ul className="mt-6 space-y-2">
												{tab.features.map((feat) => (
													<li key={feat} className="flex items-center gap-2 text-sm">
														<span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
															✓
														</span>
														{feat}
													</li>
												))}
											</ul>
										)}
									</div>

									{/* 이미지 */}
									{tab.image && (
										<div className="relative aspect-4/3 w-full overflow-hidden rounded-xl">
											<Image src={tab.image} alt={tab.title} fill className="object-cover" />
										</div>
									)}
								</div>
							</TabsContent>
						))}
					</Tabs>
				</div>
			</div>
		</section>
	);
};
