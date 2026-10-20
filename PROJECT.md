# Cornerstone Finance — project context

## Home Pro view — 2026-10-19, Step E

Settings has a Pro view switch, off by default, persisted as proView in the existing cornerstone-demo-v1 preferences. It changes only the main Home content to compact dark forest panels and monospaced tabular figures; masthead/headline lettering retains Newsreader. Home keeps its chart, lesson action, wall and replay, and adds a dated native holdings table. Contribution % means holding contribution divided by the portfolio's starting value, shown to three decimals; totals use existing unrounded weekly values. This is separate from each holding's own price-return percentage. Other pages, replay/share artwork, lesson content and weekly arithmetic are unchanged. Step F and AI narration remain deferred. See docs/project/handoffs/2026-10-19-home-weekly-step-e.md.

## Home replay/share — 2026-10-19, Step D

Home's secondary Replay your week action opens a full-screen four-card Radix dialog: dated weather/result, arithmetic driver, existing weekly lesson, and static wall snapshot/share. Snapshot data stays consistent while open; navigation supports tap halves, touch swipe, arrows, dots and Escape with focus trapping/restoration. Canvas creates a local 1080×1350 PNG using the existing fonts and shared weather/stone geometry. Each fresh share preview hides dollar amounts and holding tickers; explicit Include dollar amounts adds only the weekly total and main driver ticker/contribution. Price and cumulative learning dates are separate. Download matches the visible canvas; file Web Share appears only when supported. Replay/static wall never awards progress or consumes animation receipts. No new dependency, AI narration or other-page changes. E Pro view and F state polish remain deferred. See docs/project/handoffs/2026-10-19-home-weekly-step-d.md.

## Home Weekly direction — 2026-10-19, Steps A–C

The current Home is the editorial Cornerstone Weekly: dated deterministic result/weather, SVG contribution chart, one related-lesson action, then a cumulative drystone wall. The catalog and cornerstone-learning-v1 completion IDs/events drive stone count and laid dates; older undated records stay undated. cornerstone-wall-seen-v1 stores only last-seen animation receipts, never financial data or a second progress total. Existing progress is adopted quietly on the first visit; new stones lay once, sequentially when visible, after the chart entrance, respecting saved/device reduced motion. Weekly done requires a matching current recommended-lesson receipt plus actual learning completion. Repeating a previously completed lesson can finish the week without adding another catalog stone. No XP/streak counters or Continue learning row on Home. First-paycheck/new-grad positioning is the current user direction; AI narration, replay/share, Pro view and remaining state polish are deferred to later requested steps. See docs/project/handoffs/2026-10-19-home-weekly-step-c.md.

## Latest implemented grant scope — 2026-10-19, Phase 2

The weekly loop is implemented: Home shows one dated portfolio price-change result and deterministic driver/offset explanation, links to a relevant existing lesson, then persists done for the calendar week. Main navigation remains Home, Learn, Portfolio, Ask. This current direction supersedes older broad Home and memory-only CSV directions below. Canonical ticker/share holdings (optional total cost basis) and weekly completion persist in cornerstone-holdings-v1; raw files and submitted file prices do not. Learning/practice/preferences keep their separate existing stores. Input is CSV, manual or explicit sample, with holdings-only JSON export/import.

Historical closes go through the server-only getHistoricalCloses function and POST /api/prices/history; only tickers/date bounds/sample choice are sent. TWELVE_DATA_API_KEY is server-only; no key means one fully labeled, dated sample dataset. All holdings use the same start/end dates, with start at least seven calendar days before the latest shared close. Math is deterministic and uses saved share counts at both closes. Linked weekly completion does not duplicate lifetime lesson XP and reopens Monday in the saved timezone. No live provider key is configured or integration-verified; no external launch is implied. Lesson content and package files are unchanged. See docs/project/handoffs/2026-10-19-grant-phase-2-weekly-loop.md for full verification, setup and limits.


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
- `npm run test:a11y`: development-only axe structural checks for representative UI flows; included in normal tests. Supplement with the real-browser checks in [the accessibility guide](docs/project/ACCESSIBILITY.md).
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

## Shared controls foundation — 2026-10-16

The first shadcn/ui migration introduces local Sheet and Switch components in `components/ui/`, backed by pinned Radix primitives and the current `cn` helper. Mobile navigation uses Sheet; Settings' Reduce motion uses Switch. Scoped `app/shared-controls.css` preserves the existing green/paper design and fonts. Future generated additions must be reviewed before applying them; do not run a broad theme initializer or overwrite global styles. Other controls/dialogs remain unchanged. Source provenance and review guidance are in `components/ui/README.md`.

Portfolio and Recap share a source-adapted Tremor Raw BarList in `components/tremor/`, with retained Apache-2.0 license and scoped brand styles. It reuses the existing `cn` helper and native interactions without adding packages. Only decorative lengths use contribution magnitudes; signed values, page-specific ranking, source labels and missing-history states remain authoritative. Review `components/tremor/README.md` before extending it.

## Campus product direction — 2026-09-03

The user explicitly wants the student social experience retained in the current app: profiles with names, colleges and investment strategies in leaderboard form. The new Social route restores this concept as a fictional-data preview; real community publishing and ranking infrastructure is not yet implemented. Discover also includes a placeholder for future portfolio-aware educational research suggestions.

## Cornerstone Recap direction — 2026-09-04

Superseded for the visible Recap experience by the student pace direction below. Historical contribution, streak and campus implementation details remain as backend context.

Cornerstone Recap makes confirmed external contributions the motivating number. Home says **Your month so far** and the monthly recap celebrates consistency, milestones and plain-language learning without rewarding portfolio size, returns or trading. Purchases, sales, dividends, reinvestments, fees, rollovers and internal transfers do not count. Plaid activity is suggested first and affects totals only after user confirmation; manual activity is editable and removable.

Monthly recaps, three months of history, standard milestones, eligible campus consistency percentiles and private share cards are free. Cornerstone Pro is $4.99 monthly or $39.99 yearly with a 14-day trial and adds weekly recaps, full available history, contribution trends, user-selected ranges, custom milestones and user-controlled future scenarios. The monthly headline must remain free.

Campus comparison is opt-in and compares contributing months only. It requires a verified school domain, six complete months of eligible history and at least 30 eligible verified users. Return only the user percentile and a cohort-size band; never expose names, balances, amounts or recap rankings. Share cards hide dollar amounts on every fresh render and downloads must match the visible state.

The repository contains a complete sample flow plus guarded Supabase, Plaid, Stripe and Resend interfaces. This is not evidence that the migration is applied, credentials are configured, webhook endpoints are registered or live integration checks passed. Follow the staged gates in [BETA.md](BETA.md) before external use.

## Home briefing direction — 2026-09-10

Home now prioritizes one money story and one primary link into Portfolio’s contribution breakdown. Contributions and one educational concept are secondary; the automatic recap modal and competing promotional links no longer mount on Home. Losses remain visible with neutral styling and educational context. Use the same presentation in positive and negative periods.

Current snapshots contain only previous-close comparisons. Label them “Latest available change”; do not describe them as weekly returns, invent longer-term performance, promise scheduled refreshes, or infer price causation from news. Portfolio distinguishes arithmetic attribution from related reporting and links externally to Yahoo Finance when a holding is selected.

## Home layout restored — 2026-09-10

The user preferred the previous Home UI and requested its restoration. The original Home component is restored, including its hero, recap card/modal, statistics, briefing and community sections. This supersedes the Home redesign direction above. The new Portfolio contribution breakdown remains in place.

## Student pace direction — 2026-09-15

The user approved a calmer Recap because full-time students can have irregular income and cannot be expected to contribute monthly. Recap now leads with portfolio understanding and optional learning. Contribution totals and dated activity are neutral records; do not show streaks, monthly up/down contribution badges, campus contribution rankings or missed-month pressure. Goals are optional and have no deadline, with pause and removal controls. The current optional target is session-only and labeled accordingly.

Home's recap entry follows this direction and no longer opens an automatic monthly slideshow. Sharing is deliberate, hides amounts on a fresh preview and uses neutral language. Paid scenario exploration is available behind a disclosure. Existing financial arithmetic, server entitlements and account controls remain in place; the prior cadence-focused product goals are not the design baseline.

## Learning-first MVP direction — 2026-10-12 (current)

This direction supersedes the older Home, contribution-Recap and fictional leaderboard directions above. Cornerstone introduces college students to investing through short interactive challenges, gentle daily learning, and guided paper practice. Keep the current Next.js stack, green/paper identity, existing URLs, and all eight tabs.

Home owns the daily invitation; Learn owns lessons, reviews and the free fees/time calculator; Portfolio owns fixed fictional-money scenarios and secondary sample/CSV inspection; Recap owns actual local learning/reflection history; Discover owns the research catalog; Social is a clearly labeled future-feature preview; Assistant owns curated question answering; Settings owns preferences and data controls. No fabricated users, live prices, news causation, guaranteed recovery, or launch claims.

Learning is stored under cornerstone-learning-v1 with a saved timezone, resumable lesson step, unique rewards, daily goal and optional gentle streak. Valid legacy completions migrate without invented historical dates. Fictional cash, orders and checkpoints use a separate cornerstone-practice-v1 store. Existing imported holdings stay in memory. Browser storage failure is visible and retains working session state.

Paper buys/sells are explicitly authorized educational simulation, with no brokerage connection or real-money execution. Real brokerage trading and transfer permissions remain prohibited. Fixed scenario definitions are version 1; do not silently revise their prices for existing runs.

NEXT_PUBLIC_CONNECTED_FEATURES_ENABLED defaults false. Leave account, contribution, email and billing promotion deferred; their code is retained for a later integration phase. Guest learning requires no API keys. Optional analytics remain inactive without keys and accept only event names, never answers, financial values or identity properties.

Next.js and its lint configuration were patched from 16.3.4 to 16.3.8 for published security findings. Production transitive fixes remain within existing dependency ranges. No template code, external assets or template-wide dependencies were borrowed. New graphics are code-native.

## Portfolio, Social, Discover and Home follow-up — 2026-10-12 (current)

The user requested four bounded changes after the learning-first MVP:
- Portfolio now opens with Inspect sample first and selected; CSV controls follow the portfolio chart/details. Fictional-money practice remains available.
- Social restores the previous illustrative leaderboard page and its unchanged placeholder component, including profiles, returns, filters and local follow controls. This supersedes the text-only Social preview direction; no real community service is enabled.
- Discover is a mini stock researcher. The TradingView Advanced Chart widget is a free hosted embed with attribution and no API key. Its data availability/delay is provider-controlled. News, business relationships, key figures and heat signals remain explicitly labeled authored examples until sources are connected. Old stock/fund query links and saved educational explainers remain usable.
- Home has a compact completion-grid link to Learn on the left, with a portfolio pie, available period changes and a personalized local recap on the right. Sample/CSV remains the default; an existing paper run can be viewed separately. Missing weekly history is shown as unavailable; simulated weekly changes use saved checkpoints. The recap uses local deterministic selectors until an AI service is connected.

The Learn path/player, rewards, Recap, Assistant, Settings, original portfolio calculations, legacy site and dependency set are unchanged by this follow-up. Source details and verification are in the research/home follow-up handoff.

## Portfolio, Recap and Cornerstone+ direction — 2026-10-12

Portfolio leads with a prominent source-labeled Cornerstone narrative and rotating, pausable headings. Growth versus recorded cost is separate from previous-close price change. Recap prioritizes a large dark portfolio card: actual monthly performance requires dated month boundaries, while an explicitly fictional example and saved practice timeline demonstrate the design. Learning history and nonfinancial sharing remain accessible below. Assistant includes a subtle Cornerstone+ future-plan concept without an available subscription. Investor-type image themes remain deferred. This user-requested direction supersedes earlier learning-only Recap guidance. See the portfolio/recap/plus handoff.


## Grant weekly-loop direction — 2026-10-19 (current)

The user is narrowing the grant MVP to “Understand your week in 60 seconds”: one dated portfolio result and arithmetic explanation, a related existing lesson, then a weekly completion state. This supersedes the earlier eight-tab and broad practice/research promotion directions. Work is phased and must stop after each requested phase. Phase 1 cleanup is implemented: primary navigation is exactly Home, Learn, Portfolio, Ask; Settings is reached through the account link, Recap is folded into Portfolio, and unlinked routes/code remain retained. Progress is called lessons and reads the learning store. Donut allocation belongs only to Portfolio. Guided Q&A uses shared sample/imported holdings and retains the not-live-AI disclosure. Keep current identity, date/source every displayed financial figure, use neutral loss colors, and do not mix authored fixtures with provider data. Ask before any dependency addition; lesson content is protected. Weekly market history and completion wiring are not yet implemented. See the Phase 1 handoff for verification and date semantics.
