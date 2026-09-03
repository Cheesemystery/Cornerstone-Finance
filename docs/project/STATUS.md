# Current state

## Git baseline update — 2026-09-03

The user subsequently authorized committing and pushing the local modernization and project context to GitHub. The commit containing [this handoff](handoffs/2026-09-03-github-baseline.md) captures that shared baseline on main. The uncommitted-state descriptions below are historical observations from the earlier context-only setup. Feature gaps remain unchanged. Local logs and private environment files are excluded from Git.

For the baseline task, lint, TypeScript, all six tests, production build and dependency audit passed (zero dependency findings). The local site returned HTTP 200 on port 3001. No live integration or deployment was performed. Verify remote commit identity before starting a new worktree.

Inspection date: 2026-09-03. Re-check the code and Git state at the beginning of each task.

## Workspace baseline

- Repository: Cornerstone-Finance; remote: `https://github.com/Cheesemystery/Cornerstone-Finance.git`.
- Local checkout at inspection: `C:\Users\abrah\Documents\Codex\2026-09-02\my-website-code-is-in-a\Cornerstone-Finance`.
- Branch: `main`; inspected HEAD: `2b69bd9` (Fix What-If Simulator dark theme).
- Existing tracked modifications: `.gitignore`, `cyberpunk-theme.css`, `package.json`, `package-lock.json`.
- Most Next.js source, configuration, security docs, CI definitions, and the newest migration were untracked before the context setup.
- No existing changes were committed, reverted, moved, or discarded by this context-only setup.
- This folder was not listed as a saved local app project during setup. Add/open this exact repository folder for future site tasks, rather than creating another empty projectless folder.
- Until the modernization and context files are intentionally saved into Git, a fresh clone or worktree from committed main will not contain this local state.

## Implemented versus scaffolded

| Surface | Verified from source |
| --- | --- |
| Home / portfolio | Sample holdings and deterministic briefing calculations; some static UI metrics and dates |
| Discover | Local sample-news filtering; separate Finnhub-capable API exists but is not wired to UI |
| Learn | Six cards, placeholder destinations |
| Assistant | Client placeholder and separate safe fallback API; no model integration |
| Sign-in | Supabase magic-link request/callback code; live service not tested |
| Onboarding | Three-step local state; CSV filename feedback; authenticated Plaid link-token request |
| CSV parser | Separate validated utility with unit tests; not integrated into onboarding |
| Plaid | Link-token creation only, not full account linking or sync |
| Settings | Static rows and non-functional deletion control |
| Database | Migration files only; deployed schema and policy behavior not verified |
| Monitoring | Optional initialization code; external configuration not verified |

## Important open questions — not approved implementation tasks

1. Which implementation and domain are currently deployed? Confirm before altering hosting or removing legacy files.
2. Which legacy student/campus/competition features should be retained or ported?
3. When should the existing local modernization be reviewed and committed as a shared baseline?
4. What is the intended end-to-end portfolio import/connection/persistence lifecycle?
5. Which sample metrics, timestamps and fixture headlines must be replaced or relabeled before beta?
6. What backend must support account deletion, preferences, quotas and integration failures?
7. How will cross-user authorization, provider sync, webhooks and source freshness be tested before external use?

Security and beta release gates remain in SECURITY.md and BETA.md. This source inventory is not a security audit or production-readiness certification.

## Verification record

Context setup changes only Markdown documentation and agent guidance. Baseline checks and documentation validation are recorded in [setup handoff](handoffs/2026-09-03-workspace-context.md).

No live auth email, provider connection, remote database change, dependency installation/upgrade, build deployment or Git push was performed.

## Maintenance

Replace stale statements when behavior changes; date the verification and cite files or tests. Keep unresolved possibilities separate from confirmed behavior. Do not mark a planned feature as implemented just because a page, schema, environment variable or package exists.
