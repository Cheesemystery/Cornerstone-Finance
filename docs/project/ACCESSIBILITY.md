# Accessibility regression checks

Run `npm run test:a11y` for the focused suite, or `npm test` / `npm run check` for the usual project checks. The existing quality workflow runs `npm test`, so the accessibility suite is included without a separate CI job.

`components/accessibility.test.tsx` uses pinned, development-only axe-core 4.14.0 directly with Vitest, Testing Library and JSDOM. It renders actual components and Demo/MVP providers with synthetic sample data; only pathname and browser APIs unavailable in JSDOM are shimmed. It scans the document body so portaled navigation is included. Tests run serially within the file and clean up providers, storage and shims between flows.

Coverage includes:

- Mobile navigation open and closed, including Escape/focus restoration.
- A lesson challenge before feedback, after an incorrect answer and after a correct answer.
- Portfolio before and after Explore selects a holding and focuses its details, with Escape clearing.
- Recap learning/history disclosure closed and open.
- Settings before/after Reduce motion and with the reset dialog open (never executing reset).
- A deliberately unnamed button as a scanner control: axe must detect `button-name`.

All default axe rules run except **color-contrast**, which the [official README](https://github.com/dequelabs/axe-core#supported-browsers) identifies as unsupported in JSDOM. A null canvas-context shim prevents unsupported JSDOM canvas calls; it does not supply pixels or establish contrast results. Test fixtures provide document title/language, so production document metadata still needs route/browser review. Failures report rule IDs, affected selectors and remediation summaries. Incomplete results are logged for manual review; zero violations is not proof that every rule was applicable or fully evaluated.

## Browser supplement

Use a real browser for rendering-dependent checks. JSDOM does not load the app's complete visual layout or implement native modal behavior. For affected flows:

1. At phone width, open navigation with Enter; verify initial focus, Tab/Shift+Tab wrapping, background isolation, Escape dismissal and focus returning to Open navigation. Also check desktop resize cleanup.
2. Enter a lesson challenge; verify heading focus, radio arrow keys, label activation, feedback announcement and visible focus. Use test fixtures for mistake/completion flows when protecting existing saved progress.
3. Activate a holding's Explore button with Enter; verify matching details focus and selected state, then Escape. Check narrow widths: the table scrolls locally and the page does not overflow.
4. Open Recap's disclosure with Enter/Space; verify the exposed content and Tab order. Confirm source/missing-history labels and readable signed values.
5. Verify Settings labels, switch keyboard operation and the named reset dialog's initial focus, Escape/cancel and focus restoration. Never activate the destructive reset just to audit a dialog.
6. Check actual foreground/background combinations, focus indicators, gradients/overlays, responsive layout and zoom. Do not report a JSDOM scan as a contrast check. Record browser-axe results separately if a future browser runner is adopted.

Keep axe imports in test files and devDependencies. Do not add production instrumentation, a runtime accessibility overlay or a public audit endpoint. Rebuild after source changes and confirm compiled browser assets do not contain the scanner. Avoid broad rule suppression or changing product behavior solely to obtain a clean scan. Verify reported issues against actual semantics/rendering first.

Automated checks cover a subset of accessibility. Full screen-reader testing, zoom/reflow, additional routes/states and expert review remain necessary; this suite does not certify WCAG compliance. See [initial handoff](handoffs/2026-10-16-axe-accessibility.md) for findings and validation.
