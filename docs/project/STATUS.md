# Current state

## Home Pro view, Step E — 2026-10-19

Added the persisted, default-off Pro view switch in Settings using the existing Switch and cornerstone-demo-v1 preference schema. Pro Home has a scoped dark forest presentation, smaller type, system monospaced tabular figures, compact chart rows and a dated read-only holdings contribution table. Row percentages use portfolio starting value, with three-decimal presentation and an unrounded-total note. Standard Home, other pages, math and content remain unchanged.

Full npm run check passes lint, TypeScript, 206 tests / 38 files and production build (41 routes). Browser verified keyboard toggle, persistence after reload, 375px/1280px without overflow, monospaced figures, compact chart targets at least 48px, unchanged Portfolio while enabled, and return to standard Home. Table/caption contrast exceeds 8:1; no captured console errors. Original Pro-off preference restored. No dependencies, AI work or Step F changes. See handoffs/2026-10-19-home-weekly-step-e.md.

## Home weekly replay/share, Step D — 2026-10-19

Implemented the Home-only Replay your week four-card modal with existing Radix dialog primitives, 300ms card entrance, touch swipe/tap halves, arrows/dots, Escape and trapped/restored focus. Story uses one opening snapshot. Last card shows a static catalog-derived wall and local Canvas share preview. Fresh previews hide dollar amounts and holding tickers; opt-in adds weekly dollars and main ticker contribution. 1080×1350 PNG includes original fonts, weather, headline, percent and wall with separate price/learning dates. File Web Share is conditional; no data upload or new storage/dependencies.

Final npm run check passes lint, TypeScript, 202 tests / 37 files and production build (41 routes). Browser verified all four cards, focus wrap/Escape restoration, 375px and 1280px layouts, 44px controls, saved reduced-motion override and no captured console errors. Actual private/opted-in PNGs downloaded and inspected; turning privacy back off produces a byte-identical private PNG. Native sharing is tested with a mocked file-share API; no recipient/system share was invoked. Math, lesson content, other pages and progress unchanged. E/F and AI remain deferred. See handoffs/2026-10-19-home-weekly-step-d.md.

## Home cumulative wall, Step C — 2026-10-19

Home now has catalog-driven rough stone slots in staggered courses, deterministic lesson-ID widths/tints, solid textured completed stones, outlined unlaid slots and real count/date tooltips. Existing learning is authoritative; first visit quietly adopts existing completions. New IDs since the last Home visit lay once in sequence with 24px drop, subtle settle and fading lime outline, announced through a polite live region. Receipts live in cornerstone-wall-seen-v1. Sequence waits for hydration, price loading, chart entrance and wall visibility; saved/device reduced motion makes it instant.

Action now says Start your 2-minute lesson; the matching current-week lesson receipt plus actual learning completion replaces it with This week’s stone is laid. See you Monday. Fixed the audited overly broad completion selector. Removed Home's Continue learning row to match the requested order; other pages and lesson content remain untouched.

Final npm run check passes lint, TypeScript, 191 tests / 35 files and production build (41 routes). Actual isolated production-browser sample walkthrough completed a lesson, laid/announced one stone, and reloaded without replay; primary browser learning/holdings preserved. Browser verified 375/1280 widths, no overflow, 64px stone targets, focus/date/Escape, and no captured console errors. New caption/tooltip text contrast exceeds 4.5:1; outlined empty slots exceed 3:1. No dependencies or financial math changes. See handoffs/2026-10-19-home-weekly-step-c.md.

## Home tug-of-war chart, Step B — 2026-10-19

Home's dated weekly hero now includes one native SVG/CSS diverging bar per holding, sorted by absolute contribution without changing shared math. Warm sand marks negative contributions, sage positive; signed amounts and Pulled down/Lifted text provide non-color signals. Keyboard focus, pointer hover or tap exposes dated start/end prices, shares and contribution. Escape/blur dismiss details; a hidden complete text list provides an equivalent.

Full npm run check passes lint, TypeScript, 181 tests / 34 files and production build (41 routes). Browser checked 375px/1280px without horizontal overflow, 64px targets, visible focus, Escape, 400ms growth/60ms stagger and existing Reduce motion preference disabling all four animations. Preference restored; no captured console errors. No dependencies, weekly math, lesson content, storage schema or other-page source changes. Step C wall and completion-selector correction remain deferred. See handoffs/2026-10-19-home-weekly-step-b.md.

## Home Weekly editorial, Step A — 2026-10-19

Home now has The Cornerstone Weekly masthead, actual close-date edition range and dated source badge, Newsreader headline and a static labeled hand-drawn SVG weather icon. Home-only presentation thresholds and short deterministic attribution are in lib/weekly-editorial.ts. Down/flat copy retains calm week-to-week context, signed dollars use the true minus, and the saved-completion Home has 44 visible words. Scoped CSS retains the existing palette and keeps lime out of the done message.

Full npm run check passes lint, TypeScript, 177 tests / 33 files and production build (41 routes). Browser verified 375/1280 layouts, serif font, no horizontal overflow, 44px Continue learning target, visible keyboard focus and no captured console errors. No dependency, math, lesson content, storage or other-page changes. Step A only: completion-selector tightening, chart, wall, story, Pro view and state polish remain for their requested steps. See handoffs/2026-10-19-home-weekly-step-a.md.

## Grant MVP Phase 2: weekly loop — 2026-10-19

Implemented persisted ticker/share holdings with optional total cost basis, CSV/manual/sample input and JSON export/import. New server-only historical-close adapter and POST /api/prices/history use TWELVE_DATA_API_KEY when configured; otherwise the complete response is a labeled dated sample. Common-date weekly arithmetic and deterministic driver/offset copy feed the same snapshot on Home, Portfolio and Ask. Home contains only Your week, one related-lesson action and Continue learning. Linked lesson completion persists a weekly done state, survives reload, reopens Monday in the saved timezone and does not duplicate lifetime lesson XP. Empty/short/missing history returns the input options rather than invented values. This supersedes the older memory-only CSV and broad Home directions.

Final npm run check passes lint, TypeScript, 160 tests / 32 files and build (41 routes/pages). Browser verified the full sample lesson loop and reload, input methods, JSON round trip, consistent weekly values, missing-ticker fallback and responsive Home. Protected lesson-content and package hashes are unchanged. No live key is configured; the live adapter has mocked-response verification only. Requested 2 min CTA retains existing 3–4 minute lesson metadata. No new dependencies, commit or deployment. See [Phase 2 handoff](handoffs/2026-10-19-grant-phase-2-weekly-loop.md).


## Grant MVP Phase 1 cleanup — 2026-10-19

User-requested navigation is now Home, Learn, Portfolio and Ask. Recap is folded into Portfolio; Social/Recap routes remain intact but unlinked from primary navigation. Home has one tile per lesson and a dated value summary; the only allocation donut is in Portfolio. Progress uses the learning store and the name lessons. Ask is Guided Q&A using the shared sample/imported holdings, with its not-live-AI disclosure. Cornerstone+ and repeated sidebar cards are hidden. Discover retains the provider chart without authored numbers/headlines/relationships/flames beside it. CSV preview requires an explicit price date; neutral loss styling and source/date labels are preserved across the active data views.

Final npm run check passes lint, TypeScript, 131 tests / 28 files and production build (40 pages). Browser verified desktop/mobile representative layouts, real saved progress, four-item drawer and Escape focus restoration, source-correct Ask, loaded chart and matching practice recap. No dependency or lesson-content changes. No weekly history, connected service or grant launch claim. Work remains uncommitted. See [Phase 1 handoff](handoffs/2026-10-19-grant-phase-1-cleanup.md).


## Axe accessibility regression gate — 2026-10-16

Added pinned development-only axe-core 4.14.0 and six Vitest tests: five representative UI flows plus a scanner negative control. Normal tests/CI include the gate; `npm run test:a11y` runs it alone. Fixed distinct site/Settings complementary-landmark names and the Settings reset dialog's accessible name. No visual, financial, storage-schema or production dependency changes.

Lint, TypeScript, 126 tests / 27 files and production build (40 pages) pass. Keyboard/focus checks and sampled rendered contrast checks supplement JSDOM; its unsupported contrast rule is explicitly excluded. Scanner absent from production dependency tree/browser assets; Knip findings unchanged. See [guide](ACCESSIBILITY.md) and [handoff](handoffs/2026-10-16-axe-accessibility.md) for coverage and limitations. No full accessibility-compliance claim, commit, push or deployment.

## Lightweight Charts data review — 2026-10-16

Deferred installation after reviewing official 5.2 documentation/attribution and saved practice records. The current run has one dated checkpoint; its opening balance has no saved date. Checkpoint timestamps record user advances, while scenario weeks can occur on the same real day. Existing ordinal practice SVG remains; no dates/history were invented. Discover's hosted TradingView widget, data and attribution remain unchanged.

Documentation-only updates; 19 existing tests / 5 files pass for practice, Recap and hosted-chart behavior. Source/package preservation, documentation links and whitespace checked. See [review handoff](handoffs/2026-10-16-lightweight-charts-review.md) for missing data requirements, honest axis options and future attribution/accessibility safeguards. No commit, push or deployment.

## TanStack Table evaluation — 2026-10-16

Retained the native Portfolio holdings table after reviewing current official TanStack v9 guidance. Five fixed columns have no existing sort/filter logic to replace, and Explore shares one selected symbol with the chart/contributor panels. A migration would add column/row-model wiring without verified simplification. No installation or application changes. Revisit for demonstrated coordinated sorting/filtering needs or measured large-import usability issues.

Existing focused financial/CSV/selection tests pass (9 tests / 3 files). Browser verifies Explore focus transfer, Escape, visible keyboard focus and contained table scrolling at 320/390/768/1440 widths. Documentation links, whitespace and source preservation checked. See [evaluation handoff](handoffs/2026-10-16-tanstack-table-evaluation.md) for future numeric-sort safeguards and limits. No commit, push or deployment.

## Tremor contributor visuals — 2026-10-16

Added one reviewed/source-adapted Tremor Raw BarList, shared by Portfolio and Recap with Cornerstone light/dark styling and retained Apache-2.0 license. Reuses the shared `cn` helper and existing native interactions; no package changes. Signed financial contributions, ranking, source/period labels, missing monthly history, examples and saved practice remain intact. Fixed hidden Recap card scrolling exposed by keyboard focus.

Lint, TypeScript, 120 tests / 26 files and final production build (40 pages) pass. Both routes fit 320/390/768/1440 widths; keyboard selection/Escape and link focus checked. Knip findings unchanged. Measured route-manifest gzip JS increases are 647 bytes (Portfolio) and 594 bytes (Recap); CSS increases are 2,050 and 4,171 bytes including shared-style rebundling. See [handoff](handoffs/2026-10-16-tremor-contributors.md) for licensing, method, scope and limitations. No commit, push or deployment.

## shadcn/ui first shared-control migration — 2026-10-16

Added reviewed/adapted Sheet and Switch primitives with scoped Cornerstone styling. Mobile navigation now delegates focus trapping, Escape, modal isolation and scroll locking to Sheet; desktop and mobile share the same eight destinations. Settings' Reduce motion control uses Switch and keeps the existing saved preference. Portaled navigation explicitly respects local and device reduced motion. Existing global styles, fonts, financial/progress logic and other controls are preserved.

Lint, TypeScript, 114 tests / 25 files and production build (40 generated pages) pass. Keyboard focus/dismissal, resize cleanup, preference persistence and mobile/desktop layouts were checked in the side browser; Knip findings are unchanged. See [handoff](handoffs/2026-10-16-shadcn-shared-controls.md). No commit, push or deployment.

## React Doctor bounded refactor — 2026-10-16

React Doctor 0.9.18 ran with telemetry, score/share API and supply-chain lookups disabled. Stabilized DemoProvider's preferences/actions/context and isolated contribution loading with abort/late-response guards. Split Recap's chart and movers into private components with unchanged DOM, copy, calculations and styling. No storage schema, dependency, legacy or deferred-feature changes.

Final lint/TypeScript, 108 tests / 23 files and production build (40 generated pages) pass. Side browser verified all three available Recap modes and retained existing progress. Static findings changed from 76 to 73; 2 existing server/database errors remain for separate review. See [report](reports/2026-10-16-react-doctor.md) and [handoff](handoffs/2026-10-16-react-doctor.md). No commit, push or deployment.

## Knip baseline and conservative cleanup — 2026-10-16

Added pinned Knip 6.41.0 with Next.js defaults and explicit legacy HTML script/style and test entries. Removed six unnecessary export markers while retaining implementations. No files or existing dependencies were deleted or upgraded; deferred integrations remain intact. Knip reports 3 retained files, 5 retained value exports and 8 retained type exports, with zero unused dependencies. Its expected exit status is 1 while these reviewed findings remain visible.

Before/after `npm run check` passes lint, TypeScript, 97 tests / 21 files and production build (40 generated pages). Existing checkout work preserved; no commit, push or deployment. See [report](reports/2026-10-16-knip.md) and [handoff](handoffs/2026-10-16-knip-baseline.md).

## Dark surfaces and Recap movers — 2026-10-13 (latest)

Implemented eight browser comments across Home, Learn, Portfolio and Recap. Home's dark portfolio card puts a large View portfolio button beneath the pie. Learn's main invitation is bold, dark and high contrast. Portfolio has an emphasized result inset, a dark allocation workspace, simplified pie-center value/context, separate growth capsule and explicit Explore buttons in dark holding rows.

Recap includes source-derived update dates and top absolute price contributors. Practice attribution uses holdings owned before the last simulated week, even after later trades; no live feed or monthly history is implied. Status pulse stops after three cycles and respects reduced motion. Examples remain labeled and have no fabricated stock history.

Validation: lint, TypeScript, 97 tests in 21 files, production build (40 pages) and diff whitespace checks pass. Four updated routes fit 320/390/768/1543 widths without page-wide overflow. Keyboard Home navigation, holding selection/focus, green/red contrast and Recap modes were verified. See [handoff](handoffs/2026-10-13-dark-surfaces-recap-movers.md).


## Portfolio, monthly Recap and Cornerstone+ — 2026-10-12 (latest)

Portfolio leads with a dark, source-labeled Cornerstone perspective and direction-colored change figures. Rotating headings have pause/reduced-motion support and preserve snapshot periods. The allocation center uses smoother numbers and displays growth versus complete recorded cost. Dark totals/reporting cards and keyboard-operable holdings rows improve exploration.

Recap centers on a large dark portfolio card: honest unavailable-month state, explicitly fictional example-month preview and separate saved practice timeline. Learning history, milestones and existing nonfinancial sharing remain below in a disclosure. Assistant has a subtle Cornerstone+ future-plan concept without purchase, pricing or sign-up flows.

Validation: clean lint, TypeScript, 94 tests / 20 files and production build (40 generated pages). Browser checks cover updated routes at 320/390/768/1543 widths, contained table scrolling, keyboard holding selection/focus, preview Escape/focus restoration, Assistant answers, Recap source changes and retained learning history. No live monthly history, AI, paid service or investor-type classification was introduced. See [handoff](handoffs/2026-10-12-portfolio-recap-plus.md).


## Four-page follow-up — 2026-10-12 (latest)

Portfolio now defaults to Inspect sample with the pie first. Social restores the original placeholder leaderboard unchanged. Discover is a stock researcher with an attributed no-key TradingView embed, interactive example fallback, ticker search/URL selection, explicitly illustrative news/figures/relationships and headline-linked example heat signals. Home has the requested completion-grid/portfolio split, cash-inclusive paper allocation, explicit period availability and a local personalized recap.

Checks pass: lint, TypeScript, 86 tests / 18 files and production build (40 generated pages). Browser checks cover the four updated routes at 320/390/768/1304 widths with no page-wide overflow, provider chart data, example controls, ticker reload, missing-data panels, default pie and sample/practice Home changes. The saved previous Social component and current component have identical SHA256 hashes.

The user explicitly requested these changes; they supersede the immediately previous Home layout and text-only Social preview. Learn and the other features remain unchanged. See [follow-up handoff](handoffs/2026-10-12-research-home-followup.md) for scope, source/data decisions and test instructions.


## Learning-first interactive MVP — 2026-10-12

The current MVP now leads with a daily learning invitation and optional one-screen onboarding. Six original lesson URLs contain interactive challenges, code-native graphics, specific feedback and saved steps. Versioned local learning records support idempotent XP, daily reviews/goals, optional gentle streaks and milestones. Portfolio contains three fixed fictional-money scenarios with order previews, cash/cost-basis arithmetic, saved history and reflections; sample/CSV inspection remains secondary. Recap shows actual local learning/reflection history and selected-content, nonfinancial sharing.

All eight routes remain, with distinct responsibilities. Discover uses one research catalog, Social is a future-feature preview, the free calculator has one lesson anchor, and connected promotions/automatic contribution requests are disabled by default. The legacy static site remains intact.

Validation: lint, TypeScript, 76 tests in 15 files and production build pass (40 generated pages). Browser checks cover all eight routes at 320/390/768/1440 widths with no page-wide overflow, lesson retry/resume/completion, practice reflection/reload, menu focus restoration and private sharing. Final cold production mobile Lighthouse scores: 91/92/92, median 92.

Next.js/eslint-config-next are pinned to 16.3.8; targeted transitive security updates leave zero production advisories. The full audit still reports five high entries from one development-only braces chain; latest upstream 3.0.3 remains affected. The five-student usability study and full screen-reader validation are not performed. Do not claim external-launch readiness while release gates remain. See [handoff](handoffs/2026-10-12-learning-first-mvp.md).


## Home, Portfolio and Discover clarity pass — 2026-09-22

The Portfolio allocation chart now leads the Portfolio workspace, before totals and the movement explanation. Home replaces the former Recap promo with an inline portfolio-aware assistant that answers from the existing curated demo logic and current portfolio math, with a link to the full Assistant. Discover now states the country-concentration lesson directly in its headline, supporting explanation and chart labels.

Validation passed: lint, TypeScript, 53 tests across 10 files and the production build (39 generated pages). Browser checks confirmed chart-first Portfolio order, the inline Home answer flow and the revised Discover explanation on port 3000. The assistant remains curated and local; it is not a live model or market feed.

## Home movement timeframe — 2026-09-16

Home now labels its lead story “Latest available change” and includes “today” in the headline, matching the previous-close data actually available. Moves of 5% or more use “A bigger move up/down today” so an unusual daily change receives clearer emphasis without being described as weekly performance.

## Recap at your own pace — 2026-09-15

Recap now shows a portfolio snapshot and allocation ring, a learning card, neutral total/latest contributions, and optional activity history, manual controls, a session-only target, private sharing and scenario tools. Monthly contribution comparisons, streak celebrations, campus percentiles and the automatic Home slideshow are removed from the visible flow. Home now links to the overview without a monthly contribution headline. This supersedes the cadence-focused design notes below.

Confirmed sample add/edit operations update the neutral totals; optional goal pause hides the progress bar. Share canvases use the current in-memory values and exclude amounts unless revealed. Tests cover empty states, separate withdrawals, paused targets, no Home modal and hidden/revealed share rendering. See `handoffs/2026-09-15-recap-own-pace.md` for validation and limitations.

## Cornerstone Recap implementation — 2026-09-04

The current Next.js app now includes Cornerstone Recap on Home and at `/recap`. The synthetic story leads with $240 contributed in September and a three-month streak. A seven-step first-visit monthly recap covers the closed month, streak calendar, milestone, month-over-month change, compounding education, privacy-gated campus comparison and a downloadable share card. Amounts start hidden; the eye control and generated PNG stay synchronized.

The sample workspace supports suggested-activity confirmation/exclusion, manual contributions and withdrawals, duplicate warnings with explicit override, edit/delete controls, three-month free history, Pro history/range/milestone/scenario previews, encouraging zero-month language and visible source labels. Browser checks exercised all recap steps, amount privacy, suggestion confirmation, duplicate handling, manual add/edit/delete controls, Pro expansion and the signed-out billing guard.

Production code now includes normalized contribution records, immutable revisioned monthly/weekly snapshots, server-mediated RLS reads, Plaid Link exchange/encrypted token storage/24-month pagination/webhook verification/revocation, Stripe Checkout/Portal/signature-verified entitlement webhooks, Resend opt-in monthly delivery/unsubscribe/idempotency, campus-domain verification and suppression, private image generation, connection removal and full account deletion. An hourly Vercel job evaluates 9:00 a.m. in each saved timezone. Analytics accepts only a small event-name allowlist with no properties.

The additive migration is `supabase/migrations/20260904000000_cornerstone_recaps.sql`; pgTAP RLS/idempotency cases are under `supabase/tests/`. The production migration has not been applied and Supabase, Plaid sandbox, Stripe, Resend, scheduled delivery and live webhook registration have not been integration-tested because this checkout has no approved configured test services. Do not enable external accounts, billing or email until those checks pass. See [Cornerstone Recap handoff](handoffs/2026-09-04-cornerstone-recap.md).

## Student demo completion — 2026-09-03

The current local Next.js demo has a consistent student-focused visual system and connected interactions across Home, Portfolio, Discover, Social, Learn, Assistant, onboarding, Settings and sign-in. Profile preferences, lesson progress, bookmarks and follows persist in this browser; CSV financial data stays in memory only. Fonts are now bundled locally, removing the build-time Google Fonts dependency. No dependency installation was necessary.

Final `npm run check` passed: lint, TypeScript, 17 tests across three files and production build (23 generated pages). Browser checks covered desktop and 390px layouts, mobile focus/Escape, donut interactions, research/save/filter flows, student following, all six lesson quizzes, calculator controls, preferences/reload/reset, sample launch and invalid/valid synthetic CSV preview through Home/Portfolio/Assistant. All nine main routes and six lesson paths returned 200; unknown lesson displayed the recovery page. The example CSV returned 200.

Sign-in validation and fallback code were checked without sending an email. Real authentication, brokerage linking, database persistence, live prices, real community data and external AI remain unverified or unavailable. No deployment or commit was made for this demo task. See [student demo handoff](handoffs/2026-09-03-student-demo.md). The baseline and earlier task records below are historical.

## Git baseline update — 2026-09-03

The user subsequently authorized committing and pushing the local modernization and project context to GitHub. The commit containing [this handoff](handoffs/2026-09-03-github-baseline.md) captures that shared baseline on main. The uncommitted-state descriptions below are historical observations from the earlier context-only setup. Feature gaps remain unchanged. Local logs and private environment files are excluded from Git.

For the baseline task, lint, TypeScript, all six tests, production build and dependency audit passed (zero dependency findings). The local site returned HTTP 200 on port 3001. No live integration or deployment was performed. Verify remote commit identity before starting a new worktree.

Inspection date: 2026-09-03. Re-check the code and Git state at the beginning of each task.

## Workspace baseline

- Repository: Cornerstone-Finance; remote: `https://github.com/Cheesemystery/Cornerstone-Finance.git`.
- Local checkout at inspection: `C:\Users\abrah\Documents\Codex\2026-09-02\my-website-code-is-in-a\Cornerstone-Finance`.
- Branch: `main`; inspected HEAD: `2b69bd9` (Fix What-If Simulator dark theme).
- Existing tracked modifications: `.gitignore`, `cyberpunk-theme.css`, `package.json`, `package-lock.json`.
- Most Next.js source, configuration, security docs, CI definitions, and the newest migration were untracked before the context setup.
- No existing changes were committed, reverted, moved, or discarded by this context-only setup.
- This folder was not listed as a saved local app project during setup. Add/open this exact repository folder for future site tasks, rather than creating another empty projectless folder.
- Until the modernization and context files are intentionally saved into Git, a fresh clone or worktree from committed main will not contain this local state.

## Implemented versus scaffolded — refreshed 2026-09-03

| Surface | Verified from source |
| --- | --- |
| Home / portfolio | Shared sample or in-memory CSV holdings; deterministic totals, interactive donut, details and briefing |
| Discover | Hypothetical profile scenarios, issuer links, searchable curated research, local bookmarks; no live news feed |
| Social | Six fictional student profiles, simulated rankings, search/strategy filters and locally saved following |
| Learn | Six complete lessons, quizzes, local completion progress and a hypothetical growth/fee calculator |
| Assistant | Curated educational demo guide with current portfolio arithmetic, prompts and chat reset; no model integration |
| Sign-in | Supabase magic-link request/callback code; live service not tested |
| Onboarding | Three-step profile setup, sample launch, local CSV validation/preview/use and honest unavailable-linking dialog |
| CSV parser | Integrated; quoted cells, duplicate/invalid-value checks and bounded import size |
| Plaid | Link-token creation only, not full account linking or sync |
| Settings | Browser-local profile/preferences, compact switch, privacy details and confirmed demo reset |
| Database | Migration files only; deployed schema and policy behavior not verified |
| Monitoring | Optional initialization code; external configuration not verified |

## Important open questions — not approved implementation tasks

1. Which implementation and domain are currently deployed? Confirm before altering hosting or removing legacy files.
2. Which further campus competition features should follow the restored fictional Social preview?
3. When should the new student-demo changes be reviewed and committed? The earlier modernization baseline is already committed.
4. What is the intended end-to-end portfolio import/connection/persistence lifecycle?
5. Which live data providers should replace the explicitly labeled sample portfolio and curated research before beta?
6. What backend must support real account deletion, synced preferences, quotas and integration failures?
7. How will cross-user authorization, provider sync, webhooks and source freshness be tested before external use?

Security and beta release gates remain in SECURITY.md and BETA.md. This source inventory is not a security audit or production-readiness certification.

## Verification record

Context setup changes only Markdown documentation and agent guidance. Baseline checks and documentation validation are recorded in [setup handoff](handoffs/2026-09-03-workspace-context.md).

No live auth email, provider connection, remote database change, dependency installation/upgrade, build deployment or Git push was performed.

## Maintenance

Replace stale statements when behavior changes; date the verification and cite files or tests. Keep unresolved possibilities separate from confirmed behavior. Do not mark a planned feature as implemented just because a page, schema, environment variable or package exists.

## Discover and Social update — 2026-09-03

Discover now includes explicit profile-preview scenarios (U.S.-only and international exposure), issuer-linked VXUS/IXUS research cards, and query-aware sample headline search. Scenarios are not inferred from holdings; the existing sample portfolio already includes VXUS. No live recommendation service was added.

Social is restored as a Next.js route with fictional college profiles, investment strategies, simulated-return rankings, name/college search, strategy filters, and expandable profiles. Legacy files remain untouched. Public profiles and real ranking data remain future work.

Lint, typecheck and production build passed. Browser checks covered both desktop pages, 390px layouts without horizontal overflow, scenario switching, research search, social filters/empty state, profile expansion and mobile navigation. See handoffs/2026-09-03-discover-social.md.

## Discover clarity and Portfolio chart — 2026-09-03

Discover now leads with a large, plain-language takeaway, brighter lime accents, example-profile buttons, and simpler fund cards. Both examples remain explicitly hypothetical.

Portfolio now has an interactive holdings donut, matching holding colors, a total-value/day-change summary, selected holding details, cost-basis gains/losses when available, and links to Discover research. All values derive from the existing sample snapshot and deterministic calculations. The former inactive Connect or import button now links to the existing onboarding page; no new import backend was added.

Validation: lint and typecheck passed; all six existing tests passed; final production build passed. Desktop and 390px mobile layouts inspected; no page-level horizontal overflow. Verified direct slice click, keyboard selection, legend selection, reset/Escape, profile example switching, and research query handoff. An SVG title hydration mismatch was fixed and a fresh page load showed no new hydration error. See handoffs/2026-09-03-discover-clarity-portfolio-chart.md.

## Home and Portfolio story — 2026-09-10

Home now uses `lib/money-story.ts` and `components/home-dashboard.module.css` for a single narrative with visible previous-close change, calm down-period context, and one primary action. Compact contribution/lesson sections and a finite closing message replace the competing CTAs, statistics, community promotion and automatic recap interruption. Existing Recap and other destinations remain accessible.

`components/portfolio-movement.tsx` adds ranked dollar contributions above the holdings chart. Selecting a contribution also selects its holding in the chart. Reporting explicitly states the lack of verified articles and offers a direct Yahoo Finance news link; it does not republish sample fixture headlines as real reporting.

Weekly performance, long-term charts, scheduled reminders and automatic daily price updates require data/services beyond this snapshot implementation. They are not represented as available. See `handoffs/2026-09-10-home-money-story.md` for verification.

## Home restoration — 2026-09-10

At the user's request, restored `components/home-dashboard.tsx` to its prior version and removed the redesign-only CSS module. Earlier Home redesign notes are superseded. Portfolio movement UI, attribution helper/tests and external news links remain. See `handoffs/2026-09-10-restore-home.md`.

## Home learning map icons — 2026-10-13

Home now shows 24 book icons in a six-column map, four per existing lesson. The completion count and saved learning behavior remain tied to the six actual challenges. Lint/TypeScript and desktop/mobile browser checks pass. See [handoff](handoffs/2026-10-13-home-learning-map-24-icons.md).
