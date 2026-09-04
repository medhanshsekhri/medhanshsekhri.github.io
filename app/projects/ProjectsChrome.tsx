"use client";

import Link from "next/link";
import { useSyncExternalStore, useCallback } from "react";
import { ArrowLeft, Sun, Moon } from "lucide-react";

/** Theme lives on <html>, outside React; observe it rather than mirror it. */
function subscribeToTheme(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
  return () => observer.disconnect();
}
const getThemeSnapshot = () =>
  document.documentElement.classList.contains("dark");
const getThemeServerSnapshot = () => false;

/**
 * Sticky header shared by the projects index and every case-study page:
 * a way back and the theme toggle. The only client-side part of these routes
 * besides the lightbox, so the pages themselves stay server components.
 */
export default function ProjectsChrome({
  backHref = "/",
  backLabel = "Medhansh Sekhri",
}: {
  backHref?: string;
  backLabel?: string;
}) {
  const isDark = useSyncExternalStore(
    subscribeToTheme,
    getThemeSnapshot,
    getThemeServerSnapshot
  );

  const toggleDark = useCallback(() => {
    const next = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  }, []);

  return (
    <header
      className="sticky top-0 z-20 flex items-center justify-between px-5 md:px-8 h-16 border-b"
      style={{
        background: "var(--glass-bg)",
        backdropFilter: "blur(22px) saturate(180%)",
        WebkitBackdropFilter: "blur(22px) saturate(180%)",
        borderColor: "var(--glass-border)",
      }}
    >
      <Link
        href={backHref}
        className="inline-flex items-center gap-2 font-display font-semibold text-text hover:opacity-75 transition-opacity"
        style={{ fontSize: "17px" }}
      >
        <ArrowLeft size={16} /> {backLabel}
      </Link>
      <button
        onClick={toggleDark}
        suppressHydrationWarning
        className="flex items-center justify-center w-9 h-9 rounded-full border border-border text-muted hover:text-text hover:border-accent transition-colors"
        aria-label="Toggle theme"
      >
        {isDark ? <Sun size={14} /> : <Moon size={14} />}
      </button>
    </header>
  );
}
