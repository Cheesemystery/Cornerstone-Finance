# Phase 7 — supporting pages polish

Home: dated closing-price context and neutral direction labels, plus one concept bridge with actual recommended lesson title/takeaway/tag/duration and weekly completion action. Replaced inaccurate fixed two-minute button label with Explore this week’s lesson; updated integration assertions for intentional label change. Existing weekly calculations, source/sample banners, Pro mode, replay and wall preserved.

Portfolio: refined chart/table surfaces, titles, touch targets, hover/focus and spacing; added mobile horizontal-table hint and native disclosure defining market value, allocation and price contribution. Explicitly distinguishes price comparison from total investment return and retains current-share-count/dates/excluded-cashflow caveats. Math/source/fictional mode/selection unchanged.

Ask: composer moved ahead of conversation, useful question-led empty state, calmer contextual cards, lesson/contribution links and distinct source/date block. Empty view no longer autoscrolls to bottom or clips suggested questions on small screens. Existing curated answer function, refusal scope, source handling and chat limits retained; no API/model additions. Navigation remains Home/Learn/Portfolio/Ask with existing aria-current desktop/mobile Sheet behavior.

Files: components/home-dashboard.tsx, assistant-client.tsx, portfolio-holdings.tsx and module CSS, app/page-polish.css/layout.tsx; grant-cleanup/weekly-loop tests updated for CTA text; context notes. User financial and learning records preserved.

Validation: lint/typecheck/build pass. Full suite 310 tests / 59 files passes with existing 10-second command-line allowance. Desktop Home/Ask/Portfolio inspected; ETF answer/lesson link and VTI row selection verified, metric disclosure opened. 390px Portfolio/Ask inspected, responsive table scrolling retained and default viewport restored. Final mobile fixes followed by focused regression. No pixel-complete all-route audit or live integrations claimed. Work uncommitted; no deployment/dependencies.
