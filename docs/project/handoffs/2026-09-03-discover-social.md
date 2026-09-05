# Task handoff — Discover and student Social

Date: 2026-09-03
Status: complete
Area: Discover; Social; shared navigation/styles
Checkout: Cornerstone-Finance / main, starting commit 3051140; changes uncommitted.

## Objective and scope
Revamp Discover with a profile-suggestion placeholder and restore college-focused social profiles/leaderboard in the current Next.js app.

## Changes and decisions
- Added profile-suggestions.tsx with two explicit hypothetical geographic-exposure scenarios. The existing portfolio contains VXUS, so no claim is made that it is U.S.-only.
- Added issuer-linked VXUS and IXUS examples, verified against Vanguard and iShares product pages on 2026-09-03. No popularity rankings or personalized trade instructions.
- Discover retains news search and now consumes the existing dashboard q parameter. Replaced misleading provider-configuration copy with an explicit fixture disclosure.
- Added /social and social-leaderboard.tsx: six fictional student profiles, college/name search, strategy filters including Growth/Dividend/Index/Scalp, native expandable profiles and simulated returns sorted descending.
- Added Social navigation and scoped styles in globals.css. Preserved all legacy source and existing data/auth flows.
- Updated PROJECT, STATUS and AREAS with product direction and implementation boundaries.

## Verification
- npm run lint: passed.
- npm run typecheck: passed.
- npm run build: passed, including /social and dynamic /discover.
- Desktop screenshots reviewed for Discover and Social.
- 390px viewport: both routes had no horizontal overflow; mobile menu opened and dismissed on navigation.
- Profile scenario switch, research AAPL filtering, combined college/strategy filtering, profile expansion, empty state and reset passed in browser.
- Keyboard Tab from scenario select reached the first issuer link.
- No integration services, database changes, commits or deployments.

## Remaining work
None for this preview scope. Future personalization requires portfolio classification and profile goals; real community profiles/rankings require persistence, privacy controls and a defined ranking period/method.

## Coordination
Shared app-shell.tsx and globals.css changed. Current work remains uncommitted. Legacy files unchanged.
