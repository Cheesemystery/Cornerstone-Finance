# Task handoff — Recap at your own pace

Date: 2026-09-15
Status: complete
Area: Cornerstone Recap
Checkout: Cornerstone-Finance, existing working checkout; changes remain uncommitted.

## Objective and scope

Implement the approved calm dashboard design, adjusted for students with irregular income. Portfolio understanding and learning lead; contribution history is neutral and optional to explore. No contribution cadence score, streak or campus comparison should define success.

## Changes

- Rebuilt the Recap workspace with a scoped CSS module: current portfolio value, correctly labeled previous-close change, allocation ring and legend, learning entry, total/latest contribution records, review suggestions, collapsible activity and manual controls.
- Optional session target supports adjustment, pause/resume and removal. A paused target hides its progress indicator. No default target or deadline.
- Retained existing manual add/edit/delete handlers and duplicate handling. Free activity history shows the latest three months; server-derived Pro enables the full available history.
- Added a compact optional scenario section with the existing calculator, sample preview and guarded monthly/yearly checkout.
- Updated the Home recap card and made the automatic slideshow export inert.
- Removed campus enrollment UI from signed-in Settings; previously opted-in users can still leave the cohort. No stored data or cohort API was deleted.
- Share previews start hidden and download a locally generated PNG using current visible values, including edited sample activity. Updated the retained server image route and progress-message copy to remove streak language.
- Updated PROJECT, AREAS, STATUS and BETA to record the approved change in product direction.

## Verification

- npm run lint: passed.
- npm run typecheck: passed.
- npm test: passed, 53 tests in 10 files.
- npm run build: passed, 39 generated pages.
- git diff --check: passed (existing Windows line-ending notices only).
- Desktop and 390px browser inspection: readable amounts, allocation graphic, orderly card stacking. Document width was 375px at a 390px viewport, with no horizontal overflow.
- Browser interactions: set and pause target; add a sample contribution and edit it, verifying updated totals; open activity history and collapse with Enter; reveal private share amount; navigate Home and back to Recap without an automatic modal.
- Share tests verify no amount reaches hidden canvas output, visible downloads use current edited amounts, and a fresh render resets privacy.
- Empty-state tests cover an empty portfolio, absence of cadence/comparison messaging, and separate treatment of withdrawals.
- Restored clean sample state through reload and reset the temporary viewport override. Local Recap remains open at localhost:3000/recap.

## Limitations

- Optional targets currently last for this session; the UI states this explicitly. Account-persisted goal pause state was not introduced.
- Signed-in provider, billing, email and cohort services were not exercised live. Existing release gates still apply.
- Raw contribution arithmetic and historical streak fields remain in the data layer for compatibility; they are not presented as progress scores in this UI.
- PNG generation is covered through mocked canvas tests; an actual downloaded file was not opened during browser verification.

## Coordination

Existing Home/Portfolio edits and untracked files from previous work were preserved. This task changes Recap components, its route, related share/settings surfaces, tests and documentation. No dependency changes, migrations, commits, pushes or deployment.

## Remaining work

None for the requested local UI implementation. Persistent optional targets would be a separate feature.
