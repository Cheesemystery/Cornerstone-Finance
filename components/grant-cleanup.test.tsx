// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { HomeDashboard } from "./home-dashboard";
import { AssistantClient } from "./assistant-client";
import { PortfolioWorkspace } from "./portfolio-workspace";
import { StockResearcher } from "./stock-researcher";
import { PortfolioRecap } from "./portfolio-recap";
import { samplePortfolio } from "@/lib/sample-data";
import { emptyLearning, type LearningState } from "@/lib/learning-progress";
import { emptyPractice, startPractice, type PracticeState } from "@/lib/practice";
import type { PortfolioSnapshot } from "@/lib/domain";
import { getSampleHistoricalCloses } from "@/lib/sample-history";
import { calculateWeek } from "@/lib/weekly-portfolio";
import { emptySavedHoldings, sampleSavedHoldings } from "@/lib/saved-holdings";
import { lessons } from "@/lib/lessons";
import { ProgressSummary } from "./mvp-ui";

const state = vi.hoisted(() => ({
  portfolio: null as PortfolioSnapshot | null,
  learning: null as LearningState | null,
  practice: null as PracticeState | null,
  replaceHoldings: vi.fn(),
}));
vi.mock("./demo-provider", () => ({ useDemo: () => ({ portfolio: state.portfolio, preferences: { name: "Alex", saved: [] }, replaceHoldings: state.replaceHoldings, announce: vi.fn(), savedHoldings: {...emptySavedHoldings, holdings: state.portfolio!.holdings.map(h=>({ticker:h.symbol,shares:h.quantity}))}, historyStatus: "ready", history: getSampleHistoricalCloses(sampleSavedHoldings.map(h=>h.ticker),"2026-08-24","2026-09-02"), week: calculateWeek(sampleSavedHoldings,getSampleHistoricalCloses(sampleSavedHoldings.map(h=>h.ticker),"2026-08-24","2026-09-02")), beginWeek:vi.fn(), selectSample:vi.fn(), holdingsPersistence:"saved" }) }));
vi.mock("./mvp-provider", () => ({ useMvp: () => ({ learning: state.learning, practice: state.practice, now: new Date("2026-10-19T12:00:00Z") }) }));
vi.mock("next/navigation", () => ({ useRouter: () => ({ push: vi.fn() }) }));
beforeEach(() => {
  state.portfolio = samplePortfolio;
  state.learning = { ...emptyLearning, onboarded: true, completed: lessons.slice(0, 4).map(lesson => lesson.id) };
  state.practice = startPractice("market", "existing-run");
  state.replaceHoldings.mockReset();
  vi.stubGlobal("matchMedia", vi.fn(() => ({ matches: true, addEventListener: vi.fn(), removeEventListener: vi.fn() })));
});
afterEach(() => { cleanup(); vi.unstubAllGlobals(); });

it("limits Home to the dated hero, one lesson action, and cumulative wall",()=>{
  const {container}=render(<HomeDashboard/>);
  expect(screen.getByRole("heading",{name:"A quiet week: down 0.16% (−$11.23)"})).toBeTruthy();
  expect(screen.getAllByText("Sample data · as of Sep 2, 2026")).toHaveLength(1);
  expect(container.textContent).not.toContain("Data is from");
  expect(screen.getByRole("link",{name:"Start your 2-minute lesson"}).getAttribute("href")).toBe("/learn/why-prices-move?weekly=1");
  expect(container.querySelectorAll(".weekly-home > *")).toHaveLength(4);
  expect(container.querySelector(".home-pie")).toBeNull();
  expect(container.textContent).not.toMatch(/XP|streak|challenges/);
});

it("uses singular day for one learning day and omits the progress date", () => {
  state.learning = {...emptyLearning, timezone:"America/Chicago", completed:["what-you-own"], events:[{id:"lesson:what-you-own",kind:"lesson",target:"what-you-own",day:"2026-10-19",at:"2026-10-19T12:00:00Z"}]};
  const {container} = render(<ProgressSummary />);
  expect(screen.getByText("1 day")).toBeTruthy();
  expect(container.textContent).not.toContain("As of");
});

it("keeps one Portfolio source badge even with its embedded recap, and retains the arithmetic note", () => {
  const {container} = render(<PortfolioWorkspace />);
  expect(screen.getAllByText("Sample data · as of Sep 2, 2026")).toHaveLength(1);
  expect(container.textContent).not.toContain("Sample data - as of");
  expect(screen.getByText(/Each contribution is shares × price change/)).toBeTruthy();
  expect(screen.getByRole("table",{name:"Your holdings"})).toBeTruthy();
});

it("uses a singular holding label and keeps shares in their table column", () => {
  state.portfolio = {...samplePortfolio, holdings:[{...samplePortfolio.holdings[0],quantity:1}]};
  render(<PortfolioWorkspace />);
  expect(screen.getByText("holding", {exact:true})).toBeTruthy();
  expect(within(screen.getByRole("table",{name:"Your holdings"})).getByRole("cell",{name:"1"})).toBeTruthy();
});

it("orders the four portfolio sections and keeps net change and holding values with their owners", () => {
  const {container} = render(<PortfolioWorkspace />);
  const regions = screen.getAllByRole("region");
  expect(regions.slice(0,4).map(region => region.getAttribute("aria-label") ?? region.querySelector("h2")?.textContent)).toEqual(["Total portfolio value","Where your money is.","Inside the move","Your holdings"]);
  expect(container.textContent).not.toContain("Cornerstone perspective");
  const change = screen.getByRole("region",{name:"Total portfolio value"}).querySelector("p strong")!.textContent!.split(" (")[0];
  expect(container.textContent?.split(change)).toHaveLength(2);
  const legend = screen.getByLabelText("Choose a holding");
  expect(legend.textContent).not.toContain("$");
  for (const value of ["$2,892.96","$1,631.52","$1,425.57","$916.72"]) expect(container.textContent?.split(value)).toHaveLength(2);
  expect(within(screen.getByRole("table",{name:"Your holdings"})).getByText("Total US stock market")).toBeTruthy();
});

it("shows only the ticker for an unknown uploaded holding", () => {
  state.portfolio = {...samplePortfolio, source:"csv", holdings:[{...samplePortfolio.holdings[0],symbol:"USER",name:"USER"}]};
  render(<PortfolioWorkspace />);
  const holding = screen.getByRole("button",{name:"Select USER holding"});
  expect(holding.textContent).toBe("USER");
  expect(holding.querySelector(".muted")).toBeNull();
});

it("answers from imported holdings even when fictional practice exists, and keeps each answer's date", () => {
  state.portfolio = { ...samplePortfolio, source: "csv", asOf: "2026-10-15T12:00:00Z", holdings: [{ ...samplePortfolio.holdings[3], symbol: "USER", name: "Imported holding" }] };
  const { rerender } = render(<AssistantClient />);
  expect(screen.queryByRole("button", { name: "CAFE" })).toBeNull();
  fireEvent.click(screen.getByRole("button", { name: "USER" }));
  const log = screen.getByRole("log");
  expect(log.textContent).toContain("USER — Imported holding");
  expect(log.textContent).toContain("CSV prices - as of Oct 15, 2026");
  state.portfolio = samplePortfolio;
  rerender(<AssistantClient />);
  expect(within(log).getByText("CSV prices - as of Oct 15, 2026")).toBeTruthy();
  expect(screen.getByRole("button", { name: "VTI" })).toBeTruthy();
  expect(screen.getByText(/Not live AI/)).toBeTruthy();
  expect(screen.queryByText(/Cornerstone\+/)).toBeNull();
});

it("imports quantities without trusting prices embedded in a CSV",async()=>{
  state.practice=emptyPractice;
  render(<PortfolioWorkspace/>);
  const file=new File(["ticker,shares,price\nUSER,2,999"],"holdings.csv",{type:"text/csv"});
  Object.defineProperty(file,"text",{value:async()=>"ticker,shares,price\nUSER,2,999"});
  fireEvent.change(screen.getByLabelText("Upload holdings CSV"),{target:{files:[file]}});
  await waitFor(()=>expect(state.replaceHoldings).toHaveBeenCalledWith([{ticker:"USER",shares:2}],"user"));
});

it("keeps provider research free of authored prices, fundamentals, headlines, and flames", () => {
  const { container } = render(<StockResearcher initialQuery="AAPL" />);
  expect(container.querySelector(".provider-price-chart")).toBeTruthy();
  expect(screen.queryByText("Numbers at a glance")).toBeNull();
  expect(container.querySelector(".example-price-chart")).toBeNull();
  expect(container.textContent).not.toContain("🔥");
  expect(screen.queryByText("Recent news")).toBeNull();
});

it("does not show a sample allocation beside a practice balance before the first checkpoint", () => {
  const { container } = render(<PortfolioRecap />);
  fireEvent.click(screen.getByRole("button", { name: "My practice timeline" }));
  expect(container.querySelector(".recap-allocation")).toBeNull();
  expect(screen.getByText("$1,000.00")).toBeTruthy();
  expect(screen.getAllByText(/Sample scenario state - as of Oct 12, 2026/).length).toBeGreaterThan(0);
});
