'use client';

import React, { useRef } from 'react';
import { useScroll, useTransform, motion } from 'motion/react';
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

// Systems 2 & 3 — System 1 is handled by ZoomToFirstSystem
const REMAINING_SYSTEMS = SYSTEMS.slice(1);

// Decorative background images for the zoom phase
const BG_IMAGES = [
	{ src: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1280&h=720&fit=crop&crop=entropy&auto=format&q=80', alt: 'Marketing charts' },
	{ src: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=1280&h=720&fit=crop&crop=entropy&auto=format&q=80', alt: 'Data visualization' },
	{ src: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&h=800&fit=crop&crop=entropy&auto=format&q=80', alt: 'Digital marketing' },
	{ src: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1280&h=720&fit=crop&crop=entropy&auto=format&q=80', alt: 'Growth metrics' },
	{ src: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=800&h=800&fit=crop&crop=entropy&auto=format&q=80', alt: 'Web design' },
	{ src: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1280&h=720&fit=crop&crop=entropy&auto=format&q=80', alt: 'Automation' },
];

// Positions for the 6 background images (same layout as original ZoomParallax outer images)
const BG_POSITION_CLASSES = [
	'[&>div]:!-top-[30vh] [&>div]:!left-[5vw] [&>div]:!h-[30vh] [&>div]:!w-[35vw]',
	'[&>div]:!-top-[10vh] [&>div]:!-left-[25vw] [&>div]:!h-[45vh] [&>div]:!w-[20vw]',
	'[&>div]:!left-[27.5vw] [&>div]:!h-[25vh] [&>div]:!w-[25vw]',
	'[&>div]:!top-[27.5vh] [&>div]:!left-[5vw] [&>div]:!h-[25vh] [&>div]:!w-[20vw]',
	'[&>div]:!top-[27.5vh] [&>div]:!-left-[22.5vw] [&>div]:!h-[25vh] [&>div]:!w-[30vw]',
	'[&>div]:!top-[22.5vh] [&>div]:!left-[25vw] [&>div]:!h-[15vh] [&>div]:!w-[15vw]',
];

/**
 * Single sticky section that:
 * 1. Zooms all background images + the System 1 image in from small
 * 2. System 1 image (the SAME element) fills the screen
 * 3. Continues scrolling: same image shrinks + shifts left to become the card
 * 4. Text appears on the right
 * 5. Everything fades out to hand off to SystemsScrollReveal
 */
function ZoomToFirstSystem() {
	const system = SYSTEMS[0];
	const containerRef = useRef<HTMLDivElement>(null);
	const { scrollYProgress } = useScroll({
		target: containerRef,
		offset: ['start start', 'end end'],
	});

	// ── Background images zoom over [0 → 0.55] then hold ──
	// Must declare each separately (no hooks in loops)
	const bg0 = useTransform(scrollYProgress, [0, 0.55], [1, 5]);
	const bg1 = useTransform(scrollYProgress, [0, 0.55], [1, 6]);
	const bg2 = useTransform(scrollYProgress, [0, 0.55], [1, 5]);
	const bg3 = useTransform(scrollYProgress, [0, 0.55], [1, 6]);
	const bg4 = useTransform(scrollYProgress, [0, 0.55], [1, 8]);
	const bg5 = useTransform(scrollYProgress, [0, 0.55], [1, 9]);
	const bgScales = [bg0, bg1, bg2, bg3, bg4, bg5];

	// Background images fade out as the center image takes over the screen
	const bgOpacity = useTransform(scrollYProgress, [0.48, 0.6], [1, 0]);

	// ── Center image (System 1) ──
	// Sized as the card (40vw × 62vh).
	// At scale 0.3 → appears ~12vw wide (small, like other bg images)
	// At scale 2.5 → appears 100vw wide (fills the screen)
	// At scale 1.0 → back to card size (40vw × 62vh)
	//
	// Timeline (scroll progress):
	//   0   → 0.5  : zoom small → full screen
	//   0.5 → 0.62 : hold at full screen
	//   0.62→ 0.78 : shrink + shift left → card position
	//   0.78→ 0.86 : hold as card with text
	//   0.86→ 0.97 : exit (fade out)
	const centerScale = useTransform(
		scrollYProgress,
		[0, 0.5, 0.62, 0.78],
		[0.3, 2.5, 2.5, 1.0]
	);
	// x is percentage of the element width (element is full-viewport-width via inset-0)
	// -15% of 100vw = -15vw → image center moves from 50vw to 35vw (left column center)
	const centerX = useTransform(
		scrollYProgress,
		[0.62, 0.78],
		['0%', '-15%']
	);

	// Border-radius: 0 while zoomed (full screen), grows to card radius as it shrinks
	const centerRadius = useTransform(
		scrollYProgress,
		[0.62, 0.78],
		[0, 28]
	);

	// ── Text (right column) ──
	const textOpacity = useTransform(scrollYProgress, [0.7, 0.78], [0, 1]);
	const textX = useTransform(scrollYProgress, [0.7, 0.78], [40, 0]); // px

	// ── Exit: card + text fade out together ──
	const exitOpacity = useTransform(scrollYProgress, [0.86, 0.97], [1, 0]);

	return (
		<div ref={containerRef} className="relative h-[500vh] w-full">
			<div className="sticky top-0 h-screen w-full overflow-hidden bg-white dark:bg-[#020204]">

				{/* Background zoom images — fade out as center takes over */}
				<motion.div style={{ opacity: bgOpacity }} className="absolute inset-0">
					{BG_IMAGES.map((img, i) => (
						<motion.div
							key={i}
							style={{ scale: bgScales[i], transformOrigin: 'center center', willChange: 'transform' }}
							className={`absolute inset-0 flex h-full w-full items-center justify-center ${BG_POSITION_CLASSES[i]}`}
						>
							<div className="relative h-[25vh] w-[25vw]">
								<img src={img.src} alt={img.alt} className="h-full w-full object-cover" />
							</div>
						</motion.div>
					))}
				</motion.div>

				{/* System 1 card + text — exits together */}
				<motion.div style={{ opacity: exitOpacity }} className="absolute inset-0">
					{/* THE center image — same element, no copy — zooms in then becomes the card */}
					<motion.div
						style={{
							scale: centerScale,
							x: centerX,
							transformOrigin: 'center center',
							willChange: 'transform',
						}}
						className="absolute inset-0 flex h-full w-full items-center justify-center"
					>
						<motion.div
							style={{ borderRadius: centerRadius }}
							className="overflow-hidden h-[62vh] w-[40vw] border border-[var(--line)] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.35)]"
						>
							<img
								src={system.imageUrl}
								alt={system.label}
								className="h-full w-full object-cover"
							/>
						</motion.div>
					</motion.div>

					{/* System 1 text — appears in right column as image reaches card position */}
					<motion.div
						style={{
							opacity: textOpacity,
							x: textX,
							position: 'absolute',
							top: '50%',
							left: '52%',
							width: '40%',
							y: '-50%',
						}}
					>
						<div className="inline-flex items-center gap-2 mb-5">
						<span className="mono text-[11px] uppercase tracking-[0.22em] text-white/80 bg-[#0F2349] dark:bg-[#020204] px-2.5 py-1 rounded-full">
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
							<span className="transition-transform group-hover/cta:translate-x-1">→</span>
						</a>
					</motion.div>
				</motion.div>

			</div>
		</div>
	);
}

type Side = 'left' | 'right';

// Handles Systems 2 & 3 with parallax enter/exit
function SystemsScrollReveal() {
	const containerRef = useRef<HTMLDivElement>(null);
	const imageRefs = useRef<(HTMLDivElement | null)[]>([]);
	const textRefs = useRef<(HTMLDivElement | null)[]>([]);
	const dotRefs = useRef<(HTMLDivElement | null)[]>([]);

	React.useLayoutEffect(() => {
		gsap.registerPlugin(ScrollTrigger);

		const ctx = gsap.context(() => {
			const total = REMAINING_SYSTEMS.length;
			const segment = 1 / total;

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
					end: '+=200%',
					pin: true,
					scrub: 0.5,
				},
			});

			let prevActiveDot = 0;

			REMAINING_SYSTEMS.forEach((_, localI) => {
				// originalI preserves the side alternation (system 2 → right, system 3 → left)
				const originalI = localI + 1;
				const side: Side = originalI % 2 === 0 ? 'left' : 'right';
				const imageEl = imageRefs.current[localI];
				const textEl = textRefs.current[localI];
				if (!imageEl || !textEl) return;

				const start = localI * segment;
				const isLast = localI === total - 1;

				// Dots
				if (dotRefs.current[prevActiveDot]) {
					tl.to(
						dotRefs.current[prevActiveDot],
						{ scale: 1, opacity: 0.3, duration: segment * 0.06, ease: 'none' },
						start
					);
				}
				if (dotRefs.current[localI]) {
					tl.to(
						dotRefs.current[localI],
						{ scale: 1.4, opacity: 1, duration: segment * 0.06, ease: 'none' },
						start
					);
				}
				prevActiveDot = localI;

				// Enter from below
				gsap.set(imageEl, { opacity: 0, scale: 1.35, x: 0, y: '12vh' });
				gsap.set(textEl, { opacity: 0, x: side === 'left' ? '10vw' : '-10vw', y: '6vh' });

				tl.to(
					imageEl,
					{ opacity: 1, scale: 1, x: side === 'left' ? '-12%' : '12%', y: 0, duration: segment * 0.3, ease: 'none' },
					start
				);
				tl.to(
					textEl,
					{ opacity: 1, x: 0, y: 0, duration: segment * 0.22, ease: 'none' },
					start + segment * 0.14
				);

				if (!isLast) {
					tl.to(
						imageEl,
						{ opacity: 0, scale: 0.88, x: side === 'left' ? '-20%' : '20%', y: '-6vh', duration: segment * 0.25, ease: 'none' },
						start + segment * 0.75
					);
					tl.to(
						textEl,
						{ opacity: 0, x: side === 'left' ? '-6vw' : '6vw', y: '-4vh', duration: segment * 0.2, ease: 'none' },
						start + segment * 0.78
					);
				}
			});
		}, containerRef);

		return () => ctx.revert();
	}, []);

	return (
		<div ref={containerRef} className="relative w-full h-screen bg-white dark:bg-[#020204] overflow-hidden">
			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.04),transparent_60%)]"
			/>

			{REMAINING_SYSTEMS.map((system, localI) => {
				const originalI = localI + 1;
				const side: Side = originalI % 2 === 0 ? 'left' : 'right';
				return (
					<div key={system.id} className="absolute inset-0 flex items-center">
						<div
							className={`grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center w-full max-w-7xl mx-auto px-6 ${
								side === 'right' ? 'md:[direction:rtl]' : ''
							}`}
						>
							<div
								ref={(el) => { imageRefs.current[localI] = el; }}
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

							<div
								ref={(el) => { textRefs.current[localI] = el; }}
								className="md:[direction:ltr] order-2 will-change-transform"
							>
							<div className="inline-flex items-center gap-2 mb-5">
								<span className="mono text-[11px] uppercase tracking-[0.22em] text-white/80 bg-[#0F2349] dark:bg-[#020204] px-2.5 py-1 rounded-full">
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
									<span className="transition-transform group-hover/cta:translate-x-1">→</span>
								</a>
							</div>
						</div>
					</div>
				);
			})}

			<div className="absolute right-6 top-1/2 -translate-y-1/2 hidden md:flex flex-col gap-3 z-10">
				{REMAINING_SYSTEMS.map((_, i) => (
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

			<ZoomToFirstSystem />

			<SystemsScrollReveal />
		</section>
	);
}
