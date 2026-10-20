# Task handoff — practice financial charting review

Date: 2026-10-16
Status: complete — dated-chart installation deferred
Area: Cornerstone Recap; paper practice; Discover chart boundary
Checkout / branch / commit: `C:\Users\abrah\Documents\Codex\2026-09-02\my-website-code-is-in-a\Cornerstone-Finance`, `main`, `9f2b0e3`; existing work remains uncommitted.

## Objective and scope

Review TradingView Lightweight Charts and determine whether the available saved paper-practice checkpoints support a useful dated timeline before installing anything. The user explicitly permits deferral when data is insufficient. Read project instructions, current status/area notes and the latest TanStack/Tremor handoffs, then inspected the practice engine, persistence schema, Recap rendering, Discover widget and Git state.

**Decision: defer installation.** This pass changes only this handoff, STATUS and AREAS. No new dependencies, application changes, saved-record mutations, market-data service, commit, push or deployment.

## Data assessment

`lib/practice.ts` stores each checkpoint as `week`, `beforeCents`, `afterCents`, `at` and `reflected`. The values include fictional cash plus positions at the scenario's fixed prices; they are sufficient for an ordinal scenario-step visualization. Scenario definitions contain three advanceable simulated weeks, not calendar price histories.

The current browser's saved run has **one completed checkpoint**. This count was verified through the existing practice Recap view, without reading/exporting browser storage or changing the run. No personal values, identifiers or timestamps are recorded here. The existing SVG's two points are the defined starting balance plus that checkpoint; they are not two dated observations.

Important limits in the current model:

- `startPractice` saves no `startedAt` or independently dated opening valuation. Recap prepends its fixed starting balance to checkpoint values. Assigning that balance the first checkpoint's timestamp, a prior day or a fabricated scenario date would misstate the available record.
- `advancePractice` writes `now.toISOString()` when the learner advances. This is the real recording time of a simulated transition, not the date of a week of market returns. Multiple simulated weeks can be completed on one calendar day, or have identical timestamps when the clock is fixed. Converting all timestamps to daily dates could collapse different steps.
- The persistence schema accepts `at` as a string and checkpoint week as an integer, without validating date syntax, ordering or uniqueness. Chart-ready dated observations need validation rather than assuming all stored strings are usable.
- The snapshot fallback date in `practiceSnapshot` is a presentation fallback, not a historical observation. Order timestamps likewise record trades, not independently sampled portfolio valuations; do not turn them into fabricated curve points.

One actual dated checkpoint cannot establish a dated trend. The available records support the existing clearly labelled scenario-step graphic, which remains intact. This is a data/meaning decision, not a claim that the library cannot draw short series: Lightweight Charts supports custom horizontal scales, so a separately scoped ordinal-week implementation is technically possible. It would not supply the missing dated opening record or add dated history to this run.

## Official documentation and attribution review

Reviewed the supplied [official repository](https://github.com/tradingview/lightweight-charts), current [getting-started documentation](https://tradingview.github.io/lightweight-charts/docs), [time-scale guide](https://tradingview.github.io/lightweight-charts/docs/time-scale), [series API](https://tradingview.github.io/lightweight-charts/docs/api/interfaces/ISeriesApi) and [NOTICE](https://github.com/tradingview/lightweight-charts/blob/master/NOTICE). Documentation identifies version 5.2. No package version was installed or compatibility-tested.

The library renders client-side canvas and targets ES2020; it does not supply a market-data feed. Current creation APIs use `createChart` and `addSeries(LineSeries)`. `setData` takes observations in time order; `update` replaces the latest observation when its time matches. Equal-time transitions therefore need a deliberate representation rather than silently discarding steps.

The repository uses Apache-2.0, with additional incorporated-code notices. Its stated attribution requirements are a user-visible notice from NOTICE and a link to TradingView. The reviewed NOTICE identifies TradingView Lightweight Charts and the 2025 TradingView copyright. If later installed, retain the exact LICENSE/NOTICE shipped with that pinned release and display its attribution on the chart page. The `attributionLogo` option satisfies the link requirement; it does not by itself replace the notice requirement. Existing Discover-widget attribution is separate and must remain.

## Missing requirements / next concrete step

Before adopting a **dated** practice line chart:

1. Have at least two actual, valid, distinct dated valuation observations in the same run. Two later checkpoints can satisfy this without an opening point; to include the opening balance, explicitly persist a start timestamp and valuation for new runs. Do not backfill historical start dates for old runs.
2. Define the axis semantics: recording time versus simulated week. If recording time is used, show both recorded time and simulated-week number and state that elapsed wall-clock time is not investment duration. If scenario steps are used, use an honest custom scale rather than pretend calendar dates. Preserve distinct same-day transitions and explicitly handle invalid/duplicate timestamps.
3. Validate/sort chart observations without mutating stored records, preserve cents arithmetic and source labels, and keep a clear empty/one-observation state. Do not infer OHLC, daily prices, interpolation records or monthly returns. A line chart needs value observations, not a new market-data provider.
4. Provide a visible accessible table/list of each actual point (period, recorded time when valid, value), plus a short summary independent of canvas/hover. Keep keyboard interactions, brand, mobile containment and reduced motion. Client-only loading must clean up the chart/resize observers on unmount/source changes, and measure dependency/bundle impact.

There is no required implementation work left in this review. The conditional chart is intentionally deferred. Any future persistence/schema expansion needs a bounded follow-up preserving existing saved runs.

## Discover preservation

`components/stock-price-chart.tsx` still loads the hosted TradingView Advanced Chart script, uses provider-supplied data, shows provider delay/availability labels, retains attribution and offers its existing clearly labelled authored-example fallback. No empty custom chart, provider replacement or new market-data service was introduced. Its source hash is unchanged.

## Verification

- Existing targeted checks pass: **19 tests in 5 files** covering practice, portfolio insights, Recap movers, Recap presentation and hosted TradingView chart lifecycle/fallback. No tests were added to mirror a documentation-only decision.
- Side browser confirmed the saved practice source, simulated-week/not-calendar-month label and one saved checkpoint plus the undated scenario baseline. No orders, advances, reflections, resets or saved-preference changes were made. Recap left open.
- Documentation links and diff whitespace pass. Pre/post hashes confirm only STATUS and AREAS changed among pre-existing files; this handoff is new. Application source, package/lock files, Discover, financial helpers and pre-existing user work remain intact.
- No lint/build or bundle benchmark rerun was needed because application inputs did not change. No live provider availability, large-data benchmark or full assistive-technology validation is claimed.

## Coordination

Documentation-only context updates. Related decisions: [Tremor contributor visuals](2026-10-16-tremor-contributors.md), [TanStack evaluation](2026-10-16-tanstack-table-evaluation.md). No commits, pushes or deployments; all existing checkout work preserved.
