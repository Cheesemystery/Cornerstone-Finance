import type { PortfolioSnapshot } from "./domain";
import type { SavedHolding } from "./saved-holdings";
import { holdingsIdentity } from "./saved-holdings";
import type { HistoricalData } from "./historical-data";

export function calendarWeek(now: Date, timezone: string) {
  const day = new Intl.DateTimeFormat("en-CA", { timeZone: timezone, year: "numeric", month: "2-digit", day: "2-digit" }).format(now);
  const date = new Date(day + "T12:00:00Z");
  date.setUTCDate(date.getUTCDate() - ((date.getUTCDay() + 6) % 7));
  return date.toISOString().slice(0,10);
}
export function calculateWeek(holdings: SavedHolding[], history: HistoricalData) {
  if (!holdings.length) return null;
  const datesByTicker = holdings.map(h => new Map((history.series[h.ticker] ?? []).map(p => [p.date, p.close])));
  const dates = [...datesByTicker[0].keys()].filter(date => datesByTicker.every(series => series.has(date))).sort();
  const endDate = dates.at(-1);
  if (!endDate) return null;
  const cutoff = new Date(endDate + "T12:00:00Z");
  cutoff.setUTCDate(cutoff.getUTCDate() - 7);
  const startDate = dates.filter(date => date <= cutoff.toISOString().slice(0,10)).at(-1);
  if (!startDate) return null;
  const positions = holdings.map((holding, i) => {
    const startClose = datesByTicker[i].get(startDate)!, endClose = datesByTicker[i].get(endDate)!;
    return { ...holding, startClose, endClose, startValue: holding.shares * startClose, endValue: holding.shares * endClose, contribution: holding.shares * (endClose - startClose) };
  });
  const startValue = positions.reduce((sum, h) => sum + h.startValue, 0);
  const change = positions.reduce((sum, h) => sum + h.contribution, 0);
  if (!(startValue > 0) || !Number.isFinite(change)) return null;
  const ranked = [...positions].sort((a,b) => Math.abs(b.contribution) - Math.abs(a.contribution) || a.ticker.localeCompare(b.ticker));
  const direction = Math.abs(change) < 0.005 && Math.abs(change / startValue * 100) < 0.005 ? "flat" : change > 0 ? "up" : "down";
  const driver = direction === "flat" ? ranked.find(h => Math.abs(h.contribution) >= 0.005) : [...positions].sort((a,b) => direction === "down" ? a.contribution-b.contribution || a.ticker.localeCompare(b.ticker) : b.contribution-a.contribution || a.ticker.localeCompare(b.ticker))[0];
  const offset = driver ? ranked.find(h => h.contribution * driver.contribution < 0) : undefined;
  const mixed = positions.some(h => h.contribution >= 0.005) && positions.some(h => h.contribution <= -0.005);
  const lessonId = driver && !["VTI", "VXUS", "BND"].includes(driver.ticker) && driver.startValue / startValue >= 0.4 ? "spread-your-risk" : "why-prices-move";
  return { startDate, endDate, startValue, endValue: positions.reduce((sum,h) => sum+h.endValue,0), change, percent: change / startValue * 100, positions, direction, driver, offset, mixed, lessonId,
    identity: `${history.mode}:${startDate}:${endDate}:` + JSON.stringify(positions.map(h => [h.ticker,h.shares,h.startClose,h.endClose])),
  };
}
export type PortfolioWeek = NonNullable<ReturnType<typeof calculateWeek>>;
const signed = (value: number) => `${value < 0 ? "−" : value > 0 ? "+" : ""}$${Math.abs(value).toFixed(2)}`;
export function weeklyCopy(week: PortfolioWeek): [string, string] {
  const driver = week.driver, offset = week.offset;
  if (week.direction === "flat") return driver && offset
    ? [`The week finished flat: ${driver.ticker} contributed ${signed(driver.contribution)}.`, `${offset.ticker} was the biggest offset (${signed(offset.contribution)}), balancing the move with the other holdings.`]
    : ["Your holdings finished this week unchanged ($0.00).", "No holding made a material contribution ($0.00), and there was no opposing offset ($0.00)."];
  const first = week.direction === "down"
    ? `Most of the decline came from ${driver!.ticker} (${signed(driver!.contribution)}).`
    : `${driver!.ticker} made the biggest positive contribution (${signed(driver!.contribution)}).`;
  const second = offset
    ? `${offset.ticker} was the biggest offset (${signed(offset.contribution)})${week.direction === "down" ? "; these mixed weekly moves do not establish a long-term trend." : "; these mixed moves describe this week, not what happens next."}`
    : `There was no opposing offset ($0.00)${week.direction === "down" ? "; a single week does not establish a long-term trend." : "; one positive week does not predict the next."}`;
  return [first, second];
}
export function weeklySnapshot(holdings: SavedHolding[], history: HistoricalData, week: PortfolioWeek | null): PortfolioSnapshot {
  return { id: "weekly-" + holdingsIdentity(holdings), source: history.mode === "sample" ? "sample" : "manual", asOf: (week?.endDate ?? history.asOf) + "T20:00:00.000Z", freshness: history.mode === "sample" ? "simulated" : "delayed", currency: "USD", comparisonPeriod: "week", periodStart: week?.startDate, priceProvider: history.provider,
    holdings: week ? week.positions.map(h => ({ symbol: h.ticker, name: h.ticker, quantity: h.shares, price: h.endClose, previousClose: h.startClose, costBasis: h.costBasis, sector: "Unclassified", assetClass: h.ticker === "BND" ? "fixed-income" : ["VTI","VXUS"].includes(h.ticker) ? "fund" : "equity" })) : [],
  };
}
