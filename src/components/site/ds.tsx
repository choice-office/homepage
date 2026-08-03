"use client";

import type { CSSProperties, InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Sx = CSSProperties;

/* ── Badge ── */
// variant 색은 arbitrary-value 유틸로(기존 CSS 변수 그대로 → 값 동일)
const badgeVariantClass: Record<string, string> = {
	default: "bg-[var(--badge-bg)] text-[color:var(--badge-fg)]",
	primary: "bg-[var(--color-primary)] text-[color:var(--color-on-primary)]",
	outline:
		"bg-transparent text-[color:var(--text-body)] shadow-[inset_0_0_0_1px_var(--border-default)]",
};

export const Badge = ({
	children,
	variant = "default",
	style,
}: {
	children: ReactNode;
	variant?: string;
	style?: Sx;
}) => (
	<span
		className={cn(
			"ds-badge inline-flex items-center gap-1.5 whitespace-nowrap rounded-none px-3 py-1.5 font-medium text-[13px] leading-none",
			badgeVariantClass[variant],
		)}
		style={style}
	>
		{children}
	</span>
);

/* ── Button (hover는 globals.css .ds-btn-*:hover 로 처리) ── */
// 크기: font-size만 arbitrary(px)로 — text-sm/base 같은 이름 유틸은 line-height까지 주입해
// 원본(인라인=폰트크기만, line-height 없음)과 텍스트 세로 정렬이 미세하게 달라지므로 사용 금지.
const btnSizeClass: Record<string, string> = {
	sm: "h-9 px-3.5 text-[14px]",
	md: "h-11 px-5 text-[16px]",
	lg: "h-[52px] px-7 text-[17px]",
};

export const Button = ({
	children,
	variant = "primary",
	size = "md",
	href,
	disabled = false,
	iconStart,
	iconEnd,
	onClick,
	type = "button",
	style,
	className: classNameProp,
}: {
	children?: ReactNode;
	variant?: string;
	size?: string;
	href?: string;
	disabled?: boolean;
	iconStart?: ReactNode;
	iconEnd?: ReactNode;
	onClick?: () => void;
	type?: "button" | "submit" | "reset";
	style?: Sx;
	className?: string;
}) => {
	const className = cn(
		"ds-btn",
		`ds-btn-${variant}`,
		btnSizeClass[size],
		disabled && "is-disabled",
		classNameProp,
	);
	if (href) {
		return (
			<a href={href} onClick={onClick} className={className} style={style}>
				{iconStart}
				{children}
				{iconEnd}
			</a>
		);
	}
	return (
		<button type={type} onClick={onClick} disabled={disabled} className={className} style={style}>
			{iconStart}
			{children}
			{iconEnd}
		</button>
	);
};

/* ── Card ── */
// 여백은 기본값을 유틸리티로 두고 호출부가 p-* 로 덮는다(cn=tailwind-merge 가 교체).
// 인라인 style 을 쓰지 않는 이유: 인라인은 반응형 CSS 규칙까지 이겨버려 죽은 규칙을 만든다.
export const Card = ({
	children,
	hover = true,
	onClick,
	className,
}: {
	children: ReactNode;
	hover?: boolean;
	onClick?: () => void;
	className?: string;
}) => {
	const cls = cn("ds-card", "p-[var(--space-6)]", hover && "is-hover", className);
	// 카드 자체가 클릭 동작을 가지면 button(키보드/포커스 기본 지원), 아니면 div
	if (onClick) {
		// block 은 button 의 기본 inline-block 을 펴기 위한 것이므로 cls 보다 앞에 둔다.
		// 뒤에 두면 tailwind-merge 가 호출부의 display 유틸(flex 등)을 지워버린다.
		return (
			<button type="button" className={cn("block", cls)} onClick={onClick}>
				{children}
			</button>
		);
	}
	return <div className={cls}>{children}</div>;
};

// 줄높이는 leading-* 대신 [line-height:*] 임의 속성으로 둔다.
// Tailwind v4 의 text-<size>/<leading> 문법 때문에 tailwind-merge 는 text-* 를
// font-size+line-height 그룹으로 보고 leading-* 를 충돌로 지운다. 호출부가 text-* 를
// 넘기는 순간 줄높이가 조용히 사라지고(biome 가 클래스를 정렬하므로 순서로도 못 막는다),
// 카드 높이가 달라진다 — 실제로 블로그 27화면이 이 문제로 줄어들었다.
export const CardTitle = ({ children, className }: { children: ReactNode; className?: string }) => (
	<h3
		className={cn(
			"m-0 font-bold text-[color:var(--text-heading)] text-[length:var(--text-h3)] tracking-[var(--tracking-tight)] [line-height:var(--leading-snug)]",
			className,
		)}
	>
		{children}
	</h3>
);

export const CardBody = ({ children, className }: { children: ReactNode; className?: string }) => (
	<p
		className={cn(
			"mt-[var(--space-3)] text-[color:var(--text-body)] text-[length:var(--text-base)] [line-height:var(--leading-relaxed)]",
			className,
		)}
	>
		{children}
	</p>
);

/* ── Forms (focus는 globals.css .ds-field:focus 로 처리) ── */
export const Label = ({
	children,
	htmlFor,
	style,
}: {
	children: ReactNode;
	htmlFor?: string;
	style?: Sx;
}) => (
	<label
		htmlFor={htmlFor}
		className="mb-2 block font-medium text-[14px] text-[color:var(--text-heading)]"
		style={style}
	>
		{children}
	</label>
);

export const Input = ({
	invalid = false,
	style,
	...rest
}: InputHTMLAttributes<HTMLInputElement> & { invalid?: boolean }) => (
	<input className={cn("ds-field h-12 px-3.5", invalid && "is-invalid")} style={style} {...rest} />
);

export const Textarea = ({
	invalid = false,
	rows = 4,
	style,
	...rest
}: TextareaHTMLAttributes<HTMLTextAreaElement> & { invalid?: boolean }) => (
	<textarea
		className={cn("ds-field resize-y px-3.5 py-3 leading-[1.6]", invalid && "is-invalid")}
		rows={rows}
		style={style}
		{...rest}
	/>
);
