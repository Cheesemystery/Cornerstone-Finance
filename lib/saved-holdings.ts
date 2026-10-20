import { z } from "zod";
import { parseCsvRows } from "./csv";

export const tickerSchema = z.string().trim().toUpperCase().regex(/^[A-Z][A-Z0-9.-]{0,14}$/);
export const savedHoldingSchema = z.object({
  ticker: tickerSchema,
  shares: z.number().finite().positive().max(1_000_000),
  // Total position cost, not cost per share.
  costBasis: z.number().finite().nonnegative().max(1e12).optional(),
}).strict();
export const holdingsListSchema = z.array(savedHoldingSchema).max(50).refine(
  items => new Set(items.map(item => item.ticker)).size === items.length,
  "Use one row per ticker; combine duplicate positions first.",
);
export const savedHoldingsSchema = z.object({
  version: z.literal(1), source: z.enum(["sample", "user"]), holdings: holdingsListSchema,
  timezone: z.string().refine(value => { try { new Intl.DateTimeFormat("en", { timeZone: value }); return true; } catch { return false; } }),
  completedWeeks: z.record(z.string(), z.object({ lessonId: z.string(), completedAt: z.iso.datetime() })).default({}),
  activeWeek: z.object({ key: z.string(), snapshot: z.string(), lessonId: z.string() }).nullable().default(null),
});
export type SavedHolding = z.infer<typeof savedHoldingSchema>;
export type SavedHoldings = z.infer<typeof savedHoldingsSchema>;
export const emptySavedHoldings: SavedHoldings = { version: 1, source: "user", holdings: [], timezone: "America/Chicago", completedWeeks: {}, activeWeek: null };
export const sampleSavedHoldings: SavedHolding[] = [
  { ticker: "VTI", shares: 9, costBasis: 2480 }, { ticker: "VXUS", shares: 22, costBasis: 1460 },
  { ticker: "BND", shares: 19, costBasis: 1395 }, { ticker: "AAPL", shares: 4, costBasis: 710 },
];
export function parseSavedHoldingsCsv(text: string): SavedHolding[] {
  if (new TextEncoder().encode(text).length > 2_000_000) throw new Error("Choose a CSV smaller than 2 MB.");
  const rows = parseCsvRows(text.replace(/^\uFEFF/, ""));
  if (rows.length < 2 || rows.length > 51) throw new Error("Include a header and 1–50 holdings.");
  const headers = rows[0].map(value => value.toLowerCase().replace(/[ _-]/g, ""));
  if (new Set(headers).size !== headers.length) throw new Error("Remove duplicate column names.");
  const ticker = headers.includes("ticker") ? headers.indexOf("ticker") : headers.indexOf("symbol");
  const shares = headers.includes("shares") ? headers.indexOf("shares") : headers.indexOf("quantity");
  const cost = headers.indexOf("costbasis");
  if (ticker < 0 || shares < 0) throw new Error("Include ticker and shares columns. Cost basis is optional.");
  const parsed = holdingsListSchema.safeParse(rows.slice(1).map(row => {
    if (row.length !== headers.length) throw new Error("Every row must match the header columns.");
    return { ticker: row[ticker], shares: Number(row[shares]), ...(cost >= 0 && row[cost] !== "" ? { costBasis: Number(row[cost]) } : {}) };
  }));
  if (!parsed.success) throw new Error("Check tickers, positive share counts, optional non-negative cost basis, and duplicate tickers.");
  return parsed.data;
}
const exportSchema = z.object({ version: z.literal(1), source: z.enum(["sample", "user"]), holdings: holdingsListSchema }).strict();
export function exportHoldings(state: Pick<SavedHoldings, "source" | "holdings">) {
  return JSON.stringify({ version: 1, source: state.source, holdings: state.holdings }, null, 2);
}
export function importHoldings(text: string) {
  if (new TextEncoder().encode(text).length > 2_000_000) throw new Error("Choose a JSON file smaller than 2 MB.");
  try { return exportSchema.parse(JSON.parse(text)); }
  catch { throw new Error("Choose a Cornerstone holdings JSON with version 1, source, and valid ticker/share rows."); }
}
/** Local identity; never send share counts or this identity to the price provider. */
export function holdingsIdentity(holdings: SavedHolding[]) {
  const text = [...holdings].sort((a,b) => a.ticker.localeCompare(b.ticker)).map(h => `${h.ticker}:${h.shares}`).join("|");
  let hash = 2166136261;
  for (const char of text) hash = Math.imul(hash ^ char.charCodeAt(0), 16777619);
  return (hash >>> 0).toString(16);
}
