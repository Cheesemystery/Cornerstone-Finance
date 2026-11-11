# Phase 3 — Learn cleanup

Reorganized Learn into six explicit areas: compact dashboard, actual six-position financial foundation, next/review recommendation, three curriculum groups with concise lesson rows, saved ideas with existing explanations, and compact milestone rows. Dashboard uses existing XP, completions, daily goal and optional streak. Recommendation uses nextLesson (resumed incomplete lesson first), 20 XP only on first completion, saved step state and real duration. All existing lessons remain open; no catalog/quiz/reward mutation.

LearningFoundation is a Learn-only six-slot architecture, earned lessons first in catalog order filling ground-up, with real IDs, pressed state, keyboard/touch/hover selection and review links. Zero/partial/full progress derive from completed catalog IDs. Existing 24-slot completion drawing and Recap building remain intact to avoid changing prior reward behavior in this phase. No new animation or dependency.

Files: components/learning-library.tsx, components/learning-foundation.tsx, components/learning-library.test.tsx, components/saved-ideas.tsx, app/learn-studio.css and app/layout.tsx. Context updated in PROJECT/STATUS/AREAS.

Validation: lint/typecheck/build pass (43 generated pages). Browser inspected real six-completion desktop and 390px mobile dashboard/foundation/recommendation; selected a stone and verified its takeaway and review destination. Restored desktop and original selection on reload. New tests cover 0/2/6 completions, six real block positions, progress values, next/review links and resumed-lesson priority. Full regression result below. Existing browser learning data preserved. No commit/deploy.

Limits: zero/partial states are automated, not manually seeded into the user's browser. Older completion/Recap building retains its 24-slot appearance; Learn uses the actual six-lesson foundation requested here. No XP or milestone formula changes.

Final regression: 302 tests / 58 files pass. Lint, typecheck, production build and diff whitespace check pass.
