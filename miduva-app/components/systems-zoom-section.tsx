'use client';

import React from 'react';
import { ZoomParallax } from '@/components/ui/zoom-parallax';
import { motion } from 'motion/react';

const SYSTEMS = [
	{
		id: 'lead-gen',
		num: '01',
		label: 'Lead Generation System',
		title: 'Consistent leads.\nOn autopilot.',
		description:
			'Generate predictable lead flow using ads, funnels & precision conversion systems built for your market.',
		imageUrl:
			'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop',
	},
	{
		id: 'website-conversion',
		num: '02',
		label: 'Website & Conversion System',
		title: 'Your website,\nactually converting.',
		description:
			'Turn traffic into revenue with a high-performance site engineered around your buyer\'s journey.',
		imageUrl:
			'https://images.unsplash.com/photo-1547658719-da2b51169166?q=80&w=1200&auto=format&fit=crop',
	},
	{
		id: 'automation',
		num: '03',
		label: 'Smart Automation System',
		title: 'Sales & follow-ups running 24/7 — without hiring.',
		description:
			'CRM workflows, AI agents, and email sequences that close deals while you sleep.',
		imageUrl:
			'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1600&auto=format&fit=crop',
	},
];

const PARALLAX_IMAGES = [
	{
		src: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1280&h=720&fit=crop&crop=entropy&auto=format&q=80',
		alt: 'Modern architecture building',
	},
	{
		src: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1280&h=720&fit=crop&crop=entropy&auto=format&q=80',
		alt: 'Urban cityscape at sunset',
	},
	{
		src: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=800&h=800&fit=crop&crop=entropy&auto=format&q=80',
		alt: 'Abstract geometric pattern',
	},
	{
		src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1280&h=720&fit=crop&crop=entropy&auto=format&q=80',
		alt: 'Mountain landscape',
	},
	{
		src: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&h=800&fit=crop&crop=entropy&auto=format&q=80',
		alt: 'Minimalist design elements',
	},
	{
		src: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=1280&h=720&fit=crop&crop=entropy&auto=format&q=80',
		alt: 'Ocean waves and beach',
	},
	{
		src: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1280&h=720&fit=crop&crop=entropy&auto=format&q=80',
		alt: 'Forest trees and sunlight',
	},
];

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

			{/* Zoom parallax effect */}
			<ZoomParallax images={PARALLAX_IMAGES} />

			{/* Systems list after effect */}
			<div className="max-w-6xl mx-auto px-6 py-20 md:py-28">
				<div className="flex flex-col gap-20 md:gap-28">
					{SYSTEMS.map((system, index) => (
						<motion.div
							key={system.id}
							initial={{ opacity: 0, y: 60 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true, margin: '-100px' }}
							transition={{ duration: 0.7, delay: 0.1 }}
							className={`grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-14 items-center ${
								index % 2 === 1 ? 'md:[direction:rtl]' : ''
							}`}
						>
							{/* Image */}
							<div className="overflow-hidden rounded-[24px] border border-[var(--line)] md:[direction:ltr]">
								<img
									src={system.imageUrl}
									alt={system.label}
									className="w-full h-[280px] md:h-[380px] object-cover"
									loading="lazy"
									decoding="async"
								/>
							</div>

							{/* Content */}
							<div className="md:[direction:ltr]">
								<div className="inline-flex items-center gap-2 mb-4">
									<span className="mono text-[11px] uppercase tracking-[0.22em] text-white/70 bg-[var(--navy-900)] px-2.5 py-1 rounded-full">
										{system.num}
									</span>
									<span className="w-4 h-px bg-[var(--muted)]" />
									<span className="mono text-[11px] uppercase tracking-[0.18em] text-[var(--teal-500)] font-semibold">
										{system.label}
									</span>
								</div>

								<h3
									className="text-[28px] md:text-[40px] font-extrabold text-[var(--navy-900)] tracking-[-0.03em] leading-[1.1] mb-4"
									style={{ whiteSpace: 'pre-line' }}
								>
									{system.title}
								</h3>

								<p className="text-[15px] text-[var(--muted)] leading-[1.7] mb-6 max-w-[480px]">
									{system.description}
								</p>

								<a
									href="#cta"
									className="inline-flex items-center gap-2 text-[13px] font-semibold text-[var(--teal-500)] hover:text-[var(--navy-900)] transition-colors group/cta"
								>
									<span className="px-4 py-2 rounded-full border border-[var(--teal-500)]/40 bg-[var(--teal-500)]/10 backdrop-blur-sm group-hover/cta:bg-[var(--teal-500)]/25 transition-colors">
										Explore Your System
									</span>
									<span className="transition-transform group-hover/cta:translate-x-1">
										→
									</span>
								</a>
							</div>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	);
}
