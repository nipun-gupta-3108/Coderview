
---

## 1. Component Structure

### 1.1 `SessionPage.jsx` and `ProblemPage.jsx` are near-duplicates

**The problem:** These two pages contain almost identical logic — hint state, review state, explanation state, language selection, code execution, the entire "AI Insight" panel markup (three near-identical `surface-panel` blocks with a title/button/AIInsightCard pattern), and the same 3-panel `PanelGroup` layout structure. The only structural difference is that `SessionPage` adds the video call panel and multiplayer sync.

**Why it's a problem:** ~250 lines of JSX and 6+ pieces of state (`aiHint`, `hintLevel`, `isGettingHint`, `aiReview`, `isReviewing`, `aiExplanation`, `isExplaining`) are duplicated verbatim across two files.

**Developer impact:** Any bug fix or feature (e.g., "add a 4th AI feature," "change hint button copy," "add loading skeleton") must be made in two places. This already shows: both files have identical `handleGetHint`/`handleReviewCode`/`handleExplainProblem` functions with only the surrounding component name different. Drift is inevitable — someone will fix a bug in one and forget the other.

**User impact:** Inconsistent behavory over time (once the duplication drifts), and a larger bundle than necessary.

**Ideal design:** Extract a `useAIAssistant(problemData, selectedLanguage, code)` hook that owns all AI state and the three handler functions, returning `{ hint, hintLevel, isGettingHint, getHint, review, ... }`. Extract an `AIAssistantPanel` component that renders the three cards using that hook's return value. Both pages then become thin composition wrappers around shared pieces. This is the single highest-leverage refactor in the codebase.

### 1.2 No shared "code workspace" component

**The problem:** The `CodeEditorPanel` + `OutputPanel` + AI panel + `PanelGroup` nesting structure is duplicated at the JSX layout level between `SessionPage` and `ProblemPage`, not just in logic.

**Ideal design:** A `CodeWorkspace` component that takes `{ problemData, rightSlot }` (where `rightSlot` is the video call UI for sessions, or nothing for solo practice) and owns the resizable panel layout internally.

### 1.3 Business logic embedded directly in page components

**The problem:** `SessionPage.jsx` contains normalization logic implicitly via child hooks, but `ProblemPage.jsx` goes further and embeds `normalizeOutput` and `checkIfTestsPassed` as inline function declarations inside the component body, redefined on every render.

**Why it's a problem:** These are pure functions with zero dependency on component state/props — they take `output` and `expectedOutput` as arguments. Defining them inside the component means they're recreated on every render (minor perf cost) and they can't be unit tested in isolation or reused (e.g., `SessionPage` might eventually want the same test-checking behavior but currently doesn't have it at all — an existing feature gap, not just a duplication smell).

**Ideal design:** Move to `lib/testRunner.js` (or similar) as standalone exported functions with unit tests. This also surfaces a real product inconsistency: **`SessionPage` never checks test results or fires confetti** — collaborative sessions get zero pass/fail feedback while solo practice does. That's a functional gap this duplication is hiding.

### 1.4 `AIInsightCard`'s parser is fragile, undocumented business logic living in a display component

**The problem:** `parseSections` in `AIInsightCard.jsx` uses a regex (`/^[A-Za-z ]+:$/`) to detect section headers in AI-generated text, coupling the frontend's rendering logic to the exact prompt-engineering format chosen in `backend/src/controllers/aiController.js` (`Verdict:`, `Bug Risk:`, etc.).

**Why it's a problem:** This is an implicit contract between backend prompt strings and frontend regex — nothing enforces it, nothing documents it, and it will silently degrade (falling into the "Response" catch-all bucket) if someone changes a header's wording on either side without touching the other.

**Developer impact:** A new engineer changing prompt copy in `aiController.js` (e.g., "Bug Risk:" → "Potential Bugs:") has no signal that this breaks section rendering. There's no shared constant, no test, no type.

**Ideal design:** At minimum, colocate a comment/README noting the contract, or better, have the backend return structured JSON (`{ sections: [{ heading, body }] }`) instead of a formatted string, eliminating client-side parsing entirely. This doesn't require an API *shape* change beyond the response body's internal structure, which is a reasonable ask even under "don't change backend APIs" since it's additive/parallel — but flagging it as a discussion point rather than assuming permission.

### 1.5 Prop-drilling of `isUserInSession`

**The problem:** `DashboardPage` defines `isUserInSession` and threads it down into `ActiveSessions`, which calls it per-session in the render loop.

**Why it's a problem:** It's a pure function of `(session, user.id)` recomputed inline in JSX (`session.host?.clerkId === user.id || ...`) — fine at this scale, but it's a sign there's no shared "session permissions" utility, and as more permission checks get added (can-edit, can-invite, etc.) this pattern will multiply awkwardly through props.

**Ideal design:** A small `lib/sessionPermissions.js` with named exports (`isHost`, `isParticipant`, `canJoin`) that any component can import directly using `useUser()` internally, removing the need to pass a closure down as a prop at all.

---

## 2. Folder Structure

### 2.1 Inconsistent placement of data-fetching logic

**The problem:** There are three different patterns for backend communication:
- `api/sessions.js` — a `sessionApi` object of async functions wrapping `axiosInstance`
- `lib/ai.js` — standalone async functions (`getAiHint`, `reviewAiCode`, ...) with inline try/catch
- `lib/OneCompiler.js` — a single standalone function, same try/catch pattern

**Why it's a problem:** `api/` vs `lib/` is an arbitrary split for the same *kind* of thing (a thin HTTP wrapper). A new engineer has no rule to follow when adding, say, a "problems" API — do they put it in `api/` or `lib/`? Nothing in the folder structure documents the convention.

**Developer impact:** Discoverability suffers. Onboarding engineers will grep rather than navigate, and inconsistent error-handling (some throw, some return `{success, error}`) compounds this (see §7).

**Ideal design:** Consolidate all backend-communication code under a single `api/` directory, one file per resource (`api/sessions.js`, `api/ai.js`, `api/execution.js`), all following the same return-shape convention. `lib/` should be reserved for genuinely generic utilities (formatting, stream client setup, constants) that don't call the backend.

### 2.2 `lib/stream.js` exists in both frontend and backend with the same name but different responsibilities

**The problem:** Not a bug, but a naming collision that will confuse anyone grepping across the monorepo (`frontend/src/lib/stream.js` sets up the video client; `backend/src/lib/stream.js` sets up server-side Stream clients and user upsert helpers).

**Ideal design:** Rename for clarity in a monorepo context, e.g. `lib/streamVideoClient.js` on the frontend, or simply accept it since they're in separate app roots — low priority, but worth a note since it slows down cross-stack debugging ("where's the Stream config?" now requires checking two files with identical names).

### 2.3 No `constants/` or shared config layer

**The problem:** Magic strings and values are scattered: hint level caps (`Math.min(hintLevel + 1, 3)`) appear in both page components; difficulty strings (`"easy"`, `"medium"`, `"hard"`) are hardcoded in multiple places (`CreateSessionModal`, `Session` model references, `getDifficultyBadgeClass`); the 2-participant cap is implied by UI copy ("1-on-1 session") rather than a named constant.

**Ideal design:** A `constants/index.js` (or `constants/session.js`, `constants/ai.js`) exporting `MAX_HINT_LEVEL = 3`, `MAX_PARTICIPANTS = 2`, `DIFFICULTY_LEVELS = ['easy','medium','hard']`. This is cheap to do and prevents silent drift (e.g., someone changes the cap in one file's `Math.min` call and not the other).

### 2.4 Flat `components/` directory doesn't reflect domain boundaries

**The problem:** All components sit directly in `frontend/src/components/` regardless of whether they're session-specific (`ActiveSessions`, `VideoCallUI`, `CreateSessionModal`), problem-specific (`ProblemDescription`, `CodeEditorPanel`, `OutputPanel`, `AIInsightCard`), or truly generic (`Navbar`).

**Why it's a problem:** As the app grows, a flat directory becomes a wall of ~20+ same-level files with no visual grouping, making it hard to reason about what's reusable versus page-specific.

**Ideal design:** Group by domain: `components/dashboard/`, `components/session/`, `components/problem/`, `components/shared/` (or co-locate page-specific components inside the page's folder if moving to a feature-folder structure). Not urgent at current size, but worth doing before it grows further.

---

## 3. State Management

### 3.1 Redundant / unsynchronized local state for "loading" and "result" pairs

**The problem:** Every AI feature manages a `(value, isLoading)` pair as two separate `useState` calls, repeated 3× per page, 6× total across the app: `aiHint/isGettingHint`, `aiReview/isReviewing`, `aiExplanation/isExplaining`.

**Why it's a problem:** This is exactly the shape `useMutation` from TanStack Query (already a dependency, already used for sessions!) is designed to replace — `data`, `isPending`, `error` all come for free, with caching, retry, and dedupe. The AI calls currently reinvent this pattern manually instead of using an already-installed library consistently.

**Developer impact:** Inconsistent patterns across the codebase — `useSessions.js` correctly uses `useMutation`/`useQuery`, but AI feature calls use raw `useState` + manual async functions. A new engineer has two competing conventions to choose from.

**Ideal design:** Wrap `getAiHint`, `reviewAiCode`, `explainAiProblem` in `useMutation` hooks (mirroring `useJoinSession`/`useEndSession` in `useSessions.js`), collapsing 6 state variables down to 3 mutation objects, each exposing `.data`, `.isPending`, `.mutate()` natively.

### 3.2 Real-time code sync uses chat messages as a state-transport hack

**The problem:** `useCodeSync.js` propagates editor content between collaborators by sending it as a Stream Chat message with a `custom.type: "code-sync"` payload, then filters incoming `message.new` events to detect and apply them, all while *also* rendering these as visible chat messages with a timestamp label (`[Code Update - ...]`).

**Why it's a problem architecturally:**
- **Correctness risk:** every keystroke-adjacent update (throttled to 500ms) creates a persisted chat message. Over a long session this pollutes the chat history/channel with dozens or hundreds of "code update" messages, visible to users who open the chat panel (`VideoCallUI`'s `MessageList`) — real user-facing noise.
- **No conflict resolution:** it's a last-write-wins broadcast with no operational transform / CRDT, so two people typing simultaneously will fight and overwrite each other with the classic "whoever's 500ms timer fires last wins, and their cursor position may not even be in the same place" problem.
- **No initial-state reconciliation guarantee:** if a participant joins mid-session, they only get the *next* sync broadcast — there's no explicit "request current state on join" mechanism, meaning a late joiner sees stale/starter code until the host's next edit.
- **Layering violation:** chat and code-sync are different domains being smuggled through the same transport because it's convenient, not because it's correct.

**User impact:** Users pairing on a real interview will see their editor jump/flicker on remote overwrites, and (if they open chat) a spam of update messages cluttering the conversation they're trying to have with their partner.

**Ideal design:** Use Stream's custom events API (`channel.sendEvent` / client-side custom events) instead of `sendMessage`, which is designed for exactly this kind of ephemeral signal and won't populate message history. Longer-term, this is a candidate for real operational-transform tooling (Yjs, Automerge) if true collaborative editing (not just "last save wins") is a product goal — worth a product conversation before committing engineering time.

### 3.3 `SessionPage` reaches into multiple custom hooks with overlapping responsibility for "am I allowed to be here"

**The problem:** `isHost`/`isParticipant` are computed in `SessionPage`, then passed into `useStreamClient` (which uses them to decide whether to even attempt joining the call) and separately used in a `useEffect` that auto-calls `joinSessionMutation.mutate()`. The "should I join" decision logic is split across the page body and a `useEffect`, with implicit ordering dependencies on `loadingSession`.

**Why it's a problem:** It's hard to trace the full lifecycle of "user opens session page" → "are they authorized" → "auto-join if spectating" → "connect to call" by reading any single function; it's spread across 3 different pieces of state and 2 hooks that both consume `isHost`/`isParticipant` independently.

**Ideal design:** A single `useSessionAccess(sessionId)` hook that encapsulates: fetch session → determine role → auto-join if needed → return `{ session, role, isLoading }`. `useStreamClient` then simply takes `role` as one clean input instead of two booleans it has to interpret itself.

---

## 4. UI/UX

### 4.1 No optimistic UI or transition feedback for session actions

**The problem:** Joining/creating a session, ending a session, and running code all show a spinner-in-button but nothing else changes about the page state until the network round-trip resolves. There's no skeleton loading state for the code editor itself, output panel, or AI cards beyond the empty div guard already present.

**User impact:** On a slow connection, clicking "Create" in `CreateSessionModal` gives the user a static button label change as their only feedback for what could be a multi-second operation (session creation involves DB write + Stream video call creation + Stream channel creation, sequentially, per `sessionController.js`). There's no indication of *which step* is happening if it's slow, and no timeout/retry affordance if Stream is degraded.

**Ideal design:** At minimum, a toast or inline status ("Setting up video call...") during multi-step creation; ideally, the mutation button disables and shows elapsed-time-aware messaging for actions known to take multiple backend steps.

### 4.2 Ambiguous / silent failure states in `SessionPage`'s video panel

**The problem:** If `!streamClient || !call`, the UI renders a generic "Connection Failed" card — but this same UI is shown whether the failure is because Stream itself couldn't be reached, the API key is misconfigured, or (per `useStreamClient`) the user simply isn't a host/participant yet (`if (!isHost && !isParticipant) return;` — silently skips call init with no distinguishing state).

**User impact:** A legitimate flow (page loading before the join-session mutation completes) is visually indistinguishable from an actual connection failure. Users may think something is broken and refresh/retry when the page just needs another second.

**Ideal design:** Distinguish "not yet authorized / still joining" from "genuinely failed to connect" as separate UI states, each with copy specific to the situation (and only show "Connection Failed" with a retry action for the latter).

### 4.3 Confirm dialogs use native `window.confirm`

**The problem:** `handleEndSession` in `SessionPage` uses `confirm("Are you sure you want to end this session? ...")` — a native browser dialog.

**Why it's a problem:** It's unstyled (breaks visual consistency with the rest of the app's custom modal system, e.g. `CreateSessionModal`), unstoppable by design (blocks the JS thread), not customizable for accessibility (no focus trap control, can't add descriptive secondary text), and not screenshot/automation-testable in the same way a React-rendered modal is.

**Ideal design:** Reuse (or extract from) `CreateSessionModal`'s modal pattern into a generic `ConfirmDialog` component, used for this and any future destructive actions.

### 4.4 Inconsistent empty/error states across sibling list components

**The problem:** `ActiveSessions` and `RecentSessions` each define their own bespoke "empty state" markup (icon + heading + subtext) with different icons, different copy tone, and separately duplicated loading-spinner blocks — but they're visually similar enough that they're clearly meant to be the same *pattern*, just not extracted as one.

**Ideal design:** A generic `EmptyState` component (`icon`, `title`, `description`) and a generic `LoadingSpinner`/`SectionLoader` component, used by both (and future list views), guaranteeing visual consistency and cutting ~30 lines of duplicated JSX.

### 4.5 Garbled/mojibake characters in body copy

**The problem:** Several files contain literal replacement-character artifacts from an encoding mismatch, visible directly in the rendered UI:
- `SessionPage.jsx`: `` Host: {session?.host?.name || "Loading..."} � {session?.participant ? 2 : 1}/2 participants `` — a stray `�` renders where a bullet/separator was presumably intended.
- `ProblemDescription.jsx`: `<span className="mt-0.5 text-lg text-emerald-700">�</span>` — a constraint-list bullet marker that renders as a broken-character glyph instead of an actual bullet.

**Why it's a problem:** This is a shipped, user-visible bug — every session page and every problem's constraints list currently shows a mojibake character to real users. It's also a signal that copy/paste from a rich-text source (Word, a design tool, or a differently-encoded file) introduced non-UTF8 characters that were never caught, meaning there could be more instances elsewhere not surfaced in this audit's sample.

**User impact:** Directly visible visual defect, undermines the "polished workspace" positioning the product is going for.

**Fix priority:** Trivial to fix, should be near the top of the list once we move to implementation — a straightforward find/replace to a real bullet character (`•`) or separator (`·`, `—`), but flagging it now since it's a correctness bug, not a design opinion.

### 4.6 Session "role" and "status" language is inconsistent

**The problem:** The UI variously calls the two participants "host"/"participant" (data model, `ActiveSessions`), and then in `SessionPage`, the end-session button is host-only but there's no persistent visual indicator elsewhere on the session page of "you are the host" vs. "you are the participant" — a user who joins mid-session has no on-screen cue clarifying their role or what permissions that implies (e.g., "only the host can end this session" is never explained; the button simply doesn't appear for participants, with no explanatory microcopy).

**Ideal design:** A small role badge/indicator visible throughout the session UI, plus microcopy near restricted actions when relevant ("Only the host can end this session").

---

## 5. Responsive Design

### 5.1 `SessionPage`'s core layout is desktop-only by construction

**The problem:** The entire session page is built on `PanelGroup direction="horizontal"` nested with a vertical `PanelGroup`, producing a 2-column-then-subdivided desktop layout with `minSize={30}` etc. constraints on resizable panels. There is no responsive breakpoint logic (no `sm:`/`md:` variants) anywhere in this component's layout structure, unlike, say, `WelcomeSection` or `Navbar`, which do adapt (`flex-col sm:flex-row`, `hidden sm:inline`).

**User impact:** On mobile or a narrow tablet viewport, resizable horizontal panels with `minSize={30}` (percent) each are close to unusable — you'd get 2–3 heavily cramped columns squeezed into a phone width, atop a video call panel that also assumes significant horizontal space. There's no mobile fallback (e.g., stacked/tabbed layout) at all. Given this is meant to be used during "live interview" scenarios, some users may reasonably try to join a session from a tablet or a smaller laptop, and the experience there is currently unaddressed.

**Ideal design:** Below a breakpoint, collapse to a tabbed interface (Problem / Editor / Video / AI as switchable tabs) rather than simultaneous panels — this is a genuine architecture decision, not a CSS tweak, since `react-resizable-panels` isn't designed to gracefully degrade to a single-column tab view on its own.

### 5.2 `ProblemPage` has the same resizable-panel-only layout, same issue

Same root cause as 5.1, same fix.

### 5.3 Fixed pixel-based scroll containers may clip content at small viewport heights

**The problem:** `ActiveSessions` uses `max-h-[470px]` as a hardcoded scroll container height. On short viewports (small laptops with browser chrome, or landscape mobile), this fixed height doesn't scale down, potentially pushing "load more" content further off-screen than necessary or leaving excessive whitespace on tall screens.

**Ideal design:** Use viewport-relative sizing (e.g., `max-h-[60vh]`) or CSS `clamp()`-based approaches instead of a hardcoded pixel value, so the scroll area adapts to actual available space.

### 5.4 No responsive testing evidence for the Monaco editor's toolbar

**The problem:** `CodeEditorPanel`'s header row (`language icon + select + sync indicator` on the left, `Run Code button` on the right) uses `flex items-center justify-between` with no wrapping behavior defined. At narrow widths (which will occur regardless of fixes to 5.1/5.2, since panels can still be manually resized down by the user via drag handles), this row has no defined fallback — it's unclear whether the sync indicator/select would overflow, wrap awkwardly, or get clipped.

**Ideal design:** Explicit wrap behavior (`flex-wrap`) or a min-width guard tied to the panel's `minSize`, plus verification against the resizable panel's actual minimum allowed width.

---

## 6. Accessibility

### 6.1 Color as the sole signal for critical status information

**The problem:** Difficulty badges (`getDifficultyBadgeClass`) rely entirely on background color (green/amber/red via `badge-success`/`badge-warning`/`badge-error`) with the difficulty word also present as text, which is good — but the "full" vs "open" session status chip in `ActiveSessions` (`bg-rose-100 text-rose-700` vs `bg-emerald-100 text-emerald-700`) similarly pairs color with text, so that part is fine. However, the small colored dot indicating "active" status (`<span className="h-2 w-2 rounded-full bg-emerald-500" />` in `ActiveSessions`'s header, and the online indicator on session icons) conveys meaning through color alone with no text alternative and no `aria-label`, meaning screen reader users get no equivalent information from that specific visual element (though adjacent text often does convey similar info redundantly — inconsistently).

**Ideal design:** Any purely decorative-looking indicator dot that also conveys state should either be marked `aria-hidden="true"` if fully redundant with adjacent text, or given an accessible label if it's the only carrier of that information.

### 6.2 Icon-only interactive elements lack accessible names

**The problem:** Several buttons render only a Lucide icon with no visible text label on smaller screens by design (e.g., Navbar's `<span className="hidden sm:inline">Problems</span>` — the icon persists but the text is hidden below `sm`), and none of these icon buttons have an `aria-label` fallback. Similarly, `VideoCallUI`'s chat toggle button, the chat panel's close (`X`) button, and `CodeEditorPanel`'s language `<img>` icon (no `alt` beyond the language name, which is fine, but check consistency) don't have redundant accessible naming when their text is visually hidden.

**Why it's a problem:** On mobile viewports the Navbar's "Problems"/"Dashboard" links become icon-only to sighted users too, but a screen reader encountering the icon (`BookOpenIcon`) alone (Lucide icons render as SVGs, typically without inherent accessible text) may announce nothing meaningful, or nothing at all, depending on how Lucide handles ARIA by default.

**Ideal design:** Add `aria-label` to any interactive element whose only persistent content is an icon, regardless of viewport (the underlying DOM node exists at all screen sizes — only the *visual* text is hidden via `hidden sm:inline`, but the link's accessible name shouldn't disappear just because the text is visually hidden. If the intent is "hide text visually but keep it for screen readers," that requires a different technique — visually-hidden-but-DOM-present text or `aria-label` — not `hidden` class, which removes it from the accessibility tree too.)

### 6.3 `<select>` elements have no associated `<label>`

**The problem:** `CodeEditorPanel`'s language selector, `CreateSessionModal`'s problem selector, and `ProblemDescription`'s "switch problem" selector all use bare `<select>` elements. Some have adjacent visual text (e.g., "Select a problem *" in `CreateSessionModal`) but it's not programmatically associated via `htmlFor`/`id`, and `CodeEditorPanel`'s language select has no associated label at all beyond the flag/icon image next to it.

**Why it's a problem:** Screen reader users navigating by form control won't get a meaningful accessible name for these selects without an explicit label association (`<label htmlFor="...">` + matching `id` on the select, or `aria-label` directly).

**Ideal design:** Add proper label association (visually-hidden label text is fine if the visual design doesn't want a visible label) to every form control in the app.

### 6.4 Modal (`CreateSessionModal`) lacks focus management and ARIA role wiring

**The problem:** The modal is a plain `div` with `modal modal-open` classes (DaisyUI styling) but no `role="dialog"`, no `aria-modal="true"`, no `aria-labelledby` pointing at the heading, and no evidence of focus trapping or focus-return-on-close (focus isn't programmatically moved into the modal on open or restored to the trigger element on close).

**Why it's a problem:** Keyboard and screen reader users can currently tab out of the modal into the page behind it while it's open (since there's no focus trap), and screen readers won't announce it as a dialog with the appropriate context when it opens.

**Ideal design:** Either adopt a proper headless dialog primitive (e.g., Radix/`@radix-ui/react-dialog`, or `<dialog>` native element with polyfill-free modern support) or manually wire `role="dialog"`, `aria-modal`, `aria-labelledby`, and a focus trap. Given `shadcn/ui` components are already listed as available in this environment's dependency set for artifacts, this is a very natural place to standardize.

### 6.5 No live region for asynchronous AI results

**The problem:** When `aiHint`, `aiReview`, or `aiExplanation` populate after a network call, the DOM updates silently from the perspective of a screen reader — there's no `aria-live="polite"` region announcing "hint ready" the way the sighted UI communicates it via a toast (`toast.success(...)`), which itself (via `react-hot-toast`) may or may not be in the accessibility tree depending on the library's internals (worth verifying, but not something I can confirm from source alone).

**Ideal design:** Wrap the `AIInsightCard` content area in an `aria-live="polite"` region so that screen reader users are notified when new AI content arrives, independent of whatever the toast library does.

### 6.6 Monaco Editor's accessibility is inherited, not configured

**The problem:** `CodeEditorPanel` passes only visual/behavioral options to Monaco (`fontSize`, `lineNumbers`, `minimap`, etc.) with no explicit accessibility-related options set (Monaco supports `accessibilitySupport: 'auto'|'on'|'off'` and screen-reader-specific ARIA labeling options).

**Ideal design:** Not a blocker (Monaco has reasonable defaults), but worth an explicit accessibility pass/audit specifically for the editor experience under a screen reader, since this app's whole value proposition is code-focused and a blind or low-vision candidate should be a considered user, not an afterthought.

---

## 7. Performance

### 7.1 Aggressive, un-cached polling on the session page

**The problem:** `useSessionById` sets `refetchInterval: 5000` unconditionally, polling every 5 seconds for the entire time a user has a session page open, apparently just to detect `status === "completed"` (per the `useEffect` in `SessionPage` that redirects to dashboard on that transition).

**Why it's a problem:** This is solving a real-time problem (session ended) with polling, when the app *already has* a real-time transport open for the entire duration of the session — Stream Chat's channel. The host ending a session could simply publish a custom event or channel state update that all participants are already subscribed to (they're already connected to the channel for chat), giving instant server-push notification instead of up-to-5-second-delayed polling. As currently built, if a participant is mid-interview and the host ends the session, that participant continues seeing an active session for up to 5 seconds after it's already torn down server-side (video call deleted, channel deleted) — which could actually cause visible errors in that window if any Stream operation fires against an already-deleted call/channel.

**Ideal design:** Use the already-open Stream channel connection to broadcast a "session ended" signal (same category of fix as §3.2 — this app has two real-time-transport-adjacent problems solved with polling/chat-message hacks instead of proper custom events).

### 7.2 No memoization on expensive derived values recomputed every render

**The problem:** `problemData` in `SessionPage` is derived via `Object.values(PROBLEMS).find(...)` directly in the render body (not in a `useMemo`), recomputing an array conversion + linear search across all problems on every single re-render of `SessionPage` — including on every 5-second poll tick from §7.1, every code keystroke (if `code` state is a dependency of anything re-rendering this component — need to check `useCodeSync`'s update path, but `code` is definitely `SessionPage` state, so yes, every keystroke re-renders `SessionPage`), and every AI-hint response.

**Why it's a problem:** For 5 hardcoded problems this is invisible, but it's the kind of pattern that becomes a real cost once `PROBLEMS` becomes a larger dataset (the README's roadmap explicitly says "current problem data is stored locally," implying this will eventually move to a real backend/larger catalog) — and it's recomputing on *every keystroke in the editor*, which is the worst-case render frequency in the whole app.

**Ideal design:** `useMemo(() => Object.values(PROBLEMS).find(...), [session?.problem])`.

### 7.3 `useCodeSync`'s effect dependencies risk redundant channel re-subscription

**The problem:** The `message.new` listener effect in `useCodeSync` depends on `[channel, userId, setCode]`. `setCode` is a state setter (stable across renders, fine), but if `channel` reference identity isn't stable across re-renders of `useStreamClient` (it's set once via `setChannel` inside an async `initCall`, so likely stable — but worth explicit verification), this is fine. Flagging for verification rather than asserting a bug, since I can't fully trace the Stream SDK's object identity guarantees from the source alone — but this is exactly the kind of area worth a dependency-array audit given how central it is to the collaborative feature.

### 7.4 No code-splitting / lazy loading for heavy dependencies

**The problem:** `@monaco-editor/react` and `@stream-io/video-react-sdk` are both large dependencies, and both are imported at the top level of pages that are reached via top-level routes in `App.jsx` with no `React.lazy`/`Suspense` boundary. Every user who visits `/dashboard` pays for the video SDK's and Monaco's bundle weight even before navigating into a session or problem page, if those pages are bundled together rather than split.

**Why it's a problem:** Given Vite's default code-splitting behavior does split by route/dynamic import but *not* automatically by static import, and `App.jsx` statically imports all pages (`import SessionPage from "./pages/SessionPage"` at the top, not `React.lazy(() => import(...))`), the initial bundle likely includes Monaco and the Stream video SDK regardless of whether the user ever opens a session. This directly affects first-load performance for the majority of sessions (dashboard browsing, viewing problems list) which don't need either dependency yet.

**Ideal design:** Convert route-level imports in `App.jsx` to `React.lazy()` + a `Suspense` fallback, so Monaco and Stream Video only load when a user actually navigates to a page that needs them.

### 7.5 `AIInsightCard`'s `parseSections` runs synchronously in render, unmemoized

**The problem:** `parseSections(content)` is called directly in the component body on every render, re-parsing the entire AI text via string splitting and regex tests, even on renders triggered by unrelated state changes elsewhere in the parent (e.g., a hint panel re-parsing its (unchanged) content because a sibling review panel's loading state changed and re-rendered the shared parent).

**Ideal design:** Wrap in `useMemo(() => parseSections(content), [content])` — cheap fix, meaningful for larger AI responses.

---

## 8. Reusability & Maintainability

### 8.1 The "surface panel" visual language is enforced only by convention, not a component

**The problem:** `.surface-panel`, `.surface-panel-strong`, `.surface-dark` are CSS utility classes (defined in `index.css`) applied ad hoc via `className` strings across dozens of JSX elements. There's no `<SurfacePanel>` React component wrapping this pattern.

**Why it's a problem:** This means the *visual system* is enforced by developers remembering to type the right class name string correctly every time, with zero compile-time or prop-based safety. A typo (`surface-pannel`) silently produces unstyled markup with no error. It also means variant logic (e.g., "strong on desktop, regular on mobile") can't be expressed as a prop — it has to be a manually-written conditional className string wherever it's needed.

**Ideal design:** A `<Surface variant="default"|"strong"|"dark">` component (or, if staying utility-first, at minimum a `cva` (class-variance-authority)-style helper) that centralizes the mapping from variant name to class list, catching typos via TypeScript/prop types and making the design system's variants a discoverable, IDE-autocompletable API instead of tribal knowledge.

### 8.2 No design tokens/theming abstraction beyond raw CSS custom properties

**The problem:** `index.css` defines a few root-level custom properties (`--app-ink`, `--app-muted`, `--app-line`, `--app-glow`) but the vast majority of colors used throughout components are raw Tailwind utility values inlined directly in `className` (`text-emerald-700`, `bg-rose-100`, gradient stops like `#14532d`, `#0f766e`, `#0284c7` repeated as literal hex strings across at least 4 different files — `Navbar`, `ActiveSessions`, `WelcomeSection`, `HomePage` all hardcode the *exact same* three-color gradient string independently).

**Why it's a problem:** The brand gradient (`linear-gradient(135deg,#14532d_0%,#0f766e_55%,#0284c7_100%)`) is duplicated as an identical literal string in at least four separate files. If the brand color is ever adjusted, that's a find-and-replace across the whole codebase with real risk of missing an instance (as evidenced by the fact these four are *currently* in sync only by developer diligence, not by any shared source of truth).

**Ideal design:** Promote the recurring gradient (and other repeated raw values) to a Tailwind theme extension or a CSS custom property (`--brand-gradient`), referenced everywhere via one class or one CSS variable rather than a copy-pasted literal.

### 8.3 Naming inconsistency: some icon imports rename, most don't, inconsistently between files

**The problem:** `RecentSessions.jsx` imports icons *without* the `Icon` suffix (`Code2`, `Clock`, `Users`, `Trophy`, `Loader`), while virtually every other component (`ActiveSessions`, `Navbar`, `SessionPage`, `CodeEditorPanel`, `WelcomeSection`, `StatsCards`) imports the same icons *with* the suffix (`Code2Icon`, `ClockIcon` pattern would be expected, but note `Clock`/`Loader` in `RecentSessions` collide in spirit with the convention used elsewhere).

**Why it's a problem:** Small, but real — this is exactly the kind of inconsistency that indicates no linting rule or code-review convention is enforcing a single import style, meaning the codebase's "house style" is whatever the last person who touched a file happened to prefer. Multiply this pattern of unenforced convention across a growing team and it becomes real review overhead.

**Ideal design:** Pick one convention (the `*Icon` suffix, since it's the majority pattern) and add an ESLint rule (or at minimum a documented convention) enforcing it; fix `RecentSessions.jsx` to match.

### 8.4 `getDifficultyBadgeClass` is the only "shared utility," and it's stringly-typed against an implicit enum

**The problem:** `lib/utils.js` has exactly one exported function, matching against raw strings (`"easy"`, `"medium"`, `"hard"`) with a `default: "badge-ghost"` fallback silently swallowing typos or unexpected values (e.g., if the backend's `Session` model enum (`["easy", "medium", "hard"]`, defined in `models/Session.js`) ever changes, this frontend function has no compile-time link to that enum and will silently fall back to a generic gray badge rather than surfacing the mismatch anywhere).

**Ideal design:** At minimum, export the difficulty list as a shared constant (see §2.3) that both `getDifficultyBadgeClass` and `CreateSessionModal`'s dropdown reference, so there's one source of truth for "what difficulties exist" instead of three independent hardcoded lists (backend enum, this function's switch cases, and problem data's own `difficulty` string values in `data/problems.js`, which are capitalized — `"Easy"` — while the backend enum is lowercase — `"easy"` — an inconsistency `getDifficultyBadgeClass`'s `?.toLowerCase()` call is specifically compensating for, meaning this normalization mismatch is already a known pain point baked into the code).

### 8.5 Error handling convention is inconsistent across API wrapper functions

**The problem:** Every function in `lib/ai.js` and `lib/OneCompiler.js` follows a `try { return data } catch { return {success:false, error} }` pattern that **swallows all errors into a success/failure object**, while `api/sessions.js`'s `sessionApi` functions do **not** catch anything — they let axios errors propagate, relying entirely on the calling `useMutation`/`useQuery`'s `onError` handler (as seen in `useSessions.js`).

**Why it's a problem:** Two fundamentally different error-handling philosophies coexist in the same app: one "catch and return a result object," one "let it throw and handle upstream." A developer adding a new API call has to know which pattern to follow for which *kind* of call, and there's no stated rule — it just happens to align with "TanStack Query things throw" vs "manually-called-from-a-handler things catch," which is a reasonable-ish organic split but was clearly never a deliberate decision, and it will confuse anyone who has to reconcile the two mentally while debugging a production error.

**Ideal design:** Standardize on one pattern — given `useMutation` already provides `onError` and `isError` for free, migrating the AI calls to `useMutation` (per §7.1) would naturally unify this by letting axios throw everywhere and centralizing error-to-toast translation in one place (a shared `onError` default, or a global axios interceptor for toast-worthy errors) rather than duplicating manual try/catch-and-format logic three times over.

---

## Summary of Highest-Impact Issues (for prioritization discussion)

If I were to rank these by (impact × effort-to-fix) before we discuss a redesign plan:

1. **`SessionPage`/`ProblemPage` duplication** (§1.1) — the single biggest maintainability lever; also hides a real functional gap (no pass/fail feedback in sessions).
2. **Mojibake characters shipped to users** (§4.5) — a live, trivial-to-fix correctness bug.
3. **Code-sync via chat messages** (§3.2) and **status polling** (§7.1) — both are real-time problems solved with the wrong transport, with concrete correctness and UX costs.
4. **Mobile layout for Session/Problem pages** (§5.1/5.2) — a full architectural gap, not a CSS tweak, and worth scoping explicitly before any visual redesign work starts.
5. **Accessibility of the modal and icon-only controls** (§6.2, §6.4) — cheap fixes with outsized inclusivity impact.
6. **AI state duplicated instead of using `useMutation`** (§7.1/§3.1) — fixes reusability, error-handling consistency, and code volume in one move.