# Current state

## Cornerstone Recap implementation — 2026-09-04

The current Next.js app now includes Cornerstone Recap on Home and at `/recap`. The synthetic story leads with $240 contributed in September and a three-month streak. A seven-step first-visit monthly recap covers the closed month, streak calendar, milestone, month-over-month change, compounding education, privacy-gated campus comparison and a downloadable share card. Amounts start hidden; the eye control and generated PNG stay synchronized.

The sample workspace supports suggested-activity confirmation/exclusion, manual contributions and withdrawals, duplicate warnings with explicit override, edit/delete controls, three-month free history, Pro history/range/milestone/scenario previews, encouraging zero-month language and visible source labels. Browser checks exercised all recap steps, amount privacy, suggestion confirmation, duplicate handling, manual add/edit/delete controls, Pro expansion and the signed-out billing guard.

Production code now includes normalized contribution records, immutable revisioned monthly/weekly snapshots, server-mediated RLS reads, Plaid Link exchange/encrypted token storage/24-month pagination/webhook verification/revocation, Stripe Checkout/Portal/signature-verified entitlement webhooks, Resend opt-in monthly delivery/unsubscribe/idempotency, campus-domain verification and suppression, private image generation, connection removal and full account deletion. An hourly Vercel job evaluates 9:00 a.m. in each saved timezone. Analytics accepts only a small event-name allowlist with no properties.

The additive migration is `supabase/migrations/20260904000000_cornerstone_recaps.sql`; pgTAP RLS/idempotency cases are under `supabase/tests/`. The production migration has not been applied and Supabase, Plaid sandbox, Stripe, Resend, scheduled delivery and live webhook registration have not been integration-tested because this checkout has no approved configured test services. Do not enable external accounts, billing or email until those checks pass. See [Cornerstone Recap handoff](handoffs/2026-09-04-cornerstone-recap.md).

## Student demo completion — 2026-09-03

The current local Next.js demo has a consistent student-focused visual system and connected interactions across Home, Portfolio, Discover, Social, Learn, Assistant, onboarding, Settings and sign-in. Profile preferences, lesson progress, bookmarks and follows persist in this browser; CSV financial data stays in memory only. Fonts are now bundled locally, removing the build-time Google Fonts dependency. No dependency installation was necessary.

Final `npm run check` passed: lint, TypeScript, 17 tests across three files and production build (23 generated pages). Browser checks covered desktop and 390px layouts, mobile focus/Escape, donut interactions, research/save/filter flows, student following, all six lesson quizzes, calculator controls, preferences/reload/reset, sample launch and invalid/valid synthetic CSV preview through Home/Portfolio/Assistant. All nine main routes and six lesson paths returned 200; unknown lesson displayed the recovery page. The example CSV returned 200.

Sign-in validation and fallback code were checked without sending an email. Real authentication, brokerage linking, database persistence, live prices, real community data and external AI remain unverified or unavailable. No deployment or commit was made for this demo task. See [student demo handoff](handoffs/2026-09-03-student-demo.md). The baseline and earlier task records below are historical.

## Git baseline update — 2026-09-03

The user subsequently authorized committing and pushing the local modernization and project context to GitHub. The commit containing [this handoff](handoffs/2026-09-03-github-baseline.md) captures that shared baseline on main. The uncommitted-state descriptions below are historical observations from the earlier context-only setup. Feature gaps remain unchanged. Local logs and private environment files are excluded from Git.

For the baseline task, lint, TypeScript, all six tests, production build and dependency audit passed (zero dependency findings). The local site returned HTTP 200 on port 3001. No live integration or deployment was performed. Verify remote commit identity before starting a new worktree.

Inspection date: 2026-09-03. Re-check the code and Git state at the beginning of each task.

## Workspace baseline

- Repository: Cornerstone-Finance; remote: `https://github.com/Cheesemystery/Cornerstone-Finance.git`.
- Local checkout at inspection: `C:\Users\abrah\Documents\Codex\2026-09-02\my-website-code-is-in-a\Cornerstone-Finance`.
- Branch: `main`; inspected HEAD: `2b69bd9` (Fix What-If Simulator dark theme).
- Existing tracked modifications: `.gitignore`, `cyberpunk-theme.css`, `package.json`, `package-lock.json`.
- Most Next.js source, configuration, security docs, CI definitions, and the newest migration were untracked before the context setup.
- No existing changes were committed, reverted, moved, or discarded by this context-only setup.
- This folder was not listed as a saved local app project during setup. Add/open this exact repository folder for future site tasks, rather than creating another empty projectless folder.
- Until the modernization and context files are intentionally saved into Git, a fresh clone or worktree from committed main will not contain this local state.

## Implemented versus scaffolded — refreshed 2026-09-03

| Surface | Verified from source |
| --- | --- |
| Home / portfolio | Shared sample or in-memory CSV holdings; deterministic totals, interactive donut, details and briefing |
| Discover | Hypothetical profile scenarios, issuer links, searchable curated research, local bookmarks; no live news feed |
| Social | Six fictional student profiles, simulated rankings, search/strategy filters and locally saved following |
| Learn | Six complete lessons, quizzes, local completion progress and a hypothetical growth/fee calculator |
| Assistant | Curated educational demo guide with current portfolio arithmetic, prompts and chat reset; no model integration |
| Sign-in | Supabase magic-link request/callback code; live service not tested |
| Onboarding | Three-step profile setup, sample launch, local CSV validation/preview/use and honest unavailable-linking dialog |
| CSV parser | Integrated; quoted cells, duplicate/invalid-value checks and bounded import size |
| Plaid | Link-token creation only, not full account linking or sync |
| Settings | Browser-local profile/preferences, compact switch, privacy details and confirmed demo reset |
| Database | Migration files only; deployed schema and policy behavior not verified |
| Monitoring | Optional initialization code; external configuration not verified |

## Important open questions — not approved implementation tasks

1. Which implementation and domain are currently deployed? Confirm before altering hosting or removing legacy files.
2. Which further campus competition features should follow the restored fictional Social preview?
3. When should the new student-demo changes be reviewed and committed? The earlier modernization baseline is already committed.
4. What is the intended end-to-end portfolio import/connection/persistence lifecycle?
5. Which live data providers should replace the explicitly labeled sample portfolio and curated research before beta?
6. What backend must support real account deletion, synced preferences, quotas and integration failures?
7. How will cross-user authorization, provider sync, webhooks and source freshness be tested before external use?

Security and beta release gates remain in SECURITY.md and BETA.md. This source inventory is not a security audit or production-readiness certification.

## Verification record

Context setup changes only Markdown documentation and agent guidance. Baseline checks and documentation validation are recorded in [setup handoff](handoffs/2026-09-03-workspace-context.md).

No live auth email, provider connection, remote database change, dependency installation/upgrade, build deployment or Git push was performed.

## Maintenance

Replace stale statements when behavior changes; date the verification and cite files or tests. Keep unresolved possibilities separate from confirmed behavior. Do not mark a planned feature as implemented just because a page, schema, environment variable or package exists.

## Discover and Social update — 2026-09-03

Discover now includes explicit profile-preview scenarios (U.S.-only and international exposure), issuer-linked VXUS/IXUS research cards, and query-aware sample headline search. Scenarios are not inferred from holdings; the existing sample portfolio already includes VXUS. No live recommendation service was added.

Social is restored as a Next.js route with fictional college profiles, investment strategies, simulated-return rankings, name/college search, strategy filters, and expandable profiles. Legacy files remain untouched. Public profiles and real ranking data remain future work.

Lint, typecheck and production build passed. Browser checks covered both desktop pages, 390px layouts without horizontal overflow, scenario switching, research search, social filters/empty state, profile expansion and mobile navigation. See handoffs/2026-09-03-discover-social.md.

## Discover clarity and Portfolio chart — 2026-09-03

Discover now leads with a large, plain-language takeaway, brighter lime accents, example-profile buttons, and simpler fund cards. Both examples remain explicitly hypothetical.

Portfolio now has an interactive holdings donut, matching holding colors, a total-value/day-change summary, selected holding details, cost-basis gains/losses when available, and links to Discover research. All values derive from the existing sample snapshot and deterministic calculations. The former inactive Connect or import button now links to the existing onboarding page; no new import backend was added.

Validation: lint and typecheck passed; all six existing tests passed; final production build passed. Desktop and 390px mobile layouts inspected; no page-level horizontal overflow. Verified direct slice click, keyboard selection, legend selection, reset/Escape, profile example switching, and research query handoff. An SVG title hydration mismatch was fixed and a fresh page load showed no new hydration error. See handoffs/2026-09-03-discover-clarity-portfolio-chart.md.
