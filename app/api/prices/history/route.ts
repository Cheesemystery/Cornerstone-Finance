import { z } from "zod";
import { tickerSchema } from "@/lib/saved-holdings";
import { defaultHistoryRange, getHistoricalCloses } from "@/lib/server/historical-closes";
import { getSampleHistoricalCloses, sampleHistoryDates } from "@/lib/sample-history";

const requestSchema = z.object({ tickers: z.array(tickerSchema).min(1).max(50), fromDate: z.iso.date().optional(), toDate: z.iso.date().optional(), sample: z.boolean().optional() }).strict();
export async function POST(request: Request) {
  const headers = { "Cache-Control": "private, no-store" };
  if (Number(request.headers.get("content-length")) > 16000) return Response.json({ error: "Choose up to 50 tickers." }, { status: 413, headers });
  const text = await request.text();
  if (text.length > 16000) return Response.json({ error: "Choose up to 50 tickers." }, { status: 413, headers });
  let body: unknown;
  try { body = JSON.parse(text); } catch { return Response.json({ error: "Send tickers and optional dates as JSON." }, { status: 400, headers }); }
  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) return Response.json({ error: "Check the tickers and YYYY-MM-DD dates." }, { status: 400, headers });
  const input = parsed.data;
  const defaults = input.sample ? { fromDate: sampleHistoryDates[0], toDate: sampleHistoryDates.at(-1)! } : defaultHistoryRange();
  const fromDate = input.fromDate ?? defaults.fromDate, toDate = input.toDate ?? defaults.toDate;
  if (fromDate > toDate || Date.parse(toDate) - Date.parse(fromDate) > 366 * 86400000 || toDate > new Date().toISOString().slice(0,10)) return Response.json({ error: "Choose a past history window of at most one year." }, { status: 400, headers });
  try {
    const tickers = [...new Set(input.tickers)];
    const data = input.sample ? getSampleHistoricalCloses(tickers, fromDate, toDate) : await getHistoricalCloses(tickers, fromDate, toDate);
    return Response.json(data, { headers });
  } catch {
    // Never return provider response bodies, URLs, keys, or submitted portfolio data.
    return Response.json({ error: "Closing prices could not be checked. Retry or use the sample portfolio." }, { status: 502, headers });
  }
}
