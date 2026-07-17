import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";

/**
 * Modal — per docs/DESIGN_SYSTEM.md §10 exactly:
 * - surface-panel-strong box, radius-xl, shadow-lg, translucent dark backdrop (no blur)
 * - fade+scale entrance (200ms out), reverse exit (150ms in) — exits faster than entrances
 * - focus trap: focus moves in on open, returns to the trigger on close
 * - Escape / backdrop-click close by default; set closeOnEscape/closeOnBackdropClick
 *   to false for destructive confirmations that require explicit button interaction
 *   (per docs/FRONTEND_AUDIT.md §6.4 and DESIGN_SYSTEM.md §10)
 */
const SIZE_CLASSES = {
  md: "max-w-lg",
  lg: "max-w-xl",
  xl: "max-w-2xl",
};

const FOCUSABLE_SELECTOR =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = "xl",
  closeOnBackdropClick = true,
  closeOnEscape = true,
  className = "",
}) {
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [isVisible, setIsVisible] = useState(false);
  const dialogRef = useRef(null);
  const previouslyFocusedRef = useRef(null);
  const titleId = useId();

  // Mount/unmount + entrance trigger
  useEffect(() => {
    if (isOpen) {
      previouslyFocusedRef.current = document.activeElement;
      setShouldRender(true);
      const raf = requestAnimationFrame(() => setIsVisible(true));
      return () => cancelAnimationFrame(raf);
    }

    setIsVisible(false);
  }, [isOpen]);

  // Focus trap + Escape handling while rendered
  useEffect(() => {
    if (!shouldRender) return;

    const focusable = dialogRef.current?.querySelectorAll(FOCUSABLE_SELECTOR);
    (focusable?.[0] || dialogRef.current)?.focus();

    function handleKeyDown(e) {
      if (e.key === "Escape") {
        if (closeOnEscape) onClose?.();
        return;
      }

      if (e.key === "Tab" && focusable?.length) {
        const firstEl = focusable[0];
        const lastEl = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === firstEl) {
          e.preventDefault();
          lastEl.focus();
        } else if (!e.shiftKey && document.activeElement === lastEl) {
          e.preventDefault();
          firstEl.focus();
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [shouldRender, closeOnEscape, onClose]);

  function handleTransitionEnd(e) {
    if (e.target !== dialogRef.current) return;
    if (!isVisible) {
      setShouldRender(false);
      previouslyFocusedRef.current?.focus?.();
    }
  }

  if (!shouldRender) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className={`absolute inset-0 bg-slate-950/45 transition-opacity motion-reduce:transition-none ${
          isVisible
            ? "opacity-100 duration-200 ease-out"
            : "opacity-0 duration-150 ease-in"
        }`}
        onClick={closeOnBackdropClick ? onClose : undefined}
        aria-hidden="true"
      />

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        tabIndex={-1}
        onTransitionEnd={handleTransitionEnd}
        className={`surface-panel-strong relative w-full ${
          SIZE_CLASSES[size] || SIZE_CLASSES.xl
        } rounded-[30px] p-8 shadow-[0_30px_80px_rgba(16,24,40,0.18)] transition-all motion-reduce:transition-none ${
          isVisible
            ? "translate-y-0 scale-100 opacity-100 duration-200 ease-out"
            : "translate-y-1 scale-95 opacity-0 duration-150 ease-in"
        } ${className}`.trim()}
      >
        {title && (
          <h3 id={titleId} className="mb-6 text-2xl font-bold text-slate-950">
            {title}
          </h3>
        )}

        {children}

        {footer && <div className="mt-8 flex justify-end gap-3">{footer}</div>}
      </div>
    </div>,
    document.body,
  );
}

export default Modal;
