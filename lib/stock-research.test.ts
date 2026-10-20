import { describe, expect, it } from "vitest";
import {
  examplePriceSeries,
  researchSignal,
  researchStocks,
  customResearchStock,
  resolveResearchStock,
} from "./stock-research";
describe("stock research examples", () => {
  it("flags positive and negative moves and relative attention independently", () => {
    const stock = researchStocks[0];
    expect(researchSignal(stock).hot).toBe(false);
    expect(
      researchSignal({
        ...stock,
        example: { ...stock.example, dailyPercent: 5 },
      }).hot,
    ).toBe(true);
    expect(
      researchSignal({
        ...stock,
        example: { ...stock.example, dailyPercent: -5 },
      }).hot,
    ).toBe(true);
    expect(
      researchSignal({
        ...stock,
        example: { ...stock.example, relativeVolume: 2 },
      }).reason,
    ).toMatch(/volume/);
  });
  it("attaches the selected stock's headline to its signal", () => {
    const stock = resolveResearchStock("nvda")!;
    expect(researchSignal(stock).headline).toBe(stock.headlines[0]);
    expect(researchSignal(stock).hot).toBe(true);
  });
  it("preserves old fund/ticker lookups and rejects non-ticker input", () => {
    expect(resolveResearchStock(" VTI ")?.kind).toBe("fund");
    expect(customResearchStock("brk.b")?.symbol).toBe("BRK.B");
    expect(customResearchStock("<script>")).toBeNull();
    expect(customResearchStock("two words")).toBeNull();
  });
  it("keeps example curves deterministic and consistent with the labeled closing move", () => {
    const stock = resolveResearchStock("TSLA")!;
    const series = examplePriceSeries(stock, "1M");
    expect(series).toEqual(examplePriceSeries(stock, "1M"));
    expect(series.at(-1)).toBe(stock.example.price);
    expect((series.at(-1)! / series.at(-2)! - 1) * 100).toBeCloseTo(
      stock.example.dailyPercent,
      8,
    );
  });
});
