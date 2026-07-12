/**
 * StatusChip — wraps .status-chip (index.css) + a tone -> color mapping
 * matching current ad hoc usage (e.g. "status-chip bg-emerald-100 text-emerald-700").
 * Per docs/FRONTEND_AUDIT.md §6.1: a purely decorative status dot must be
 * aria-hidden if it's redundant with adjacent text (the default here).
 */
const TONE_CLASSES = {
  emerald: "bg-emerald-100 text-emerald-700",
  amber: "bg-amber-100 text-amber-700",
  sky: "bg-sky-100 text-sky-700",
  rose: "bg-rose-100 text-rose-700",
  neutral: "bg-slate-100 text-slate-700",
};

const DOT_TONE_CLASSES = {
  emerald: "bg-emerald-500",
  amber: "bg-amber-500",
  sky: "bg-sky-500",
  rose: "bg-rose-500",
  neutral: "bg-slate-400",
};

function StatusChip({ tone = "neutral", showDot = false, dotLabel, className = "", children, ...rest }) {
  const toneClass = TONE_CLASSES[tone] || TONE_CLASSES.neutral;
  const dotClass = DOT_TONE_CLASSES[tone] || DOT_TONE_CLASSES.neutral;

  return (
    <span className={`status-chip ${toneClass} ${className}`.trim()} {...rest}>
      {showDot && (
        <span
          className={`h-2 w-2 rounded-full ${dotClass}`}
          aria-hidden={dotLabel ? undefined : "true"}
        />
      )}
      {dotLabel && <span className="sr-only">{dotLabel}</span>}
      {children}
    </span>
  );
}

export default StatusChip;