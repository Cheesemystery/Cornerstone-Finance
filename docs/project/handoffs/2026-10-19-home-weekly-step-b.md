# Home Weekly — Step B

Date: 2026-10-19
Status: complete for Step B only
Area: Home presentation
Checkout: existing Cornerstone-Finance working tree; earlier user work preserved, no commit.

## Scope and files

- components/home-dashboard.tsx: mounts WeeklyTugChart after the weekly summary, before completion/action; keyed to existing week identity so price/holding changes animate the new chart while routine provider rerenders do not replay it.
- components/weekly-tug-chart.tsx (new): consumes existing positions, sorts a copy by absolute contribution, scales native SVG bars against the largest magnitude. Ties use ticker ordering. Signs use true minus; rounded zero is +$0.00/Unchanged with a zero-length bar.
- components/weekly-tug-chart.module.css (new): forest-compatible sand/sage bars, center axes, 64px row buttons, focus outlines, stable hover/focus/tap detail overlays and 400ms ease-out growth staggered 60ms per row. No lime or red introduced.
- components/weekly-tug-chart.test.tsx (new): four cases verify ranking/geometry without mutating the weekly result, dated tooltip values and dismissal, pointer access/text equivalent, and all-flat finite coordinates/no negative zero.
- docs/project/STATUS.md, AREAS.md and this handoff.

## Decisions

Existing contributions are authoritative; no weekly-return arithmetic, history requests, lesson content, dependency or storage changes. SVG uses a stable center origin and fixed row geometry to prevent animation layout shift. Tooltip overlays reserve no additional layout space; each includes dated closes and contribution as-of date. The inherited masthead source/date applies to visible chart labels. Every row is a native keyboard/touch button, not a primary action. Detail overlays support pointer hover, focus, tap and Escape. A complete hidden list provides a text equivalent.

The requested chart-specific 400ms/60ms stagger is treated as one chart entrance sequence; it is not looping. The explicit Step B stagger is more specific than the general one-animation-at-a-time principle. Both OS reduced-motion CSS and the existing local Reduce motion setting remove animation entirely.

## Verification

- npm run check: lint, TypeScript, 181 tests / 34 files, production build (41 routes) pass.
- Actual side browser: sorted sample bars VTI, VXUS, BND, AAPL with matching signed amounts; no horizontal overflow at 375x812 or 1280x1000. Four 64px touch targets.
- Keyboard focus shows a visible ivory outline and dated detail panel; Escape dismisses it. Tooltip prices/shares match the existing result.
- Computed animation duration 0.4s; delays 0, 0.06, 0.12, 0.18s. Temporarily enabled existing Settings Reduce motion and verified animation-name:none for every bar; restored its original off state. OS media query inspected in source; OS preference itself was not changed.
- Browser console capture reports no errors. No new dependencies. Screenshots saved in the current chat outputs directory.

## Run / force states

Run npm run dev from the repository and use its reported port; currently http://localhost:3000/.

Use a separate browser profile to preserve existing holdings/completion. Use sample portfolio for both left/right bars. Manually use VTI alone for left-only and VXUS alone for right-only, with the dated sample banner when no provider key exists. With no holdings or insufficient history, existing input state appears and no chart mounts.

Reload Home to replay the entrance. Tab through rows or hover/tap to show details; Escape closes them. Settings > Reduce motion followed by Home makes bars instant. Run npm test -- components/weekly-tug-chart.test.tsx to force flat/zero and mixed fixtures without modifying user data.

## Remaining work

Stopped after B. C adds the wall and updates the weekly lesson action/completion display check identified in the audit. D/E/F remain unimplemented. No source outside Home presentation and tests/docs changed.
