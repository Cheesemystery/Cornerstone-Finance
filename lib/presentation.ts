import type { PortfolioSnapshot } from "./domain";

export const money = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);
export const signedMoney = (value: number) =>
  `${value < 0 ? "−" : value > 0 ? "+" : ""}${money(Math.abs(value))}`;
const assetColors = [
  "#2a8b62",
  "#8c77df",
  "#bd861f",
  "#357ca9",
  "#b95877",
  "#667e39",
];
export function assetColor(symbol: string) {
  const fixed: Record<string, number> = {
    VTI: 0,
    VXUS: 1,
    BND: 2,
    AAPL: 3,
    CAFE: 0,
    BROAD: 1,
    WORLD: 2,
    BONDS: 3,
  };
  return assetColors[
    fixed[symbol] ??
      [...symbol].reduce((sum, char) => sum + char.charCodeAt(0), 0) %
        assetColors.length
  ];
}
export function sourceLabel(portfolio: PortfolioSnapshot) {
  return portfolio.source === "simulation"
    ? "Fictional practice"
    : portfolio.source === "csv"
      ? "CSV preview"
      : portfolio.source === "sample"
        ? "Sample portfolio"
        : "Saved holdings";
}
export const displayDate = (date: string) =>
  new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(date.length === 10 ? `${date}T12:00:00Z` : date));

/** The snapshot date is the price date, never the time the page was opened. */
export function snapshotAsOf(portfolio: PortfolioSnapshot) {
  return (portfolio.source === "sample" ? "Sample data - as of " : portfolio.source === "csv" ? "CSV prices - as of " : "As of ") + displayDate(portfolio.asOf);
}

export function comparisonLabel(portfolio: PortfolioSnapshot) {
  return portfolio.comparisonPeriod === "week" && portfolio.periodStart
    ? "From " + displayDate(portfolio.periodStart) + " to " + displayDate(portfolio.asOf)
    : "vs. previous close";
}
