/**
 * MiniLabel — wraps the .mini-label class (index.css): the system's only
 * "eyebrow" pattern (uppercase, tracked, 11px). See docs/DESIGN_SYSTEM.md §2.2/§2.3.
 */
function MiniLabel({ as = "p", className = "", children, ...rest }) {
  const Tag = as;

  return (
    <Tag className={`mini-label ${className}`.trim()} {...rest}>
      {children}
    </Tag>
  );
}

export default MiniLabel;