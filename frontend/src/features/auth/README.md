# auth/

Intentionally empty as of Sprint 0.

Reserved per `docs/PROJECT_ARCHITECTURE.md` §2 for Clerk-specific wrappers (e.g. styled `SignInButton`, a `UserMenu` wrapper around Clerk's `UserButton`).

This folder is **not** scheduled in a specific sprint in `docs/DEVELOPMENT_ROADMAP.md`. Auth flow itself is explicitly out of scope for this rewrite (see `docs/README.md`: "Backend APIs remain unchanged," and Clerk gating in `App.jsx` is called out in `docs/PROJECT_ARCHITECTURE.md` §4 as staying exactly as-is). This folder would only be populated if a later sprint needs to extract Clerk UI wrappers for consistency — not before.

This file exists only to keep the folder tracked in git until (or unless) it has real contents.
