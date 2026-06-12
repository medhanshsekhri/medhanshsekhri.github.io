"use client";

import { motion, useReducedMotion } from "framer-motion";

/* Top-down F-22 planform, nose pointing right (+x): chined forebody, diamond
   wing with forward-swept trailing edge, clipped stabs, canted twin tails.
   Hand-drawn for this site because no icon library carries the airframe. */
function F22({ width }: { width: number }) {
  return (
    <svg
      viewBox="0 0 120 80"
      width={width}
      height={(width * 80) / 120}
      fill="currentColor"
      aria-hidden
    >
      <path d="M118 40 L96 36 L74 33 L40 9 L34 11 L46 28 L38 29 L16 16 L12 19 L20 31 L10 31 L10 49 L20 49 L12 61 L16 64 L38 51 L46 52 L34 69 L40 71 L74 47 L96 44 Z" />
      <path d="M32 27 L16 21 L13 24 L30 31 Z" opacity={0.85} />
      <path d="M32 53 L16 59 L13 56 L30 49 Z" opacity={0.85} />
    </svg>
  );
}

/* Twin engine contrail: a long gradient streak trailing behind one nozzle. */
function Contrail({ jetWidth, offsetY, length }: { jetWidth: number; offsetY: number; length: number }) {
  return (
    <div
      className="absolute"
      style={{
        right: jetWidth * 0.82,
        top: `calc(50% + ${offsetY}px)`,
        width: length,
        height: 1.5,
        background: "linear-gradient(90deg, transparent, var(--clr-accent))",
        opacity: 0.55,
      }}
    />
  );
}

interface Flight {
  /* formation offsets in the direction-of-travel frame: -x is behind the lead */
  jets: { dx: number; dy: number }[];
  jetWidth: number;
  x: [string, string];
  y: [string, string];
  heading: number; // degrees; matches the x/y travel direction
  duration: number;
  delay: number;
  repeatDelay: number;
  opacity: number;
}

const FLIGHTS: Flight[] = [
  {
    // Near pass: 3-ship V climbing across the hero, left to right
    jets: [
      { dx: 0, dy: 0 },
      { dx: -78, dy: -52 },
      { dx: -78, dy: 52 },
    ],
    jetWidth: 84,
    x: ["-30vw", "120vw"],
    y: ["64vh", "30vh"],
    heading: -7,
    duration: 14,
    delay: 1.2,
    repeatDelay: 7,
    opacity: 0.5,
  },
  {
    // Distant pair in echelon, cruising the other way near the top
    jets: [
      { dx: 0, dy: 0 },
      { dx: -44, dy: 26 },
    ],
    jetWidth: 36,
    x: ["115vw", "-25vw"],
    y: ["13vh", "20vh"],
    heading: 178,
    duration: 26,
    delay: 7,
    repeatDelay: 10,
    opacity: 0.28,
  },
];

export default function F22Flyover() {
  const reduce = useReducedMotion();
  if (reduce) return null;

  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
      {FLIGHTS.map((flight, fi) => (
        <motion.div
          key={fi}
          className="absolute left-0 top-0"
          initial={{ x: flight.x[0], y: flight.y[0] }}
          animate={{ x: flight.x, y: flight.y }}
          transition={{
            x: { duration: flight.duration, ease: "linear", repeat: Infinity, repeatDelay: flight.repeatDelay, delay: flight.delay },
            y: { duration: flight.duration, ease: "linear", repeat: Infinity, repeatDelay: flight.repeatDelay, delay: flight.delay },
          }}
          style={{ opacity: flight.opacity }}
        >
          <div style={{ transform: `rotate(${flight.heading}deg)`, color: "var(--clr-text)" }}>
            {flight.jets.map((jet, ji) => (
              <div key={ji} className="absolute" style={{ left: jet.dx, top: jet.dy }}>
                {/* Slow bob so the formation breathes instead of sliding rigidly */}
                <motion.div
                  className="relative"
                  animate={{ y: [0, -6, 4, 0] }}
                  transition={{ duration: 5.5 + ji * 1.3, repeat: Infinity, ease: "easeInOut" }}
                >
                  <F22 width={flight.jetWidth} />
                  <Contrail jetWidth={flight.jetWidth} offsetY={-flight.jetWidth * 0.06} length={flight.jetWidth * 4.2} />
                  <Contrail jetWidth={flight.jetWidth} offsetY={flight.jetWidth * 0.06} length={flight.jetWidth * 3.4} />
                </motion.div>
              </div>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
