# Site area map

Read [PROJECT.md](../../PROJECT.md) first. These boundaries are for scoping work; they are not permission to change shared dependencies.

## Dashboard and portfolio

- 2026-10-16 table review: retain native holdings table; TanStack installation skipped because current fixed columns have no sorting/filtering logic to simplify and selection already spans the chart/contribution views. Future adoption criteria and numeric/accessibility safeguards are in [the evaluation handoff](handoffs/2026-10-16-tanstack-table-evaluation.md).

- 2026-10-16 visuals: `components/portfolio-movement.tsx` uses the shared source-adapted Tremor BarList (`components/tremor/`) for existing signed contributions, preserving selection and ranking. No chart dependency or financial-model change; see [handoff](handoffs/2026-10-16-tremor-contributors.md).

- Routes: `app/page.tsx`, `app/portfolio/page.tsx`.
- UI: `components/home-dashboard.tsx`, `components/demo-portfolio.tsx`, `components/portfolio-holdings.tsx`.
- Dependencies: `lib/domain.ts`, `lib/portfolio.ts`, `lib/sample-data.ts`, shared shell and CSS.
- API: `GET /api/briefings` returns a sample briefing, not a user's saved portfolio.
- Tests: `lib/portfolio.test.ts`.
- Current presentation (2026-09-22): the interactive allocation chart is the first workspace module on Portfolio. Home contains a compact portfolio-aware question-and-answer card backed by the same curated assistant logic and deterministic portfolio calculations as the full Assistant.
- Current boundary: shared demo-provider sample/CSV state and deterministic values; no server persistence or connected-account feed.
- Verify: arithmetic and allocations, expansion controls, holdings table, empty/zero-value behavior for any new data path, source labels, mobile layout.
- Coordinate financial contract changes with data/API work.

## Cornerstone Recap

- 2026-10-16 dated chart review: Lightweight Charts installation deferred. Available practice run has one dated checkpoint and no dated opening record; real recording timestamps must not be treated as simulated calendar weeks. Keep current ordinal SVG and Discover's hosted widget. See [data/attribution review](handoffs/2026-10-16-lightweight-charts-review.md) before future adoption.

- 2026-10-16 visuals: `components/portfolio-recap.tsx` uses the same Tremor BarList for existing snapshot/practice movers. Examples without stock history stay empty; the practice checkpoint graphic and monthly unavailability stay intact. Dark card uses `overflow: clip` so keyboard focus scrolls the page rather than a hidden card interior. See [handoff](handoffs/2026-10-16-tremor-contributors.md).

- 2026-10-16 maintenance: `components/portfolio-recap.tsx` now isolates graphic and movers rendering in private components, preserving source selection, financial helpers and existing DOM/styles. DemoProvider isolates connected contribution state/cleanup and memoizes its context. Regression coverage and remaining React Doctor diagnostics are in [the review report](reports/2026-10-16-react-doctor.md).

- Current presentation (2026-09-15): `components/recap-workspace.module.css` scopes the calm portfolio overview, allocation graphic, learning card and neutral contribution records. History, manual entry, optional session target and scenario tools are disclosed on request. No streak or campus percentile is rendered.
- `components/recap-extra-tools.tsx` retains guarded checkout and optional scenario exploration. `components/recap-home.tsx` provides the neutral Home entry; the compatibility modal export returns null. Share downloads render the currently visible amount state locally, including edited demo activity. Existing authenticated image routes retain their access checks and use neutral copy.
- Signed-in Settings no longer invites campus comparison; previously opted-in users retain a Leave cohort action. The cohort API and stored preferences remain for compatibility.

- Routes: Home card/modal in `components/recap-home.tsx`; workspace at `app/recap/page.tsx` and `components/recap-workspace.tsx`; share card in `components/recap-share-card.tsx`.
- Model and fixtures: `lib/recap.ts`, `lib/sample-contributions.ts`; client source switching in `components/demo-provider.tsx`; feature flag in `lib/features.ts`.
- Authenticated APIs: contributions and corrections under `app/api/contributions/`; snapshots and private images under `app/api/recaps/`; preferences, campus, billing, email, Plaid and account deletion under their matching `app/api/` folders.
- Providers/services: Plaid in `lib/providers/plaid.ts` and `lib/server/plaid-sync.ts`; Stripe in `lib/providers/stripe.ts`; Resend in `lib/providers/resend.ts`; snapshot generation in `lib/server/recaps.ts`.
- Persistence: `supabase/migrations/20260904000000_cornerstone_recaps.sql`; pgTAP checks in `supabase/tests/`; hourly schedule in `vercel.json`.
- Free boundary: monthly recap, current tracker, three months, standard milestones, eligible campus percentile and sharing. Pro adds weekly/full history, selectable ranges, custom milestones and scenario insights. Entitlements are server-derived from Stripe webhook state.
- Verify before beta: apply migration in an isolated Supabase environment; run pgTAP; complete sample/manual/Plaid sandbox E2E; register and replay verified Plaid/Stripe webhooks; test Resend delivery/unsubscribe/dedupe and Stripe cancellation periods; exercise deletion and cross-user isolation.
- Do not count unconfirmed suggestions, internal transfers, trades, dividends, fees, rollovers or reinvestments. Do not add dollar-based campus comparison or financial analytics payloads.

## Discover / market research

- Route: `app/discover/page.tsx`; UI: `components/discover-search.tsx`.
- API: `app/api/research/route.ts` (`GET`, optional `symbol` query).
- Provider: `lib/providers/market.ts`; fixtures: `lib/sample-data.ts`.
- Current UI reads `?q=`, filters curated research by text/category/saved state, expands explanations and saves bookmarks locally. Profile suggestions are explicitly hypothetical. The country-risk example now states the concentration lesson directly and labels both U.S. and non-U.S. exposure in plain language. It does not call the research endpoint.
- API can use Finnhub when configured; otherwise returns sample items. Quotes exist in the adapter but are not consumed by the current portfolio pages.
- Verify: loading/error/empty states when added, source links, correct timestamps, sample/live distinctions, query handling and provider failures.

## Learn

- Routes: `app/learn/page.tsx`, `app/learn/[slug]/page.tsx`. Content: `lib/lessons.ts`; UI: `components/learning-library.tsx`, `components/lesson-reader.tsx`, `components/growth-calculator.tsx`.
- Shared styles: lesson selectors in `app/globals.css`.
- Current state: six complete lessons, multiple-choice checks, correct-answer completion, local progress, filters and next-lesson navigation. The hypothetical calculator uses deterministic `lib/learning-tools.ts` and labels its assumptions.
- Legacy reference: Learn and Foundation sections of `index.html`.
- Verify: actual lesson destinations, accessible interactions, mobile cards, educational—not individualized trading—content.
- Do not import legacy gamification automatically.

## Assistant

- Route: `app/assistant/page.tsx`; UI: `components/assistant-client.tsx`.
- Endpoint: `POST /api/ai/explain` in `app/api/ai/explain/route.ts`.
- Current client uses `lib/demo-assistant.ts` for curated educational answers grounded in shared sample/CSV holdings. Prompt buttons, holding shortcuts and clear conversation work locally; Home also exposes a compact inline entry point using the same answer function. Neither client calls the endpoint.
- Endpoint validates a question, returns an educational refusal for matching trade-instruction terms, otherwise returns a safe fallback. No model call is implemented, even when an API key exists.
- Verify future work: source grounding, uncertainty, refusal behavior, auth/quotas, sensitive-data handling, latency/errors and costs.
- `lib/portfolio.ts` remains the source of financial calculations. Do not move arithmetic into model output.

## Authentication and onboarding

- Pages: `app/sign-in/page.tsx`, `app/onboarding/page.tsx`.
- Components: `components/sign-in-form.tsx`, `components/onboarding-flow.tsx`.
- Auth paths: `POST /api/auth/magic-link`, `GET /auth/callback`.
- Server helper: `lib/supabase/server.ts`; configuration: `lib/env.ts`.
- Connection path: link token, authenticated exchange, encrypted storage, asynchronous sync, verified webhook and revocation routes under `app/api/plaid/`; provider and sync logic in `lib/providers/plaid.ts` and `lib/server/plaid-sync.ts`.
- CSV parser and tests: `lib/csv.ts`, `lib/csv.test.ts`.
- Onboarding saves browser-local profile choices and launches sample data or parses/previews a local CSV (2 MB / 50 holdings). Financial contents stay in memory and clear on reload. A downloadable synthetic CSV is at `public/demo-portfolio.csv`. When configured and signed in, Plaid Link exchanges its token server-side and returns immediately with a visible “Building your history” state while sync continues.
- Link-token requests require an authenticated user. Missing configured services produce fallback/error responses.
- Verify: sign-in success/failure, internal redirect validation, signed-out access, cookie behavior, complete connection lifecycle, CSV limits/errors, and user isolation.

## Settings and account controls

- 2026-10-16: `components/mvp-settings.tsx` uses the shared `components/ui/switch.tsx` for Reduce motion only, updating the existing learning preference. Visible label/description association and regression coverage are retained; other controls and reset dialogs remain native.

- Route: `app/settings/page.tsx`.
- Current state: `components/demo-settings.tsx` edits the local profile, goal, compact layout and demo recap preference. `components/production-recap-settings.tsx` exposes signed-in email/timezone preferences, explicit campus cohort opt-in, connection revocation, Stripe portal access and typed account deletion when services are configured.
- Future backend changes overlap auth, database and security.
- Verify saved preferences, opt-in analytics/notifications, connection revocation and complete deletion. Do not present a successful deletion without executing and checking the approved workflow.

## Shared design, navigation and mobile

- Accessibility regression gate: `components/accessibility.test.tsx` scans five representative flows with development-only axe-core, included in `npm test`/CI. JSDOM contrast is explicitly excluded; use the [browser supplement](ACCESSIBILITY.md). Site/Settings sidebars and the Settings reset dialog now have distinct accessible names. See [handoff](handoffs/2026-10-16-axe-accessibility.md).

- 2026-10-16 shared controls: `components/ui/sheet.tsx` and `switch.tsx`, `lib/utils.ts`, `components.json` and scoped `app/shared-controls.css`. AppShell shares one navigation-content renderer across desktop and the portaled mobile Sheet. Radix owns focus trapping, Escape, modal isolation and scroll lock; breakpoint cleanup focuses the active desktop link. Local reduced motion is passed to both portal layers. Review source/overwrite guidance in `components/ui/README.md` and the [handoff](handoffs/2026-10-16-shadcn-shared-controls.md) before extending this migration.

- `app/layout.tsx`: metadata, fonts, document shell.
- `components/app-shell.tsx`: eight navigation destinations including Recap, active state, local profile/progress and mobile menu with focus containment and Escape dismissal.
- `components/page-header.tsx`: shared title block.
- `app/globals.css`: all current app visual styles, breakpoints, focus states and reduced-motion rules.
- High collision risk: nearly every area uses these files. One task should own shared changes at a time.
- Verify all ten main page routes plus six lesson routes, keyboard focus, mobile menu dismissal, responsive tables/cards, and consistent sample disclosures. Fonts are bundled with licenses in `app/fonts/`.
- Do not replace these with root legacy styles without an explicit migration decision.

## Data model and database

- Domain types and calculations: `lib/domain.ts`, `lib/portfolio.ts`.
- New schema: `supabase/migrations/20260902000000_production_portfolio_model.sql` plus the additive Recap migration `20260904000000_cornerstone_recaps.sql`.
- New objects include portfolio connections, investment accounts, securities, holdings, snapshots, investment transactions, normalized contribution events, immutable recap snapshots, preferences, cohort eligibility, entitlements, delivery claims and provider-webhook claims.
- Earlier migrations: waitlist/auth-policy history; watchlist, metrics, preferences; user profiles, portfolios, progress, health scores and AI suggestions.
- SQL declares ownership/RLS rules; do not infer live policy state or cross-table authorization correctness from that alone.
- pgTAP Recap policy/idempotency tests are checked in under `supabase/tests/`, but no Supabase local configuration is present and the tests/migrations were not run in this task.
- Verify ownership through related records, RLS per operation, constraints, service-role boundaries, encrypted token lifecycle, and migration compatibility in an explicitly approved test environment.
- Prefer new migrations for intentional schema changes; do not rewrite applied history or run destructive SQL as cleanup.

## Deployment, dependencies and observability

- Unused-code review: `npm run knip` and `npm run knip:report` use commented `knip.jsonc`, Next.js plugin defaults, explicit legacy script/style entries and test entries. Findings are advisory and return exit 1 while retained issues exist; this is separate from `npm run check`. No automatic fixes/deletions. Review [the baseline report](reports/2026-10-16-knip.md) before removing historical UI, deferred integrations or shared contracts.

- `package.json`, `package-lock.json`, `tsconfig.json`, ESLint/PostCSS/Next configs.
- `vercel.json` targets Next.js in iad1. `netlify.toml` still publishes the repository root; deployment target needs confirmation.
- `.github/workflows/quality.yml`: Node 24, install, lint, typecheck, tests, build, dependency audit.
- `.github/workflows/codeql.yml`, `.github/dependabot.yml`, `.coderabbit.yaml`: review/security automation definitions; their presence does not prove successful remote execution.
- `instrumentation.ts` and `instrumentation-client.ts`: optional Sentry; client also initializes PostHog with automatic capture and recording disabled.
- `.env.example`: integration variable inventory. `SECURITY.md` and `BETA.md`: release boundaries.
- No deployment, package upgrade, analytics activation, account connection or external invitation is authorized merely by a documentation task.

## Legacy static experience

Entry `index.html` loads Chart.js and Supabase from CDNs, then root scripts. Preserve script order and DOM IDs if explicitly tasked with legacy work.

| Files | Responsibility |
| --- | --- |
| `app.js` | Main DOM interactions, navigation, auth/demo and dashboard behavior |
| `state-manager.js` | Logged-out, demo and logged-in UI state |
| `achievement-queue.js` | Sequenced achievement notifications |
| `onboarding.js` | Legacy budget/goal/risk onboarding |
| `live-market.js` | Simulated market updates |
| `campus-mode.js`, `challenge-mode.js` | Student/campus competition and challenges |
| `ai-coach.js` | Scripted coach responses |
| `dashboard-features.js` | Interactive dashboard extras |
| `settings-utils.js`, `loading-states.js` | Settings helpers and loading/transition UI |
| `styles.css`, `new-features.css`, `enhanced-features.css`, `dashboard-redesign.css`, `new-ui-features.css`, `cyberpunk-theme.css` | Layered legacy styles in that load order |

Historical references: `.bolt/prompt`, `UX_IMPROVEMENTS_SUMMARY.md`, and the deployment ZIP. The archive was inventoried, not executed or treated as active source. Legacy social-proof figures, simulated returns and coach advice are not verified facts or current product requirements.

## Social / campus community

- Route: `app/social/page.tsx`; UI: `components/social-leaderboard.tsx`.
- Sidebar includes Social. Six fictional profiles retain the legacy name/college/strategy concept, with simulated season-return ranking.
- Local name/college search, strategy filters, native expandable profiles and local follow/unfollow are implemented. Following persists in this browser only; there are no public identities, notifications or live rankings.
- Shared dependencies: `components/app-shell.tsx`, `app/globals.css`.
- Discover's `components/profile-suggestions.tsx` adds two explicitly hypothetical exposure scenarios and issuer-linked international ETF examples, not real personalized analysis.
- Discover accepts `?q=` and initializes its curated research search. Research remains disconnected from the provider API.

## Portfolio visual exploration — 2026-09-03

- `components/portfolio-holdings.tsx` and its CSS module now own the Portfolio summary, interactive SVG donut, holding details and table.
- `app/portfolio/page.tsx` renders DemoPortfolio, which consumes the shared sample/CSV snapshot. Shared financial calculation code remains unchanged.
- Chart slices and legend support hover/focus previews and click/keyboard selection; Show all and Escape reset. Holding details link to Discover with `?q=`.
- Empty/zero-value allocations are guarded in rendering and tested; CSV preview and sample restoration share the same chart and table.
- Discover suggestions now use `profile-suggestions.module.css` for local styling and plain-language example buttons. Social remains unchanged by this pass.

## Home story and attribution — 2026-09-10

- Narrative helper and tests: `lib/money-story.ts`, `lib/money-story.test.ts`.
- Home presentation: `components/home-dashboard.tsx`, `components/home-dashboard.module.css`.
- Portfolio handoff: `/portfolio#movement`, `components/portfolio-movement.tsx`, `components/portfolio-movement.module.css`; selection shared with `components/portfolio-holdings.tsx`.
- Preserve previous-close labels until real weekly history exists. Rank losses by dollar contribution on negative periods and describe positive offsets explicitly. Never infer news causation or mix contribution deposits with investment returns.
- The lead Home headline uses an explicit “today” timeframe for the latest previous-close move. At an absolute daily move of 5% or more it switches to “A bigger move up/down today.”

## Home restoration — 2026-09-10

Home again uses its original component and global styles; `home-dashboard.module.css` was removed. `lib/money-story.ts` remains used by Portfolio movement only. The Home redesign described above was reverted at the user's request.

## Learning-first MVP — 2026-10-12

Current ownership:
- Home/onboarding: components/home-dashboard.tsx, onboarding-flow.tsx and shared mvp-ui.tsx selectors.
- Learn: lib/lessons.ts and lesson-activities.ts; components/lesson-reader.tsx, lesson-interaction.tsx, lesson-visual.tsx, learning-library.tsx and daily-review.tsx. The free calculator lives only in the fees-and-time lesson at #calculator.
- Local state: lib/learning-progress.ts, browser-store.ts and components/mvp-provider.tsx. Versioned migration, bounded/idempotent rewards, timezone-based days, storage-event subscription and visible session fallback.
- Paper practice: lib/practice.ts and components/practice-workspace.tsx; separate from DemoProvider holdings. PortfolioWorkspace provides the sample/CSV secondary mode.
- Recap: components/learning-recap.tsx and lib/learning-share.ts. Only real local activity and explicitly selected nonfinancial sharing.
- Research: lib/research.ts is the single catalog, consumed by Discover and the retained suggestion component.
- Appearance/accessibility: app/mvp.css, components/app-shell.tsx, PageHeader and shared mvp-ui. Mobile dialog isolates background content and restores focus.
- Deferred features: lib/features.ts; Recap and Settings retain connected components behind NEXT_PUBLIC_CONNECTED_FEATURES_ENABLED. DemoProvider skips contribution requests when disabled.
- Attribution: lib/portfolio.ts movementSummary, consumed by money-story.ts and briefings. lib/presentation.ts owns formatting/source labels/stable asset colors.
- Legacy static files and external integrations are preserved. No database migration or real order interface was added.

Use the 2026-10-12 learning-first handoff for test results and release limits; earlier area descriptions are historical where they conflict.

## Four-page follow-up — 2026-10-12
- Inspect-first Portfolio: components/portfolio-workspace.tsx. The pie precedes CSV import.
- Restored Social: app/social/page.tsx mounts the unchanged components/social-leaderboard.tsx.
- Research workspace: components/stock-researcher.tsx, stock-price-chart.tsx and lib/stock-research.ts. Hosted provider chart is separate from authored example curves/panels. Search accepts known examples and sanitized custom tickers; URL q follows selection.
- Split Home: components/home-dashboard.tsx and lib/home-overview.ts. The compact map reads existing completions. Sample/CSV and paper practice remain separate, cash is included in practice allocation, and period availability is explicit.
- Scoped styling: app/research-home.css, imported by layout. No edits to the Learn experience.

## Portfolio, Recap and Cornerstone+ — 2026-10-12

- Portfolio narrative and rotation: components/portfolio-movement.tsx and its CSS module; shared code-native brand artwork in components/cornerstone-mark.tsx.
- Recorded-cost growth, monthly boundary validation and authored example: lib/portfolio-insights.ts, with domain tests. Existing portfolio calculations remain unchanged.
- Holdings exploration and numeric styles: components/portfolio-holdings.tsx and its CSS module. Native buttons support keyboard detail navigation; the table scrolls within its container at all widths.
- Portfolio Recap: components/portfolio-recap.tsx and app/portfolio-polish.css. app/recap/page.tsx retains the connected branch. components/learning-recap.tsx supports embedding its existing history/sharing below the main card.
- Future plan concept: components/cornerstone-plus-preview.tsx, mounted in Assistant's sidebar. No service, checkout or analytics integration.
- Latest scope and validation: handoffs/2026-10-12-portfolio-recap-plus.md. No Learn, Social, Discover, Home or legacy behavior changed in this pass.

## Dark surfaces and Recap attribution — 2026-10-13

- Home's portfolio card is dark, with a large dark View portfolio link directly beneath its pie. Learn's introduction has a bold headline, a dark card and a prominent lesson action; lesson content and progress behavior are unchanged.
- Portfolio's price-change inset is visually emphasized, its allocation header/chart share a dark surface, growth sits below the ring and the center contains only value/context. Holdings have dark raised rows and explicit Explore buttons, with scoped green/red text and keyboard selection.
- Recap adds the three largest absolute price contributors and a source-derived Last updated label. Saved practice attribution reconstructs holdings from orders before the last price advance, excluding later trades; its period remains a simulated week. A brief status pulse is decorative, not evidence of live data, and respects reduced motion. Example-month previews have no invented per-stock attribution.
- Ownership: lib/recap-movers.ts and its tests, existing home-dashboard/learning-library/portfolio-holdings/portfolio-recap components, portfolio CSS modules and app/portfolio-polish.css. See handoffs/2026-10-13-dark-surfaces-recap-movers.md.


## Grant Phase 1 cleanup — 2026-10-19

- Four-item navigation and account access: components/app-shell.tsx. Hidden routes remain present.
- Single-tile-per-lesson Home map and dated summary: components/home-dashboard.tsx, lib/home-overview.ts. Progress source remains MvpProvider/learning-progress.
- Folded recap, prominent mode selector and required CSV price date: components/portfolio-workspace.tsx; embedded presentation: portfolio-recap.tsx. PortfolioHoldings owns the only allocation donut.
- Guided Q&A: components/assistant-client.tsx reads DemoProvider holdings, keeps per-answer date/source, and does not mount CornerstonePlusPreview.
- Provider-only research surface: stock-researcher.tsx; lifecycle guard and chart date guidance: stock-price-chart.tsx. Authoring fixtures and old panels remain in source history.
- Source/date helpers: lib/presentation.ts and practice.ts. Small visual overrides: app/grant-cleanup.css; neutral loss styling also updates existing portfolio/Tremor modules.
- Verification and complete changed-file list: [handoff](handoffs/2026-10-19-grant-phase-1-cleanup.md). No lesson-content, dependency or weekly-loop implementation changes.


## Grant Phase 2 weekly loop — 2026-10-19

Home Pro view Step E: proView defaults false in components/demo-provider.tsx's existing preference schema, stored in cornerstone-demo-v1. components/mvp-settings.tsx exposes the Switch. Home's CSS module scopes the dark compact variant; home-pro-holdings.tsx renders existing contribution dollars and portfolio-start-value contribution percentages. WeeklyTugChart has an optional compact flag without changing its default. Integration coverage: components/home-pro-view.test.tsx. See handoffs/2026-10-19-home-weekly-step-e.md.

Home replay/share Step D: components/weekly-story.tsx with scoped weekly-story.module.css uses the installed Radix Dialog for four-card navigation and modal focus management. weekly-share-preview.tsx draws/export the local canvas; learning-wall-snapshot.tsx is static and never touches animation receipts. lib/weekly-share.ts owns privacy-safe export models, snapshot geometry and PNG drawing; weekly-weather-art.ts shares original SVG paths with both browser SVG and canvas. Tests: weekly-story.test.tsx and weekly-share.test.ts. See handoffs/2026-10-19-home-weekly-step-d.md.

Home wall Step C: components/learning-wall.tsx and learning-wall.module.css; lib/stone-wall.ts owns seeded appearance and animation receipts under cornerstone-wall-seen-v1. Progress remains learning.completed/events from MvpProvider; no new progress store. Home waits for history loading and chart animation before the visible wall lays new stones, with saved/device reduced motion. components/use-weekly-portfolio.ts now checks completion receipt lessonId against the current recommendation; Home also verifies actual learning completion. Tests: learning-wall.test.tsx and weekly-loop.test.tsx. See handoffs/2026-10-19-home-weekly-step-c.md.

Home chart Step B: components/weekly-tug-chart.tsx and weekly-tug-chart.module.css render supplied positions as a native SVG/CSS diverging chart, with absolute ranking, dated keyboard/hover/tap tooltips and screen-reader list. Animation respects both prefers-reduced-motion and the existing saved preference. Regression tests: components/weekly-tug-chart.test.tsx. Home mounts the chart keyed to the existing week identity; no new financial arithmetic or provider calls. See handoffs/2026-10-19-home-weekly-step-b.md.

Home editorial Step A: components/home-dashboard.module.css scopes the front page; components/weekly-weather.tsx supplies static accessible SVG weather; lib/weekly-editorial.ts owns named presentation thresholds, edition dates and trimmed deterministic copy, tested by lib/weekly-editorial.test.ts. Shared arithmetic and weekly completion are unchanged. Details: handoffs/2026-10-19-home-weekly-step-a.md.

- Holdings schema/CSV/JSON validation and local identity: lib/saved-holdings.ts; existing CSV row parsing is reused without trusting file prices.
- Browser persistence, request cancellation, shared snapshot and weekly completion: components/use-weekly-portfolio.ts, consumed by DemoProvider. Store: cornerstone-holdings-v1.
- Typed historical response and authored dated sample: lib/historical-data.ts and sample-history.ts. Server-only getHistoricalCloses provider adapter: lib/server/historical-closes.ts. Bounded endpoint: app/api/prices/history/route.ts; private server key: TWELVE_DATA_API_KEY.
- Deterministic common-date arithmetic, copy, weekly identity and lesson selector: lib/weekly-portfolio.ts. PortfolioSnapshot carries its week period/start/provider so existing Portfolio and Q&A math uses the same dates.
- Minimal Home: components/home-dashboard.tsx. Reusable inputs: holdings-input.tsx; source banner: week-source.tsx; Portfolio management: portfolio-workspace.tsx. Scoped CSS extends app/grant-cleanup.css.
- Existing lesson player receives a weekly-entry flag and records completion only after its original lesson/quiz completes; lesson source content remains protected.
- Tests and setup/remaining limits: [Phase 2 handoff](handoffs/2026-10-19-grant-phase-2-weekly-loop.md). Earlier memory-only CSV notes and Home map guidance are superseded for the active loop.
