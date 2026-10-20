# Task handoff — shadcn/ui shared controls, first migration

Date: 2026-10-16
Status: complete
Area: Shared design, navigation and mobile; Settings
Checkout / branch / commit: `C:\Users\abrah\Documents\Codex\2026-09-02\my-website-code-is-in-a\Cornerstone-Finance`, `main`, `9f2b0e3`; work remains uncommitted.

## Objective and scope

Introduce a small shadcn/ui foundation and migrate mobile navigation plus one Settings control, retaining Cornerstone's visual identity, eight destinations and existing functionality. Read AGENTS, PROJECT, STATUS, WORKFLOW, area notes and the Knip/React Doctor handoffs first. Preserved all pre-existing tracked/untracked work.

Only Sheet and Switch were introduced. Other native controls, reset dialogs, legacy site, financial calculations, progress schemas, connected integrations and routes remain intact.

## Compatibility and source review

Used current official [Next.js setup](https://ui.shadcn.com/docs/installation/next), [React 19/Tailwind 4 support](https://ui.shadcn.com/docs/tailwind-v4), [manual installation](https://ui.shadcn.com/docs/installation/manual), [Sheet](https://ui.shadcn.com/docs/components/radix/sheet), [Switch](https://ui.shadcn.com/docs/components/radix/switch), and [Radix Dialog](https://www.radix-ui.com/primitives/docs/components/dialog) guidance.

Installed stack stays React/React DOM 19.2.8, Next.js 16.3.8, Tailwind 4.3.3, TypeScript 6.0.3. Current package manifests accept React 19; npm installed without force/legacy-peer flags. Pinned `radix-ui` 1.8.1 and `cn` 0.5.0 are the dependencies declared by the current official registry sources. `radix-ui` is the standard aggregate primitive package and declares `sideEffects: false`; only Dialog and Switch are imported. No bundle-size improvement was measured or claimed.

Fetched both registry JSON sources into this chat's work directory and read their contents/dependencies before applying any source. No CLI initializer or blind overwrite ran. Sources:

- `https://ui.shadcn.com/r/styles/new-york-v4/sheet.json`
- `https://ui.shadcn.com/r/styles/new-york-v4/switch.json`

Retained the registry composition, React 19 ref props, `data-slot` attributes, Radix interaction primitives and class merger. Replaced neutral preset classes with scoped Cornerstone CSS using existing colors/dimensions. Omitted unused Sheet header/footer exports and Switch preset size options. Portaled layers accept the local reduced-motion setting explicitly. Included the upstream MIT license and source notes in `components/ui/`.

## Changes

- `components/ui/sheet.tsx`, `switch.tsx`: reviewed/adapted shared controls. `LICENSE.md` and `README.md` preserve source provenance and future review guidance.
- `components.json`: Next/RSC/TypeScript, existing aliases, new-york style and the scoped shared-controls CSS path. `lib/utils.ts` re-exports the current official `cn` helper.
- `app/shared-controls.css`: scoped colors, sidebar geometry, animations, focus rings, Switch sizing and both local/device reduced-motion rules. `app/layout.tsx` imports it after existing app styles. Existing global styles/fonts were not replaced or edited.
- `components/app-shell.tsx`: one shared navigation-content component serves desktop and mobile. Replaced manual focus-trap/Escape/overflow logic and scrim with Sheet. Kept controlled open state, the desktop-breakpoint listener and small library autofocus hooks. Mobile closes focus the trigger; desktop resizing focuses the visible active destination. All eight links, local profile/progress and auxiliary links remain.
- `components/mvp-settings.tsx`: migrated only Reduce motion to the controlled Switch, with a visible associated label and description. It updates the same saved learning preference. Other switches and reset behavior remain unchanged.
- Added `components/app-shell.test.tsx` and `components/mvp-settings.test.tsx` (6 regressions). Updated PROJECT, STATUS and AREAS for the shared-control foundation.
- Package/lockfile add the two pinned dependencies. All existing package versions and original declarations remain; npm changed only existing `@types/react-dom` install classification from dev to devOptional to account for Radix's optional peer. No package upgrade or removal.

## Verification

- `npm run check`: lint and TypeScript pass; 114 tests across 25 files pass; production build passes with 40 generated pages.
- Focused tests: 6/6 pass. Cover eight links, labelled dialog/background isolation, initial focus, Tab/Shift+Tab boundary wrapping, Escape/close/link dismissal, focus restoration, scroll cleanup, local reduced-motion portal markers, desktop-resize focus and saved preference updates without altering learning/practice records.
- Initial focused scroll-lock assertion assumed an inline body style; corrected it to observe computed CSS because the primitive owns CSS-based scroll locking. Initial full check also caught an unsupported test-query option; removed it. Final checks pass.
- `npm ls --depth=0`: passes, with compatible peers. Knip reports only its prior 3 retained files, 5 value exports and 8 type exports; no new unused dependencies/exports/files.
- `npm audit --omit=dev`: zero production vulnerabilities reported.
- Side browser: verified keyboard Enter opening, initial close-button focus, forward/reverse boundary wrapping, Escape dismissal, trigger focus restoration, outside-tap dismissal, body scroll lock/release, mobile link navigation and desktop-resize cleanup/focus. Saved reduced-motion setting survives reload and computes `animation-name: none` for both portal layers. Enter and Space toggle the Switch; original preference restored after testing. Keyboard Switch focus is a solid 3px existing-green outline.
- Responsive browser checks at 320, 390, 768 and 1440 widths show no page-wide overflow. Narrow sidebar width is capped at 90vw and scrolls vertically to retain access to all content. Desktop restores its unchanged sidebar and eight links. Inspected mobile navigation and Settings screenshots; green/paper colors and bundled typography remain.
- Device reduced-motion media rules are present and built; the user's OS preference was not changed for testing. This is keyboard/layout verification, not a full assistive-technology certification.
- Existing-file hash comparison confirms changes are limited to intended source/package/context files. Generated `next-env.d.ts` restored to pre-task bytes after the build. Diff whitespace checks pass. No user data or credentials were added to project documentation.

## Remaining work / next step

None required for this first migration. Future controls should follow the source-review workflow in `components/ui/README.md`; do not run a broad theme initializer or replace global styles. Existing reset dialogs and other controls can be migrated in later bounded tasks. Prior React Doctor server/database findings remain separate and unchanged.

## Coordination

Shared AppShell, layout, package files and context docs already contained user work; changes were additive to that state. No commits, pushes, deployments, real account operations, progress reset or feature activation. Screenshots and a copy of this handoff are in this chat's outputs/shared-controls directory; scratch registry sources, snapshots and verification logs are in work/.
