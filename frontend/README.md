# Frontend Notes

The main project documentation lives in the root [README](../README.md).

This frontend is a React + Vite app that handles:

- Clerk authentication UI
- dashboard, problem, and session pages
- Monaco code editor integration
- Stream video/chat client setup
- API calls to the backend

Run it locally with:

```bash
npm run dev
```

## v2 Rewrite in progress

This frontend is being incrementally rewritten per the plan in
[`../docs/DEVELOPMENT_ROADMAP.md`](../docs/DEVELOPMENT_ROADMAP.md). Two new
top-level folders were introduced in Sprint 0 and are populated sprint by
sprint — see `../docs/PROJECT_ARCHITECTURE.md` for the target shape:

- `src/design-system/` — shared, business-logic-free UI primitives, layout
  wrappers, feedback components, and the CSS token layer.
- `src/features/` — feature-sliced domain code (`dashboard`, `problems`,
  `workspace`, `session`), replacing the current flat `src/components/`
  directory over time.

Until each sprint's migration lands, `src/components/` and `src/pages/`
remain the live, working implementation — no behavior changes as a result
of the new folders existing.
