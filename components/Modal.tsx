"use client";

import { useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence, useDragControls } from "framer-motion";
import { X } from "lucide-react";
import { useScrollLock, useDialog } from "@/lib/overlay";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  // Opt-in: mobile sheet gesture (pill handle + swipe down to dismiss).
  // Off by default so existing modals keep their current behaviour.
  swipeToClose?: boolean;
  /** Accessible name for the dialog. */
  label?: string;
  children: React.ReactNode;
}

// Past this drag distance, or this flick speed, the sheet is dismissed
// rather than snapped back. Shared with the lightbox so both surfaces
// dismiss on the same gesture.
const DISMISS_OFFSET = 110;
const DISMISS_VELOCITY = 520;

export interface DragEndInfo {
  offset: { y: number };
  velocity: { y: number };
}

export function shouldDismissBySwipe(info: DragEndInfo) {
  return info.offset.y > DISMISS_OFFSET || info.velocity.y > DISMISS_VELOCITY;
}

// Drag config for a downward dismiss gesture: no upward travel, elastic pull
// down. Shared so the lightbox feels identical to the sheet.
export const SWIPE_DISMISS_PROPS = {
  drag: "y" as const,
  dragConstraints: { top: 0, bottom: 0 },
  dragElastic: { top: 0, bottom: 0.55 },
};

export default function Modal({
  isOpen,
  onClose,
  swipeToClose = false,
  label = "Dialog",
  children,
}: ModalProps) {
  const dragControls = useDragControls();
  const panelRef = useRef<HTMLDivElement>(null);

  useScrollLock(isOpen);
  useDialog(isOpen, panelRef, onClose);

  // Portals need a real document; on the server there is nothing to portal into.
  if (typeof document === "undefined") return null;

  // Drag is started by the handle only (dragListener={false}), so the panel's
  // own vertical scrolling is never hijacked, and the desktop layout — where
  // the handle is hidden — can never be dragged at all.
  const dragProps = swipeToClose
    ? {
        drag: "y" as const,
        dragControls,
        dragListener: false,
        dragConstraints: { top: 0, bottom: 0 },
        dragElastic: { top: 0, bottom: 0.55 },
        onDragEnd: (_: unknown, info: DragEndInfo) => {
          if (shouldDismissBySwipe(info)) onClose();
        },
      }
    : {};

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/75 backdrop-blur-sm"
            style={{ zIndex: 9998 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />

          <div
            className="fixed inset-0 flex items-end justify-center md:items-center md:p-6 pointer-events-none"
            style={{ zIndex: 9999 }}
          >
            <motion.div
              ref={panelRef}
              role="dialog"
              aria-modal="true"
              aria-label={label}
              tabIndex={-1}
              className="relative w-full max-w-4xl max-h-[92dvh] overflow-y-auto rounded-t-3xl md:rounded-2xl bg-surface border border-border pointer-events-auto focus:outline-none"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              {...dragProps}
            >
              {swipeToClose && (
                <div
                  className="sticky top-0 z-20 flex justify-center pt-3 pb-1 bg-surface md:hidden cursor-grab active:cursor-grabbing"
                  style={{ touchAction: "none" }}
                  onPointerDown={(e) => dragControls.start(e)}
                  aria-hidden
                >
                  <span className="block w-10 h-1 rounded-full bg-border" />
                </div>
              )}
              {/* When the handle is present it pins at top-0, so the close row
                  pins just below it (handle bar = 12 + 4 + 4 = 20px). */}
              <div
                className={`sticky ${swipeToClose ? "top-5 md:top-0" : "top-0"} right-0 z-10 flex justify-end p-4 pb-0`}
              >
                <button
                  onClick={onClose}
                  className="flex items-center justify-center w-8 h-8 rounded-full bg-bg border border-border text-muted hover:text-text transition-colors"
                  aria-label="Close"
                >
                  <X size={13} />
                </button>
              </div>
              <div className="px-6 pb-10 pt-4 md:px-10 md:pb-12">
                {children}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}
