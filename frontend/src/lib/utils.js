/**
 * @deprecated Kept in place for existing call sites (ProblemDescription,
 * RecentSessions, ActiveSessions, ProblemsPage) during the v2 migration.
 * New code should use DifficultyBadge (frontend/src/features/problems/components/DifficultyBadge.jsx)
 * instead of calling this directly. Scheduled for removal once Sprints 3/4
 * (docs/DEVELOPMENT_ROADMAP.md) finish migrating all call sites.
 */
export const getDifficultyBadgeClass = (difficulty) => {
  switch (difficulty?.toLowerCase()) {
    case "easy":
      return "badge-success";
    case "medium":
      return "badge-warning";
    case "hard":
      return "badge-error";
    default:
      return "badge-ghost";
  }
};