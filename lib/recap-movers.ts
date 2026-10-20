import type { PortfolioSnapshot } from "./domain";
import { summarizePortfolio } from "./portfolio";
import { practiceAssets, priceCents, type PracticeState } from "./practice";

export function snapshotMovers(portfolio: PortfolioSnapshot) {
  return summarizePortfolio(portfolio)
    .contributors.map((item) => ({
      ...item,
      name:
        portfolio.holdings.find((holding) => holding.symbol === item.symbol)
          ?.name ?? item.symbol,
    }))
    .filter((item) => item.value !== 0)
    .sort((a, b) => Math.abs(b.value) - Math.abs(a.value))
    .slice(0, 3);
}

export function practiceMovers(state: PracticeState) {
  const checkpoint = state.checkpoints.at(-1);
  if (!checkpoint) return [];
  // Reconstruct holdings before the price advance; later trades must not
  // retroactively change attribution for the saved simulated week.
  return practiceAssets
    .map((asset) => {
      const quantity = state.orders
        .filter(
          (order) =>
            order.symbol === asset.symbol && order.week < checkpoint.week,
        )
        .reduce(
          (sum, order) =>
            sum + (order.side === "buy" ? order.quantity : -order.quantity),
          0,
        );
      return {
        symbol: asset.symbol,
        name: asset.name,
        value:
          (quantity *
            (priceCents(state, asset.symbol, checkpoint.week) -
              priceCents(state, asset.symbol, checkpoint.week - 1))) /
          100,
      };
    })
    .filter((item) => item.value !== 0)
    .sort((a, b) => Math.abs(b.value) - Math.abs(a.value))
    .slice(0, 3);
}

export function practiceUpdatedAt(state: PracticeState) {
  return (
    [...state.orders, ...state.checkpoints]
      .map((item) => item.at)
      .filter((at) => Number.isFinite(Date.parse(at)))
      .sort((a, b) => Date.parse(b) - Date.parse(a))[0] ?? null
  );
}
