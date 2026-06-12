"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { Rocket } from "lucide-react";

// Scroll progress as a rocket launch: the rocket sits on the pad at the top
// of the page and climbs the right edge as you read down, exhaust trail
// growing beneath it. Desktop only; motion values, never React state.
export default function FlightProgress() {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const ascent = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.4 });
  const top = useTransform(ascent, [0, 1], ["90%", "6%"]);

  if (reduce) return null;

  return (
    <div
      aria-hidden
      className="fixed top-0 right-4 md:right-7 h-screen w-6 hidden lg:block pointer-events-none"
      style={{ zIndex: 30 }}
    >
      <div className="relative h-full w-full">
        {/* Flight track: faint dashed centreline */}
        <div
          className="absolute left-1/2 -translate-x-1/2 w-px border-l border-dashed border-border"
          style={{ top: "6%", bottom: "8%", opacity: 0.7 }}
        />
        {/* Exhaust trail: stretches from the rocket back down to the pad */}
        <motion.div
          className="absolute left-1/2 -translate-x-1/2 w-px"
          style={{
            top,
            bottom: "8%",
            background: "linear-gradient(to bottom, var(--clr-accent), transparent)",
            opacity: 0.55,
          }}
        />
        {/* The rocket itself */}
        <motion.div
          className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{ top }}
        >
          <Rocket size={16} className="text-accent -rotate-45" />
        </motion.div>
      </div>
    </div>
  );
}
