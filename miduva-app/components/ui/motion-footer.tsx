"use client";

import * as React from "react";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";
import { Phone, ArrowRight } from "lucide-react";
import type { FooterData } from "@/lib/types";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800;900&display=swap');

.cinematic-footer-wrapper {
  font-family: 'Plus Jakarta Sans', sans-serif;
  -webkit-font-smoothing: antialiased;

  /*
   * Bridge project tokens → generic names used throughout this component.
   * Tailwind v4 exposes colors as utility classes (text-foreground → var(--color-foreground))
   * but does NOT define bare --foreground / --background as CSS custom properties.
   * This project uses --ink / --paper instead (defined in globals.css :root and html.dark).
   */
  --foreground: var(--ink);
  --background: var(--paper);

  --pill-bg-1: color-mix(in oklch, var(--foreground) 3%, transparent);
  --pill-bg-2: color-mix(in oklch, var(--foreground) 1%, transparent);
  --pill-shadow: color-mix(in oklch, var(--background) 50%, transparent);
  --pill-highlight: color-mix(in oklch, var(--foreground) 10%, transparent);
  --pill-inset-shadow: color-mix(in oklch, var(--background) 80%, transparent);
  --pill-border: color-mix(in oklch, var(--foreground) 8%, transparent);

  --pill-bg-1-hover: color-mix(in oklch, var(--foreground) 8%, transparent);
  --pill-bg-2-hover: color-mix(in oklch, var(--foreground) 2%, transparent);
  --pill-border-hover: color-mix(in oklch, var(--foreground) 20%, transparent);
  --pill-shadow-hover: color-mix(in oklch, var(--background) 70%, transparent);
  --pill-highlight-hover: color-mix(in oklch, var(--foreground) 20%, transparent);
}

@keyframes footer-breathe {
  0%   { transform: translate(-50%, -50%) scale(1);   opacity: 0.6; }
  100% { transform: translate(-50%, -50%) scale(1.1); opacity: 1;   }
}

@keyframes footer-scroll-marquee {
  from { transform: translateX(0);    }
  to   { transform: translateX(-50%); }
}

@keyframes footer-heartbeat {
  0%, 100% { transform: scale(1);   filter: drop-shadow(0 0 5px  color-mix(in oklch, var(--destructive) 50%, transparent)); }
  15%, 45% { transform: scale(1.2); filter: drop-shadow(0 0 10px color-mix(in oklch, var(--destructive) 80%, transparent)); }
  30%      { transform: scale(1);   }
}

.animate-footer-breathe        { animation: footer-breathe        8s ease-in-out infinite alternate; }
.animate-footer-scroll-marquee { animation: footer-scroll-marquee 40s linear infinite; }
.animate-footer-heartbeat      { animation: footer-heartbeat      2s cubic-bezier(0.25, 1, 0.5, 1) infinite; }

.footer-bg-grid {
  background-size: 60px 60px;
  background-image:
    linear-gradient(to right,  color-mix(in oklch, var(--foreground) 3%, transparent) 1px, transparent 1px),
    linear-gradient(to bottom, color-mix(in oklch, var(--foreground) 3%, transparent) 1px, transparent 1px);
  mask-image: linear-gradient(to bottom, transparent, black 30%, black 70%, transparent);
  -webkit-mask-image: linear-gradient(to bottom, transparent, black 30%, black 70%, transparent);
}

.footer-aurora {
  background: radial-gradient(
    circle at 50% 50%,
    color-mix(in oklch, var(--teal-500) 25%, transparent) 0%,
    color-mix(in oklch, var(--navy-600) 20%, transparent) 45%,
    transparent 70%
  );
}

.footer-glass-pill {
  background: linear-gradient(145deg, var(--pill-bg-1) 0%, var(--pill-bg-2) 100%);
  box-shadow:
    0 10px 30px -10px var(--pill-shadow),
    inset 0 1px 1px var(--pill-highlight),
    inset 0 -1px 2px var(--pill-inset-shadow);
  border: 1px solid var(--pill-border);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.footer-glass-pill:hover {
  background: linear-gradient(145deg, var(--pill-bg-1-hover) 0%, var(--pill-bg-2-hover) 100%);
  border-color: var(--pill-border-hover);
  box-shadow:
    0 20px 40px -10px var(--pill-shadow-hover),
    inset 0 1px 1px var(--pill-highlight-hover);
  color: var(--foreground);
}

.footer-giant-bg-text {
  font-size: 26vw;
  line-height: 0.75;
  font-weight: 900;
  letter-spacing: -0.05em;
  color: transparent;
  -webkit-text-stroke: 1px color-mix(in oklch, var(--foreground) 10%, transparent);
  background: linear-gradient(180deg, color-mix(in oklch, var(--foreground) 15%, transparent) 0%, transparent 60%);
  -webkit-background-clip: text;
  background-clip: text;
}

/* filter: drop-shadow is intentionally removed — applying filter to an element
   with -webkit-text-fill-color: transparent + background-clip: text moves it to
   an isolated compositor layer where the clipped gradient does not paint,
   making the text invisible (visually empty but selectable). */
.footer-text-glow {
  background: linear-gradient(180deg, var(--foreground) 0%, color-mix(in oklch, var(--foreground) 50%, transparent) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
`;

export type MagneticButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    as?: React.ElementType;
  };

const MagneticButton = React.forwardRef<HTMLElement, MagneticButtonProps>(
  ({ className, children, as: Component = "button", ...props }, forwardedRef) => {
    const localRef = useRef<HTMLElement>(null);

    useEffect(() => {
      if (typeof window === "undefined") return;
      const element = localRef.current;
      if (!element) return;

      const ctx = gsap.context(() => {
        const handleMouseMove = (e: MouseEvent) => {
          const rect = element.getBoundingClientRect();
          const x = e.clientX - rect.left - rect.width / 2;
          const y = e.clientY - rect.top - rect.height / 2;
          gsap.to(element, {
            x: x * 0.4, y: y * 0.4,
            rotationX: -y * 0.15, rotationY: x * 0.15,
            scale: 1.05,
            ease: "power2.out", duration: 0.4,
          });
        };
        const handleMouseLeave = () => {
          gsap.to(element, {
            x: 0, y: 0, rotationX: 0, rotationY: 0, scale: 1,
            ease: "elastic.out(1, 0.3)", duration: 1.2,
          });
        };
        element.addEventListener("mousemove", handleMouseMove as EventListener);
        element.addEventListener("mouseleave", handleMouseLeave);
        return () => {
          element.removeEventListener("mousemove", handleMouseMove as EventListener);
          element.removeEventListener("mouseleave", handleMouseLeave);
        };
      }, element);

      return () => ctx.revert();
    }, []);

    return (
      <Component
        ref={(node: HTMLElement) => {
          (localRef as React.MutableRefObject<HTMLElement | null>).current = node;
          if (typeof forwardedRef === "function") forwardedRef(node);
          else if (forwardedRef) (forwardedRef as React.MutableRefObject<HTMLElement | null>).current = node;
        }}
        className={cn("cursor-pointer", className)}
        {...props}
      >
        {children}
      </Component>
    );
  }
);
MagneticButton.displayName = "MagneticButton";

const DEFAULT_MARQUEE = [
  "More Leads, Less Effort",
  "4.8× ROAS Guaranteed",
  "Launch in 14 Days",
  "94% Client Retention",
  "Done-For-You Systems",
];

const DEFAULT_PRIMARY_CTAS = [
  { label: "Book a Free Call", href: "#" },
  { label: "Get Started", href: "#" },
];

const DEFAULT_SECONDARY_LINKS = [
  { label: "Privacy Policy", href: "#" },
  { label: "Terms of Service", href: "#" },
  { label: "Support", href: "#" },
];

const MarqueeItem = ({ items }: { items: string[] }) => (
  <div className="flex items-center space-x-12 px-6">
    {items.map((label, i) => (
      <React.Fragment key={`${label}-${i}`}>
        <span>{label}</span>
        <span className={i % 2 === 0 ? "text-primary/60" : "text-secondary/60"}>✦</span>
      </React.Fragment>
    ))}
  </div>
);

export function CinematicFooter({ data }: { data?: FooterData } = {}) {
  const wrapperRef  = useRef<HTMLDivElement>(null);
  const giantTextRef = useRef<HTMLDivElement>(null);
  const headingRef  = useRef<HTMLHeadingElement>(null);
  const linksRef    = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !wrapperRef.current) return;

    // Refresh after a tick so Framer Motion transforms from SectionReveal
    // above are already applied before GSAP measures positions.
    const refreshId = setTimeout(() => ScrollTrigger.refresh(), 100);

    const ctx = gsap.context(() => {
      // Parallax: giant text rises on scroll (no opacity — always visible)
      gsap.fromTo(
        giantTextRef.current,
        { y: "8vh", scale: 0.88 },
        {
          y: "0vh", scale: 1,
          ease: "power1.out",
          scrollTrigger: {
            trigger: wrapperRef.current,
            start: "top 80%", end: "bottom bottom", scrub: 1.2,
          },
        }
      );

      // Heading & links: y-only parallax (opacity always 1 — never hidden)
      gsap.fromTo(
        [headingRef.current, linksRef.current],
        { y: 40 },
        {
          y: 0,
          stagger: 0.1, ease: "power2.out",
          scrollTrigger: {
            trigger: wrapperRef.current,
            start: "top 60%", end: "top top", scrub: 1.2,
          },
        }
      );
    }, wrapperRef);

    return () => {
      clearTimeout(refreshId);
      ctx.revert();
    };
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const giantBgText     = data?.giantBgText     ?? "MIDUVA";
  const heading         = data?.heading         ?? "Ready to grow?";
  const marqueeItems    = data?.marqueeItems?.length    ? data.marqueeItems    : DEFAULT_MARQUEE;
  const primaryCtas     = data?.primaryCtas?.length     ? data.primaryCtas     : DEFAULT_PRIMARY_CTAS;
  const secondaryLinks  = data?.secondaryLinks?.length  ? data.secondaryLinks  : DEFAULT_SECONDARY_LINKS;
  const copyright       = data?.copyright       ?? "© 2026 Miduva. All rights reserved.";
  const createdByLabel  = data?.createdByLabel  ?? "Created by";

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />

      <div
        ref={wrapperRef}
        className="relative h-screen w-full"
        style={{ clipPath: "polygon(0% 0, 100% 0%, 100% 100%, 0 100%)" }}
      >
        <footer className="fixed bottom-0 left-0 flex h-screen w-full flex-col justify-between overflow-hidden bg-background text-foreground cinematic-footer-wrapper">

          {/* Ambient glow */}
          <div className="footer-aurora absolute left-1/2 top-1/2 h-[60vh] w-[80vw] -translate-x-1/2 -translate-y-1/2 animate-footer-breathe rounded-[50%] blur-[80px] pointer-events-none z-0" />
          <div className="footer-bg-grid absolute inset-0 z-0 pointer-events-none" />

          {/* Giant background text */}
          <div
            ref={giantTextRef}
            className="footer-giant-bg-text absolute bottom-16 md:bottom-auto md:-bottom-[5vh] left-1/2 -translate-x-1/2 whitespace-nowrap z-0 pointer-events-none select-none"
          >
            {giantBgText}
          </div>

          {/* Marquee */}
          <div className="absolute top-12 left-0 w-full overflow-hidden border-y border-border/50 bg-background/60 backdrop-blur-md py-4 z-10 -rotate-2 scale-110 shadow-2xl">
            <div className="flex w-max animate-footer-scroll-marquee text-xs md:text-sm font-bold tracking-[0.3em] text-muted-foreground uppercase">
              <MarqueeItem items={marqueeItems} />
              <MarqueeItem items={marqueeItems} />
            </div>
          </div>

          {/* Main center content */}
          <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 pt-24 pb-4 md:pt-0 md:pb-0 md:mt-20 w-full max-w-5xl mx-auto">
            <h2
              ref={headingRef}
              className="text-5xl md:text-8xl font-black footer-text-glow tracking-tighter mb-8 md:mb-12 text-center"
            >
              {heading}
            </h2>

            <div ref={linksRef} className="flex flex-col items-center gap-6 w-full">
              {/* Primary CTAs — full-width stacked on mobile (even, intentional),
                  inline row on larger screens. */}
              <div className="flex flex-col sm:flex-row sm:flex-wrap justify-center gap-3 sm:gap-4 w-full max-w-sm sm:max-w-none mx-auto">
                {primaryCtas.map((cta, i) => (
                  <MagneticButton
                    key={`${cta.label}-${i}`}
                    as="a"
                    href={cta.href}
                    className="footer-glass-pill w-full sm:w-auto justify-center px-8 sm:px-10 py-4 sm:py-5 rounded-full text-foreground font-bold text-sm md:text-base flex items-center gap-3 group"
                  >
                    {i === 0 ? (
                      <Phone className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                    ) : null}
                    {cta.label}
                    {i !== 0 ? (
                      <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all" />
                    ) : null}
                  </MagneticButton>
                ))}
              </div>

              {/* Secondary links */}
              <div className="flex flex-wrap justify-center gap-3 md:gap-6 w-full mt-2">
                {secondaryLinks.map((link, i) => (
                  <MagneticButton
                    key={`${link.label}-${i}`}
                    as="a"
                    href={link.href}
                    className="footer-glass-pill px-6 py-3 rounded-full text-muted-foreground font-medium text-xs md:text-sm hover:text-foreground"
                  >
                    {link.label}
                  </MagneticButton>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom bar — one row on every size. Desktop spreads copyright,
              wordmark credit, and back-to-top across. Mobile drops the credit pill
              and pairs copyright (left) with back-to-top (right). */}
          <div className="relative z-20 w-full pb-8 px-6 md:px-12 flex flex-row items-center justify-between gap-4 md:gap-6">
            <div className="text-muted-foreground text-[10px] md:text-xs font-semibold tracking-widest uppercase order-1">
              {copyright}
            </div>

            <div className="hidden md:flex footer-glass-pill px-6 py-3 rounded-full items-center gap-2 order-2 cursor-default border-border/50">
              <span className="text-muted-foreground text-[10px] md:text-xs font-bold uppercase tracking-widest">{createdByLabel}</span>
              <span className="text-foreground font-black text-xs md:text-sm tracking-normal ml-1">Miduva</span>
            </div>

            <MagneticButton
              as="button"
              onClick={scrollToTop}
              className="w-12 h-12 rounded-full footer-glass-pill flex items-center justify-center text-muted-foreground hover:text-foreground group order-3 shrink-0"
            >
              <svg className="w-5 h-5 transform group-hover:-translate-y-1.5 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            </MagneticButton>
          </div>
        </footer>
      </div>
    </>
  );
}
