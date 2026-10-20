# Task handoff — Home money story

Date: 2026-09-10
Status: complete
Area: Home / Portfolio
Checkout: Cornerstone-Finance, existing working tree; no commit or deployment.

## Objective and scope
Implement the recommended narrative Home UX and continuous Portfolio handoff using existing snapshot data.

## Changes
Replaced competing Home sections with a single story, neutral performance figures, educational context, one main link, secondary contribution/lesson summaries and finite closure. Removed automatic recap modal mounting on Home. Added a shared attribution helper and ranked Portfolio contributions with synchronized holding selection and external Yahoo Finance news links. Added local CSS modules; retained shared navigation, portfolio arithmetic, sample fixtures and integration boundaries.

## Decisions
Previous-close data is labeled honestly instead of presented as weekly performance. No historical chart, weekly reminders or live reporting is fabricated. Down periods identify the most negative dollar contributor and any positive offset. Privacy and sample labels remain visible. Educational progress and existing lessons support repeat use without punitive streaks.

## Verification
npm run check passed: lint, TypeScript, 48 tests across 9 files, and production build (39 generated routes/pages). Added tests cover negative contributors, offsets, positive periods, flat/empty holdings and position-size weighting. Home and Portfolio returned HTTP 200. Updated Home was verified in the existing browser preview with one primary action and no automatic recap modal. git diff --check passed. Dedicated responsive/keyboard interaction testing was not run in this task.

## Remaining work
Real weekly/historical performance, scheduled briefing reminders and an integrated verified news feed require additional data/services. Not enabled by this local UI implementation.

## Coordination
PROJECT.md, STATUS.md and AREAS.md updated for durable direction and file ownership. Existing next-env.d.ts modification preserved. No dependencies, credentials, legacy site, account integrations or deployment settings changed.
