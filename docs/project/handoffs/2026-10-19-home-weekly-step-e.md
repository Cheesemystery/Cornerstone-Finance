# Home Weekly — Step E

Date: 2026-10-19
Status: complete for Step E
Area: Home presentation and one Settings preference
Checkout: existing Cornerstone-Finance working tree; earlier tracked/untracked user work preserved. No commit/deployment.

## Files changed

- components/demo-provider.tsx: proView boolean defaults false in the existing validated preference schema. Old records adopt false; existing update/reset flows persist/reset it without a new store.
- components/mvp-settings.tsx: Pro view Switch after Compact layout, with accessible label/description explicitly limiting it to Home.
- components/home-dashboard.tsx: conditional Home-only theme/table, compact chart flag and monospaced percentage span while retaining the existing serif headline wording.
- components/home-dashboard.module.css: scoped forest/teal dark presentation, smaller type, monospaced tabular figures, contrasting focus/labels, table and mobile styles. Standard selectors remain unchanged.
- components/home-pro-holdings.tsx (new): dated native table ranked like the chart, signed dollars, Contribution %, unrounded total and clear percentage-base note.
- components/home-pro-view.test.tsx (new): four integration cases for old/default-off preferences, saved switch/reload/reversal without changing progress/holdings, correct immutable table values, and empty Home without a table.
- components/weekly-tug-chart.tsx and weekly-tug-chart.module.css: optional compact flag, default unchanged; compact chart buttons retain at least 48px height.
- PROJECT.md, docs/project/STATUS.md, AREAS.md and this handoff.

## Decisions and assumptions

Pro view is an optional appearance preference, not an entitlement, investor label or paid feature. It applies only to the main Home content; global navigation, other pages and editorial replay/share artwork keep their appearance. Existing paper/forest/sage identity remains; lime stays on the primary action/new stone, and no red is added.

System monospace fonts provide tabular figures without downloading/installing another font. Newsreader remains for masthead/headline lettering; the headline percentage, dates, dollar values and table use monospace in Pro view. The cumulative wall, one lesson action/completion line, source banner and replay remain available.

Contribution % is shares × price change divided by total portfolio start value × 100, using the existing computed contribution/start values. It is an attribution to the portfolio change, not the holding's own price return. Percentages show three decimals, dollars two; totals use the existing unrounded weekly values, and the visible note discloses this. Thus the sample total -0.163% is the more precise display of the existing -0.16% headline. No weekly calculation, date selection, lesson matching or saved financial data changed.

## Verification

- Full npm run check passes lint, TypeScript, 206 tests / 38 files, production build (41 routes).
- Browser toggled Pro using Space, navigated Home and reloaded: Pro/table persisted. Switched back with Space: standard Home restored and no table. Original off preference left restored.
- Browser at 1280x900 and 375x812: no horizontal overflow; mobile table width 258px within its panel. Compact chart buttons observed 50px high (48px minimum). Monospace confirmed in computed table/headline-number fonts.
- Loaded Portfolio while Pro was enabled: no Pro Home element, original paper background and original Portfolio content retained. No Portfolio source edited.
- Main learning count, saved holdings, nickname and weekly completion unchanged. Tests assert no writes to learning or holdings while toggling.
- Contrast of new table text against hero 11.08:1, caption/header 8.13:1, wall caption 10.54:1; empty stone outline 7.5:1. Focus uses contrasting ivory in Pro view. No new animation, and existing chart/wall motion overrides remain.
- Captured browser console error log empty; CRLF-aware git diff --check passes.
- Screenshots saved in current chat outputs: step-e-pro-desktop.jpg, step-e-pro-mobile.jpg and step-e-settings.jpg.

## Run and force states

Run npm run dev from the repository, using the reported port; currently http://localhost:3000/.

Settings > Pro view on, then Home: dark compact chart/table. Reload to verify persistence. Turn it off for standard editorial Home. Keyboard: Tab to the switch and Space to toggle; its label also operates it. The switch uses the existing 44px hit-area foundation.

Use a separate browser profile to test no holdings or alternate portfolios without changing main progress. Empty/short-history Home stays in its existing input state and adds no table; Pro appearance can remain selected. Sample holdings give both positive/negative rows, with source dates. Run npm test -- components/home-pro-view.test.tsx for default/migration, persistence, immutable numbers and empty-state fixtures.

## Remaining work

Stop after E. F first-edition/empty/loading/error/stale-data polish remains unimplemented. No AI narration, dependency additions, lesson content or financial math changes.
