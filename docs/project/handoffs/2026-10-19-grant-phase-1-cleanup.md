# Cornerstone — Phase 1 cleanup

Date: October 19, 2026. Status: complete for the requested cleanup scope. Work remains uncommitted in the existing checkout.

## Result

- Primary navigation contains exactly Home, Learn, Portfolio and Ask. Settings remains in the account link. Discover remains reachable through holding research links. Social and Recap routes and their backing code remain present but are removed from primary navigation.
- The existing recap and lesson-history content is folded into Portfolio under “Your recap & lesson history.” It initially follows the selected Portfolio mode. Home retains its short local recap.
- The allocation donut is rendered only by Portfolio holdings. Home uses a dated value summary. Both retained Recap branches no longer render their duplicate allocation donut.
- All progress counts now use the learning store and say “lessons.” Home has one tile per lesson; four completed lessons produce four completed tiles out of six. The older connected Recap also reads the learning store rather than old demo preferences. Legacy preferences remain only for migration/other settings.
- Removed the repeated sidebar learning/progress and practice-notice cards. The practice/no-real-money notice is in Settings. The Cornerstone+ teaser remains in source but is not mounted.
- Sample/imported holdings and Fictional practice use a prominent, keyboard-operable toggle. The forest/ivory/sage/lime identity, serif wordmark, fonts and existing lesson content are preserved.
- Ask is labeled “Guided Q&A,” retains the “Not live AI or market news” disclosure, and always derives ticker chips and answers from the shared sample/imported holdings. A saved practice run no longer substitutes CAFE or another simulated asset. Each answer retains its original source/date even if the current snapshot changes.
- Discover retains the hosted TradingView chart. Removed “Numbers at a glance,” flames, and adjacent authored headline/relationship panels to avoid mixing authored examples with provider data. Existing fixtures remain in source. The chart is not used to update portfolio holdings or prices.
- Dated labels accompany snapshot values, holding tables/details, attribution, scenario values/prices/order history and answers. CSV preview requires the user-supplied price date before showing the imported total or applying the file; import time is no longer represented as the quote date. CSV data remains in memory and clears on reload.
- Negative values retain their signs and use neutral colors instead of red. Practice controls say “Add to mix” and “Remove from mix.” Their existing simulation arithmetic and persisted values remain intact.
- TradingView startup is deferred until the current effect remains mounted, avoiding the first Strict Mode cleanup launching the widget. No new iframe error appeared while checking the loaded provider chart.

## Dates and limitations

- Sample holdings retain their existing September 2, 2026 source date. No weekly market history or live portfolio feed was invented.
- Scenario “as of” labels describe saved simulation activity. The fallback for an untouched run is the fixed scenario definition date, October 12, 2026; this is not a real-market quote date.
- TradingView owns chart point timestamps in its cross-origin embed. The page explains the UTC date axis and point inspection; undated standalone quote/volume legends are hidden. Cornerstone cannot independently verify provider timestamps or market freshness.
- Real weekly performance, move-specific lesson selection and “done for this week” remain for later phases. Existing lesson content and its 3–4 minute estimates were not changed.
- The retained, unlinked Social and connected backend/account surfaces have not been redesigned or launched by this phase.

## Verification

- Final npm run check: lint clean, TypeScript clean, 131 tests in 28 files passed, production build passed (40 generated pages).
- Added five focused regression tests: saved tile count; imported Ask holdings/date retention despite a practice run; CSV date gating; provider research without authored figures/flames; practice recap without a sample donut.
- Updated existing navigation, Recap and chart checks for the requested behavior. Existing axe accessibility tests passed as part of the full suite.
- Browser checked Home, Learn, Portfolio, Ask, Settings and Discover. Confirmed four primary links, real saved progress consistency, sample ticker chips, dated ticker answer, loaded provider chart, practice/recap source alignment, prominent mode controls, mobile drawer focus and Escape dismissal.
- Responsive samples: Home at 320px, Portfolio at 390px, Learn at 1440px; no document-wide horizontal overflow in those checks. Normal browser size restored. User learning/practice records were not reset and no simulated orders were placed.
- Git diff whitespace check passed. Initial sandbox test attempt could not rename temporary files; rerun outside the restricted sandbox completed successfully.
- No dependency additions, installs, lesson-content edits, commits, pushes or deployments.

## How to run and verify

From the repository, run npm run dev and use the Local URL reported by Next.js. The current server remains at http://localhost:3000.

1. Home: confirm six tiles and a completed-tile count matching “lessons complete,” with a dated portfolio summary and no donut.
2. Portfolio: inspect its single donut, change to Fictional practice, and open “Your recap & lesson history.” The folded recap initially matches that mode.
3. CSV: select a local CSV, confirm values remain hidden and Use this CSV preview stays disabled until Prices as of is supplied. Apply a dated file, then verify Ask chips match its symbols.
4. Ask: check Guided Q&A, the source/date label and disclosure; ticker answers should match the shared holdings, not practice assets.
5. A holding’s research link: confirm Discover shows the provider chart without authored financial panels or flame icons.
6. Settings through the account link: confirm the single practice notice.

## Changed source and test files

- app/assistant/page.tsx
- app/grant-cleanup.css
- app/layout.tsx
- app/portfolio/page.tsx
- components/app-shell.test.tsx
- components/app-shell.tsx
- components/assistant-client.tsx
- components/demo-portfolio.tsx
- components/grant-cleanup.test.tsx
- components/home-dashboard.tsx
- components/learning-library.tsx
- components/learning-recap.tsx
- components/mvp-settings.tsx
- components/mvp-ui.tsx
- components/onboarding-flow.tsx
- components/page-header.tsx
- components/portfolio-holdings.module.css
- components/portfolio-holdings.tsx
- components/portfolio-movement.module.css
- components/portfolio-movement.tsx
- components/portfolio-recap.test.tsx
- components/portfolio-recap.tsx
- components/portfolio-workspace.tsx
- components/practice-workspace.tsx
- components/recap-workspace.test.tsx
- components/recap-workspace.tsx
- components/stock-price-chart.test.tsx
- components/stock-price-chart.tsx
- components/stock-researcher.tsx
- components/tremor/bar-list.module.css
- lib/home-overview.ts
- lib/learning-share.ts
- lib/practice.ts
- lib/presentation.ts

## Context files updated

- PROJECT.md
- docs/project/AREAS.md
- docs/project/STATUS.md
- docs/project/handoffs/2026-10-19-grant-phase-1-cleanup.md

The repository already contained extensive tracked and untracked user work. The list above describes this phase, not all changes versus Git HEAD. Earlier work was retained.
