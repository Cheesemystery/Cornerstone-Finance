"use client";
import { useCallback, useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { createBrowserStore } from "@/lib/browser-store";
import { emptySavedHoldings, holdingsListSchema, savedHoldingsSchema, sampleSavedHoldings, holdingsIdentity, type SavedHolding, type SavedHoldings } from "@/lib/saved-holdings";
import { historySchema, type HistoricalData } from "@/lib/historical-data";
import { calculateWeek, calendarWeek, weeklySnapshot } from "@/lib/weekly-portfolio";

const store = createBrowserStore("cornerstone-holdings-v1", emptySavedHoldings, raw => savedHoldingsSchema.parse(raw), () => ({ ...emptySavedHoldings, timezone: Intl.DateTimeFormat().resolvedOptions().timeZone }));
const subscribeHydration = () => () => {};
const emptyHistory: HistoricalData = { mode: "sample", provider: "", currency: "USD", asOf: "2026-09-02", series: {} };
export function useWeeklyPortfolio() {
  const saved = store.useStore();
  const hydrated = useSyncExternalStore(subscribeHydration, () => true, () => false);
  const [loaded, setLoaded] = useState<{ signature: string; data?: HistoricalData; error?: string }>({ signature: "" });
  const [attempt, setAttempt] = useState(0), [now, setNow] = useState<Date | null>(null);
  const signature = JSON.stringify({ source: saved.value.source, tickers: saved.value.holdings.map(h => h.ticker).sort() });
  useEffect(() => {
    const tick = () => setNow(new Date()); tick();
    const timer = setInterval(tick, 60000);
    return () => clearInterval(timer);
  }, []);
  useEffect(() => {
    const request = JSON.parse(signature) as { source: "sample" | "user"; tickers: string[] };
    if (!hydrated || !request.tickers.length) return;
    const controller = new AbortController();
    async function load() {
      try {
        const response = await fetch("/api/prices/history", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ tickers: request.tickers, sample: request.source === "sample" }), signal: controller.signal });
        if (!response.ok) throw new Error("Closing prices could not be checked. Retry or use the sample portfolio.");
        const data = historySchema.parse(await response.json());
        if (!controller.signal.aborted) setLoaded({ signature, data });
      } catch {
        if (!controller.signal.aborted) setLoaded({ signature, error: "Closing prices could not be checked. Retry or use the sample portfolio." });
      }
    }
    void load();
    return () => controller.abort();
  }, [signature, hydrated, attempt]);
  const history = loaded.signature === signature ? loaded.data : undefined;
  const week = useMemo(() => history ? calculateWeek(saved.value.holdings, history) : null, [saved.value.holdings, history]);
  const portfolio = useMemo(() => weeklySnapshot(saved.value.holdings, history ?? emptyHistory, week), [saved.value.holdings, history, week]);
  const weekKey = week && now ? `${calendarWeek(now, saved.value.timezone)}:${history!.mode}:${holdingsIdentity(saved.value.holdings)}` : null;
  const replaceHoldings = useCallback((holdings: SavedHolding[], source: SavedHoldings["source"] = "user") => {
    const valid = holdingsListSchema.parse(holdings);
    store.update(current => ({ ...current, holdings: valid, source, activeWeek: null }));
  }, []);
  const selectSample = useCallback(() => replaceHoldings(sampleSavedHoldings, "sample"), [replaceHoldings]);
  const clearHoldings = useCallback(() => store.reset(), []);
  const retryHistory = useCallback(() => { setLoaded({ signature: "" }); setAttempt(value => value + 1); }, []);
  const beginWeek = useCallback(() => {
    if (!week || !weekKey) return;
    store.update(current => ({ ...current, activeWeek: { key: weekKey, snapshot: week.identity, lessonId: week.lessonId } }));
  }, [week, weekKey]);
  const finishWeek = useCallback((lessonId: string) => {
    if (!week || !weekKey) return;
    store.update(current => {
      const active = current.activeWeek;
      if (!active || active.key !== weekKey || active.snapshot !== week.identity || active.lessonId !== lessonId) return current;
      return { ...current, activeWeek: null, completedWeeks: { ...current.completedWeeks, [weekKey]: { lessonId, completedAt: new Date().toISOString() } } };
    });
  }, [week, weekKey]);
  const historyStatus = !hydrated ? "loading" : !saved.value.holdings.length ? "empty" : loaded.signature !== signature ? "loading" : loaded.error ? "error" : week ? "ready" : "insufficient";
  return useMemo(() => ({
    portfolio, savedHoldings: saved.value, replaceHoldings, selectSample, clearHoldings, retryHistory,
    history, week, weekKey, beginWeek, finishWeek,
    weekDone: Boolean(weekKey && week && saved.value.completedWeeks[weekKey]?.lessonId === week.lessonId),
    holdingsPersistence: saved.persistence, historyStatus,
  }), [portfolio, saved.value, saved.persistence, replaceHoldings, selectSample, clearHoldings, retryHistory, history, week, weekKey, beginWeek, finishWeek, historyStatus]);
}
