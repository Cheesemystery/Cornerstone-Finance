// @vitest-environment jsdom
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { DemoProvider } from "./demo-provider";
import { MvpProvider } from "./mvp-provider";
import { HomeDashboard } from "./home-dashboard";
import { emptyLearning } from "@/lib/learning-progress";
import { lessons } from "@/lib/lessons";
import { emptySavedHoldings, sampleSavedHoldings } from "@/lib/saved-holdings";
import { getSampleHistoricalCloses } from "@/lib/sample-history";

const data = getSampleHistoricalCloses(sampleSavedHoldings.map(h => h.ticker), "2026-08-24", "2026-09-02");
const home = () => render(<DemoProvider><MvpProvider><HomeDashboard /></MvpProvider></DemoProvider>);
beforeEach(() => {
  localStorage.setItem("cornerstone-holdings-v1", JSON.stringify({...emptySavedHoldings, holdings:sampleSavedHoldings, source:"sample"}));
  vi.stubGlobal("fetch", vi.fn(async () => new Response(JSON.stringify(data))));
  vi.stubGlobal("matchMedia", vi.fn(() => ({matches:false,addEventListener:vi.fn(),removeEventListener:vi.fn()})));
});
afterEach(() => { cleanup(); localStorage.clear(); vi.unstubAllGlobals(); vi.useRealTimers(); });

it.each(["empty", "short"])("offers inputs, first lesson and wall without a chart for %s history", async state => {
  if (state === "empty") localStorage.setItem("cornerstone-holdings-v1", JSON.stringify(emptySavedHoldings));
  else vi.mocked(fetch).mockResolvedValue(new Response(JSON.stringify({...data, series:Object.fromEntries(Object.entries(data.series).map(([ticker, closes]) => [ticker, closes.filter(close => close.date > "2026-08-27")]))})));
  home();
  await screen.findByRole("heading", {name:"Your first edition is waiting"});
  expect(screen.getByRole("button", {name:"Upload CSV"})).toBeTruthy();
  expect(screen.getByRole("button", {name:"Add manually"})).toBeTruthy();
  expect(screen.getByRole("button", {name:"Use sample portfolio"})).toBeTruthy();
  expect(screen.getByRole("link", {name:"Start your first lesson"}).getAttribute("href")).toBe("/learn/what-you-own");
  expect(screen.getByText(/of 8 stones laid/)).toBeTruthy();
  expect(screen.queryByRole("figure", {name:/Weekly holding contributions/})).toBeNull();
});

it("shows skeletons while pending, preserves holdings on error, and recovers on retry", async () => {
  let finish!: (response:Response) => void;
  vi.mocked(fetch).mockImplementationOnce(() => new Promise(resolve => {finish = resolve;}));
  const saved = localStorage.getItem("cornerstone-holdings-v1");
  const view = home();
  expect(screen.getByRole("status").textContent).toContain("Checking your saved holdings");
  expect(view.container.querySelector('[aria-hidden="true"] span')).toBeTruthy();
  expect(screen.queryByRole("button", {name:"Use sample portfolio"})).toBeNull();
  await act(async () => finish(new Response("", {status:503})));
  expect(await screen.findByRole("alert")).toHaveProperty("textContent", expect.stringContaining("Your saved holdings are still here"));
  expect(localStorage.getItem("cornerstone-holdings-v1")).toBe(saved);
  fireEvent.click(screen.getByRole("button", {name:"Retry closing prices"}));
  await screen.findByRole("heading", {name:"A quiet week: down 0.16% (−$11.23)"});
  expect(screen.queryByRole("alert")).toBeNull();
});

it.each(["2026-09-12T23:59:59Z", "2026-09-13T00:00:00Z"])("keeps a single shared price-date badge without the old freshness line at %s", async date => {
  vi.useFakeTimers({toFake:["Date"]}); vi.setSystemTime(new Date(date));
  home();
  await screen.findByRole("heading", {name:"A quiet week: down 0.16% (−$11.23)"});
  expect(screen.getAllByText("Sample data · as of Sep 2, 2026")).toHaveLength(1);
  expect(screen.queryByText(/Data is from/)).toBeNull();
});

it("offers a direct beginner lesson before holdings input, without requiring setup",async()=>{
 localStorage.setItem("cornerstone-holdings-v1",JSON.stringify(emptySavedHoldings));
 localStorage.setItem("cornerstone-learning-v1",JSON.stringify(emptyLearning));
 const view=home();
 expect(screen.getByRole("link",{name:"Start learning · 3 min"}).getAttribute("href")).toBe("/learn/what-you-own");
 expect(screen.getByText(/You don’t need an account, a portfolio/)).toBeTruthy();
 await screen.findByRole("heading",{name:"Your first edition is waiting"});
 expect(view.container.querySelectorAll('a.button.primary,a.button.lime')).toHaveLength(1);
});
it("offers review rather than a first lesson when learning is complete but holdings are empty",async()=>{
 localStorage.setItem("cornerstone-holdings-v1",JSON.stringify(emptySavedHoldings));
 localStorage.setItem("cornerstone-learning-v1",JSON.stringify({...emptyLearning,completed:lessons.map(l=>l.id)}));
 home();await screen.findByRole("heading",{name:"Your first edition is waiting"});
 expect(screen.getByRole("link",{name:"Review a lesson"}).getAttribute("href")).toBe("/learn/review");
 expect(screen.queryByRole("link",{name:"Start your first lesson"})).toBeNull();
});
