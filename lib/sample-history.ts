import type { HistoricalData } from "./historical-data";

// Authored sample closes on actual calendar dates, not verified market prices.
// The entire response is labeled sample; no fixture row fills a live response.
export const sampleHistoryDates = ["2026-08-24", "2026-08-25", "2026-08-26", "2026-08-27", "2026-08-28", "2026-08-31", "2026-09-01", "2026-09-02"];
const prices: Record<string, number[]> = {
  VTI: [324, 325, 326, 323, 320, 317, 318.61, 321.44],
  VXUS: [72, 72.5, 73, 73.5, 74, 74.2, 74.51, 74.16],
  BND: [73.7, 73.8, 74, 74.2, 74.5, 74.8, 74.92, 75.03],
  AAPL: [230, 231, 233, 232, 230, 226, 227.77, 229.18],
};
export function getSampleHistoricalCloses(tickers: string[], fromDate: string, toDate: string): HistoricalData {
  const series = Object.fromEntries(tickers.map(ticker => [ticker, (prices[ticker] ?? []).flatMap((close, i) => {
    const date = sampleHistoryDates[i];
    return date >= fromDate && date <= toDate ? [{ date, close }] : [];
  })]));
  const dates = Object.values(series).flat().map(point => point.date).sort();
  return { mode: "sample", provider: "Bundled sample", currency: "USD", asOf: dates.at(-1) ?? sampleHistoryDates.at(-1)!, series };
}
