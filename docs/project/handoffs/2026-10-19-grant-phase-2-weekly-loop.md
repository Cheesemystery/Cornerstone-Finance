# Cornerstone — Phase 2: the weekly loop

Date: October 19, 2026. Status: implemented and verified for this phase. Existing checkout retained; changes are uncommitted.

## Delivered

Home now contains only the dated “Your week” hero, the single “Understand this move (2 min)” lesson action, and a small Continue learning row. After the linked lesson is completed, the hero shows “You’re done for this week. Check back Monday.” The action is hidden until a new week or a materially different holdings set. There are no Home streak counters, XP blocks, donuts, practice switches or extra recaps.

Empty holdings, missing symbols, price errors or less than seven calendar days of shared history produce a friendly input state with CSV upload, manual add, and Use sample portfolio. Missing data never becomes a zero-valued priced portfolio or a partial sum.

## Holdings and persistence

- Canonical holdings are ticker and positive shares, with optional total position cost basis. The UI accepts up to 50 unique tickers and fractional shares. Data is validated before replacing the current set.
- Saved holdings and weekly completion live under cornerstone-holdings-v1. Existing learning, profile and fictional-practice stores remain separate.
- CSV requires ticker/shares; symbol/quantity aliases allow old exports. Optional cost_basis is a total position cost. Prices, names and other legacy columns are not used as quote data. This intentionally supersedes Phase 1's temporary CSV quote-date input.
- Manual Save holding adds a ticker or replaces that ticker's share count. Portfolio supports removal of individual holdings.
- JSON export/import round-trips version, source and the normalized holdings only. Learning events, completion records, API keys and price responses are not in the export. Invalid imports leave the last valid portfolio intact.
- Raw CSV/JSON files are not uploaded or retained. Only normalized holdings persist locally. Only tickers, optional date bounds and the sample-mode flag go to the server route; share counts and costs are never sent to the price provider.
- Browser-storage failure remains usable for the current session and produces a visible warning, including on priced Home. JSON export remains available in Portfolio for a backup.

## Historical prices

- Function: getHistoricalCloses(tickers, fromDate, toDate), in lib/server/historical-closes.ts. It is guarded by server-only and implements a provider-independent typed result.
- Route: POST /api/prices/history. It accepts bounded tickers/date inputs, rejects unknown fields and quantities, returns private/no-store responses, and never exposes keys or raw provider errors.
- Current live adapter: Twelve Data daily USD closes, using server-only TWELVE_DATA_API_KEY. Authorization is a request header rather than a URL parameter. Responses validate ticker, interval, USD currency, real dates, positive finite closes, and duplicate dates. A timeout and bounded server cache contain repeated work.
- Defaults for a configured provider request completed prior-day daily candles over a 90-day range, avoiding a currently unfinished candle. Reported dates are the actual closes used, not page-open time. The result is a historical price comparison, not a real-time feed.
- With no key, the entire response comes from the bundled dataset. Use sample portfolio always requests that dataset, even if a key is later configured. An API failure with a configured provider does not merge fixture rows into a live response.
- Bundled data uses actual calendar dates from August 24 through September 2, 2026, with authored sample prices. These are not claimed to be verified market closes. Every resulting price surface is labeled “Sample data - as of Sep 2, 2026.” Unsupported sample tickers remain missing rather than being mapped to an unrelated asset.
- Adapter references: [historical request dates](https://support.twelvedata.com/en/articles/5214728-getting-historical-data), [official time-series API documentation](https://twelvedata.com/docs#time-series).

## Deterministic calculation and copy

For all saved holdings, intersect the available closing dates. End is the latest shared close; start is the last shared close on or before end minus seven calendar days. This handles weekends, holidays and symbols with different coverage without comparing mismatched periods.

Each contribution is shares × (end close − start close). Total dollar change is the sum of those contributions. Percentage change is that sum divided by total start value, times 100. Display formatting rounds only at presentation. Home, Portfolio and Guided Q&A use the same derived snapshot and explicitly label its comparison period as a week.

The result assumes the saved share counts at both closes. It excludes transactions, dividends, fees, tax and corporate-action reconstruction. This is price attribution, not a total-return or transaction-aware performance service.

Up, down, flat and mixed outcomes use deterministic two-sentence copy naming the driver and opposing offset. A no-offset case says so with $0.00; it does not fabricate an offset. Down copy is neutral and gives calm context without instructions or predictions. No LLM calculates or writes the weekly result.

The default linked lesson is why-prices-move. A concentrated individual-stock driver (at least 40% of start value) selects spread-your-risk. The existing lesson texts, activities, quizzes and answers are unchanged.

Sample verification window: August 26 – September 2, 2026:

| Holding | Contribution |
| --- | ---: |
| VTI | −$41.04 |
| VXUS | +$25.52 |
| BND | +$19.57 |
| AAPL | −$15.28 |
| Total | −$11.23 |

Start value is $6,878.00; end value is $6,866.77; change displays −0.16%. All these sample figures are as of September 2, 2026.

## Weekly completion

- Clicking the Home lesson action records a local active-week identity and snapshot before navigating to the existing lesson with weekly=1.
- Only completion of that linked lesson, against the same active snapshot and holdings/week identity, records weekly completion. An old lifetime lesson completion, a wrong lesson or changed holdings cannot silently complete the weekly task.
- Already-completed lessons can be revisited for this week's task. Their existing idempotent learning rewards are preserved, so no duplicate lesson XP is granted.
- Done survives reload and JSON holdings round trips for the same portfolio. A Monday boundary in the saved timezone reopens the task while retaining earlier completion history. A price refresh within the same calendar week does not by itself remove an already-earned done state.

## Verification

- Final npm run check: lint clean, TypeScript clean, 160 tests in 32 files passed, production build passed (41 pages/routes). Existing accessibility regression tests remain included.
- Unit coverage includes common-date alignment, calendar gaps, arithmetic reconciliation, driver/offset ranking, calm outcome templates, lesson selection, JSON/CSV validation, date constraints, server key isolation, all-sample fallback, and rejection of partial live failures.
- Full local integration tests cover the real provider/store/lesson components: empty states; repeat lesson → done → reload; Monday rollover; stale/wrong completion rejection; CSV/JSON persistence; obsolete fetch cancellation; visible quota-failure warning after Home becomes priced.
- Browser verified the complete sample lesson flow, done after reload, matching weekly numbers on Portfolio, JSON download and re-import, CSV import, manual add, unsupported-symbol empty state and return to the sample. Only sample/synthetic holdings were used; the user's existing lifetime learning/practice records were not reset.
- Browser checked Home at 320px, 390px and 1440px with no page-wide horizontal overflow. Normal viewport restored; the side browser is left on the saved done state.
- Production browser assets contain neither the historical provider host nor TWELVE_DATA_API_KEY nor test API credentials. Historical provider code remains server-side.
- Hash comparison confirms lib/lessons.ts, lib/lesson-activities.ts, package.json and package-lock.json are unchanged from the start of Phase 2.
- No dependency additions, migrations, brokerage actions, commits, pushes or deployment.

## Setup and how to verify

1. Run npm run dev from the repository and use the Local URL it prints. The running server is http://localhost:3000.
2. With no holdings, Home offers Upload CSV, Add manually and Use sample portfolio. Choose the sample to see the dated window above.
3. Open Understand this move (2 min), finish the existing lesson, then choose Back to your week. Reload Home and confirm the done state remains.
4. Portfolio contains manual entry, CSV upload, removal and JSON export/import. Changing ticker/share rows changes the weekly task identity. Check that the same weekly delta appears throughout the priced views.
5. To configure the live adapter, set TWELVE_DATA_API_KEY only in the server's .env.local or environment and restart the server. Do not use a NEXT_PUBLIC_ key. Leaving it blank keeps the dated sample fallback. No key was added to the user's files by this task.
6. Run npm run check to reproduce lint, type, financial, storage, UI and production-build checks.

## Uncertainties and remaining limits

- No historical-price API key is configured. The live adapter was verified with mocked provider responses, not an authenticated real-provider integration. Coverage, delays and account limits still need verification with the intended key before a live-data release.
- The requested Home CTA says “2 min”; existing lesson metadata still says 3–4 minutes because lesson content/metadata was protected. No timed two-minute usability claim is made.
- The sample dataset intentionally remains fixed and dated. A weekly completion reset does not make its prices current.
- Browser-only records do not sync across devices. The prototype is not a grant/public-release readiness certification.

## Changed source and test files

- .env.example
- app/grant-cleanup.css
- app/learn/[slug]/page.tsx
- components/assistant-client.tsx
- components/demo-portfolio.tsx
- components/demo-provider.test.tsx
- components/demo-provider.tsx
- components/grant-cleanup.test.tsx
- components/home-dashboard.tsx
- components/lesson-reader.tsx
- components/mvp-settings.tsx
- components/portfolio-holdings.tsx
- components/portfolio-movement.tsx
- components/portfolio-recap.test.tsx
- components/portfolio-recap.tsx
- components/portfolio-workspace.tsx
- lib/csv.ts
- lib/demo-assistant.ts
- lib/domain.ts
- lib/presentation.ts

## Added source and test files

- app/api/prices/history/route.ts
- components/holdings-input.tsx
- components/use-weekly-portfolio.ts
- components/week-source.tsx
- components/weekly-loop.test.tsx
- lib/historical-closes.test.ts
- lib/historical-data.ts
- lib/sample-history.ts
- lib/saved-holdings.test.ts
- lib/saved-holdings.ts
- lib/server/historical-closes.ts
- lib/weekly-portfolio.test.ts
- lib/weekly-portfolio.ts

## Context files

- PROJECT.md
- SECURITY.md
- docs/project/STATUS.md
- docs/project/AREAS.md
- docs/project/handoffs/2026-10-19-grant-phase-2-weekly-loop.md

Earlier tracked and untracked user work was preserved. The file list describes this phase, not the full checkout diff against Git HEAD. Phase 3 has not started.
