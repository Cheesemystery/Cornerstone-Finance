# Task handoff — Phase 9 acceptance verification

Date: 2026-11-09
Status: verification delivered with explicit integration/restart limits; stopped for review
Area: guest learning, persistence, weekly and Recap regression
Checkout: Cornerstone-Finance; earlier tracked/untracked work preserved, no commit.

## Scope and changes

Ran the requested A–G acceptance flow. Added components/guest-acceptance.test.tsx: two real-provider/reader/summary integration tests finish a previously resumed quiz after learning storage becomes blocked or full. They assert the session-only warning, usable next link, one brick and matching Recap, then restore storage and trigger a subsequent save through a test-only fixture. The persisted completion/date/quiz receipt survives remount without another event. This fixture is not a new public retry control.

No runtime fix was necessary. Design, protected lessons/activities, calculator, account gates, reward rules, legacy files and dependencies are unchanged. No migration, account activation, deployment, external email or participant contact occurred. Package and lock hashes remain 9e8d7e2d723921add96f4aaa8ed07e631b355b441a2e0355d3aca19fa3eff649 and 3eb928ad0544a90e555c81165567cec8649f7c51c68660ced20b15f6b08d2f43.

## Acceptance results

| Area | Result and method |
|---|---|
| A — Fresh guest | Browser: empty foundation, optional synthetic nickname, guest onboarding, real first activity, three-question quiz. Wrong answer produced textual feedback with neither Continue nor completion available. Correct completion gave one brick and one dated Recap entry. |
| B — Resume | Browser: refreshed the explanation step, after the first checked answer, and immediately after completion. Restored the explanation, question two and one-brick completed state respectively. No skipped unanswered question or repeated reward observed. Existing tests cover all six lesson receipts and completion recovery. |
| C — Return/repeat | Browser: closed/reopened the test tab, retained completion and next-lesson path, repeated the completed first activity without another brick, then finished all six real activities and eighteen questions. Learn offered review, with six completed lessons and six bricks. Full browser-process termination/restart was not performed. Fresh-store restart tests also pass. |
| D — Storage | Automated: new real-UI blocked/full-storage tests, existing partial-corruption and invalid-JSON recovery, undated legacy migration, concurrent receipts/reset-generation and quota tests all pass. Browser: an independent Recap tab updated from zero to one and then six completions without reload. Fault injection was confined to test fixtures; no existing browser record was corrupted or cleared. This does not prove atomic recovery from simultaneous tab/process shutdown. |
| E — Authentication | Preview explicitly showed account sign-in/cross-device learning unavailable. Mocked callback failures/safe returns, account-owner isolation, explicit import/deduplication, offline queues, expiry/lock and logout safeguards pass. No real new/returning email links, expired/reused live links, session renewal, live logout, database/RLS, two real accounts or cross-device persistence was tested. Prepared migration remains unapplied. |
| F — Recap/weekly | Browser: /recap and /portfolio#recap were available with no holdings/history, then all six counts matched Learn/building/Home wall. Recap history contained each lesson once with Nov 9, 2026 dates. After explicitly selecting the dated sample portfolio, prior lifetime completion did not finish the week. Completing the linked why-prices-move?weekly=1 review marked Home done, survived refresh, and left six lifetime bricks. Existing tests reject wrong/missing lesson receipts, stale holdings and missing genuine completion; Monday reopening passes. |
| G — Accessibility/layout | Browser: Enter/Space/native select keys/range arrows used through the activities and quizzes, desktop first lesson and 390/320px later lessons, saved Reduce motion retained with html scrolling auto, focus moving to feedback/question/next action. Completed Learn and final Recap measured at 320, 390, 768 and 1280px without page-wide overflow. Empty-history Portfolio Recap also checked at 390px; checklist at 320px. Device motion is simulated in existing tests; no OS setting or native screen reader was exercised. |

## Checks and failures

- npm run lint: PASS; npm run typecheck: PASS; npm test: 296/296 in 56 files PASS; npm run build: PASS. These ran freshly through npm run check, exit 0.
- Explicit npm run test:a11y: 8/8 PASS. git diff --check: PASS.
- No application assertion, lint, type or build failures. JSDOM emitted its known unsupported document-navigation warnings without failing tests.
- npm run dev detected this checkout's existing localhost:3000 server and refused a duplicate instance after briefly suggesting 3001. Used the actual existing-server report; did not replace it. Acceptance used the fresh production server's reported http://127.0.0.1:3013, loopback only, to isolate all synthetic learning/sample data from existing origins.
- Two browser-control attempts needed correction (native summary lookup and a helper retaining the closed tab). Rebound/retargeted the controls and verified the outcomes; these were not app defects. One rapid viewport resize was read before it settled, so the missing 390px Learn measurement was repeated in a separate call. Evidence preserves the raw measurements; final Recap target/actual widths all match.

## Evidence and limits

Raw logs: work/phase9-check.log and work/phase9-a11y.log. Current-chat outputs: phase-9-handoff.md, phase-9-browser-evidence.json and phase-9-recap.png. The final side-browser tab is on Recap with six synthetic completions and six bricks. Existing six-lesson user records and other origins were not reset or edited.

This verifies the guest candidate with the methods above, not live auth readiness or full accessibility certification. Full browser-process restart, live services/RLS, native screen-reader speech, real-device motion toggles, Lighthouse and real-student study remain unperformed. Earlier moderate dependency triage is not resolved by this task. No public-release or security clearance is implied.

## Coordination

Only the new acceptance test and dated context/handoff documents were added/edited in Phase 9. All prior source/generated changes remain present. Stop for review; do not infer authorization to enable accounts, deploy or expand scope.
