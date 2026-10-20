# Task handoff — About and lesson building

Date: 2026-10-20
Status: complete
Area: Learn / shared shell / Settings
Checkout / branch / commit: Cornerstone-Finance, main, uncommitted alongside preserved earlier Home/Portfolio cleanup.

## Objective and scope

Add the requested About page and post-lesson brick moment using existing components, tokens and browser persistence. No dependencies, Home wall changes, Portfolio/Ask edits, lesson-content edits, API changes or existing storage-key changes in this task.

## Changes

- content/about.ts: all typed About copy, CONTACT_EMAIL placeholder and shared Settings privacy wording.
- app/about/page.tsx: existing PageHeader/cards, conditional supporters, mailto and disabled waitlist.
- components/app-shell.tsx; app/settings/page.tsx; components/mvp-settings.tsx: footer/Settings links and shared privacy constant.
- lib/building.ts: three skins, capped unique completion count and one guarded skin preference key.
- components/learning-building.tsx and learning-building.module.css: shared SVG grid, picker, compact Learn card and 1.3s drop/200ms reduced fade, live announcement and focus transfer.
- components/learning-library.tsx; components/lesson-reader.tsx: compact card and existing completion save followed by building screen; reviews remain idempotent.
- components/about.test.tsx; learning-building.test.tsx; app-shell.test.tsx; weekly-loop.test.tsx: regression checks for copy, navigation, preferences, grid order/cap, motion/focus and weekly completion.
- docs/project/STATUS.md and AREAS.md: current ownership/results.

## Decisions

Completed lesson IDs remain the sole progress source; cornerstone.building.v1 stores version, skin and whether the user chose it. No separate brick count or animation receipt. Existing createBrowserStore wraps reads/writes in try/catch; corrupted preferences fall back to Campus hall/picker. Animation state is ephemeral. Home stone paths/tints are reused without editing its wall. Contact stays hello@example.com pending replacement; Supporters stays hidden until text is supplied.

## Verification

- npm test: 225 passing tests / 41 files. TEMP/TMP pointed to the chat work directory to avoid sandbox temp-file permissions.
- npm run lint and npm run typecheck: pass.
- npm run build: pass, 42 routes including /about; run outside the Windows sandbox because the sandboxed build previously stalled.
- localhost:3000 browser: About route/footer/Settings links, four main nav items, no supporters/form, disabled waitlist; five original bricks, first-time skin picker showing five, sixth lesson completion, computed 1.3s drop, six-brick live announcement and Continue focus, Continue to Learn, persisted Library after reload, completed-lesson review stays six with no incoming brick.
- Browser overflow checks at 1280/390: About, Learn and completion fit; no captured console errors. Original Reduce motion setting restored.
- Automated checks: both saved/device reduced motion focus immediately; 200ms fade cleanup; corrupted preference recovery; cap above 24; skin switching preserves learning; supporter gating and centralized privacy identity. Corrupt storage and device motion were not forced in the user's browser.
- One initial focused run exposed a pre-existing asynchronous history assertion race; the unchanged full suite subsequently passed all 225 tests. No application change was made for that unrelated test.

## Remaining work / next step

None for this task. Founder story, public contact address and approved supporter wording intentionally remain placeholders. No commit, push or deployment requested.

## Coordination

Earlier uncommitted Home/Portfolio cleanup remains intact. Browser acceptance completed the remaining sample lesson (five to six) and selected Library. Only the saved motion preference was restored; progress was not deleted or rewritten. Shared files touched are shell, Settings, Learn library/player and project notes. No secrets or real financial data recorded.
