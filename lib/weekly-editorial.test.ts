import { describe, expect, it } from "vitest";
import { editionRange, weeklyEditorial, weeklySubline } from "./weekly-editorial";
import { calculateWeek } from "./weekly-portfolio";
import { getSampleHistoricalCloses } from "./sample-history";
import { sampleSavedHoldings } from "./saved-holdings";

describe("weekly editorial", () => {
  it.each([
    [0, "A quiet week: up 0.00%", "partly-cloudy"],
    [-0.16, "A quiet week: down 0.16%", "partly-cloudy"],
    [0.49, "A quiet week: up 0.49%", "partly-cloudy"],
    [-0.49, "A quiet week: down 0.49%", "partly-cloudy"],
    [0.5, "A bright week: up 0.50%", "mostly-sunny"],
    [1.99, "A bright week: up 1.99%", "mostly-sunny"],
    [2, "A clear week: up 2.00%", "sunny"],
    [4, "A clear week: up 4.00%", "sunny"],
    [-0.5, "An overcast week: down 0.50%", "overcast"],
    [-1.99, "An overcast week: down 1.99%", "overcast"],
    [-2, "A rainy stretch: down 2.00%", "light-rain"],
    [-4, "A rainy stretch: down 4.00%", "light-rain"],
  ] as const)("maps %s percent to the requested headline/weather", (percent, headline, weather) => {
    expect(weeklyEditorial(percent)).toEqual({ headline, weather });
  });
  it.each([sampleSavedHoldings, [{ ticker:"VXUS", shares:2 }], [{ ticker:"VTI", shares:2 }]].map(holdings => ({holdings})))("keeps sample attribution dated, short and calm", ({holdings}) => {
    const history = getSampleHistoricalCloses(holdings.map(h => h.ticker), "2026-08-24", "2026-09-02");
    const week = calculateWeek(holdings, history)!;
    const text = weeklySubline(week);
    expect(text.split(/\s+/).length).toBeLessThanOrEqual(25);
    expect(text).toContain(week.driver!.ticker);
    expect(text).not.toMatch(/-[\d$]|buy|sell|urgent|hot/i);
    if (week.percent <= 0) expect(text).toContain("Week-to-week moves are mostly noise.");
  });
  it("keeps flat weeks calm without negative zero", () => {
    const week = calculateWeek([{ticker:"VTI",shares:1}], {mode:"sample",provider:"Test",currency:"USD",asOf:"2026-09-02",series:{VTI:[{date:"2026-08-26",close:10},{date:"2026-09-02",close:10}]}})!;
    expect(weeklySubline(week)).toContain("Week-to-week moves are mostly noise.");
    expect(weeklyEditorial(-0).headline).toBe("A quiet week: up 0.00%");
  });
  it("formats edition dates in UTC, including year boundaries", () => {
    expect(editionRange("2026-08-26", "2026-09-02")).toBe("Week of Aug 26 – Sep 2, 2026");
    expect(editionRange("2025-12-26", "2026-01-02")).toBe("Week of Dec 26, 2025 – Jan 2, 2026");
  });
});
