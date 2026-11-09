# Task handoff — Phase 5 guest-MVP validation

Date: 2026-11-07
Status: complete for selected guest-validation scope; ready for review
Area: lesson sessions, reset recovery, focus and full guest journey
Checkout: Cornerstone-Finance; Phases 1–5 remain uncommitted.

## Scope
User selected final guest-MVP validation and fixes. Reused the existing six lessons, all activities, three-question quizzes, authoritative learning store, building, Recap and styles. Accounts remain disabled and unverified. No live integration, deployment, commit, dependency change or lesson-content change.

## Findings and fixes
Three regression tests were written first and all failed against the Phase 4 code:
1. An open quiz retained its third-question position after progress was reset from another surface.
2. The reusable reader retained local session state across reset or a changed lesson prop.
3. On first entering a quiz, the parent reader moved focus away from the question heading to the lesson heading.

The reader and quiz now scope their session state to lesson, account identity and reset generation; the reader also distinguishes weekly entry. Quiz display cannot advance beyond the authoritative checked prefix. Answer receipts require the same reset generation and expected question position, so stale callbacks cannot skip unchecked questions after a reset. The reader leaves quiz-heading focus to the quiz component.

Runtime files: components/lesson-reader.tsx and components/ownership-quiz.tsx. New tests: components/lesson-session.test.tsx and components/guest-full-journey.test.tsx. The latter walks all real activities and all eighteen checks in a continuous flow, verifies next-lesson actions and six unique completions/bricks, repeats the last lesson and restores the final review state.

## Automated verification
- Before fixes: new lesson-session suite 3/3 failed, reproducing the issues.
- After fixes: 25 focused tests passed, including weekly completion and the existing six-lesson quiz/completion suites.
- npm run check passed lint, typecheck, 290 tests / 54 files and production build before the extra continuous-journey test was added.
- Final full npm test: 291/291 tests, 55 files pass.
- Final lint passes. Final typecheck passes after removing an unsupported test-only selector option. Continuous-journey test initially used the wrong checklist button label; it was corrected to the existing 'Check this order' label without changing the product. Final focused journey/session rerun: 4/4 pass.
- Explicit npm run test:a11y: 7/7 pass.
- Whitespace and protected lesson/activity/calculator/package preservation checks pass. Logs: work/phase5-*.log.

## Browser walkthrough
Development startup reported localhost:3000. Isolated production preview started on its reported localhost:3009, preserving the user's existing origins and saved work.

Fresh guest onboarding: zero earned bricks; optional nickname left blank; Continue as guest enters the first lesson.

Reset test: answered two questions in the first lesson, leaving question three open. In a second tab, used the actual Settings reset dialog on this disposable preview only. The open lesson returned to its starting story, its saved checks cleared, and the other tab's Recap showed zero lessons/bricks. No stale third-question completion was possible. This is now real-browser verified, not only a synthetic storage-event test.

Fresh full path after reset: completed all six lessons via their next-lesson links, with keyboard activation and the real matching, price-choice, basket-allocation, earnings, fees-slider and research-order activities. All eighteen quiz checks completed. The displayed building increased exactly 1→2→3→4→5→6, and the final action was Review lessons. Repeated the last lesson and refreshed: count stayed six, completion restored quietly and no seventh brick appeared. The second tab's Recap updated to six through native cross-tab events.

Closed the preview lesson tab and reopened /recap: all six lessons and six bricks remained. The history disclosure showed exactly six actual dated entries and the foundation milestone. This verifies cold tab reopen, not a full browser-process restart.

Accessibility supplement: initial quiz focus lands on Question 1; subsequent question headings focus correctly. At 320px the mobile menu opened with keyboard activation, focus wrapped from its last link to the first, and Escape returned focus to Open navigation. Completed Learn had no document overflow at 320, 390, 768 and 1280 widths. Restored the viewport afterward. Device/saved reduced-motion coverage from earlier phases and existing tests is retained; not re-claimed as a fresh full motion audit here.

Sharing: opened the real learning-share preview, verified its image and download href contain exactly the same data URL, with no dollar amounts or holding tickers in the SVG. Closed/reopened after changing a choice: fresh preview restored its default learning selection and excluded practice count. No file was uploaded or shared externally, and no native system share was invoked.

Left localhost:3009/recap#main-content open with six lessons/six bricks. Screenshot: phase-5-recap.png in the current chat outputs.

## Remaining limits
No public-release claim. No live account, email, Supabase migration, RLS, session renewal or cross-device verification occurred; Phase 3's blockers remain. No five-student usability study or three cold mobile Lighthouse audits were performed. Full browser-process restart, abrupt shutdown during cross-tab reconciliation and manually injected corrupt/full storage are not newly browser-verified; their earlier automated coverage and documented localStorage limitations remain. The browser menu/focus and reflow checks supplement the structural axe gate; they are not a full screen-reader/contrast/WCAG audit.

## Coordination and next step
Protected lesson definitions, activities, calculator implementation, packages, Home, financial arithmetic, legacy site, account gates and migrations were unchanged in Phase 5. Preserve all earlier uncommitted work. Review the completed guest MVP before any further expansion or separately authorized account integration.
