**Status:** Foundation document — governs all v2 UI work.
**Scope:** Visual language only. No component code lives here; this defines the tokens and rules that all React components must consume.

---

## 0. Design Principles (read this first)

Every decision below traces back to four principles:

1. **Calm, not corporate.** Coderview is a practice space, not an enterprise dashboard. Interviews are already stressful — the UI should feel warm and unhurried (soft gradients, generous radius, glass panels) rather than dense and clinical (hard edges, tight grids, saturated primaries).
2. **One accent system, used consistently.** The existing brand gradient (forest green → teal → sky blue) is the *only* place saturated color appears prominently. Everything else is neutral. This keeps focus on code and video, not chrome.
3. **Function before flourish.** Every shadow, radius, and animation must earn its place by improving legibility, hierarchy, or feedback — not decoration for its own sake.
4. **Tokens, not magic numbers.** Nothing in a component should be a raw hex code, a raw `px` value, or a one-off shadow. Everything routes through the token layer below so a single change propagates everywhere.

---

## 1. Color Palette

### 1.1 Why a warm neutral base instead of pure white/gray?
Pure white (`#ffffff`) backgrounds read as "generic SaaS." The current cream/warm-gray base (`#fffdf7` → `#eef2ea`) is part of what makes Coderview feel distinct, and warm neutrals reduce eye strain during long coding sessions better than cold grays. We keep this as the **default (light) theme base**.

### 1.2 Brand gradient
The three-stop gradient is the single most recognizable brand element (logo, active nav pill, primary buttons, avatars). It must **never** be recreated with different stops — always reference the token.

```css
--gradient-brand: linear-gradient(135deg, #14532d 0%, #0f766e 55%, #0284c7 100%);
```

**Why these three colors specifically:** forest green (growth/practice), teal (the bridge/transition color, avoids a jarring green→blue jump), sky blue (technology/video call context). Together they read as "collaborative + technical," matching the product.

### 1.3 Core palette tokens

| Token | Light value | Dark value | Usage | Why |
|---|---|---|---|---|
| `--color-bg` | `#fdfbf5` | `#0b0f14` | App background | Warm cream vs. near-black (not pure black — pure black causes halation with bright code syntax colors) |
| `--color-surface` | `rgba(255,255,255,0.78)` | `rgba(24,30,38,0.72)` | Panel fill | Semi-transparent so the ambient gradient orbs read through, reinforcing brand without adding new elements |
| `--color-surface-strong` | `rgba(255,255,255,0.92)` | `rgba(24,30,38,0.9)` | Modals, sticky headers | Higher opacity where content must never be ambiguous (forms, code) |
| `--color-border` | `rgba(16,24,40,0.08)` | `rgba(255,255,255,0.08)` | Hairlines | Kept extremely low-contrast; borders should be felt, not seen |
| `--color-ink` | `#101828` | `#e7ecf3` | Primary text | Near-black/near-white, never pure — pure values create excessive contrast that fatigues on large panels |
| `--color-muted` | `#5f6c7b` | `#9aa7b5` | Secondary text | Meets 4.5:1 against both surface tokens (verified) |
| `--color-accent-emerald` | `#0f766e` | `#2dd4bf` | Success, hints | Same hue family as brand, shifted brighter in dark mode for sufficient contrast on dark surfaces |
| `--color-accent-amber` | `#b45309` | `#fbbf24` | Warnings, medium difficulty | Warm accent reserved for "attention, not danger" |
| `--color-accent-rose` | `#be123c` | `#fb7185` | Errors, hard difficulty, destructive actions | The *only* red in the system — scarcity keeps it meaningful |
| `--color-accent-sky` | `#0369a1` | `#38bdf8` | Info, links, participant/video context | Ties back to the video-call portion of the brand gradient |

**Why a strict token table instead of a full 50–900 Tailwind-style ramp:** Coderview's UI has a small number of *semantic* roles (bg, surface, text, 4 accents). A full numeric ramp invites developers to reach for `slate-450` ad hoc. Naming by role, not number, makes misuse visible in code review ("why is there a raw `#334155` here?").

### 1.4 Difficulty color mapping (existing convention, formalized)
- Easy → `--color-accent-emerald`
- Medium → `--color-accent-amber`
- Hard → `--color-accent-rose`

This mapping is already implicitly used (`badge-success/warning/error`) — v2 makes it an explicit, documented contract so any new "difficulty" surface (charts, filters, stats) uses it automatically.

---

## 2. Typography

### 2.1 Typeface pairing
- **Display/UI: Space Grotesk** — a geometric sans with slightly technical character. Used for all headings, buttons, nav, labels.
- **Code/data: IBM Plex Mono** — used for the editor, console output, constraint chips, session IDs.

**Why this pairing:** Space Grotesk has enough personality to avoid looking like default system UI, while remaining highly legible at small sizes (critical for dense dashboard stats). Plex Mono is metrics-compatible with Space Grotesk's x-height, so inline code (`<code>`) doesn't look visually foreign inside prose.

**Why not a third font for body text:** A third typeface adds a load-time cost and a decision surface with no real benefit — Space Grotesk at regular weight is fully legible as body copy.

### 2.2 Type scale

| Token | Size / Line-height | Weight | Usage |
|---|---|---|---|
| `--text-display` | 60px / 0.95 | 700 | Hero H1 only (Home page) |
| `--text-h1` | 36–48px / 0.95 | 700 | Page titles |
| `--text-h2` | 28–30px / 1.1 | 700 | Section headers |
| `--text-h3` | 20px / 1.2 | 700 | Card titles |
| `--text-body-lg` | 18px / 1.75 | 400 | Lead paragraphs |
| `--text-body` | 14–16px / 1.6 | 400 | Default body |
| `--text-sm` | 13–14px / 1.5 | 400/600 | Secondary text, buttons |
| `--text-mini-label` | 11px / 1.4 | 600, uppercase, +0.22em tracking | Eyebrow/kicker labels |
| `--text-code` | 15px / 22px | 400/500 | Editor + console |

**Why negative letter-spacing on headings (`-0.04em` to `-0.06em`):** Space Grotesk's default spacing looks slightly loose at large sizes; tightening it at H1/logo scale makes headlines feel intentional rather than "default browser heading."

**Why uppercase + wide tracking for mini-labels:** This is the system's only "eyebrow" pattern. Uppercase+tracked text at 11px is legible without competing with the H1/H2 beneath it, and gives every section a consistent "kicker → headline" rhythm.

### 2.3 Rules
- Never go below 13px for interactive text (buttons, form labels) — accessibility floor.
- Never use more than 3 weights per screen (400 body, 600 emphasis, 700 headings).
- Line length for body copy capped at `65ch` via container max-widths — improves reading comprehension, especially in AI hint/review panels.

---

## 3. Spacing System

An **8px base grid** with a 4px half-step for tight contexts (icon gaps, badge padding).

| Token | Value | Typical use |
|---|---|---|
| `--space-1` | 4px | Icon-to-text gap |
| `--space-2` | 8px | Chip padding, tight stacks |
| `--space-3` | 12px | Inline gaps |
| `--space-4` | 16px | Default component padding |
| `--space-5` | 20px | Card internal padding (compact) |
| `--space-6` | 24px | Card internal padding (default) |
| `--space-8` | 32px | Section internal spacing |
| `--space-10` | 40px | Section-to-section spacing |
| `--space-12`+ | 48px+ | Hero/page-level spacing |

**Why 8px base:** Divides cleanly across common breakpoints and aligns with the 44px minimum touch target (44 = 8×5.5, close enough with a 4px nudge) without needing a separate "touch" scale. Every padding/margin/gap value in the codebase should resolve to one of these tokens — if a design needs 18px, that's a signal to round to 16 or 20, not to invent `--space-4.5`.

**Why a slightly bigger gap between sections (40px+) than between elements (16–24px):** Reinforces visual grouping (Gestalt proximity) so a scanning eye can tell "these three stat cards are one group" from "this is a new section" without needing a divider line on every boundary.

---

## 4. Border Radius

| Token | Value | Usage | Why |
|---|---|---|---|
| `--radius-sm` | 12px | Badges, small chips | Enough softness to avoid "sharp box" feel at small sizes |
| `--radius-md` | 16–20px | Buttons, inputs, select | Matches hand/thumb-friendly tap targets |
| `--radius-lg` | 22–24px | Icon tiles, avatars | |
| `--radius-xl` | 28px | **All surface panels/cards** | The system's signature radius — every `surface-panel` currently uses this; keep it singular so panels always read as "part of the same family" |
| `--radius-full` | 9999px | Pills (nav, buttons, status chips) | Pills communicate "action" or "state," and full-round is the strongest visual signal for that vs. a card's soft-square |

**Why exactly one radius (28px) for all major panels instead of a range:** Radius consistency is one of the fastest ways a UI reads as "designed" vs. "assembled." Any new panel component should default to `--radius-xl` without a decision being made per-component.

---

## 5. Shadows / Elevation

Elevation communicates **z-order and interactivity**, not decoration.

| Token | Value | Usage |
|---|---|---|
| `--shadow-xs` | `0 4px 12px rgba(16,24,40,0.06)` | Chips, inline elements |
| `--shadow-sm` | `0 20px 60px rgba(16,24,40,0.08)` | Default cards (`surface-panel`) |
| `--shadow-md` | `0 24px 70px rgba(16,24,40,0.12)` | Emphasized panels (`surface-panel-strong`), modals |
| `--shadow-lg` | `0 30px 80px rgba(16,24,40,0.18)` | Modal boxes, floating overlays |
| `--shadow-glow-brand` | `0 16px 34px rgba(15,118,110,0.28)` | Brand-gradient elements only (logo tile, primary buttons, active avatars) |

**Why large-radius, low-opacity, high-blur shadows instead of tight drop-shadows:** Tight shadows (`0 2px 4px rgba(0,0,0,0.2)`) read as "Material Design default" and feel harsh against the warm background. Large, diffuse, low-opacity shadows feel like ambient light rather than a hard drop — consistent with the "calm" principle above. Colored glow shadows (`--shadow-glow-brand`) are reserved for brand-gradient elements only, so glow always signals "this is a primary/brand action."

**Rule:** Never stack more than 2 elevation levels of shadow in dark mode — shadows are far less effective visually on dark surfaces (low value contrast), so dark mode relies more on **border + surface-opacity separation** than shadow (see §22).

---

## 6. Cards

Three card variants, matching current usage, formalized:

1. **`surface-panel`** — default card. `radius-xl`, `shadow-sm`, `surface` background, hairline border. Used for list items (sessions, problems).
2. **`surface-panel-strong`** — emphasized card. `radius-xl`, `shadow-md`, `surface-strong` background. Used for page headers, welcome banners, sticky panel headers — anything that should visually "sit above" the surrounding panels.
3. **`surface-dark`** — inverse card. Used *only* for code-adjacent surfaces (editor shell, console output) — signals "this is a technical/output zone," distinct from the warm content chrome around it.

**Why only three variants:** More card types multiply decision fatigue for future contributors ("should this be `panel` or `panel-strong`?"). Three variants map directly to three semantic roles: *content*, *emphasized content*, *technical output*.

**Card anatomy rules:**
- Padding: `--space-6` (24px) desktop, `--space-4`–`--space-5` mobile.
- Optional `hero-orb` decorative blur — max 2 per panel, opacity ≤ 0.3, purely ambient, must never sit behind interactive text (accessibility: decoration must not reduce text contrast).
- Hover state (interactive cards only): `translateY(-4px)` + shadow step-up, `200ms ease-out` — signals "clickable" without a border-color change (border-color changes are reserved for validation states, see §9).

---

## 7. Buttons

| Variant | Style | Usage | Why |
|---|---|---|---|
| **Primary (`action-button`)** | Full pill, brand gradient fill, white text, `shadow-glow-brand` | The one primary action per view (Create Session, Run Code, Get Hint) | Gradient + glow = maximum visual weight, reserved so it's unambiguous which action is "the" action |
| **Secondary (`action-button-secondary`)** | Full pill, translucent white/dark fill, ink text, hairline border | Cancel, alternate actions | Same shape as primary (pill) so they read as siblings in a button group, but no color/glow — clearly de-emphasized |
| **Outline** | Rounded-2xl (not full pill), transparent fill, bordered | Secondary in-context actions (Review Code, Explain Problem) inside cards | Slightly less rounded than the two "pill" actions — signals "utility action within a panel" vs. "primary flow action" |
| **Destructive** | Pill, rose gradient, white text | End Session and similar | Rose is used *nowhere else* as a fill color, so its appearance alone signals danger without needing a confirm-dialog for every case (though irreversible actions like End Session still get a `confirm()`/modal) |

**States (apply to all variants):**
- `:hover` → 4–6% lightness shift + shadow step-up, `150ms ease-out`.
- `:focus-visible` → 2px `--color-accent-sky` outline, 2px offset (never remove focus rings — see §23).
- `:disabled` → 60% opacity, `cursor: not-allowed`, no hover transform.
- Loading → icon swapped for spinner, label stays (e.g., "Creating..."), button width does not shift (reserve space via `min-width` or flex) to avoid layout jump.

**Why pill-shape is reserved for "flow" actions and rounded-rect for "in-panel utility" actions:** This gives users a subconscious hierarchy cue — pills are bigger commitments (create, run, submit), rounded-rects are lighter utility actions — without needing size or color to do all the work.

---

## 8. Inputs

- Height: 44px minimum (accessibility tap target).
- Radius: `--radius-md` (16–20px) — softer than buttons' full-pill, so forms don't look like a row of buttons.
- Background: solid white/dark surface (not translucent) — inputs are the one place translucency is avoided, because legibility of user-typed text must never compete with a background pattern showing through.
- Border: 1px `--color-border` default → `--color-accent-sky` on focus, 2px.
- Placeholder text: `--color-muted` at 70% opacity — must still pass a *reduced* contrast bar since it's non-essential hint text, but never so low it's unreadable for low-vision users.
- Error state: border → `--color-accent-rose`, plus an inline icon + text message below (color alone is never the only error signal — see §23).

**Why solid backgrounds for inputs specifically, breaking the "translucent surface" pattern used everywhere else:** Forms are the highest-stakes legibility context in the app (users type problem answers, session details). Consistency-for-its-own-sake would hurt usability here, so this is a deliberate, documented exception.

---

## 9. Dropdowns / Selects

- Trigger styled identically to a same-sized input (radius, height, border) so users pattern-match "this is a form field."
- Menu panel: `surface-panel-strong`, `shadow-md`, `radius-lg` (slightly smaller than the 28px panel radius, since dropdown menus are transient, not persistent content).
- Menu items: 44px min height, `radius-sm` on hover highlight (inset, not full-bleed), keyboard-navigable with visible focus state matching `:focus-visible` button rules.
- Selected item: checkmark icon + `--color-accent-emerald` text, never color-fill-only (same non-color-alone rule as errors).

**Why the menu panel is a slightly smaller radius than main content panels:** Radius scale should loosely track "permanence" — the biggest, most rounded panels are the most persistent (page cards); ephemeral overlays (dropdowns, tooltips) step down slightly so the eye can tell "this will go away" from ambient visual weight alone.

---

## 10. Modals

- Backdrop: `rgba(15,23,42,0.45)` — dark, translucent, no blur (blur on backdrop is expensive on lower-end devices and this app already runs Monaco + video, both GPU/CPU-heavy).
- Modal box: `surface-panel-strong` variant, `radius-xl`, `shadow-lg`, max-width `2xl` (matches existing `CreateSessionModal`).
- Entrance: fade + scale from 96%→100%, `200ms ease-out`. Exit: reverse, `150ms` (exits are faster than entrances — see Motion §21).
- Focus trap required: focus moves to the modal on open, returns to the trigger element on close (accessibility).
- Escape key and backdrop click both close **unless** the modal represents a destructive/irreversible confirmation (End Session) — then require explicit button interaction to avoid accidental dismissal of a decision point.

---

## 11. Navbar

- Sticky, `top-4` offset (floats slightly below the viewport edge, not flush) — reinforces the "glass panel floating over an ambient background" language used everywhere else, rather than a flush-edge enterprise app bar.
- Active route: pill fill = brand gradient (the *only* other place besides the logo tile and primary buttons the full gradient appears — active nav state deserves the same visual weight as a primary action, since it answers "where am I").
- Inactive routes: ghost pill, `color-muted` text, hover → `color-ink` text + subtle bg tint.
- Height: fixed 64px content row + `space-3` padding — tall enough for comfortable click targets, short enough not to eat vertical space from the editor/video panels below.

---

## 12. Sidebars

*(Not present in v1 but specified for v2 growth — e.g., a future problem-list sidebar or session history rail.)*

- Width: 280px expanded / 72px collapsed (icon-only).
- Background: `surface` (not `surface-strong`) — sidebars are persistent chrome, not focal content, so they should recede relative to the main panel.
- Collapse affordance: icon-flip chevron, `200ms` rotate, persists user preference in local state (not global settings) since it's a per-session layout choice.
- Active item: left-border accent (`3px`, brand gradient or `accent-emerald`) + subtle bg tint — **not** a full pill fill like the navbar, because a vertical list of pill-fills is visually noisier than a single horizontal nav; a border-accent scans better in a list context.

**Why sidebars get a different "active" treatment than the top navbar:** Different layout axis, different scan pattern. Top nav is scanned left-right with 3-4 items — full pill fill works. A sidebar list may have 10+ items — a left-border accent is lower-noise at that density.

---

## 13. Resizable Panels

(`react-resizable-panels`, used extensively in Session/Problem pages)

- Handle: 4px thick, gradient tint (`rgba(brand-stops, low-opacity)`) rather than flat gray — a small, consistent brand touch in a purely functional element, at zero cost to usability.
- Handle hover/active: thickens to 6px, opacity increases — must give clear affordance since resize handles are notoriously easy to miss.
- Minimum panel sizes are **non-negotiable floors**, not suggestions: editor ≥ 20%, problem description ≥ 20%, video ≥ 30% — prevents a user from resizing a panel into unusability (e.g., a 2%-width Monaco editor).
- Panel resize should **never** cause reflow-jank in the video call or editor — both must use `automaticLayout`/responsive containers, not fixed pixel dimensions, so a resize is smooth rather than a jarring re-render.

---

## 14. Empty States

Every empty state follows the same anatomy (already used for "No active sessions" / "No sessions yet"):

1. Icon tile (soft gradient-tinted circle, 96px), using an icon that's *specific* to the context (Sparkles for sessions, Trophy for history) — never a generic "empty box" icon.
2. Bold headline (`text-h3`), stating the fact plainly ("No active sessions").
3. One supporting sentence (`text-sm`, muted) that's **actionable or reassuring**, not just descriptive ("Be the first to open a live workspace" vs. a flat "There is no data").
4. Optional CTA button, only if there's a clear next action available from that exact screen.

**Why this template matters:** An empty state is often a new user's *first* impression of a feature. Treating it as a designed moment (not a fallback `if (!data) return null`) measurably improves first-session retention, and keeps tone consistent with the product's generally encouraging voice.

---

## 15. Error States

- **Inline/field errors:** rose border + icon + one-line message directly under the field. Never a toast for field-level validation (toasts are for events, not persistent form state).
- **Panel-level errors** (failed fetch, AI request failed): replace panel content with a compact state — icon (rose-tinted, not a full red panel — avoid "alarm" framing for recoverable errors), message, and a **Retry** action when the failure is retryable.
- **Fatal/blocking errors** (e.g., video connection failed, from `SessionPage`): the existing pattern — icon tile in rose, clear headline, one explanatory line — is correct and should be the template for any new blocking-error surface.
- Copy tone: always state what happened + what the user can do, never a raw stack trace or status code in user-facing copy.

**Why rose is used sparingly even within "error" contexts (tinted icon, not a full red background):** A full saturated-red panel spikes cortisol response and reads as more catastrophic than most of these situations actually are (a failed AI hint is not the same severity as a lost video connection). Reserving strong rose fill only for the destructive-button and true blocking-failure cases keeps the signal meaningful.

---

## 16. Loading States

Three tiers, matched to duration expectation:

1. **Inline spinner** (button loading, e.g., "Creating...") — for actions expected to resolve in under ~2s. Icon-swap only, no skeleton.
2. **Section spinner** (centered `LoaderIcon`, current pattern for session lists) — for data fetches of unknown-but-moderate duration. Used today; keep for consistency, but consider skeleton upgrade (see below) for anything user-perceived as "slow."
3. **Skeleton screens** (recommended addition for v2) — for card-grid content (problem list, recent sessions) where a spinner-in-a-void causes layout shift once data arrives. A skeleton matching the final card's dimensions prevents that shift and feels faster even at identical load time (established UX research on perceived performance).

**Why not skeletons everywhere today:** Skeletons are worth the implementation cost only where layout shift is a real risk (multi-item grids). For single async values (a button label, a single stat number), a spinner is simpler and equally effective — don't over-engineer loading states for low-shift-risk content.

---

## 17. Toasts

(`react-hot-toast`, already in use)

- Position: top-center or top-right, consistent app-wide (pick one; recommend top-right for RTL/LTR-agnostic behavior and to avoid covering primary content on mobile).
- Duration: 3s default (already configured) — long enough to read, short enough not to accumulate if multiple fire.
- Success: emerald accent icon + border-left. Error: rose. Never rely on color alone — icon shape (check vs. X) carries the meaning redundantly.
- Max concurrent: 3 stacked, oldest auto-dismissed early if a 4th arrives — prevents toast pile-up during rapid actions (e.g., rapid hint requests).
- Toasts are for **transient confirmations of user-initiated actions** (session created, code review ready) — never for information the user must act on (that belongs in an inline or modal state, since toasts can be missed).

---

## 18. Icons

- Library: **lucide-react**, exclusively — one icon library prevents visual-weight mismatches (different libraries have different stroke widths/corner styles that clash when mixed).
- Stroke width: default (2px) at all sizes — never mix stroke weights within one screen.
- Sizing tokens: `16px` (inline/text-adjacent), `20px` (buttons/nav), `24px` (section headers), `28–32px` (icon tiles).
- Color: icons inherit text color by default; only icon-tile icons (in a colored circle) get an explicit accent color — keeps icons from competing with text for attention everywhere else.

---

## 19. Animations

| Interaction | Duration | Easing | Why |
|---|---|---|---|
| Hover (buttons, cards) | 150–200ms | `ease-out` | Fast enough to feel responsive, slow enough to be perceived as smooth rather than a snap |
| Panel/modal entrance | 200–250ms | `ease-out` | Slightly slower than hover — entrances introduce new information, so a touch more time lets the eye register it |
| Panel/modal exit | 120–150ms | `ease-in` | Exits should always feel *faster* than entrances — reinforces that leaving is "free"/low-friction, encouraging exploration |
| Resize handle drag | 0ms (direct manipulation) | n/a | Anything tracking a live pointer must never be eased — eased dragging feels laggy/disconnected from the cursor |
| Confetti (test pass) | one-shot, ~1.5s | physics-based (canvas-confetti default) | Celebratory moments are the *one* place in the system that gets an expressive, non-token animation — reserved for genuine positive milestones (passing tests), not overused |
| Skeleton shimmer | 1.2s loop | linear | Loops must be perfectly seamless (linear, not eased) or the seam becomes a distraction over a multi-second load |

**Global rule:** No animation exceeds 300ms except confetti and skeleton loops (which are non-blocking, decorative loops, not state-transition animations). Interfaces that make users *wait* on decorative motion feel slower even when they're not.

---

## 20. Motion Guidelines (Reduced Motion)

- All transitions/animations must be wrapped so they respect `prefers-reduced-motion: reduce`:
  - Hover/focus transforms (translateY, scale) → disabled, replaced with instant color/shadow change only.
  - Modal/panel entrance → fade only, no scale.
  - Confetti → suppressed entirely (motion-triggering, non-essential).
  - Resize/drag interactions are exempt (direct manipulation, not ambient motion, and disabling it would break the resizable-panel feature itself).
- This isn't optional polish — vestibular disorders are a real accessibility category (WCAG 2.3.3), and the fix is nearly free (one media query at the token layer) if animations are token-driven from the start rather than hardcoded per component.

---

## 21. Dark Theme

Dark mode is **not** an inverted light theme — it's a parallel token set following different rules, because flipping black/white directly breaks perceived depth and shadow logic.

| Aspect | Light | Dark | Why different |
|---|---|---|---|
| Base bg | Warm cream | Near-black blue-gray (`#0b0f14`), not pure black | Pure black causes halation against bright accent colors and syntax highlighting; a near-black with a hint of blue keeps the "cool tech" feeling appropriate to dark mode |
| Panel separation | Shadow-driven (light panels "float" via shadow on a light bg) | **Border + opacity-driven** (`1px` lightened border + slightly lighter surface fill) | Shadows barely register on dark backgrounds (low luminance contrast) — dark UIs universally rely on subtle borders/surface-lightness steps instead |
| Brand gradient | Full saturation | Same hue stops, +8–10% lightness | Keeps the gradient legible/vibrant against a dark base without changing brand identity |
| Text | Near-black on light | Near-white (`#e7ecf3`), never pure white | Pure white on dark backgrounds causes eye strain/halation on large text blocks (same principle as base bg) |
| Difficulty accents | Standard | Slightly desaturated + lightened | Fully-saturated light-mode accent colors (`#0f766e`, `#b45309`) can look muddy or overly dark on a dark base; a controlled lightness bump keeps them legible and vivid |

**Why implement dark mode via tokens (CSS variables) rather than a Tailwind `dark:` class on every element:** With a token layer, dark mode is a single variable-swap at the root, and every component (existing or new) inherits it automatically. Class-based dark variants require every component author to remember to add `dark:` on every color utility — a maintenance trap as the component count grows.

**Theme toggle:** persists to `localStorage`, defaults to OS `prefers-color-scheme` on first visit — respects user intent without forcing a manual choice up front.

---

## 22. Accessibility Rules

Non-negotiable, checked in PR review:

1. **Contrast:** All body text ≥ 4.5:1, all large text (≥24px or ≥19px bold) ≥ 3:1, against their actual rendered background (including translucent panel-over-gradient cases — test the worst-case overlap, not just the flat color).
2. **Focus visibility:** Every interactive element has a visible `:focus-visible` state (2px accent-sky outline, 2px offset). Never `outline: none` without a replacement.
3. **Color is never the only signal:** errors (icon + text), success (icon + text), difficulty (badge text label, not just background color), selected state (checkmark, not just fill).
4. **Touch targets:** minimum 44×44px for anything tappable, including icon-only buttons — enforced via padding, not icon size inflation.
5. **Keyboard navigation:** all modals, dropdowns, and the resizable panel handles must be operable via keyboard (Tab/Arrow/Escape) — resizable panels specifically need an accessible fallback (e.g., arrow-key resize when a handle has focus) since drag-only interactions exclude keyboard/switch users.
6. **Motion:** honors `prefers-reduced-motion` (see §20).
7. **Semantic structure:** one `<h1>` per page, heading levels don't skip (no `<h1>` → `<h3>`), form inputs always have associated `<label>`s (visually hidden if a placeholder-only design is desired — placeholder text is never a substitute for a real label).
8. **Alt text / ARIA:** decorative elements (`hero-orb` blurs, gradient icon tiles used purely for flourish) get `aria-hidden="true"`; functional icons (icon-only buttons) get accessible names via `aria-label`.

**Why this section is exhaustive rather than a single "be accessible" line:** Accessibility rules that live only as a vague principle get skipped under deadline pressure. A checklist that's specific and testable is the only version that reliably survives contact with a sprint.

---

## Summary: Token Layer Recap

Every rule above ultimately resolves to a small set of CSS custom properties:

```css
:root {
  /* Color */
  --color-bg: #fdfbf5;
  --color-surface: rgba(255,255,255,0.78);
  --color-surface-strong: rgba(255,255,255,0.92);
  --color-border: rgba(16,24,40,0.08);
  --color-ink: #101828;
  --color-muted: #5f6c7b;
  --color-accent-emerald: #0f766e;
  --color-accent-amber: #b45309;
  --color-accent-rose: #be123c;
  --color-accent-sky: #0369a1;
  --gradient-brand: linear-gradient(135deg, #14532d 0%, #0f766e 55%, #0284c7 100%);

  /* Type */
  --font-display: "Space Grotesk", sans-serif;
  --font-mono: "IBM Plex Mono", monospace;

  /* Spacing (8px base) */
  --space-1: 4px; --space-2: 8px; --space-3: 12px; --space-4: 16px;
  --space-5: 20px; --space-6: 24px; --space-8: 32px; --space-10: 40px;

  /* Radius */
  --radius-sm: 12px; --radius-md: 18px; --radius-lg: 22px;
  --radius-xl: 28px; --radius-full: 9999px;

  /* Shadow */
  --shadow-xs: 0 4px 12px rgba(16,24,40,0.06);
  --shadow-sm: 0 20px 60px rgba(16,24,40,0.08);
  --shadow-md: 0 24px 70px rgba(16,24,40,0.12);
  --shadow-lg: 0 30px 80px rgba(16,24,40,0.18);
  --shadow-glow-brand: 0 16px 34px rgba(15,118,110,0.28);

  /* Motion */
  --duration-fast: 150ms;
  --duration-base: 200ms;
  --duration-slow: 250ms;
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-in: cubic-bezier(0.7, 0, 0.84, 0);
}

[data-theme="dark"] {
  --color-bg: #0b0f14;
  --color-surface: rgba(24,30,38,0.72);
  --color-surface-strong: rgba(24,30,38,0.9);
  --color-border: rgba(255,255,255,0.08);
  --color-ink: #e7ecf3;
  --color-muted: #9aa7b5;
  --color-accent-emerald: #2dd4bf;
  --color-accent-amber: #fbbf24;
  --color-accent-rose: #fb7185;
  --color-accent-sky: #38bdf8;
}

@media (prefers-reduced-motion: reduce) {
  :root {
    --duration-fast: 0ms;
    --duration-base: 0ms;
    --duration-slow: 0ms;
  }
}
```

This block is the single source of truth. No future component should hardcode a hex value, px radius, or shadow string that isn't one of these tokens — if a new need arises, it gets added here first, with a documented "why," before it's used anywhere in the app.