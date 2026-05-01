'use client';

import { useScroll, useTransform, motion } from 'motion/react';
import { useRef } from 'react';

interface Image {
	src: string;
	alt?: string;
}

interface ZoomParallaxProps {
	/** Array of images to be displayed in the parallax effect max 7 images */
	images: Image[];
}

export function ZoomParallax({ images }: ZoomParallaxProps) {
	const container = useRef<HTMLDivElement>(null);
	const { scrollYProgress } = useScroll({
		target: container,
		offset: ['start start', 'end end'],
	});

	// Scales animate over the first 75% of scroll, then hold at peak
	const scale4 = useTransform(scrollYProgress, [0, 0.75], [1, 4]);
	const scale5 = useTransform(scrollYProgress, [0, 0.75], [1, 5]);
	const scale6 = useTransform(scrollYProgress, [0, 0.75], [1, 6]);
	const scale8 = useTransform(scrollYProgress, [0, 0.75], [1, 8]);
	const scale9 = useTransform(scrollYProgress, [0, 0.75], [1, 9]);

	// Center image (index 0) fades out over the last 25% of scroll
	const centerOpacity = useTransform(scrollYProgress, [0.78, 1.0], [1, 0]);

	const scales = [scale4, scale5, scale6, scale5, scale6, scale8, scale9];

	const positionClasses = [
		'', // index 0 - center
		'[&>div]:!-top-[30vh] [&>div]:!left-[5vw] [&>div]:!h-[30vh] [&>div]:!w-[35vw]',
		'[&>div]:!-top-[10vh] [&>div]:!-left-[25vw] [&>div]:!h-[45vh] [&>div]:!w-[20vw]',
		'[&>div]:!left-[27.5vw] [&>div]:!h-[25vh] [&>div]:!w-[25vw]',
		'[&>div]:!top-[27.5vh] [&>div]:!left-[5vw] [&>div]:!h-[25vh] [&>div]:!w-[20vw]',
		'[&>div]:!top-[27.5vh] [&>div]:!-left-[22.5vw] [&>div]:!h-[25vh] [&>div]:!w-[30vw]',
		'[&>div]:!top-[22.5vh] [&>div]:!left-[25vw] [&>div]:!h-[15vh] [&>div]:!w-[15vw]',
	];

	return (
		// Extended to 400vh: 300vh for zoom, 100vh for the full-screen hold + fade-out
		<div ref={container} className="relative h-[400vh] w-full">
			<div className="sticky top-0 h-screen w-full overflow-hidden">
				{images.map(({ src, alt }, index) => {
					const scale = scales[index % scales.length];
					const posClass = positionClasses[index] ?? '';
					const opacity = index === 0 ? centerOpacity : undefined;

					return (
						<motion.div
							key={index}
							style={{
								scale,
								opacity,
								transformOrigin: 'center center',
								willChange: 'transform',
							}}
							className={`absolute inset-0 flex h-full w-full items-center justify-center ${posClass}`}
						>
							<div className="relative h-[25vh] w-[25vw]">
								<img
									src={src || '/placeholder.svg'}
									alt={alt || `Parallax image ${index + 1}`}
									className="h-full w-full object-cover"
								/>
							</div>
						</motion.div>
					);
				})}
			</div>
		</div>
	);
}
