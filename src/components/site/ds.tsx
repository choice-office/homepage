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
			"ds-badge inline-flex items-center gap-1.5 font-medium text-[13px] leading-none whitespace-nowrap rounded-none px-3 py-1.5",
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
}) => {
	const className = cn("ds-btn", `ds-btn-${variant}`, btnSizeClass[size], disabled && "is-disabled");
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
// padding은 런타임 prop(호출부에서 clamp 등 전달) → 인라인 유지가 정확
export const Card = ({
	children,
	hover = true,
	padding = "var(--space-6)",
	style,
	onClick,
	className,
}: {
	children: ReactNode;
	hover?: boolean;
	padding?: string | number;
	style?: Sx;
	onClick?: () => void;
	className?: string;
}) => {
	const cls = cn("ds-card", hover && "is-hover", className);
	// 카드 자체가 클릭 동작을 가지면 button(키보드/포커스 기본 지원), 아니면 div
	if (onClick) {
		return (
			<button type="button" className={cn(cls, "block")} onClick={onClick} style={{ padding, ...style }}>
				{children}
			</button>
		);
	}
	return (
		<div className={cls} style={{ padding, ...style }}>
			{children}
		</div>
	);
};

export const CardTitle = ({ children, style }: { children: ReactNode; style?: Sx }) => (
	<h3
		className="m-0 font-bold text-[length:var(--text-h3)] text-[color:var(--text-heading)] leading-[var(--leading-snug)] tracking-[var(--tracking-tight)]"
		style={style}
	>
		{children}
	</h3>
);

export const CardBody = ({
	children,
	style,
	className,
}: {
	children: ReactNode;
	style?: Sx;
	className?: string;
}) => (
	<p
		className={cn(
			"mt-[var(--space-3)] text-[length:var(--text-base)] text-[color:var(--text-body)] leading-[var(--leading-relaxed)]",
			className,
		)}
		style={style}
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
		className="mb-2 block text-[14px] font-medium text-[color:var(--text-heading)]"
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
	<input
		className={cn("ds-field h-12 px-3.5", invalid && "is-invalid")}
		style={style}
		{...rest}
	/>
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
