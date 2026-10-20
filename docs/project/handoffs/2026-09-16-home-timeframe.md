# Task handoff — Home movement timeframe

Date: 2026-09-16
Status: complete
Area: Dashboard and portfolio
Checkout: existing Cornerstone-Finance checkout; changes remain uncommitted.

## Objective and scope

Make the Home lead story state its time frame and give unusually large daily movement different wording without claiming unavailable weekly performance.

## Changes

- The lead story eyebrow is now “Latest available change.”
- Normal movement reads “Your portfolio finished higher/lower today.”
- Absolute previous-close movement of 5% or more reads “A bigger move up/down today.”
- Supporting fallback copy refers to today’s move.

## Verification

- Lint and TypeScript checks passed.
- Production build passed.
- Browser verification confirmed the sample headline reads “Your portfolio finished higher today.” and the supporting value remains labeled as change versus previous close.

## Remaining work / next step

None for this task. A true weekly label still requires weekly historical data.

## Coordination

Touched `components/home-dashboard.tsx` plus project status/area notes. Existing unrelated working-tree changes were preserved. No commit, push or deployment.
