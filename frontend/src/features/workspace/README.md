# workspace/

Intentionally empty as of Sprint 0.

Per `docs/DEVELOPMENT_ROADMAP.md`, this folder is populated across three sprints:

- **Sprint 5 — Workspace Core:** `components/ProblemPanel/*`, `components/CodeEditor/*`, `components/OutputConsole/*`
- **Sprint 6 — Workspace AI Actions:** `components/AIPanel/AIActionCard.jsx`, `components/AIPanel/AIInsightCard.jsx`, `hooks/useAIAction.js`, `hooks/useCodeExecution.js`
- **Sprint 7 — WorkspaceLayout & ProblemPage Rewrite:** `components/WorkspaceLayout.jsx`, `hooks/useWorkspaceState.js`

This is the highest-leverage folder in the rewrite (`docs/FRONTEND_AUDIT.md` §1.1) — it's what `ProblemPage` and `SessionPage` will both compose from instead of duplicating ~70% of their logic.

This file exists only to keep the folder tracked in git until it has real contents.
