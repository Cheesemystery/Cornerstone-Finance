import { describe, expect, it } from "vitest";
import { calculateWeek, calendarWeek, weeklyCopy, weeklySnapshot } from "./weekly-portfolio";
import { getSampleHistoricalCloses } from "./sample-history";
import { sampleSavedHoldings } from "./saved-holdings";
import type { HistoricalData } from "./historical-data";
const history = getSampleHistoricalCloses(sampleSavedHoldings.map(h=>h.ticker), "2026-08-24", "2026-09-02");
describe("weekly arithmetic", () => {
  it("uses the last common close at least seven calendar days earlier and reconciles every contribution", () => {
    const week = calculateWeek(sampleSavedHoldings, history)!;
    expect([week.startDate, week.endDate]).toEqual(["2026-08-26", "2026-09-02"]);
    for (const position of week.positions) expect(position.contribution).toBe(position.shares * (position.endClose-position.startClose));
    expect(week.change).toBeCloseTo(-11.23, 8);
    expect(week.startValue).toBeCloseTo(6878);
    expect(week.endValue).toBeCloseTo(6866.77);
    expect(week.change).toBeCloseTo(week.endValue-week.startValue,8);
    expect(week.percent).toBeCloseTo(week.change/week.startValue*100,10);
    expect(week.driver?.ticker).toBe("VTI"); expect(week.offset?.ticker).toBe("VXUS");
    expect(week.lessonId).toBe("why-prices-move");
    const snapshot = weeklySnapshot(sampleSavedHoldings,history,week);
    expect(snapshot.comparisonPeriod).toBe("week");
    expect(snapshot.holdings[0].previousClose).toBe(326);
    expect(weeklyCopy(week).join(" ")).toContain("−$41.04");
  });
  it("walks back across weekends and uses common dates, never different dates for different tickers", () => {
    const h: HistoricalData = {mode:"provider",provider:"Test",currency:"USD",asOf:"2026-10-16",series:{A:[{date:"2026-10-08",close:10},{date:"2026-10-09",close:11},{date:"2026-10-15",close:12},{date:"2026-10-16",close:13}],B:[{date:"2026-10-08",close:20},{date:"2026-10-15",close:21}]}};
    const week=calculateWeek([{ticker:"A",shares:2},{ticker:"B",shares:3}],h)!;
    expect([week.startDate,week.endDate]).toEqual(["2026-10-08","2026-10-15"]);
    expect(week.change).toBe(7);
  });
  it("does not price an empty, unknown, or too-short portfolio", () => {
    expect(calculateWeek([],history)).toBeNull();
    expect(calculateWeek([{ticker:"MISSING",shares:1}],history)).toBeNull();
    expect(calculateWeek(sampleSavedHoldings,getSampleHistoricalCloses(sampleSavedHoldings.map(h=>h.ticker),"2026-08-28","2026-09-02"))).toBeNull();
  });
  it.each([[12,11,"up"],[9,8,"down"],[11,9,"flat"],[10,10,"flat"]] as const)("uses deterministic calm copy for ending closes %s and %s",(a,b,direction)=>{
    const h:HistoricalData={mode:"sample",provider:"Test",currency:"USD",asOf:"2026-10-16",series:{A:[{date:"2026-10-09",close:10},{date:"2026-10-16",close:a}],B:[{date:"2026-10-09",close:10},{date:"2026-10-16",close:b}]}};
    const week=calculateWeek([{ticker:"A",shares:1},{ticker:"B",shares:1}],h)!;
    expect(week.direction).toBe(direction);
    expect(weeklyCopy(week)).toHaveLength(2);
    expect(weeklyCopy(week).join(" ")).not.toMatch(/buy|sell|urgent|guarantee|hot/i);
  });
  it("chooses the concentration lesson only for a concentrated individual-stock driver",()=>{
    const week=calculateWeek([{ticker:"AAPL",shares:100}],history)!;
    expect(week.lessonId).toBe("spread-your-risk");
  });
  it("rolls the calendar week on Monday in the saved timezone",()=>{
    expect(calendarWeek(new Date("2026-10-19T04:59:00Z"),"America/Chicago")).toBe("2026-10-12");
    expect(calendarWeek(new Date("2026-10-19T05:00:00Z"),"America/Chicago")).toBe("2026-10-19");
  });
});
