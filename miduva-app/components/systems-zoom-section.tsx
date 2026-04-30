'use client';

import React, { useRef } from 'react';
import { ZoomParallax } from '@/components/ui/zoom-parallax';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

type System = {
	id: string;
	num: string;
	label: string;
	title: string;
	description: string;
	imageUrl: string;
};

const SYSTEMS: System[] = [
	{
		id: 'lead-gen',
		num: '01',
		label: 'Lead Generation System',
		title: 'Consistent leads.\nOn autopilot.',
		description:
			'Generate predictable lead flow using ads, funnels & precision conversion systems built for your market.',
		imageUrl:
			'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1600&auto=format&fit=crop',
	},
	{
		id: 'website-conversion',
		num: '02',
		label: 'Website & Conversion System',
		title: 'Your website,\nactually converting.',
		description:
			"Turn traffic into revenue with a high-performance site engineered around your buyer's journey.",
		imageUrl:
			'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?q=80&w=1600&auto=format&fit=crop',
	},
	{
		id: 'automation',
		num: '03',
		label: 'Smart Automation System',
		title: 'Sales & follow-ups\nrunning 24/7.',
		description:
			'CRM workflows, AI agents, and email sequences that close deals while you sleep — no extra hires.',
		imageUrl:
			'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1600&auto=format&fit=crop',
	},
];

const PARALLAX_IMAGES = [
	{
		src: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1280&h=720&fit=crop&crop=entropy&auto=format&q=80',
		alt: 'Marketing performance charts',
	},
	{
		src: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=1280&h=720&fit=crop&crop=entropy&auto=format&q=80',
		alt: 'Data visualization screen',
	},
	{
		src: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&h=800&fit=crop&crop=entropy&auto=format&q=80',
		alt: 'Digital marketing strategy',
	},
	{
		src: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1280&h=720&fit=crop&crop=entropy&auto=format&q=80',
		alt: 'Team reviewing growth metrics',
	},
	{
		src: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=800&h=800&fit=crop&crop=entropy&auto=format&q=80',
		alt: 'Modern web design workspace',
	},
	{
		src: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1280&h=720&fit=crop&crop=entropy&auto=format&q=80',
		alt: 'Automation and circuitry',
	},
	// Last image = same as System 1 so the zoom flows seamlessly into the reveal
	{
		src: SYSTEMS[0].imageUrl,
		alt: 'Lead Generation System',
	},
];

type Side = 'left' | 'right';

function SystemsScrollReveal() {
	const containerRef = useRef<HTMLDivElement>(null);
	const imageRefs = useRef<(HTMLDivElement | null)[]>([]);
	const textRefs = useRef<(HTMLDivElement | null)[]>([]);
	const dotRefs = useRef<(HTMLDivElement | null)[]>([]);

	React.useLayoutEffect(() => {
		gsap.registerPlugin(ScrollTrigger);

		const ctx = gsap.context(() => {
			const total = SYSTEMS.length;
			const segment = 1 / total;

			// Init dots: first active, rest dim
			dotRefs.current.forEach((dot, di) => {
				if (!dot) return;
				gsap.set(dot, {
					scale: di === 0 ? 1.4 : 1,
					opacity: di === 0 ? 1 : 0.3,
				});
			});

			const tl = gsap.timeline({
				scrollTrigger: {
					trigger: containerRef.current,
					start: 'top top',
					end: '+=300%',
					pin: true,
					scrub: 0.5,
				},
			});

			let prevActiveDot = 0;

			SYSTEMS.forEach((_, i) => {
				const side: Side = i % 2 === 0 ? 'left' : 'right';
				const imageEl = imageRefs.current[i];
				const textEl = textRefs.current[i];
				if (!imageEl || !textEl) return;

				const start = i * segment;
				const isLast = i === total - 1;
				const isFirst = i === 0;

				// ---- Dots ----
				if (dotRefs.current[prevActiveDot]) {
					tl.to(
						dotRefs.current[prevActiveDot],
						{ scale: 1, opacity: 0.3, duration: segment * 0.06, ease: 'none' },
						start
					);
				}
				if (dotRefs.current[i]) {
					tl.to(
						dotRefs.current[i],
						{ scale: 1.4, opacity: 1, duration: segment * 0.06, ease: 'none' },
						start
					);
				}
				prevActiveDot = i;

				if (isFirst) {
					// ---- System 1: continues from zoom ----
					// Starts large & centered (matching the end of zoom parallax)
					gsap.set(imageEl, {
						opacity: 1,
						scale: 2.6,
						x: 0,
						y: 0,
					});
					gsap.set(textEl, {
						opacity: 0,
						x: side === 'left' ? '10vw' : '-10vw',
						y: '6vh',
					});

					// Image shrinks and drifts to its side
					tl.to(
						imageEl,
						{
							scale: 1,
							x: side === 'left' ? '-12%' : '12%',
							duration: segment * 0.42,
							ease: 'none',
						},
						start
					);

					// Text slides in from opposite side
					tl.to(
						textEl,
						{
							opacity: 1,
							x: 0,
							y: 0,
							duration: segment * 0.28,
							ease: 'none',
						},
						start + segment * 0.18
					);
				} else {
					// ---- Systems 2 & 3: enter from below/side ----
					gsap.set(imageEl, {
						opacity: 0,
						scale: 1.35,
						x: 0,
						y: '12vh',
					});
					gsap.set(textEl, {
						opacity: 0,
						x: side === 'left' ? '10vw' : '-10vw',
						y: '6vh',
					});

					// Image enters
					tl.to(
						imageEl,
						{
							opacity: 1,
							scale: 1,
							x: side === 'left' ? '-12%' : '12%',
							y: 0,
							duration: segment * 0.3,
							ease: 'none',
						},
						start
					);

					// Text enters
					tl.to(
						textEl,
						{
							opacity: 1,
							x: 0,
							y: 0,
							duration: segment * 0.22,
							ease: 'none',
						},
						start + segment * 0.14
					);
				}

				if (!isLast) {
					// ---- Exit ----
					tl.to(
						imageEl,
						{
							opacity: 0,
							scale: 0.88,
							x: side === 'left' ? '-20%' : '20%',
							y: '-6vh',
							duration: segment * 0.25,
							ease: 'none',
						},
						start + segment * 0.75
					);

					tl.to(
						textEl,
						{
							opacity: 0,
							x: side === 'left' ? '-6vw' : '6vw',
							y: '-4vh',
							duration: segment * 0.2,
							ease: 'none',
						},
						start + segment * 0.78
					);
				}
			});
		}, containerRef);

		return () => ctx.revert();
	}, []);

	return (
		<div
			ref={containerRef}
			className="relative w-full h-screen bg-white overflow-hidden"
		>
			{/* Soft ambient backdrop */}
			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.04),transparent_60%)]"
			/>

			{SYSTEMS.map((system, i) => {
				const side: Side = i % 2 === 0 ? 'left' : 'right';
				return (
					<div
						key={system.id}
						className="absolute inset-0 flex items-center"
					>
						<div
							className={`grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center w-full max-w-7xl mx-auto px-6 ${
								side === 'right' ? 'md:[direction:rtl]' : ''
							}`}
						>
							{/* Image */}
							<div
								ref={(el) => { imageRefs.current[i] = el; }}
								className="md:[direction:ltr] order-1 will-change-transform"
							>
								<div className="overflow-hidden rounded-[28px] border border-[var(--line)] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.35)]">
									<img
										src={system.imageUrl}
										alt={system.label}
										className="w-full h-[44vh] md:h-[62vh] object-cover"
										loading="lazy"
										decoding="async"
									/>
								</div>
							</div>

							{/* Text */}
							<div
								ref={(el) => { textRefs.current[i] = el; }}
								className="md:[direction:ltr] order-2 will-change-transform"
							>
								<div className="inline-flex items-center gap-2 mb-5">
									<span className="mono text-[11px] uppercase tracking-[0.22em] text-white/80 bg-[var(--navy-900)] px-2.5 py-1 rounded-full">
										{system.num}
									</span>
									<span className="w-5 h-px bg-[var(--muted)]" />
									<span className="mono text-[11px] uppercase tracking-[0.18em] text-[var(--teal-500)] font-semibold">
										{system.label}
									</span>
								</div>

								<h3
									className="text-[32px] md:text-[52px] font-extrabold text-[var(--navy-900)] tracking-[-0.035em] leading-[1.05] mb-5"
									style={{ whiteSpace: 'pre-line' }}
								>
									{system.title}
								</h3>

								<p className="text-[15px] md:text-[17px] text-[var(--muted)] leading-[1.7] mb-7 max-w-[480px]">
									{system.description}
								</p>

								<a
									href="#cta"
									className="inline-flex items-center gap-2 text-[13px] font-semibold text-[var(--teal-500)] hover:text-[var(--navy-900)] transition-colors group/cta"
								>
									<span className="px-5 py-2.5 rounded-full border border-[var(--teal-500)]/40 bg-[var(--teal-500)]/10 backdrop-blur-sm group-hover/cta:bg-[var(--teal-500)]/25 transition-colors">
										Explore Your System
									</span>
									<span className="transition-transform group-hover/cta:translate-x-1">
										→
									</span>
								</a>
							</div>
						</div>
					</div>
				);
			})}

			{/* Step indicator */}
			<div className="absolute right-6 top-1/2 -translate-y-1/2 hidden md:flex flex-col gap-3 z-10">
				{SYSTEMS.map((_, i) => (
					<div
						key={i}
						ref={(el) => { dotRefs.current[i] = el; }}
						className="h-2 w-2 rounded-full bg-[var(--teal-500)] will-change-transform"
					/>
				))}
			</div>
		</div>
	);
}

export default function SystemsZoomSection() {
	return (
		<section id="systems">
			{/* Intro header */}
			<div className="relative flex h-[50vh] items-center justify-center overflow-hidden">
				<div
					aria-hidden="true"
					className="pointer-events-none absolute -top-1/2 left-1/2 h-[120vmin] w-[120vmin] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.1),transparent_50%)] blur-[30px]"
				/>
				<div className="text-center px-6">
					<div className="mono text-[13px] uppercase tracking-[0.22em] text-[var(--teal-500)] mb-4">
						/ our systems
					</div>
					<h2 className="text-[48px] md:text-[64px] font-extrabold tracking-[-0.04em] text-[var(--navy-900)] leading-[1.02]">
						Three systems.
						<br />
						<span className="text-[var(--teal-500)]">One growth machine.</span>
					</h2>
				</div>
			</div>

			<ZoomParallax images={PARALLAX_IMAGES} />

			<SystemsScrollReveal />
		</section>
	);
}
