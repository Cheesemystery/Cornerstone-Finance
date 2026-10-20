import { z } from "zod";
export const closeSchema = z.object({ date: z.iso.date(), close: z.number().finite().positive().max(1_000_000) });
export const historySchema = z.object({
  mode: z.enum(["sample", "provider"]), provider: z.string(), currency: z.literal("USD"),
  asOf: z.iso.date(), series: z.record(z.string(), z.array(closeSchema).max(400)),
});
export type HistoricalData = z.infer<typeof historySchema>;
export type HistoricalClose = z.infer<typeof closeSchema>;
