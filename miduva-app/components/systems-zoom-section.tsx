'use client';

import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

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
//
//   0 ──── 3   : Zoom phase  (300 vh)
//   3 ── 3.8   : S1 card transition — overlay shrinks to grid position
//   3.6 ─ 4.0  : Crossfade overlay → grid card  (same image, invisible seam)
//   3.8 ─ 4.3  : S1 visible as proper grid card + text
//   4.3 ─ 4.8  : S1 exits
//   4.8 ─ 5.6  : S2 enters  (no overlap with S1)
//   5.6 ─ 6.2  : S2 exits / S3 enters
//   6.8         : S3 settled → pad to 7
//
const T = {
	ZOOM_END:        3,
	S1_CARD_END:     3.8,
	S1_CROSSFADE:    3.6,   // start crossfade overlay → grid
	S1_TEXT_IN:      3.75,
	S1_EXIT:         4.3,
	S1_GONE:         4.8,
	DOT1_ACTIVE:     3,
	S2_ENTER:        4.8,   // starts only AFTER S1 is gone
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
		<>
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
				<span className="transition-transform group-hover/cta:translate-x-1">→</span>
			</a>
		</>
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
function SystemsSection() {
	const outerRef = useRef<HTMLDivElement>(null);

	// Background images
	const bgWrapperRef = useRef<HTMLDivElement>(null);
	const bgRefs       = useRef<(HTMLDivElement | null)[]>([]);

	// System 1 zoom overlay  (absolute inset-0 wrapper that handles the zoom)
	const s1OverlayRef = useRef<HTMLDivElement>(null);
	const s1CardBoxRef = useRef<HTMLDivElement>(null); // border-radius animated

	// System 1 grid card  (same DOM structure as Systems 2 & 3)
	const s1GridImgRef  = useRef<HTMLDivElement>(null);
	const s1GridTextRef = useRef<HTMLDivElement>(null);

	// Systems 2 & 3
	const imgRefs  = useRef<(HTMLDivElement | null)[]>([]);
	const textRefs = useRef<(HTMLDivElement | null)[]>([]);
	const dotRefs  = useRef<(HTMLDivElement | null)[]>([]);

	React.useLayoutEffect(() => {
		gsap.registerPlugin(ScrollTrigger);

		const ctx = gsap.context(() => {

			/* ── Measure System 1 grid column to align overlay precisely ── */
			// getBoundingClientRect works inside useLayoutEffect (after paint).
			const gridImgEl   = s1GridImgRef.current;
			const gridImgRect = gridImgEl?.getBoundingClientRect();
			const vw          = window.innerWidth;
			const colWidth    = gridImgRect?.width ?? vw * 0.4;
			// Grid column center relative to viewport center, PLUS the -12% settled offset
			// so the overlay lands exactly on top of the grid image when the crossfade fires.
			const s1XShift = gridImgRect
				? (gridImgRect.left + gridImgRect.width / 2) - vw / 2 - colWidth * 0.12
				: -vw * 0.345; // fallback (~-22.5vw column + ~-12% offset)

			/* ── Single timeline driven by outer scroll container ── */
			const tl = gsap.timeline({
				scrollTrigger: {
					trigger: outerRef.current,
					start: 'top top',
					end: 'bottom bottom',
					scrub: 0.6,
				},
			});

			/* ── Initial states ── */
			gsap.set(dotRefs.current, { scale: 1, opacity: 0.3 });
			// x: '-12%' matches the settled position of a left-side system (same as System 3).
			// The overlay is aligned to this offset position so crossfade is seamless.
			gsap.set(s1GridImgRef.current,  { opacity: 0, x: '-12%' });
			gsap.set(s1GridTextRef.current, { opacity: 0, x: 50 });

			/* ════════════════════════════════════════════════════════
			   PHASE 1  –  ZOOM  [0 → 3]
			   All background images + System 1 overlay zoom in.
			════════════════════════════════════════════════════════ */

			bgRefs.current.forEach((el, i) => {
				if (!el) return;
				gsap.set(el, { scale: 1, transformOrigin: 'center center' });
				tl.to(el, { scale: BG_MAX_SCALES[i], ease: 'none', duration: T.ZOOM_END }, 0);
			});
			// Bg images fade out just before zoom ends
			tl.to(bgWrapperRef.current, { opacity: 0, ease: 'none', duration: 0.5 }, T.ZOOM_END - 0.6);

			// System 1 overlay: starts as a small centered dot, zooms to fill screen
			gsap.set(s1OverlayRef.current, { scale: 0.3, x: 0, opacity: 1, transformOrigin: 'center center' });
			gsap.set(s1CardBoxRef.current, { borderRadius: 0 });
			tl.to(s1OverlayRef.current, { scale: 2.5, ease: 'none', duration: T.ZOOM_END }, 0);

			/* ════════════════════════════════════════════════════════
			   PHASE 2  –  SYSTEM 1 CARD TRANSITION  [3 → 3.8]
			   Overlay shrinks to the grid column position.
			════════════════════════════════════════════════════════ */

			// Dot 1 activates
			tl.to(dotRefs.current[0], { scale: 1.4, opacity: 1, ease: 'none', duration: 0.2 }, T.DOT1_ACTIVE);

			// Shrink overlay from full-screen to card, shift to grid left-column position
			tl.to(s1OverlayRef.current, {
				scale: 1,
				x:     s1XShift,
				ease:  'none',
				duration: T.S1_CARD_END - T.ZOOM_END,
			}, T.ZOOM_END);

			// Grow border-radius in sync
			tl.to(s1CardBoxRef.current, {
				borderRadius: 28,
				ease:         'none',
				duration:     T.S1_CARD_END - T.ZOOM_END,
			}, T.ZOOM_END);

			/* ────────────────────────────────────────────────────────
			   Crossfade: overlay ⟶ grid card  [3.6 → 4.0]
			   Both show the same image → visually seamless.
			──────────────────────────────────────────────────────── */
			tl.to(s1OverlayRef.current,  { opacity: 0, ease: 'none', duration: 0.4 }, T.S1_CROSSFADE);
			tl.to(s1GridImgRef.current,  { opacity: 1, ease: 'none', duration: 0.4 }, T.S1_CROSSFADE);

			// Text slides in
			tl.to(s1GridTextRef.current, { opacity: 1, x: 0, ease: 'none', duration: 0.45 }, T.S1_TEXT_IN);

			/* ════════════════════════════════════════════════════════
			   PHASE 3  –  SYSTEM 1 EXIT  [4.3 → 4.8]
			════════════════════════════════════════════════════════ */
			tl.to(s1GridImgRef.current, {
				opacity: 0, scale: 0.88, x: '-20%', y: '-6vh',
				ease: 'none', duration: 0.5,
			}, T.S1_EXIT);
			tl.to(s1GridTextRef.current, {
				opacity: 0, x: -40, y: '-4vh',
				ease: 'none', duration: 0.4,
			}, T.S1_EXIT + 0.1);

			/* ════════════════════════════════════════════════════════
			   PHASE 4  –  SYSTEM 2 ENTER  [4.8 → 5.6]
			   Starts only AFTER System 1 is fully gone (T.S1_GONE = 4.8)
			════════════════════════════════════════════════════════ */

			// Dot: 1 → 2
			tl.to(dotRefs.current[0], { scale: 1,   opacity: 0.3, ease: 'none', duration: 0.2 }, T.DOT2_ACTIVE);
			tl.to(dotRefs.current[1], { scale: 1.4, opacity: 1,   ease: 'none', duration: 0.2 }, T.DOT2_ACTIVE);

			const img2  = imgRefs.current[0];
			const text2 = textRefs.current[0];
			if (img2 && text2) {
				// System 2 is at originalIndex=1 → side='right' → image on right
				gsap.set(img2,  { opacity: 0, scale: 1.35, x: 0, y: '12vh' });
				gsap.set(text2, { opacity: 0, x: '-10vw', y: '6vh' });

				tl.to(img2,  { opacity: 1, scale: 1, x: '12%', y: 0, ease: 'none', duration: 0.8 }, T.S2_ENTER);
				tl.to(text2, { opacity: 1, x: 0,    y: 0,      ease: 'none', duration: 0.6 },        T.S2_ENTER + 0.4);
			}

			/* ════════════════════════════════════════════════════════
			   PHASE 5  –  SYSTEM 2 EXIT / SYSTEM 3 ENTER  [6.1 → 6.8]
			════════════════════════════════════════════════════════ */
			if (img2 && text2) {
				tl.to(img2,  { opacity: 0, scale: 0.88, x: '20%', y: '-6vh', ease: 'none', duration: 0.5 }, T.S2_EXIT);
				tl.to(text2, { opacity: 0, x: '6vw',   y: '-4vh', ease: 'none', duration: 0.4 },            T.S2_EXIT + 0.1);
			}

			// Dot: 2 → 3
			tl.to(dotRefs.current[1], { scale: 1,   opacity: 0.3, ease: 'none', duration: 0.2 }, T.DOT3_ACTIVE);
			tl.to(dotRefs.current[2], { scale: 1.4, opacity: 1,   ease: 'none', duration: 0.2 }, T.DOT3_ACTIVE);

			const img3  = imgRefs.current[1];
			const text3 = textRefs.current[1];
			if (img3 && text3) {
				// System 3 is at originalIndex=2 → side='left'
				gsap.set(img3,  { opacity: 0, scale: 1.35, x: 0, y: '12vh' });
				gsap.set(text3, { opacity: 0, x: '10vw',  y: '6vh' });

				tl.to(img3,  { opacity: 1, scale: 1, x: '-12%', y: 0, ease: 'none', duration: 0.8 }, T.S3_ENTER);
				tl.to(text3, { opacity: 1, x: 0,     y: 0,      ease: 'none', duration: 0.6 },        T.S3_ENTER + 0.4);
			}

			/* Pad timeline to END so ScrollTrigger maps correctly */
			tl.to({}, { duration: T.END - T.S3_SETTLED }, T.S3_SETTLED);

		}, outerRef);

		return () => ctx.revert();
	}, []);

	/* ─────────────────────────────────────────────────────────────────────── */
	/*  RENDER                                                                   */
	/* ─────────────────────────────────────────────────────────────────────── */
	return (
		/* 700 vh outer — provides scrollable distance; inner is sticky via CSS */
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

				{/* ── System 1 zoom overlay ──
				    Sits above everything during zoom, crossfades to grid card once
				    it reaches the grid column position. z-10 keeps it on top. */}
				<div
					ref={s1OverlayRef}
					className="absolute inset-0 z-10 flex h-full w-full items-center justify-center will-change-transform"
				>
					<div
						ref={s1CardBoxRef}
						className="overflow-hidden h-[62vh] w-[40vw] border border-[var(--line)] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.35)]"
					>
						<img
							src={SYSTEMS[0].imageUrl}
							alt={SYSTEMS[0].label}
							className="h-full w-full object-cover"
						/>
					</div>
				</div>

				{/* ── System 1 — grid card (same structure as 2 & 3) ──
				    Initially hidden; crossfades in from the overlay. */}
				<SystemGridCard
					system={SYSTEMS[0]}
					side="left"
					imgRef={(el) => { s1GridImgRef.current = el; }}
					textRef={(el) => { s1GridTextRef.current = el; }}
				/>

				{/* ── Systems 2 & 3 — grid cards ── */}
				{SYSTEMS.slice(1).map((system, localI) => {
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

				{/* ── Dot indicators (3 dots, one per system) ── */}
				<div className="absolute right-6 top-1/2 -translate-y-1/2 hidden md:flex flex-col gap-3 z-20">
					{SYSTEMS.map((_, i) => (
						<div
							key={i}
							ref={(el) => { dotRefs.current[i] = el; }}
							className="h-2 w-2 rounded-full bg-[var(--teal-500)] will-change-transform"
						/>
					))}
				</div>

			</div>
		</div>
	);
}

/* ─────────────────────────────────────────────────────────────────────────── */
/*  EXPORT                                                                      */
/* ─────────────────────────────────────────────────────────────────────────── */
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

			<SystemsSection />
		</section>
	);
}
