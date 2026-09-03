# Site area map

Read [PROJECT.md](../../PROJECT.md) first. These boundaries are for scoping work; they are not permission to change shared dependencies.

## Dashboard and portfolio

- Routes: `app/page.tsx`, `app/portfolio/page.tsx`.
- UI: `components/briefing-dashboard.tsx`.
- Dependencies: `lib/domain.ts`, `lib/portfolio.ts`, `lib/sample-data.ts`, shared shell and CSS.
- API: `GET /api/briefings` returns a sample briefing, not a user's saved portfolio.
- Tests: `lib/portfolio.test.ts`.
- Current boundary: sample values and some static metrics/timestamps; no persistence or connected-account feed.
- Verify: arithmetic and allocations, expansion controls, holdings table, empty/zero-value behavior for any new data path, source labels, mobile layout.
- Coordinate financial contract changes with data/API work.

## Discover / market research

- Route: `app/discover/page.tsx`; UI: `components/discover-search.tsx`.
- API: `app/api/research/route.ts` (`GET`, optional `symbol` query).
- Provider: `lib/providers/market.ts`; fixtures: `lib/sample-data.ts`.
- Current UI filters fixture headlines locally. It does not call the research endpoint or read the dashboard's `?q=` links.
- API can use Finnhub when configured; otherwise returns sample items. Quotes exist in the adapter but are not consumed by the current portfolio pages.
- Verify: loading/error/empty states when added, source links, correct timestamps, sample/live distinctions, query handling and provider failures.

## Learn

- Route and lesson metadata: `app/learn/page.tsx`.
- Shared styles: lesson selectors in `app/globals.css`.
- Current state: six lesson cards linking to `#`; no lesson detail routes or completion persistence.
- Legacy reference: Learn and Foundation sections of `index.html`.
- Verify: actual lesson destinations, accessible interactions, mobile cards, educational—not individualized trading—content.
- Do not import legacy gamification automatically.

## Assistant

- Route: `app/assistant/page.tsx`; UI: `components/assistant-client.tsx`.
- Endpoint: `POST /api/ai/explain` in `app/api/ai/explain/route.ts`.
- Current client returns local explanatory placeholder text and does not call the endpoint.
- Endpoint validates a question, returns an educational refusal for matching trade-instruction terms, otherwise returns a safe fallback. No model call is implemented, even when an API key exists.
- Verify future work: source grounding, uncertainty, refusal behavior, auth/quotas, sensitive-data handling, latency/errors and costs.
- `lib/portfolio.ts` remains the source of financial calculations. Do not move arithmetic into model output.

## Authentication and onboarding

- Pages: `app/sign-in/page.tsx`, `app/onboarding/page.tsx`.
- Components: `components/sign-in-form.tsx`, `components/onboarding-flow.tsx`.
- Auth paths: `POST /api/auth/magic-link`, `GET /auth/callback`.
- Server helper: `lib/supabase/server.ts`; configuration: `lib/env.ts`.
- Connection path: `POST /api/plaid/link-token`; provider: `lib/providers/plaid.ts`.
- CSV parser and tests: `lib/csv.ts`, `lib/csv.test.ts`.
- Current onboarding choices are local state only. CSV selection displays a filename but neither reads nor parses the file. Plaid link-token creation is present, but Link launch, token exchange, sync, webhook and persistence flows are absent.
- Link-token requests require an authenticated user. Missing configured services produce fallback/error responses.
- Verify: sign-in success/failure, internal redirect validation, signed-out access, cookie behavior, complete connection lifecycle, CSV limits/errors, and user isolation.

## Settings and account controls

- Route: `app/settings/page.tsx`.
- Current state: static preference/status rows; deletion button has no implementation.
- Future backend changes overlap auth, database and security.
- Verify saved preferences, opt-in analytics/notifications, connection revocation and complete deletion. Do not present a successful deletion without executing and checking the approved workflow.

## Shared design, navigation and mobile

- `app/layout.tsx`: metadata, fonts, document shell.
- `components/app-shell.tsx`: six navigation destinations, active state, mobile menu and sample account label.
- `components/page-header.tsx`: shared title block.
- `app/globals.css`: all current app visual styles, breakpoints, focus states and reduced-motion rules.
- High collision risk: nearly every area uses these files. One task should own shared changes at a time.
- Verify all eight page routes, keyboard focus, mobile menu dismissal, responsive tables/cards, and consistent sample disclosures.
- Do not replace these with root legacy styles without an explicit migration decision.

## Data model and database

- Domain types and calculations: `lib/domain.ts`, `lib/portfolio.ts`.
- New schema: `supabase/migrations/20260902000000_production_portfolio_model.sql`.
- New objects: portfolio connections, investment accounts, securities, holdings, snapshots, investment transactions, briefings, alerts, and audit events.
- Earlier migrations: waitlist/auth-policy history; watchlist, metrics, preferences; user profiles, portfolios, progress, health scores and AI suggestions.
- SQL declares ownership/RLS rules; do not infer live policy state or cross-table authorization correctness from that alone.
- No Supabase local configuration or database test suite was found. Migrations were not run.
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
