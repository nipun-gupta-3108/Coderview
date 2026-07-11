# DEVELOPMENT_ROADMAP.md

**Status:** Execution plan derived from `FRONTEND_AUDIT.md`, `PROJECT_ARCHITECTURE.md`, `DESIGN_SYSTEM.md`, and `UI_WIREFRAMES.md`.
**Scope:** Frontend only. Backend APIs, auth flow (Clerk), and MongoDB schema are **not** touched in any sprint below. Where a sprint references backend behavior (e.g. Stream custom events), it uses existing SDK capabilities from the client only — no new backend routes, controllers, or models are introduced.
**Sequencing rule:** Each sprint is scoped to be shippable and independently testable. Sprints build strictly on top of prior sprints' outputs — no sprint depends on work from a later sprint.

---

## How to read this document

Every sprint includes:
- **Goal** — the single outcome the sprint exists to deliver.
- **Components** — design-system primitives or feature components touched, per `PROJECT_ARCHITECTURE.md` §5/§6.
- **Files to create** — new files, using the target paths from `PROJECT_ARCHITECTURE.md` §2.
- **Files to modify** — existing v1 files that change as a result.
- **Dependencies** — sprints or artifacts that must exist first.
- **Risks** — what could break or regress, and why.
- **Testing strategy** — how correctness is verified (manual QA pass, visual regression, a11y check, etc. — no test framework is currently installed, so this is explicit rather than assumed).
- **Definition of Done** — the checklist that gates moving to the next sprint.
- **Estimated effort** — rough sizing in engineer-days, assuming one frontend engineer familiar with the codebase.

---

## Sprint 0 — Foundation & Tooling

### Goal
Stand up the v2 folder skeleton and design tokens without touching any user-visible behavior. This is a pure scaffolding sprint — the app must build, run, and look pixel-identical to v1 at the end of it.

### Components
None yet (tokens only, per `DESIGN_SYSTEM.md` §22 summary block).

### Files to create
- `frontend/src/design-system/` (empty `primitives/`, `layout/`, `feedback/`, `tokens/`, `icons/` subfolders with `.gitkeep` or index barrels)
- `frontend/src/design-system/tokens/index.css` — the token block from `DESIGN_SYSTEM.md` §"Summary: Token Layer Recap" (`:root`, `[data-theme="dark"]`, `prefers-reduced-motion` block)
- `frontend/src/features/` (empty `auth/`, `dashboard/`, `problems/`, `workspace/`, `session/` subfolders)
- `frontend/src/hooks/` generic-hooks barrel (confirm existing hooks stay put until their sprint)

### Files to modify
- `frontend/src/index.css` — `@import` the new `design-system/tokens/index.css` instead of (or alongside) the existing `:root` block; no visual token values change yet, this is a structural move
- `README.md` / `frontend/README.md` — update "Project Structure" section to reflect the new top-level folders (documentation only)

### Dependencies
None — this is the first sprint.

### Risks
- **Import path breakage**: moving `:root` tokens into a new file risks a silent cascade failure if the import order changes relative to Tailwind's `@import "tailwindcss"`. Mitigate by keeping the new file imported immediately after Tailwind, matching current order.
- **Dead folders**: empty feature folders committed before their sprint can confuse contributors mid-migration. Mitigate with a short `README.md` per empty folder noting "populated in Sprint N."

### Testing strategy
- Full manual smoke test: run `npm run dev`, visit all 5 routes (`/`, `/dashboard`, `/problems`, `/problem/:id`, `/session/:id`), confirm no visual diff and no console errors.
- Run `npm run build` to confirm the Tailwind/Vite pipeline still resolves the new CSS import path.

### Definition of Done
- App builds and runs with zero visual or functional change.
- New folder structure exists and is committed.
- Token file matches `DESIGN_SYSTEM.md`'s token block verbatim.

### Estimated effort
0.5–1 day

---

## Sprint 1 — Design System Primitives (Static)

### Goal
Build the non-interactive design-system primitives that every feature component will consume, per `PROJECT_ARCHITECTURE.md` §5 and §10, and `DESIGN_SYSTEM.md` §6–§9, §14–§15, §18. No existing page wiring changes yet — primitives are built and visually verified in isolation only.

### Components
`Panel` / `PanelStrong` / `PanelDark`, `IconChip`, `MiniLabel`, `StatusChip`, `SectionKicker`, `Badge` (base) → `DifficultyBadge` (thin wrapper), `EmptyState`, `ErrorState`, `Spinner`/`SkeletonCard`.

### Files to create
- `frontend/src/design-system/primitives/Panel.jsx`
- `frontend/src/design-system/primitives/IconChip.jsx`
- `frontend/src/design-system/primitives/MiniLabel.jsx`
- `frontend/src/design-system/primitives/StatusChip.jsx`
- `frontend/src/design-system/primitives/SectionKicker.jsx`
- `frontend/src/design-system/primitives/Badge.jsx`
- `frontend/src/design-system/feedback/EmptyState.jsx`
- `frontend/src/design-system/feedback/ErrorState.jsx`
- `frontend/src/design-system/feedback/Spinner.jsx`
- `frontend/src/design-system/feedback/SkeletonCard.jsx`
- `frontend/src/features/problems/components/DifficultyBadge.jsx` (feature-level wrapper around `Badge`, per `PROJECT_ARCHITECTURE.md` §6)

### Files to modify
- `frontend/src/lib/utils.js` — `getDifficultyBadgeClass` logic relocates into `DifficultyBadge`; keep the exported function in place (marked deprecated in a comment) until Sprint 3/4 finish migrating all call sites, to avoid a big-bang breaking change.

### Dependencies
Sprint 0 (tokens must exist for primitives to consume).

### Risks
- **Class-string drift**: existing CSS classes (`surface-panel`, `icon-chip`, `status-chip`) already exist in `index.css`. Primitives must consume those exact classes rather than re-implementing styles, or visuals will silently diverge from `DESIGN_SYSTEM.md` §6/§11's "signature radius/shadow" rules.
- **Premature adoption pressure**: because primitives exist, there's a temptation to start swapping them into pages mid-sprint. Resist — swapping happens in each feature's own sprint so risk is isolated per page.

### Testing strategy
- Build a temporary, throwaway route or Storybook-less manual harness (a scratch page, deleted before merge) rendering every primitive with its documented variants (`Badge tone="success"|"warning"|"error"`, `Panel variant="default"|"strong"|"dark"`) to visually diff against current `surface-panel`/`badge-*` usage.
- Manual contrast check against `DESIGN_SYSTEM.md` §22.1 (4.5:1 body text) for `Badge` and `StatusChip` text-on-fill combinations.

### Definition of Done
- All primitives listed above exist, accept the documented props, and visually match current `index.css` class output exactly (no visual delta).
- No existing page has been modified to use them yet (that's explicitly deferred to later sprints, to keep this sprint's blast radius at zero).

### Estimated effort
2 days

---

## Sprint 2 — Layout Primitives & Interactive Primitives

### Goal
Complete the primitive layer with interactive/layout components (`Button`, `Select`, `Modal`, `ResizableSplit`, `PageShell`) so that Sprints 3+ have everything they need without re-opening this layer later.

### Components
`Button` (primary/secondary/outline/destructive per `DESIGN_SYSTEM.md` §7), `Select`, `Modal`, `ResizableSplit`, `PageShell`.

### Files to create
- `frontend/src/design-system/primitives/Button.jsx`
- `frontend/src/design-system/primitives/Select.jsx`
- `frontend/src/design-system/primitives/Modal.jsx`
- `frontend/src/design-system/layout/ResizableSplit.jsx` (thin wrapper around `react-resizable-panels`, baking in the gradient `PanelResizeHandle` styling already defined in `ProblemPage.jsx`/`SessionPage.jsx`)
- `frontend/src/design-system/layout/PageShell.jsx` (wraps the existing `page-wrap` class)

### Files to modify
None yet — same isolation principle as Sprint 1.

### Dependencies
Sprint 1 (shares token/class conventions).

### Risks
- **Modal a11y scope creep**: `Modal`'s focus-trap and `role="dialog"`/`aria-modal` wiring (per `DESIGN_SYSTEM.md` §10 and `PROJECT_ARCHITECTURE.md` §14, and `FRONTEND_AUDIT.md` §6.4) is nontrivial. Keep this sprint's `Modal` scope to the documented spec only; don't gold-plate with animation variants not in `DESIGN_SYSTEM.md` §10.
- **ResizableSplit keyboard accessibility** (`FRONTEND_AUDIT.md` §6.4 sibling note, `DESIGN_SYSTEM.md` §22.5) — arrow-key resize on a focused handle is called out as required but is easy to under-scope. Explicitly test Tab-to-handle + Arrow-key resize before calling this primitive done.

### Testing strategy
- Manual keyboard-only pass: Tab into `Modal`, confirm focus trap (Tab cycles within modal, Shift+Tab from first element wraps to last), confirm Escape closes (except destructive-confirmation variant, which requires explicit button per `DESIGN_SYSTEM.md` §10).
- Manual keyboard-only pass on `ResizableSplit`: Tab to a resize handle, use Arrow keys to resize, confirm panel respects `minSize` floors from `DESIGN_SYSTEM.md` §13.
- Screen reader spot-check (VoiceOver or NVDA) on `Modal` open/close announcing "dialog."

### Definition of Done
- All five primitives exist, pass the keyboard/a11y checks above, and match `DESIGN_SYSTEM.md` visual specs.
- `Modal` and `ResizableSplit` in particular are verified against the exact a11y line items in `DESIGN_SYSTEM.md` §22.4–§22.5 before sign-off.

### Estimated effort
3 days (Modal a11y and ResizableSplit keyboard support are the long poles)

---

## Sprint 3 — Dashboard Feature Migration

### Goal
Migrate the Dashboard page onto the new primitives and collapse `ActiveSessions`/`RecentSessions` into a single `SessionCard` + list pattern, per `FRONTEND_AUDIT.md` §1.1 (analogous duplication issue) and `PROJECT_ARCHITECTURE.md` §6/§20. Fix the flagged empty-third-column grid gap and the mojibake bullet character as part of this pass since both live in this page's component tree (§4.5, §UI_WIREFRAMES.md callout).

### Components
`SessionCard` (variant-driven: `"active"` | `"recent"`), feature-level `WelcomeSection`, `StatsCards` (rebuilt on `Panel`/`IconChip`/`StatusChip`), `CreateSessionFlow` (wraps `CreateSessionModal` on the new `Modal` primitive).

### Files to create
- `frontend/src/features/dashboard/components/SessionCard.jsx`
- `frontend/src/features/dashboard/components/SessionList.jsx` (renders `SessionCard[]`, owns loading/empty state via `EmptyState`/`SkeletonCard`)
- `frontend/src/features/dashboard/components/WelcomeSection.jsx`
- `frontend/src/features/dashboard/components/StatsCards.jsx`
- `frontend/src/features/dashboard/CreateSessionFlow/CreateSessionModal.jsx`
- `frontend/src/features/dashboard/hooks/useDashboardData.js` (composes `useActiveSessions` + `useMyRecentSessions`)

### Files to modify
- `frontend/src/pages/DashboardPage.jsx` — shrink to composition only, per `PROJECT_ARCHITECTURE.md` §4 ("~30–50 lines"); delegates to `useDashboardData` and the new feature components
- Delete (after migration verified): `frontend/src/components/ActiveSessions.jsx`, `frontend/src/components/RecentSessions.jsx`, `frontend/src/components/StatsCards.jsx`, `frontend/src/components/WelcomeSection.jsx`, `frontend/src/components/CreateSessionModal.jsx` — superseded by the feature-folder versions
- `frontend/src/hooks/useSessions.js` — no logic change; confirm it's re-exported/imported cleanly from the new feature hook

### Dependencies
Sprints 1–2 (all primitives this sprint consumes must exist).

### Risks
- **Grid layout regression**: `UI_WIREFRAMES.md` explicitly flags the current `lg:col-span-2` empty-third-column gap as "worth flagging... not silently altering grid math." This sprint does touch that markup (since `StatsCards`/`ActiveSessions` are being rebuilt) — the fix must be a deliberate, called-out decision to the team, not an incidental change buried in the refactor diff.
- **`isUserInSession` prop drilling**: `FRONTEND_AUDIT.md` §1.5 flags this as a sign a `sessionPermissions` utility is missing. This sprint is the natural place to introduce `lib/sessionPermissions.js` (`isHost`, `isParticipant`, `canJoin`) rather than carry the prop-drilled closure into the new `SessionCard`.
- **Variant prop over-fitting**: `SessionCard`'s `variant="active"|"recent"` must cover both call sites' actual differing fields (Join/Rejoin/Full button vs. date/status chip) without the component growing an unbounded prop surface. Keep the variant contract to exactly the fields both `ActiveSessions.jsx` and `RecentSessions.jsx` currently render — no speculative additions.

### Testing strategy
- Manual regression pass against `UI_WIREFRAMES.md` §2 wireframes at all four breakpoints (1440/1280/768/390).
- Confirm mojibake bullet fix is not present anywhere in `SessionCard`/dashboard output (grep for `�` post-migration).
- Manual test: create a session, join a session from another browser/incognito session, confirm `SessionCard`'s Join/Rejoin/Full state logic matches `ActiveSessions.jsx`'s original behavior exactly (host cannot join own session, full sessions show "Full", etc.).
- Cross-check `StatsCards` counts against dashboard data after the hook consolidation (`useDashboardData`) to confirm no off-by-one or stale-cache regression versus the two independent `useQuery` calls it replaces.

### Definition of Done
- `DashboardPage.jsx` is composition-only; all list/card rendering lives in `features/dashboard`.
- No behavioral regression versus v1 (join/rejoin/full/create flows unchanged).
- Old flat-file dashboard components are deleted, not left as dead code.
- Grid-gap and mojibake fixes are called out explicitly in the PR description as intentional, not incidental.

### Estimated effort
4 days

---

## Sprint 4 — Problems Feature Migration

### Goal
Migrate `/problems` onto `features/problems`, extracting `ProblemCard` and `ProblemStatsBar` per `PROJECT_ARCHITECTURE.md` §6, and finish retiring `getDifficultyBadgeClass` direct call sites in favor of `DifficultyBadge` everywhere.

### Components
`ProblemCard`, `ProblemList`, `ProblemStatsBar`, `DifficultyBadge` (already built in Sprint 1, wired in here).

### Files to create
- `frontend/src/features/problems/components/ProblemCard.jsx`
- `frontend/src/features/problems/components/ProblemList.jsx`
- `frontend/src/features/problems/components/ProblemStatsBar.jsx`
- `frontend/src/features/problems/hooks/useProblemList.js` (thin wrapper over `data/problems.js` — no backend change, purely a local-data hook so future server-backed problems, per `README.md`'s roadmap note, have a seam to land in)

### Files to modify
- `frontend/src/pages/ProblemsPage.jsx` — shrink to composition only
- `frontend/src/data/problems.js` — **no logic change**; confirm `difficulty` casing (`"Easy"` vs backend's lowercase `"easy"`) inconsistency noted in `FRONTEND_AUDIT.md` §8.4 is documented with a code comment at the top of the file, since fixing the casing mismatch itself is out of scope (would touch `Session` model expectations) unless explicitly requested later

### Dependencies
Sprints 1, 3 (`DifficultyBadge` from Sprint 1; consistent feature-folder pattern established in Sprint 3).

### Risks
- **Difficulty casing mismatch masking a real bug**: `DifficultyBadge`'s `.toLowerCase()` normalization (inherited from `getDifficultyBadgeClass`) currently papers over a data inconsistency between `data/problems.js` (`"Easy"`) and the backend `Session` enum (`"easy"`). This sprint must preserve that normalization exactly — do not "fix" the casing at the data layer, since `Session` model boundaries are out of scope per this roadmap's constraints.

### Testing strategy
- Visual diff against `UI_WIREFRAMES.md` §3 at all four breakpoints.
- Confirm `ProblemStatsBar` counts (`Total`/`Easy`/`Medium`/`Hard`) match pre-migration values exactly for the current 5-problem dataset in `data/problems.js`.
- Grep the codebase for remaining direct `getDifficultyBadgeClass` imports outside `DifficultyBadge` itself — should be zero after this sprint (dashboard's `SessionCard` from Sprint 3 should already be migrated).

### Definition of Done
- `ProblemsPage.jsx` is composition-only.
- Single source of truth for difficulty badge styling (`DifficultyBadge`) is used everywhere; `lib/utils.js`'s raw export can now be deleted or kept as an internal implementation detail of `DifficultyBadge` only.

### Estimated effort
2 days

---

## Sprint 5 — Workspace Core: Problem Panel, Editor, Output Console

### Goal
Begin the highest-leverage refactor identified in `FRONTEND_AUDIT.md` §1.1/§1.2 and formalized in `PROJECT_ARCHITECTURE.md` §2/§6: extract the shared "workspace" primitives (`ProblemPanel`, `CodeEditor`, `OutputConsole`) that `ProblemPage` and `SessionPage` will both consume. This sprint does **not** yet touch `ProblemPage.jsx`/`SessionPage.jsx` themselves — it only builds and unit-verifies the shared pieces in isolation, reducing risk before the page-level rewrite in Sprint 7–8.

### Components
`ProblemPanel` (decomposed into `ProblemPanelHeader`, `ProblemDescriptionBlock`, `ExamplesBlock`, `ConstraintsBlock`), `CodeEditor` (wraps existing `CodeEditorPanel` + `LanguageSyncIndicator`), `OutputConsole` (decomposed `OutputPanel` into `SuccessOutput`/`ErrorOutput`/`EmptyOutput`).

### Files to create
- `frontend/src/features/workspace/components/ProblemPanel/ProblemPanelHeader.jsx`
- `frontend/src/features/workspace/components/ProblemPanel/ProblemDescriptionBlock.jsx`
- `frontend/src/features/workspace/components/ProblemPanel/ExamplesBlock.jsx`
- `frontend/src/features/workspace/components/ProblemPanel/ConstraintsBlock.jsx`
- `frontend/src/features/workspace/components/ProblemPanel/index.jsx` (composes the four blocks above; replaces `ProblemDescription.jsx`'s monolithic body)
- `frontend/src/features/workspace/components/CodeEditor/LanguageSyncIndicator.jsx` (extracted from `CodeEditorPanel.jsx`'s inline sync-indicator markup)
- `frontend/src/features/workspace/components/CodeEditor/index.jsx` (wraps existing `CodeEditorPanel.jsx` behavior, now composed with `LanguageSyncIndicator`)
- `frontend/src/features/workspace/components/OutputConsole/SuccessOutput.jsx`
- `frontend/src/features/workspace/components/OutputConsole/ErrorOutput.jsx`
- `frontend/src/features/workspace/components/OutputConsole/EmptyOutput.jsx`
- `frontend/src/features/workspace/components/OutputConsole/index.jsx`

### Files to modify
- None in `pages/` yet. `frontend/src/components/ProblemDescription.jsx`, `CodeEditorPanel.jsx`, `OutputPanel.jsx` remain as-is and in place — still imported by the untouched `ProblemPage.jsx`/`SessionPage.jsx` — until Sprint 7/8 cut over. This sprint is additive only.

### Dependencies
Sprints 1–2 (primitives), since `ProblemPanel`'s blocks should render on `Panel`, and `ExamplesBlock` reuses `StatusChip` for the `example N` chip currently hardcoded in `ProblemDescription.jsx`.

### Risks
- **Mojibake bullet regression**: `ConstraintsBlock` must fix the `�` character bug (`FRONTEND_AUDIT.md` §4.5) as part of extraction — replace with a real `•` glyph. This is explicitly called out so it isn't silently carried forward into the new component.
- **Building in isolation without a harness**: since no test framework exists, these components risk being "verified" only by eyeballing extracted JSX. Mitigate by temporarily rendering the new `ProblemPanel`/`CodeEditor`/`OutputConsole` inside the *existing*, untouched `ProblemPage.jsx` behind a feature flag or a commented-out swap, confirmed visually identical, then reverting the page file before merge (keeping this sprint's diff additive-only as stated above).

### Testing strategy
- Temporary side-by-side render (old `ProblemDescription`/`CodeEditorPanel`/`OutputPanel` vs. new decomposed versions) in a scratch route, comparing pixel output for all 5 problems in `data/problems.js` and both success/error/empty output states.
- Confirm `ExamplesBlock` renders correctly for problems with and without an `explanation` field (both cases exist in `data/problems.js`).
- Confirm `ConstraintsBlock` bullet renders as `•`, not `�`, across all 5 problems' constraint lists.

### Definition of Done
- All new workspace components exist, are visually verified against current output, and the mojibake bug is fixed at the source.
- Zero changes to `pages/ProblemPage.jsx` or `pages/SessionPage.jsx` in this sprint's merged diff.

### Estimated effort
4 days

---

## Sprint 6 — Workspace AI Actions Consolidation

### Goal
Collapse the triplicated Hint/Review/Explain blocks (`FRONTEND_AUDIT.md` §1.1, §3.1, §7.1) into a single `AIActionCard` component driven by one generic `useAIAction` hook, migrated onto `useMutation` per the audit's recommendation. This directly resolves the largest state-duplication smell in the codebase (6 `useState` pairs → 3 mutation objects).

### Components
`AIActionCard` (wraps existing `AIInsightCard` display logic + button/loading state), `useAIAction(kind)` hook.

### Files to create
- `frontend/src/features/workspace/components/AIPanel/AIActionCard.jsx`
- `frontend/src/features/workspace/components/AIPanel/AIInsightCard.jsx` (relocated, `parseSections` logic **kept exactly as-is** per `PROJECT_ARCHITECTURE.md` §20 — only the file's location changes, plus the `useMemo` fix from `FRONTEND_AUDIT.md` §7.5)
- `frontend/src/features/workspace/hooks/useAIAction.js` (parameterized `'hint' | 'review' | 'explain'`, wraps `lib/ai.js`'s existing three functions in `useMutation`)
- `frontend/src/features/workspace/hooks/useCodeExecution.js` (wraps `executeCode` from `lib/OneCompiler.js` + loading state, per `PROJECT_ARCHITECTURE.md` §8)

### Files to modify
- `frontend/src/components/AIInsightCard.jsx` — deleted after relocation confirmed working (superseded by the feature-folder copy)
- `frontend/src/lib/ai.js` — **no logic change** (already normalizes to `{success, error}`, which `useAIAction` will consume as-is, per `PROJECT_ARCHITECTURE.md` §9/§16)

### Dependencies
Sprint 5 (workspace folder structure and conventions already established there).

### Risks
- **Hint-level reset semantics**: `useAIAction('hint')` must reproduce the exact `Math.min(hintLevel + 1, 3)` capping behavior currently duplicated in both `ProblemPage.jsx` and `SessionPage.jsx`, including the "reset to 0 on language/problem change" behavior. Losing this on migration would silently change product behavior (users could exceed 3 hints, or hints could fail to reset).
- **Toast message parity**: current handlers fire specific toast copy per action (`"Hint N ready"`, `"AI review ready"`, `"AI explanation ready"`) — `useAIAction` must preserve per-kind messaging, not a generic "AI response ready" that would flatten useful feedback.
- **`AIInsightCard`'s implicit backend contract** (`FRONTEND_AUDIT.md` §1.4): the regex-based `parseSections` coupling to `aiController.js`'s exact header strings (`Verdict:`, `Bug Risk:`, etc.) is a real fragility this sprint does **not** fix (that would require a backend response-shape change, explicitly out of scope per this roadmap's constraints). Document this contract with an inline code comment referencing `backend/src/controllers/aiController.js` so the fragility is at least visible, per the audit's "at minimum, colocate a comment" recommendation.

### Testing strategy
- Manual pass: request all 3 hint levels in sequence, confirm level caps at 3 and button label/disabled state matches current `ProblemPage.jsx` behavior exactly ("Get Hint" → "Next Hint" → "Max Hints Used").
- Manual pass: trigger Review and Explain independently, confirm each renders in its own card with correct accent color (`emerald`/`sky`/`amber` per current usage) and toast copy.
- Confirm hint/review/explanation state all reset correctly on problem-switch and language-switch, matching the `useEffect` reset blocks currently in both page files.
- Force an API error (e.g. temporarily break `OPENROUTER_API_KEY` locally) and confirm error toasts still surface via `useMutation`'s `onError`, matching current `toast.error(result.error || fallback)` behavior.

### Definition of Done
- `AIActionCard` + `useAIAction` fully replace the 3× duplicated handler pattern in both future page rewrites (verified functionally, even though `ProblemPage.jsx`/`SessionPage.jsx` aren't cut over until Sprints 7–8).
- Backend prompt/header contract is documented inline.
- `useMemo` wrap on `parseSections` is present (closes `FRONTEND_AUDIT.md` §7.5).

### Estimated effort
3 days

---

## Sprint 7 — WorkspaceLayout & ProblemPage Rewrite

### Goal
Assemble `WorkspaceLayout` (the shared resizable-pane shell from `PROJECT_ARCHITECTURE.md` §2/§4/§12) and cut `ProblemPage.jsx` over to it, shrinking the page to a thin composition file. This is the first sprint that touches a live, routed page's actual file.

### Components
`WorkspaceLayout` (parameterized by `mode: 'solo' | 'collaborative'`), rewritten `ProblemPage`.

### Files to create
- `frontend/src/features/workspace/components/WorkspaceLayout.jsx`
- `frontend/src/features/workspace/hooks/useWorkspaceState.js` (single reducer consolidating `language`, `code`, `output`, `ai.{hint, hintLevel, review, explanation}`, loading flags, per `PROJECT_ARCHITECTURE.md` §7 tier 2 and §8)

### Files to modify
- `frontend/src/pages/ProblemPage.jsx` — rewritten to `<WorkspaceLayout mode="solo" problemId={id} />`, target ~40–60 lines per `PROJECT_ARCHITECTURE.md` §2/§20
- `frontend/src/components/ProblemDescription.jsx`, `frontend/src/components/CodeEditorPanel.jsx`, `frontend/src/components/OutputPanel.jsx` — deleted once `ProblemPage.jsx`'s new render tree is confirmed to fully replace them (no other page still imports the old versions after this sprint, since `SessionPage.jsx` migration is Sprint 8)
- `frontend/src/lib/confetti.js` (**new file**, extracted from `ProblemPage.jsx`'s inline `triggerConfetti`) — created here per `PROJECT_ARCHITECTURE.md` §15, since `SessionPage` will need it in Sprint 8
- `frontend/src/lib/testRunner.js` (**new file**) — `normalizeOutput`/`checkIfTestsPassed` extracted from `ProblemPage.jsx`'s inline function declarations, per `FRONTEND_AUDIT.md` §1.3, becoming reusable, testable, non-recreated-per-render pure functions

### Dependencies
Sprints 5 and 6 (all workspace sub-components and the AI action hook must exist and be verified first).

### Risks
- **This is the highest-risk sprint so far**: `ProblemPage.jsx` is a live, routed, user-facing page with test-pass confetti, AI panels, and Monaco integration all wired together. A regression here is directly visible to users. Mitigate with a feature-branch soak period and a full manual regression checklist (below) before merge, not just spot checks.
- **Losing the "tests passed" flow**: `checkIfTestsPassed`'s output-normalization logic (bracket/comma spacing tolerance) is easy to subtly change during extraction. Any drift changes which submissions are marked as passing — verify byte-for-byte identical logic, not just "looks similar."
- **`useWorkspaceState` reducer scope creep**: per `PROJECT_ARCHITECTURE.md` §7, this reducer must **only** hold feature-local UI state — it must not accidentally absorb server-cache concerns (e.g. session data), which stays in TanStack Query per the three-tier rule.

### Testing strategy
- Full regression checklist per problem in `data/problems.js` (all 5): switch language (all 4), run code with a correct solution (confirm confetti + success toast), run code with an incorrect solution (confirm error toast, no confetti), request all 3 hint levels, request review, request explanation, switch to a different problem via the "switch problem" selector (confirm all AI/output state resets).
- Confirm `normalizeOutput`/`checkIfTestsPassed` produce identical pass/fail results as pre-refactor for at least one deliberately-malformed-but-equivalent output string per problem (e.g. extra whitespace around brackets), to catch subtle extraction bugs.
- Bundle-size sanity check (not a hard gate yet — full code-splitting is Sprint 10) to confirm the refactor didn't accidentally inline something newly duplicated.

### Definition of Done
- `ProblemPage.jsx` is a thin composition wrapper (~40–60 lines) rendering `WorkspaceLayout` in solo mode.
- All manual regression checklist items pass with zero behavioral drift from pre-refactor `ProblemPage.jsx`.
- `lib/confetti.js` and `lib/testRunner.js` exist as standalone, exported pure functions/utilities.

### Estimated effort
5 days

---

## Sprint 8 — Session Feature & SessionPage Rewrite

### Goal
Decompose `VideoCallUI` and cut `SessionPage.jsx` over to `WorkspaceLayout` in collaborative mode, per `PROJECT_ARCHITECTURE.md` §2/§6/§8/§20. This sprint also fixes the two real-time-transport-misuse issues flagged in `FRONTEND_AUDIT.md` §3.2 (code-sync-via-chat-messages) and §7.1 (status polling instead of push), since both live entirely in the frontend Stream SDK usage and require no backend change.

### Components
`SessionHeader`, `CallStage`, `CallControlsBar`, `ChatDrawer` (decomposed from `VideoCallUI.jsx`), `useSessionLifecycle` hook, rewritten `useCodeSync` (custom-events transport), rewritten `SessionPage`.

### Files to create
- `frontend/src/features/session/components/SessionHeader.jsx` (host name, participant count, End Session button, host/participant role indicator per `FRONTEND_AUDIT.md` §4.6)
- `frontend/src/features/session/components/CallStage.jsx` (wraps `SpeakerLayout`)
- `frontend/src/features/session/components/CallControlsBar.jsx`
- `frontend/src/features/session/components/ChatDrawer.jsx`
- `frontend/src/features/session/components/VideoCallUI.jsx` (composes the four above; replaces the monolithic original)
- `frontend/src/features/session/components/EndSessionButton.jsx` (rebuilt on the new `Modal` primitive from Sprint 2, replacing the native `confirm()` call flagged in `FRONTEND_AUDIT.md` §4.3)
- `frontend/src/features/session/hooks/useSessionLifecycle.js` (extracts the auto-join-on-mount + redirect-on-completed `useEffect`s currently inline in `SessionPage.jsx`, per `PROJECT_ARCHITECTURE.md` §8/§3.3)
- `frontend/src/lib/sessionPermissions.js` (if not already created in Sprint 3 — `isHost`, `isParticipant`, `canJoin`, consumed here and by `SessionHeader`)

### Files to modify
- `frontend/src/hooks/useCodeSync.js` — replace `channel.sendMessage`/`message.new` chat-hack transport with Stream's custom-events API (`channel.sendEvent` / client-side custom events), removing the visible `[Code Update - ...]` chat spam entirely (`FRONTEND_AUDIT.md` §3.2)
- `frontend/src/hooks/useSessions.js` — `useSessionById`'s `refetchInterval: 5000` polling is replaced with a Stream channel custom-event listener for session-ended notification (`FRONTEND_AUDIT.md` §7.1); the underlying `useQuery` for initial fetch stays, only the polling mechanism for "did it end" changes
- `frontend/src/hooks/useStreamClient.js` — light cleanup only (extract magic numbers per `PROJECT_ARCHITECTURE.md` §19), no structural rewrite
- `frontend/src/pages/SessionPage.jsx` — rewritten to `<WorkspaceLayout mode="collaborative"><VideoCallUI /></WorkspaceLayout>`, target ~40–60 lines
- `frontend/src/components/VideoCallUI.jsx` — deleted once the feature-folder version is confirmed working

### Dependencies
Sprint 7 (`WorkspaceLayout` must exist and be proven in solo mode first — collaborative mode is strictly additive on top of it).

### Risks
- **This is the highest-risk sprint in the entire roadmap.** It touches live video/chat infrastructure, a real-time sync mechanism, and a page with no automated test coverage today.
- **Custom-events migration correctness**: switching `useCodeSync` off chat messages onto custom events changes the wire format entirely. A late-joining participant's "no initial-state reconciliation" gap (`FRONTEND_AUDIT.md` §3.2) is **not** fixed by this sprint (that requires an explicit "request current state on join" mechanism, flagged in the audit as a larger, separate effort) — scope this sprint strictly to "stop polluting chat with sync messages," not "solve collaborative editing correctness," to avoid scope creep into CRDT/OT territory explicitly deferred by the audit itself.
- **Session-ended push notification**: replacing polling with a custom event requires the *host's* `endSession` mutation success to also broadcast a custom event on the shared channel (frontend-only: call `channel.sendEvent(...)` right after the existing `endSessionMutation` succeeds). This must not require any backend route change — verify the Stream Chat client SDK supports client-initiated custom events without a server round trip before starting; if it does not, **fall back to keeping the 5-second poll** rather than introducing a backend change out of scope for this roadmap.
- **Confetti parity gap**: `FRONTEND_AUDIT.md` explicitly notes `SessionPage` currently has *no* pass/fail confetti feedback, unlike `ProblemPage`. This sprint should decide, and document, whether to add it now (using the shared `lib/confetti.js` from Sprint 7) or explicitly defer — do not silently add or silently omit it without a call-out in the PR description.

### Testing strategy
- Two-browser (or browser + incognito) manual collaborative test: host creates a session, participant joins, confirm video/audio connect, confirm chat panel has zero sync-noise messages after the `useCodeSync` migration, confirm both parties see code edits propagate without stale/flicker regressions beyond what existed pre-migration.
- Confirm host-initiated "End Session" immediately updates the participant's view (custom-event push) rather than waiting up to 5 seconds, if the push mechanism is implemented; if the polling fallback is kept, confirm the 5s interval still behaves identically to pre-migration.
- Confirm `EndSessionButton`'s new `Modal`-based confirmation traps focus and requires explicit interaction (no accidental Escape-dismiss for this destructive action, per `DESIGN_SYSTEM.md` §10).
- Confirm `SessionHeader`'s role indicator now visibly distinguishes host vs. participant (`FRONTEND_AUDIT.md` §4.6), and that "Only the host can end this session" microcopy is present for participants.
- Regression-test the full AI panel + code execution flow inside collaborative mode, identical to the Sprint 7 checklist, since `WorkspaceLayout` is now shared.

### Definition of Done
- `SessionPage.jsx` is a thin composition wrapper rendering `WorkspaceLayout` in collaborative mode with `VideoCallUI`.
- Chat channel no longer receives synthetic `[Code Update - ...]` messages.
- Session-ended detection is push-based if technically feasible without backend changes, otherwise explicitly documented as deferred with the existing polling retained.
- Native `confirm()` is fully replaced by the `Modal`-based `EndSessionButton`.
- Role indicator and restricted-action microcopy are visible in the UI.

### Estimated effort
7 days (highest-risk, highest-effort sprint in the plan — budget contingency here first if the overall timeline needs to flex)

---

## Sprint 9 — Accessibility & Responsive Hardening

### Goal
Close the accessibility gaps cataloged in `FRONTEND_AUDIT.md` §6 and implement the responsive/mobile strategy from `UI_WIREFRAMES.md` §"Cross-cutting responsive rules" and `PROJECT_ARCHITECTURE.md` §11, specifically the tabbed mobile/tablet layout for `ProblemPage`/`SessionPage` below the `~1024px` breakpoint.

### Components
`useMediaQuery` hook, `WorkspaceUnavailableOnMobile` / tabbed-workspace fallback, `aria-live` wiring on `AIActionCard`, icon-button `aria-label` audit, `<select>` label association audit.

### Files to create
- `frontend/src/hooks/useMediaQuery.js` (single source of truth for the `MIN_WORKSPACE_WIDTH` breakpoint per `PROJECT_ARCHITECTURE.md` §11)
- `frontend/src/features/workspace/components/WorkspaceLayout.mobile.jsx` (or a mode branch inside `WorkspaceLayout.jsx` — implementation choice deferred to the engineer, but the tabbed pattern from `UI_WIREFRAMES.md` §4/§5 mobile wireframes must be implemented: Problem / Code / AI / Output tabs, with Video leading on `SessionPage` mobile per the wireframe's explicit "video should likely lead on tablet/mobile" call-out)

### Files to modify
- `frontend/src/features/workspace/components/AIPanel/AIActionCard.jsx` — wrap result region in `aria-live="polite"` (`FRONTEND_AUDIT.md` §6.5)
- `frontend/src/components/Navbar.jsx` — add `aria-label` to icon-only nav links at narrow viewports where text is visually hidden via `hidden sm:inline` (`FRONTEND_AUDIT.md` §6.2); note per the audit this must be an `aria-label` on the link itself, not reliance on the hidden span
- `frontend/src/features/session/components/ChatDrawer.jsx`, `frontend/src/features/session/components/CallControlsBar.jsx` — audit and add `aria-label`s to icon-only buttons (chat toggle, close chat) per `FRONTEND_AUDIT.md` §6.2
- `frontend/src/design-system/primitives/Select.jsx` and all its call sites (`CodeEditor`'s language select, `CreateSessionModal`'s problem select, `ProblemPanelHeader`'s "switch problem" select) — add proper `<label htmlFor>`/`id` association, visually hidden where the design doesn't want a visible label (`FRONTEND_AUDIT.md` §6.3)
- `frontend/src/features/session/components/VideoCallUI.jsx` (or its decomposed parts) — add `aria-hidden="true"` to the purely-decorative active-status dot(s) flagged in `FRONTEND_AUDIT.md` §6.1, or give them an accessible label if they're the sole carrier of state

### Dependencies
Sprints 7 and 8 (the workspace/session components being hardened here must already exist in their final composed form).

### Risks
- **Tabbed-layout scope is a genuine new interaction pattern**, explicitly flagged in `UI_WIREFRAMES.md` as "should be discussed with you before implementation, since it's a new interaction pattern, not a resize." This sprint should not proceed with the tabbed implementation without an explicit go-ahead checkpoint, even though it's included in this roadmap per the wireframes' own recommendation — treat the wireframe's proposal as the default, but confirm before building.
- **Monaco + video SDK accessibility ceiling**: `PROJECT_ARCHITECTURE.md` §14 notes Monaco's out-of-box accessibility is "reasonably accessible... no extra work needed" — do not over-invest here; the real gaps are in custom app chrome (modals, icon buttons, selects), not the third-party editor/video internals.

### Testing strategy
- Full keyboard-only pass across `Navbar`, `Select` instances, `ChatDrawer` toggle, and `EndSessionButton`'s modal, confirming every interactive element has a visible focus ring and an accessible name (verified via browser accessibility tree inspector, not just visual inspection).
- Screen reader pass (VoiceOver/NVDA) confirming `aria-live` regions announce new AI content without requiring the user to re-focus the panel.
- Responsive manual pass at exactly 768px and 390px viewport widths for `ProblemPage` and `SessionPage`, confirming the tabbed fallback engages below `~1024px` and that video leads on `SessionPage`'s mobile tab order per the wireframe.
- `prefers-reduced-motion` check: toggle OS-level reduced motion, confirm hover/modal transforms disable per `DESIGN_SYSTEM.md` §20 (this should already mostly work from the Sprint 0 token import, but verify against the newly-built tabbed transitions specifically).

### Definition of Done
- Every item in `FRONTEND_AUDIT.md` §6 (6.1–6.6) has a corresponding fix merged and manually verified.
- `ProblemPage`/`SessionPage` no longer render an unusable cramped 3-pane layout below `~1024px` — they render the agreed tabbed fallback instead.
- No `outline: none` without a replacement anywhere in the modified files.

### Estimated effort
5 days

---

## Sprint 10 — Performance, Polish & Final Regression

### Goal
Close out the remaining `FRONTEND_AUDIT.md` §7 performance items and `PROJECT_ARCHITECTURE.md` §13 strategy, then run a full cross-page regression pass before declaring the v2 rewrite complete.

### Components
Route-level code splitting, `React.memo` on list-item cards, final design-token consistency pass (`FRONTEND_AUDIT.md` §8.2 gradient-string deduplication).

### Files to create
None expected — this sprint is primarily modification and verification.

### Files to modify
- `frontend/src/App.jsx` — convert `ProblemPage`/`SessionPage` route imports to `React.lazy()` + a `Suspense` fallback (lightweight full-page loader per `PROJECT_ARCHITECTURE.md` §17), so Monaco and the Stream Video/Chat SDKs no longer load on `/dashboard` or `/problems` visits (`FRONTEND_AUDIT.md` §7.4)
- `frontend/src/features/dashboard/components/SessionCard.jsx`, `frontend/src/features/problems/components/ProblemCard.jsx` — wrap in `React.memo` (`FRONTEND_AUDIT.md` §7.2, relevant given the dashboard's polling-adjacent refetches)
- `frontend/src/design-system/tokens/index.css` — add a `--gradient-brand` reference and confirm every hardcoded instance of the three-stop gradient string (`Navbar.jsx`, `ActiveSessions`-derived `SessionCard.jsx`, `WelcomeSection.jsx`, `HomePage.jsx`) now references the single token instead of a repeated literal (`FRONTEND_AUDIT.md` §8.2)
- `frontend/src/features/workspace/hooks/useWorkspaceState.js` — confirm `problemData` derivation (`Object.values(PROBLEMS).find(...)`) is wrapped in `useMemo` keyed on the problem identifier, closing `FRONTEND_AUDIT.md` §7.2's keystroke-frequency recompute concern

### Dependencies
All prior sprints — this is the closing sprint and touches the fully-assembled application.

### Risks
- **Lazy-loading route regression**: a missing `Suspense` boundary or an incorrectly-scoped `React.lazy()` import can produce a blank screen on first navigation to `/problem/:id` or `/session/:id` in production builds specifically (dev server is more forgiving) — this must be verified against a production build (`npm run build && npm run preview`), not just `npm run dev`.
- **Gradient token migration touches four files simultaneously** (`Navbar`, `SessionCard`, `WelcomeSection`, `HomePage`) — a find/replace error here is visible on nearly every page. Do this as its own isolated commit within the sprint, verified with a full-app visual diff before combining with other Sprint 10 changes.

### Testing strategy
- Production build verification (`npm run build && npm run preview`) for all 5 routes, confirming lazy-loaded chunks resolve correctly and the `Suspense` fallback renders briefly then swaps to real content with no flash-of-blank-page.
- Network tab inspection: confirm Monaco and Stream Video/Chat bundle chunks are **not** present in the initial `/dashboard` page load's network waterfall, and **are** present only after navigating to `/problem/:id` or `/session/:id`.
- Full end-to-end manual regression across all 5 routes and both authenticated flows (solo practice, live collaborative session), re-running the Sprint 7 and Sprint 8 checklists in full as a final gate.
- Visual diff of the four gradient-consuming files pre/post token migration to confirm zero color drift.

### Definition of Done
- Dashboard/Problems list no longer pays Monaco/Stream Video bundle cost on initial load.
- All four hardcoded gradient literals are replaced by the single `--gradient-brand` token.
- `SessionCard`/`ProblemCard` are memoized.
- Full regression checklist (Sprints 3–9 combined) passes with zero known regressions.
- This roadmap's sprints are all merged to the target branch and the v2 rewrite is ready for release sign-off.

### Estimated effort
4 days

---

## Roadmap Summary

| Sprint | Focus | Effort | Cumulative Risk Level |
|---|---|---|---|
| 0 | Foundation & tokens | 0.5–1 day | Low |
| 1 | Static design-system primitives | 2 days | Low |
| 2 | Interactive/layout primitives | 3 days | Medium (Modal/keyboard a11y) |
| 3 | Dashboard migration | 4 days | Medium |
| 4 | Problems migration | 2 days | Low |
| 5 | Workspace core (isolated build) | 4 days | Medium |
| 6 | Workspace AI actions | 3 days | Medium |
| 7 | WorkspaceLayout + ProblemPage rewrite | 5 days | High |
| 8 | Session feature + SessionPage rewrite | 7 days | **Highest** |
| 9 | Accessibility & responsive hardening | 5 days | Medium |
| 10 | Performance & final regression | 4 days | Medium |

**Total estimated effort:** ~39.5–40 days for a single engineer (approximately 8 working weeks), before accounting for review cycles, contingency, or parallelization across engineers.

**Critical path:** Sprints 5 → 6 → 7 → 8 form the core rewrite chain and cannot be parallelized against each other. Sprints 1–4 (primitives, Dashboard, Problems) can run in parallel with a second engineer if headcount allows, since they don't block the workspace/session chain. Sprint 9 and 10 should not begin until Sprint 8 is fully merged and soaked, given how much of the accessibility and performance work directly touches the newly-rewritten `WorkspaceLayout`/`SessionPage`.