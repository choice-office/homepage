import type { Metadata } from "next";
import { Contact } from "@/components/sections/contact";
import { MapSection } from "@/components/sections/map";

export const metadata: Metadata = {
	title: "문의하기",
	description:
		"초이스 행정사 사무소 온라인 상담 신청 및 오시는 길. 전화 02-6959-9886 또는 온라인으로 문의하세요.",
};

export default function ContactPage() {
	return (
		<>
			<Contact />
			<MapSection />
		</>
	);
}
