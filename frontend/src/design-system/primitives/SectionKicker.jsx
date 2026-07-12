/**
 * SectionKicker — wraps .section-kicker (index.css), used today as e.g.
 * <div className="section-kicker mb-6"><ZapIcon className="h-4 w-4" />realtime collaboration</div>
 */
function SectionKicker({ icon: Icon, className = "", children, ...rest }) {
  return (
    <div className={`section-kicker ${className}`.trim()} {...rest}>
      {Icon && <Icon className="h-4 w-4" aria-hidden="true" />}
      {children}
    </div>
  );
}

export default SectionKicker;