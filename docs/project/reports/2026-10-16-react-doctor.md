# React Doctor review — bounded provider and Recap pass

Date: 2026-10-16. Branch `main`, HEAD `9f2b0e3`; work remains uncommitted.

## Outcome

Scanned the whole project using React Doctor 0.9.18, the version resolved by `@latest` for the initial run. Changed only two production modules: `components/demo-provider.tsx` and `components/portfolio-recap.tsx`. Added focused regression tests. No design, financial arithmetic, lesson content, saved-progress schema, practice prices, dependencies or deferred feature flags changed.

| Full static scan | Before | After |
| --- | ---: | ---: |
| Errors | 2 | 2 |
| Warnings | 74 | 71 |
| Findings | 76 | 73 |
| Affected files | 34 | 33 |
| Score | Disabled | Disabled |

Both scans completed with `ok: true`; exit 1 is expected because existing error-severity findings remain. The purpose was maintainability and reliable cleanup, not a score target. See [before evidence](2026-10-16-react-doctor-before.json) and [after evidence](2026-10-16-react-doctor-after.json).

## Official documentation and telemetry

Used the current official [CLI reference](https://www.react.doctor/docs/reference/cli-reference), [data-use documentation](https://www.react.doctor/docs/legal/data-use), and [fixing guidance](https://www.react.doctor/docs/getting-started/how-to-fix-issues). Provider memoization follows React's [context guidance](https://react.dev/reference/react/useContext#optimizing-re-renders-when-passing-objects-and-functions), and request cleanup follows the [effect lifecycle](https://react.dev/reference/react/useEffect).

PowerShell environment for every invocation:

```powershell
$env:REACT_DOCTOR_NO_TELEMETRY='1'
npx --yes react-doctor@0.9.18 --no-telemetry --no-score --no-supply-chain --scope full --yes --json --json-out <local-report-path>
```

The first invocation used `@latest` and the repeat used its resolved version, 0.9.18. Both included the same privacy and scan flags. CLI telemetry, score/share API and supply-chain lookups were disabled according to official controls. npm downloaded the CLI to its external execution cache; project dependencies and scripts were not changed. No service, CI, hook or agent skill was installed. No runtime trace, upload or external account operation was performed.

## Verified changes

### Shared provider state and effects

React Doctor flagged DemoProvider's inline context value and its fetch effect. Direct inspection confirmed that preferences were parsed into a fresh object each render, provider callbacks were recreated, and the connected effect could still save stale recap preferences after unmount during response decoding.

- Memoized decoded preferences by raw store snapshot. Moved the storage-based update action outside the component, preserving its fresh read on every edit so consecutive patches do not overwrite one another.
- Memoized reset and the context value, preserving the public context fields and setter behavior. An unrelated parent render no longer invalidates all context consumers.
- Extracted `useContributions` and the row conversion helper. Events, loading/source mode and timezone now transition together rather than through separate setters. Functional contribution updates still apply to the latest events, and reset still retains server contributions while restoring sample events in sample mode.
- Added an AbortController shared by both connected read requests. Cleanup aborts obsolete work; guards after response/JSON awaits prevent stale state and local preference writes. Failed reads still fall back to samples; guest mode still makes no connected requests.
- Kept the six-second notification timer and added an explicit button type to its dismiss action.

The fetch remains inside a lifecycle effect in the extracted hook. React Doctor no longer emits `no-fetch-in-effect` for this shape, but that is not evidence that fetch-on-mount, development Strict Mode duplicate attempts or client loading were eliminated. No query library or server-data migration was introduced just to silence a heuristic.

### Recap presentation boundaries

React Doctor flagged the large and complex PortfolioRecap. Extracted private `RecapGraphic` and `RecapMovers` components in the same file, leaving source selection, calculations and page composition in the parent. Existing DOM structure, CSS classes, chart geometry, copy, links and accessibility labels remain intact. No new user-facing UI component or cross-page abstraction was introduced.

Reviewed repeated chart/card patterns across Home and Recap. Their data sources, geometry, periods and interaction rules differ; merging them in this bounded pass would add conditional props and risk changing the design. The scan did not identify a repeated-JSX cluster requiring that work. The remaining complexity warning is retained rather than splitting every conditional merely to satisfy a threshold.

## Validation

- Starting baseline: the immediately preceding cleanup's `npm run check` passed lint, TypeScript, 97 tests / 21 files and the production build. Its handoff was read before this pass; a fresh full React Doctor scan captured the current checkout before edits.
- Final `npm run check`: lint and TypeScript pass; 108 tests / 23 files pass; production build passes with 40 generated pages.
- Eight new provider regressions cover stable context identity, consecutive edits, cross-tab preference updates, in-memory CSV holdings, functional contribution edits, reset semantics, notification timing, successful connected reads, stale JSON decoding after unmount, Strict Mode obsolete responses and failure fallback. Connected requests use mocks; no live services were enabled.
- Three new Recap regressions cover sample allocation/movers and unavailable monthly performance, example/source switching, and saved negative practice attribution with correct links. Initial test failures were whitespace assumptions in accessible-name queries; selectors were corrected to match the unchanged markup.
- Side-browser checks verified sample allocation, authored example and existing saved practice timeline, then restored the sample view. Existing learning progress and preferences remained present. Desktop visual inspection confirmed the dark card, chart and sidebar presentation. No new mobile breakpoint or full screen-reader audit was performed because markup/styles were preserved; do not describe this pass as a new accessibility certification.
- Existing file hashes were compared against a pre-task snapshot; only intended production/test/docs files changed. Package files, Knip configuration, financial helpers, saved-progress store/schema, legacy website and migrations remain unchanged. The build's generated `next-env.d.ts` is restored to its pre-task bytes. Whitespace checks pass.

## Remaining findings and triage

The complete final findings table follows below. None were suppressed or autofixed. The scan covers 158 source files initially, including preserved classic JavaScript/HTML and SQL; it is wider than the current React route graph.

Priority items for separate review:

1. `supabase-rls-policy-risk`: historical `20260329050432_fix_security_issues.sql` grants broad anonymous waitlist access. The flag corresponds to actual permissive policy text, but deployed database state was not verified. Address through a deliberate database/legacy-auth task and an additive migration, not by rewriting migration history here.
2. `nextjs-no-side-effect-in-get-handler`: the token-validated unsubscribe GET updates email preference. A safer confirmation/POST flow may be appropriate, but changes the existing email integration contract; left intact with email deferred.
3. Deferred auth redirects, account/connection deletion, billing and recap requests have additional security/reentry/error-handling findings. Review them with mocked and approved integration checks in their own scope.
4. Current lesson, Portfolio, practice and research components still have complexity/size warnings. Recap retains date formatter and complexity warnings. Prioritize isolated components based on real change needs rather than broad rewrites.
5. Accessibility/button/key and small lookup/formatter suggestions remain. Several legacy browser-global warnings concern classic scripts intentionally loaded only by HTML; they are not proof that Next imports those scripts. Security sink findings still require trust-boundary review.

The MVP browser store, learning/practice providers and saved-progress arithmetic were inspected but left unchanged. This pass does not claim live integration security or database policy correctness. See [handoff](../handoffs/2026-10-16-react-doctor.md).

## Complete remaining diagnostics

| Severity | Location | Rule | Finding |
| --- | --- | --- | --- |
| warning | `ai-coach.js:218` | `dangerous-html-sink` | HTML is injected from a dynamic-looking source, which can become XSS if the value is user-controlled or unsanitized. |
| warning | `app.js:369` | `no-unguarded-browser-global-at-module-scope` | Reading `window` here crashes with "ReferenceError: window is not defined" the instant this module is imported during SSR — move the read inside a function or effect, or guard it with `typeof window !== "undefined"`. |
| warning | `app.js:421` | `no-unguarded-browser-global-at-module-scope` | Reading `window` here crashes with "ReferenceError: window is not defined" the instant this module is imported during SSR — move the read inside a function or effect, or guard it with `typeof window !== "undefined"`. |
| warning | `app.js:671` | `no-unguarded-browser-global-at-module-scope` | Reading `localStorage` here crashes with "ReferenceError: localStorage is not defined" the instant this module is imported during SSR — move the read inside a function or effect, or guard it with `typeof localStorage !== "undefined"`. |
| warning | `app.js:687` | `js-set-map-lookups` | This scales poorly because `array.includes()` inside a loop scans the whole list every time. Use a Set for constant-time lookups. |
| warning | `app.js:913` | `no-unguarded-browser-global-at-module-scope` | Reading `window` here crashes with "ReferenceError: window is not defined" the instant this module is imported during SSR — move the read inside a function or effect, or guard it with `typeof window !== "undefined"`. |
| warning | `app.js:930` | `no-unguarded-browser-global-at-module-scope` | Reading `window` here crashes with "ReferenceError: window is not defined" the instant this module is imported during SSR — move the read inside a function or effect, or guard it with `typeof window !== "undefined"`. |
| warning | `app.js:948` | `no-unguarded-browser-global-at-module-scope` | Reading `window` here crashes with "ReferenceError: window is not defined" the instant this module is imported during SSR — move the read inside a function or effect, or guard it with `typeof window !== "undefined"`. |
| warning | `app/api/account/route.ts:16` | `async-await-in-loop` | This for…of loop waits before starting the next iteration. If iterations perform independent asynchronous work, consider bounded concurrency; await syntax alone does not establish a speedup. |
| error | `app/api/email/unsubscribe/route.ts:4` | `nextjs-no-side-effect-in-get-handler` | This GET handler on the "/unsubscribe" route performs a side effect (.upsert()) and is prone to CSRF vulnerabilities, since prefetching or a forged request can trigger it. |
| warning | `app/api/plaid/connections/[id]/route.ts:21` | `async-await-in-loop` | This for…of loop waits before starting the next iteration. If iterations perform independent asynchronous work, consider bounded concurrency; await syntax alone does not establish a speedup. |
| warning | `app/api/recaps/[id]/card/route.tsx:8` | `no-high-complexity-react-function` | `GET` has cyclomatic complexity 20, cognitive complexity 34, and maximum nesting depth 3, so its React logic is hard to understand and change. Extract independent branches into components or hooks. |
| warning | `app/auth/callback/route.ts:3` | `url-prefilled-privileged-action` | Client code reads sensitive action state from the URL, which can pre-fill invites, roles, redirects, or sharing flows with attacker values. |
| warning | `app/auth/callback/route.ts:3` | `clickjacking-redirect-risk` | Redirect or framing configuration may let attacker-controlled URLs chain into privileged UI or clickjacking. |
| warning | `components/assistant-client.tsx:122` | `no-array-index-as-key` | Your users can see & submit the wrong data when this list reorders or filters, so use a stable id like `key={item.id}`, not the array index "i". |
| warning | `components/assistant-client.tsx:155` | `button-has-type` | Your users can submit the form by accident because a `<button>` with no `type` defaults to submit. |
| warning | `components/demo-settings.tsx:10` | `button-has-type` | Your users can submit the form by accident because a `<button>` with no `type` defaults to submit. |
| warning | `components/demo-settings.tsx:10` | `dialog-has-accessible-name` | This dialog has no accessible name, so screen readers announce it as just “dialog.” Add `aria-label` or point `aria-labelledby` at its heading. |
| warning | `components/discover-search.tsx:8` | `js-set-map-lookups` | This scales poorly because `array.includes()` inside a loop scans the whole list every time. Use a Set for constant-time lookups. |
| warning | `components/discover-search.tsx:10` | `js-set-map-lookups` | This scales poorly because `array.includes()` inside a loop scans the whole list every time. Use a Set for constant-time lookups. |
| warning | `components/discover-search.tsx:10` | `js-set-map-lookups` | This scales poorly because `array.includes()` inside a loop scans the whole list every time. Use a Set for constant-time lookups. |
| warning | `components/discover-search.tsx:10` | `js-set-map-lookups` | This scales poorly because `array.includes()` inside a loop scans the whole list every time. Use a Set for constant-time lookups. |
| warning | `components/discover-search.tsx:10` | `js-set-map-lookups` | This scales poorly because `array.includes()` inside a loop scans the whole list every time. Use a Set for constant-time lookups. |
| warning | `components/home-dashboard.tsx:142` | `no-high-complexity-react-function` | `HomeDashboard` has cyclomatic complexity 16, cognitive complexity 18, and maximum nesting depth 2, so its React logic is hard to understand and change. Extract independent branches into components or hooks. |
| warning | `components/home-dashboard.tsx:179` | `js-set-map-lookups` | This scales poorly because `array.includes()` inside a loop scans the whole list every time. Use a Set for constant-time lookups. |
| warning | `components/home-dashboard.tsx:187` | `js-set-map-lookups` | This scales poorly because `array.includes()` inside a loop scans the whole list every time. Use a Set for constant-time lookups. |
| warning | `components/learning-library.tsx:35` | `js-set-map-lookups` | This scales poorly because `array.includes()` inside a loop scans the whole list every time. Use a Set for constant-time lookups. |
| warning | `components/lesson-interaction.tsx:95` | `no-high-complexity-react-function` | `LessonInteraction` has cyclomatic complexity 18, cognitive complexity 17, and maximum nesting depth 2, so its React logic is hard to understand and change. Extract independent branches into components or hooks. |
| warning | `components/lesson-interaction.tsx:229` | `no-array-index-as-key` | Your users can see & submit the wrong data when this list reorders or filters, so use a stable id like `key={item.id}`, not the array index "i". |
| warning | `components/lesson-reader.tsx:15` | `no-high-complexity-react-function` | `LessonReader` has cyclomatic complexity 18, cognitive complexity 18, and maximum nesting depth 2, so its React logic is hard to understand and change. Extract independent branches into components or hooks. |
| warning | `components/mvp-settings.tsx:32` | `button-has-type` | Your users can submit the form by accident because a `<button>` with no `type` defaults to submit. |
| warning | `components/mvp-settings.tsx:146` | `dialog-has-accessible-name` | This dialog has no accessible name, so screen readers announce it as just “dialog.” Add `aria-label` or point `aria-labelledby` at its heading. |
| warning | `components/onboarding-flow.tsx:53` | `button-has-type` | Your users can submit the form by accident because a `<button>` with no `type` defaults to submit. |
| warning | `components/portfolio-holdings.tsx:21` | `no-high-complexity-react-function` | `PortfolioHoldings` has cyclomatic complexity 31, cognitive complexity 33, and maximum nesting depth 2, so its React logic is hard to understand and change. Extract independent branches into components or hooks. |
| warning | `components/portfolio-holdings.tsx:21` | `no-giant-component` | Component "PortfolioHoldings" is over 300 lines long, which is hard to read & change. Split it into a few smaller components. |
| warning | `components/portfolio-holdings.tsx:57` | `js-hoist-intl` | This is slow because new Intl.DateTimeFormat() rebuilds on every call inside a function, so move it to the top of the file, or wrap it in useMemo |
| warning | `components/portfolio-holdings.tsx:362` | `click-events-have-key-events` | Keyboard users can't trigger this click handler because there's no keyboard one, so add `onKeyUp`, `onKeyDown`, or `onKeyPress`. |
| warning | `components/portfolio-movement.tsx:17` | `no-high-complexity-react-function` | `PortfolioStory` has cyclomatic complexity 17, cognitive complexity 19, and maximum nesting depth 2, so its React logic is hard to understand and change. Extract independent branches into components or hooks. |
| warning | `components/portfolio-recap.tsx:245` | `no-high-complexity-react-function` | `PortfolioRecap` has cyclomatic complexity 50, cognitive complexity 76, and maximum nesting depth 3, so its React logic is hard to understand and change. Extract independent branches into components or hooks. |
| warning | `components/portfolio-recap.tsx:266` | `js-hoist-intl` | This is slow because new Intl.DateTimeFormat() rebuilds on every call inside a function, so move it to the top of the file, or wrap it in useMemo |
| warning | `components/portfolio-recap.tsx:307` | `js-hoist-intl` | This is slow because new Intl.DateTimeFormat() rebuilds on every call inside a function, so move it to the top of the file, or wrap it in useMemo |
| warning | `components/practice-workspace.tsx:27` | `no-high-complexity-react-function` | `PracticeWorkspace` has cyclomatic complexity 17, cognitive complexity 22, and maximum nesting depth 3, so its React logic is hard to understand and change. Extract independent branches into components or hooks. |
| warning | `components/practice-workspace.tsx:27` | `no-giant-component` | Component "PracticeWorkspace" is over 300 lines long, which is hard to read & change. Split it into a few smaller components. |
| warning | `components/practice-workspace.tsx:396` | `button-has-type` | Your users can submit the form by accident because a `<button>` with no `type` defaults to submit. |
| warning | `components/practice-workspace.tsx:528` | `dialog-has-accessible-name` | This dialog has no accessible name, so screen readers announce it as just “dialog.” Add `aria-label` or point `aria-labelledby` at its heading. |
| warning | `components/production-recap-settings.tsx:9` | `no-fetch-in-effect` | fetch() inside useEffect can race, double-fire, or leak. Use a data-fetching layer or Server Component instead. |
| warning | `components/production-recap-settings.tsx:12` | `no-async-event-handler-without-reentry-guard` | This async handler awaits a mutating request and only flips state after the await, so a fast double-click or double Enter fires the request twice. Add a leading `if (busy) return` guard (or set a flag before the await and disable the control) to close the re-entry window. |
| warning | `components/production-recap-settings.tsx:13` | `no-async-event-handler-without-reentry-guard` | This async handler awaits a mutating request and only flips state after the await, so a fast double-click or double Enter fires the request twice. Add a leading `if (busy) return` guard (or set a flag before the await and disable the control) to close the re-entry window. |
| warning | `components/production-recap-settings.tsx:17` | `no-locale-format-in-render` | This can cause a hydration mismatch because toLocaleDateString() formats with the server's locale and timezone during server rendering but the user's in the browser. Format it in a post-mount useEffect, or pass an explicit locale and timeZone. |
| warning | `components/production-recap-settings.tsx:17` | `dialog-has-accessible-name` | This dialog has no accessible name, so screen readers announce it as just “dialog.” Add `aria-label` or point `aria-labelledby` at its heading. |
| warning | `components/recap-extra-tools.tsx:13` | `no-async-event-handler-without-reentry-guard` | This async handler awaits a mutating request and only flips state after the await, so a fast double-click or double Enter fires the request twice. Add a leading `if (busy) return` guard (or set a flag before the await and disable the control) to close the re-entry window. |
| warning | `components/recap-home.tsx:18` | `button-has-type` | Your users can submit the form by accident because a `<button>` with no `type` defaults to submit. |
| warning | `components/recap-workspace.tsx:18` | `no-high-complexity-react-function` | `RecapWorkspace` has cyclomatic complexity 28, cognitive complexity 28, and maximum nesting depth 2, so its React logic is hard to understand and change. Extract independent branches into components or hooks. |
| warning | `components/recap-workspace.tsx:30` | `no-fetch-in-effect` | fetch() inside useEffect can race, double-fire, or leak. Use a data-fetching layer or Server Component instead. |
| warning | `components/recap-workspace.tsx:30` | `no-promise-then-side-effect-in-effect-without-catch` | This promise chain runs in an effect, ends in a `.then` that sets state or mutates a ref, and has no `.catch` or enclosing try/catch, so a rejection leaves the state unset and surfaces as an unhandled rejection. Add a `.catch` handler on the chain (`.finally` does not count). |
| warning | `components/recap-workspace.tsx:93` | `button-has-type` | Your users can submit the form by accident because a `<button>` with no `type` defaults to submit. |
| warning | `components/recap-workspace.tsx:95` | `button-has-type` | Your users can submit the form by accident because a `<button>` with no `type` defaults to submit. |
| warning | `components/social-leaderboard.tsx:22` | `js-set-map-lookups` | This scales poorly because `array.includes()` inside a loop scans the whole list every time. Use a Set for constant-time lookups. |
| warning | `components/social-leaderboard.tsx:22` | `js-set-map-lookups` | This scales poorly because `array.includes()` inside a loop scans the whole list every time. Use a Set for constant-time lookups. |
| warning | `components/social-leaderboard.tsx:22` | `js-set-map-lookups` | This scales poorly because `array.includes()` inside a loop scans the whole list every time. Use a Set for constant-time lookups. |
| warning | `components/stock-price-chart.tsx:136` | `no-high-complexity-react-function` | `TradingViewChart` has cyclomatic complexity 16, cognitive complexity 14, and maximum nesting depth 1, so its React logic is hard to understand and change. Extract independent branches into components or hooks. |
| warning | `components/stock-researcher.tsx:25` | `no-high-complexity-react-function` | `StockResearcher` has cyclomatic complexity 16, cognitive complexity 15, and maximum nesting depth 2, so its React logic is hard to understand and change. Extract independent branches into components or hooks. |
| warning | `components/stock-researcher.tsx:75` | `button-has-type` | Your users can submit the form by accident because a `<button>` with no `type` defaults to submit. |
| warning | `index.html:1884` | `no-unguarded-browser-global-at-module-scope` | Reading `localStorage` here crashes with "ReferenceError: localStorage is not defined" the instant this module is imported during SSR — move the read inside a function or effect, or guard it with `typeof localStorage !== "undefined"`. |
| warning | `lib/learning-progress.ts:184` | `js-set-map-lookups` | This scales poorly because `array.includes()` inside a loop scans the whole list every time. Use a Set for constant-time lookups. |
| warning | `lib/learning-progress.ts:186` | `js-set-map-lookups` | This scales poorly because `array.includes()` inside a loop scans the whole list every time. Use a Set for constant-time lookups. |
| warning | `lib/learning-progress.ts:191` | `js-set-map-lookups` | This scales poorly because `array.includes()` inside a loop scans the whole list every time. Use a Set for constant-time lookups. |
| warning | `lib/money-story.ts:5` | `js-hoist-intl` | This is slow because new Intl.NumberFormat() rebuilds on every call inside a function, so move it to the top of the file, or wrap it in useMemo |
| warning | `lib/money-story.ts:11` | `js-hoist-intl` | This is slow because new Intl.DateTimeFormat() rebuilds on every call inside a function, so move it to the top of the file, or wrap it in useMemo |
| warning | `lib/practice.test.ts:7` | `no-json-parse-stringify-clone` | `JSON.parse(JSON.stringify(x))` deep-clones by re-serializing: it is slow on large objects and silently drops `undefined`, functions, `Date`/`Map`/`Set`, and cyclic references. Use `structuredClone(x)`. |
| warning | `lib/presentation.ts:4` | `js-hoist-intl` | This is slow because new Intl.NumberFormat() rebuilds on every call inside a function, so move it to the top of the file, or wrap it in useMemo |
| warning | `lib/presentation.ts:46` | `js-hoist-intl` | This is slow because new Intl.DateTimeFormat() rebuilds on every call inside a function, so move it to the top of the file, or wrap it in useMemo |
| error | `supabase/migrations/20260329050432_fix_security_issues.sql:41` | `supabase-rls-policy-risk` | Supabase policy SQL disables RLS, permits writes broadly, or references a service-role bypass. |
