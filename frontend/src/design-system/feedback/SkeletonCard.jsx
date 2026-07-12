/**
 * SkeletonCard — per docs/DESIGN_SYSTEM.md §16, replaces a bare spinner for
 * multi-item grids (problem list, recent sessions) to avoid layout shift.
 * Uses Tailwind's built-in animate-pulse rather than a custom shimmer
 * keyframe, keeping this sprint additive-only (no token-layer CSS changes).
 */
function SkeletonCard({ lines = 3, showAvatar = false, className = "" }) {
  return (
    <div className={`surface-panel animate-pulse p-6 ${className}`.trim()} aria-hidden="true">
      {showAvatar && <div className="mb-4 h-12 w-12 rounded-2xl bg-slate-200/80" />}
      <div className="space-y-3">
        {Array.from({ length: lines }).map((_, index) => (
          <div key={index} className={`h-4 rounded-full bg-slate-200/80 ${index === 0 ? "w-2/3" : "w-full"}`} />
        ))}
      </div>
    </div>
  );
}

export default SkeletonCard;