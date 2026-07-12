import { Loader2Icon } from "lucide-react";

/**
 * Spinner — standardizes the current Loader/LoaderIcon inconsistency
 * flagged in docs/FRONTEND_AUDIT.md §8.3. Unopinionated on outer padding;
 * consumers control their own wrapper spacing (py-24 vs py-20 etc. today).
 */
const SIZE_CLASSES = {
  sm: "h-6 w-6",
  md: "h-12 w-12",
  lg: "h-16 w-16",
};

function Spinner({ size = "md", className = "", label, ...rest }) {
  const sizeClass = SIZE_CLASSES[size] || SIZE_CLASSES.md;

  return (
    <div className="flex flex-col items-center justify-center gap-3" role="status" {...rest}>
      <Loader2Icon className={`animate-spin text-emerald-600 ${sizeClass} ${className}`.trim()} aria-hidden="true" />
      {label ? <p className="text-sm subtle-text">{label}</p> : <span className="sr-only">Loading</span>}
    </div>
  );
}

export default Spinner;