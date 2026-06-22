import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { services } from "@/data/services";

export default function sitemap(): MetadataRoute.Sitemap {
	const now = new Date();

	const staticRoutes: MetadataRoute.Sitemap = [
		{ url: siteConfig.url, lastModified: now, changeFrequency: "monthly", priority: 1 },
		{
			url: `${siteConfig.url}/about`,
			lastModified: now,
			changeFrequency: "monthly",
			priority: 0.8,
		},
		{
			url: `${siteConfig.url}/services`,
			lastModified: now,
			changeFrequency: "monthly",
			priority: 0.9,
		},
		{
			url: `${siteConfig.url}/reviews`,
			lastModified: now,
			changeFrequency: "weekly",
			priority: 0.7,
		},
		{
			url: `${siteConfig.url}/contact`,
			lastModified: now,
			changeFrequency: "yearly",
			priority: 0.7,
		},
		{ url: `${siteConfig.url}/posts`, lastModified: now, changeFrequency: "weekly", priority: 0.5 },
		{
			url: `${siteConfig.url}/privacy`,
			lastModified: now,
			changeFrequency: "yearly",
			priority: 0.3,
		},
		{ url: `${siteConfig.url}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
	];

	const serviceRoutes: MetadataRoute.Sitemap = services.map((service) => ({
		url: `${siteConfig.url}/services/${service.slug}`,
		lastModified: now,
		changeFrequency: "monthly",
		priority: 0.6,
	}));

	return [...staticRoutes, ...serviceRoutes];
}
