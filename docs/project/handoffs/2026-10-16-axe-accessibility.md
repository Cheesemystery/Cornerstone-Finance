# Task handoff — axe accessibility regression gate

Date: 2026-10-16
Status: complete
Area: Shared design/navigation; Learn; Portfolio; Recap; Settings
Checkout / branch / commit: `C:\Users\abrah\Documents\Codex\2026-09-02\my-website-code-is-in-a\Cornerstone-Finance`, `main`, `9f2b0e3`; work remains uncommitted.

## Objective and scope

Add automated accessibility verification to the existing test system, check representative interactions in a real browser, and fix verified findings without shipping the scanner. Read AGENTS, PROJECT, STATUS, WORKFLOW, relevant area notes and latest charting/TanStack/Tremor/shared-control handoffs. Inspected current source/Git state and preserved the large pre-existing tracked/untracked checkout.

## Integration and changes

Reviewed the official [axe-core repository/README](https://github.com/dequelabs/axe-core), including its JSDOM limitations, and [API documentation](https://www.deque.com/axe/core-documentation/api-documentation/). Installed pinned **axe-core 4.14.0 as a devDependency**, retaining its package-provided MPL-2.0/third-party license files. No production dependency or external accessibility service was introduced.

- `components/accessibility.test.tsx`: six Vitest tests using direct `axe.run`, Testing Library and actual components/providers. Five flows cover open/closed mobile Sheet, lesson challenge before/after incorrect/correct feedback, Portfolio Explore selection/focus, Recap disclosure, and Settings switch/open reset dialog. A sixth deliberately bad button verifies the scanner detects `button-name` rather than silently passing. Violations report IDs, impact, selectors and remediation text. Incomplete findings are logged for manual review.
- Run all default rules except `color-contrast`, explicitly unsupported in JSDOM per Deque. Only missing browser APIs are shimmed; null canvas context does not simulate rendered pixels. Document title/language belong to the fixture, not a claim of route metadata coverage. Providers use isolated JSDOM storage and synthetic sample data. Pathname is mocked; application logic is otherwise real.
- `package.json` adds `test:a11y`; package/lock files pin the development tool. Existing `npm test`, `npm run check` and CI test discovery include the suite without workflow changes.
- `docs/project/ACCESSIBILITY.md` explains running/extending the gate, exclusions, incomplete findings and browser supplements. PROJECT, STATUS and AREAS link the durable workflow.

## Verified fixes

The first working scan exposed `landmark-unique` on Settings: the desktop site sidebar and Settings privacy/data aside were both unnamed. `components/app-shell.tsx` now labels its aside Site sidebar; `components/mvp-settings.tsx` labels its aside Privacy and local data. Distinct complementary landmarks are now available to assistive navigation.

Opening Settings' native reset dialog also exposed a missing accessible name. Added `aria-labelledby="reset-progress-title"` and that ID to its existing heading. The new open-dialog scan covers this regression. No visual design, reset action, saved preference, financial calculation, source label or route behavior changed.

## Verification

- `npm run check` passes lint, TypeScript, **126 tests across 27 files**, and production build with **40 generated pages**. The new focused suite passes **6/6**; its normal flow scans report no violations or incomplete results. The negative control intentionally detects an unnamed button.
- Initial test attempts exposed missing JSDOM scroll support; the test supplies/restores a no-op shim. Initial full validation caught an unsupported Testing Library query option; corrected it and reran the complete checks successfully.
- `npm run knip` retains the existing expected exit 1: 3 files, 5 value exports and 8 type exports, no unused dependency finding. No cleanup/deletion performed.
- `npm ls axe-core --omit=dev` is empty. Final production browser chunks contain neither the axe-core scanner identifier nor test diagnostics. Test-only imports and devDependency classification keep the scanner out of production. No bundle improvement is claimed.
- Browser checks on the reported localhost:3000 development server confirm mobile modal initial focus, Tab/Shift+Tab boundary wrapping, Escape, focus returning to Open navigation and background isolation. Phone viewport 390 has no page overflow; normal viewport restored.
- Lesson challenge moves focus to its heading; Space/ArrowDown selects a radio option and Tab reaches Check answer with a visible outline. Browser feedback submission was avoided to limit changes to existing saved learning activity; incorrect/correct feedback scans use isolated test data. Existing completion count stayed intact.
- Portfolio Enter selects the matching holding and focuses `holding-details`; Escape clears selection. Recap disclosure opens with Enter and Tab reaches exposed content with visible focus. Settings reset dialog is named, starts on Keep my progress and returns focus to Reset local progress on Escape. No reset executed; no real orders, progress completion or account action performed.
- Sampled computed-color contrast checks in the real browser found no ordinary text failures for Settings, lesson challenge, Portfolio or exposed Recap content on solid backgrounds. Gradient/opacity/decorative elements were flagged for visual review rather than assigned a false pass. The small dark Recap caption is approximately 6.10:1 against its lighter base gradient stop. A flagged lime dot belongs to the decorative Cornerstone brand mark, not ordinary body text. This was a sampled supplement, **not a full browser axe contrast scan**, full gradient/compositing audit or screen-reader evaluation.
- Restored generated Next declarations to pre-task contents. Source hashes, relative documentation links and diff whitespace checked. Existing source outside the two accessibility fixes, package files and project context remains intact. Legacy site, financial helpers, saved-progress schema, Discover widget and deferred integrations are unchanged.

## Limits and next step

None required for this bounded gate. Accessibility is not fully determined by axe: JSDOM lacks layout and native rendering, and the manual browser checks cover selected states. Additional routes, zoom/reflow, touch targets, assistive-technology sessions and expert review remain. No WCAG compliance or launch-readiness claim.

Future component changes should extend these flows and follow [ACCESSIBILITY.md](../ACCESSIBILITY.md). If a browser test runner is adopted later, add actual browser axe scans with contrast enabled; do not erase the documented JSDOM limitation. Keep user data and audit output local. Installation reported the existing five development-chain high advisories; no unrelated forced dependency upgrade was made.

## Coordination

Shared files touched: AppShell and Settings accessible-name attributes; package/script files; project context. Everything remains uncommitted; no commit, push or deployment. Previous UI foundation: [shadcn controls](2026-10-16-shadcn-shared-controls.md), [Tremor visuals](2026-10-16-tremor-contributors.md).
