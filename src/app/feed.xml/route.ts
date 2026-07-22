import { siteConfig } from "@/config/site";
import { getPublishedPosts } from "@/lib/blog";

// 블로그 RSS 2.0 피드 — Google Search Console / 네이버 서치어드바이저에 제출용.
// /feed.xml 로 서빙. 최신 글 위주로 30개만 담아 피드 용량을 제한한다.
export const revalidate = 3600; // 1시간마다 재생성

const FEED_SIZE = 30;

const esc = (s: string) =>
	s
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;");

// CDATA 내부에 "]]>"가 들어가면 조기 종료되므로 안전하게 분할한다.
const cdata = (s: string) => `<![CDATA[${s.replaceAll("]]>", "]]]]><![CDATA[>")}]]>`;

// yyyy-mm-dd → RFC-822 (KST 기준). 값이 비정상이면 현재 시각으로 폴백.
const rfc822 = (ymd?: string) => {
	const d = ymd ? new Date(`${ymd}T00:00:00+09:00`) : new Date();
	return (Number.isNaN(d.getTime()) ? new Date() : d).toUTCString();
};

export const GET = async () => {
	const base = siteConfig.url;
	const posts = (await getPublishedPosts()).slice(0, FEED_SIZE);

	const items = posts
		.map((p) => {
			const url = `${base}/blog/${p.slug}`;
			return `    <item>
      <title>${esc(p.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${rfc822(p.date)}</pubDate>
      <category>${esc(p.category)}</category>
      <description>${cdata(p.metaDescription ?? p.excerpt)}</description>
      <content:encoded>${cdata(p.content)}</content:encoded>
    </item>`;
		})
		.join("\n");

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${esc(siteConfig.name)} · 블로그</title>
    <link>${base}/blog</link>
    <description>${esc(siteConfig.description)}</description>
    <language>ko</language>
    <lastBuildDate>${rfc822(posts[0]?.dateModified ?? posts[0]?.date)}</lastBuildDate>
    <atom:link href="${base}/feed.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;

	return new Response(xml, {
		headers: {
			"Content-Type": "application/rss+xml; charset=utf-8",
			"Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
		},
	});
};
