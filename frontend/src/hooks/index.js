/**
 * hooks/ barrel
 *
 * Per docs/PROJECT_ARCHITECTURE.md §2, this folder is documented as
 * "Cross-feature generic hooks only (useMediaQuery, useDebounce,
 * useLocalDraft)" going forward.
 *
 * As of Sprint 0, the existing domain hooks below still live here and are
 * NOT being moved or renamed. Per docs/PROJECT_ARCHITECTURE.md §8 and the
 * Sprint 3/8 entries in docs/DEVELOPMENT_ROADMAP.md, they are explicitly
 * kept in place ("already well-isolated and don't need rework" / "no
 * logic change") and are only lightly touched in their respective sprints:
 *
 *   - useSessions.js      -> touched in Sprint 3 (composed by useDashboardData)
 *   - useStreamClient.js  -> touched in Sprint 8 (magic-number extraction only)
 *   - useCodeSync.js      -> touched in Sprint 8 (chat-transport -> custom events)
 *
 * New cross-feature generic hooks (useMediaQuery first, per Sprint 9) get
 * added to this barrel when they're introduced. Existing call sites that
 * import hooks directly (e.g. `../hooks/useSessions`) continue to work
 * unchanged — this barrel is additive, not a required import path.
 */

export * from "./useSessions";
export { default as useStreamClient } from "./useStreamClient";
export { default as useCodeSync } from "./useCodeSync";
