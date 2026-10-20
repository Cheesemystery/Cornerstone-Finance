import { afterEach, expect, it, vi } from "vitest";
import { drawWeeklyShare, weeklyShareModel, wallSnapshot, SHARE_HEIGHT, SHARE_WIDTH } from "./weekly-share";
import { getSampleHistoricalCloses } from "./sample-history";
import { sampleSavedHoldings } from "./saved-holdings";
import { calculateWeek } from "./weekly-portfolio";
import { lessons } from "./lessons";

const history = getSampleHistoricalCloses(sampleSavedHoldings.map(h => h.ticker),"2026-08-24","2026-09-02");
const week = calculateWeek(sampleSavedHoldings,history)!;
afterEach(() => vi.unstubAllGlobals());
function context() {
  vi.stubGlobal("Path2D",class {});
  return new Proxy({fillText:vi.fn(),clearRect:vi.fn(),measureText:(text:string) => ({width:text.length * 35})}, {
    get(target,key) { return key in target ? Reflect.get(target,key) : vi.fn(); },
  }) as unknown as CanvasRenderingContext2D;
}
it("omits every holding identifier and amount from the default export model", () => {
  const model = weeklyShareModel(week,history,[lessons[0].id]);
  expect(JSON.stringify(model)).not.toMatch(/VTI|VXUS|BND|AAPL|\$|costBasis|shares/);
  expect(model.source).toBe("Sample data - as of Sep 2, 2026");
  expect(model.headline).toBe("A quiet week: down 0.16%");
  expect(model.wall.count).toBe(1);
});
it("includes only the requested total and main ticker contribution on explicit opt-in", () => {
  const model = weeklyShareModel(week,history,[],true);
  expect(model.amounts).toEqual({total:"−$11.23",driver:"VTI −$41.04"});
  expect(JSON.stringify(model)).not.toMatch(/VXUS|costBasis|shares/);
  expect(weeklyShareModel(week,history,[]).amounts).toBeUndefined();
});
it("draws the current privacy model after clearing the whole 1080×1350 image", () => {
  const ctx = context();
  drawWeeklyShare(ctx,weeklyShareModel(week,history,[],true));
  expect(vi.mocked(ctx.fillText).mock.calls.map(call => call[0]).join(" ")).toContain("VTI −$41.04");
  vi.mocked(ctx.fillText).mockClear();
  drawWeeklyShare(ctx,weeklyShareModel(week,history,[]));
  expect(ctx.clearRect).toHaveBeenLastCalledWith(0,0,SHARE_WIDTH,SHARE_HEIGHT);
  expect(vi.mocked(ctx.fillText).mock.calls.map(call => call[0]).join(" ")).not.toMatch(/VTI|VXUS|\$/);
  expect(vi.mocked(ctx.fillText).mock.calls.map(call => call[0]).join(" ")).toContain("The Cornerstone Weekly");
});
it("builds a stable catalog-sized snapshot without mutating progress or animation receipts", () => {
  const completed = [lessons[0].id,lessons[0].id,"unknown"];
  const before = [...completed];
  const snapshot = wallSnapshot(completed);
  expect(snapshot.slots).toHaveLength(lessons.length);
  expect(snapshot.count).toBe(1);
  expect(completed).toEqual(before);
  expect(snapshot.slots.every(slot => slot.x >= 0 && slot.x + slot.width <= snapshot.width + 0.001)).toBe(true);
});

it("keeps the price date separate from the cumulative learning snapshot date", () => {
  const model = weeklyShareModel(week,history,[lessons[0].id],false,"2026-10-19");
  expect(model.asOf).toBe("Sep 2, 2026");
  expect(model.learningAsOf).toBe("Oct 19, 2026");
  const ctx = context(); drawWeeklyShare(ctx,model);
  expect(ctx.fillText).toHaveBeenCalledWith("Learning as of Oct 19, 2026",540,1270);
});
