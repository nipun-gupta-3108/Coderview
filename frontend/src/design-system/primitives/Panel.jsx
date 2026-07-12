import { forwardRef } from "react";

/**
 * Panel — wraps the three existing surface classes defined in index.css.
 * variant: "default" -> .surface-panel, "strong" -> .surface-panel-strong, "dark" -> .surface-dark
 * See docs/DESIGN_SYSTEM.md §6 for the full spec these classes must match.
 */
const VARIANT_CLASSES = {
  default: "surface-panel",
  strong: "surface-panel-strong",
  dark: "surface-dark",
};

const Panel = forwardRef(function Panel(
  { variant = "default", as = "div", className = "", children, ...rest },
  ref
) {
  const variantClass = VARIANT_CLASSES[variant] || VARIANT_CLASSES.default;
  const Tag = as;

  return (
    <Tag ref={ref} className={`${variantClass} ${className}`.trim()} {...rest}>
      {children}
    </Tag>
  );
});

export default Panel;