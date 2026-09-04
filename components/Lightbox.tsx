"use client";

import { useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  SWIPE_DISMISS_PROPS,
  shouldDismissBySwipe,
  type DragEndInfo,
} from "./Modal";
import { useScrollLock, useDialog } from "@/lib/overlay";

// Sits above the modal (backdrop 9998, panel 9999).
const LIGHTBOX_Z = 10000;
// Viewport margin around the zoomed image.
const MARGIN = 40;

interface Zoomed {
  src: string;
  alt: string;
}

/**
 * Images in the modals are stored at their small in-page display size. The
 * optimiser writes a larger `-full.webp` beside each one for exactly this
 * view; if it is ever missing we fall back to the in-page file.
 */
function fullVariant(src: string) {
  return src.endsWith(".webp") ? src.replace(/\.webp$/, "-full.webp") : src;
}

function Lightbox({ zoomed, onClose }: { zoomed: Zoomed | null; onClose: () => void }) {
  // Set only if the -full variant fails to load, so src stays derived rather
  // than mirrored into state by an effect. A stale value from a previously
  // zoomed image simply will not match the current one.
  const [fallback, setFallback] = useState<string | null>(null);
  // A drag that ends without dismissing still emits a click; ignore that one
  // so releasing a half-swipe does not close the lightbox.
  const draggedRef = useRef(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  // The dialog stack gives Escape and Tab to the topmost overlay, so the
  // lightbox takes them while the modal underneath keeps its own once closed.
  useScrollLock(!!zoomed);
  useDialog(!!zoomed, overlayRef, onClose);

  // Portals need a real document; this component never renders during SSR.
  if (typeof document === "undefined") return null;

  const src = zoomed
    ? fallback === zoomed.src
      ? zoomed.src
      : fullVariant(zoomed.src)
    : null;

  return createPortal(
    <AnimatePresence>
      {zoomed && src && (
        <motion.div
          ref={overlayRef}
          role="dialog"
          aria-modal="true"
          aria-label={zoomed.alt || "Expanded image"}
          tabIndex={-1}
          className="fixed inset-0 flex items-center justify-center focus:outline-none"
          style={{ zIndex: LIGHTBOX_Z, background: "rgba(0, 0, 0, 0.9)", cursor: "zoom-out" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          // Stop the click here: this portal renders inside the zoom wrapper's
          // React tree, so an un-stopped click would bubble back into it and
          // immediately re-open the lightbox.
          onClick={(e) => {
            e.stopPropagation();
            if (draggedRef.current) return;
            onClose();
          }}
        >
          <motion.img
            src={src}
            alt={zoomed.alt}
            draggable={false}
            onError={() => setFallback(zoomed.src)}
            style={{
              maxWidth: `calc(100vw - ${MARGIN * 2}px)`,
              maxHeight: `calc(100dvh - ${MARGIN * 2}px)`,
              objectFit: "contain",
              touchAction: "none",
            }}
            initial={{ scale: 0.94 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.94 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            {...SWIPE_DISMISS_PROPS}
            onDragStart={() => {
              draggedRef.current = true;
            }}
            onDragEnd={(_, info: DragEndInfo) => {
              if (shouldDismissBySwipe(info)) onClose();
              // Clear after the synthetic click from this pointer sequence.
              setTimeout(() => {
                draggedRef.current = false;
              }, 60);
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}

/**
 * Wraps modal content and makes every <img> inside it click-to-zoom, via
 * delegation so individual images need no wiring. The `zoomable-images` class
 * carries the `cursor: zoom-in` affordance (see globals.css).
 */
export default function ZoomableImages({ children }: { children: React.ReactNode }) {
  const [zoomed, setZoomed] = useState<Zoomed | null>(null);

  return (
    <div
      className="zoomable-images"
      onClick={(e) => {
        const img = (e.target as HTMLElement).closest("img");
        if (!img) return;
        setZoomed({ src: img.getAttribute("src") ?? img.src, alt: img.alt });
      }}
    >
      {children}
      <Lightbox zoomed={zoomed} onClose={() => setZoomed(null)} />
    </div>
  );
}
