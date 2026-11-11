# Phase 9 — technical requirements audit

Bounded fixes: CornerstoneReward emits data-started only for an incoming stone, avoiding environment-dependent attributes on static SSR/hydration markup. Added server-rendered markup equivalence regression with/without IntersectionObserver. Saved-ideas imports valid unique prototype bookmarks from the earliest unscoped key only into original guest generation zero when no scoped record exists; explicit current empty data wins, old record remains untouched, reset/account namespaces never import it. Malformed legacy data safely yields empty bookmarks. Existing owner/reset-scoped keys unchanged.

Evidence against requirements:
- package.json/package-lock.json diff empty; no new dependencies or service/API.
- Auth/Supabase/API/migrations, lib/lessons.ts, learning-progress.ts, portfolio.ts and legacy static entry files have empty diff. No curriculum/achievement/progress/portfolio deletion or arithmetic changes.
- Existing createBrowserStore used for persistence and session/recovered feedback. Guest/account boundaries and reset semantics preserved. No schema migration or credential changes.
- Components and CSS modules own foundation/reward; transform/opacity animation, one visibility observer disconnected after start, bounded fallback timer cleared on cleanup. No render-time storage calls in component markup, no animation-driven rewards, no animation loop or heavy 3D dependency.
- Existing licensed local fonts, Radix Sheet/Switch, native forms/progress/disclosures and semantic tokens retained. Prior desktop/390px checks documented in phase handoffs. Keyboard skip focus retained; saved/device reduced motion supported.
- Loading/error/retry, source/date/sample/fictional labels and investment-return caveats preserved. Existing tests exercise storage faults, empty data, auth isolation, quizzes, arithmetic and accessibility.

Validation below. Limits: no profiling/performance budget benchmark, all-route hydration audit, assistive-technology certification, live auth/provider integration or cross-device account verification. These remain explicit scope limits rather than inferred readiness. User work preserved; no commit/deployment.

Files: components/cornerstone-reward.tsx and .test.tsx, lib/saved-ideas.ts, components/saved-ideas.test.tsx, saved-ideas-migration.test.tsx, context/handoff. No unrelated engineering expansion.

Final validation: full regression 314 tests / 59 files pass; focused migration and static-render checks 9 tests / 2 files pass (includes three additional migration tests). Lint/typecheck/build (43 pages)/diff check pass. Full run used 2 workers and 10-second command-line timeout; no test config/dependency changes.
