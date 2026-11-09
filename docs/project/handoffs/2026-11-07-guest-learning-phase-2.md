# Task handoff — guest learning Phase 2

Date: 2026-11-07
Status: implemented; awaiting review
Area: lessons, quizzes, completion recovery
Checkout: Cornerstone-Finance, uncommitted. Phase 1 changes were already present and are preserved.

## Objective and scope
Extend the Phase 1 three-question, saved-resume and one-brick completion flow to the remaining five existing lessons. Account integration, financial features, new lessons and Home redesign remain deferred.

## Changes
- lib/lesson-quiz.ts: two concise new typed questions per remaining lesson, retaining each original question. Stable per-lesson version-1 receipts reuse cornerstone-learning-v1; no new progress total or store.
- components/ownership-quiz.tsx: reused the Phase 1 quiz with a lesson ID so saved answers and resume are independent for all six lessons. Existing supportive feedback, retries, keyboard choices and explicit checking remain.
- components/lesson-reader.tsx: all lessons use the same quiz and completion gate. Existing explanatory paragraphs for the five expanded lessons appear before their quiz, ensuring tested concepts are presented without editing protected content definitions. Completed lessons reopen quietly; review is explicit, weekly entries still reopen at the start. Saved checked questions remain valid during review. Completion links to the next unfinished lesson or Review lessons when finished, plus Recap and return-later actions. Uses the existing default building with optional appearance changes.
- Tests: parameterized gating/resume checks across all six quizzes; new six-lesson integration coverage for saved completion, one derived brick and quiet remount; domain coverage for all 18 question models and six unique lifetime bricks on repeat. Updated weekly integration to finish all three checks. Fixed an observed async test race by awaiting insufficient-history state instead of assuming the input button means loading has ended.

No edits to lib/lessons.ts, lib/lesson-activities.ts, calculator implementation, package files, account code or legacy static site. No dependencies, migrations, commits, pushes or deployments.

## Verification
Lint and typecheck pass. Production build passes. Explicit accessibility suite: 6/6 pass. First parallel test run: 233 pass, one insufficient-history timing failure. After correcting the wait, single-worker full suite: 234/234 pass. New completion integration plus weekly suite: 16/16 pass. Final full-suite result below includes the new completion test file.

Development startup reported existing project server at localhost:3000 (PID 16128); used that port, preserving the user's six lessons. Isolated production preview started on its reported localhost:3007 for destructive guest walkthrough; original localhost:3000 state remains unchanged.

Browser walkthrough: Why prices move story/activity and explanation using keyboard activation; three-question quiz with wrong-answer feedback and no progression; correct first answer then refresh restores question 2; remaining checks, completion and immediate refresh show exactly one saved brick. Explicit review/repeat still leaves one brick. Fees calculator deep-link, prediction and slider interaction still gate progress; its new quiz opens correctly. Fees quiz fits 320, 390, 768 and 1280 widths without document overflow; viewport reset. Recap shows one of six lessons and one brick, with Continue correctly preferring the in-progress fees lesson. Left localhost:3007/recap visible. Screenshot delivered separately.

Remaining manual limits: did not complete all six end-to-end in the browser, restart the browser, or repeat the storage-corruption/full-storage/cross-tab matrix. These are not claimed as browser verified. All six quiz and completion paths are covered in automated tests. No account readiness or cross-device saving claim.

## Coordination and next step
Review this phase before account work. Shared reader changes include rendering existing sections, completion recovery and next-lesson links; no global style changes. Phase 1 uncommitted files remain present. Validation logs: work/phase2-*.log. Original content and dependency preservation and whitespace checks pass. User-facing copy of this handoff is in the current chat's outputs folder.

Final full suite: 44 files, 240 tests passed (49.48 seconds). Final typecheck passes.
