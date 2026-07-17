/**
 * PageShell — per docs/PROJECT_ARCHITECTURE.md §12. Wraps the existing
 * .page-wrap class (index.css: max-w-7xl container + responsive px)
 * so every page references one layout primitive instead of repeating
 * the className string.
 */
function PageShell({ as = "div", className = "", children, ...rest }) {
  const Tag = as;

  return (
    <Tag className={`page-wrap ${className}`.trim()} {...rest}>
      {children}
    </Tag>
  );
}

export default PageShell;
