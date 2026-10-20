# Task handoff — Dark surfaces and Recap movers

Date: 2026-10-13
Status: complete
Area: Home / Learn / Portfolio / Recap
Checkout / branch / commit: Cornerstone-Finance, main at 9f2b0e3; work remains uncommitted alongside pre-existing changes.

## Objective and scope

Implement eight user browser comments: darker Home portfolio card and convenient link, bolder Learn invitation, rewarding result hierarchy, cleaner pie center, dark paired allocation/header, reworked holding controls and Recap stock contributors/update status. Preserve other functionality, local data and the legacy site.

## Changes

- components/home-dashboard.tsx: a large View portfolio link beneath the pie replaces the small header link.
- components/learning-library.tsx: stronger main invitation headline; progress, lessons and actions retained.
- components/portfolio-holdings.tsx and CSS module: dark unified allocation card; value/context in center with cost growth below; dark raised holdings rows and explicit Explore controls. Keyboard navigation and existing selection preserved. Scoped gain/loss colors avoid the old global important colors.
- components/portfolio-movement.module.css: brighter inset result card emphasizes the dollar/percentage change, without confetti or trading rewards.
- components/portfolio-recap.tsx: source update status and top absolute price contributors. Fixed practice attribution reconstructs the holdings owned before the last checkpoint from recorded orders, so a later sale cannot rewrite past movement. Snapshot attribution reuses existing portfolio math.
- lib/recap-movers.ts and tests: attribution and timestamp selectors, kept outside presentation.
- app/portfolio-polish.css: scoped dark Home/Learn styling and Recap contributors/status. Status animation runs three slow cycles, then stops; OS/saved reduced motion disables it.

## Decisions

Status labels refer to saved source data, not browser render time. No saved activity is reported honestly for untouched practice. Sample data retains its dated snapshot. Fictional example month has no per-stock history, so it shows an explicit empty attribution explanation. Practice movers describe the last simulated week, not monthly returns; existing monthly availability rules remain intact. No new API, package, asset, account or service was added. No external code was borrowed.

## Verification

- Clean lint and TypeScript; all 97 tests in 21 files pass; production build passes with 40 generated pages.
- Tests cover positive and negative snapshot ranking, empty holdings, practice attribution after a later sale, cash-only practice and source timestamps.
- Home/Learn/Portfolio/Recap fit 320, 390, 768 and 1543 viewport widths without page-wide overflow. Holdings retain inner horizontal scrolling on narrow screens.
- Keyboard activation of Home's new link opens Portfolio. Native Enter selects holdings and focuses details; Space selects a legend holding. Selected state and cost growth remain consistent.
- Desktop/mobile visual checks confirm the bold Learn invitation, separated growth panel and dark surfaces. Scoped table gain/loss colors were inspected after correcting the old global color override.
- Recap snapshot/practice/example source states, actual saved timestamp and negative simulated contributor were checked. Full screen-reader study and live integrations were not performed.
- git diff --check passes.

## Remaining work / next step

None required for these comments. Live updates and actual monthly history remain deferred, as previously scoped.

## Coordination

No subagents, commits, deployments, dependency changes or migrations. Existing unrelated work preserved. Shared context/style files updated narrowly; previous handoffs remain applicable.
