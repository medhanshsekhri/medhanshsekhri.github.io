"use client";

import { useLayoutEffect, useRef } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "framer-motion";

const ITEMS = [
  "Aerospace",
  "Autonomous Systems",
  "C++",
  "Arduino",
  "Fusion 360",
  "Embedded Systems",
  "Flight Dynamics",
  "CAD",
  "PID Control",
  "Robotics",
  "Mechatronics",
  "OpenRocket",
];

function wrap(min: number, max: number, v: number) {
  const range = max - min;
  return min + ((((v - min) % range) + range) % range);
}

interface TechMarqueeProps {
  baseSpeed?: number; // px per second at rest
  rotateY?: number;
  rotateX?: number;
  perspective?: number;
}

// Scroll-velocity-reactive marquee: drifts left at rest, accelerates with
// scroll speed and reverses direction when you scroll back up.
export default function TechMarquee({
  baseSpeed = 75,
  rotateY = -22,
  rotateX = 6,
  perspective = 1200,
}: TechMarqueeProps) {
  const reduce = useReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);
  const unitWidth = useRef(0);

  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, { damping: 60, stiffness: 350 });
  const velocityFactor = useTransform(smoothVelocity, [-1200, 0, 1200], [-3, 0, 3], {
    clamp: false,
  });
  const direction = useRef(-1);

  useLayoutEffect(() => {
    const measure = () => {
      // One repetition's width, from the first third of the tripled track
      if (trackRef.current) unitWidth.current = trackRef.current.scrollWidth / 3;
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  useAnimationFrame((_, delta) => {
    if (reduce) return;
    const vf = velocityFactor.get();
    if (vf > 0.1) direction.current = -1;
    else if (vf < -0.1) direction.current = 1;
    let moveBy = direction.current * baseSpeed * (delta / 1000);
    moveBy *= 1 + Math.abs(vf);
    baseX.set(baseX.get() + moveBy);
  });

  const x = useTransform(baseX, (v) =>
    unitWidth.current > 0 ? `${wrap(-unitWidth.current, 0, v)}px` : "0px"
  );

  // Tripled so the loop stays seamless in both directions
  const rendered = [...ITEMS, ...ITEMS, ...ITEMS];

  return (
    <section
      aria-hidden
      className="relative w-full overflow-hidden select-none"
      style={{
        height: "clamp(140px, 22vh, 260px)",
        perspective: `${perspective}px`,
        // Edge fades via masks, so the page background (stars/grid) stays visible
        maskImage:
          "linear-gradient(180deg, transparent 0%, black 30%, black 70%, transparent 100%)",
        WebkitMaskImage:
          "linear-gradient(180deg, transparent 0%, black 30%, black 70%, transparent 100%)",
      }}
    >
      <div
        className="absolute inset-0 flex items-center"
        style={{
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
          transformStyle: "preserve-3d",
          maskImage:
            "linear-gradient(90deg, transparent 0%, black 16%, black 84%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(90deg, transparent 0%, black 16%, black 84%, transparent 100%)",
        }}
      >
        <motion.div
          ref={trackRef}
          className="flex whitespace-nowrap will-change-transform"
          style={reduce ? undefined : { x }}
        >
          {rendered.map((item, i) => (
            <span
              key={i}
              className="font-display font-semibold text-muted/35"
              style={{
                fontSize: "clamp(2.5rem, 7vw, 5.5rem)",
                letterSpacing: "-0.02em",
                paddingRight: "0.9em",
                lineHeight: 1,
              }}
            >
              {item}
              <span className="text-accent/40"> · </span>
            </span>
          ))}
        </motion.div>
      </div>

    </section>
  );
}
