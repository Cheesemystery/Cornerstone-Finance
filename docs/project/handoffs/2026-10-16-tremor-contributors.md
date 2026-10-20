# Task handoff — selected Tremor contributor visuals

Date: 2026-10-16
Status: complete
Area: Dashboard and portfolio; Cornerstone Recap
Checkout / branch / commit: `C:\Users\abrah\Documents\Codex\2026-09-02\my-website-code-is-in-a\Cornerstone-Finance`, `main`, `9f2b0e3`; work remains uncommitted.

## Objective and scope

Improve existing Portfolio and Recap visuals with a bounded Tremor adoption. Read AGENTS, PROJECT, STATUS, WORKFLOW, relevant area notes, installed Next.js guides and the latest shadcn shared-controls handoff, then inspected current source and Git state. Preserved the pre-existing tracked and untracked checkout work.

Selected **one component**, Tremor Raw BarList v1.0.0, reused on both pages. No new performance chart, simulated records, UI control system, dependency upgrade, integration, legacy change, commit, push or deployment.

## Source, licensing and compatibility

Reviewed official [BarList docs/source](https://www.tremor.so/docs/visualizations/barlist), [installation](https://www.tremor.so/docs/getting-started/installation), [about](https://www.tremor.so/docs/getting-started/about), [upstream component](https://github.com/tremorlabs/tremor/tree/main/src/components/BarList) and [license](https://github.com/tremorlabs/tremor/blob/main/LICENSE). Used the free source-distributed Raw component, not commercial Blocks or the older `@tremor/react` package. Official setup supports React 18.2+ and Tailwind 4+. Installed React 19.2.8, Next 16.3.8, Tailwind 4.3.3 and TypeScript 6.0.3 were retained.

Retained the complete upstream Apache-2.0 license including its third-party notices in `components/tremor/LICENSE`, source attribution and prominent modification notice. No upstream root NOTICE file was available. `components/tremor/README.md` documents provenance, compatibility and adaptation boundaries.

Inspected source before applying it. The upstream sorting/formatter/proportional-width approach is retained; its nonnegative-width assumption is adapted for signed financial contributions. Reused the existing shared `cn` helper. Source adaptation uses scoped CSS, existing Next Link and native buttons; no Recharts, icon package, component CLI or global theme initializer was needed. Existing Sheet, Switch and other controls are unchanged.

## Changes and decisions

- `components/tremor/bar-list.tsx` and `bar-list.module.css`: shared light/dark contributor rows. Only decorative bar lengths use absolute magnitude, including safe negative/zero handling. Actual signed values and existing formatters are unchanged. Nonfinite values display Unavailable. Both callers pass `sortOrder="none"` to retain their existing ranking. Rows include full names, companies, signed values and written direction; bars are decorative, with a visible magnitude explanation. No animation or transition.
- `components/portfolio-movement.tsx`: replaces its manually drawn contributor buttons with BarList, preserving all existing derived contributions, selected holding state, detail panel, reporting links and parent Escape handler.
- `components/portfolio-recap.tsx`: replaces the three mover cards with a dark BarList using existing snapshot or saved-practice attribution. Recap's internal research/portfolio destinations, source labels, period copy and empty/example states remain. Its checkpoint graphic and snapshot allocation are unchanged. No monthly history is inferred from daily change.
- `app/portfolio-polish.css`: changes the monthly card from `overflow: hidden` to `overflow: clip`. Browser keyboard testing exposed hidden internal card scrolling when focusing lower links; clipping now retains the rounded artwork while allowing the page to scroll to focus.
- `components/tremor/bar-list.test.tsx` adds five regressions covering signed/all-negative/zero widths, immutable ordering, nonfinite values, selected buttons and readable internal links. `components/portfolio-movement.test.tsx` adds one integration regression for existing selection/details/reporting behavior.
- PROJECT, STATUS and AREAS record the shared visualization foundation. No global theme, financial library, sample fixture, learning/practice storage schema or package file changed. Old page-specific CSS was retained rather than broadening this pass into cleanup.

## Verification

- `npm run check`: lint and TypeScript pass; **120 tests across 26 files pass**; production build generates **40 pages**. Focused financial/UI suite: 17 tests across five files pass.
- Final `npm run build` after the clipping fix also passes TypeScript and generates 40 pages. Restored generated `next-env.d.ts` to its pre-task contents afterward.
- `npm run knip`: expected exit 1; unchanged retained findings (3 files, 5 value exports, 8 type exports), no unused dependencies. No automatic deletion.
- Side browser used the existing development server's reported `http://localhost:3000` (webpack development mode). Checked both pages at **320, 390, 768 and 1440** viewport widths: no page-wide overflow; company names and signed values remain visible. Normal viewport restored and Recap left open.
- Portfolio Enter selects the matching holding with `aria-pressed`, retains its details/reporting action, and Escape clears selection. Recap links remain normal internal links; Tab focus is visible and no longer scrolls the card interior. Native semantics and explicit text provide a nonvisual alternative to bar length and color. Bars have no animation/transition, including with reduced motion.
- Inspected snapshot, explicitly fictional example and existing saved-practice Recap modes. Snapshot retains monthly Not available yet; the example retains no-individual-stock-history copy without inventing movers; practice uses actual stored checkpoints and existing last-week attribution. Saved progress and records were not edited.
- Source hash comparison confirms all pre-existing files outside the listed changes/context documents remain intact, including package/lock files, financial models, legacy assets and saved-progress implementation. Diff whitespace check passes.
- Full assistive-technology testing and performance timing were not performed. This is not a release-readiness claim.

## Dependency and bundle impact

**Zero added or changed npm dependencies**; package and lockfile hashes match the pre-task baseline.

Compared successful production builds before and after this pass using the same installed stack and `next build` (Turbopack). For each route, deduplicated JS chunks from `page_client-reference-manifest.js` clientModules and CSS from entryCSSFiles, then summed raw bytes and per-file gzip level 9 sizes. Shared chunks count in both routes. These are route-manifest asset totals, **not** initial transfer size, full page weight or runtime timings; they exclude HTML, server code, maps and framework entry assets absent from those manifests. CSS chunk composition changed when the shared component joined both route graphs, so the CSS delta includes rebundled existing styles rather than only the new CSS module.

| Route / asset | Before raw bytes | After raw bytes | Raw delta | Before gzip bytes | After gzip bytes | Gzip delta |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Portfolio JS | 582,750 | 584,732 | +1,982 | 157,826 | 158,473 | +647 |
| Recap JS | 347,876 | 349,834 | +1,958 | 110,626 | 111,220 | +594 |
| Portfolio CSS | 156,895 | 169,523 | +12,628 | 32,031 | 34,081 | +2,050 |
| Recap CSS | 141,063 | 169,523 | +28,460 | 29,910 | 34,081 | +4,171 |

No bundle-size reduction is claimed. This small source component avoids adding a chart runtime for a data set that already contains a few contributions. Supporting raw manifests, measurement script, check logs and browser screenshots were saved in the current chat's work/output directories; the table above preserves the durable result in the repository.

## Remaining work / next step

None required for this bounded pass. Future visualizations should use actual dated records and preserve missing-data explanations. Consider CSS chunk composition separately if further shared visualizations expand route assets. Review source/license and bundle impact before any additional Tremor component adoption; avoid duplicating shadcn controls.

## Coordination

Shared presentation/context files touched as listed above. All work remains uncommitted alongside the existing checkout changes. Financial contracts, providers, migrations, authentication and connected integrations are untouched. Previous foundation: [shadcn shared-controls handoff](2026-10-16-shadcn-shared-controls.md).
