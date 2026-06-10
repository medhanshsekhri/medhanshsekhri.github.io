"use client";

import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import SwapText from "./SwapText";

const FIRST = "Medhansh";
const LAST = " Sekhri.";

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

  return (
    <section
      id="hero"
      className="relative min-h-[100dvh] flex flex-col items-center justify-center overflow-hidden bg-transparent"
    >
      <motion.div
        className="relative z-10 flex flex-col items-center text-center px-6 max-w-5xl w-full"
        style={reduce ? undefined : { y: contentY, opacity: contentOpacity }}
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

          {LAST.split("").map((letter, i) => {
            const isLetter = letter.trim() !== "";
            return (
              <motion.span
                key={`l-${i}`}
                initial={{ opacity: 0, y: "0.25em" }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={
                  isLetter
                    ? { y: -8, transition: { type: "spring", stiffness: 400, damping: 15 } }
                    : {}
                }
                transition={{ duration: 0.45, delay: 0.45 + (FIRST.length + i) * 0.05, ease: [0.25, 0.46, 0.45, 0.94] }}
                style={{
                  display: "inline-block",
                  cursor: "default",
                  color: isLetter ? "var(--clr-accent)" : undefined,
                }}
              >
                {letter === " " ? " " : letter}
              </motion.span>
            );
          })}
        </h1>

        {/* Tagline: characters rise in one by one, left to right, ease only */}
        <p
          className="text-muted font-body mb-8"
          style={{ fontSize: "clamp(1rem, 3.5vw, 1.35rem)" }}
          aria-label="I build machines that sense and steer themselves."
        >
          {"I build machines that sense and steer themselves.".split("").map((c, i) => (
            <motion.span
              key={i}
              aria-hidden
              initial={reduce ? false : { opacity: 0, y: "0.55em" }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.55 + i * 0.014, ease: "easeOut" }}
              style={{ display: "inline-block", whiteSpace: "pre" }}
            >
              {c}
            </motion.span>
          ))}
        </p>

        <motion.div
          className="flex items-center justify-center gap-2 mb-10 text-muted font-body text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <span
            style={{
              width: 26,
              height: 26,
              borderRadius: "50%",
              background: "var(--clr-surface)",
              border: "1px solid var(--clr-border)",
              padding: 3,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <img
              src="/UQ-300x300.png"
              alt="UQ"
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
            />
          </span>
          <span>BEng(Hons) + MEng · University of Queensland</span>
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
