# Home, Portfolio and Discover clarity pass

Date: 2026-09-22

## Changed

- Moved the interactive allocation chart to the first module on `/portfolio` and updated the movement helper copy to refer to the chart above.
- Replaced the Home Recap promo with an inline assistant card. Starter prompts and typed questions use `demoAnswer(question, portfolio)` so answers reflect the current sample or CSV portfolio. The card links to the existing full Assistant.
- Rewrote the Discover location-risk hero so the headline itself communicates the lesson, with explicit U.S. and international exposure labels.
- Added responsive styles for the Home assistant card.

## Verification

- `npm run lint`
- `npm run typecheck`
- `npm test -- --run` — 53 tests in 10 files
- `npm run build` — 39 generated pages
- Browser: `/portfolio` starts with the allocation chart; `/` returns an inline portfolio answer; `/discover` shows the revised concentration explanation.

## Boundary

The assistant uses curated local responses and deterministic portfolio math. It is not connected to a live AI model, brokerage, market feed or live news source, and it does not provide buy/sell instructions.
