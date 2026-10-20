import { array, boolean, enum as enumSchema, type infer as Infer, literal, number, object, record, string } from "zod";
import type { PortfolioSnapshot } from "./domain";

export const practiceAssets = [
  {
    symbol: "CAFE",
    name: "Campus Café",
    kind: "One fictional company",
    sector: "Hospitality",
    assetClass: "equity" as const,
  },
  {
    symbol: "BROAD",
    name: "Broad Basket",
    kind: "Fictional domestic stock fund",
    sector: "Broad stocks",
    assetClass: "fund" as const,
  },
  {
    symbol: "WORLD",
    name: "World Basket",
    kind: "Fictional international stock fund",
    sector: "International stocks",
    assetClass: "fund" as const,
  },
  {
    symbol: "BONDS",
    name: "Bond Basket",
    kind: "Fictional bond fund",
    sector: "Bonds",
    assetClass: "fixed-income" as const,
  },
];
export const scenarios = [
  {
    id: "market",
    title: "When the whole market dips",
    description: "See how a broad decline affects different investments.",
    prices: [
      [20, 50, 40, 25],
      [18, 46, 37, 25],
      [17, 44, 36, 24],
      [19, 47, 38, 25],
    ],
    notes: [
      "Stock baskets fell together in this fictional week. A wider mix can still lose value.",
      "The decline continued. Bonds fell too: different investments are not guaranteed to offset one another.",
      "Some prices recovered, but they remain below the starting point. Recovery is never guaranteed.",
    ],
  },
  {
    id: "company",
    title: "One café, one big surprise",
    description: "Explore the difference between a company and a basket.",
    prices: [
      [20, 50, 40, 25],
      [12, 49, 40, 25],
      [10, 50, 41, 25],
      [13, 51, 40, 25],
    ],
    notes: [
      "A fictional café closure hit CAFE much harder than the baskets. One company can carry a very specific risk.",
      "The café fell again while other assets moved differently. More tickers help only if their risks differ.",
      "The café improved but has not recovered its starting price. A lower price is not a promise of a rebound.",
    ],
  },
  {
    id: "mixed",
    title: "A week of mixed signals",
    description: "Watch gains and losses offset one another.",
    prices: [
      [20, 50, 40, 25],
      [22, 49, 42, 25],
      [19, 52, 39, 24],
      [21, 51, 43, 25],
    ],
    notes: [
      "Some investments rose while others fell. The size of each holding affects the combined result.",
      "This week’s winners differ from last week’s. A short sequence cannot tell you what comes next.",
      "Your mix determines the net result. A profitable practice run does not measure investing skill.",
    ],
  },
] as const;
const position = object({
  quantity: number().int().nonnegative(),
  costCents: number().int().nonnegative(),
});
const order = object({
  id: string(),
  symbol: string(),
  side: enumSchema(["buy", "sell"]),
  quantity: number().int().positive(),
  priceCents: number().int().positive(),
  week: number().int().min(0).max(3),
  at: string(),
});
const checkpoint = object({
  week: number().int(),
  beforeCents: number().int(),
  afterCents: number().int(),
  at: string(),
  reflected: boolean(),
});
export const practiceSchema = object({
  version: literal(1).default(1),
  runId: string().default(""),
  scenarioId: enumSchema(["market", "company", "mixed"]).default("market"),
  week: number().int().min(0).max(3).default(0),
  cashCents: number().int().nonnegative().default(100000),
  positions: record(string(), position)
    .refine(
      (value) =>
        Object.keys(value).every((symbol) =>
          practiceAssets.some((asset) => asset.symbol === symbol),
        ),
      "Unknown practice asset",
    )
    .default({}),
  orders: array(order).default([]),
  checkpoints: array(checkpoint).default([]),
});
export type PracticeState = Infer<typeof practiceSchema>;
export const emptyPractice = practiceSchema.parse({});
export const scenarioFor = (state: PracticeState) =>
  scenarios.find((scenario) => scenario.id === state.scenarioId)!;
export function startPractice(
  scenarioId: PracticeState["scenarioId"],
  runId: string,
): PracticeState {
  return practiceSchema.parse({ scenarioId, runId });
}
export function priceCents(
  state: PracticeState,
  symbol: string,
  week = state.week,
) {
  const index = practiceAssets.findIndex((asset) => asset.symbol === symbol);
  if (index < 0) throw new Error("Choose an investment from this scenario.");
  return scenarioFor(state).prices[week][index] * 100;
}
export function practiceValue(state: PracticeState, week = state.week) {
  return (
    state.cashCents +
    Object.entries(state.positions).reduce(
      (sum, [symbol, p]) => sum + p.quantity * priceCents(state, symbol, week),
      0,
    )
  );
}
export type OrderInput = {
  id: string;
  symbol: string;
  side: "buy" | "sell";
  quantity: number;
  expectedWeek: number;
  expectedRun: string;
};
export function placeOrder(
  state: PracticeState,
  input: OrderInput,
  now = new Date(),
): PracticeState {
  if (state.orders.some((order) => order.id === input.id)) return state;
  if (
    !state.runId ||
    state.runId !== input.expectedRun ||
    state.week !== input.expectedWeek
  )
    throw new Error("Your practice week changed. Preview this order again.");
  if (state.week >= 3)
    throw new Error(
      "This scenario is complete. Start another when you’re ready.",
    );
  if (!Number.isSafeInteger(input.quantity) || input.quantity < 1)
    throw new Error("Enter a positive whole number of shares.");
  const price = priceCents(state, input.symbol),
    total = price * input.quantity;
  if (!Number.isSafeInteger(total)) throw new Error("That order is too large.");
  const current = state.positions[input.symbol] ?? {
    quantity: 0,
    costCents: 0,
  };
  if (input.side === "buy" && total > state.cashCents)
    throw new Error("There isn’t enough fictional cash for this order.");
  if (input.side === "sell" && input.quantity > current.quantity)
    throw new Error("You can only sell shares you hold in this practice run.");
  const quantity =
    current.quantity +
    (input.side === "buy" ? input.quantity : -input.quantity);
  const costCents =
    input.side === "buy"
      ? current.costCents + total
      : quantity === 0
        ? 0
        : Math.round((current.costCents * quantity) / current.quantity);
  return {
    ...state,
    cashCents: state.cashCents + (input.side === "buy" ? -total : total),
    positions: { ...state.positions, [input.symbol]: { quantity, costCents } },
    orders: [
      ...state.orders,
      {
        id: input.id,
        symbol: input.symbol,
        side: input.side,
        quantity: input.quantity,
        priceCents: price,
        week: state.week,
        at: now.toISOString(),
      },
    ],
  };
}
export function advancePractice(
  state: PracticeState,
  expectedWeek: number,
  now = new Date(),
): PracticeState {
  if (!state.runId || state.week !== expectedWeek || state.week >= 3)
    return state;
  if (state.checkpoints.some((point) => !point.reflected))
    throw new Error("Reflect on this week before moving to the next one.");
  return {
    ...state,
    week: state.week + 1,
    checkpoints: [
      ...state.checkpoints,
      {
        week: state.week + 1,
        beforeCents: practiceValue(state),
        afterCents: practiceValue(state, state.week + 1),
        at: now.toISOString(),
        reflected: false,
      },
    ],
  };
}
export function practiceSnapshot(state: PracticeState): PortfolioSnapshot {
  return {
    id: `practice-${state.runId}-${state.week}`,
    source: "simulation",
    freshness: "simulated",
    asOf:
      state.checkpoints.at(-1)?.at ??
      state.orders.at(-1)?.at ??
      "2026-01-01T12:00:00Z",
    currency: "USD",
    holdings: practiceAssets
      .filter((asset) => (state.positions[asset.symbol]?.quantity ?? 0) > 0)
      .map((asset) => ({
        ...asset,
        quantity: state.positions[asset.symbol].quantity,
        price: priceCents(state, asset.symbol) / 100,
        previousClose:
          priceCents(state, asset.symbol, Math.max(0, state.week - 1)) / 100,
        costBasis: state.positions[asset.symbol].costCents / 100,
      })),
  };
}




// Fixed scenario definitions were introduced on this date; it is not a market quote date.
export const scenarioDataAsOf = "2026-10-12T12:00:00.000Z";
export function practiceAsOf(state: PracticeState) {
  return [...state.orders, ...state.checkpoints].map(item => item.at)
    .filter(at => Number.isFinite(Date.parse(at))).sort((a,b) => Date.parse(b)-Date.parse(a))[0] ?? scenarioDataAsOf;
}
