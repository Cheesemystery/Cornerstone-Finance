# Task handoff — React Doctor provider and Recap simplification

Date: 2026-10-16
Status: complete
Area: Shared providers/local state; Cornerstone Recap
Checkout / branch / commit: `C:\Users\abrah\Documents\Codex\2026-09-02\my-website-code-is-in-a\Cornerstone-Finance`, `main`, `9f2b0e3`; all changes remain uncommitted.

## Objective and scope

Use current official React Doctor guidance with telemetry disabled, fix verified maintainability/lifecycle problems in a bounded pass, preserve behavior, calculations, progress and design, and record remaining findings. Read AGENTS, PROJECT, STATUS, WORKFLOW, area notes and the preceding Knip handoff before implementation.

## Changes

- `components/demo-provider.tsx`: stable parsed preferences/actions/context; private contribution hook with combined state and row conversion; abort/late-response guards; same offline, sample/server reset, CSV-memory and notification behavior.
- `components/portfolio-recap.tsx`: private graphic and movers components preserve exact markup/styles and keep financial selection/calculation code in place.
- Added `components/demo-provider.test.tsx` (8 regressions) and `components/portfolio-recap.test.tsx` (3 regressions).
- Added [review report and complete remaining findings](../reports/2026-10-16-react-doctor.md), before/after JSON evidence; updated STATUS and AREAS.

## Decisions

No new UI design, query dependency, context split, storage migration, arithmetic change or automatic tool fix. No score requested or computed. Historical/deferred features remain intact. Avoided a generic cross-page chart abstraction because current charts have different semantics and geometry.

The extracted contribution hook still fetches within an effect; the disappearance of that heuristic warning is not a new fetching architecture. Actual improvement is cancellation and no stale preference writes, covered by regression tests.

## Verification

Initial full React Doctor 0.9.18 scan: 76 findings (2 errors, 74 warnings), 34 affected files, `ok: true`. Same-version final full scan: 73 findings (2 errors, 71 warnings), 33 files, `ok: true`. Both exit 1 due to retained errors. Both use `REACT_DOCTOR_NO_TELEMETRY=1`, `--no-telemetry --no-score --no-supply-chain`; no upload/score/service installation.

Final `npm run check` passes lint, TypeScript, all 108 tests in 23 files and production build (40 generated pages). Starting baseline from the previous cleanup was 97 tests / 21 files, passing all checks. Focused initial Recap failures were test-name whitespace assumptions, fixed without changing UI output.

Side browser verified sample, authored example and existing practice recap source modes; restored sample view. Existing saved progress/preferences remained visible. Desktop visual inspection passed. No new mobile/full screen-reader certification or live integration checks.

Existing-file hash check preserves all other work, package files, financial/progress helpers, legacy assets and migration history. Restored generated `next-env.d.ts` after build. Whitespace check passes; Knip retains its previously documented findings.

## Remaining work / next step

None required for the bounded refactor. Remaining tool findings are recorded, not silently treated as fixed. Separate priorities are the historical anonymous waitlist RLS policy and state-changing unsubscribe GET, then deferred reentry/error handling and focused component simplification. Database deployment state remains unverified; do not rewrite applied migrations or activate deferred features based on this handoff.

## Coordination

Shared DemoProvider, STATUS and AREAS already contained user work. Changes preserved that work and the prior six-export cleanup. No package/lockfile change, commit, push, deployment, email or real account operation. React Doctor was executed from npm's external cache rather than added to the project. Raw scan logs and original snapshots are in this chat's work directory; durable evidence is in docs/project/reports.
