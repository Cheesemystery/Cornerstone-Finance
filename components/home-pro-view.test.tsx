// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import type { ReactNode } from "react";
import { DemoProvider } from "./demo-provider";
import { MvpProvider } from "./mvp-provider";
import { HomeDashboard } from "./home-dashboard";
import { MvpSettings } from "./mvp-settings";
import { HomeProHoldings } from "./home-pro-holdings";
import { emptyLearning } from "@/lib/learning-progress";
import { emptySavedHoldings, sampleSavedHoldings } from "@/lib/saved-holdings";
import { getSampleHistoricalCloses } from "@/lib/sample-history";
import { calculateWeek } from "@/lib/weekly-portfolio";

const history = getSampleHistoricalCloses(sampleSavedHoldings.map(h => h.ticker),"2026-08-24","2026-09-02");
const week = calculateWeek(sampleSavedHoldings,history)!;
const Providers = ({children}: {children:ReactNode}) => <DemoProvider><MvpProvider>{children}</MvpProvider></DemoProvider>;
beforeEach(() => {
  localStorage.setItem("cornerstone-demo-v1",JSON.stringify({name:"Sam",compact:false}));
  localStorage.setItem("cornerstone-learning-v1",JSON.stringify({...emptyLearning,completed:["what-you-own"]}));
  localStorage.setItem("cornerstone-holdings-v1",JSON.stringify({...emptySavedHoldings,holdings:sampleSavedHoldings,source:"sample"}));
  vi.stubGlobal("fetch",vi.fn(async () => new Response(JSON.stringify(history))));
  vi.stubGlobal("matchMedia",vi.fn(() => ({matches:false,addEventListener:vi.fn(),removeEventListener:vi.fn()})));
});
afterEach(() => {cleanup();localStorage.clear();vi.unstubAllGlobals();});

it("defaults older preferences to standard Home without a table",async () => {
  const view = render(<Providers><HomeDashboard /></Providers>);
  await screen.findByRole("heading",{name:"A quiet week: down 0.16%"});
  expect(view.container.querySelector('[data-pro-view="true"]')).toBeNull();
  expect(screen.queryByRole("table")).toBeNull();
});

it("persists Pro view across a remount without changing learning, holdings or other preferences",async () => {
  const learning = localStorage.getItem("cornerstone-learning-v1");
  const holdings = localStorage.getItem("cornerstone-holdings-v1");
  const view = render(<Providers><MvpSettings /></Providers>);
  const toggle = screen.getByRole("switch",{name:"Pro view"});
  expect(toggle.getAttribute("aria-checked")).toBe("false");
  fireEvent.click(toggle);
  expect(JSON.parse(localStorage.getItem("cornerstone-demo-v1")!)).toMatchObject({proView:true,name:"Sam",compact:false});
  expect(localStorage.getItem("cornerstone-learning-v1")).toBe(learning);
  expect(localStorage.getItem("cornerstone-holdings-v1")).toBe(holdings);
  view.unmount();
  const home = render(<Providers><HomeDashboard /></Providers>);
  const table = await screen.findByRole("table",{name:"Holdings · as of Sep 2, 2026"});
  expect(home.container.querySelector('[data-pro-view="true"]')).toBeTruthy();
  expect(home.container.querySelector('figure[data-compact="true"]')).toBeTruthy();
  expect(within(table).getAllByRole("row")).toHaveLength(week.positions.length + 2);
  home.rerender(<Providers><MvpSettings /></Providers>);
  fireEvent.click(screen.getByRole("switch",{name:"Pro view"}));
  home.rerender(<Providers><HomeDashboard /></Providers>);
  expect(screen.queryByRole("table")).toBeNull();
  expect(home.container.querySelector('[data-pro-view="true"]')).toBeNull();
});

it("uses existing dollars and starting-portfolio contribution percentages without mutating the week", () => {
  const before = JSON.stringify(week);
  render(<HomeProHoldings week={week} />);
  const row = screen.getByRole("row",{name:"VTI −$41.04 −0.597%"});
  expect(within(row).getByRole("rowheader").textContent).toBe("VTI");
  expect(screen.getByRole("row",{name:"Week total −$11.23 −0.163%"})).toBeTruthy();
  expect(screen.getByText(/totals use unrounded figures/)).toBeTruthy();
  expect(JSON.stringify(week)).toBe(before);
});

it("keeps the Pro table out of an empty Home",async () => {
  localStorage.setItem("cornerstone-demo-v1",JSON.stringify({proView:true}));
  localStorage.setItem("cornerstone-holdings-v1",JSON.stringify(emptySavedHoldings));
  const view = render(<Providers><HomeDashboard /></Providers>);
  await screen.findByRole("button",{name:"Use sample portfolio"});
  expect(view.container.querySelector('[data-pro-view="true"]')).toBeTruthy();
  expect(screen.queryByRole("table")).toBeNull();
});
