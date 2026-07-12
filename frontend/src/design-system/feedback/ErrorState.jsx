import { AlertTriangleIcon, RefreshCwIcon } from "lucide-react";

/**
 * ErrorState — panel-level error per docs/DESIGN_SYSTEM.md §15: tinted
 * (not full-red) icon, plain-language message, optional Retry action.
 * Not used for fatal/blocking errors (e.g. video connection failure) —
 * that pattern in SessionPage.jsx stays as-is per the design system note.
 */
function ErrorState({
  title = "Something went wrong",
  description,
  onRetry,
  retryLabel = "Retry",
  className = "",
}) {
  return (
    <div className={`py-16 text-center ${className}`.trim()}>
      <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-[24px] bg-rose-100/70">
        <AlertTriangleIcon className="h-10 w-10 text-rose-600" aria-hidden="true" />
      </div>
      <p className="text-lg font-bold text-slate-900">{title}</p>
      {description && <p className="mt-2 text-sm subtle-text">{description}</p>}
      {onRetry && (
        <button type="button" onClick={onRetry} className="action-button-secondary mt-6 px-5 py-2.5 text-sm">
          <RefreshCwIcon className="h-4 w-4" aria-hidden="true" />
          {retryLabel}
        </button>
      )}
    </div>
  );
}

export default ErrorState;