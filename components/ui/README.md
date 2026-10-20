# Shared controls

The first shadcn/ui migration contains only Sheet and Switch, manually adapted from the reviewed official new-york-v4 registry sources on 2026-10-16:

- https://ui.shadcn.com/r/styles/new-york-v4/sheet.json
- https://ui.shadcn.com/r/styles/new-york-v4/switch.json

The accompanying [MIT license](LICENSE.md) covers the copied source. The primitives use `radix-ui`; class merging uses `cn` through `lib/utils.ts`. React 19 ref props and `data-slot` conventions are retained.

Cornerstone-specific presentation lives in `app/shared-controls.css`, imported after existing app styles. The modal sidebar reuses the existing navigation markup and colors. Portaled overlays/content receive the local reduced-motion setting explicitly because they are outside the learning provider's DOM wrapper. Device reduced motion is also respected.

`components.json` records the existing Next.js/Tailwind 4 aliases and scoped stylesheet. Future CLI additions must be inspected with the current CLI preview/diff workflow before applying them. Do not run a theme initializer or overwrite existing components/global styles. Generated neutral defaults are not the Cornerstone design contract; adapt only needed controls to the current theme.

Unused registry exports and preset size/style options were omitted from this bounded migration. Native controls and other dialogs remain unchanged until explicitly migrated.
