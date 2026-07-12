/**
 * EmptyState — formalizes the anatomy already used in ActiveSessions.jsx /
 * RecentSessions.jsx: icon tile, bold headline, one supporting sentence,
 * optional CTA. See docs/DESIGN_SYSTEM.md §14.
 */
function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  iconClassName = "text-emerald-700/60",
  className = "",
}) {
  return (
    <div className={`py-20 text-center ${className}`.trim()}>
      {Icon && (
        <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-[28px] bg-[linear-gradient(135deg,rgba(20,83,45,0.14),rgba(14,165,233,0.12))]">
          <Icon className={`h-12 w-12 ${iconClassName}`} aria-hidden="true" />
        </div>
      )}
      <p className="text-xl font-bold text-slate-900">{title}</p>
      {description && <p className="mt-2 text-sm subtle-text">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

export default EmptyState;