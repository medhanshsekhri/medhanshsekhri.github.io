"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { GlassEffect, GlassFilter } from "@/components/ui/liquid-glass";
import { LineReveal } from "./Reveal";
import SwapText from "./SwapText";

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

const LINKS = [
  {
    label: "Send an Email",
    href: "mailto:sekhrimedhansh@gmail.com",
    primary: true,
  },
  {
    label: "GitHub ↗",
    href: "https://github.com/medhanshsekhri",
    external: true,
  },
  {
    label: "LinkedIn ↗",
    href: "https://www.linkedin.com/in/medhansh-sekhri-81a133222",
    external: true,
  },
  {
    label: "Resume ↗",
    href: "/Medhansh_Sekhri_Engineering_Resume.pdf",
    external: true,
  },
];

const CREDENTIALS = [
  {
    category: "Remote Pilot, UAV Operations",
    title: "Certificate III in Aviation",
    body: "Certified remote pilot for UAV operations under CASA guidelines. Trained in airspace regulations, flight planning, and safe operation of unmanned aircraft systems.",
  },
];

export default function Contact() {
  return (
    <section id="contact" className="py-24 px-6 md:px-16">
      <div className="max-w-5xl mx-auto">
        <LineReveal>
          <h2
            className="font-display font-semibold text-text mb-6"
            style={{ fontSize: "clamp(3rem, 6vw, 5rem)", lineHeight: 1 }}
          >
            Get in Touch<span className="text-accent">.</span>
          </h2>
        </LineReveal>
        <FadeUp>
          <p className="font-body text-muted text-base leading-relaxed max-w-xl mb-12">
            I&apos;m after internships and project work in autonomous systems and aerospace.
            If you&apos;re building something in that space, I&apos;d like to hear about it.
          </p>
        </FadeUp>

        <FadeUp delay={0.1}>
          <GlassFilter />
          <div className="flex flex-wrap gap-4">
            {LINKS.map((link) => (
              <GlassEffect
                key={link.label}
                href={link.href}
                external={link.external}
                className="swap-trigger rounded-full px-7 py-3.5 hover:scale-[1.04]"
              >
                <span className="text-sm font-body font-medium text-text whitespace-nowrap">
                  <SwapText text={link.label} />
                </span>
              </GlassEffect>
            ))}
          </div>
        </FadeUp>

        {/* Credentials, folded into the same section */}
        <FadeUp delay={0.15}>
          <div className="mt-20">
            <p className="text-muted text-xs uppercase tracking-[0.22em] font-body mb-6">
              Credentials
            </p>
            <div className="border-t border-border">
              {CREDENTIALS.map((item, i) => (
                <FadeUp key={item.title} delay={0.05 + i * 0.06}>
                  <div className="py-7 border-b border-border grid md:grid-cols-[200px_1fr] gap-3 md:gap-10">
                    <p className="text-muted text-xs uppercase tracking-wider font-body leading-relaxed">
                      {item.category}
                    </p>
                    <div>
                      <h3 className="font-display font-semibold text-text text-xl md:text-2xl mb-2">
                        {item.title}
                      </h3>
                      <p className="font-body text-sm text-muted leading-relaxed max-w-xl">
                        {item.body}
                      </p>
                    </div>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
