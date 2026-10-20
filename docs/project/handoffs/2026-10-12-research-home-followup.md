# Task handoff — four-page research and Home follow-up

Date: 2026-10-12
Status: Complete within the requested data assumptions.
Area: Portfolio, Social, Discover, Home and their scoped styling.
Checkout: Cornerstone-Finance; existing uncommitted work preserved, no commit/deployment.

## Objective and scope
Implement the four new user requests one at a time, preserving the Learn path and all other functionality. The short plan and data assumptions were presented before coding, with changes/test instructions reported after each item.

## Changes
1. Portfolio opens on Inspect sample, the first mode button. The existing pie/holdings view precedes the collapsed CSV controls.
2. Social route restored from HEAD, mounting the previous leaderboard component. SHA256 matches the pre-MVP saved component exactly; no profile, return, strategy, filter or follow behavior changed.
3. Discover replaced by a stock research workspace. New stock-research data/types/selectors and a provider/example chart component provide ticker/company search, URL selection, an attributed TradingView chart, deterministic example periods/point slider, explicit loading/failure/retry, key figures, example news and customer/supplier categories. Heat markers attach the same selected-stock headline and use absolute daily move >=5% or relative volume >=2x in example data. Existing research explainers/bookmarks remain under a disclosure; existing q stock/fund URLs work.
4. Home split into a compact six-box completion widget linking to Learn and a portfolio overview. Existing completions fill boxes, the next lesson CTA remains, and the right side has a pie/legend, day/week comparisons and local personalized recap. An existing practice run can be viewed separately, with cash in the allocation and saved weekly checkpoint math.

Files: app/discover/page.tsx, app/social/page.tsx, app/layout.tsx, app/research-home.css; components/portfolio-workspace.tsx, home-dashboard.tsx, stock-researcher.tsx, stock-price-chart.tsx; lib/home-overview.ts and stock-research.ts; tests and project context.

## Data/source decisions
- TradingView official hosted Advanced Chart widget: https://www.tradingview.com/widget-docs/widgets/charts/advanced-chart/ . Reviewed official code/settings and free-widget description. Attribution retained; no Advanced Charts library download, npm bundle, paid key, or template code.
- Provider price chart data may be delayed and varies by exchange. The embed rendered market price data in the browser.
- Example prices appear only in example-chart mode, avoiding a conflicting mock headline price over the provider chart.
- News, key figures, customers/suppliers and heat signals are visibly labeled examples. Customer/supplier entries are layout categories, not verified named relationships.
- Sample's supplied previous-close comparison is dated; no weekly return is invented. Paper mode uses its stored weekly checkpoint and shows no daily simulation return.
- The personalized recap is explicitly local and deterministic, based on holdings/progress. No AI model/service is claimed.
- No new dependencies, accounts, migrations, deployment or real orders.

## Verification
- npm run check: lint, TypeScript, 86 tests / 18 files and production build PASS; 40 generated pages.
- Added tests cover signal thresholds in both directions, signal/headline association, ticker sanitization/old fund lookup, deterministic example curve/closing change, snapshot source/period availability, empty/down portfolios, cash-inclusive practice allocation, checkpoint results, personalized next lesson and remote-chart failure/example fallback.
- Browser: default Portfolio pie, restored Social profiles, actual TradingView price chart, flagged ticker/headline, example chart, custom IBM missing-panel state, direct q link, selection/reload, Home sample vs practice weekly comparison, learning widget link.
- All four updated pages fit 320/390/768/1304 widths without page-wide horizontal overflow.
- Social component hash equals the saved previous-version component.
- External widget occasionally logs a transient iframe listener warning when rapidly switching/unmounting charts. No Cornerstone runtime/hydration failure observed; source availability remains outside local control.

## Remaining work / next step
None for these four changes within the stated placeholder/local-summary assumptions. Future data work can connect news, fundamentals, verified relationships, real weekly price history and an AI service. Prior release/user-study gates remain unchanged; no new performance score is claimed for this follow-up.

## Coordination
All edits are uncommitted atop prior user work. The learning experience, legacy site, backend integration code and dependencies were preserved. Development server remains at its reported localhost:3000 address. Screenshots and a user testing guide are in the chat outputs folder.
