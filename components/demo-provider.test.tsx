// @vitest-environment jsdom
import { act, cleanup, render } from "@testing-library/react";
import { memo, StrictMode } from "react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { DemoProvider, useDemo } from "./demo-provider";
import { emptySavedHoldings } from "@/lib/saved-holdings";
import { getSampleHistoricalCloses } from "@/lib/sample-history";

const features = vi.hoisted(() => ({ connectedFeaturesEnabled: false }));
vi.mock("@/lib/features", () => features);
let demo: ReturnType<typeof useDemo>;
const observe = vi.fn();
const Consumer = memo(function Consumer() {
  demo = useDemo();
  observe(demo);
  return <output>{demo.preferences.name}</output>;
});

beforeEach(() => {
  features.connectedFeaturesEnabled = false;
  localStorage.setItem("cornerstone-holdings-v1", JSON.stringify(emptySavedHoldings));
  localStorage.setItem("cornerstone-demo-v1", JSON.stringify({ name: "Alex" }));
  observe.mockClear();
  vi.stubGlobal("fetch", vi.fn());
});
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  vi.useRealTimers();
  localStorage.clear();
});

it("keeps the context stable on unrelated parent renders and leaves guest mode offline", () => {
  const view = render(<DemoProvider><Consumer /></DemoProvider>);
  const first = demo;
  view.rerender(<DemoProvider><Consumer /></DemoProvider>);
  expect(demo).toBe(first);
  expect(observe).toHaveBeenCalledTimes(1);
  expect(fetch).not.toHaveBeenCalled();
});

it("merges consecutive preference edits and follows updates from another tab", () => {
  render(<DemoProvider><Consumer /></DemoProvider>);
  act(() => {
    demo.update({ name: "Sam" });
    demo.update({ compact: true });
  });
  expect(demo.preferences).toMatchObject({ name: "Sam", compact: true });
  act(() => {
    localStorage.setItem("cornerstone-demo-v1", JSON.stringify({ name: "Taylor", compact: false }));
    window.dispatchEvent(new StorageEvent("storage", { key: "cornerstone-demo-v1" }));
  });
  expect(demo.preferences).toMatchObject({ name: "Taylor", compact: false });
});

it("persists holdings separately from preferences, supports contribution edits, and clears local holdings on reset", async () => {
  vi.mocked(fetch).mockResolvedValue(new Response(JSON.stringify(getSampleHistoricalCloses(["VTI"],"2026-08-24","2026-09-02"))));
  render(<DemoProvider><Consumer /></DemoProvider>);
  await act(async () => {
    demo.replaceHoldings([{ticker:"VTI",shares:2}]);
    demo.setContributions(events => events.slice(0,1).map(event=>({...event,amount:123})));
  });
  expect(demo.savedHoldings.holdings).toEqual([{ticker:"VTI",shares:2}]);
  expect(JSON.parse(localStorage.getItem("cornerstone-holdings-v1")!).holdings).toEqual([{ticker:"VTI",shares:2}]);
  expect(demo.contributions[0].amount).toBe(123);
  act(()=>demo.reset());
  expect(demo.savedHoldings.holdings).toEqual([]);
  expect(demo.portfolio.holdings).toEqual([]);
  expect(demo.contributions.length).toBeGreaterThan(1);
});

it("clears announcements after six seconds without changing stored preferences", () => {
  vi.useFakeTimers();
  render(<DemoProvider><Consumer /></DemoProvider>);
  const preferences = demo.preferences;
  act(() => demo.announce("Test notice"));
  act(() => vi.advanceTimersByTime(6000));
  expect(demo.notice).toBe("");
  expect(demo.preferences).toBe(preferences);
});

it("loads connected records atomically and preserves them during a demo reset", async () => {
  features.connectedFeaturesEnabled = true;
  vi.mocked(fetch)
    .mockResolvedValueOnce(new Response(JSON.stringify({ contributions: [{
      id: "server-event", occurred_on: "2026-10-01", amount: "42", direction: "contribution",
      status: "confirmed", source: "manual", user_corrected: true,
    }] })))
    .mockResolvedValueOnce(new Response(JSON.stringify({ preferences: {
      latest_seen_period: "2026-09", timezone: "America/New_York",
    } })));
  await act(async () => { render(<DemoProvider><Consumer /></DemoProvider>); });
  expect(demo.contributionMode).toBe("server");
  expect(demo.recapTimezone).toBe("America/New_York");
  expect(demo.preferences.recapSeen).toBe("2026-09");
  expect(demo.contributions).toEqual([expect.objectContaining({ id: "server-event", amount: 42, userCorrected: true })]);
  act(() => demo.reset());
  expect(demo.contributions[0].id).toBe("server-event");
});

it("does not sync stale preferences when unmounted during JSON decoding", async () => {
  features.connectedFeaturesEnabled = true;
  let finish!: (value: unknown) => void;
  const pendingBody = new Promise(resolve => { finish = resolve; });
  vi.mocked(fetch)
    .mockResolvedValueOnce(new Response(JSON.stringify({ contributions: [] })))
    .mockResolvedValueOnce({ ok: true, json: () => pendingBody } as Response);
  let view!: ReturnType<typeof render>;
  await act(async () => { view = render(<DemoProvider><Consumer /></DemoProvider>); });
  expect(fetch).toHaveBeenCalledTimes(2);
  const options = vi.mocked(fetch).mock.calls[1][1];
  view.unmount();
  expect(options?.signal?.aborted).toBe(true);
  await act(async () => { finish({ preferences: { latest_seen_period: "2026-10" } }); });
  expect(JSON.parse(localStorage.getItem("cornerstone-demo-v1")!).recapSeen).toBeUndefined();
});

it("ignores the obsolete Strict Mode request and accepts the active request", async () => {
  features.connectedFeaturesEnabled = true;
  let finish!: (response: Response) => void;
  vi.mocked(fetch)
    .mockImplementationOnce(() => new Promise(resolve => { finish = resolve; }))
    .mockResolvedValueOnce(new Response(JSON.stringify({ contributions: [] })))
    .mockResolvedValueOnce(new Response(JSON.stringify({ preferences: { timezone: "UTC" } })));
  await act(async () => { render(<StrictMode><DemoProvider><Consumer /></DemoProvider></StrictMode>); });
  expect(vi.mocked(fetch).mock.calls[0][1]?.signal?.aborted).toBe(true);
  expect(demo.contributionMode).toBe("server");
  expect(demo.recapTimezone).toBe("UTC");
  await act(async () => { finish(new Response("{}", { status: 401 })); });
  expect(demo.contributionMode).toBe("server");
});

it("falls back to sample data on a connected request failure", async () => {
  features.connectedFeaturesEnabled = true;
  vi.mocked(fetch).mockRejectedValue(new Error("offline"));
  await act(async () => { render(<DemoProvider><Consumer /></DemoProvider>); });
  expect(demo.contributionMode).toBe("sample");
  expect(demo.portfolio.holdings).toEqual([]);
});
