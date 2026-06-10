"use client";

import { useState } from "react";
import confetti from "canvas-confetti";
import LeverSwitch from "./ui/lever-switch";

const COLORS = [
  "#E04B52", "#5FE0B3", "#F2B632", "#8C7AE6",
  "#8FB7B8", "#3A6EA5", "#C6A85B", "#0F8A5F", "#3B1E3F",
];

const burst = (origin: { x: number; y: number }) =>
  confetti({
    particleCount: 200,
    spread: 120,
    startVelocity: 60,
    gravity: 0.8,
    ticks: 300,
    origin,
    colors: COLORS,
  });

export default function Footer() {
  const [isActive, setIsActive] = useState(false);

  const handleLever = (checked: boolean) => {
    setIsActive(checked);
    if (!checked) return;

    burst({ x: 0.5, y: 0.8 });
    setTimeout(() => burst({ x: 0.3, y: 0.8 }), 200);
    setTimeout(() => burst({ x: 0.7, y: 0.8 }), 400);
    setTimeout(() => setIsActive(false), 1000);
  };

  return (
    <footer
      className="bg-surface border-t border-dashed border-border py-8 px-5"
      style={{ position: "relative" }}
    >
      <p
        className="text-center text-muted font-body tracking-wide leading-relaxed"
        style={{ fontSize: "clamp(10px, 2.5vw, 12px)" }}
      >
        2026 Medhansh Sekhri &middot; BEng(Hons) + MEng, University of Queensland
      </p>

      {/* Silent Easter egg lever */}
      <div
        style={{
          position: "absolute",
          right: 16,
          bottom: 8,
          transform: "scale(0.6)",
          transformOrigin: "bottom right",
        }}
      >
        <LeverSwitch checked={isActive} onChange={handleLever} />
      </div>
    </footer>
  );
}
