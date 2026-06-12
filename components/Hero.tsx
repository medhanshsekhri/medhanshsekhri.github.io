"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import SwapText from "./SwapText";
import F22Flyover from "./F22Flyover";

const FIRST = "Medhansh";
const LAST = " Sekhri.";

/* The things actually built — each one is a project in the section below.
   Colors come from the theme's --name-* hero palette so both themes hold. */
const BUILDS = [
  { text: "ultrasonic radar scanners", color: "var(--name-1)" },
  { text: "flood-resistant housing", color: "var(--name-5)" },
  { text: "model rockets", color: "var(--name-3)" },
  { text: "balsa truss towers", color: "var(--name-4)" },
  { text: "obstacle-dodging rovers", color: "var(--name-6)" },
];

const PHRASE_CLASS = "font-display italic font-semibold";
const PHRASE_STYLE = { fontSize: "1.12em", lineHeight: 1.2 } as const;

/* "I build <rotating phrase>." — phrases slide up through a masked window
   while the window's width eases to fit the incoming phrase. */
function BuildCarousel({ fontSize }: { fontSize: string }) {
  const reduce = useReducedMotion();
  const [idx, setIdx] = useState(0);
  const [width, setWidth] = useState<number | null>(null);
  const measureRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    if (reduce) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % BUILDS.length), 2600);
    return () => clearInterval(t);
  }, [reduce]);

  useLayoutEffect(() => {
    const el = measureRefs.current[idx];
    if (el) setWidth(el.offsetWidth);
  }, [idx]);

  /* Re-measure when the viewport or webfonts change the metrics */
  useEffect(() => {
    const remeasure = () => {
      const el = measureRefs.current[idx];
      if (el) setWidth(el.offsetWidth);
    };
    window.addEventListener("resize", remeasure);
    document.fonts?.ready.then(remeasure);
    return () => window.removeEventListener("resize", remeasure);
  }, [idx]);

  if (reduce) {
    return (
      <p className="text-muted font-body mb-8" style={{ fontSize }}>
        I build radar scanners, flood-resistant housing, model rockets, truss
        towers, and obstacle-dodging rovers.
      </p>
    );
  }

  return (
    <p className="text-muted font-body mb-8" style={{ fontSize }}>
      <span className="sr-only">
        I build radar scanners, flood-resistant housing, model rockets, truss
        towers, and obstacle-dodging rovers.
      </span>
      <span aria-hidden>I build </span>
      {/* Hidden copies of every phrase, used only to measure target widths.
          They carry the same font classes so the measured width is exact. */}
      <span
        aria-hidden
        style={{ position: "absolute", visibility: "hidden", whiteSpace: "nowrap", pointerEvents: "none" }}
      >
        {BUILDS.map((b, i) => (
          <span
            key={b.text}
            ref={(el) => { measureRefs.current[i] = el; }}
            className={PHRASE_CLASS}
            style={PHRASE_STYLE}
          >
            {b.text}
          </span>
        ))}
      </span>
      <span
        aria-hidden
        className="relative inline-block overflow-hidden align-bottom"
        style={{
          width: width ?? "auto",
          whiteSpace: "nowrap",
          transition: "width 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
          paddingBottom: "0.1em",
          marginBottom: "-0.1em",
        }}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={idx}
            className={`inline-block ${PHRASE_CLASS}`}
            style={{ ...PHRASE_STYLE, color: BUILDS[idx].color }}
            initial={{ y: "110%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "-110%", opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          >
            {BUILDS[idx].text}
          </motion.span>
        </AnimatePresence>
      </span>
      <span aria-hidden>.</span>
    </p>
  );
}

function MagneticLink({
  href,
  children,
  className,
  external,
}: {
  href: string;
  children: React.ReactNode;
  className: string;
  external?: boolean;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 350, damping: 22, mass: 0.5 });
  const y = useSpring(my, { stiffness: 350, damping: 22, mass: 0.5 });

  return (
    <motion.a
      ref={ref}
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className={className}
      style={{ x, y }}
      whileTap={{ scale: 0.97 }}
      onMouseMove={(e) => {
        const rect = ref.current?.getBoundingClientRect();
        if (!rect) return;
        mx.set((e.clientX - rect.left - rect.width / 2) * 0.28);
        my.set((e.clientY - rect.top - rect.height / 2) * 0.28);
      }}
      onMouseLeave={() => { mx.set(0); my.set(0); }}
    >
      {children}
    </motion.a>
  );
}

export default function Hero() {
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  // Hero recedes as you scroll past: slight parallax + fade for depth
  const contentY = useTransform(scrollY, [0, 700], [0, 130]);
  const contentOpacity = useTransform(scrollY, [0, 550], [1, 0]);

  /* This framer-motion build never re-applies non-transform style motion
     values (opacity froze at its mount value), so the fade is written to
     the DOM directly. The y parallax is a transform and works as normal. */
  const contentRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (reduce) return;
    const apply = (v: number) => {
      if (contentRef.current) contentRef.current.style.opacity = String(v);
    };
    apply(contentOpacity.get());
    return contentOpacity.on("change", apply);
  }, [contentOpacity, reduce]);

  return (
    <section
      id="hero"
      className="relative min-h-[100dvh] flex flex-col items-center justify-center overflow-hidden bg-transparent"
    >
      <F22Flyover />
      <motion.div
        ref={contentRef}
        className="relative z-10 flex flex-col items-center text-center px-6 max-w-5xl w-full"
        style={reduce ? undefined : { y: contentY }}
      >
        {/* Name: letters cascade in, lift on hover; "Sekhri" in the brand accent */}
        <h1
          className="font-display font-semibold leading-[0.95] tracking-tight text-text mb-7"
          style={{ fontSize: "clamp(3rem, 12vw, 9rem)" }}
        >
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {"Hi, I'm "}
          </motion.span>

          {/* Each name is a nowrap unit so lines never break mid-word,
              while the letters inside still cascade and lift individually */}
          <span style={{ display: "inline-block", whiteSpace: "nowrap" }}>
            {FIRST.split("").map((letter, i) => (
              <motion.span
                key={`f-${i}`}
                initial={{ opacity: 0, y: "0.25em" }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -8, transition: { type: "spring", stiffness: 400, damping: 15 } }}
                transition={{ duration: 0.45, delay: 0.45 + i * 0.05, ease: [0.25, 0.46, 0.45, 0.94] }}
                style={{ display: "inline-block", cursor: "default" }}
              >
                {letter}
              </motion.span>
            ))}
          </span>{" "}
          <span style={{ display: "inline-block", whiteSpace: "nowrap" }}>
            {LAST.trim().split("").map((letter, i) => (
              <motion.span
                key={`l-${i}`}
                initial={{ opacity: 0, y: "0.25em" }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -8, transition: { type: "spring", stiffness: 400, damping: 15 } }}
                transition={{ duration: 0.45, delay: 0.45 + (FIRST.length + 1 + i) * 0.05, ease: [0.25, 0.46, 0.45, 0.94] }}
                style={{ display: "inline-block", cursor: "default", color: "var(--clr-accent)" }}
              >
                {letter}
              </motion.span>
            ))}
          </span>
        </h1>

        {/* Tagline: "I build" + a carousel of the actual builds */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.55, ease: "easeOut" }}
        >
          <BuildCarousel fontSize="clamp(1rem, 3.5vw, 1.35rem)" />
        </motion.div>

        {/* Credential chip: frosted pill, UQ crest at readable size */}
        <motion.div
          className="inline-flex items-center gap-3.5 mb-10 rounded-full pl-2 pr-6 py-2"
          style={{
            background: "var(--glass-bg)",
            backdropFilter: "blur(22px) saturate(180%)",
            WebkitBackdropFilter: "blur(22px) saturate(180%)",
            border: "1px solid var(--glass-border)",
            boxShadow: "0 4px 24px -12px var(--glass-shadow)",
          }}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <span
            className="shrink-0 inline-flex items-center justify-center rounded-full overflow-hidden"
            style={{
              width: 42,
              height: 42,
              background: "#FFFFFF",
              border: "1px solid var(--clr-border)",
              padding: 4,
            }}
          >
            <img
              src="/UQ-300x300.png"
              alt="University of Queensland crest"
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
            />
          </span>
          <span className="flex flex-col items-start text-left leading-snug">
            <span className="font-body text-sm font-medium text-text">
              University of Queensland
            </span>
            <span className="font-body text-xs text-muted">
              BEng(Hons) + MEng
            </span>
          </span>
        </motion.div>

        {/* Magnetic buttons */}
        <motion.div
          className="flex flex-wrap items-center justify-center gap-3"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <MagneticLink
            href="#projects"
            className="swap-trigger px-7 py-2.5 bg-text text-bg text-sm font-body font-medium rounded-full"
          >
            <SwapText text="See My Work" />
          </MagneticLink>
          <MagneticLink
            href="#about"
            className="swap-trigger px-7 py-2.5 border border-border text-text text-sm font-body hover:border-accent transition-colors duration-300 rounded-full"
          >
            <SwapText text="About" />
          </MagneticLink>
          <MagneticLink
            href="/Medhansh_Sekhri_Engineering_Resume.pdf"
            external
            className="swap-trigger px-7 py-2.5 border border-border text-text text-sm font-body hover:border-accent transition-colors duration-300 rounded-full"
          >
            <SwapText text="Resume ↗" />
          </MagneticLink>
        </motion.div>
      </motion.div>
    </section>
  );
}
