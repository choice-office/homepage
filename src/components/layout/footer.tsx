import Link from "next/link";
import { businessInfo, footerLinks, siteConfig, socialLinks } from "@/config/site";

export const Footer = () => {
	return (
		<footer className="border-border/40 border-t bg-background">
			<div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
				<div className="flex flex-col items-center gap-4 md:flex-row md:justify-between">
					<p className="text-muted-foreground text-sm">
						&copy; {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
					</p>
					<nav
						aria-label="푸터 내비게이션"
						className="flex flex-wrap items-center justify-center gap-4 text-muted-foreground text-sm"
					>
						{socialLinks.map((link) => (
							<a
								key={link.href}
								href={link.href}
								target="_blank"
								rel="noopener noreferrer"
								className="transition-colors hover:text-foreground"
							>
								{link.label}
							</a>
						))}
						{footerLinks.map((link) => (
							<Link
								key={link.href}
								href={link.href}
								className="transition-colors hover:text-foreground"
							>
								{link.label}
							</Link>
						))}
					</nav>
				</div>

				{/* 사업자정보 — site.ts의 businessInfo 에 값이 있을 때만 표시 */}
				{businessInfo && (
					<p className="mt-6 border-border/40 border-t pt-6 text-center text-muted-foreground text-xs leading-relaxed md:text-left">
						{businessInfo.companyName ?? siteConfig.name}
						{businessInfo.ceo && ` | 대표 행정사: ${businessInfo.ceo}`}
						{businessInfo.regNo && ` | 사업자등록번호: ${businessInfo.regNo}`}
						{businessInfo.adminRegNo && ` | 행정사 등록번호: ${businessInfo.adminRegNo}`}
						{businessInfo.immigrationAgencyNo &&
							` | 출입국민원 대행기관 등록번호: ${businessInfo.immigrationAgencyNo}`}
						{businessInfo.address && ` | ${businessInfo.address}`}
						{businessInfo.tel && ` | TEL: ${businessInfo.tel}`}
						{businessInfo.email && (
							<>
								{" | "}
								<a
									href={`mailto:${businessInfo.email}`}
									className="underline-offset-2 hover:underline"
								>
									{businessInfo.email}
								</a>
							</>
						)}
					</p>
				)}
			</div>
		</footer>
	);
};
