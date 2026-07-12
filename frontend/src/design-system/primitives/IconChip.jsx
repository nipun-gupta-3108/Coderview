/**
 * IconChip — wraps the .icon-chip class (index.css), which already defaults
 * to h-12 w-12 rounded-2xl. Size overrides below rely on utility classes
 * (emitted after @layer components) winning over the base class, the same
 * pattern already used ad hoc in ProblemsPage.jsx ("icon-chip h-14 w-14").
 */
const SIZE_CLASSES = {
  sm: "h-10 w-10 rounded-xl",
  md: "",
  lg: "h-14 w-14 rounded-2xl",
};

const ICON_SIZE_CLASSES = {
  sm: "h-5 w-5",
  md: "h-6 w-6",
  lg: "h-7 w-7",
};

function IconChip({ icon: Icon, size = "md", className = "", iconClassName = "", children, ...rest }) {
  const sizeClass = SIZE_CLASSES[size] ?? SIZE_CLASSES.md;
  const iconSizeClass = ICON_SIZE_CLASSES[size] || ICON_SIZE_CLASSES.md;

  return (
    <div className={`icon-chip ${sizeClass} ${className}`.trim()} {...rest}>
      {Icon ? <Icon className={`${iconSizeClass} ${iconClassName}`.trim()} aria-hidden="true" /> : children}
    </div>
  );
}

export default IconChip;