"use client";

import { useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { FadeIn } from "@/components/common/fade-in";
import { type HomeStat, stats } from "@/data/home";

const CountUp = ({
	value,
	prefix = "",
	suffix = "",
}: Pick<HomeStat, "value" | "prefix" | "suffix">) => {
	const ref = useRef<HTMLSpanElement>(null);
	const isInView = useInView(ref, { once: true });
	const prefersReducedMotion = useReducedMotion();
	const [count, setCount] = useState(0);

	useEffect(() => {
		if (!isInView) return;

		// 모션 감소 설정 시 최종값 즉시 표시
		if (prefersReducedMotion) {
			setCount(value);
			return;
		}

		let startTime: number;
		const duration = 1800;

		const step = (timestamp: number) => {
			if (!startTime) startTime = timestamp;
			const progress = Math.min((timestamp - startTime) / duration, 1);
			// easeOutExpo
			const eased = progress === 1 ? 1 : 1 - 2 ** (-10 * progress);
			setCount(Math.floor(eased * value));
			if (progress < 1) requestAnimationFrame(step);
		};

		requestAnimationFrame(step);
	}, [isInView, value, prefersReducedMotion]);

	return (
		<span ref={ref} aria-live="off">
			{prefix}
			{count.toLocaleString()}
			{suffix}
		</span>
	);
};

export const Stats = () => {
	return (
		<section id="stats" className="px-4 py-24 sm:px-6 lg:px-8">
			<div className="mx-auto max-w-6xl">
				<FadeIn className="mx-auto max-w-2xl text-center">
					<h2 className="font-bold text-3xl tracking-tight sm:text-4xl">숫자로 보는 초이스</h2>
					<p className="mt-4 text-lg text-muted-foreground">
						비자·출입국 한 분야에 집중해 온 시간입니다.
					</p>
				</FadeIn>

				<div className="mt-16 grid grid-cols-2 gap-8 lg:grid-cols-4">
					{stats.map((stat, i) => (
						<FadeIn key={stat.label} delay={i * 0.1}>
							<div className="flex flex-col items-center text-center">
								<p className="font-bold text-4xl text-primary tracking-tight sm:text-5xl">
									<span className="sr-only">{`${stat.prefix ?? ""}${stat.value.toLocaleString()}${stat.suffix ?? ""} ${stat.label}`}</span>
									<span aria-hidden="true">
										<CountUp value={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
									</span>
								</p>
								<p className="mt-2 font-semibold">{stat.label}</p>
								{stat.description && (
									<p className="mt-1 text-muted-foreground text-sm">{stat.description}</p>
								)}
							</div>
						</FadeIn>
					))}
				</div>
			</div>
		</section>
	);
};
