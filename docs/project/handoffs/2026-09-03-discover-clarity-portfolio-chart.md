# Task handoff — Discover clarity and Portfolio chart

Date: 2026-09-03
Status: complete
Area: Discover and Portfolio
Checkout: Cornerstone-Finance / main; starting HEAD 3051140; changes remain uncommitted alongside the previous Discover/Social task.

## Objective and scope
Make Discover easier to grasp immediately, with less jargon, larger important text and more energetic visual design. Add an interactive holdings pie/donut to Portfolio, inspired by the user’s Blossom reference.

## Changes
- Reworked profile-suggestions.tsx and added profile-suggestions.module.css: prominent takeaway, lime highlight, large U.S. percentage, one-sentence explanation, scenario buttons, fund anchor action, plain ETF explanation and brighter research cards.
- Simplified app/discover/page.tsx header. Retained hypothetical-example and risk labels, issuer links and existing query-aware research.
- Added portfolio-holdings.tsx and portfolio-holdings.module.css: donut, legend, total, daily change, biggest holding, details with shares/price/cost-basis gain, research links and full holdings table.
- Portfolio now passes the sample snapshot into the new component. Connect or import links to existing onboarding.
- Both chart and table derive values from marketValue/summarizePortfolio; no independent financial model or new provider calls.
- Updated STATUS and AREAS. Previous Social and legacy files preserved.

## Verification
- npm run lint: passed.
- npm run typecheck: passed.
- npm test: all 6 existing tests passed.
- Final npm run build: passed after SVG title correction.
- Desktop screenshots reviewed for both routes; mobile 390x844 screenshots reviewed, no page-level horizontal overflow. Holdings table retains its internal horizontal scrolling on narrow screens.
- Chart: direct click on the VTI slice selected it and showed $2,892.96 / 42.1%; Enter on VXUS slice selected it; legend AAPL selection showed $916.72 and cost-basis gain $206.72. Show all and Escape reset.
- Research VTI navigated to Discover with VTI prefilled and one matching sample article.
- Both Discover example buttons changed the displayed explanation and percentages.
- Fixed an SVG title hydration mismatch by rendering its label as one string. Fresh loads produced no new hydration error. Existing global smooth-scroll guidance remains a nonblocking warning.
- Viewport override reset; Portfolio left open in side panel.

## Limitations and next steps
Complete for this local UI scope. Portfolio and suggestions remain sample/demo data. Real personalization/import, performance history and backend community data remain separate work. Existing unit tests cover underlying arithmetic; no live integration was tested. No commit, push or deployment performed.

## Coordination
New styling is confined to CSS modules. Shared finance types/data and legacy source unchanged. Prior task changes remain intact and uncommitted.
