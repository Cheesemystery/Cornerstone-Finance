# Task handoff — Phase 4 Recap and guest reliability

Date: 2026-11-07
Status: implemented; ready for review
Area: Recap, Portfolio learning entry and guest persistence
Checkout: Cornerstone-Finance; changes remain uncommitted alongside Phases 1–3.

## Objective and scope
User selected Recap access and guest-learning reliability for Phase 4. Account activation, live integration, new lessons and financial redesign remain outside this phase. Existing local server startup reported the project already running at localhost:3000; no assumed 3001. Isolated production preview ran on its reported localhost:3008.

## Changes and reasons
- LearningSummary now shows the same authoritative six-lesson count and derived brick count, latest actual activity/date, and Resume/Continue/Review as appropriate. Singular brick wording is fixed. Undated legacy completions are explicitly undated; dates are never invented.
- /portfolio#recap always has a visible learning summary and direct /recap link, including empty, loading, insufficient and error price-history states and fictional practice. The anchor receives focus/scroll on direct navigation and hash changes. Learning history/sharing requires only one disclosure. The financial recap remains separate with its existing source/date/missing-history language, without nested duplicate learning history.
- LearningRecap orders real events by timestamp and uses semantic time elements. Existing milestones, optional nonfinancial sharing, palette, fonts, cards and four-item primary navigation remain.
- The browser store accepts optional reconciliation/recovery hooks, used only for guest learning. Active tabs reconcile known lesson completions, dated events, lesson steps and checked quiz receipts. Incoming preferences remain current. Storage-event repair writes only if needed; a failed repair reports session-only persistence and retains usable memory.
- Added resetGeneration (default zero) to the existing learning schema as an explicit reset receipt, not a progress total. Settings reset increments it so older tab receipts cannot resurrect intentionally cleared lessons. Older valid records migrate with generation zero. Other browser stores retain their original replacement behavior.
- Guest recovery retains valid fields, individual valid quiz/step receipts, dated events and known completions from partially invalid records, with the existing recovered-storage notice. If saved JSON cannot be parsed, existing legacy migration can still recover valid older completions without dates. Full/blocked writes preserve working session state and do not claim it is saved.

## Files
components/learning-summary.tsx, learning-recap.tsx, portfolio-workspace.tsx, portfolio-recap.tsx, mvp-provider.tsx; lib/browser-store.ts, learning-progress.ts, new guest-learning.ts. New tests: lib/guest-learning.test.tsx and components/learning-recap-access.test.tsx; expanded existing accessibility.test.tsx. Project context updated below.

No edits to protected lesson/activity definitions, calculator implementation, dependency files, Home presentation, account APIs, prepared migrations or legacy static site in this phase. Account gates stay disabled. No new dependency, deployment, commit or push.

## Checks
Final npm run check passes lint, typecheck, all 287 tests in 53 files and production build. Explicit npm run test:a11y passes 7/7. Whitespace and lesson/calculator/dependency preservation checks pass. Logs: work/phase4-*.log.

Meaningful new automated coverage: Recap under all five price-history statuses, practice switch, latest timestamp after out-of-order delivery, undated/all-six review state, hash-target focus; competing tab completion receipts and reset precedence; fresh-store restart/resume; quota/session fallback; partly corrupt record recovery and legacy recovery after malformed JSON. Existing weekly matching-receipt, quiz gating/resume, one-time rewards, account-isolation and sharing tests remain green. Accessibility suite now scans the actual Portfolio learning recap without holdings, closed and open history.

## Browser walkthrough
Used only isolated localhost:3008 for new learning and preference changes. Original localhost:3000 user data remained untouched.
1. Opened /portfolio#recap with zero holdings/history: zero-of-six summary and learning action were visible, anchor focused, no financial setup required.
2. Opened a second tab on /recap. Completed Read past the headline with keyboard controls; refreshed after checked question one and resumed question two. Completion produced one building brick. The other tab updated automatically to one lesson/one brick and the actual completion date.
3. Returned to /portfolio#recap: same dated summary. Opened learning history with Enter; actual lesson/date appeared in one disclosure.
4. Closed both preview tabs, restarted only the isolated preview with the final build, and reopened /recap. One saved lesson/brick/date remained.
5. Recap at 320, 390, 768 and 1280 widths: no document overflow; main lesson action measured 44px tall. Restored viewport.
6. Enabled saved Reduce motion on the isolated origin and reopened completion: reduced-motion attribute true, zero incoming animated bricks. Restored the test preference to off.
7. Left /recap visible on localhost:3008 with the verified one-lesson state. Screenshots: phase-4-recap.png and phase-4-portfolio-recap.png in the current chat outputs.

## Limits and next step
Browser tab close/reopen was verified, not a full browser-process restart. Full/blocked/corrupt storage, reset races, genuinely simultaneous writes and loading/error Recap states were tested automatically, not injected manually into the browser. The real-browser cross-tab check verified delivery of a completion while both tabs stayed open. Reconciliation relies on storage-event delivery; localStorage does not provide atomic cross-tab transactions, and abrupt shutdown before reconciliation is not claimed loss-proof. Device-level reduced motion remains covered by existing automated tests; this browser pass verified the saved preference. No live account/Supabase checks or activation occurred; Phase 3's blockers remain.

Review this phase before expanding. No required code work remains for the selected bounded scope. Further account integration still needs separately authorized sandbox setup and live verification as described in the Phase 3 handoff.
