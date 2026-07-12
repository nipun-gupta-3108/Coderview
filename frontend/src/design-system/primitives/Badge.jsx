/**
 * Badge — base primitive wrapping DaisyUI's badge classes exactly as used
 * today (badge badge-sm|badge-lg badge-success|badge-warning|badge-error|badge-ghost).
 * DifficultyBadge (features/problems) is the domain-aware wrapper around this.
 */
const TONE_CLASSES = {
  success: "badge-success",
  warning: "badge-warning",
  error: "badge-error",
  ghost: "badge-ghost",
};

const SIZE_CLASSES = {
  sm: "badge-sm",
  md: "",
  lg: "badge-lg",
};

function Badge({ tone = "ghost", size = "md", className = "", children, ...rest }) {
  const toneClass = TONE_CLASSES[tone] || TONE_CLASSES.ghost;
  const sizeClass = SIZE_CLASSES[size] ?? "";

  return (
    <span className={`badge font-semibold ${sizeClass} ${toneClass} ${className}`.trim()} {...rest}>
      {children}
    </span>
  );
}

export default Badge;