# Home Weekly — Step A

Date: 2026-10-19
Status: complete for Step A only
Area: Home presentation
Checkout: existing Cornerstone-Finance working tree; extensive preexisting user changes preserved, no commit.

## Scope and files

- components/home-dashboard.tsx: masthead, edition/source, serif editorial headline, labeled weather SVG, trimmed subline, dated signed dollar result. Existing inputs and weekly lesson action preserved.
- components/home-dashboard.module.css: Home-scoped editorial layout, existing palette/fonts, neutral completion line, mobile sizing and 44px secondary link target.
- components/weekly-weather.tsx: five static code-native SVG weather variants with accessible labels.
- lib/weekly-editorial.ts: named 0.5 and 2 percentage-point thresholds, display precision, deterministic headline/subline and UTC edition formatting.
- lib/weekly-editorial.test.ts: 17 cases covering all weather boundaries, up/down/flat copy, word limit, signed amounts and date boundaries.
- components/grant-cleanup.test.tsx: updated Home headline and masthead structure expectations.
- docs/project/STATUS.md, AREAS.md and this handoff: current implementation and limits.

## Decisions

Thresholds use the unrounded computed percentage; output uses two decimals. Zero follows the requested quiet/up template and never displays negative zero. Weather describes the dated portfolio week, not a prediction. Edition dates are the actual price comparison boundaries with a year shown for clarity. Source badge is in the masthead and applies to every figure below.

Subline reuses the Phase 2 first deterministic sentence, shortening up/down attribution. Non-up weeks add the requested noise context. No LLM or external weather data. No animation was added. Existing global navigation, weekly math, lesson content, dependency files and storage schemas were not edited.

## Verification

- npm run check: lint, TypeScript, 177 tests in 33 files, and production build with 41 routes pass.
- Side browser: actual saved-completion sample state inspected at 375x812 and 1280x900; no horizontal overflow. Newsreader confirmed from computed style; Home has 44 visible words in this state.
- Continue learning is keyboard focusable, has a visible 3px focus outline and a 44px target.
- Captured browser error log is empty. Static SVG introduces no motion to disable.
- git diff --check passes with repository CRLF-aware whitespace settings.
- A test fixture initially used Vitest array-row expansion incorrectly; corrected it and all checks passed afterward.

## Reproduction and forced states

Use the running development server's reported URL, currently http://localhost:3000/. If restarting, run npm run dev and use its reported port.

Preserve existing learning/holdings by testing in a separate browser profile. Empty browser state shows the existing input options. Use sample portfolio for quiet/down with partly cloudy; manual VXUS or BND alone yields bright/up with mostly sunny; VTI alone yields overcast/down. These remain explicitly labeled sample without a provider key. The bundled sample does not reach the sunny/rain thresholds; do not alter data to create those conditions.

For every exact weather state without changing saved user data, run npm test -- lib/weekly-editorial.test.ts. Its inputs include 0/-0.16 (quiet), 0.5/1.99 (bright), 2/4 (clear), -0.5/-1.99 (overcast), -2/-4 (rainy). The named exported function can also be inspected with those inputs in the test file. No browser URL override or production test control was added.

## Remaining steps

Stop after A. B adds the diverging chart. C adds the cumulative wall and tightens the audited completion display selector: current weekDone reads any completion for its week/mode/holdings key without checking the currently recommended lesson ID. This behavior is unchanged here. D/E/F remain deferred as requested. Current source is intentionally an intermediate Home layout; the Phase 2 Continue learning link remains until the subsequent Home composition step.
