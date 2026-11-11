# Task handoff — Home foundation progress and chart labels

Date: 2026-11-10
Status: complete
Area: Home
Checkout: Cornerstone-Finance; uncommitted, existing work preserved.

## Objective and scope
Remove conflicting weekly-completion copy above the next-lesson action and make sample chart rows readable to beginners.

## Changes
Home's continuation card derives its progress from valid catalog completions and shows Foundation Progress: X of 8 stones laid plus eight compact pill segments immediately above the CTA. Only a full valid catalog completion shows All 8 foundation stones complete! Review any lesson at your pace. Existing weekly receipt behavior and next lesson links retained.

Chart labels now show VTI · US Total Stock Market and VXUS · International Stocks. Names are also included in the row's accessible name. Signed contributions, order, tooltip data, dates and financial calculations remain unchanged; unknown tickers retain their original labels.

Files: components/home-dashboard.tsx and its CSS module, weekly-tug-chart.tsx, weekly-loop.test.tsx, weekly-tug-chart.test.tsx.

## Verification
Typecheck passed. Focused tests: 23 passed in 3 files (weekly loop, chart, Home states), including seven/eight completion cases and pill counts. Lint rerun after removing one unused test variable. Browser verified seven filled pills and one empty segment above the primary action, with both requested chart labels and unchanged signed sample values. User learning record remains seven of eight. No build required for the localized presentation change; no new dependencies or deployment.

## Remaining work / next step
None for this task. Mobile widths were not rechecked in this pass.
