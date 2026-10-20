// @vitest-environment jsdom
import {
  cleanup,
  fireEvent,
  render,
  screen,
  act,
} from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { TradingViewChart } from "./stock-price-chart";
import { researchStocks } from "@/lib/stock-research";
afterEach(() => {
  cleanup();
  vi.useRealTimers();
});
it("offers an interactive example if the external chart never finishes loading", () => {
  vi.useFakeTimers();
  render(
    <TradingViewChart symbol="NASDAQ:AAPL" fallback={researchStocks[0]} />,
  );
  act(() => vi.advanceTimersByTime(12001));
  expect(screen.getByRole("status").textContent).toContain("could not load");
  expect(screen.getByRole("slider").getAttribute("max")).toBe("20");
  fireEvent.change(screen.getByRole("slider"), { target: { value: "0" } });
  expect(
    screen.getByLabelText(/Inspect example point/).getAttribute("value"),
  ).toBe("0");
});
it("can switch to the example without relying on any external service", () => {
  render(
    <TradingViewChart symbol="NASDAQ:AAPL" fallback={researchStocks[0]} />,
  );
  fireEvent.click(screen.getByRole("button", { name: "View example chart" }));
  expect(screen.getByRole("img").getAttribute("aria-label")).toContain(
    "authored example",
  );
  expect(screen.queryByRole("status")).toBeNull();
});
