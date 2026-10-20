import type { HistoricalData } from "@/lib/historical-data";
import { dataStamp } from "@/lib/presentation";
export function WeekSource({ history, endDate }: { history: HistoricalData; endDate?: string }) {
  const label = dataStamp(history.mode === "sample", endDate ?? history.asOf);
  return <p className={"week-source " + (history.mode === "sample" ? "week-sample-banner" : "")} role="note">
    {history.mode === "sample" ? label : <>{label} · <a href="https://twelvedata.com/" target="_blank" rel="noreferrer">{history.provider}</a></>}
  </p>;
}
