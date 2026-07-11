Before diagrams: a few architectural notes that shape every layout below.

- **Existing component boundaries stay intact.** Navbar, WelcomeSection, StatsCards, ActiveSessions, RecentSessions, CreateSessionModal, ProblemDescription, CodeEditorPanel, OutputPanel, AIInsightCard, VideoCallUI are already well-separated — the wireframes below map onto these, not new components.
- **Grid system:** the app already uses a `page-wrap` (max-w-7xl) container with a 3-column grid on Dashboard (`lg:grid-cols-3`) and 2-panel resizable layout on Session/Problem pages. Breakpoints below follow Tailwind defaults: `sm:640 / md:768 / lg:1024 / xl:1280`.
- **Breakpoint set used for every page:** Desktop (1440px), Laptop (1280px), Tablet (768px), Mobile (390px).

---

## 1. Home Page (`HomePage.jsx`)

### Desktop (1440px)
```
┌──────────────────────────────────────────────────────────────────┐
│ [Logo] Coderview                              [Get Started btn]  │ <- slim top bar
├──────────────────────────────────────────────────────────────────┤
│                                                                    │
│  KICKER: realtime collaboration                                  │
│  H1: Practice interviews inside a shared coding studio            │
│  subtext (max-w-2xl)                                              │
│  [✓ live video][✓ shared editor][✓ multi-language]                │
│  [Start Coding] [Explore the flow]                                 │
│                                                                    │
│  [users 10K+] [sessions 50K+] [uptime 99.9%]     ┌───────────────┐│
│                                                    │ Room Preview  ││
│                                                    │ code + panels ││
│                                                    └───────────────┘│
├──────────────────────────────────────────────────────────────────┤
│  Why it works                                                     │
│  [Video-first]     [Focused editor]     [Built for pairs]         │
└──────────────────────────────────────────────────────────────────┘
```
- **Layout:** 2-column hero (`1.05fr / 0.95fr`) — copy left, room-preview mock right. Below hero, 3-column feature grid.
- **Spacing:** `py-16/20` around hero, `gap-12` between columns, `gap-6` in feature grid.
- **Hierarchy:** Kicker (small caps) → H1 (72px) → subtext → CTA row → trust stats. Preview panel is secondary but visually loud (dark surface) to draw the eye right after the CTA.
- **Navigation:** Only the top bar; no in-page nav, single primary CTA (SignInButton) repeated twice for conversion.
- **Responsive:** No structural change needed until laptop.

### Laptop (1280px)
```
┌──────────────────────────────────────────────────┐
│ [Logo] Coderview                 [Get Started]   │
├────────────────────────────────────────────────────┤
│ KICKER                                            │
│ H1 (slightly smaller, 60px)                       │
│ subtext                                           │
│ [chips row]                                       │
│ [CTA row]                                         │
│ [stats row]        ┌─────────────────┐            │
│                     │ Room preview     │            │
│                     └─────────────────┘            │
├────────────────────────────────────────────────────┤
│ [Video-first][Focused editor][Built for pairs]     │
└────────────────────────────────────────────────────┘
```
- Same 2-column ratio, just tighter gutters (`gap-8` vs `gap-12`), H1 drops one step (`text-6xl`).

### Tablet (768px)
```
┌───────────────────────────────┐
│ [Logo]           [Get Started]│
├───────────────────────────────┤
│ KICKER                        │
│ H1 (text-5xl, full width)     │
│ subtext                       │
│ [chip][chip][chip] (wrap)     │
│ [Start Coding][Explore flow]  │
│ [10K+][50K+][99.9%] (3-col)   │
│                                │
│ ┌───────────────────────────┐ │
│ │ Room preview (full width) │ │
│ └───────────────────────────┘ │
├───────────────────────────────┤
│ [Video-first]                 │
│ [Focused editor]               │
│ [Built for pairs]              │
└───────────────────────────────┘
```
- **Responsive behavior:** hero collapses to single column — copy stacks above the preview card (`grid-cols-1`), CTA buttons wrap, feature cards go from 3-col to 1-col stack.

### Mobile (390px)
```
┌───────────────────┐
│ [Logo]  [Sign in]  │  <- icon-only CTA if needed
├───────────────────┤
│ kicker (wraps)     │
│ H1 (text-3xl/4xl)  │
│ subtext             │
│ chips stack (1/row) │
│ [Start Coding]      │
│ [Explore flow]      │
│ stat / stat / stat  │
│  (stacked, centered)│
│ [preview card]      │
├───────────────────┤
│ feature card        │
│ feature card         │
│ feature card         │
└───────────────────┘
```
- **Spacing:** padding drops to `px-4`, vertical rhythm tightens (`py-8`).
- **Navigation:** top bar shrinks — logo + single CTA button, no wordmark subtitle to save width.
- **Hierarchy priority on mobile:** H1 → CTA (moved up before stats) → preview → features. Stats row is de-emphasized (smaller, centered) since it's supporting evidence, not action-driving.

---

## 2. Dashboard Page (`DashboardPage.jsx`)

Composition: `Navbar → WelcomeSection → [StatsCards + ActiveSessions] → RecentSessions`. Currently `StatsCards` + `ActiveSessions` share a `lg:grid-cols-3` row (Stats spans all 3 cols as its own row via `lg:col-span-3` on StatsCards' wrapper div, then ActiveSessions `lg:col-span-2` sits alongside... actually current code nests StatsCards and ActiveSessions in one 3-col grid, StatsCards internal grid is 3 cols and ActiveSessions is `lg:col-span-2`). I'll wireframe it as it behaves today: Stats row full-width, then a 2-col row (Active sessions 2/3, nothing 1/3 currently — actually ActiveSessions is `col-span-2` inside a 3-col parent grid, meaning there's an implicit empty 1/3 column). Wireframe reflects that reality — a good callout for a future improvement, but not something to silently "fix" without being asked.

### Desktop (1440px)
```
┌────────────────────────────────────────────────────────────────┐
│ [Logo] Coderview          [Problems][Dashboard]     [UserBtn]   │ Navbar
├────────────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Welcome back, {name}          [Create Session ▸]          │  │ WelcomeSection
│  │ subtext                        "lightweight rooms..." tip  │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌────────┐┌────────┐┌────────┐   <- StatsCards (3 metric-cards)│
│  │ Active ││ History││ Focus  │                                 │
│  └────────┘└────────┘└────────┘                                 │
│                                                                  │
│  ┌──────────────────────────────────────┐  ┌─────────────┐     │
│  │ Live Sessions (list, scrollable)      │  │  (empty col) │     │
│  │  [room card]                          │  └─────────────┘     │
│  │  [room card]                          │                       │
│  │  [room card]                          │                       │
│  └──────────────────────────────────────┘                       │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Past Sessions (3-col card grid)                            │  │ RecentSessions
│  │ [card][card][card]                                          │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────┘
```
- **Layout:** container `max-w-7xl`, vertical stack of 4 sections, each a `surface-panel-strong` card with generous internal padding (`p-6/7`).
- **Spacing:** `gap-8` between StatsCards/ActiveSessions row and next section (`mt-8` on RecentSessions).
- **Hierarchy:** Welcome (name + primary CTA) is the loudest block → Stats (glanceable numbers) → Live Sessions (actionable, scrollable `max-h-[470px]`) → Recent history (lowest priority, browsable).
- **Navigation:** Navbar pills highlight `/dashboard`; the only page-level nav action is "Create Session" which opens `CreateSessionModal`.
- **Note:** the empty right column at `lg` is a real gap in the current grid (ActiveSessions is `col-span-2` of 3) — worth flagging to you before any code change, not silently altering grid math.

### Laptop (1280px)
```
┌──────────────────────────────────────────────────┐
│ Navbar (same, pills lose "Problems/Dashboard"     │
│ text label only if very tight — otherwise same)   │
├──────────────────────────────────────────────────┤
│ Welcome card (CTA wraps under name on narrow cases)│
│ [Active][History][Focus] (3-col, tighter gutters)  │
│ [Live Sessions 2/3] [gap 1/3]                       │
│ [Past Sessions 3-col]                               │
└──────────────────────────────────────────────────┘
```
- Structurally identical to desktop; only padding/card radii scale down slightly.

### Tablet (768px)
```
┌───────────────────────────────┐
│ [Logo] [📖][📊] [UserBtn]      │ <- icon-only nav labels hidden (sm:inline)
├───────────────────────────────┤
│ Welcome card                   │
│  name + CTA stacked             │
│  tip note below                 │
│                                  │
│ [Active]                        │
│ [History]        <- stats stack │
│ [Focus]             md:grid-cols-3 still holds at 768,
│                     but if content wraps, verify at 640 breakpoint
│                                  │
│ Live Sessions (full width)      │
│  [room card]                     │
│  [room card]                     │
│                                  │
│ Past Sessions                    │
│  [card][card]  <- md:grid-cols-2 │
└───────────────────────────────┘
```
- **Responsive behavior:** Navbar pill labels collapse to icon-only (`hidden sm:inline` already in code). StatsCards keep 3-col at `md:` (per Tailwind class), RecentSessions drops to 2-col (`md:grid-cols-2`). ActiveSessions loses its `lg:col-span-2` context and simply becomes full width, single column.

### Mobile (390px)
```
┌───────────────────┐
│ [Logo] [📖][📊][👤]│
├───────────────────┤
│ Welcome card        │
│  "Welcome back,X"   │
│  subtext             │
│  [Create Session]    │
│  tip                  │
│                        │
│ [Active sessions #]    │
│ [History #]            │  <- stats stack 1-col
│ [Focus #]               │
│                          │
│ Live Sessions            │
│  room card (full width)  │
│  room card                │
│  ...scroll                │
│                            │
│ Past Sessions               │
│  card                        │
│  card                         │
│  (1-col stack)                 │
└───────────────────┘
```
- **Spacing:** section padding drops to `p-6`→ effectively `p-4` feel via container padding; card gap `gap-4/5`.
- **Hierarchy:** unchanged order, but everything becomes a single vertical scroll — this is the most content-heavy page on mobile, so scannability depends on consistent card headers (icon-chip + label pattern already used).
- **Navigation:** UserButton always visible (auth-critical); Problems/Dashboard pills icon-only.

---

## 3. Problems Page (`ProblemsPage.jsx`)

### Desktop (1440px)
```
┌────────────────────────────────────────────────────────────┐
│ Navbar                                                       │
├────────────────────────────────────────────────────────────┤
│ ┌──────────────────────────────────────────────────────┐   │
│ │ problem library                                         │   │
│ │ H1: Practice Problems                                     │   │
│ │ subtext                                                    │   │
│ └──────────────────────────────────────────────────────┘   │
│                                                                │
│ ┌──────────────────────────────────────────────────────┐   │
│ │ [icon] Two Sum         [Easy]              Solve ▸    │   │
│ │        Array • Hash Table                              │   │
│ │        description line                                 │   │
│ └──────────────────────────────────────────────────────┘   │
│ (repeat per problem, vertical list, full-width rows)          │
│                                                                │
│ ┌──────────────────────────────────────────────────────┐   │
│ │ Statistics: [Total][Easy][Medium][Hard]  (4-col)        │   │
│ └──────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────┘
```
- **Layout:** header card → vertical list of problem rows (each a full-width `Link` card, flex row: icon+title+desc left, difficulty badge + "Solve" right) → statistics footer card.
- **Spacing:** `py-10` page padding, `mb-8` header→list, `mb-12` list→stats, `gap-6` inside each row.
- **Hierarchy:** Title/category/badge lead each row; description is de-emphasized (`subtle-text`); "Solve →" is the row's CTA, right-aligned for scan consistency.
- **Navigation:** clicking any row navigates to `/problem/:id`. Navbar highlights "Problems".

### Laptop (1280px)
Same structure, only container width narrows — no reflow needed (single-column list already collapses gracefully).

### Tablet (768px)
```
┌───────────────────────────────┐
│ Navbar (icon nav)               │
├───────────────────────────────┤
│ header card                     │
│                                   │
│ [icon] Two Sum [Easy]              │
│         category                    │
│         description                 │
│         Solve ▸ (right-aligned,      │
│         may wrap below icon row)     │
│  ── (row becomes 2-line flex-col) ── │
│                                        │
│ Statistics                              │
│ [Total][Easy]                            │
│ [Medium][Hard]   <- sm:grid-cols-4 wraps │
│                     to 2x2 at this width  │
└───────────────────────────────┘
```
- **Responsive behavior:** each problem row's `flex-row sm:items-center sm:justify-between` keeps text block and CTA on one line down to `sm`; below that the CTA drops under the description (`flex-col` fallback). Stats grid (`grid-cols-2 sm:grid-cols-4`) shows 2×2.

### Mobile (390px)
```
┌───────────────────┐
│ Navbar              │
├───────────────────┤
│ header (H1 smaller)  │
│                        │
│ [icon] Two Sum          │
│ [Easy]                   │
│ category                  │
│ description                │
│ Solve ▸ (full-width row?)   │
│ ─────────────────────────── │
│ (repeat, stacked cards)       │
│                                │
│ Statistics                      │
│ [Total][Easy]                    │
│ [Medium][Hard]  (2x2 grid)          │
└───────────────────┘
```
- **Hierarchy:** badge moves under title (wraps naturally via `flex-wrap`), icon shrinks proportionally (still `h-14 w-14` per code — worth watching for cramped feel at 375px, a candidate for a `sm:h-14 h-12` tweak later if you want it, not changing anything now).

---

## 4. Problem Page (`ProblemPage.jsx`) — solo practice

This page uses a **resizable 2-panel layout** (`PanelGroup direction="horizontal"`): left = `ProblemDescription`, right = vertical stack of `CodeEditorPanel` + AI tools/output.

### Desktop (1440px)
```
┌────────────────────────────────────────────────────────────────┐
│ Navbar                                                            │
├───────────────────────────┬──────────────────────────────────────┤
│ ProblemDescription (40%)   │ CodeEditorPanel (70% of right col)   │
│  sticky header: title,     │  [lang icon][select] [Run Code]      │
│  difficulty badge,          │  ── Monaco editor ──                 │
│  problem switcher select    │                                       │
│                              ├──────────────────────────────────────┤
│  Description card            │ AI Hint / Review / Explain (30%)     │
│  Examples card (per example) │  scrollable stack of 3 cards          │
│  Constraints card              │ ──────────────────────────────────  │
│                                  │ OutputPanel (console, dark)         │
└───────────────────────────┴──────────────────────────────────────┘
```
- **Layout:** horizontal split ~`40/60`, right side further split vertically `70/30` (editor vs AI-tools+output — output nested inside the 30% block per current code, sharing scroll with AI cards then a `min-h-0 flex-1` OutputPanel below).
- **Spacing:** resize handles are thin gradient bars (`h-1`/`w-1`) — deliberately subtle so they don't compete with content.
- **Hierarchy:** Problem statement (left) and Editor (right-top) are equal-weight primary actions; AI tools are secondary/on-demand; Output is tertiary (dark, console-styled to visually separate from the "chrome").
- **Navigation:** in-panel "switch problem" `<select>` lets users jump between problems without leaving the page — avoids modal/route overhead.

### Laptop (1280px)
Same panel structure; Monaco height responsive via `automaticLayout: true`. No structural change — panels just get narrower absolute pixel widths at the same %.

### Tablet (768px)
```
┌───────────────────────────────┐
│ Navbar (icons)                   │
├───────────────────────────────┤
│ ⚠ Resizable horizontal split is  │
│ impractical <1024px.              │
│ Recommendation (design-only,       │
│ no code change made here):          │
│ stack panels vertically:             │
│                                        │
│ ┌───────────────────────────────┐    │
│ │ ProblemDescription (collapsed/  │    │
│ │ accordion or top section)        │    │
│ └───────────────────────────────┘    │
│ ┌───────────────────────────────┐    │
│ │ CodeEditorPanel (full width,     │    │
│ │  fixed height e.g. 50vh)          │    │
│ └───────────────────────────────┘    │
│ ┌───────────────────────────────┐    │
│ │ AI tools (accordion cards)         │    │
│ └───────────────────────────────┘    │
│ ┌───────────────────────────────┐    │
│ │ OutputPanel                        │    │
│ └───────────────────────────────┘    │
└───────────────────────────────┘
```
- **Responsive behavior (design intent, flagged not implemented):** `react-resizable-panels` horizontal groups don't degrade gracefully below ~1024px — the honest recommendation is a `direction="vertical"` PanelGroup (or a plain stacked layout) under a `lg:` breakpoint check, converting the page to a single-column, tab-like flow: Problem → Editor → AI Tools → Output. This is a layout decision worth discussing before touching `ProblemPage.jsx`, since it changes component composition (conditional PanelGroup direction), not just styling.

### Mobile (390px)
```
┌───────────────────┐
│ Navbar               │
├───────────────────┤
│ Problem title+badge   │
│ [switch problem ▾]     │
│                          │
│ Description (scroll)      │
│ Examples                    │
│ Constraints                   │
│                                  │
│ ── divider / tab bar? ──          │
│ [Description|Code|AI|Output]      │ <- suggested tab pattern
│                                      │
│ CodeEditorPanel (full-height view)   │
│  when "Code" tab active                │
└───────────────────┘
```
- **Hierarchy on mobile:** given 4 dense sections can't coexist on a 390px screen, the wireframe suggests a **tabbed single-view pattern** (Description / Code / AI / Output) rather than infinite vertical scroll through a code editor — this is the single biggest UX decision on this page and should be discussed with you before implementation, since it's a new interaction pattern, not a resize.

---

## 5. Session Page (`SessionPage.jsx`) — live collaboration

Same left/right split as Problem Page, but the **right panel is the video call** instead of AI tools (AI tools live inside the left-bottom sub-panel alongside the editor).

### Desktop (1440px)
```
┌────────────────────────────────────────────────────────────────┐
│ Navbar                                                            │
├───────────────────────────┬──────────────────────────────────────┤
│ LEFT (50%)                  │ RIGHT (50%) — Video call             │
│ ┌─────────────────────────┐ │ ┌──────────────────────────────────┐│
│ │ ProblemDescription (50%) │ │ │ [participant count] [Chat toggle] ││
│ │  header: Host, N/2         │ │ │                                    ││
│ │  [End Session] (host only) │ │ │       SpeakerLayout (video grid)   ││
│ └─────────────────────────┘ │ │                                    ││
│ ┌─────────────────────────┐ │ │                                    ││
│ │ CodeEditorPanel (70%)     │ │ │ [Call controls: mute/cam/leave]   ││
│ │  [sync indicator]           │ │ └──────────────────────────────────┘│
│ └─────────────────────────┘ │   (chat drawer slides in from right,  │
│ ┌─────────────────────────┐ │    w-96, when toggled)                 │
│ │ AI tools + Output (30%)   │ │                                        │
│ └─────────────────────────┘ │                                        │
└───────────────────────────┴──────────────────────────────────────┘
```
- **Layout:** 50/50 horizontal split; left further split vertically 50/50 (Problem/Editor+AI), matching current code (`Panel defaultSize={50}` nested twice, then `70/30` for editor vs AI+Output).
- **Spacing:** chat drawer is an overlay-in-flex-flow panel (`w-96` vs `w-0`), animated via `transition-all duration-300` — not a modal, so it doesn't block the video.
- **Hierarchy:** "End Session" (host-only, destructive color) is the highest-stakes action → visually isolated top-right of the problem header. Video call controls sit at the bottom of the right panel per `CallControls` convention (users expect controls at the bottom, matching Zoom/Meet mental models).
- **Navigation:** no page nav besides Navbar; leaving the call via `CallControls onLeave` routes to `/dashboard`.

### Laptop (1280px)
Same structure; percentages hold, Monaco/video both use `automaticLayout`/responsive canvas so no reflow logic needed.

### Tablet (768px)
```
┌───────────────────────────────┐
│ Navbar                           │
├───────────────────────────────┤
│ ⚠ Same concern as Problem Page:  │
│ horizontal resizable split is     │
│ not tablet-friendly.                │
│                                       │
│ Suggested (design-only) stacked flow: │
│ ┌───────────────────────────────┐    │
│ │ Video call (top, priority —      │    │
│ │ this is the "session" itself)     │    │
│ │  [participant count][chat]         │    │
│ │  video grid                          │    │
│ │  [controls]                            │    │
│ └───────────────────────────────┘    │
│ ┌───────────────────────────────┐    │
│ │ Problem + End Session               │    │
│ └───────────────────────────────┘    │
│ ┌───────────────────────────────┐    │
│ │ Editor (full width)                 │    │
│ └───────────────────────────────┘    │
│ ┌───────────────────────────────┐    │
│ │ AI tools / Output                    │    │
│ └───────────────────────────────┘    │
└───────────────────────────────┘
```
- **Key design call-out:** on tablet, video should likely lead (it's the "why are we here" element for a live interview), with problem/editor beneath — inverse of desktop's left-to-right priority. This reprioritization is worth validating with you before touching layout code, since it changes which `Panel` renders first in DOM/visual order.

### Mobile (390px)
```
┌───────────────────┐
│ Navbar               │
├───────────────────┤
│ Video (compact,       │
│ 16:9, top of screen)   │
│  [👥3] [💬]              │
│  [mic][cam][leave]        │
│                              │
│ ── tab bar ──                 │
│ [Problem|Code|AI|Output]        │
│                                    │
│ (active tab content, full-height)  │
└───────────────────┘
```
- **Responsive behavior:** mobile session view essentially becomes "video-call-first, everything else in tabs" — same tabbed pattern proposed for Problem Page, reused here for consistency (a good argument for extracting a shared `<TabbedWorkspace>` composition component if this direction is approved, rather than duplicating tab logic across both pages).

---

## Cross-cutting responsive rules (apply to all pages)

| Breakpoint | Container padding | Grid behavior | Nav labels |
|---|---|---|---|
| Desktop 1440 | `px-8` | full multi-col grids | full text + icon |
| Laptop 1280 | `px-8` | same grids, narrower gutters | full text + icon |
| Tablet 768 | `px-6` | 3-col→2-col, horizontal split panels → flagged for vertical/tabbed redesign | icon-only (`hidden sm:inline`) |
| Mobile 390 | `px-4` | everything 1-col; resizable panels → tab pattern | icon-only, UserButton always visible |

**Two open design decisions before any implementation**, since they involve new interaction patterns rather than pure CSS reflow:
1. Whether `ProblemPage`/`SessionPage` get a tabbed mobile/tablet layout (recommended) vs. simply stacking all panels vertically (simpler, but a very long scroll with an embedded Monaco editor mid-page, which fights for scroll gestures).
2. Whether the video call should reorder to the top on tablet/mobile for `SessionPage` (recommended for UX priority) or stay visually secondary like desktop for consistency.