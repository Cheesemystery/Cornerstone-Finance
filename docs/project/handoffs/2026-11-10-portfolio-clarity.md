# Task handoff — Portfolio clarity

Date: 2026-11-10
Status: complete
Area: Portfolio presentation

## Changes
Renamed mode controls My Portfolio / Practice Sandbox. Sample-history banner uses Demo Portfolio and the actual weekly date range; non-sample histories retain their existing source banner. Donut legend displays the four requested plain-English descriptions, with existing fallback for other tickers. Inside the move has scoped coral/loss and mint/gain fills and amount badges with directional arrows. A single friendly caption replaces the prior caption plus technical footnote; nonweekly comparisons say in this period. Shared BarList has an optional caption with its original default, preserving Recap behavior. Holdings first-column buttons lose inner border/background; table price changes have clear contrasting signed colors. Financial math and selection handlers unchanged.

Files: portfolio-workspace.tsx, portfolio-holdings.tsx and module CSS, portfolio-movement.tsx and module CSS, tremor/bar-list.tsx; grant-cleanup and learning-recap-access tests.

## Verification
Typecheck/lint pass. Five focused files: 34 tests pass across the final runs, including eight accessibility scans, Portfolio selection, BarList and learning Recap mode switching. Updated stale label/caption assertions. Browser verified the actual demo period, descriptive legend, coral negative amounts and mint positives with the requested arrows and one-line explanation. Diff check passed with existing line-ending warnings. Mobile not rechecked; no production build needed for these presentation-only edits. No dependency changes, commit or deployment. Existing work and stored progress preserved.
