# Task handoff — Cornerstone Recap

Date: 2026-09-04  
Status: complete locally; production activation gated on configured-service integration tests  
Area: Cornerstone Recap, authentication/onboarding, settings/account controls, data model, providers and shared design  
Checkout / branch / commit: `C:\Users\abrah\Documents\Codex\2026-09-02\my-website-code-is-in-a\Cornerstone-Finance`, `main`, starting HEAD `3051140`; work remains uncommitted with earlier authorized demo changes in the same checkout

## Objective and scope

Implement Cornerstone Recap around confirmed external contributions and investing consistency. Deliver the sample Home/monthly recap/share flow first, then add production-ready Supabase, Plaid, Stripe and Resend boundaries without deploying, applying migrations, sending email, opening checkout or connecting a real account.

## Changes

- Added a feature-flagged Home progress card, seven-step closed-month dialog and `/recap` workspace. The sample story is $240 for September with a three-month streak, a $1,000 next milestone and one suggested $75 deposit awaiting review.
- Reworked the Home hero into three refreshable, data-grounded story variants. Each keeps the message to one headline and one explanation, then routes directly to Portfolio or a ticker-aware Discover search.
- Reworked the Recap hero around a reward loop: current contribution, month-over-month change, milestone progress and streak now read as one celebratory surface. Confirming a contribution can trigger an immediate milestone-unlocked message.
- Replaced the three block bars with an interactive area/line chart and selected-month controls. Moved Pro promotion into the progress flow as locked strongest-week, consistency-trend and custom-milestone teasers; the free monthly headline remains visible.
- Added hidden-by-default private share cards. The eye control updates the protected `ImageResponse` request, so downloaded PNGs match the visible amount state. Public sample URLs contain synthetic data only; real totals require authentication and ownership.
- Added suggestion confirmation/exclusion; manual contribution/withdrawal create, edit and delete; same-amount/two-day duplicate warnings; neutral zero/withdrawal copy; free three-month history; and Pro range, custom milestone, weekly and future-scenario surfaces.
- Added normalized contribution calculations, Plaid sign/subtype handling, canceled/out-of-order record protection, 24-month pagination, asynchronous initial sync, encrypted token storage, verified/idempotent webhooks, visible connection state and provider revocation.
- Added immutable monthly/weekly recap snapshots with calculation version and visible revision; corrections, date moves, cancellations and connection removal rebuild or clear affected state.
- Added Stripe Checkout and Customer Portal adapters, 14-day trial and monthly/annual price selection, verified/idempotent entitlement webhooks and paid-period access after cancellation.
- Added explicit monthly email opt-in, timezone-aware hourly scheduling for 9:00 a.m., signed unsubscribe links, database delivery claims and Resend idempotency keys. Email subject/leading copy contain no amount.
- Added campus verification with `.edu` plus allowlist support, separate explicit cohort opt-in, school-domain-only retention after successful verification, six-complete-month eligibility and 30-person suppression. The response exposes percentile and cohort-size band only.
- Added full account deletion that revokes Plaid, cancels Stripe, deletes the Stripe customer and then deletes Supabase auth data. Connection removal purges connected records and rebuilds remaining manual recap history.
- Added an analytics allowlist that sends only event names and no properties. Added environment inventory and an hourly Vercel schedule.
- Added an additive Recap migration and pgTAP files for RLS isolation, mutation denial, auth cascade, recap-revision uniqueness, webhook-event uniqueness and email-delivery uniqueness.

## Decisions

- Confirmed contributions are the headline; returns, balance, trade count and raw deposits never drive progress.
- A month contributes to the streak when it has at least one confirmed contribution. A withdrawal remains visible but does not erase that month.
- Free keeps the monthly headline, monthly recap, three months, standard milestones, eligible campus percentile and sharing. Pro adds weekly/full history, selectable history windows, custom milestones and scenario insights.
- Campus compares contributing-month counts only. The fictional Social leaderboard remains separate and does not consume recap records.
- Provider suggestions remain inert until confirmation. Direct client writes are revoked; authenticated route handlers mediate mutations with service-role storage.

## Verification

- `npm run check` passed on 2026-09-04: ESLint, TypeScript, 44 Vitest tests across eight files and the production Next.js build. The build generated 39 pages/routes including all Recap, contribution, Plaid, billing, campus, email, deletion and image handlers.
- Browser checks passed for the full seven-step dialog, first-view dismissal, hidden/shown amount state and matching download URL, suggestion confirmation updating $240 to $315, the $1,000 milestone reward, interactive trend/history expansion, embedded locked Pro teasers, future calculator, all three Home story variants and the signed-out checkout guard.
- HTTP checks: sample hidden/shown image routes returned PNG 200; contributions, real share image, billing checkout and cron returned 401 without authentication.
- `ImageResponse` produced both hidden and shown PNGs. The production build completed without remote font access.
- The migration and pgTAP files were not run because this checkout has no local/configured Supabase test project. No Plaid sandbox item, Stripe test customer, Resend email, webhook registration, scheduled job or real account deletion was executed.

## Remaining work / next step

Implementation work for the requested local feature is complete. Before production release, use an isolated configured environment to apply the migration and run `supabase/tests/`, then complete the staged sample/manual/Plaid sandbox, Stripe, Resend, webhook replay, cross-user RLS, revocation and deletion checks in `BETA.md`. Do not enable external billing/email or campus results before those gates pass.

## Coordination

Recap touches shared `app/globals.css`, navigation, Home, onboarding, Settings, environment configuration, providers, migrations and project context. The checkout also contains earlier authorized uncommitted student-demo, Discover, Social, Learn, Assistant and Portfolio work; preserve it. No commit, push, migration application, deployment or external side effect was performed in this task.
