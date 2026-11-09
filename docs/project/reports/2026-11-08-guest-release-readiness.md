# Phase 6 — guest release-readiness audit

Date: November 8, 2026
Result: **Release blocked.** The guest workflow passes its checks, but this audit does not establish public-release readiness.

## Gate results

| Gate | Result | Evidence |
|---|---|---|
| Guest functionality | Pass | Fresh run: 291 tests in 55 files |
| Lint, TypeScript and production build | Pass | Fresh npm run check |
| Structural accessibility | Pass | Explicit accessibility suite: 7 tests |
| Complete browser guest journey | Previously verified | Phase 5: six activities, eighteen checks, six bricks, repeat/reset/reopen checks; not repeated in this audit |
| Dependency security | **Blocked** | npm audit reports 21 affected-package entries: 2 critical, 4 high, 15 moderate |
| Production-only dependency security | **Blocked** | Subset: 10 affected-package entries, including 2 critical and 2 high |
| Cold mobile performance | Not run | Lighthouse is not installed in the project; native Chrome-control approval timed out before a DevTools audit could be started |
| Five-student usability study | Not run | No participants observed or contacted; a blank protocol is supplied |
| Learning accounts and connected financial features | Disabled | Both feature gates false; account integration remains unverified |
| Optional telemetry | Unconfigured | Sentry and analytics configuration booleans false; no secret values recorded |
| Local production headers | Observed | HTTP 200; nosniff, DENY framing, strict-origin-when-cross-origin referrer policy and camera/microphone/geolocation disabled |
| Deployment, live security and cross-device behavior | Not verified | No deployment or live integration occurred |

Audit counts describe vulnerable-package entries, not distinct exploits or confirmed application compromise. Production counts are a subset of the full audit, not additional findings.

## Advisory verification and exposure limits

- **Next.js 16.3.8:** npm reports critical findings and proposes 16.4.5. The maintainer identifies patched releases for [image optimization](https://github.com/vercel/next.js/security/advisories/GHSA-2464-fhr4-w9xw) and [Cache Components](https://github.com/vercel/next.js/security/advisories/GHSA-673q-mjm6-r5xr). Image exposure depends on the deployment environment; the other advisory describes particular cache functions. No `use cache` directive was found in the inspected application source. This is not a complete exploitability assessment or a release exception.
- **Sentry 10.73.0:** npm classifies the package entry as critical, while the [maintainer's tunnel-route advisory](https://github.com/getsentry/sentry-javascript/security/advisories/GHSA-mchm-gjx6-7h55) currently rates that issue moderate. It has configuration prerequisites. The inspected source has no tunnelRoute/withSentryConfig setup and uses Turbopack; the advisory's middleware-bypass conditions were not demonstrated here. Preserve this discrepancy rather than presenting npm's classification as proof of exploitation.
- **Zod 4.5.4:** the [reviewed advisory](https://github.com/advisories/GHSA-mrhx-c7xc-m3w5) identifies resource-exhaustion risk and a fixed 4.6.6 release. Proposed 4.6.7 is available. Updating the direct dependency alone is not proof that every nested copy is corrected.
- Other high entries are follow-redirects, undici and Vite. Parent ranges were inspected for a compatible lockfile refresh. Development-tool findings still count under the project's release gate.

The project's BETA.md requires high/critical advisories to be resolved or covered by a separately reviewed release decision. No exception is granted by this audit. No exploit was attempted.

## Concrete next step

Review `phase-6-security-update-proposal.md`. It lists verified update versions and validation requirements. No package manifest, lockfile or installed package was changed. The original brief explicitly prohibits dependency upgrades, so implementation needs separate authorization.

After authorized updates: rerun the full checks and both npm audits, inspect the exact lockfile diff, then perform the three cold mobile Lighthouse runs and the five-student study. Do not substitute an automated browser walkthrough for student observations.

## Evidence and provenance

- Full audit: `phase-6-audit-all.json` in the chat outputs; checkout copy: work/phase6-dependency-audit.json.
- Production audit: `phase-6-audit-production.json`; checkout copy: work/phase6-production-audit.json.
- Installed tree, registry target metadata and check logs: work/phase6-*.json and work/phase6-*.log.
- Registry: official registry.npmjs.org; no installs or audit-fix command executed.
- Host Node: 24.20.0. A production preview was started at its reported http://127.0.0.1:3010, bound only to localhost. No performance score was collected. No existing learning origin was cleared.
- package.json SHA-256: 68b1f25f5bc51ead2ff817a40761887b032d46b62a331bb29aa4f38728397a1f.
- package-lock.json SHA-256: f97d285c7f27f8cacf34923ff9b77b408678a76f70a8e5175ef942eebf030962.

This is a bounded readiness audit, not a penetration test, WCAG certification or approval to launch.

## Follow-up — approved security batch applied, November 8, 2026
The historical audit above predates the approved remediation. The updated graph has zero high/critical findings, 14 moderate full-graph entries and 5 moderate production-subset entries. Fresh 291-test/check/build and 7 accessibility checks pass; the complete isolated six-lesson browser journey also passes. Performance and real-student gates remain unperformed. See [follow-up handoff](../handoffs/2026-11-08-security-remediation-phase-6.md) for exact versions, evidence, limitations and the remaining moderate findings.
