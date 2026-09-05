# Site area map

Read [PROJECT.md](../../PROJECT.md) first. These boundaries are for scoping work; they are not permission to change shared dependencies.

## Dashboard and portfolio

- Routes: `app/page.tsx`, `app/portfolio/page.tsx`.
- UI: `components/home-dashboard.tsx`, `components/demo-portfolio.tsx`, `components/portfolio-holdings.tsx`.
- Dependencies: `lib/domain.ts`, `lib/portfolio.ts`, `lib/sample-data.ts`, shared shell and CSS.
- API: `GET /api/briefings` returns a sample briefing, not a user's saved portfolio.
- Tests: `lib/portfolio.test.ts`.
- Current boundary: shared demo-provider sample/CSV state and deterministic values; no server persistence or connected-account feed.
- Verify: arithmetic and allocations, expansion controls, holdings table, empty/zero-value behavior for any new data path, source labels, mobile layout.
- Coordinate financial contract changes with data/API work.

## Cornerstone Recap

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
- Current UI reads `?q=`, filters curated research by text/category/saved state, expands explanations and saves bookmarks locally. Profile suggestions are explicitly hypothetical. It does not call the research endpoint.
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
- Current client uses `lib/demo-assistant.ts` for curated educational answers grounded in shared sample/CSV holdings. Prompt buttons, holding shortcuts and clear conversation work locally; the client does not call the endpoint.
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

- Route: `app/settings/page.tsx`.
- Current state: `components/demo-settings.tsx` edits the local profile, goal, compact layout and demo recap preference. `components/production-recap-settings.tsx` exposes signed-in email/timezone preferences, explicit campus cohort opt-in, connection revocation, Stripe portal access and typed account deletion when services are configured.
- Future backend changes overlap auth, database and security.
- Verify saved preferences, opt-in analytics/notifications, connection revocation and complete deletion. Do not present a successful deletion without executing and checking the approved workflow.

## Shared design, navigation and mobile

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
