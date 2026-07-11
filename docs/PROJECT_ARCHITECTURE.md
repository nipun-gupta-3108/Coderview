
---

## 1. Overall Architecture Philosophy

Three principles drive everything:

**a) Feature-Sliced, not Type-Sliced at the top level.** The current structure (`components/`, `pages/`, `hooks/`, `lib/`) is a "technical layer" structure — it groups by *what kind of file it is*, not *what it does*. That's fine at small scale, but `SessionPage.jsx` already does five jobs (video, chat, editor, AI, problem display) in one file. v2 organizes by **feature domain** first (`session/`, `problems/`, `dashboard/`), and by technical layer second, inside each feature. This is how large React codebases (and Vercel's own products) scale past ~50 components without becoming spaghetti.

**b) Server state and UI state are architecturally separate.** TanStack Query already does this correctly for server data (sessions, problems-from-API-if-ever-added). The mistake in v1 is that a lot of *derived* server state (hint level, AI panel content, sync status) is manually threaded through `useState` in page components. v2 draws a hard line: **TanStack Query owns anything that came from the network; local component/feature state owns anything that's purely interaction state; no third bucket.**

**c) Composition over configuration.** `SessionPage.jsx` and `ProblemPage.jsx` are ~90% identical (AI panel trio, code editor, problem description, output panel) with a video call bolted onto one of them. v2 treats "Practice Workspace" as one composable layout that both pages assemble from the same primitives, rather than two divergent page files.

---

## 2. Folder Structure

```
frontend/src/
├── app/                        # App shell, providers, routing
│   ├── providers/               # QueryClientProvider, ClerkProvider wiring, ThemeProvider
│   ├── routes/                  # route config (or App.jsx if staying with <Routes>)
│   └── AppShell.jsx              # Navbar + Toaster + Outlet
│
├── design-system/               # Pure UI primitives — zero business logic, zero API calls
│   ├── primitives/               # Button, Badge, Card, Panel, Chip, Select, Modal, Skeleton...
│   ├── layout/                    # PageShell, SurfacePanel, ResizableSplit, ScrollArea
│   ├── feedback/                  # Spinner, EmptyState, ErrorState, Toast wrappers
│   ├── tokens/                    # design tokens (colors, radii, shadows) as CSS vars / JS constants
│   └── icons/                     # thin wrapper around lucide-react if we need consistent sizing
│
├── features/
│   ├── auth/                     # Clerk-specific wrappers (SignInButton styling, UserMenu)
│   ├── dashboard/
│   │   ├── components/            # WelcomeSection, StatsCards, ActiveSessionsList, RecentSessionsList
│   │   ├── hooks/                  # useDashboardData (composes useActiveSessions + useMyRecentSessions)
│   │   └── CreateSessionFlow/       # CreateSessionModal + its internal steps
│   │
│   ├── problems/
│   │   ├── components/            # ProblemCard, ProblemList, ProblemFilters (future), DifficultyBadge
│   │   ├── data/                    # problems.js (unchanged), constants
│   │   └── hooks/                   # useProblem(id), useProblemList
│   │
│   ├── workspace/                 # THE shared core: editor + problem + AI + output
│   │   ├── components/
│   │   │   ├── ProblemPanel/        # ProblemDescription decomposed (Header, Examples, Constraints)
│   │   │   ├── CodeEditor/           # CodeEditorPanel + LanguageSelector + SyncIndicator
│   │   │   ├── OutputConsole/        # OutputPanel decomposed (SuccessOutput, ErrorOutput, EmptyOutput)
│   │   │   ├── AIPanel/              # generic AIInsightCard + AIActionCard (hint/review/explain use same shell)
│   │   │   └── WorkspaceLayout.jsx    # the 2-pane / 3-pane resizable shell itself
│   │   └── hooks/
│   │       ├── useCodeExecution.js
│   │       ├── useAIHint.js / useAIReview.js / useAIExplain.js (or one useAIActions.js)
│   │       └── useWorkspaceState.js   # language, code, output — local, not server state
│   │
│   ├── session/                   # Live collaboration-only concerns, layered ON TOP of workspace
│   │   ├── components/
│   │   │   ├── VideoCallUI/          # decomposed: CallStage, CallControls wrapper, ChatDrawer
│   │   │   ├── SessionHeader.jsx      # host info, participant count, End Session button
│   │   │   └── SessionStatusGate.jsx  # handles loading/full/completed/redirect states
│   │   └── hooks/
│   │       ├── useStreamClient.js     # kept, lightly refactored
│   │       ├── useCodeSync.js          # kept
│   │       └── useSessionLifecycle.js  # join-on-mount + completed-redirect logic extracted from SessionPage
│   │
│   └── connectors? (n/a for this project)
│
├── hooks/                        # Cross-feature generic hooks only (useMediaQuery, useDebounce, useLocalDraft)
├── lib/                           # axios instance, stream client factory, OneCompiler client, ai client
├── api/                          # thin fetch wrappers per resource (sessions.js kept, + problems.js if ever server-backed)
├── styles/                       # index.css, tailwind config, daisyui theme
└── pages/                        # THIN route components only — compose features, no logic
    ├── HomePage.jsx
    ├── DashboardPage.jsx
    ├── ProblemsPage.jsx
    ├── ProblemPage.jsx            # <WorkspaceLayout mode="solo" />
    └── SessionPage.jsx            # <WorkspaceLayout mode="collaborative"><VideoCallUI/></WorkspaceLayout>
```

Key idea: **`pages/*` shrink to ~30-50 lines each.** They fetch the top-level resource (session or problem), handle the loading/redirect gate, and hand off to feature components. All the real logic lives in `features/`.

---

## 3. Component Hierarchy

```
AppShell
 └─ Navbar (global)
 └─ <Outlet/> → Page
      ├─ DashboardPage
      │   ├─ WelcomeSection
      │   ├─ StatsCards
      │   ├─ ActiveSessionsList → SessionCard (new, extracted from ActiveSessions' .map)
      │   ├─ RecentSessionsList → SessionCard (same component, different props/variant)
      │   └─ CreateSessionFlow → CreateSessionModal
      │
      ├─ ProblemsPage
      │   └─ ProblemList → ProblemCard
      │
      ├─ ProblemPage / SessionPage  (both render WorkspaceLayout)
      │    WorkspaceLayout
      │     ├─ ResizableSplit (horizontal)
      │     │   ├─ ResizableSplit (vertical) — left column
      │     │   │    ├─ ProblemPanel
      │     │   │    │    ├─ ProblemPanelHeader
      │     │   │    │    ├─ ProblemDescriptionBlock
      │     │   │    │    ├─ ExamplesBlock
      │     │   │    │    └─ ConstraintsBlock
      │     │   │    └─ CodeEditor + OutputConsole (stacked)
      │     │   │         ├─ EditorToolbar (language select + sync indicator + run button)
      │     │   │         ├─ MonacoEditor wrapper
      │     │   │         ├─ AIActionCard × 3 (hint / review / explain — ONE component, 3 configs)
      │     │   │         └─ OutputConsole
      │     │   └─ right slot (mode-dependent)
      │     │        ProblemPage → nothing / stats
      │     │        SessionPage → VideoCallUI
      │     │                       ├─ SessionHeader
      │     │                       ├─ CallStage (SpeakerLayout wrapper)
      │     │                       ├─ CallControlsBar
      │     │                       └─ ChatDrawer (slide-in, reuses stream-chat-react)
```

The critical refactor: **`AIInsightCard` stays as a dumb display primitive**, but the three near-duplicate blocks in `SessionPage`/`ProblemPage` (hint card + review card + explain card, each with its own button/loading state wiring) collapse into **one `AIActionCard` component** parameterized by `{ title, description, actionLabel, onAction, isLoading, content, emptyText, accent }`. Three call sites, one component, one bug surface.

---

## 4. Page Hierarchy (routes)

Unchanged route table (backend/session-URL compatibility), but each page becomes a thin composition shell:

| Route | Responsibility of the page file |
|---|---|
| `/` | Marketing only — HomePage stays mostly presentational, could be split into `HeroSection`, `FeatureGrid` for readability but low priority |
| `/dashboard` | Fetch active + recent sessions, render dashboard feature |
| `/problems` | Fetch/list static problems, render list feature |
| `/problem/:id` | Resolve problem from id, render `WorkspaceLayout` in solo mode |
| `/session/:id` | Resolve session via `useSessionById`, gate on loading/redirect, render `WorkspaceLayout` in collaborative mode with `VideoCallUI` |

Auth gating (`isSignedIn` checks) stays exactly as-is in `App.jsx` — no reason to touch working, simple logic.

---

## 5. Shared Components (design-system/)

These have **zero knowledge of sessions, problems, or AI** — pure UI:

- `Panel`, `PanelStrong`, `PanelDark` → formalize `surface-panel`, `surface-panel-strong`, `surface-dark` CSS classes into components so consumers stop hand-writing class strings
- `Badge` (replaces ad-hoc `getDifficultyBadgeClass` usage — becomes `<DifficultyBadge difficulty="easy" />` in `features/problems`, built on top of a generic `Badge` primitive)
- `IconChip`, `MiniLabel`, `StatusChip`, `SectionKicker` — these are currently just CSS classes (`icon-chip`, `mini-label`, `status-chip`) applied ad hoc; promoting them to components lets us enforce prop-driven variants (color, size) instead of copy-pasted className strings
- `Button` (primary/secondary/ghost/danger variants) — replaces the mix of `action-button`, `action-button-secondary`, `btn btn-primary`, `btn btn-outline`, `btn bg-gradient...` currently scattered across files
- `Modal` — generic overlay/backdrop/close-on-click-outside, `CreateSessionModal` becomes a consumer, not a reimplementation
- `ResizableSplit` — thin wrapper around `react-resizable-panels` with our styled `PanelResizeHandle` baked in, so the gradient handle isn't copy-pasted 3× per page
- `EmptyState`, `ErrorState`, `LoadingState` — every list (`ActiveSessions`, `RecentSessions`, `ProblemsPage`) currently hand-rolls its own "no items" block; one component, icon + title + subtitle props
- `Select` — wraps the native `<select>` styling used in `CodeEditorPanel`, `CreateSessionModal`, `ProblemDescription`

---

## 6. Feature-Specific Components

Grouped by domain, each feature exports only what other features need (its own `index.js` barrel), keeping cross-feature imports intentional:

- **dashboard**: `SessionCard` (unifies `ActiveSessions`' and `RecentSessions`' near-identical article markup — active adds Join/Rejoin/Full button, recent adds date/status — via a `variant` prop and optional `actionSlot`), `StatsCards`, `WelcomeSection`
- **problems**: `ProblemCard`, `DifficultyBadge` (feature-level wrapper around design-system `Badge`), `ProblemStatsBar` (the 4-stat grid at the bottom of `ProblemsPage`)
- **workspace**: `ProblemPanel` (decomposed `ProblemDescription`), `CodeEditor`, `OutputConsole`, `AIActionCard`, `LanguageSyncIndicator`
- **session**: `VideoCallUI` decomposed into `CallStage`, `ChatDrawer`, `SessionHeader`, `EndSessionButton`

---

## 7. State Management Strategy

Three explicit tiers, no overlap:

1. **Server cache — TanStack Query.** All session/problem-from-backend data. Already correctly used via `useSessions.js`; v2 keeps this exactly, but adds a convention: **every mutation invalidates its precise query key**, not broad refetches, to avoid the current pattern where `onSuccess` sometimes calls `refetch()` manually (`SessionPage`'s join effect) instead of relying on query invalidation.

2. **Feature-local state — `useState`/`useReducer` scoped to `WorkspaceLayout`.** Code, selected language, output, hint level, AI panel contents. These are currently scattered as 12 separate `useState` calls across `SessionPage`/`ProblemPage`. v2 consolidates into a single `useWorkspaceState` reducer (`{ language, code, output, ai: { hint, hintLevel, review, explanation }, loading flags }`) with clear actions (`RUN_CODE_START`, `RUN_CODE_SUCCESS`, `LANGUAGE_CHANGED`, `AI_HINT_RECEIVED`...). This kills the current repeated "reset 5 states on language change" boilerplate — the reducer's `LANGUAGE_CHANGED` action resets everything in one place instead of two near-duplicate handlers in two files.

3. **Ephemeral UI state — local to leaf components.** Chat drawer open/closed, modal open/closed. Never lifted higher than needed (`VideoCallUI`'s `isChatOpen` is already correctly scoped this way — keep that pattern).

No global client state library (Zustand/Redux) is justified by this app's actual complexity — introducing one would be over-engineering for a 5-page app. If a genuine cross-page global need emerges later (e.g. persistent "currently syncing" indicator in the navbar), a small React Context is enough.

---

## 8. Custom Hooks Architecture

Layered by responsibility:

- **Data hooks** (`useSessions.js`, future `useProblems.js`) — pure TanStack Query wrappers, one per resource, kept exactly as-is structurally.
- **Domain behavior hooks** (`useStreamClient`, `useCodeSync`) — encapsulate one third-party integration each, kept as-is; these are already well-isolated and don't need rework.
- **Orchestration hooks** (new): `useSessionLifecycle(session, user)` extracts the two `useEffect`s currently inline in `SessionPage` (auto-join-on-mount, redirect-on-completed) into a testable hook that returns `{ isHost, isParticipant }`. This alone removes ~20 lines of effect logic from the page component and makes it unit-testable in isolation.
- **Workspace hooks**: `useCodeExecution()` wraps `executeCode` + loading state; `useAIAction(kind)` is a **single generic hook** parameterized by `'hint' | 'review' | 'explain'` that calls the right `lib/ai.js` function and manages its own loading/success/toast — replacing three near-identical handler blocks (`handleGetHint`, `handleReviewCode`, `handleExplainProblem`) duplicated across `SessionPage` and `ProblemPage` with one hook used three times per page.

Rule of thumb: **a hook exists only if it's used by ≥2 components, or if it meaningfully isolates a side-effect-heavy concern from a component's render logic.** No "hook for the sake of a hook."

---

## 9. API Layer Architecture

Kept close to current shape — it's already reasonable:

- `lib/axios.js` — single instance, unchanged (baseURL + credentials).
- `api/sessions.js` — resource-based client, unchanged; this is the right pattern (group by REST resource, not by page).
- `lib/ai.js`, `lib/OneCompiler.js` — kept as-is; each wraps one backend concern with consistent `{ success, error }` shape, which the new `useAIAction`/`useCodeExecution` hooks consume uniformly.
- New addition: `api/index.js` barrel so features import `import { sessionApi } from '@/api'` instead of deep-relative paths — small DX win, no behavior change.

No GraphQL, no codegen, no new abstraction — the REST + TanStack Query pairing already fits this backend's shape well. Over-architecting this layer for a 6-endpoint backend would be a mistake.

---

## 10. Design System Architecture

Currently the "design system" is entirely CSS classes in `index.css` (`surface-panel`, `action-button`, `icon-chip`, etc.) applied ad hoc via `className` strings in every component. That's a real risk: any visual change means grepping for a class name across dozens of files, and there's no way to enforce that a component using `icon-chip` also gets consistent sizing/spacing rules.

v2 keeps the *visual language* (it's good — warm, textured, distinctive, not generic SaaS-blue) but **wraps every recurring class combo in a component**:

- **Tokens layer**: CSS custom properties for color/radius/shadow stay in `index.css` (this part works fine and is Tailwind v4-idiomatic).
- **Primitive layer**: `design-system/primitives/*` — one component per current "pattern class" (`Panel`, `Badge`, `StatusChip`, `Button`, `IconChip`).
- **Composition layer**: feature components import primitives, never raw utility soup.
- Documented variants via props (`<Badge tone="success" size="sm">`) instead of memorized class name conventions (`badge-success` vs `bg-emerald-100 text-emerald-700` — v1 currently has *two different* systems for "success" coloring depending on which component you're in: DaisyUI badge classes in some places, raw Tailwind color classes in others). **Unifying this inconsistency is one of the highest-value changes in this whole redesign.**

---

## 11. Responsive Strategy

Current app is desktop-first (three-pane resizable layout assumes wide screens; `hidden sm:inline` sprinkled on nav labels is the only real mobile concession). Realistically, a Monaco editor + video call + chat is not a good mobile experience — so the strategy is:

- **Dashboard, Problems list, Home**: fully responsive, mobile-first grid collapse (already mostly true via Tailwind's `sm:`/`md:`/`lg:` breakpoints in `StatsCards`, `RecentSessions` — keep this pattern).
- **Workspace (Problem/Session pages)**: define a `MIN_WORKSPACE_WIDTH` breakpoint (~1024px). Below it, show a `WorkspaceUnavailableOnMobile` state with a clear message rather than forcing a broken 3-pane resizable layout onto a 375px viewport. This is honest UX, not a cop-out — collaborative coding + video genuinely needs screen real estate.
- Use a single `useMediaQuery` hook (new, in `hooks/`) as the one source of truth for this breakpoint, rather than scattering `sm:`/`lg:` Tailwind classes to *simulate* responsiveness in a layout that fundamentally doesn't degrade gracefully.

---

## 12. Layout Strategy

- `AppShell` owns the persistent chrome (Navbar + Toaster), rendered once, not per-page.
- `WorkspaceLayout` is the single source of truth for the resizable pane structure, parameterized by a `mode` prop (`'solo' | 'collaborative'`) that determines whether the right pane renders `VideoCallUI` or nothing — this directly replaces the current situation where `SessionPage.jsx` and `ProblemPage.jsx` each hand-roll their own (almost identical) `PanelGroup` nesting.
- Every other page uses a simple `PageShell` (max-width container + consistent vertical rhythm) — currently `page-wrap` class duplicated everywhere; becomes one layout primitive.

---

## 13. Performance Strategy

- **Code-split the workspace route.** Monaco (`@monaco-editor/react`) and Stream Video/Chat SDKs are heavy; `ProblemPage`/`SessionPage` should be lazy-loaded via `React.lazy` + `Suspense` at the route level so the Dashboard/Problems list (likely the most-visited pages) don't pay for Monaco's bundle weight.
- **Memoize list item components** (`SessionCard`, `ProblemCard`) with `React.memo` since dashboard polls every 5s (`refetchInterval: 5000` in `useSessionById`) — without memoization, every poll re-renders every card even when their data hasn't changed.
- **Debounce/throttle already exists** for code sync (500ms in `useCodeSync`) — keep it, but move the throttle constant to a named config value instead of a magic number.
- **Avoid re-fetching Monaco's language `LANGUAGE_CONFIG`/icons on every render** — it's already a module-level constant, correctly not recreated in render; preserve that discipline in refactored code.
- Video/chat client teardown (`useStreamClient`'s cleanup IIFE) is correct and stays — this prevents the classic "duplicate Stream connections on remount" bug.

---

## 14. Accessibility Strategy

Current gaps worth fixing in v2 (not urgent, but "production-quality" per your own bar):

- Icon-only buttons (chat toggle, end session, close chat `XIcon`) need `aria-label`s — currently rely on `title` only, which isn't equivalent for screen readers.
- `CreateSessionModal` traps focus and returns focus to the trigger on close (native `<dialog>`-based `Modal` primitive from the design system handles this once, correctly, instead of ad hoc per-modal).
- Color-only difficulty signaling (`badge-success`/`warning`/`error`) should keep the text label (it already does — "Easy"/"Medium"/"Hard" — good, preserve this, don't regress to icon-only).
- Resizable panel handles need keyboard alternative sizing (react-resizable-panels supports this via `tabIndex` — currently unstyled focus state; add visible focus ring consistent with the rest of the app's `focus-visible` rules already defined in `index.css`).
- Monaco editor itself is reasonably accessible out of the box — no extra work needed there.

---

## 15. Animation Strategy

Keep it restrained and functional, matching the existing aesthetic (subtle `hero-orb` blurs, `transition-all duration-200` on interactive elements):

- **Micro-interactions only** via Tailwind transition utilities — no animation library needed (Framer Motion would be overkill for this app's actual animation surface).
- **Chat drawer slide-in** (`VideoCallUI`'s `w-96`/`w-0` transition) — keep the current CSS-transition approach, it's simple and correct.
- **Loading states use consistent spin** (`LoaderIcon`/`Loader2Icon` — currently two different loader icon imports for the same concept across files; standardize on one `Spinner` design-system primitive).
- **Confetti on test pass** (`ProblemPage`'s `canvas-confetti`) — a genuinely delightful, low-cost detail; keep exactly as-is, just extract `triggerConfetti()` into a shared `lib/confetti.js` so `SessionPage` can eventually reuse it too (currently `SessionPage` has no equivalent celebration on passing tests — an inconsistency worth fixing).

---

## 16. Error Handling Strategy

- **Mutations**: already follow a consistent pattern in `useSessions.js` (`onError: (error) => toast.error(error.response?.data?.message || fallback)`) — formalize this as a shared `getErrorMessage(error, fallback)` utility so every mutation's `onError` is one line instead of repeated optional-chaining.
- **Queries**: currently, a failed `useSessionById` just leaves `session` undefined with no explicit error UI — v2 adds an `ErrorState` (design-system primitive) rendered when `isError` is true, instead of silently showing "Problem details loading..." forever.
- **AI/execution calls**: `lib/ai.js`/`OneCompiler.js` already normalize to `{ success, error }` — keep this contract exactly (it's a clean, backend-friendly pattern), and make `AIActionCard`/`OutputConsole` the single rendering point for that shape instead of each page re-deriving success/error branches.
- **Video/chat connection failures**: `SessionPage`'s "Connection Failed" card is good — promote it to a reusable `ConnectionErrorState` since a similar failure mode could appear if chat (not just video) fails to connect, which currently has no distinct UI.

---

## 17. Loading Strategy

- **Skeleton over spinner where layout-shift matters** — e.g. `ActiveSessions`/`RecentSessions` currently show a centered spinner replacing the whole list area during load; a skeleton card grid (matching final card dimensions) reduces layout jump when data arrives. Introduce a `SkeletonCard` primitive.
- **Spinner acceptable for action-triggered loading** (Run Code, Get Hint, Create Session) — these are already handled well via inline button spinners; keep this exact pattern, just standardize the spinner component used.
- **Route-level suspense fallback** for the lazy-loaded workspace bundle (see Performance section) — a lightweight full-page loader, not the heavy workspace skeleton, since Monaco/Stream aren't even downloaded yet at that point.

---

## 18. Reusable UI Primitives (consolidated list)

The concrete inventory to build once, use everywhere:

`Panel` (3 variants) · `Button` (4 variants) · `Badge`/`DifficultyBadge` · `StatusChip` · `IconChip` · `MiniLabel` · `Modal` · `Select` · `Spinner` · `SkeletonCard` · `EmptyState` · `ErrorState` · `ResizableSplit` · `PageShell` · `SectionKicker`

Everything feature-specific is built by composing these — no feature component should contain raw Tailwind utility soup for things this list already covers.

---

## 19. Existing Components to Keep (as-is or near-as-is)

- `lib/axios.js`, `api/sessions.js`, `lib/ai.js`, `lib/OneCompiler.js` — API layer is already clean and backend-compatible; don't touch.
- `hooks/useSessions.js` — correct TanStack Query usage, keep structurally identical.
- `hooks/useStreamClient.js`, `hooks/useCodeSync.js` — correctly isolated third-party integration hooks; light cleanup only (e.g., extract magic numbers), no structural rewrite.
- `data/problems.js`, `data/problems.js`'s `LANGUAGE_CONFIG` — pure data, no reason to touch.
- `lib/utils.js` (`getDifficultyBadgeClass`) — logic is fine; it just moves to live *inside* the new `DifficultyBadge` component rather than being called ad hoc from four different files.
- `index.css` token layer (`:root` custom properties, `surface-*` class *definitions* — not their usage) — the visual design language itself is good and distinctive; keep the CSS, change how it's *consumed*.
- `HomePage.jsx` — marketing page, low complexity, low reuse need; cosmetic-only changes if any.

## 20. Existing Components to Rewrite / Decompose

- **`SessionPage.jsx`** — full rewrite as a thin composition of `WorkspaceLayout` + `VideoCallUI`; current file mixes routing guards, video setup, AI state (×3), code state, and layout in one 300-line file.
- **`ProblemPage.jsx`** — same rewrite, becomes `WorkspaceLayout` in solo mode; currently duplicates ~70% of `SessionPage`'s logic (this duplication is the single biggest maintainability risk in v1).
- **`ProblemDescription.jsx`** — decompose into `ProblemPanelHeader`, `ExamplesBlock`, `ConstraintsBlock`; currently one 90-line component doing three visually distinct jobs.
- **`ActiveSessions.jsx` / `RecentSessions.jsx`** — collapse into one `SessionList` + `SessionCard` pair with a `variant` prop; currently two components with ~80% identical card markup and independent (and slightly inconsistent — one uses `Loader`, one uses `LoaderIcon`) loading/empty states.
- **`AIInsightCard.jsx`** — keep the *display* logic (`parseSections` parsing is genuinely useful) but wrap it in the new `AIActionCard` that also owns the button + loading state, eliminating the triplicated handler pattern in the pages.
- **`VideoCallUI.jsx`** — decompose into `SessionHeader`/`CallStage`/`CallControlsBar`/`ChatDrawer`; currently one component handling participant count, call controls, and a full chat integration together.
- **`CreateSessionModal.jsx`** — rebuild on top of the new `Modal` primitive for consistent focus/backdrop/close behavior; internal form logic (problem select → derive difficulty) stays identical.
- **Navbar.jsx** — minor decomposition only (`NavLink` sub-component for the repeated `nav-pill` pattern), not a full rewrite; it's already small and clear.

---

**Net effect:** page files shrink from ~300 lines (`SessionPage`) to ~40–60 lines; the ~70% logic duplication between the solo and collaborative workspace disappears into one shared `WorkspaceLayout`; every visual pattern currently expressed as a memorized className string becomes a typed component prop; and none of it requires touching a single backend route, controller, or schema.