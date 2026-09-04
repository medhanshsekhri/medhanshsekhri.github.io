"use client";

import { useRef } from "react";
import Link from "next/link";
import {
  motion,
  useInView,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { ArrowRight } from "lucide-react";
import { LineReveal } from "./Reveal";
import { PROJECTS, type Project } from "@/lib/projects";
import { responsiveImage } from "@/lib/image";

// Frosted-glass surface (CSS approximation, not Apple Liquid Glass).
// Styling lives in the .glass-panel class in globals.css.
const GLASS_CLASS = "glass-panel";

const TILT_SPRING = { stiffness: 180, damping: 18, mass: 0.4 };

// Pointer-driven 3D tilt. Uses motion values (not state) so it never
// re-renders the tree on mouse move. Collapses to static under reduced motion.
function TiltCard({
  href,
  ariaLabel,
  className,
  style,
  children,
}: {
  href: string;
  ariaLabel: string;
  className: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}) {
  const reduce = useReducedMotion();
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [7, -7]), TILT_SPRING);
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-7, 7]), TILT_SPRING);

  function handleMove(e: React.MouseEvent<HTMLAnchorElement>) {
    const r = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width - 0.5);
    py.set((e.clientY - r.top) / r.height - 0.5);
  }
  function reset() {
    px.set(0);
    py.set(0);
  }

  return (
    <div style={{ perspective: 1100 }} className="h-full">
      <motion.a
        onMouseMove={reduce ? undefined : handleMove}
        onMouseLeave={reset}
        whileTap={{ scale: 0.985 }}
        transition={{ duration: 0.16, ease: [0.23, 1, 0.32, 1] }}
        style={{
          ...style,
          ...(reduce ? {} : { rotateX, rotateY }),
        }}
        className={className}
        aria-label={ariaLabel}
        href={href}
      >
        {children}
        {/* HUD targeting brackets: draw in on hover, like a viewfinder lock */}
        <span className="hud-corner hud-corner--tl" aria-hidden />
        <span className="hud-corner hud-corner--tr" aria-hidden />
        <span className="hud-corner hud-corner--bl" aria-hidden />
        <span className="hud-corner hud-corner--br" aria-hidden />
      </motion.a>
    </div>
  );
}

function TechPill({ label }: { label: string }) {
  return (
    <span className="inline-flex px-3 py-1 rounded-full text-xs font-body border border-border text-muted">
      {label}
    </span>
  );
}

// Slot widths for the card images, used to pick between the 1x and 2x files.
const FEATURED_SIZES = "(max-width: 767px) 100vw, 50vw";
const CARD_SIZES = "(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw";

function ProjectImage({
  project,
  featured,
}: {
  project: Project;
  featured?: boolean;
}) {
  const photo = project.photos[0];
  if (!photo) {
    // No photos: a flat schematic tile listing the hardware, like a parts callout.
    return (
      <div className="absolute inset-0 flex items-center justify-center blueprint-tile">
        <div className="text-center px-6">
          {project.tech.map((t) => (
            <p
              key={t}
              className="font-body text-xs uppercase tracking-[0.28em] text-muted leading-loose"
            >
              {t}
            </p>
          ))}
        </div>
      </div>
    );
  }
  return (
    // One treatment for all six cards: cover in a fixed-aspect box, so the
    // source aspect (0.46 to 2.17 across the set) never changes how a card
    // reads.
    <img loading="lazy"
      {...responsiveImage(photo.src, featured ? FEATURED_SIZES : CARD_SIZES)}
      alt={photo.alt}
      className="absolute inset-0 w-full h-full object-cover"
      draggable={false}
      onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
    />
  );
}

/* Outcome line: the measured result, led by an accent arrow */
function OutcomeLine({ text, className }: { text: string; className?: string }) {
  return (
    <p className={`font-body text-xs text-muted leading-relaxed ${className ?? ""}`}>
      <span className="text-accent">→&nbsp;</span>
      {text}
    </p>
  );
}

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });
  const [featured, ...rest] = PROJECTS;

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="py-24 px-6 md:px-16"
    >
      <div className="mb-10 md:mb-12">
        <LineReveal>
          <h2
            className="font-display font-semibold text-text"
            style={{ fontSize: "clamp(3rem, 6vw, 5rem)", lineHeight: 1 }}
          >
            Projects<span className="text-accent">.</span>
          </h2>
        </LineReveal>
      </div>

      {/* Latest flagship */}
      <motion.div
        className="mb-5"
        initial={{ opacity: 0, y: 24 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <TiltCard
          href={`/projects/${featured.slug}/`}
          ariaLabel={`${featured.title} case study`}
          className={`group w-full grid md:grid-cols-2 rounded-2xl overflow-hidden text-left transition-colors focus:outline-none hover:border-white/40 ${GLASS_CLASS}`}
        >
          <div className="relative aspect-[16/10] md:aspect-auto md:min-h-[360px] overflow-hidden">
            <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-[1.04]">
              <ProjectImage project={featured} featured />
            </div>
          </div>
          <div className="p-7 md:p-10 flex flex-col justify-center">
            <p className="font-display italic text-accent mb-3" style={{ fontSize: "1.15rem", lineHeight: 1.1 }}>
              Latest build
            </p>
            <h3 className="font-display font-semibold leading-tight text-3xl lg:text-4xl text-text transition-colors duration-300 group-hover:text-accent">
              {featured.title}
            </h3>
            <p className="font-body text-sm md:text-base text-muted leading-relaxed mt-4">
              {featured.summary}
            </p>
            <OutcomeLine text={featured.outcome} className="mt-4" />
            <div className="flex flex-wrap gap-2 mt-5">
              {featured.tech.map((t) => (
                <TechPill key={t} label={t} />
              ))}
            </div>
            <span className="inline-flex items-center gap-2.5 text-sm font-body font-medium text-text mt-7">
              Open case study
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-full border border-border transition-colors duration-300 group-hover:bg-text group-hover:border-text group-hover:text-bg">
                <ArrowRight size={13} className="transition-transform duration-300 group-hover:translate-x-[1.5px]" />
              </span>
            </span>
          </div>
        </TiltCard>
      </motion.div>

      {/* Uniform grid: consistent cards, each rises into view on its own beat */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {rest.map((p, i) => (
          <motion.div
            key={p.slug}
            className="h-full"
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: (i % 3) * 0.09, ease: [0.16, 1, 0.3, 1] }}
          >
            <TiltCard
              href={`/projects/${p.slug}/`}
              ariaLabel={`${p.title} case study`}
              className={`group flex flex-col w-full h-full text-left rounded-2xl overflow-hidden transition-colors focus:outline-none hover:border-white/40 ${GLASS_CLASS}`}
            >
              <div className="relative aspect-[4/3] overflow-hidden shrink-0">
                <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-[1.04]">
                  <ProjectImage project={p} />
                </div>
              </div>
              <div className="p-5 border-t border-[var(--glass-border)] flex flex-col gap-2 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-display font-semibold leading-snug text-xl text-text transition-colors duration-300 group-hover:text-accent">
                    {p.title}
                  </h3>
                  <span className="font-display italic text-sm text-accent pt-1">
                    {String(i + 2).padStart(2, "0")}
                  </span>
                </div>
                <div className="mt-auto flex items-end justify-between gap-3 pt-1.5">
                  <OutcomeLine text={p.outcome} />
                  <ArrowRight
                    size={15}
                    className="shrink-0 mb-0.5 text-muted opacity-0 -translate-x-1.5 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-accent"
                  />
                </div>
              </div>
            </TiltCard>
          </motion.div>
        ))}
      </div>

    </section>
  );
}
