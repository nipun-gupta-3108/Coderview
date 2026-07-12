import Badge from "../../../design-system/primitives/Badge";

/**
 * DifficultyBadge — domain-aware wrapper around the base Badge primitive.
 * Reproduces lib/utils.js's getDifficultyBadgeClass() output exactly
 * (badge-success/warning/error/ghost) with zero visual delta.
 *
 * lib/utils.js is intentionally left in place and unmigrated (see the
 * deprecation comment there) until Sprints 3/4 finish moving all call sites
 * over, per docs/DEVELOPMENT_ROADMAP.md Sprint 1.
 */
const DIFFICULTY_TONE = {
  easy: "success",
  medium: "warning",
  hard: "error",
};

function DifficultyBadge({ difficulty, size = "md", className = "", ...rest }) {
  const tone = DIFFICULTY_TONE[difficulty?.toLowerCase()] || "ghost";

  return (
    <Badge tone={tone} size={size} className={className} {...rest}>
      {difficulty}
    </Badge>
  );
}

export default DifficultyBadge;