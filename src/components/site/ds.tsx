"use client";

import type { CSSProperties, InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from "react";
import { useState } from "react";

type Sx = CSSProperties;

/* ── Badge ── */
const badgeVariants: Record<string, Sx> = {
	default: { background: "var(--badge-bg)", color: "var(--badge-fg)" },
	primary: { background: "var(--color-primary)", color: "var(--color-on-primary)" },
	outline: {
		background: "transparent",
		color: "var(--text-body)",
		boxShadow: "inset 0 0 0 1px var(--border-default)",
	},
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
		style={{
			display: "inline-flex",
			alignItems: "center",
			gap: 6,
			fontFamily: "var(--font-sans)",
			fontWeight: 500,
			fontSize: 13,
			lineHeight: 1,
			padding: "6px 12px",
			borderRadius: "var(--radius-pill)",
			whiteSpace: "nowrap",
			...badgeVariants[variant],
			...style,
		}}
	>
		{children}
	</span>
);

/* ── Button ── */
const btnBase: Sx = {
	display: "inline-flex",
	alignItems: "center",
	justifyContent: "center",
	gap: 8,
	fontFamily: "var(--font-sans)",
	fontWeight: 500,
	borderRadius: "var(--radius)",
	border: "1px solid transparent",
	cursor: "pointer",
	whiteSpace: "nowrap",
	textDecoration: "none",
	transition: "background-color .18s ease, color .18s ease, border-color .18s ease",
	userSelect: "none",
};
const btnSizes: Record<string, Sx> = {
	sm: { height: 36, padding: "0 14px", fontSize: 14 },
	md: { height: 44, padding: "0 20px", fontSize: 16 },
	lg: { height: 52, padding: "0 28px", fontSize: 17 },
};
const btnVariants: Record<string, Sx> = {
	primary: { background: "var(--action-primary)", color: "var(--color-on-primary)" },
	outline: {
		background: "var(--surface-card)",
		color: "var(--text-heading)",
		borderColor: "var(--border-default)",
	},
	secondary: { background: "var(--color-accent-soft)", color: "var(--color-primary-dark)" },
	ghost: { background: "transparent", color: "var(--text-body)" },
};
const btnHovers: Record<string, Sx> = {
	primary: { background: "var(--action-primary-hover)" },
	outline: { background: "var(--surface-subtle)" },
	secondary: { background: "#d6c9b3" },
	ghost: { background: "var(--surface-subtle)" },
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
	const [hover, setHover] = useState(false);
	const composed: Sx = {
		...btnBase,
		...btnSizes[size],
		...btnVariants[variant],
		...(hover && !disabled ? btnHovers[variant] : null),
		...(disabled ? { opacity: 0.5, pointerEvents: "none" } : null),
		...style,
	};
	if (href) {
		return (
			<a
				href={href}
				onClick={onClick}
				style={composed}
				onMouseEnter={() => setHover(true)}
				onMouseLeave={() => setHover(false)}
			>
				{iconStart}
				{children}
				{iconEnd}
			</a>
		);
	}
	return (
		<button
			type={type}
			onClick={onClick}
			disabled={disabled}
			style={composed}
			onMouseEnter={() => setHover(true)}
			onMouseLeave={() => setHover(false)}
		>
			{iconStart}
			{children}
			{iconEnd}
		</button>
	);
};

/* ── Card ── */
export const Card = ({
	children,
	hover = true,
	padding = "var(--space-6)",
	style,
	onClick,
}: {
	children: ReactNode;
	hover?: boolean;
	padding?: string | number;
	style?: Sx;
	onClick?: () => void;
}) => {
	const cls = `ds-card${hover ? " is-hover" : ""}`;
	// 카드 자체가 클릭 동작을 가지면 button(키보드/포커스 기본 지원), 아니면 div
	if (onClick) {
		return (
			<button
				type="button"
				className={cls}
				onClick={onClick}
				style={{ display: "block", padding, ...style }}
			>
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
		style={{
			fontSize: "var(--text-h3)",
			fontWeight: 700,
			color: "var(--text-heading)",
			lineHeight: "var(--leading-snug)",
			letterSpacing: "var(--tracking-tight)",
			margin: 0,
			...style,
		}}
	>
		{children}
	</h3>
);

export const CardBody = ({ children, style }: { children: ReactNode; style?: Sx }) => (
	<p
		style={{
			fontSize: "var(--text-base)",
			color: "var(--text-body)",
			lineHeight: "var(--leading-relaxed)",
			margin: "var(--space-3) 0 0",
			...style,
		}}
	>
		{children}
	</p>
);

/* ── Forms ── */
const fieldStyle = (focus: boolean, invalid: boolean): Sx => ({
	width: "100%",
	boxSizing: "border-box",
	fontFamily: "var(--font-sans)",
	fontSize: 16,
	color: "var(--text-body)",
	background: "var(--surface-card)",
	border: `1px solid ${invalid ? "#b4452f" : focus ? "var(--color-primary)" : "var(--border-default)"}`,
	borderRadius: "var(--radius)",
	outline: "none",
	boxShadow: focus ? "0 0 0 3px rgba(108,93,76,0.18)" : "none",
	transition: "border-color .15s ease, box-shadow .15s ease",
});

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
		style={{
			display: "block",
			fontSize: 14,
			fontWeight: 500,
			color: "var(--text-heading)",
			marginBottom: 8,
			...style,
		}}
	>
		{children}
	</label>
);

export const Input = ({
	invalid = false,
	style,
	...rest
}: InputHTMLAttributes<HTMLInputElement> & { invalid?: boolean }) => {
	const [f, setF] = useState(false);
	return (
		<input
			onFocus={() => setF(true)}
			onBlur={() => setF(false)}
			style={{ ...fieldStyle(f, invalid), height: 48, padding: "0 14px", ...style }}
			{...rest}
		/>
	);
};

export const Textarea = ({
	invalid = false,
	rows = 4,
	style,
	...rest
}: TextareaHTMLAttributes<HTMLTextAreaElement> & { invalid?: boolean }) => {
	const [f, setF] = useState(false);
	return (
		<textarea
			rows={rows}
			onFocus={() => setF(true)}
			onBlur={() => setF(false)}
			style={{
				...fieldStyle(f, invalid),
				padding: "12px 14px",
				lineHeight: 1.6,
				resize: "vertical",
				...style,
			}}
			{...rest}
		/>
	);
};
