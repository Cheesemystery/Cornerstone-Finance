# Task handoff — TanStack Table evaluation

Date: 2026-10-16
Status: complete — retain current implementation; skip installation
Area: Dashboard and portfolio
Checkout / branch / commit: `C:\Users\abrah\Documents\Codex\2026-09-02\my-website-code-is-in-a\Cornerstone-Finance`, `main`, `9f2b0e3`; existing work remains uncommitted.

## Objective and scope

Evaluate whether TanStack Table meaningfully simplifies the Portfolio holdings table. The user explicitly permits skipping installation if the existing table is simpler and sufficient. Read AGENTS, PROJECT, STATUS, WORKFLOW, Portfolio area notes and the latest Tremor/shadcn handoffs; inspected current source and Git status. Preserved all existing tracked and untracked work.

This pass changes documentation only: this handoff, STATUS and AREAS. No installation, source/configuration change, new sorting/filter UI, pagination, virtualization, commit, push or deployment.

## Current implementation

- `components/portfolio-holdings.tsx` renders five fixed columns with one `portfolio.holdings.map`. Table rows retain the supplied holding order; there are no sortable headers, filter controls, sorting/filter state, bulk actions or table-local selection model to replace.
- A single `selected: string | null` symbol is shared by chart slices, legend buttons, contribution bars, detail panels and table Explore actions. Explore sets that symbol and moves focus to `holding-details`; the workspace Escape handler clears it. Hover/focus preview states also serve the chart. Table migration would not remove this cross-view coordination.
- Shares are numeric; value uses `marketValue`, mix uses the unchanged full portfolio total, and daily change uses the supplied previous close with its current missing/zero fallback. Formatting occurs in cells. `lib/portfolio.ts` already sorts allocation/contributor summaries numerically; those rankings are independent of the table's supplied order.
- Native table, header scopes, cell markup, labelled Explore buttons, pressed states, source/date labels and scoped brand styling are already present. `tableWrap` contains horizontal scrolling with `overflow-x: auto`; the table's minimum width keeps columns readable.
- The sample has four holdings. CSV imports can contain up to 5,000 unique-symbol records; that supported upper bound is not evidence of a tested large-table performance guarantee. No large-CSV usage/performance measurements or current sorting/filtering requirements demonstrate a need for a table engine in this pass.

## Official documentation review and decision

Reviewed the current official [React quick start](https://tanstack.com/table/latest/docs/framework/react/quick-start), [sorting guide](https://tanstack.com/table/latest/docs/framework/react/guide/sorting), and [row-selection guide source](https://github.com/TanStack/table/blob/main/docs/framework/react/guide/row-selection.md). The current documentation identifies **v9** as latest; do not assume older v8 tutorials describe its preferred API. The column-filtering page could not be fetched during review, so no detailed filtering API or package-version compatibility claim is made. No package was installed or executed.

TanStack is headless: it can supply row/state logic while preserving the existing markup and styles, but it would not replace Cornerstone's rendering, Explore/focus behavior, source labels or financial calculations. Its current API uses column definitions, a table instance and explicit optional feature/row-model registration. Sorting and filtering would be useful when those interactions are actually required; there is no existing implementation of either to simplify today.

Its controlled row-selection support could synchronize with external views, using stable symbol IDs and single-row selection. Here, adapting between a table selection map and the existing selected symbol (or deliberately retaining the existing symbol state) adds plumbing to an already small interaction. It offers no verified simplification for the current Explore action.

**Decision: retain the current native table.** Adopting an engine now would introduce dependency, column and row-model maintenance without replacing duplicated behavior or satisfying a demonstrated interaction need. This is a current-scope decision, not a rejection of TanStack for larger future tables. Package files, installed dependencies and application bundle inputs remain unchanged; no bundle reduction or performance improvement is claimed.

## Future adoption criteria and safeguards

Re-evaluate when the product needs several coordinated numeric sorts and text/column filters, reusable table behavior across pages, or recorded usage shows that larger imported holdings are difficult to explore. Assess the smallest implementation against the then-current official API and package compatibility. A future TanStack migration should remain scoped to the holdings table:

- Access raw numeric quantities, values, allocations and daily percentages for sorting; format dollars/percentages only in cells. Do not compare formatted strings. Cover negatives, fractions, ties, zero and unavailable previous-close values, with an explicit missing-value order.
- Sort/filter a derived copy or row model, preserving the original snapshot and financial helpers. Filtering rows must not silently recalculate portfolio totals or change allocation denominators.
- Identify rows by the existing unique symbol, preserve shared single-holding selection and Explore focus transfer, and keep Escape clearing. Disable multi/range selection unless requested.
- Retain native table/header semantics, keyboard header buttons and `aria-sort` if sorting is added, readable values/source labels, current styling and contained mobile scrolling. Verify selected records across filter/sort/source changes.
- Measure dependency and production route-bundle impact if adopted. No pagination, virtualization or other features without separate demonstrated need.

## Verification

- Existing focused tests: **9 tests in 3 files pass** (`lib/portfolio.test.ts`, `lib/csv.test.ts`, `components/portfolio-movement.test.tsx`). First sandbox attempt failed before tests started because the temporary transform-cache rename was denied; rerunning outside that sandbox passed. No dependency or source changes were needed to resolve it.
- Browser Portfolio sample confirms five scoped column headers, correct existing values/source copy, Explore via Enter selecting the matching holding and focusing `holding-details`, and Escape clearing its pressed state. Tab reaches the next Explore button with a visible focus outline.
- At viewport widths **320, 390, 768 and 1440**, document scroll width equals document client width. Table wrapper uses `overflow-x: auto`; its content scrolls locally at narrow widths. Normal viewport restored; Portfolio left open. No saved learning/practice records or imported data were changed.
- No table sorting exists, so no new sorting behavior was implemented or claimed as tested. Existing numeric financial sorting stays untouched. No large-CSV performance benchmark or full screen-reader session was performed.
- Verified relative documentation links and whitespace. Compared pre/post hashes of existing tracked and untracked files: only STATUS and AREAS changed; this handoff is new. Application source, configuration, dependency files and pre-existing user work remain intact.
- No full lint/build rerun was needed for documentation-only changes. The prior Tremor handoff records 120 tests / 26 files and a successful 40-page production build; those are prior results, not rerun results for this evaluation.

## Remaining work / next step

None for this evaluation. Use the criteria above when real sorting/filtering requirements arrive; installation is intentionally skipped under the user's requested decision branch.

## Coordination

Documentation-only shared context updates; no application files touched. Related handoffs: [Tremor visuals](2026-10-16-tremor-contributors.md) and [shadcn controls](2026-10-16-shadcn-shared-controls.md). Existing checkout remains uncommitted. No commit, push or deployment.
