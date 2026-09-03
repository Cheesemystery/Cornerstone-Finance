# Focused work sessions

Start with [PROJECT.md](../../PROJECT.md) and [STATUS.md](STATUS.md).

## Begin a task

- Work from the actual repository folder, not an empty new chat folder.
- Inspect Git status and relevant current source, including untracked files.
- Pick a bounded area from [AREAS.md](AREAS.md), identify shared dependencies and state what is out of scope.
- Read any relevant previous handoff, but verify it against code.
- Resolve conflicts with another task before editing overlapping files.

Example request: "Focus on the Learn page. Read PROJECT.md and the Learn area notes, inspect the current implementation, then improve the lesson cards without changing navigation, auth, or the rest of the site."

Keep the same chat while pursuing the same task. Start another for a materially different area. The files, not chat length or remembered statements, preserve project context.

## Multiple tasks

Separate task conversations can still edit the same checkout. A file map is not a lock.

- In one checkout, do not run simultaneous writers with overlapping files.
- Reserve shared layout, styles, domain types, fixtures, dependencies and migrations for one owner at a time.
- For isolated worktrees, ensure the intended starting state contains both current code and context documents.
- Do not create a fresh worktree from the old committed main and assume it contains the uncommitted Next.js app.
- Do not commit unrelated user work or move the repository merely to enable isolation.
- Integrate reviewed changes before starting dependent work, then rerun relevant checks.

## Validation

For docs-only work: validate local links, inspect diffs and confirm source/config files are unchanged.

For implementation work: run relevant unit checks plus lint/typecheck, and build when appropriate. UI work also needs route and responsive/keyboard checks. Auth/database/provider work needs explicitly authorized integration checks; passing unit tests does not establish service readiness.

Do not install or upgrade dependencies just to resolve an unrelated environment issue. Report failures honestly with what ran, what failed, and what was not tested.

## Finish or pause

Use [handoff template](handoffs/TEMPLATE.md) to create a uniquely named file such as `YYYY-MM-DD-learn-cards.md`. Record:

- Objective and actual scope.
- Files changed, implementation decisions and reasons.
- Checks and exact results.
- Known limitations, unfinished work and the next concrete step.
- Branch/commit if available; whether work remains uncommitted.

Update the relevant area/current-state notes when facts change. Update PROJECT.md only for durable architectural or product decisions. Preserve other tasks' entries. Never record secrets or real user financial data.

Do not claim a task is done if required work is still blocked. Handoffs document state; they do not authorize a different task, a deployment, or a production data change.

## App workspace note

The repository context works when future sessions open this folder and read its AGENTS.md. That entry point explicitly directs them to PROJECT.md; no global settings or fallback-filename configuration is required. This follows the [official AGENTS.md guidance](https://learn.chatgpt.com/docs/agent-configuration/agents-md).

Registering/opening this folder in the app is separate from writing repository files. This setup did not move the repository or add it to the app's saved local project list.
