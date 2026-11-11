# Phase 8 — beginner task flows

Evaluated entry → lesson → activity → quiz/feedback → optional saved idea → XP/cornerstone → next lesson using existing real journeys and previous isolated completion checks. Fixed concrete friction:

- Zero-completion Home introduces purpose, no-account/no-portfolio requirement, simple route and one highlighted 3-minute first-lesson action before financial inputs. Existing weekly/sample actions become secondary for beginners. No signup/name step required.
- Learn zero state explains activity/three checks, optional save, 20 XP and one stone without inventing progress.
- Quiz final action renamed Finish lesson (formerly Keep this idea) to distinguish actual completion from optional bookmarking. Required correct answers remain enforced.
- Returning Home with no financial history resumes unfinished learning or offers review when complete, rather than labeling everything a first lesson.
- Skip animation leaves a focusable Animation skipped confirmation; no disappearing focused control. Existing saved/device reduced motion and immediate next navigation preserved.

Files: home-dashboard.tsx, learning-library.tsx, cornerstone-reward.tsx, ownership-quiz.tsx, page-polish.css, home/reward tests and existing journey tests updated for intentional button label change. No backend, dependency, XP or arithmetic changes.

Browser: isolated production localhost:3003 fresh Home purpose/first action verified desktop and 390px. Enter key opens first lesson without holdings/account. Original localhost:3000 data untouched. End-to-end first lesson completion/save/refresh previously exercised in Phases 5–6; this phase's final sequence covered by real six-lesson automated journey. Did not claim human usability-study or screen-reader certification. Restored viewport, kept fresh-entry preview. Preview build preceded final Finish lesson label/secondary-input polish; final build validates latest source.

Validation: initial focused Home/animation checks 12/12 pass; initial concurrent full run transformed Home before returning-user fix and failed that newly added assertion. Final full run/check results below. No commit/deployment.

Final: 312 tests / 59 files pass; lint, typecheck, production build (43 generated pages) and diff check pass. Separate localhost:3003 preview restarted on final build. Original user learning/holdings preserved.
