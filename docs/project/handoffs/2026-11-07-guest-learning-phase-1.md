# Task handoff — guest learning Phase 1

Date: 2026-11-07
Status: implemented; review pending
Area: learning/onboarding/building
Checkout: Cornerstone-Finance; uncommitted, no deployment or dependency changes.

## Objective and scope
Guest onboarding → what-you-own → three checked questions → saved completion → one derived building brick. Account integration and expanding quizzes to the other five lessons are deferred.

## Changes and decisions
Reused onboarding, ChoiceQuestion, MvpProvider, cornerstone-learning-v1, completion deduplication, BuildingDrawing, completion animation and existing styles. Added typed quiz data separately from protected lesson content. The existing schema gains defaulted version-1 quiz receipts with a bounded passed-question prefix. Checked answers survive refresh; wrong answers cannot advance. The first lesson completion guard requires all three checks for new learners, while legacy completion remains valid. Completion is saved before animation, reopens quietly after refresh, and offers explicit review, onward navigation and Recap. Weekly review still starts at the lesson and retains its matching receipt flow.

Onboarding shows the existing foundation without awarding a brick. Returning learners get Continue. First-lesson completion uses the default building immediately, with optional later appearance changes. Other lessons retain the existing picker. Recap has a compact authoritative learning count and continue link above its existing financial layout, with no financial setup required. Existing six-lesson content, Home and account features remain intact.

Files: components/onboarding-flow.tsx, lesson-reader.tsx, ownership-quiz.tsx, learning-building.tsx, learning-summary.tsx; lib/lesson-quiz.ts, learning-progress.ts; app/recap/page.tsx; new ownership-quiz and lesson-quiz tests.

## Verification
Lint and typecheck pass. Production build passes. Accessibility suite: 6/6 pass. New focused tests: 3/3 pass, covering wrong-answer gating, remount resume, serialized receipts, legacy completion and idempotent dated reward/brick counts. Full suite initially encountered Windows temporary-file EPERM; running with required filesystem access resolved it. Subsequent full suite: 226/227 passed with a Monday-reset failure; isolated weekly suite rerun passes 10/10. Final full rerun result recorded below.

Browser: existing development server reported localhost:3000, preserving the user's six completed lessons there. Isolated production preview localhost:3006 used fresh browser storage after development proxy previews failed to hydrate. Walked guest entry (zero bricks), matching activity, lesson refresh, three questions including wrong answer/retry, refresh after first checked question (resumed question 2), saved completion (one brick), immediate refresh (still one brick, no incoming reward), and Recap (1/6 lessons and one earned brick). Left production preview on Recap. Existing localhost:3000 progress untouched.

Limits: no account integration or cross-device claims. Browser restart, blocked/full/corrupt storage, simultaneous tabs, complete keyboard-only journey and all requested viewport widths were not manually exercised in this pass. Existing storage/accessibility coverage is retained, but does not replace these manual checks. Duplicate reward is unit-tested; full repeated-lesson browser run remains for review. /portfolio#recap placement and remaining lesson quizzes are deferred. No new migration, subscription, integration, dependency, commit or deployment.

## Coordination and next step
Review Phase 1 before expanding. Shared learning schema and building/reader components changed. next-env.d.ts was already modified at entry by the development environment; current status has no net diff there. Source and untracked user work preserved. Temporary validation logs are in work/phase1-validation.

Final full-suite rerun:
```text

> cornerstone-finance@2.0.0 test
> vitest run


 RUN  v4.1.11 C:/Users/abrah/Documents/Codex/2026-09-02/my-website-code-is-in-a/Cornerstone-Finance

Not implemented: navigation to another Document
Not implemented: navigation to another Document

 Test Files  43 passed (43)
      Tests  228 passed (228)
   Start at  11:07:18
   Duration  56.05s (transform 3.54s, setup 0ms, import 38.61s, tests 24.27s, environment 81.80s)


```
