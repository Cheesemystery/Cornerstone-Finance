# Task handoff — learning-first interactive MVP

Date: 2026-10-12
Status: Implementation complete; release gates remain as listed below.
Area: Current Next.js app across Home, Learn, Portfolio, Recap and shared shell.
Checkout: Cornerstone-Finance; uncommitted working tree with pre-existing user changes preserved.

## Objective and scope
Implement the user-approved MVP plan, including interactive graphics/challenges and guided fictional-money practice. Preserve eight tabs, existing lesson URLs, current stack and legacy static files. The user's “LeetCode for finance” thought informed short problems, clear feedback and retryable practice rather than speed/return competition.

## Changes
- New versioned learning/practice domain modules, browser store, provider and tests.
- Rebuilt Home, onboarding, Learn player/path/reviews, Portfolio practice and Recap.
- New code-native lesson graphics, three reusable interaction families, source labels, stable colors and shared progress/summary components.
- Single research catalog; Discover deduplicated; Social preview; Assistant single prompt list and practice-aware answers; local Settings.
- Connected capability flag, conditional analytics imports, mobile modal isolation, stronger focus/reduced motion and route loading states.
- Patched Next and eslint-config-next to 16.3.8. Updated vulnerable transitive packages within existing dependency constraints; retained npm lockfile and stack. No template dependency bundle.
- Updated PROJECT, AREAS, STATUS, BETA and SECURITY. No migrations, backend services, deployment or commits.

## Decisions
Learning/reviews reward understanding. No rewards for orders, deposits, balance or return. Streaks are optional with one grace day per rolling seven days. Valid legacy completions keep credit but gain no invented activity dates.
Paper orders are an educational exception to the real-account read-only policy. Scenarios are fixed version 1, all assets fictional, amounts in integer cents, no real execution.
The calculator's canonical destination is /learn/fees-and-time#calculator. External original research remains linked; no external repo code/assets were copied.
References informed general patterns only. MIT was verified for BernieTv/Duo-clone and Weebapp003/shadcn-fintech-template during audit; my-react-duolingo had no project license, Aralify's claimed MIT file was unavailable, and shadcn.io premium terms are separate from shadcn/ui. No attribution obligations were introduced by borrowed code.

## Verification
Full npm run check passes: lint, TypeScript, 76 tests / 15 files, production build (40 generated pages).
All eight main routes fit at 320/390/768/1440 widths without page-wide overflow.
Browser: first lesson matching, wrong/correct quiz, completion and resume after reload; daily review; practice preview/confirm, down-week checkpoint, reflection and persisted reload; modal menu isolates background and Escape restores focus; calculator anchor; share preview/download parity with counts excluded.
Production npm audit reports zero vulnerabilities after fixes. Full audit retains five high entries from the same dev-only braces chain; latest registry version 3.0.3 is affected (GHSA-vfj7-8cjw-p6xm). Do not use npm audit fix --force to downgrade Next lint configuration.
Three cold production mobile Lighthouse runs scored 91, 92 and 92 (median 92; target 90 met). LCP was 3.3/3.2/3.2 seconds; TBT 110/120/150 ms. These are local laboratory measurements, not real-user performance. Narrow Zod imports avoid bundling unused locales on the initial route; sidebar links avoid background prefetch; local fonts use optional display.

## Remaining release gates
Five-person beginner usability study and full screen-reader audit have not been performed. Repeat production mobile performance checks after material changes; the current laboratory target is met.
The unresolved dev-tool advisory requires a patched upstream dependency or a separately reviewed release decision. Live services remain gated and unverified. No claim of launch readiness.
QA created one lesson completion, one daily review and one practice reflection in the local browser, preserving pre-existing preferences.

## Coordination
Many pre-existing files were already modified/untracked. This task did not revert or commit them. Shared files touched include app/layout, app-shell, DemoProvider, lib/domain, lib/portfolio, package files and context docs. Legacy root app.js/index.html/CSS were not edited.
Developer server reports localhost:3000; temporary production audit server reports localhost:3100. Development server remains available at handoff. User-facing summary, screenshots and Lighthouse JSON are in the chat outputs folder.
