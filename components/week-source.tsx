import type { HistoricalData } from "@/lib/historical-data";
import { displayDate } from "@/lib/presentation";
export function WeekSource({ history, endDate }: { history: HistoricalData; endDate?: string }) {
  const date = displayDate(endDate ?? history.asOf);
  return <p className={"week-source " + (history.mode === "sample" ? "week-sample-banner" : "")} role="note">
    {history.mode === "sample" ? `Sample data - as of ${date}` : <>Closing prices · as of {date} · <a href="https://twelvedata.com/" target="_blank" rel="noreferrer">{history.provider}</a></>}
  </p>;
}
