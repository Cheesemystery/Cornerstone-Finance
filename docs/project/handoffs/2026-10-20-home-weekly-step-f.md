# Task handoff — Home weekly Step F states and polish

Date: 2026-10-20
Status: complete
Area: Grant weekly loop / Home
Checkout / branch / commit: Cornerstone-Finance / main; changes uncommitted on 1be1bd7.

## Objective and scope

Finish requested Home states: missing holdings, less than seven days of common history, old data, loading and errors; verify motion, keyboard, mobile and console behavior. Other pages, financial arithmetic, lesson content, storage and dependencies are unchanged.

## Changes and decisions

- components/home-dashboard.tsx: first-edition empty/insufficient state with the existing three Phase 2 input options, first catalog lesson link and existing wall. Chart and Pro holdings stay gated on a valid week. The introductory lesson does not start/complete a financial weekly task.
- Same component: static aria-hidden skeleton shapes plus an announced loading message; alert and retry for price-request failures; input options and first-lesson access remain available after failure. Existing request/store code preserves holdings.
- lib/weekly-editorial.ts: strict greater-than-ten UTC calendar day freshness boundary. Home uses the shared week end date, falling back to response asOf when no week is available; sample labels remain visible.
- components/home-dashboard.module.css: Home-only state/skeleton/note styling and explicit dark text on light secondary input/retry buttons. Skeletons have no animation in either motion setting.
- components/home-states.test.tsx and lib/weekly-editorial.test.ts: six new regression cases including empty/short history, pending/error/retry, unchanged saved holdings, and freshness boundaries/year changes.
- PROJECT.md, STATUS.md and AREAS.md record the current state.

## Verification

- npm run lint and npm run typecheck: pass.
- Focused Home states/editorial/weekly-loop/Pro suite: 37 tests across four files pass.
- Full npm test: 212 tests across 39 files pass. Existing JSDOM navigation notices are emitted; no failing assertions.
- Final npm run build: pass, 41 routes. Rebuilt after the button color fix.
- Actual browser: empty and unsupported-history inputs/first lesson/wall without a chart; sample dated result and stale note. Checked 375px empty/manual/missing-history/ready and 1280px empty. No horizontal page overflow; input actions 44px high, first lesson 58px.
- Keyboard: empty-state Tab order and visible focus; manual form via keyboard; chart Enter/Tab and Escape; wall Enter/Escape. Saved Reduce motion switched with Space in isolated preview; all chart rectangle animation names are none. Existing device-motion CSS rules retained; no separate device-emulation run.
- No captured application console errors on localhost development Home or isolated production preview. Error/retry and pending/short-history responses verified by integration tests, not network manipulation in the real browser.
- Mobile screenshot saved to this chat's outputs/step-f-home-375.jpg.
- git diff --check: pass before documentation updates; checked again at finish.

## Environment and coordination

Windows sandbox temp-file renames blocked the earlier test run. Setting TEMP and TMP for the test process to this chat's work/step-f-temp allowed the full suite to run without changing project configuration. The sandboxed production build stalled; it was stopped and the normal production build passed outside the sandbox. The existing project dev server was restarted to restore localhost hydration and still runs on its reported port 3000. An attempted 127.0.0.1 development preview hit Next's existing cross-origin dev-resource restrictions; no security/configuration exception was added. Final isolated browser tests used the production preview on localhost:3002 so the primary origin's user data was preserved. Temporary preview is closed/stopped at finish.

## Remaining work / next step

None for Step F. No AI narration, dependency addition, commit, push or external deployment performed.
