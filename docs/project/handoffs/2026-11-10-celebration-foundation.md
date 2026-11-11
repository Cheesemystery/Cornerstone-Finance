# Task handoff — celebration to foundation

Date: 2026-11-10
Status: complete
Area: Lesson completion / Learn
Checkout: Cornerstone-Finance; uncommitted, existing work retained.

## Objective and scope
Create the conference completion transition and refine Learn's CTA, eight-stone architecture, field notes and milestones.

## Changes
- First-time completion opens an accessible Radix dialog after the authoritative save. Two-second decorative stone settle/glow, numbered topic heading, original takeaway, and a primary Lay Stone on Your Foundation link to /learn?justCompleted=N. Dismissal stays with the saved lesson. Existing completion receipt, bookmarks and onward actions remain accessible after dismissal; replay does not show a new-award modal.
- Learn arrival checks the query against saved valid completions. It never awards progress. Scrolls to the foundation, selects the new stone, plays a two-second drop/pulse/check, updates displayed progress, then removes the query to prevent replay on refresh. Saved/device reduced motion suppresses movement.
- CTA now reflects zero/partial/full completion. Default inspector chooses the next unfinished lesson or most recent completed lesson. Tiles have accurate topic subtitles matching the actual curriculum. The top two positions span half-width above two three-stone rows; completion order remains authoritative.
- Field-note initial migration supplies Ownership and Research notes only in original guest generation zero when neither scoped nor prototype records exist. Explicit empty records, resets, accounts and existing notes retain their previous precedence. Starter notes can be read before completing the associated lesson and award no progress. Existing explicitly empty collections remain empty.
- Milestones open by default. Existing routing, financial math, quizzes and keys retained.
- Files: lesson-celebration, use-foundation-arrival, learning-foundation, learning-library, lesson-reader, saved-ideas and shared note logic; lib/lesson-topics; app/learn-studio.css; related regression tests.

## Verification
Typecheck, lint and production build pass (45 generated pages). Browser completed the actual Lesson 8 activity and three quiz checks, verified the earned dialog and Lay Stone destination, selected Stone 08, balanced capstones and 8-of-8 complete state. Used the authorized replay control afterward and left Home at seven of eight for the pitch. Modal focus/dismissal and arrival query/forged-completion guard tests pass. Full suite result recorded below.

## Remaining work / next step
No required implementation outstanding. Existing explicitly empty saved notes are preserved rather than silently repopulated. No native screen-reader/device certification. No deployment or dependency changes.

Final full regression: 329 tests / 63 files passed. Additional modal-focus and arrival-focused run: 3 tests / 2 files passed, including the subsequently added modal test. No runtime edits after final lint/typecheck and build beyond primary focus/aria-live refinements already typechecked/linted.
