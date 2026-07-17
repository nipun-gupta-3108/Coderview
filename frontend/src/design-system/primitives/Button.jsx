import { forwardRef } from "react";
import { Loader2Icon } from "lucide-react";

/**
 * Button — the four variants defined in docs/DESIGN_SYSTEM.md §7.
 * primary/secondary reuse the existing .action-button / .action-button-secondary
 * classes (index.css) so visuals stay pixel-identical to current usage.
 * outline/destructive are new here (no prior shared class existed for them —
 * they were previously hand-rolled per call site, e.g. ProblemPage.jsx's
 * "btn btn-outline rounded-2xl..." and SessionPage.jsx's inline error-gradient button).
 */
const VARIANT_CLASSES = {
  primary: "action-button",
  secondary: "action-button-secondary",
  outline:
    "inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-300 bg-white font-semibold text-slate-800 shadow-sm hover:bg-slate-50",
  destructive:
    "inline-flex items-center justify-center gap-2 rounded-full font-semibold text-white shadow-[0_14px_30px_rgba(190,18,60,0.28)] bg-[linear-gradient(135deg,#be123c_0%,#e11d48_100%)]",
};

const SIZE_CLASSES = {
  sm: "px-4 py-2 text-sm",
  md: "px-5 py-3 text-sm",
  lg: "px-6 py-3.5 text-base",
};

const Button = forwardRef(function Button(
  {
    variant = "primary",
    size = "md",
    loading = false,
    disabled = false,
    icon: Icon,
    iconPosition = "left",
    type = "button",
    className = "",
    children,
    ...rest
  },
  ref,
) {
  const isDisabled = disabled || loading;
  const variantClass = VARIANT_CLASSES[variant] || VARIANT_CLASSES.primary;
  const sizeClass = SIZE_CLASSES[size] || SIZE_CLASSES.md;

  return (
    <button
      ref={ref}
      type={type}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      className={`${variantClass} ${sizeClass} disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 motion-reduce:transition-none ${className}`.trim()}
      {...rest}
    >
      {loading ? (
        <Loader2Icon className="h-4 w-4 animate-spin" aria-hidden="true" />
      ) : (
        Icon &&
        iconPosition === "left" && (
          <Icon className="h-4 w-4" aria-hidden="true" />
        )
      )}
      {children}
      {!loading && Icon && iconPosition === "right" && (
        <Icon className="h-4 w-4" aria-hidden="true" />
      )}
    </button>
  );
});

export default Button;
