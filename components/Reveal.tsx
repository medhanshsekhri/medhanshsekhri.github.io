"use client";

import { motion, useReducedMotion } from "framer-motion";

// Line-mask reveal: content rises from behind an overflow-hidden baseline.
export function LineReveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();

  if (reduce) return <div className={className}>{children}</div>;

  return (
    <div
      className={className}
      // pb/-mb pair gives serif descenders room without changing layout
      style={{ overflow: "hidden", paddingBottom: "0.12em", marginBottom: "-0.12em" }}
    >
      <motion.div
        initial={{ y: "110%" }}
        whileInView={{ y: "0%" }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
      >
        {children}
      </motion.div>
    </div>
  );
}
