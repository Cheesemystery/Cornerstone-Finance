# Task handoff — Phase 3 account learning

Date: 2026-11-07
Status: partial — implementation prepared; live integration blocked
Area: learning accounts and passwordless authentication
Checkout: Cornerstone-Finance; uncommitted. Earlier phase changes preserved.

## Scope and outcome
Prepared passwordless account learning behind the new, server-only LEARNING_ACCOUNTS_ENABLED setting (false by default). Guest learning remains fully usable. No service enabled, email sent, live database modified, dependency added, commit created or deployment performed.

## Existing foundation reused
Supabase SSR cookie client and email-link API, current MvpProvider learning schema and six lessons, browser stores, derived building and wall counts, Settings and existing component styles. Old user_progress was inspected: it uses modules/deposit/portfolio-level fields and profile ownership, so it was not repurposed for the current learning record.

## Changes and decisions
- Shared internal-path validation rejects external/protocol-relative, backslash, malformed and encoded redirect destinations. Magic-link submissions check origin; configured APP_URL supplies the canonical auth origin. Callback checks exchange errors/session presence, and missing/invalid/expired/reused codes return a recovery page rather than implying success. Pending email submission is deduplicated; existing retry remains available.
- Sign-in is separate from the broad connected-features flag. It is presented only when the isolated gate, Supabase config, canonical origin and prepared schema probe are available. The schema probe uses an anonymous, nonpersistent client, so expired session cookies do not interfere with availability checks in a Server Component. Unavailable sign-in explicitly offers guests all six lessons.
- Prepared migration creates per-user learning state with optimistic revisions and unique (user_id, lesson_id) completion receipts. Both tables use authenticated ownership policies, anon revocation and auth-user deletion cascades. Save RPC uses auth.uid(), invoker permissions, revision comparison and a single transaction. No service-role key is used for learning reads/saves. The migration and pgTAP ownership/deduplication test are prepared ONLY, not applied or run.
- /api/learning/account verifies the authenticated user on every read/write, checks the queued owner's identity and revision, validates and normalizes learning, and prevents stale writes. Responses are no-store. Server merges preserve existing earned dates, undated legacy records and unique completions.
- Account learning is separate from cornerstone-learning-v1 guest data. Pending account work uses a per-owner browser cache and active memory, and only becomes 'Saved to your account' after a successful API result. Offline failures have retry; expiry/conflicts mask account views until recovery. Reauthentication opens another tab so in-memory work remains available. Unsent work with unavailable local storage prevents sign-out that would discard it. Focus and cross-tab notifications recheck identity. Switching account never imports another owner's cache.
- Guest import requires an explicit button; Keep separate is available. Merge includes validated learning only, retains account preferences and timezone, and is idempotent. No holdings, nickname, demo portfolio, raw files or financial state is transferred. Lesson activity and completion flow continue using the active learning record. Account controls are in Learn, the lesson reader and Settings. Existing guest UI and local persistence warnings remain.

## Files
Auth: app/api/auth/magic-link/route.ts, app/auth/callback/route.ts, app/api/auth/sign-out/route.ts, app/sign-in/page.tsx, components/sign-in-form.tsx, lib/internal-path.ts.
Account pipeline: app/api/learning/account/route.ts, lib/server/learning-account.ts, lib/learning-account-state.ts, components/use-account-learning.ts, learning-account-controls.tsx, mvp-provider.tsx, app/layout.tsx.
Presentation: learning-library.tsx, lesson-reader.tsx, learning-building.tsx, mvp-settings.tsx, onboarding-flow.tsx; existing styles reused.
Configuration/database: .env.example and supabase/migrations/20261107000000_learning_accounts.sql; prepared test supabase/tests/20261107_learning_rls.sql.
Tests: internal-path, learning-account-state, account availability, auth-flow, account route, account hook and sign-in form.

## Checks
npm run check passes lint, typecheck, 270 tests / 50 files and production build. Three additional readiness tests pass independently. Explicit npm run test:a11y: 6/6 pass. Subsequent lint and typecheck pass; an unnecessary concurrent build request was refused by Next's build lock while the successful full check's build was still running. The successful build includes the final readiness implementation. No build lock was bypassed. Source/lesson/calculator/dependency preservation and whitespace checks pass. Logs: work/phase3-*.log.

Automated account checks use mocked services, not live Supabase. Covered: safe redirect variants, failed and valid callback result handling, origin rejection, disabled readiness, authenticated owner reads, wrong-owner/stale writes, failed saves, idempotent imports and dates, guest store separation, account switching, offline queue recovery, expiry locking, storage-full retention and duplicate pending email submissions. Guest six-lesson regression remains green.

Browser on actual existing server localhost:3000: unavailable account screen; callback without a code plus an unsafe return path stays on local /sign-in with a recovery message; Continue as guest reaches returning onboarding and then Recap. Existing six lessons/six bricks remain unchanged. Left Recap open. Screenshot shows the unavailable-account recovery page, with no financial data. No credentials entered or real email submitted.

## Live blockers and remaining work
No local .env configuration, Supabase process environment values or database connector were available. No live database/schema/policies or email delivery were inspected. Account code is therefore NOT integration verified, and LEARNING_ACCOUNTS_ENABLED stays false.

Next reviewable integration step: provide an isolated Supabase sandbox and canonical APP_URL, review and authorize applying the prepared migration to that sandbox, then run the prepared SQL test and independent ownership/adversarial checks. Keep NEXT_PUBLIC_CONNECTED_FEATURES_ENABLED=false. Do not apply to a live database as part of this handoff.

Before enabling learning accounts, verify new/returning email-link delivery, actual callback codes and redirect allowlist, reuse/expiry, cookie refresh/renewal, refresh and browser restart, logout/back navigation, two-account/two-device isolation, cross-device conflict/retry, guest import choices, storage-full/offline recovery, RLS insert/update/delete isolation and deletion cascades. Authenticated browser responsiveness/accessibility was not manually exercised without real infrastructure. Existing local guest browser checks are not evidence of account readiness.

## Coordination
All earlier uncommitted work retained. No legacy site, protected lesson definitions, calculator implementation or package files changed in Phase 3. Four primary navigation items remain. No account-progress or identity analytics added. Review this phase before any integration enablement.
