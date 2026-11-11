# Cornerstone — Phase 10 QA report

Date: November 9, 2026. Scope: the MVP visual/learning enhancement, retaining the existing application and data.

## Result

No unresolved blocking regression was found within the tested guest MVP flows. The full suite passed **317 tests in 60 files**. A presentation inconsistency found during browser QA was fixed; **30 focused tests in five files** passed afterward. Lint, type checking, the final production build (43 generated pages), and diff whitespace checks pass.

The suite was run with two workers and a 10-second per-test allowance to accommodate the full six-lesson journey. Normal local temporary-file access was used because the restricted runner previously could not rename its temporary files. Test configuration and dependencies were not changed.

## Functional and progress checks

| Requirement | Evidence and result |
|---|---|
| All six lessons and activities | Automated full six-lesson journey and individual activity tests pass. Browser completed Why did the price move? out of catalog order. |
| Quiz validation and repeated attempts | Browser tried incorrect activity and quiz answers: explanations appeared, focus moved to feedback, and progress stayed gated. Corrected answers unlocked Continue. All three answers were required before Finish lesson. Automated coverage spans all quizzes. |
| Correct XP, no duplicates | Browser completion showed +20 XP, 1/6 lessons and one stone. Refresh showed 20 XP and the same one stone, with replay wording. Automated full journey/replay checks prevent a seventh stone. |
| Real foundation progress | Zero, partial and six-completion fixtures pass. Browser observed 0/6, then 1/6 after an out-of-order lesson; original user's 6/6 and 125 XP remain intact. Prior stones retain completion order. |
| Saved ideas | Browser saved a takeaway, refreshed, found its card/review link, removed it, and refreshed again: zero saved. Removal restored focus. Automated duplicate-ID, idempotence, owner/reset and legacy-key tests pass. |
| Review and next lesson | Browser reopened a completed lesson. After completing the second catalog lesson first, What do you actually own? was correctly recommended. Automated resume, completed-path and replay cases pass. |
| Achievements | Browser first completion earned First small step; Making connections stayed unearned. Existing fully completed profile retains earned milestones. Formula regressions pass. |
| Navigation | Desktop links and active sections inspected. Mobile drawer focused Close navigation; Escape closed it and restored Open navigation focus. Existing accessibility checks pass. |
| Portfolio arithmetic | Core math source has no redesign diff. Browser sample remains $6,866.77 with −$11.23 dated closing-price change. Selecting VTI synchronized chart, legend, contribution and table states. Unit tests pass. |
| Returning/existing users | Browser refresh preserved completion, saved data and Reduce motion setting. Original user's six completions/125 XP were only inspected, not reset. Legacy bookmark fallback and explicit-empty/reset/account isolation pass automated tests. |
| Reduced motion | Saved preference toggled on in isolated QA origin and survived refresh. Device/saved motion, immediate settlement, skip and focus behavior covered by automated reward tests. |

## Visual checks

Inspected desktop and 390px mobile presentations across the main experience, including the new-learner dashboard, existing fully completed dashboard, partial foundation, lesson introduction/activity/quiz, pending-to-settled reward, saved ideas, weekly sample recap, Portfolio, Recap and Ask. Checked desktop weekly composition and mobile signed contribution labels. Portfolio's wide native table retains horizontal scrolling and a visible mobile hint.

Ask's mobile diversification response correctly identified VTI's sample 42.1% allocation, retained risk caveats and linked to the diversification lesson. No live AI was introduced. Sample/fictional/source-date labels remain visible; price changes are not labeled as total investment returns.

This was screenshot/accessibility-tree review, not a pixel-diff audit of every route at every breakpoint. Token contrast calculations and structural axe coverage are recorded in the earlier design-system/accessibility handoffs. No screen-reader certification is implied.

## Regression fixed during this QA phase

Recap's main foundation still showed the older 24-position architectural drawing while Learn/rewards used the actual six-lesson foundation. Recap now uses the shared six-stone foundation. The working building-style picker remains under **Explore building styles**, explicitly labeled as an optional 24-position style sketch rather than curriculum progress. No progress records or appearance preferences were deleted.

## Environments and data preservation

The existing development server remains at localhost:3000. Fresh guest/browser tests used an isolated production origin at localhost:3004, whose port was confirmed by the server. Only that isolated origin received test completion, sample holdings and preference changes. The original profile remains six lessons/125 XP. No production deployment, dependency addition or account migration was performed.

The localhost:3004 production process was started before the final Recap presentation fix; that fix was visually verified on localhost:3000 and compiled in the final successful production build. The final source and build contain the fix.

## Outstanding limits

- Learning accounts and financial providers remain gated; real email/auth, RLS, two-account cross-device behavior and live provider credentials were not integration-tested.
- Bookmarks are intentionally device-local. Blocked/full/corrupt storage and backward compatibility were tested with automated fixtures; browser process shutdown/relaunch was not performed.
- No formal usability study, native screen-reader evaluation, all-route hydration audit or performance benchmark was conducted.
- The optional legacy building-style sketch remains available; the main curriculum foundation is consistently six stones.
- Existing broader release/security/dependency gates from project documentation still apply. Passing this QA does not establish external launch readiness.

## Files changed in Phase 10

app/recap/page.tsx, components/learning-recap.tsx and app/page-polish.css align the main Recap foundation while preserving optional styles. PROJECT/STATUS updated. User work retained, changes uncommitted.
