# Task handoff — student demo

Date: 2026-09-03
Status: complete for the local demo
Area: current Next.js app and connected demo flows
Checkout / branch / commit: Cornerstone-Finance, main, baseline 3051140. This task remains uncommitted.

## Objective and scope

Polish the website for a student demo and make its main controls useful. Preserve earlier Discover/Social and Portfolio chart work, the legacy root site, and server integration boundaries. No deployment, live account activity or external AI integration.

## Changes

- DemoProvider shares sample/CSV portfolio state and validated browser-local profile, progress, follows, bookmarks and compact layout.
- Home and shell use a consistent student visual system, plain copy, useful navigation and feedback. Financial summaries derive from holdings.
- Portfolio shares imported holdings with Home and Assistant; chart, details, source labels and deterministic arithmetic agree.
- Discover combines hypothetical exposure examples with searchable curated research and bookmarks. Social retains fictional campus rankings and adds local following.
- Learn has six complete lessons, quizzes, progress, next-lesson navigation and a hypothetical growth/fee calculator.
- Assistant supplies curated educational responses with portfolio arithmetic, shortcuts and reset.
- Onboarding supports profile setup, sample launch, downloadable example CSV and local validation/preview/use. Parser handles quoted cells and rejects malformed, duplicate or invalid numeric input.
- Settings offers preferences, compact layout, privacy explanations and confirmed local reset. Sign-in retains the endpoint with pending/timeout/error handling and demo entry.
- Loading/error/not-found pages provide recovery; mobile navigation contains focus and supports Escape.
- Inter/Newsreader Latin variable WOFF2 assets copied unchanged from the existing development cache, verified with Next's bundled font metadata reader, and served through next/font/local. Full OFL notices accompany them.

## Decisions

Preferences persist in this browser. Imported financial contents stay in memory and clear on reload. Sample, fictional and curated content is labeled. Existing React/CSS/Lucide/Zod were sufficient; no new dependency was needed.

## Verification

- Final npm run check passed: lint, typecheck, 17 tests across three files and production build (23 generated pages).
- Initial final build failed on unreachable Google Fonts; local bundling resolved it.
- Desktop and 390px route checks, no page overflow, mobile keyboard focus/Escape, chart mouse/keyboard/reset interactions.
- All six quizzes completed, including wrong-answer feedback and persisted progress; calculator keyboard changes verified.
- Research save/filter/expansion, social following/filter/reload, settings save/reload/compact/reset/cancel exercised.
- Invalid synthetic CSV rejected; valid two-holding preview agreed across Portfolio, Home and Assistant. Reload restored sample data. Example CSV returned 200.
- Three-step sample launch returned Home with default profile; final reset removed synthetic QA progress/follows.
- Main and lesson routes returned 200; unknown lesson showed recovery page. Earlier fresh-load checks found no new hydration issue.
- Sign-in native validation checked without sending email. Live auth/database/provider behavior and external AI were not tested.

## Remaining work / next step

None for local demo scope. Review with the user. Before production, separately implement and verify live auth, brokerage lifecycle, authorized persistence, real community infrastructure and source freshness under SECURITY.md/BETA.md.

## Coordination

Shared app styles, layout, shell, CSV parser and project context changed. Fonts and example CSV are new assets. Legacy root scripts/styles remain untouched. No lockfile change, migration, deployment or commit. Earlier handoffs: 2026-09-03-discover-social.md and 2026-09-03-discover-clarity-portfolio-chart.md.
