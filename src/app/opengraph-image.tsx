import { ImageResponse } from "next/og";
import { siteConfig } from "@/config/site";

export const runtime = "edge";

export const alt = siteConfig.name;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
	return new ImageResponse(
		<div
			style={{
				width: "100%",
				height: "100%",
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center",
				background: "linear-gradient(135deg, #09090b 0%, #18181b 100%)",
				padding: "80px",
			}}
		>
			{/* 배경 장식 */}
			<div
				style={{
					position: "absolute",
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					background:
						"radial-gradient(ellipse at 20% 50%, rgba(120,119,198,0.15) 0%, transparent 60%), radial-gradient(ellipse at 80% 50%, rgba(120,119,198,0.1) 0%, transparent 60%)",
				}}
			/>

			{/* 사이트 이름 */}
			<div
				style={{
					fontSize: 72,
					fontWeight: 700,
					color: "#ffffff",
					letterSpacing: "-2px",
					lineHeight: 1.1,
					textAlign: "center",
					marginBottom: 24,
					zIndex: 1,
				}}
			>
				{siteConfig.name}
			</div>

			{/* 설명 */}
			<div
				style={{
					fontSize: 28,
					color: "rgba(255,255,255,0.6)",
					textAlign: "center",
					maxWidth: 800,
					lineHeight: 1.5,
					zIndex: 1,
				}}
			>
				{siteConfig.description}
			</div>

			{/* URL */}
			<div
				style={{
					position: "absolute",
					bottom: 48,
					fontSize: 20,
					color: "rgba(255,255,255,0.35)",
					zIndex: 1,
				}}
			>
				{siteConfig.url.replace(/^https?:\/\//, "")}
			</div>
		</div>,
		{ ...size },
	);
}
