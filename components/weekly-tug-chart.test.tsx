// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, expect, it } from "vitest";
import { WeeklyTugChart } from "./weekly-tug-chart";
import { calculateWeek } from "@/lib/weekly-portfolio";
import { sampleSavedHoldings } from "@/lib/saved-holdings";
import { getSampleHistoricalCloses } from "@/lib/sample-history";

const sample = calculateWeek(sampleSavedHoldings, getSampleHistoricalCloses(sampleSavedHoldings.map(h => h.ticker), "2026-08-24", "2026-09-02"))!;
afterEach(cleanup);

it("sorts by absolute contribution without mutating the result and draws from the center", () => {
  const original = sample.positions.map(h => h.ticker);
  const {container} = render(<WeeklyTugChart week={sample} />);
  const buttons = screen.getAllByRole("button");
  expect(buttons.map(button => button.textContent)).toEqual(["VTI−$41.04", "VXUS+$25.52", "BND+$19.57", "AAPL−$15.28"]);
  expect(sample.positions.map(h => h.ticker)).toEqual(original);
  const bars = [...container.querySelectorAll("rect")];
  expect(Number(bars[0].getAttribute("x")) + Number(bars[0].getAttribute("width"))).toBe(50);
  expect(Number(bars[0].getAttribute("width"))).toBe(48);
  expect(Number(bars[1].getAttribute("x"))).toBe(50);
  expect(Number(bars[1].getAttribute("width"))).toBeCloseTo(25.52 / 41.04 * 48);
  expect(bars[1].getAttribute("style")).toContain("60ms");
});

it("exposes dated prices, shares and signed contribution on keyboard focus; Escape and blur dismiss", () => {
  render(<WeeklyTugChart week={sample} />);
  const button = screen.getByRole("button", {name:/VTI: −\$41.04, pulled down/});
  expect(screen.queryByRole("tooltip")).toBeNull();
  fireEvent.focus(button);
  const tooltip = screen.getByRole("tooltip");
  expect(button.getAttribute("aria-describedby")).toBe(tooltip.id);
  expect(tooltip.textContent).toContain("Shares9");
  expect(tooltip.textContent).toContain("Start · Aug 26, 2026$326.00");
  expect(tooltip.textContent).toContain("End · Sep 2, 2026$321.44");
  expect(tooltip.textContent).toContain("Contribution−$41.04");
  fireEvent.keyDown(button, {key:"Escape"});
  expect(screen.queryByRole("tooltip")).toBeNull();
  fireEvent.click(button);
  expect(screen.getByRole("tooltip")).toBeTruthy();
  fireEvent.blur(button);
  expect(screen.queryByRole("tooltip")).toBeNull();
});

it("opens one tooltip on pointer hover and supplies a full text equivalent", () => {
  render(<WeeklyTugChart week={sample} />);
  const button = screen.getAllByRole("button")[1];
  fireEvent.pointerEnter(button.parentElement!, {pointerType:"mouse"});
  expect(screen.getByRole("tooltip").textContent).toContain("VXUS · Lifted");
  fireEvent.pointerLeave(button.parentElement!, {pointerType:"mouse"});
  expect(screen.queryByRole("tooltip")).toBeNull();
  const list = screen.getByRole("list", {name:"Contribution text equivalent"});
  expect(within(list).getAllByRole("listitem")).toHaveLength(sample.positions.length);
  expect(list.textContent).toContain("VTI: Pulled down, −$41.04; 9 shares.");
  expect(list.textContent).toContain("end close $321.44 on Sep 2, 2026");
});

it("handles all-flat contributions without invalid SVG coordinates or negative zero", () => {
  const week = calculateWeek([{ticker:"FLAT",shares:1}], {mode:"sample",provider:"Test",currency:"USD",asOf:"2026-09-02",series:{FLAT:[{date:"2026-08-26",close:10},{date:"2026-09-02",close:10}]}})!;
  const {container} = render(<WeeklyTugChart week={week} />);
  expect(screen.getByRole("button", {name:/FLAT: \+\$0.00, unchanged/})).toBeTruthy();
  expect(container.querySelector("rect")!.getAttribute("width")).toBe("0");
  expect(container.innerHTML).not.toMatch(/NaN|Infinity|−\$0.00/);
});
