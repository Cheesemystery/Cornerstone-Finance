# Task handoff — Knip baseline and conservative cleanup

Date: 2026-10-16
Status: complete
Area: Deployment, dependencies and observability; legacy static experience
Checkout / branch / commit: `C:\Users\abrah\Documents\Codex\2026-09-02\my-website-code-is-in-a\Cornerstone-Finance`, `main`, `9f2b0e3`; substantial pre-existing tracked and untracked work preserved.

## Objective and scope

Establish the current validation baseline, add Knip with Next.js/legacy/deferred-feature coverage, review unused files/exports/dependencies, and make only verified conservative removals. No feature retirement, redesign, integration activation, dependency upgrades, commit, push or deployment.

## Changes

- Added pinned Knip 6.41.0, npm scripts `knip` and `knip:report`, and lockfile entries. Existing package versions and declarations preserved.
- Added commented `knip.jsonc`: Next plugin defaults retained; HTML-loaded legacy scripts/styles and all current tests are entries; CSS is analyzed; generated output excluded; exact documented exception for Next's `server-only` marker.
- Removed six unnecessary export keywords across `components/lesson-interaction.tsx`, `components/mvp-provider.tsx`, `components/stock-price-chart.tsx`, `lib/presentation.ts`, and `lib/providers/market.ts`. Implementations and local callers remain unchanged.
- Added [review report](../reports/2026-10-16-knip.md) and before/after JSON evidence. Updated STATUS and AREAS with tooling guidance.

## Decisions

No files or existing dependencies were deleted. Retained historical UI, deferred integration contracts and type exports, with individual reasons in the report. Findings remain visible rather than ignored. Do not use `--fix` or delete reported files without reference and product-intent review.

No change to durable product direction or existing check/CI gates. `npm run knip` exits 1 for the retained findings; `npm run knip:report` emits JSON with the same findings and exit status.

## Verification

Before and after: `npm run check` passes lint, TypeScript, 97 tests in 21 files and production build with 40 generated pages. `npm ls --depth=0` and diff whitespace checks pass. Knip counts: 3 files, 11 value exports, 8 type exports before; 3 files, 5 value exports, 8 type exports after. Zero unused dependencies/devDependencies, unlisted dependencies or unresolved imports after configuration.

Compared all existing lockfile package entries to the pre-install snapshot: unchanged. Compared hashes of pre-existing nonignored tracked/untracked files: only intended modules/package/docs changed; no missing files. Restored exact original generated `next-env.d.ts` after the build.

No UI behavior changed or live integration testing performed. Legacy HTML and SQL are outside Knip's module analysis; their preservation is explicit, not inferred from the analyzer. The earlier server startup required `npm run dev -- --webpack` outside the network-restricted sandbox for side-browser access; the npm dev script itself remains unchanged.

## Remaining work / next step

None required for this task. Future feature retirement can review the individually documented retained findings. A nonzero Knip status is expected until that separate scope is chosen; it is not a failed build.

## Coordination

Shared package files, STATUS and AREAS were already modified before this task; changes were additive. Existing user work was neither reverted nor committed. Local evidence logs/snapshots stay outside the repository in this chat's work directory; durable findings and handoff are in the repository.
