"use client";

import { useEffect, useRef, type RefObject } from "react";

/* ------------------------------------------------------------------ *
 * Body scroll lock
 *
 * Three surfaces lock scroll: the modal, the lightbox above it, and the
 * mobile nav menu. Each previously wrote document.body.style.overflow
 * directly, so whichever closed first unlocked the page even while another
 * was still open. A counter makes the last one out the one that restores it.
 * ------------------------------------------------------------------ */

let lockCount = 0;
let savedOverflow: string | null = null;

function acquire() {
  if (lockCount === 0) {
    savedOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
  }
  lockCount += 1;
}

function release() {
  if (lockCount === 0) return;
  lockCount -= 1;
  if (lockCount === 0) {
    document.body.style.overflow = savedOverflow ?? "";
    savedOverflow = null;
  }
}

export function useScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return;
    acquire();
    return release;
  }, [active]);
}

/* ------------------------------------------------------------------ *
 * Dialog focus management
 *
 * A stack decides which overlay owns the keyboard: only the topmost one
 * handles Escape and Tab. That is order-independent, unlike relying on
 * listener registration or capture-phase tricks, so a lightbox opened over
 * a modal reliably wins.
 * ------------------------------------------------------------------ */

const FOCUSABLE = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "video[controls]",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

const stack: object[] = [];

function focusableWithin(node: HTMLElement) {
  return Array.from(node.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
    (el) => el.offsetWidth > 0 || el.offsetHeight > 0 || el === document.activeElement
  );
}

/**
 * Traps Tab inside `ref`, routes Escape to `onEscape`, and returns focus to
 * whatever was focused before the dialog opened. The container should carry
 * role="dialog", aria-modal="true" and tabIndex={-1} so it can hold focus
 * when it contains nothing focusable.
 */
export function useDialog(
  active: boolean,
  ref: RefObject<HTMLElement | null>,
  onEscape?: () => void
) {
  const escapeRef = useRef(onEscape);
  useEffect(() => {
    escapeRef.current = onEscape;
  }, [onEscape]);

  useEffect(() => {
    if (!active) return;

    const token = {};
    stack.push(token);
    const previouslyFocused = document.activeElement as HTMLElement | null;

    // Move focus in. rAF so it lands after the overlay has mounted.
    const raf = requestAnimationFrame(() => {
      const node = ref.current;
      if (!node || node.contains(document.activeElement)) return;
      (focusableWithin(node)[0] ?? node).focus();
    });

    const onKeyDown = (e: KeyboardEvent) => {
      if (stack[stack.length - 1] !== token) return;

      if (e.key === "Escape") {
        e.preventDefault();
        escapeRef.current?.();
        return;
      }
      if (e.key !== "Tab") return;

      const node = ref.current;
      if (!node) return;
      const items = focusableWithin(node);
      if (items.length === 0) {
        // Nothing to tab to: keep focus on the container rather than letting
        // it escape to the page behind.
        e.preventDefault();
        node.focus();
        return;
      }

      const first = items[0];
      const last = items[items.length - 1];
      const current = document.activeElement;
      const inside = node.contains(current);

      if (e.shiftKey && (current === first || !inside)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (current === last || !inside)) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("keydown", onKeyDown);
      const i = stack.indexOf(token);
      if (i !== -1) stack.splice(i, 1);
      previouslyFocused?.focus?.();
    };
  }, [active, ref]);
}
