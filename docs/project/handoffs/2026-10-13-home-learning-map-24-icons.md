# Home learning map: 24 icons

Date: 2026-10-13
Status: complete
Area: Home
Checkout: Cornerstone-Finance, existing shared checkout; uncommitted.

## Objective and changes

Expanded the Home learning map to 24 book icons at the user's request. Each of the six existing lessons has four decorative icons with its actual completion/next state. The completion count still reflects six real challenges; no lessons, rewards or saved progress were invented. Updated components/home-dashboard.tsx and the existing map rules in app/research-home.css to use six columns and a stacked mobile layout.

## Verification

TypeScript and lint pass. Browser inspection confirmed 24 icons at 1543px and 390px with no page-wide overflow. The map remains a link to /learn. No new tests were added for this small presentation-only change; no production build was run.

## Coordination and remaining work

Preserved existing user edits. Shared research-home.css changes are confined to the Home learning map rules. No dependency, learning data or other page changes. None remaining for this task.
