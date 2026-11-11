# Task handoff — continuous learning and stone progress

Date: 2026-11-10
Status: complete
Area: Home / learning progression
Checkout: Cornerstone-Finance; changes uncommitted, existing tracked/untracked work preserved.

## Objective and scope
Make Home learning the primary action, continue beyond the weekly lesson, add lessons, and align earned stones across views.

## Changes
- Home promotes the learning card before the financial chart. Weekly completion now offers the next unfinished lesson, then review after the catalog is complete. Weekly completion receipts remain separate from lifetime rewards.
- Added time-horizon and inflation lessons with three original explanatory sections, interactive fictional examples, three checked questions, and Investor.gov source links. Original six lessons and completion IDs preserved.
- Foundation and reward row counts scale with eight catalog lessons. Home wall and share snapshots now use foundationLessons completion order and bottom-up rows. Home stones show lesson numbers and earned checks.
- Learn includes the new chapter after the original lessons. Updated catalog-size expectations and the full journey regression to cover all eight activities/24 questions and replay without duplicate completion. Added out-of-order/duplicate/unknown completion wall regression.
- Files: home-dashboard, learning-wall and module CSS, learning-foundation, cornerstone-reward, learning-library, lesson-visual; app/learn-studio.css; lib/lessons, lesson-activities, lesson-quiz, weekly-share; related tests and project context.

## Verification
- Full suite: 323 tests in 60 files passed.
- Typecheck, lint, production build passed; build generated 45 pages. Final copy-only card refinement passed typecheck and focused weekly-loop tests (10/10), plus lint. One focused Monday receipt check failed once and passed on rerun; full suite had passed that case. No claim of eliminating this intermittent test behavior.
- Full eight-lesson automated journey verifies activities, 24 checks, exactly one reward per lesson, next links, replay prevention and final learning summary.
- Browser verified desktop/mobile Home next-lesson link and new time-horizon page opening at 390px; existing six completions remain six of eight, with two unearned slots. Restored default viewport and left Home open. Browser did not complete new lessons in the user's record.
- git diff --check passed (existing next-env line-ending warning only).
- Source references: https://www.investor.gov/introduction-investing/getting-started/asset-allocation and https://www.investor.gov/introduction-investing/investing-basics/what-risk .

## Remaining work / next step
No required implementation remains for this bounded loop update. Full native screen-reader and device coverage were not performed. No new dependency, account activation, commit or deployment.

## Coordination
An encoding error temporarily emptied home-dashboard.tsx; restored its captured content after verifying the file was empty, then applied targeted changes. Automatic review initially rejected a broader replacement; narrowed restoration was approved. Final checks above passed.
