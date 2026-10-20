# Task handoff — Portfolio, monthly Recap and Cornerstone+

Date: 2026-10-12
Status: complete
Area: Portfolio / Recap / Assistant
Checkout / branch / commit: Cornerstone-Finance, main at 9f2b0e3; changes remain uncommitted alongside prior user work.

## Objective and scope

Implement nine browser comments: smoother pie numbers and cost growth, darker portfolio totals/details, rotating question headings, prominent personalized Cornerstone narrative, stronger change metric, clickable holdings, dark monthly portfolio Recap and subtle Cornerstone+ concept. Preserve other pages and existing learning/practice data.

## Changes

- portfolio-insights.ts adds recorded-cost growth, snapshot-aware heading selection, strict month-boundary comparison and an authored example month. Tests cover missing cost, losses, empty holdings, zero basis, invalid months and rare heading thresholds.
- portfolio-movement.tsx separates the prominent PortfolioStory from the secondary arithmetic breakdown. A shared CornerstoneMark SVG identifies tailored context. Rotation runs every 12 seconds, skips hidden documents and supports pause and reduced motion. Special positive headings require a supplied move above 10% and an occasional rotation slot.
- portfolio-holdings.tsx shows green/red growth versus recorded cost, calmer numeric typography, dark totals, selected detail styling and keyboard-selectable rows. Focus moves to the relevant detail panel; table overflow stays contained at tablet/mobile widths.
- portfolio-recap.tsx supplies the large dark card with current source/date, allocation, unavailable-month explanation, fictional month preview and saved simulated checkpoints. Existing learning history/milestones/nonfinancial sharing are embedded below without a duplicate page heading.
- cornerstone-plus-preview.tsx adds the quiet sidebar card and native concept dialog. Escape restores focus. No price, checkout, account creation or requests.
- Scoped CSS modules and portfolio-polish.css preserve the existing palette. app/layout.tsx imports the scoped stylesheet. app/recap/page.tsx retains the deferred connected branch.

## Decisions

Growth uses total recorded holding cost, not cost per share. If any held position lacks valid cost, aggregate growth is unavailable. Price growth excludes dividends/fees/taxes and is distinct from total investment return. Snapshot dates are never relabeled today. Monthly comparison requires prior month-end and current month-end values; one snapshot cannot establish monthly performance. The fictional month is visibly labeled not the user's account. Practice checkpoints are simulated weeks, never calendar-month returns.

The user requested a future premium nudge, superseding the previous no-upsell presentation for this small concept only. Investor-type backgrounds are deferred as requested; original code-native Cornerstone geometry supplies artwork now. No external code/assets, dependencies, copied templates or live services were added.

## Verification

- Full check: lint, TypeScript, 94 tests across 20 files and production build passed (40 generated pages). Removed one unused type import; reran clean lint and typecheck.
- Browser: Portfolio/Recap/Assistant at 320, 390, 768 and 1543 widths. Fixed table overflow discovered at 768; table now scrolls inside its container. No page-wide overflow remains in the checked layouts.
- Keyboard Enter selects a holding and focuses its corresponding detail; source/cost numbers match the sample. Rotation pause is present; unit tests verify timers and reduced motion.
- Recap snapshot/example/practice modes display appropriate period/source, including a negative saved practice result. Learning history and milestones remain accessible in the disclosure.
- Cornerstone+ dialog isolates background, Escape closes it and restores focus; Assistant's existing ETF answer still works. Mobile dialog remains readable.
- After the final CSS container adjustment, the complete check passed again: clean lint, TypeScript, all 94 tests and production build. No live provider/account/billing or full screen-reader study was performed.

## Remaining work / next step

None required for these comments. Future work: actual month-end history, investor-type theme specification and paid-plan/product/service decisions. Those are not active or represented as launched.

## Coordination

No subagents, deployments, commits, package changes or data migrations. Shared layout/context files touched narrowly. Prior uncommitted changes and legacy site preserved. Earlier MVP and research/home handoffs remain applicable outside this scope.
