'use client';

import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { SystemsSectionData } from '@/lib/types';

/* ─────────────────────────────────────────────────────────────────────────── */
/*  DATA                                                                        */
/* ─────────────────────────────────────────────────────────────────────────── */

type System = {
	id: string;
	num: string;
	label: string;
	title: string;
	description: string;
	imageUrl: string;
};

const DEFAULT_SYSTEMS: System[] = [
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
			'CRM workflows, AI agents, and email sequences that close deals while you sleep, no extra hires.',
		imageUrl:
			'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1600&auto=format&fit=crop',
	},
];

const BG_IMAGES = [
	{ src: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1280&h=720&fit=crop&crop=entropy&auto=format&q=80', alt: 'Marketing charts' },
	{ src: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=1280&h=720&fit=crop&crop=entropy&auto=format&q=80', alt: 'Data visualization' },
	{ src: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&h=800&fit=crop&crop=entropy&auto=format&q=80', alt: 'Digital marketing' },
	{ src: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1280&h=720&fit=crop&crop=entropy&auto=format&q=80', alt: 'Growth metrics' },
	{ src: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=800&h=800&fit=crop&crop=entropy&auto=format&q=80', alt: 'Web design' },
	{ src: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1280&h=720&fit=crop&crop=entropy&auto=format&q=80', alt: 'Automation' },
];

const BG_POSITION_CLASSES = [
	'[&>div]:!-top-[30vh] [&>div]:!left-[5vw] [&>div]:!h-[30vh] [&>div]:!w-[35vw]',
	'[&>div]:!-top-[10vh] [&>div]:!-left-[25vw] [&>div]:!h-[45vh] [&>div]:!w-[20vw]',
	'[&>div]:!left-[27.5vw] [&>div]:!h-[25vh] [&>div]:!w-[25vw]',
	'[&>div]:!top-[27.5vh] [&>div]:!left-[5vw] [&>div]:!h-[25vh] [&>div]:!w-[20vw]',
	'[&>div]:!top-[27.5vh] [&>div]:!-left-[22.5vw] [&>div]:!h-[25vh] [&>div]:!w-[30vw]',
	'[&>div]:!top-[22.5vh] [&>div]:!left-[25vw] [&>div]:!h-[15vh] [&>div]:!w-[15vw]',
];
const BG_MAX_SCALES = [5, 6, 5, 6, 8, 9];

/* ─────────────────────────────────────────────────────────────────────────── */
/*  TIMELINE CONSTANTS  (1 unit = 100 vh,  total = 700 vh)                    */
/* ─────────────────────────────────────────────────────────────────────────── */
const T = {
	ZOOM_END:        3,
	S1_CARD_END:     3.8,
	S1_TEXT_IN:      3.9,
	S1_EXIT:         4.3,
	DOT1_ACTIVE:     3,
	S2_ENTER:        4.8,
	S2_SETTLED:      5.6,
	DOT2_ACTIVE:     4.8,
	S2_EXIT:         6.1,
	S3_ENTER:        6.1,
	S3_SETTLED:      6.8,
	DOT3_ACTIVE:     6.1,
	END:             7,
} as const;

type Side = 'left' | 'right';

/* ─────────────────────────────────────────────────────────────────────────── */
/*  SHARED TEXT BLOCK                                                           */
/* ─────────────────────────────────────────────────────────────────────────── */
function SystemText({ system }: { system: System }) {
	return (
		<div className="relative">
			{/* Ghost number — upper-right architectural anchor, in open space above heading */}
			<span
				aria-hidden="true"
				className="mono pointer-events-none absolute -bottom-4 right-0 select-none text-[9rem] font-extrabold leading-none text-black/[0.07] dark:text-white/[0.14]"
				style={{ letterSpacing: '-0.04em' }}
			>
				{system.num}
			</span>

			{/* Eyebrow */}
			<div className="relative flex items-center gap-3 mb-6">
				<span className="h-px w-8 flex-none bg-[#0F2349]/20 dark:bg-white/20" />
				<span className="mono text-[13px] font-semibold uppercase tracking-[0.18em] text-[#0F2349]/55 dark:text-white/50">
					{system.label}
				</span>
			</div>

			{/* Heading */}
			<h3
				className="mb-5 text-[36px] font-extrabold leading-[1.03] tracking-[-0.04em] text-[var(--navy-900)] md:text-[58px]"
				style={{ whiteSpace: 'pre-line' }}
			>
				{system.title}
			</h3>

			{/* Description */}
			<p className="mb-8 max-w-[420px] text-[15px] leading-[1.78] text-[var(--muted)] dark:text-white/55 md:text-[16.5px]">
				{system.description}
			</p>

			{/* CTA */}
			<a
				href="#cta"
				className="group/btn inline-flex items-center gap-3 pl-6 pr-2 py-2 rounded-full text-[13px] font-semibold text-white bg-[#0F2349] dark:bg-white dark:text-[#050E1E] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--teal-500)] focus-visible:ring-offset-2"
			>
				<span>Explore Your System</span>
				<span className="w-8 h-8 rounded-full bg-black/10 flex items-center justify-center transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover/btn:translate-x-1 group-hover/btn:-translate-y-[1px] group-hover/btn:scale-105">
					<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
						<path d="M7 17 17 7" />
						<path d="M7 7h10v10" />
					</svg>
				</span>
			</a>
		</div>
	);
}

/* ─────────────────────────────────────────────────────────────────────────── */
/*  GRID CARD WRAPPER  (shared layout for all 3 systems)                       */
/* ─────────────────────────────────────────────────────────────────────────── */
function SystemGridCard({
	system,
	side,
	imgRef,
	textRef,
}: {
	system: System;
	side: Side;
	imgRef: React.RefCallback<HTMLDivElement>;
	textRef: React.RefCallback<HTMLDivElement>;
}) {
	return (
		<div className="absolute inset-0 flex items-center">
			<div
				className={`grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center w-full max-w-7xl mx-auto px-6 ${
					side === 'right' ? 'md:[direction:rtl]' : ''
				}`}
			>
				{/* Image column */}
				<div ref={imgRef} className="md:[direction:ltr] order-1 will-change-transform">
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

				{/* Text column */}
				<div ref={textRef} className="md:[direction:ltr] order-2 will-change-transform">
					<SystemText system={system} />
				</div>
			</div>
		</div>
	);
}

/* ─────────────────────────────────────────────────────────────────────────── */
/*  MAIN SECTION                                                                */
/* ─────────────────────────────────────────────────────────────────────────── */
function SystemsSection({ systems }: { systems: System[] }) {
	const outerRef = useRef<HTMLDivElement>(null);

	const bgWrapperRef = useRef<HTMLDivElement>(null);
	const bgRefs       = useRef<(HTMLDivElement | null)[]>([]);

	const s1OverlayRef = useRef<HTMLDivElement>(null);
	const s1CardBoxRef = useRef<HTMLDivElement>(null);

	const s1GridImgRef  = useRef<HTMLDivElement>(null);
	const s1GridTextRef = useRef<HTMLDivElement>(null);

	const imgRefs  = useRef<(HTMLDivElement | null)[]>([]);
	const textRefs = useRef<(HTMLDivElement | null)[]>([]);
	const dotRefs  = useRef<(HTMLDivElement | null)[]>([]);

	React.useLayoutEffect(() => {
		gsap.registerPlugin(ScrollTrigger);

		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
			gsap.set([s1GridImgRef.current, s1GridTextRef.current], { opacity: 1, x: 0 });
			imgRefs.current.forEach((el) => el && gsap.set(el, { opacity: 1, scale: 1, x: 0, y: 0 }));
			textRefs.current.forEach((el) => el && gsap.set(el, { opacity: 1, x: 0, y: 0 }));
			dotRefs.current.forEach((el) => el && gsap.set(el, { opacity: 1, scale: 1 }));
			return;
		}

		const ctx = gsap.context(() => {

			const gridImgEl   = s1GridImgRef.current;
			const gridImgRect = gridImgEl?.getBoundingClientRect();
			const vw          = window.innerWidth;
			const colWidth    = gridImgRect?.width ?? vw * 0.4;
			const s1XShift = gridImgRect
				? (gridImgRect.left + gridImgRect.width / 2) - vw / 2 - colWidth * 0.12
				: -vw * 0.345;

			const tl = gsap.timeline({
				scrollTrigger: {
					trigger: outerRef.current,
					start: 'top top',
					end: 'bottom bottom',
					scrub: 0.6,
				},
			});

			gsap.set(dotRefs.current, { scale: 1, opacity: 0.3 });
			gsap.set(s1GridImgRef.current,  { opacity: 0 });
			gsap.set(s1GridTextRef.current, { opacity: 0, x: 50 });

			bgRefs.current.forEach((el, i) => {
				if (!el) return;
				gsap.set(el, { scale: 1, transformOrigin: 'center center' });
				tl.to(el, { scale: BG_MAX_SCALES[i], ease: 'none', duration: T.ZOOM_END }, 0);
			});
			tl.to(bgWrapperRef.current, { opacity: 0, ease: 'none', duration: 0.5 }, T.ZOOM_END - 0.6);

			gsap.set(s1OverlayRef.current, { scale: 0.3, x: 0, opacity: 1, transformOrigin: 'center center' });
			gsap.set(s1CardBoxRef.current, { borderRadius: 0 });
			tl.to(s1OverlayRef.current, { scale: 2.5, ease: 'none', duration: T.ZOOM_END }, 0);

			tl.to(dotRefs.current[0], { scale: 1.4, opacity: 1, ease: 'none', duration: 0.2 }, T.DOT1_ACTIVE);

			tl.to(s1OverlayRef.current, {
				scale: 1,
				x:     s1XShift,
				ease:  'none',
				duration: T.S1_CARD_END - T.ZOOM_END,
			}, T.ZOOM_END);

			tl.to(s1CardBoxRef.current, {
				borderRadius: 28,
				ease:         'none',
				duration:     T.S1_CARD_END - T.ZOOM_END,
			}, T.ZOOM_END);

			tl.to(s1GridTextRef.current, { opacity: 1, x: 0, ease: 'none', duration: 0.35 }, T.S1_TEXT_IN);

			tl.to(s1OverlayRef.current, {
				opacity: 0, scale: 0.88, x: s1XShift - colWidth * 0.2, y: '-6vh',
				ease: 'none', duration: 0.5,
			}, T.S1_EXIT);
			tl.to(s1GridTextRef.current, {
				opacity: 0, x: -40, y: '-4vh',
				ease: 'none', duration: 0.4,
			}, T.S1_EXIT + 0.1);

			tl.to(dotRefs.current[0], { scale: 1,   opacity: 0.3, ease: 'none', duration: 0.2 }, T.DOT2_ACTIVE);
			tl.to(dotRefs.current[1], { scale: 1.4, opacity: 1,   ease: 'none', duration: 0.2 }, T.DOT2_ACTIVE);

			const img2  = imgRefs.current[0];
			const text2 = textRefs.current[0];
			if (img2 && text2) {
				gsap.set(img2,  { opacity: 0, scale: 1.35, x: 0, y: '12vh' });
				gsap.set(text2, { opacity: 0, x: '-10vw', y: '6vh' });

				tl.to(img2,  { opacity: 1, scale: 1, x: '12%', y: 0, ease: 'none', duration: 0.8 }, T.S2_ENTER);
				tl.to(text2, { opacity: 1, x: 0,    y: 0,      ease: 'none', duration: 0.6 },        T.S2_ENTER + 0.4);
			}

			if (img2 && text2) {
				tl.to(img2,  { opacity: 0, scale: 0.88, x: '20%', y: '-6vh', ease: 'none', duration: 0.5 }, T.S2_EXIT);
				tl.to(text2, { opacity: 0, x: '6vw',   y: '-4vh', ease: 'none', duration: 0.4 },            T.S2_EXIT + 0.1);
			}

			tl.to(dotRefs.current[1], { scale: 1,   opacity: 0.3, ease: 'none', duration: 0.2 }, T.DOT3_ACTIVE);
			tl.to(dotRefs.current[2], { scale: 1.4, opacity: 1,   ease: 'none', duration: 0.2 }, T.DOT3_ACTIVE);

			const img3  = imgRefs.current[1];
			const text3 = textRefs.current[1];
			if (img3 && text3) {
				gsap.set(img3,  { opacity: 0, scale: 1.35, x: 0, y: '12vh' });
				gsap.set(text3, { opacity: 0, x: '10vw',  y: '6vh' });

				tl.to(img3,  { opacity: 1, scale: 1, x: '-12%', y: 0, ease: 'none', duration: 0.8 }, T.S3_ENTER);
				tl.to(text3, { opacity: 1, x: 0,     y: 0,      ease: 'none', duration: 0.6 },        T.S3_ENTER + 0.4);
			}

			tl.to({}, { duration: T.END - T.S3_SETTLED }, T.S3_SETTLED);

		}, outerRef);

		return () => ctx.revert();
	}, []);

	return (
		<div ref={outerRef} className="relative h-[700vh] w-full">

			<div className="sticky top-0 h-screen w-full overflow-hidden bg-white dark:bg-[#020204]">

				{/* ── Decorative background zoom images ── */}
				<div ref={bgWrapperRef} className="absolute inset-0">
					{BG_IMAGES.map((img, i) => (
						<div
							key={i}
							ref={(el) => { bgRefs.current[i] = el; }}
							className={`absolute inset-0 flex h-full w-full items-center justify-center ${BG_POSITION_CLASSES[i]}`}
						>
							<div className="relative h-[25vh] w-[25vw]">
								<img src={img.src} alt={img.alt} className="h-full w-full object-cover" />
							</div>
						</div>
					))}
				</div>

				{/* ── System 1 zoom overlay ── */}
				<div
					ref={s1OverlayRef}
					className="absolute inset-0 z-10 flex h-full w-full items-center justify-center will-change-transform"
				>
					<div
						ref={s1CardBoxRef}
						className="overflow-hidden h-[62vh] w-[40vw] border border-[var(--line)] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.35)]"
					>
						<img
							src={systems[0].imageUrl}
							alt={systems[0].label}
							className="h-full w-full object-cover"
						/>
					</div>
				</div>

				{/* ── System 1 — grid card ── */}
				<SystemGridCard
					system={systems[0]}
					side="left"
					imgRef={(el) => { s1GridImgRef.current = el; }}
					textRef={(el) => { s1GridTextRef.current = el; }}
				/>

				{/* ── Systems 2 & 3 — grid cards ── */}
				{systems.slice(1).map((system, localI) => {
					const originalI = localI + 1;
					const side: Side = originalI % 2 === 0 ? 'left' : 'right';
					return (
						<SystemGridCard
							key={system.id}
							system={system}
							side={side}
							imgRef={(el) => { imgRefs.current[localI] = el; }}
							textRef={(el) => { textRefs.current[localI] = el; }}
						/>
					);
				})}

				{/* ── Dot indicators ── */}
				<div className="absolute right-6 top-1/2 -translate-y-1/2 hidden md:flex flex-col gap-3 z-20" role="tablist" aria-label="Systems">
					{systems.map((system, i) => (
						<div
							key={i}
							ref={(el) => { dotRefs.current[i] = el; }}
							className="h-2 w-2 rounded-full bg-[var(--teal-500)] will-change-transform"
							role="tab"
							aria-label={system.label}
						/>
					))}
				</div>

			</div>
		</div>
	);
}

/* ─────────────────────────────────────────────────────────────────────────── */
/*  MOBILE FALLBACK                                                             */
/* ─────────────────────────────────────────────────────────────────────────── */
function MobileSystemsSection({ systems }: { systems: System[] }) {
	return (
		<div className="md:hidden bg-white dark:bg-[#020204] py-12 px-6">
			{systems.map((system) => (
				<div key={system.id} className="mb-16 last:mb-0">
					<div className="overflow-hidden rounded-[28px] border border-[var(--line)] mb-6 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.25)]">
						<img
							src={system.imageUrl}
							alt={system.label}
							className="w-full h-[240px] sm:h-[300px] object-cover"
							loading="lazy"
							decoding="async"
						/>
					</div>
					<SystemText system={system} />
				</div>
			))}
		</div>
	);
}

/* ─────────────────────────────────────────────────────────────────────────── */
/*  EXPORT                                                                      */
/* ─────────────────────────────────────────────────────────────────────────── */
export default function SystemsZoomSection({ data }: { data?: SystemsSectionData }) {
	const eyebrow       = data?.eyebrow       ?? '/ our systems'
	const headline      = data?.headline      ?? 'Three systems.'
	const headlineAccent = data?.headlineAccent ?? 'One growth machine.'
	const systems: System[] = data?.systems?.length
		? (data.systems as System[])
		: DEFAULT_SYSTEMS

	return (
		<section id="systems">
			<div className="relative flex h-[50vh] items-center justify-center overflow-hidden bg-white dark:bg-[#020204]">
				<div className="text-center px-6">
					<div className="mono text-[13px] uppercase tracking-[0.22em] text-[var(--teal-500)] mb-4">
						{eyebrow}
					</div>
					<h2 className="text-[32px] sm:text-[44px] md:text-[64px] font-extrabold tracking-[-0.04em] text-[var(--navy-900)] leading-[1.02]">
						{headline}
						<span className="block text-[var(--teal-500)]">{headlineAccent}</span>
					</h2>
				</div>
			</div>

			{/* Desktop: animated zoom scroll */}
			<div className="hidden md:block">
				<SystemsSection systems={systems} />
			</div>

			{/* Mobile: simple stacked cards */}
			<MobileSystemsSection systems={systems} />
		</section>
	);
}
