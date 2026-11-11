# Phase 2 — premium design system

Scope: semantic palette, typography/rhythm/depth tokens, compatibility adapters, reusable native components and actual Learn/bookmark adoption. Files: app/design-system.css, app/layout.tsx, components/ui/studio.tsx, components/learning-library.tsx, components/saved-ideas.tsx, docs/project/DESIGN-SYSTEM.md and context notes. Existing user changes retained. No dependencies, font downloads, backend, arithmetic or learning-state changes.

Forest/teal/ivory/lime/gold expanded into semantic surface/text/action/selected/disabled/success/warning/error/focus tokens. Navigation selection uses teal plus gold marker; lime reserved for actions/progress. Retained bundled licensed Inter/Newsreader and existing font loading. Shared style adapters cover native controls/progress, existing cards, dialogs/sheets/tooltips and lesson cards. Loading structure/chart semantics retained. Native Button/Card/SectionHeading/Badge/EmptyState primitives introduced and used by Learn and saved ideas.

Validation: lint, typecheck, production build pass (43 generated pages). Contrast calculations: body 13.29, secondary 6.08, action 11.66, success 6.75, warning 6.08, error 5.91, secondary on dark 8.23, milestone 5.67. These verify token pairs, not every inherited page pixel. Desktop and 390px Learn inspected, mobile navigation open/close verified, default viewport restored. Full regression result below.

Limits: compatibility migration preserves retained page-specific styles rather than rewriting every control. No claim of comprehensive visual/accessibility audit of all routes or live integrations. Work uncommitted; no deployment.

Final regression: 298 tests / 57 files pass. Token pair contrast checks pass; lint, typecheck, build pass.
