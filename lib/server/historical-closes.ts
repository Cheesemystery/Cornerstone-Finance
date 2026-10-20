import "server-only";
import { z } from "zod";
import { tickerSchema } from "@/lib/saved-holdings";
import { closeSchema, type HistoricalData } from "@/lib/historical-data";
import { getSampleHistoricalCloses, sampleHistoryDates } from "@/lib/sample-history";

export interface HistoricalCloseProvider {
  getHistoricalCloses(tickers: string[], fromDate: string, toDate: string): Promise<HistoricalData>;
}
const providerResponse = z.object({
  meta: z.object({ symbol: z.string(), currency: z.literal("USD"), interval: z.literal("1day") }),
  values: z.array(z.object({ datetime: z.iso.date(), close: z.coerce.number().finite().positive().max(1_000_000) })).max(400),
});
const cache = new Map<string, { expires: number; data: HistoricalData }>();
class TwelveDataCloses implements HistoricalCloseProvider {
  constructor(private apiKey: string) {}
  async getHistoricalCloses(tickers: string[], fromDate: string, toDate: string): Promise<HistoricalData> {
    const entries = await Promise.all(tickers.map(async ticker => {
      const url = new URL("https://api.twelvedata.com/time_series");
      Object.entries({ symbol: ticker, interval: "1day", start_date: fromDate, end_date: toDate, order: "ASC", adjust: "none" }).forEach(([key,value]) => url.searchParams.set(key,value));
      const response = await fetch(url, { headers: { Authorization: `apikey ${this.apiKey}` }, cache: "no-store", signal: AbortSignal.timeout(8000) });
      if (!response.ok) throw new Error("Closing prices could not be loaded. Try again or use the sample portfolio.");
      const parsed = providerResponse.safeParse(await response.json());
      if (!parsed.success || parsed.data.meta.symbol.toUpperCase() !== ticker) throw new Error("Complete USD closing prices could not be checked. Try another ticker or use the sample portfolio.");
      const points = parsed.data.values.filter(p => p.datetime >= fromDate && p.datetime <= toDate).map(p => closeSchema.parse({ date: p.datetime, close: p.close }));
      if (new Set(points.map(p => p.date)).size !== points.length) throw new Error("The price history contained duplicate dates. Please retry.");
      return [ticker, points] as const;
    }));
    const dates = entries.flatMap(([,points]) => points.map(p => p.date)).sort();
    return { mode: "provider", provider: "Twelve Data", currency: "USD", asOf: dates.at(-1) ?? toDate, series: Object.fromEntries(entries) };
  }
}
export function defaultHistoryRange(now = new Date()) {
  if (!process.env.TWELVE_DATA_API_KEY?.trim()) return { fromDate: sampleHistoryDates[0], toDate: sampleHistoryDates.at(-1)! };
  // Exclude today's potentially unfinished daily candle. Weekends/holidays are handled by actual returned closes.
  const end = new Date(now); end.setUTCDate(end.getUTCDate() - 1);
  const start = new Date(end); start.setUTCDate(start.getUTCDate() - 90);
  return { fromDate: start.toISOString().slice(0,10), toDate: end.toISOString().slice(0,10) };
}
/** Server-only boundary. Replacing the adapter does not change the browser contract. */
export async function getHistoricalCloses(tickers: string[], fromDate: string, toDate: string): Promise<HistoricalData> {
  const symbols = z.array(tickerSchema).min(1).max(50).parse(tickers);
  z.iso.date().parse(fromDate); z.iso.date().parse(toDate);
  if (fromDate > toDate || Date.parse(toDate) - Date.parse(fromDate) > 366 * 86400000) throw new Error("Choose a valid history window of at most one year.");
  const apiKey = process.env.TWELVE_DATA_API_KEY?.trim();
  if (!apiKey) return getSampleHistoricalCloses(symbols, fromDate, toDate);
  const key = `${[...symbols].sort().join(",")}:${fromDate}:${toDate}`;
  const cached = cache.get(key);
  if (cached && cached.expires > Date.now()) return cached.data;
  const data = await new TwelveDataCloses(apiKey).getHistoricalCloses(symbols, fromDate, toDate);
  if (cache.size >= 100) cache.delete(cache.keys().next().value!);
  cache.set(key, { data, expires: Date.now() + 3_600_000 });
  return data;
}
