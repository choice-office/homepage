"use client";

import { Menu, Phone } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { contactInfo, navLinks, siteConfig } from "@/config/site";
import { buttonVariants } from "@/lib/button-variants";
import { cn } from "@/lib/utils";

const telHref = `tel:${contactInfo.tel.replace(/-/g, "")}`;

export const Header = () => {
	return (
		<>
			{/* 키보드 사용자를 위한 Skip Navigation */}
			<a
				href="#main-content"
				className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200] focus:rounded-md focus:bg-background focus:px-4 focus:py-2 focus:font-medium focus:text-sm focus:shadow-md focus:outline-none focus:ring-2 focus:ring-ring"
			>
				본문 바로가기
			</a>
			<header className="sticky top-0 z-50 w-full border-border/40 border-b bg-background/80 backdrop-blur-sm">
				<div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
					<Link href="/" className="inline-flex items-center py-2 font-bold text-lg tracking-tight">
						{siteConfig.name}
					</Link>

					<nav
						aria-label="메인 내비게이션"
						className="hidden items-center gap-6 font-medium text-sm lg:flex"
					>
						{navLinks.map((link) => (
							<Link
								key={link.href}
								href={link.href}
								className="py-2 text-muted-foreground transition-colors hover:text-foreground"
							>
								{link.label}
							</Link>
						))}
					</nav>

					<div className="flex items-center gap-2">
						<a
							href={telHref}
							className="hidden items-center gap-1.5 font-semibold text-primary text-sm xl:inline-flex"
						>
							<Phone className="h-4 w-4" />
							{contactInfo.tel}
						</a>

						<Link
							href="/#contact"
							className={cn(buttonVariants({ size: "sm" }), "hidden md:inline-flex")}
						>
							무료 상담
						</Link>

						{/* Mobile menu */}
						<Sheet>
							<SheetTrigger render={<Button variant="ghost" size="icon" className="lg:hidden" />}>
								<Menu className="h-5 w-5" />
								<span className="sr-only">메뉴 열기</span>
							</SheetTrigger>
							<SheetContent side="right">
								<SheetHeader>
									<SheetTitle>메뉴</SheetTitle>
								</SheetHeader>
								<nav className="flex flex-col gap-4 px-4">
									{navLinks.map((link) => (
										<Link
											key={link.href}
											href={link.href}
											className="font-medium text-lg text-muted-foreground transition-colors hover:text-foreground"
										>
											{link.label}
										</Link>
									))}
									<a
										href={telHref}
										className="mt-2 inline-flex items-center gap-2 font-semibold text-primary"
									>
										<Phone className="h-4 w-4" />
										{contactInfo.tel}
									</a>
									<Link href="/#contact" className={cn(buttonVariants(), "mt-2 w-full")}>
										무료 상담 신청
									</Link>
								</nav>
							</SheetContent>
						</Sheet>
					</div>
				</div>
			</header>
		</>
	);
};
