# Task handoff — conference presentation polish

Date: 2026-11-10
Status: complete
Area: Shared shell / Ask / guest demo replay
Checkout: Cornerstone-Finance; uncommitted, existing work preserved.

## Objective and scope
Apply the requested presentation profile, hide development chrome, unify Ask wording and provide repeatable final-lesson demo preparation.

## Changes
- next.config.ts sets devIndicators:false. app/globals.css hides nextjs-portal as requested.
- Sidebar presentation profile is ML / Maya Lin / Class of '28 · First-Gen Foundation. Existing preferences and settings link remain intact.
- Ask page title and chat header use Ask Cornerstone; subtitle unified. Footer uses the exact requested curriculum/portfolio/educational-guidance copy. Prompt and ticker handlers unchanged.
- Guest-only Replay final lesson button near sidebar profile prepares the explicit 7-of-8 presentation fixture and routes to /learn/inflation. It removes only the final lesson's quiz/step/missed and lesson event, preserving earlier dated events and other learning preferences. Seeded earlier completions have no fabricated dates.
- Reset generation advances so stale guest tabs cannot revive completion 8. Field notes are copied to the existing next-generation namespace before progress changes; inability to preserve notes aborts preparation. Holdings/practice/profile preferences remain untouched. Animation receipts adopt seven stones, leaving the eighth ready to animate again.
- Added pure reset helper and integration tests; updated navigation mocks for useRouter.

## Verification
Typecheck and lint passed; production build passed (45 generated pages). Five focused files passed 17 tests including eight accessibility scans, the full eight-lesson journey and reset tests. After adding explicit wall receipt preparation, three focused files passed 12 tests including wall sequencing, reset and notes preservation; final typecheck/lint rerun. Diff check passed, existing line-ending warnings only.
Browser verified /assistant shows the requested profile/footer and no N badge. What is an ETF? prompt returns its existing answer and lesson link; Start over restores starters. Left Ask open without changing the user's learning record. The actual replay button was tested with isolated automated browser storage, not clicked on the user's existing record.

## Remaining work / next step
For the pitch, click Replay final lesson beside the profile to prepare seven completions and open Lesson 8. Complete its activity and three checks to reach eight; click again between demos. No shortcut added because a visible settings-area control satisfies the request. Full native screen-reader/device certification not performed. No deployment, dependency change or account feature activation.
