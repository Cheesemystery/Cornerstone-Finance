# Home Weekly — Step C

Date: 2026-10-19
Status: complete for Step C
Area: Home learning progress and completion display
Checkout: existing Cornerstone-Finance tree; earlier tracked/untracked user work preserved. No commit/deployment.

## Files changed

- components/home-dashboard.tsx: one weekly action or quiet completion line, then LearningWall; removed Continue learning row. Done requires actual learning completion in addition to the weekly receipt. Wall waits until historical loading settles, then chart entrance finishes.
- components/home-dashboard.module.css: quiet completion line outside hero; removed superseded Home row/done styles.
- components/use-weekly-portfolio.ts: narrow completion read check now requires the saved receipt's lessonId to match the current recommendation. Existing write gate, arithmetic and identity remain unchanged.
- components/learning-wall.tsx (new): catalog-driven cumulative wall, dated focus/hover/tap details, sequential visible entrance and polite live announcement.
- components/learning-wall.module.css (new): rough SVG rectangles in staggered running-bond courses, seeded widths/tints, texture, outlines, 64px targets and motion overrides.
- lib/stone-wall.ts (new): pure seeded appearance, 1200ms sequence constant and browser animation receipt helpers. Key cornerstone-wall-seen-v1 contains IDs only.
- components/learning-wall.test.tsx (new): eight tests including StrictMode, first-visit migration, hydration, sequential once-only playback, interrupted queue, chart/loading order, saved/device reduced motion and dates/Monday persistence.
- components/weekly-loop.test.tsx and grant-cleanup.test.tsx: new action/completion wording and structure; regressions for wrong recommended-lesson receipt and receipt without actual lesson completion.
- PROJECT.md, docs/project/STATUS.md, AREAS.md and this handoff.

## Decisions and behavior

Learning completion IDs/events remain the sole source of progress and date laid. No XP/streak/day counts on Home. Catalog size determines slot count; three stones per course is a layout choice, not a fixed total. Lesson-ID seed controls width weight, outline shape and stone tint, without randomness or storage-based layout. Solid versus outlined geometry plus accessible labels communicates laid state without relying only on color. A historical completion without an event says Date not recorded.

First Home visit establishes a baseline from existing completions, without replaying old achievements. Subsequent unseen IDs animate one at a time only when the wall is visible, avoiding a below-the-fold animation being missed. Each receipt is persisted as its animation begins; navigation cannot replay that stone, while unplayed queued stones remain pending for the next visit. A partial sequence doesn't consume unplayed stones. Receipts do not reset weekly; progress also never resets for missed days/weeks. Browser storage failure uses an in-memory receipt fallback where reads fail; reload persistence depends on functioning storage, as existing global storage notices disclose.

Motion waits for loaded prices and the existing 400ms/60ms chart entrance. Stone drop is 24px, settle 1.02 to 1 over 550ms ease-out, lime outline fades over 1200ms; next stone starts afterward. Both the saved Reduce motion preference and device media query remove the animations and timer delays. No sound, confetti, loops or dependencies.

Weekly done still requires completing through the existing weekly lesson flow; old lifetime completions alone do not finish a new week. Corrected the read-side defect where any receipt for the same week/mode/holdings could hide a newly recommended different lesson. Home additionally requires that lesson in the learning store. Repeating a lesson already laid can finish this week but never adds a duplicate stone. Existing content/duration remains unchanged.

## Verification

- Final npm run check passes lint, TypeScript, 191 tests / 35 files, production build with 41 routes.
- Focused tests verify sequential single playback, StrictMode remounts, interrupted queues, hydration, loading/chart coordination, reduced motion, Monday persistence and current-lesson completion correctness.
- Actual full browser walkthrough on temporary production preview http://127.0.0.1:3100: empty wall, sample holdings, Start your 2-minute lesson, unchanged original exercise/quiz, Back to your week, one new stone with 0.55s drop/settle and correct live announcement. Reload retains the completed wall and weekly line with no active animation or announcement. This isolated origin keeps the main localhost:3000 saved progress untouched.
- Initial attempt to isolate using 127.0.0.1:3000 hit Next dev cross-origin resource protection; did not weaken configuration. Used the separate production preview instead. Temporary tab closed and preview server stopped afterward; original dev server remains at port 3000.
- Main Home inspected at 375x812 and 1280x900 with no horizontal overflow. Stone targets 64px high, minimum observed width ~85px. Visible forest focus ring; tooltip dates and Escape verified. Original main-browser learning remains unchanged by the isolated walkthrough.
- Contrast: caption 6.18:1, tooltip title 11.13:1, tooltip date 8.45:1; empty outline 3.59:1. Captured main and isolated production console errors empty. OS reduced-motion logic tested with mocked device preference; OS setting itself not changed.
- CRLF-aware git diff --check passes. No new packages, lesson content, weekly arithmetic, server/provider or other-page UI source changes.

## Run / force states

Run npm run dev and use its reported URL; currently http://localhost:3000/. Wall follows the chart and weekly action/quiet line; scroll to it or Tab to a stone. Hover, focus or tap shows title/date; Escape dismisses details.

For a clean walkthrough without altering main progress, build then start a local production preview on another port and use its reported origin. First open Home to establish the baseline, choose sample holdings, finish the recommended lesson and return Home. Scroll/Tab to the wall to watch it lay once. Reload or leave/return: no replay. A separate browser profile is another option.

Run npm test -- components/learning-wall.test.tsx components/weekly-loop.test.tsx to force multiple pending stones, interrupted sequence, flat/empty learning, missing historic dates, Monday, reduced motion, stale/wrong weekly receipts and receipt-only states. No developer URL overrides or reset controls were added. Existing Settings > Reduce motion affects Home; no preference was left changed.

## Remaining steps

Stopped after C. D story/share, E Pro view and F new empty/error/loading/stale-data polish remain unimplemented. Existing no-holdings input behavior is preserved; the wall is available there, while its first-lesson invitation is part of F. No AI narration begun.
