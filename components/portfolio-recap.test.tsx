// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { PortfolioRecap } from "./portfolio-recap";
import { samplePortfolio } from "@/lib/sample-data";
import { emptyLearning } from "@/lib/learning-progress";
import { emptyPractice, startPractice, placeOrder, advancePractice, type PracticeState } from "@/lib/practice";

const context = vi.hoisted(() => ({ practice: null as PracticeState | null }));
vi.mock("./demo-provider", () => ({ useDemo: () => ({ portfolio: samplePortfolio }) }));
vi.mock("./mvp-provider", () => ({ useMvp: () => ({ practice: context.practice, learning: emptyLearning }) }));
vi.mock("./learning-recap", () => ({ LearningRecap: () => <p>Preserved learning history</p> }));
beforeEach(() => { context.practice = emptyPractice; });
afterEach(cleanup);

it("keeps the allocation on Portfolio and dates the recap movers", () => {
  render(<PortfolioRecap />);
  expect(screen.queryByRole("img", { name: /Available snapshot allocation/ })).toBeNull();
  expect(screen.getByText("Add dated history to compare this period")).toBeTruthy();
  expect(screen.getByRole("link", { name: /VTI\s*Vanguard.*25.47/ }).getAttribute("href")).toBe("/discover?q=VTI");
  expect(screen.getByText(/not a full month of dated portfolio values/)).toBeTruthy();
});

it("switches between the authored month chart and unchanged snapshot content", () => {
  render(<PortfolioRecap />);
  fireEvent.click(screen.getByRole("button", { name: "Preview an example month" }));
  expect(screen.getByRole("img", { name: /Fictional example month from/ })).toBeTruthy();
  expect(screen.getByText(/without individual stock history/)).toBeTruthy();
  expect(screen.queryByRole("link", { name: /VTI\s*Vanguard/ })).toBeNull();
  fireEvent.click(screen.getByRole("button", { name: "My portfolio snapshot" }));
  expect(screen.queryByRole("img", { name: /Available snapshot allocation/ })).toBeNull();
});

it("preserves saved practice checkpoints, negative attribution, and portfolio links", () => {
  const run = startPractice("market", "test-run");
  context.practice = advancePractice(placeOrder(run, {
    id: "buy", symbol: "CAFE", side: "buy", quantity: 10, expectedWeek: 0, expectedRun: "test-run",
  }), 0);
  render(<PortfolioRecap />);
  fireEvent.click(screen.getByRole("button", { name: "My practice timeline" }));
  expect(screen.getByRole("img", { name: /Stored practice checkpoints from/ })).toBeTruthy();
  const mover = screen.getByRole("link", { name: /CAFE\s*Campus Café/ });
  expect(mover.getAttribute("href")).toBe("/portfolio");
  expect(mover.textContent).toContain("−$20.00");
  expect(screen.getByText(/Simulated weeks · not a calendar month/)).toBeTruthy();
  expect(screen.getByText("Preserved learning history")).toBeTruthy();
});
