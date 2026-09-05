# Cornerstone Finance — project context

Last inspected: 2026-09-04. This is the permanent project briefing, not a chat transcript.

## Start here

1. Read this file and [current state](docs/project/STATUS.md).
2. Find the task's files and dependencies in [area map](docs/project/AREAS.md).
3. Inspect those files and the current Git status before proposing or making changes.
4. Use the [work-session guide](docs/project/WORKFLOW.md) and leave a [handoff](docs/project/handoffs/TEMPLATE.md) when work changes the project or remains unfinished.

Code describes what exists. This file records durable intent and boundaries. STATUS records dated observations, not guarantees. A new user request can change direction; document that change instead of silently relying on old chat history.

## Purpose and direction

Cornerstone is a financial-literacy and portfolio-research website for emerging investors. The current Next.js app emphasizes understandable, sourced portfolio briefings, holdings, research, and learning. It is educational and read-only, not a trading service.

The repository also preserves an older student-focused, competitive investing experience with campus leaderboards, challenges, progression, marketing, and simulation. Those features are not all implemented in the new app. Their removal, migration, or redesign requires an explicit task.

The user wants this repository to remain the source of truth across shorter, focused work sessions. Do not require a full retelling of the project in each new chat.

## Which website is which?

- **Current local npm application:** Next.js App Router in `app/`, React components in `components/`, shared logic in `lib/`.
- **Legacy static website:** root `index.html`, `app.js`, other root JavaScript files, and six root CSS files. They are not imported by the Next.js application.
- **Deployment uncertainty:** `vercel.json` targets Next.js; `netlify.toml` retains a root-directory static publish configuration. The actual public deployment and active domain were not verified.
- Do not move, delete, or consolidate either implementation just to tidy the repository. Existing relative asset paths and legacy behavior must remain intact.

## Stack and commands

Use npm and the existing lockfile. Node 24 is used by the checked-in CI configuration and was available during inspection.

| Item | Inspected lockfile version |
| --- | --- |
| Next.js | 16.3.4 |
| React / React DOM | 19.2.8 |
| Tailwind CSS | 4.3.3 |
| TypeScript | 6.0.3 |
| Vitest | 4.1.11 |

Versions are observations, not a request to upgrade. Several package declarations use `latest`; inspect the lockfile again before dependency work.

Run from the repository root:

- `npm run dev`: local Next.js development server.
- `npm run lint`: ESLint; current configuration excludes root legacy JavaScript.
- `npm run typecheck`: TypeScript checks.
- `npm test`: portfolio, CSV import, educational calculator, demo-guide, recap, share-privacy, webhook-signature and entitlement unit tests.
- `npm run build`: production Next.js build; interface fonts are bundled locally.
- `npm run check`: lint, typecheck, tests, and build.
- `npm ci`: reproduce dependencies when installation is necessary; do not reinstall for documentation-only work.

Read the relevant installed Next.js guide under `node_modules/next/dist/docs/` before writing Next.js code, as required by AGENTS.md.

## Design baseline — preserve unless the task changes it

The current student demo uses a green-and-paper palette with bright lime, purple and gold accents, large plain-language headings, a dark fixed desktop sidebar and collapsible mobile navigation. Inter and Newsreader are bundled in `app/fonts/` with their licenses. The implementation source is `app/globals.css`, `app/layout.tsx`, and `components/app-shell.tsx`.

Keep clear sample/delayed-data labels, accessible labels and focus states, responsive layouts, legible financial figures, and educational language. Do not describe simulated figures or fixture headlines as verified live information.

The historical `.bolt/prompt`, legacy CSS, and `UX_IMPROVEMENTS_SUMMARY.md` describe earlier designs. They are historical references, not proof that the current Next.js implementation follows those rules. Ask before reconciling the conflicting visual/product directions.

## Do not break

- Sample browsing without an account and the existing route/navigation structure.
- Deterministic portfolio arithmetic, allocation totals, and source/freshness metadata.
- Passwordless sign-in and safe internal return navigation where configured.
- Read-only portfolio access: no trading or transfer permissions.
- Server-side credentials; never expose service-role keys or Plaid tokens to browsers.
- The security and release controls in [SECURITY.md](SECURITY.md) and beta gates in [BETA.md](BETA.md).
- User work already present in the checkout, including untracked files.
- Existing functionality outside the specific authorized task.

Security documents describe required controls; their existence is not evidence that every control is implemented or audited.

## Architecture and API boundaries

`components/demo-provider.tsx` shares a sample or in-memory CSV portfolio across Home, Portfolio and Assistant. It also exposes sample contribution history, then swaps to authenticated contribution records when the production API is available. Arithmetic remains in `lib/portfolio.ts` using types in `lib/domain.ts`. Browser-local preferences store the demo profile, lesson completion, follows, saved research and compact layout. Financial CSV contents are never stored in localStorage and clear on reload.

Client UI components handle navigation, expansion, search, onboarding, sign-in, and assistant interaction. Provider adapters and auth helpers live in `lib/providers/` and `lib/supabase/`; API handlers live in `app/api/`.

Supabase migrations include both legacy tables and a newer portfolio model. No migration application or live database state was verified. The UI is not wired to server-persisted holdings. Learn contains six complete lessons, quizzes and a hypothetical growth calculator; the Assistant uses curated educational responses, not an external model.

Optional integrations: Supabase, Plaid Investments, Stripe, Resend, Finnhub, Sentry, and PostHog. `OPENAI_API_KEY` is declared but no external AI model call is implemented. Read [area map](docs/project/AREAS.md) before connecting anything.

Environment variable names are in `.env.example`. Do not put credentials, user financial data, imported CSV contents, or sensitive logs in context documents. Optional blank values are not always equivalent to absence: the encryption-key schema requires at least 32 characters when set.

## Working independently

Choose one area per task. Shared files such as `app/globals.css`, `components/app-shell.tsx`, `lib/domain.ts`, `lib/sample-data.ts`, package files, and migrations require coordination.

Separate chats do not provide file isolation. Do not run overlapping write sessions against the same checkout. For separate worktrees, first ensure the intended code and these context files are present in the starting state; the modernization was largely uncommitted at inspection. A worktree from committed main alone would omit it.

Keep this file compact. Update area details in AREAS, dated findings in STATUS, and task-specific results in one uniquely named handoff. Do not turn this file into a log.

## Campus product direction — 2026-09-03

The user explicitly wants the student social experience retained in the current app: profiles with names, colleges and investment strategies in leaderboard form. The new Social route restores this concept as a fictional-data preview; real community publishing and ranking infrastructure is not yet implemented. Discover also includes a placeholder for future portfolio-aware educational research suggestions.

## Cornerstone Recap direction — 2026-09-04

Cornerstone Recap makes confirmed external contributions the motivating number. Home says **Your month so far** and the monthly recap celebrates consistency, milestones and plain-language learning without rewarding portfolio size, returns or trading. Purchases, sales, dividends, reinvestments, fees, rollovers and internal transfers do not count. Plaid activity is suggested first and affects totals only after user confirmation; manual activity is editable and removable.

Monthly recaps, three months of history, standard milestones, eligible campus consistency percentiles and private share cards are free. Cornerstone Pro is $4.99 monthly or $39.99 yearly with a 14-day trial and adds weekly recaps, full available history, contribution trends, user-selected ranges, custom milestones and user-controlled future scenarios. The monthly headline must remain free.

Campus comparison is opt-in and compares contributing months only. It requires a verified school domain, six complete months of eligible history and at least 30 eligible verified users. Return only the user percentile and a cohort-size band; never expose names, balances, amounts or recap rankings. Share cards hide dollar amounts on every fresh render and downloads must match the visible state.

The repository contains a complete sample flow plus guarded Supabase, Plaid, Stripe and Resend interfaces. This is not evidence that the migration is applied, credentials are configured, webhook endpoints are registered or live integration checks passed. Follow the staged gates in [BETA.md](BETA.md) before external use.
