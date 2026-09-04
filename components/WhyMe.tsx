"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { LineReveal } from "./Reveal";
import { responsiveImage } from "@/lib/image";

const PARAGRAPHS = [
  <>I&apos;m a first-year engineering student at the University of Queensland (BEng(Hons) + MEng), headed for mechanical and aerospace engineering.</>,
  <>Most of what I know about embedded systems came from outside the classroom. In my first few weeks of university I taught myself C++ and built an ultrasonic radar scanner around an Arduino: sweep logic, servo control, and a live visualisation in Processing. The code is on <a href="https://github.com/medhanshsekhri/Arduino-Radar-Scanner" target="_blank" rel="noopener noreferrer" className="text-text font-semibold underline underline-offset-4 decoration-border hover:decoration-accent transition-colors">GitHub</a>.</>,
  <>For ENGG1100 I led a team of seven building a model house that has to hold its position in rising floodwater. My job was the motor-control circuit and the firmware, and the whole build came in under its $170 budget.</>,
  <>Outside uni I&apos;m a certified remote pilot (Certificate III in Aviation) through the Australian Air Force Cadets, and I&apos;ve flown a Diamond DA40 at RAAF Amberley. Current project: an obstacle-avoiding drone built on the radar work.</>,
];

const PHOTOS = [
  { src: "/diamondda40.webp", alt: "Flying a Diamond DA40 at RAAF Amberley" },
  { src: "/networking.webp",  alt: "International Science School 2025 gala" },
  { src: "/wos.webp",         alt: "Weekend of Startups 2026" },
  { src: "/UQ.webp",          alt: "University of Queensland" },
  { src: "/cadets.webp",      alt: "Airforce Cadets Bivouac" },
  { src: "/pose.webp",        alt: "Arduino project" },
  { src: "/news2.webp",       alt: "Together for Humanity Youth Summit" },
  { src: "/biology.webp",     alt: "Live fluke analysis, University of Sydney" },
  { src: "/nightlight.webp",  alt: "Custom night light build" },
];

function PhotoTile({ src, alt, index }: { src: string; alt: string; index: number }) {
  return (
    <motion.div
      className="group relative aspect-square overflow-hidden rounded-md border border-border bg-elevated"
      initial={{ opacity: 0, y: 18, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Shimmer sits behind; the loaded photo paints over it. */}
      <div className="absolute inset-0 shimmer" aria-hidden />
      {/* Plain <img>: next/image emits no srcset under images.unoptimized,
          and these tiles are where the 1x/2x split pays off most. The classes
          reproduce next/image's `fill` box exactly. */}
      <img
        {...responsiveImage(src, "(max-width: 768px) 30vw, 153px")}
        alt={alt}
        loading="lazy"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.06]"
      />
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/45 transition-colors duration-300 flex items-end p-2">
        <p className="text-white text-[10px] leading-tight font-body opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
          {alt}
        </p>
      </div>
    </motion.div>
  );
}

function FadeUp({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {children}
    </motion.div>
  );
}

export default function WhyMe() {
  return (
    <section id="about" className="py-24 px-6 md:px-16">
      <div className="max-w-5xl mx-auto">
        <div>
          <LineReveal>
            <h2
              className="font-display font-semibold text-text mb-12"
              style={{ fontSize: "clamp(3rem, 6vw, 5rem)", lineHeight: 1 }}
            >
              About<span className="text-accent">.</span>
            </h2>
          </LineReveal>
        </div>

        <div className="grid md:grid-cols-2 gap-16 mb-20">
          <div className="space-y-6">
            {PARAGRAPHS.map((para, i) => (
              <FadeUp key={i} delay={i * 0.08}>
                <p className="font-body text-base md:text-lg leading-relaxed text-muted">
                  {para}
                </p>
              </FadeUp>
            ))}
          </div>

          {/* Photo grid: tidy 3x3 of uniform tiles, each settling in on its own beat */}
          <div className="grid grid-cols-3 gap-2.5">
            {PHOTOS.map((photo, i) => (
              <PhotoTile key={photo.src} src={photo.src} alt={photo.alt} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
