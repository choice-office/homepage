"use client";

import { useRouter } from "next/navigation";
import { routePath } from "@/lib/site-data";

/** 디자인의 go(route, param) → Next 라우터 push */
export const useGo = () => {
	const router = useRouter();
	return (route: string, param?: string | null) => {
		router.push(routePath(route, param));
	};
};

export const pathToRoute = (pathname: string): string => {
	if (pathname === "/") return "home";
	const seg = pathname.split("/").filter(Boolean);
	const first = seg[0];
	if (first === "services" && seg[1]) return "service";
	const map: Record<string, string> = {
		greeting: "greeting",
		members: "profile",
		credentials: "credentials",
		location: "location",
		services: "services",
		reviews: "reviews",
		faq: "faq",
		blog: "blog",
		contact: "contact",
	};
	return map[first] ?? "home";
};
