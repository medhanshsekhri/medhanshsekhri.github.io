"use client";

import { useState, useEffect } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import { Sun, Moon, Menu, X } from "lucide-react";
import SwapText from "./SwapText";

const NAV_LINKS = [
  { label: "Projects", href: "/projects" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

export default function Nav() {
  const [isDark, setIsDark] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);

  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 20));

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  // Lock body scroll when menu open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const toggleDark = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  return (
    <>
      {/* Floating pill nav: detached from the edges, never a full-width bar */}
      <header className="fixed top-4 inset-x-0 z-50 flex justify-center px-4 pointer-events-none">
        <motion.nav
          className="pointer-events-auto glass-panel rounded-full flex items-center h-12 pl-5 pr-1.5 gap-1"
          initial={{ y: -56, opacity: 0 }}
          animate={{ y: 0, opacity: 1, scale: scrolled ? 0.97 : 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 26 }}
          style={{ boxShadow: scrolled ? "0 10px 36px var(--glass-shadow)" : undefined }}
        >
          <a
            href="#hero"
            className="font-display font-semibold text-text hover:opacity-75 transition-opacity mr-2"
            style={{ fontSize: "18px", letterSpacing: "-0.01em" }}
          >
            Medhansh Sekhri
          </a>

          {/* Desktop links with a sliding hover pill */}
          <div
            className="relative hidden md:flex items-center"
            onMouseLeave={() => setHovered(null)}
          >
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onMouseEnter={() => setHovered(link.href)}
                className="swap-trigger relative px-3.5 py-1.5 text-sm font-body font-medium text-muted hover:text-text transition-colors rounded-full"
              >
                {hovered === link.href && (
                  <motion.span
                    layoutId="nav-glider"
                    className="absolute inset-0 rounded-full bg-text/10"
                    transition={{ type: "spring", stiffness: 420, damping: 32 }}
                  />
                )}
                <span className="relative z-10">
                  <SwapText text={link.label} />
                </span>
              </a>
            ))}
          </div>

          <button
            onClick={toggleDark}
            className="flex items-center justify-center w-9 h-9 rounded-full text-muted hover:text-text hover:bg-text/10 transition-colors ml-1"
            aria-label="Toggle theme"
          >
            <AnimatePresence mode="wait" initial={false}>
              {isDark ? (
                <motion.span
                  key="sun"
                  initial={{ scale: 0, rotate: -90 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: 90 }}
                  transition={{ type: "spring", stiffness: 450, damping: 18 }}
                >
                  <Sun size={14} />
                </motion.span>
              ) : (
                <motion.span
                  key="moon"
                  initial={{ scale: 0, rotate: 90 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: -90 }}
                  transition={{ type: "spring", stiffness: 450, damping: 18 }}
                >
                  <Moon size={14} />
                </motion.span>
              )}
            </AnimatePresence>
          </button>

          <button
            onClick={() => setMenuOpen((p) => !p)}
            className="md:hidden flex items-center justify-center w-9 h-9 rounded-full text-muted hover:text-text hover:bg-text/10 transition-colors"
            aria-label="Toggle menu"
          >
            <AnimatePresence mode="wait" initial={false}>
              {menuOpen ? (
                <motion.span key="x" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={{ duration: 0.15 }}>
                  <X size={14} />
                </motion.span>
              ) : (
                <motion.span key="menu" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={{ duration: 0.15 }}>
                  <Menu size={14} />
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </motion.nav>
      </header>

      {/* Full-screen mobile overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-40 md:hidden flex flex-col items-center justify-center"
            style={{ background: isDark ? "rgba(13,13,13,0.97)" : "rgba(255,247,251,0.97)", backdropFilter: "blur(16px)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex flex-col items-center gap-10">
              {NAV_LINKS.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="font-display font-semibold text-text"
                  style={{ fontSize: "clamp(2.4rem, 10vw, 4rem)" }}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07, duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
                  whileHover={{ x: 8, color: isDark ? "#C6A85B" : "#E04B52" }}
                >
                  {link.label}
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
