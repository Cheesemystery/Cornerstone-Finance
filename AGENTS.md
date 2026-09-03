<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Permanent project context

- Read `PROJECT.md` and `docs/project/STATUS.md` before beginning work.
- Read the relevant area in `docs/project/AREAS.md`, then inspect its current source and Git status. Do not rely on old chat history as the source of truth.
- Follow `docs/project/WORKFLOW.md` for scope, shared-file coordination, verification, and handoffs.
- Preserve existing tracked and untracked user work. The Next.js application and legacy static site coexist; do not migrate, remove, or redesign either without an explicit request.
- Keep credentials and user financial data out of documentation, logs, client code, and analytics. Follow `SECURITY.md` and `BETA.md`.
- When a task changes architecture or behavior, update the relevant context and leave a uniquely named handoff using `docs/project/handoffs/TEMPLATE.md`.
- Do not replace the generated Next.js guidance above. Documentation-only tasks do not authorize functionality changes, dependency upgrades, migrations, deployments, or commits.
