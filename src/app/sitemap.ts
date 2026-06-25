import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { SERVICES } from "@/lib/site-data";

export default function sitemap(): MetadataRoute.Sitemap {
	const now = new Date();
	const u = (path: string) => `${siteConfig.url}${path}`;

	const staticRoutes: MetadataRoute.Sitemap = [
		{ url: siteConfig.url, lastModified: now, changeFrequency: "monthly", priority: 1 },
		{ url: u("/greeting"), lastModified: now, changeFrequency: "monthly", priority: 0.8 },
		{ url: u("/members"), lastModified: now, changeFrequency: "monthly", priority: 0.7 },
		{ url: u("/credentials"), lastModified: now, changeFrequency: "monthly", priority: 0.6 },
		{ url: u("/location"), lastModified: now, changeFrequency: "yearly", priority: 0.6 },
		{ url: u("/services"), lastModified: now, changeFrequency: "monthly", priority: 0.9 },
		{ url: u("/reviews"), lastModified: now, changeFrequency: "weekly", priority: 0.7 },
		{ url: u("/faq"), lastModified: now, changeFrequency: "monthly", priority: 0.6 },
		{ url: u("/blog"), lastModified: now, changeFrequency: "weekly", priority: 0.5 },
		{ url: u("/contact"), lastModified: now, changeFrequency: "yearly", priority: 0.7 },
		{ url: u("/privacy"), lastModified: now, changeFrequency: "yearly", priority: 0.3 },
		{ url: u("/terms"), lastModified: now, changeFrequency: "yearly", priority: 0.3 },
	];

	const serviceRoutes: MetadataRoute.Sitemap = SERVICES.map((s) => ({
		url: u(`/services/${s.id}`),
		lastModified: now,
		changeFrequency: "monthly",
		priority: 0.6,
	}));

	return [...staticRoutes, ...serviceRoutes];
}
