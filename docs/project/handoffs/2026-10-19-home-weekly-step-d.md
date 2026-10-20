# Home Weekly — Step D

Date: 2026-10-19
Status: complete for Step D
Area: Home replay and local sharing
Checkout: existing Cornerstone-Finance working tree. Previous user work preserved. No commit/deployment.

## Scope and files

- components/home-dashboard.tsx: secondary Replay your week action in the masthead; supplies existing week/history/learning and learning date in saved timezone. No other Home sections changed.
- components/weekly-story.tsx (new): installed Radix Dialog, opening data snapshot, four cards, arrows/dots/tap halves/swipe, Escape and focus trap. Explicit aria-modal=true. Existing lesson link uses beginWeek without changing content or awarding progress.
- components/weekly-story.module.css (new): scoped full-screen paper/forest presentation, 44px controls, 300ms ease-out entrance and reduced-motion rules including portaled saved preference.
- components/weekly-share-preview.tsx (new): fresh privacy default off, local canvas preview, download, conditional file Web Share, friendly failure states and stale-render export protection.
- components/learning-wall-snapshot.tsx (new): static catalog-derived SVG wall, with no progress/animation receipt reads/writes.
- lib/weekly-share.ts (new): sanitized default model, shared snapshot layout and 1080×1350 Canvas rendering. Opt-in includes only weekly dollars and main driver ticker/contribution, never shares/cost basis.
- lib/weekly-weather-art.ts (new) and components/weekly-weather.tsx: original weather paths extracted unchanged so browser SVG and canvas share artwork.
- lib/weekly-share.test.ts and components/weekly-story.test.tsx (new): eleven cases for privacy, clearing canvas on opt-out, distinct data dates, catalog snapshot, modal/keyboard/dots, lesson-entry-only action, tap/swipe, fresh privacy reset, canvas failure and mocked native file sharing.
- PROJECT.md, docs/project/STATUS.md, AREAS.md and this handoff.

## Decisions

Four cards show: weather/headline with percent; single driver bar plus existing deterministic sentence; existing recommended lesson and Start lesson; See you Monday with wall snapshot and Share. Replay has no auto-advance and does not mark lessons complete. Its lesson card permits revisiting the existing weekly lesson even when the main Home action is already complete; existing idempotent completion prevents duplicate stones/rewards.

The modal freezes the displayed week/history/progress at opening for consistency across cards. Card changes use a 300ms opacity/slide entrance, with no looping or overlapping outgoing animation. Device and saved reduced motion make it instant. Radix handles isolation, scroll locking and focus trapping/restoration. Snapshot wall never mounts LearningWall's animation controller or consumes last-seen IDs.

Canvas export waits for bundled fonts and uses the same weather paths and seeded stone appearance. Default model contains no holding tickers, dollar amounts, shares or basis. Opt-in checkbox has the requested label Include dollar amounts, with visible disclosure that it includes the main holding ticker. Only total weekly dollars and the main ticker's contribution are added. Off/on/off redraw clears the entire canvas. Exports are disabled until the current model is rendered, preventing downloads of stale privacy state. Every fresh preview resets off, including reopening replay.

Closing-price source/as-of metadata dates the financial result; Learning as of dates the cumulative wall snapshot in the saved learning timezone. This avoids implying current progress existed on an older sample-price date. All generation is local; no server/AI endpoint or sharing analytics added. File Web Share appears only if navigator.share and navigator.canShare report file support. Cancel is quiet; genuine failures offer retry. No recipient or automatic publishing.

## Verification

- Final npm run check: lint, TypeScript, 202 tests / 37 files and production build (41 routes) pass.
- Focused tests cover tap halves and touch-swipe threshold, suppressing the swipe-generated click, all four cards/dots/arrows/Escape, explicit modal semantics, lesson action, privacy reset, image-generation failure and mocked PNG Web Share.
- Browser: all four cards inspected; expected VTI driver dollars and recommended lesson match the existing week. Shift+Tab wraps Close to Next card; Tab returns Close. Escape restores Replay your week focus.
- Browser share preview at 375x812: dialog client/scroll width both 375, height/scroll height both 812; no overflow. Every button 44px or larger. Desktop checked at 1280x900. Captured console error log empty.
- Actual downloaded PNG header confirms 1080×1350. Private and opt-in images visually inspected; default contains no dollars/tickers, opt-in shows the matching total/main driver. Hiding again yields a byte-identical SHA-256 PNG to the fresh private version.
- Saved Reduce motion temporarily enabled through existing Settings; portaled slide computed animation-name:none. Original off preference restored. OS CSS override inspected; OS preference itself unchanged.
- Native file sharing is verified with a mocked API, not an actual system recipient/share. Browser advertises Web Share; no system share sheet sent anywhere.
- During development, caught/fixed missing explicit aria-modal, test-option typing, and separation of learning date from price date. Final checks pass. No package, weekly math, lesson content or other-page source changes.

## Run and force states

Run npm run dev from the repository and use the reported port; current server is http://localhost:3000/.

Choose Replay your week. Previous/Next, four dots and Left/Right keys choose cards; tap empty left/right card halves or swipe horizontally. Escape/Close restores focus. Start lesson opens the unchanged existing weekly route. Share on card four opens the canvas preview. Download image produces the current PNG. Include dollar amounts opts in to the total and main ticker/contribution; switch off or reopen to hide them. Web Share appears only with supported file sharing. No modal or PNG sharing is offered without sufficient existing price history.

Use a separate browser profile to force no saved progress or alternate holdings without altering the main profile. Sample holdings produce mixed/down; VXUS alone produces up with labeled fallback sample data. Tests force unavailable Canvas context, missing Web Share API, supported file sharing, privacy toggles and gestures without user state changes: npm test -- components/weekly-story.test.tsx lib/weekly-share.test.ts.

## Remaining work

Stop after D. E Pro view, F empty/loading/stale-data polish and any AI narration remain unimplemented. No dependencies added, no lesson content or financial math changed.
