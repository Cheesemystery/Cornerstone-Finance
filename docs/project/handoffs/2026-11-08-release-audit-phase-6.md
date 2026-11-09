# Task handoff — Phase 6 release-readiness audit

Date: 2026-11-08
Status: audit delivered; release blocked; security updates await authorization
Area: guest-MVP release gates
Checkout: Cornerstone-Finance; previous uncommitted work preserved.

## Scope
User selected guest release-readiness audit and proven fixes. Existing instructions prohibit dependency upgrades, so the proven dependency findings are delivered as an exact, reviewable update proposal rather than applied changes.

## Findings
Fresh npm audit: 21 affected-package entries (2 critical, 4 high, 15 moderate); production-only subset 10 (2 critical, 2 high, 6 moderate). Counts are not unique CVEs or proof of compromise. Maintainer advisories were checked, including the Sentry severity/configuration discrepancy. The repository's existing BETA.md security gate is not met.

Verified target proposal: Next and matching eslint-config-next 16.4.5, Sentry 10.78.0, Zod 4.6.7, compatible transitive refreshes follow-redirects 1.16.2 / undici 8.12.2 / Vite 8.2.4. All targets were checked against official registry metadata. No package or lockfile was changed, no package installed and no audit-fix command run. Do not interpret metadata checks as an integration-tested updated graph.

## Checks and browser outcome
Fresh npm run check passes lint, typecheck, 291 tests / 55 files and production build. Explicit test:a11y: 7/7 pass. Production HTTP check returns 200 with the four configured security headers. Guest and learning-account gates are false; optional telemetry keys are unconfigured (only booleans recorded).

Production audit preview started at its reported http://127.0.0.1:3010, bound to loopback only. The Chrome audit tab loaded fresh onboarding. Native Chrome-control approval timed out before DevTools could be used; no Lighthouse audit or performance score exists. No existing browser learning data was cleared and no participant contacted. Student study and performance gates remain unperformed. A blank protocol is supplied. This is not a public release or live integration verification.

## Deliverables
Current chat outputs: phase-6-release-readiness.md, phase-6-security-update-proposal.md, phase-6-pending-test-protocol.md, phase-6-audit-all.json, phase-6-audit-production.json. Durable report: docs/project/reports/2026-11-08-guest-release-readiness.md. Raw evidence: work/phase6-*.

## Remaining work
Obtain explicit authorization to override the original no-upgrades constraint for the scoped security proposal. Then apply/review the dependency resolution, rerun checks and audits, complete three cold mobile Lighthouse reports and the actual five-student study. Do not force a downgrade, enable accounts, apply migrations or deploy as part of this handoff.

## Coordination
Phase 6 changes are documentation/report files only. Application source, dependencies, protected lessons, calculator, financial code, legacy site, gates and migrations are unchanged. Earlier Phases 1–5 remain uncommitted. Package manifests are byte-identical; hashes are in the report.
