import { describe, expect, it } from "vitest";
import {
  recordedGrowth,
  movementHeading,
  monthlyComparison,
} from "./portfolio-insights";
import { samplePortfolio } from "./sample-data";
describe("portfolio growth and narrative", () => {
  it("uses total recorded basis for dollar and percentage growth", () => {
    const growth = recordedGrowth(samplePortfolio.holdings)!;
    expect(growth.value).toBeCloseTo(821.77, 2);
    expect(growth.percent).toBeCloseTo((821.77 / 6045) * 100, 8);
  });
  it("shows a loss against cost and never treats missing basis as zero", () => {
    const holding = { ...samplePortfolio.holdings[0], price: 100 };
    expect(recordedGrowth([holding])!.value).toBeLessThan(0);
    expect(recordedGrowth([{ ...holding, costBasis: undefined }])).toBeNull();
    expect(
      recordedGrowth([
        holding,
        { ...samplePortfolio.holdings[1], costBasis: undefined },
      ]),
    ).toBeNull();
  });
  it("handles empty, zero-cost and zero-share portfolios safely", () => {
    expect(recordedGrowth([])).toBeNull();
    expect(
      recordedGrowth([{ ...samplePortfolio.holdings[0], costBasis: 0 }])!
        .percent,
    ).toBeNull();
    expect(
      recordedGrowth([{ ...samplePortfolio.holdings[0], quantity: 0 }]),
    ).toBeNull();
  });
  it("rotates questions without calling an old snapshot today", () => {
    expect(movementHeading(0, 0.4, false)).toBe("What drove the move?");
    expect(movementHeading(1, 0.4, false)).not.toContain("today");
    expect(movementHeading(1, 0.4, true)).toContain("today");
    expect(movementHeading(11, 10, false)).not.toContain("Big move");
    expect(movementHeading(11, 10.1, false)).toBe("Big move! What shaped it?");
  });
  it("requires month-boundary data before presenting a monthly return", () => {
    expect(
      monthlyComparison([{ date: "2026-09-02", value: 1000 }], "2026-09"),
    ).toBeNull();
    expect(
      monthlyComparison(
        [
          { date: "2026-09-01", value: 1000 },
          { date: "2026-09-30", value: 1037 },
        ],
        "2026-09",
      ),
    ).toBeNull();
    expect(
      monthlyComparison(
        [
          { date: "2026-08-31", value: 1000 },
          { date: "2026-09-30", value: 1037 },
        ],
        "2026-09",
      ),
    ).toMatchObject({ value: 37 });
  });
  it("rejects invalid months and nonfinite comparison values", () => {
    expect(monthlyComparison([], "2026-13")).toBeNull();
    expect(
      monthlyComparison(
        [
          { date: "2026-08-31", value: 0 },
          { date: "2026-09-30", value: 1037 },
        ],
        "2026-09",
      ),
    ).toBeNull();
  });
});

