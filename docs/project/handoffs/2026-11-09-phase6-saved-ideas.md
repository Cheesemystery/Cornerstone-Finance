# Phase 6 — optional saved ideas

Refined existing end-of-lesson bookmarking without a flashcard engine/backend. Completed lesson takeaway has optional Save/Remove and a direct /learn#saved-ideas link. Collection shows saved count, actual concept, existing catalog explanatory text, associated lesson/review and removal. Removal restores keyboard focus to collection heading. Explicit wording says device-local, not cross-device account sync. Saving never changes XP or completion and never gates next navigation.

Persistence moved into lib/saved-ideas.ts using existing createBrowserStore: validated/deduplicated known IDs, explicit idempotent save/remove, shared mounted store, guest/account-owner and reset-generation namespace. Existing keys preserved. Blocked/recovered storage has accurate feedback. No dependency/API added.

Files: lib/saved-ideas.ts; components/saved-ideas.tsx and .test.tsx; app/design-system.css; project context/handoff. Existing user work retained.

Validation: lint/typecheck/build/diff check pass. Saved idea + full six-lesson journey focused run passes, 6 tests. Initial full run: 309 passed / 1 timed out at 5 seconds during concurrent build; the same journey passes in isolation. Full rerun uses 10-second test allowance; result below. Tests cover remount persistence, collection removal and focus, incomplete/reset guards, malformed/duplicate IDs, repeated save idempotence and owner separation.

Browser: localhost:3000 completed lesson → save → refresh → collection link → one card/review destination → remove → zero saved and focus restored. Original unsaved bookmark state restored; six lessons/125 XP untouched. Browser reopening/real cross-device accounts not manually tested. No commit/deployment.

Final full regression: 310 tests / 59 files pass with --maxWorkers=2 --testTimeout=10000 (94.99 seconds). No test configuration file changed.
