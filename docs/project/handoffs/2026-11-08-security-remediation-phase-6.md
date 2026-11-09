# Task handoff — approved Phase 6 security updates

Date: 2026-11-08
Status: approved update batch complete; public release gates remain pending
Area: dependency security and guest release validation
Checkout: Cornerstone-Finance; all work remains uncommitted.

## Objective and scope

The user explicitly approved the seven-package security proposal after the Phase 6 audit. This authorization supersedes the original no-upgrades boundary for this batch. Preserve the guest experience, existing design and earlier uncommitted work. No account activation, migration, deployment, commit or external participant contact occurred.

## Changes and decisions

Only four manifest declarations changed: next and eslint-config-next are pinned to 16.4.5, @sentry/nextjs to 10.78.0, and zod to 4.6.7. The lockfile resolves follow-redirects 1.16.2 under axios, undici 8.12.2 under jsdom, and Vite 8.2.4. React/React DOM remain 19.2.8 and Vitest remains 4.1.11. No top-level dependency or persistent override was added.

Reviewed lockfile resolution includes the Next platform packages, Sentry/OpenTelemetry chain and compatible build-tool dependencies. It also deduplicates Zod and supplies nested optional WASM dependencies. There are 82 changed version/presence paths, including platform variants and relocations; the review inventory is work/phase6-security-lock-changes.json. Unchanged-version package metadata is unchanged except the root declaration record. npm initially chose newer compatible versions for the three targeted transitives; temporary resolution constraints narrowed them to the approved targets and were removed before final validation.

Application code, lessons, calculator, financial calculations, legacy site and feature gates were not edited in this task. AGENTS.md is unchanged. The existing installed Next upgrade guide was read before updating. npm reported an old loaded SWC cleanup warning and unapproved optional install scripts; installation exited successfully, and installed-tree validation, tests and compilation passed without enabling extra scripts. No clean npm ci was performed against the working checkout.

## Verification

- npm run check: PASS — lint, typecheck, 291 tests in 55 files, production build with Next 16.4.5 (43 prerendered pages).
- npm run test:a11y: PASS — 7 tests.
- npm ls --all --json: exit 0, no dependency problems.
- Official-registry full audit: 14 moderate affected-package entries; zero high or critical (previously 21 total: 2 critical, 4 high, 15 moderate).
- Production-only audit: 5 moderate affected-package entries; zero high or critical (previously 10 total: 2 critical, 2 high, 6 moderate). This is a subset of the full count, not an additional five.
- git diff --check: PASS.
- Fresh production preview: reported http://127.0.0.1:3011, Next 16.4.5, loopback only. Recap HTTP 200; nosniff, DENY framing, strict-origin-when-cross-origin and camera/microphone/geolocation restrictions observed.
- Isolated side-browser walkthrough: fresh guest onboarding, all six real activities and eighteen quiz answers, incrementing completion from one to six bricks; checked-answer refresh resumed at question two; final completion survived refresh. Repeating the final activity/completion kept six bricks. Recap retained six completions after refresh and closing/reopening the tab. At 320px, DOM reported no horizontal page overflow. Final Recap tab remains open; its newly reopened tab reported no captured warning/error messages. Existing user origins/data were not cleared. Reset/stale-callback and storage-recovery regressions passed in the automated suite; no new browser reset was performed in this batch.

Audit counts identify vulnerable package entries, not unique CVEs or evidence of exploitation. Remaining moderate entries are Sentry bundler/webpack/glob/minimatch, TypeScript ESLint/glob/minimatch, and Vitest/mocker chains. npm's proposed fixes include Sentry 11, Vitest 5 and an eslint-config-next downgrade; none was applied. Separate triage is required; automated suggestions are not approved decisions.

## Evidence and remaining gates

Raw evidence: work/phase6-security-check.log, phase6-security-a11y.log, phase6-security-audit-all.json, phase6-security-audit-production.json, phase6-security-installed.json and phase6-security-lock-changes.json. Current-chat outputs include the concise security handoff, audit JSON copies and Recap screenshot.

Package SHA256: package.json 9e8d7e2d723921add96f4aaa8ed07e631b355b441a2e0355d3aca19fa3eff649; package-lock.json 3eb928ad0544a90e555c81165567cec8649f7c51c68660ced20b15f6b08d2f43.

The approved security batch is complete. Public readiness is not established: the three cold production-mobile Lighthouse runs and actual five-student study remain unperformed, and moderate advisories need a separate reviewed disposition. The earlier native Chrome-control timeout remains the performance-audit limitation; no score or participant result is claimed. Accounts remain disabled and live account/service integration unverified. Stop for review before expanding scope.

## Coordination

This task touched package.json, package-lock.json, this handoff and dated context/report notes. The earlier audit is a historical baseline; these results supersede its dependency counts and pending-authorization status. All prior tracked/untracked changes are preserved. No source fix was necessary after the dependency update.
