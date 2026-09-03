# Workspace context setup

Date: 2026-09-03
Status: Repository context complete; app registration requires user action.
Area: Project documentation and work-session organization.
Branch at inspection: main, HEAD 2b69bd9; existing modernization remains uncommitted.

## Scope and changes

Inspected the repository's source inventory, current Next.js routes/components/domain/provider code, legacy entry points and modules, CSS organization, migrations, environment names, tests, Git state and CI/deployment definitions. Generated dependencies/build caches were excluded from source review; the deployment ZIP was inventoried, not executed. No live deployment or database was inspected.

Added PROJECT.md, README.md, docs/project/AREAS.md, STATUS.md, WORKFLOW.md, a handoff template and this handoff. Appended the context entry point to AGENTS.md without removing the Next.js-generated block. CLAUDE.md already references AGENTS.md and was left unchanged.

No runtime source, configuration, dependencies, SQL, assets, or existing functionality was changed. No files were moved or deleted. Existing uncommitted work was preserved.

## Decisions

- Keep the existing repository in place rather than create a duplicate or move a running workspace.
- Use PROJECT.md for concise durable context, AREA notes for scoped navigation, STATUS for dated facts and handoffs for individual sessions.
- Explicitly distinguish the current npm application from the legacy static website, and implemented behavior from scaffolds.
- Use the existing AGENTS.md as the automatic instruction entry point, following official OpenAI documentation. No global agent configuration changed.

## Verification

- npm run lint: passed, exit 0.
- TypeScript check with --noEmit --incremental false: passed, exit 0; disabled incremental writes for this documentation-only task.
- npm test: 2 test files, all 6 tests passed.
- File fingerprint comparison: of 81 pre-existing non-log files inventoried, only AGENTS.md changed; 80 were unchanged.
- Markdown local links checked after adding this handoff.
- Production build not run: documentation-only changes; avoided rebuilding the user's existing development output. Browser behavior and external integrations were not tested.

## Remaining action

Add/open the existing Cornerstone-Finance repository folder as a local project in the app, then start future website tasks there. The available app tools could inspect saved projects but could not register this folder. The current setup task itself started in an empty projectless folder.

Separately, review and intentionally save the pre-existing modernization plus context files to Git before expecting new clones or committed-main worktrees to contain them. This task did not authorize committing all existing user work.

No implementation follow-up is automatically approved. Use STATUS.md's open questions when selecting the next task.
