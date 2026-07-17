import { useId } from "react";
import { ChevronDownIcon } from "lucide-react";

/**
 * Select — per docs/DESIGN_SYSTEM.md §9. Trigger styled like a same-sized
 * input (solid bg, not translucent — inputs/selects are the one deliberate
 * exception to the surface-translucency pattern, §8). Supports an optional
 * associated <label> (visually hidden via hideLabel) so call sites migrated
 * in later sprints can close the FRONTEND_AUDIT.md §6.3 gap without this
 * primitive needing another API change.
 */
function Select({
  label,
  hideLabel = false,
  id,
  className = "",
  wrapperClassName = "",
  children,
  ...rest
}) {
  const generatedId = useId();
  const selectId = id || generatedId;

  return (
    <div className={`w-full ${wrapperClassName}`.trim()}>
      {label && (
        <label
          htmlFor={selectId}
          className={
            hideLabel
              ? "sr-only"
              : "mb-2 block text-sm font-semibold text-slate-800"
          }
        >
          {label}
        </label>
      )}

      <div className="relative">
        <select
          id={selectId}
          className={`h-11 w-full appearance-none rounded-[18px] border border-[var(--color-border)] bg-white px-4 pr-10 text-sm font-medium text-slate-900 shadow-sm transition-colors focus:border-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-600/20 motion-reduce:transition-none ${className}`.trim()}
          {...rest}
        >
          {children}
        </select>
        <ChevronDownIcon
          className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500"
          aria-hidden="true"
        />
      </div>
    </div>
  );
}

export default Select;
