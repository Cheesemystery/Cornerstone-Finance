# Demo completion audit

Status: complete for the local demo, refreshed 2026-09-04.

Objective: polish the current student demo and make its main controls useful. Legacy files and server integration boundaries are preserved.

- [x] Visual design: consistent bold headings and green/lime/purple/gold palette. Nine main routes checked at 390px without horizontal page overflow; mobile keyboard focus, Escape and focus return verified.
- [x] Home: accurate shared sample/CSV totals, briefings, recalculate feedback and navigation.
- [x] Cornerstone Recap: $240 current-month headline, three-month streak, seven-step closed-month experience, milestones, comparison, neutral withdrawal language, hidden-by-default share card and matching PNG.
- [x] Recap activity: suggestion confirmation/exclusion, contribution/withdrawal entry, duplicate override, manual edit/delete, three-month free history and Pro ranges/milestones/scenario preview.
- [x] Portfolio: chart mouse/keyboard selection, holding details, legend, Show all and Escape; same values as Home and Assistant.
- [x] Discover: hypothetical scenarios, issuer links, query-aware search, category filters, expansion and saved-only list.
- [x] Social: fictional name/college/strategy profiles, filters, empty states, details and persisted local following.
- [x] Learn: all six quizzes completed in the browser; incorrect-answer feedback, next lesson, filters and persistence checked. Calculator updates through keyboard controls.
- [x] Assistant: curated educational responses with current portfolio figures, shortcuts and conversation reset. No live AI claims.
- [x] Onboarding: three-step sample launch, profile setup, linking explanation, invalid CSV errors and valid synthetic CSV preview/use. Imported figures agreed across pages; reload clears financial data. Example download returns 200.
- [x] Settings: editable profile, persistence, compact layout, privacy details, reset cancel and confirmed reset. Final reset restored Alex and zero lesson/follow progress.
- [x] Sign-in: native email validation and demo path; pending/timeout/network/service error handling in code. No email sent or live service success claimed.
- [x] Verification: final npm run check passes lint, TypeScript, 44 tests across eight files and production build. Ten main routes, six lessons and the new protected API routes compile; unknown lesson showed recovery UI. Earlier fresh-load checks showed no new hydration errors.
- [x] Project context and student-demo handoff updated.

Inter and Newsreader are now bundled with OFL licenses, fixing the Google Fonts build dependency. Existing React, CSS, Lucide and Zod were sufficient; no package installation was needed.

Production boundaries: brokerage sync, contribution persistence, email, billing and deletion interfaces are implemented but have not been exercised against configured Supabase, Plaid, Stripe or Resend services. Real community publishing, live prices and external AI remain absent. Apply the new migration and complete the BETA.md integration gates before external use. This audit does not certify production readiness.
