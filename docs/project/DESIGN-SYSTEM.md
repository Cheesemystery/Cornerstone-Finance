# Cornerstone design system

Source of truth: app/design-system.css, imported after page adaptations. components/ui/studio.tsx exports native Button, Card, SectionHeading, Badge and EmptyState. Adopt these when touching an area; existing .button, .mvp-card and palette aliases retain compatibility. Keep Radix Sheet/Switch interaction behavior intact. No theme initializer or dependency required.

## Color roles

Forest #102F2B: navigation and immersive backgrounds. Teal #183E38: elevated dark surfaces and selected navigation. Ivory #F6F7EE: page background. Lime #DDF27D: primary actions and earned progress. Gold #CFAD77: milestone surfaces, with dark achievement text. Never use gold/lime as body text on light surfaces.

Semantic --color-* tokens cover surfaces, text, borders, primary hover/pressed, selected, disabled, warning, success, error, focus and overlays. Success is #245C42 on #E7F1E7, warning #76541C on #FAF0DC, error #9C3934 on #FBEAE6. Financial losses retain neutral existing presentation; these state colors are for interactions.

## Typography and rhythm

Bundled Inter: interfaces, navigation, buttons, figures and lessons. Bundled Newsreader: editorial hero statements and major section moments. Existing font license files remain in app/fonts; no remote font requests. Caption 12px, small 14px, body 16px, title 24px; fluid section/hero scales. Body leading 1.65, heading leading 1.12. Eight spacing steps: 4, 8, 12, 16, 24, 32, 48, 64px. Controls 12px radius, cards 24px; pill reserved for compact shapes.

## Components and feedback

Primary actions use lime/dark text, secondary controls use a warm light surface and a visible border. Native disabled behavior remains authoritative. Controls have 44px minimum height; visible keyboard rings. Selected navigation uses teal with a gold leading marker and aria-current. Badges combine text with semantic color. New empty states explain the next action. Native progress bars use success color with visible tracks. Dialog/sheet surface and overlay styling preserves established focus handling. Tooltips remain supplementary; no essential information should require hover.

Transitions use 160ms color/border feedback, disabled under saved/device reduced motion. No added decorative animations. Existing loading skeletons and chart interactions remain intact. Preserve source dates, signed values and chart text equivalents.

## Validation

Visually inspected Learn at desktop and 390px, including opening and closing the mobile Sheet. Restored default viewport. Automated regression/build results are in the Phase 2 handoff. This is a shared foundation with compatibility adapters, not a rewrite of every retained legacy page-specific style.
