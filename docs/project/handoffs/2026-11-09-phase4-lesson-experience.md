# Phase 4 — lesson experience

Learn introduces existing core concept copy and a fictional example, Apply retains all six actual activities, Understand preserves the original explanatory/risk context, Answer retains the required three-question quiz with per-answer explanatory feedback. Successful completion shows a truthful first-completion/replay receipt, optional Save this idea, existing cornerstone placement, updated actual lesson/XP totals and next-lesson link. No new backend/dependencies/content formulas. No reward from clicking through or bookmarking.

Files: components/lesson-reader.tsx, ownership-quiz.tsx, learning-building.tsx (optional focusNext), lesson-completion.test.tsx; app/lesson-studio.css and layout.tsx. Existing quiz validation, unique lesson receipts, weekly linkage, storage/account reporting and animation skip/reduced-motion retained. Added concept text is copied from current catalog, not new financial guidance. Existing explanation step retained for accuracy and persisted step compatibility.

Completion focus is now on reader heading so result/save appear before navigation. Isolated building completion retains prior default next-link focus via focusNext=true. Animation never steals focus later. Reward artwork remains existing 24-slot building; actual six-lesson Learn foundation is untouched. Receipt shows catalog totals, not building capacity. Save is optional and never blocks continue.

Browser: inspected completed/replay, Learn and Apply controls, desktop and 390px reward layout; restored desktop and completion view. Existing six completions/125 XP preserved. Fresh quizzes/drop verified through automated journeys; not reset in user's browser. Existing tests expanded to assert +20 XP receipt and Save after each real quiz, no new-reward receipt on refresh. Focus/building/completion focused set: 17 tests pass. Final full results below.

Limits: no live account integration claim, no curriculum timing study; three/four-minute estimates are existing content. Work uncommitted; no release.

Final validation: all 302 tests / 58 files pass, plus 17 focused tests; lint, typecheck, build (43 generated pages), and diff check pass. Next-link wording regression was resolved while retaining visible Continue learning context.
