import { describe, expect, it } from "vitest";
import {
  inspectHomeView,
  practiceHomeView,
  personalizedHomeRecap,
} from "./home-overview";
import { samplePortfolio } from "./sample-data";
import { emptyLearning } from "./learning-progress";
import { lessons } from "./lessons";
import { advancePractice, startPractice, placeOrder } from "./practice";
describe("Home overview periods and personalization", () => {
  it("keeps the real snapshot date and never invents a weekly return", () => {
    const view = inspectHomeView(samplePortfolio);
    expect(view.period).toContain("Sep 2, 2026");
    expect(view.day?.value).toBeCloseTo(25.5, 2);
    expect(view.week).toBeNull();
  });
  it("handles empty and down snapshots without a false positive driver", () => {
    expect(
      inspectHomeView({ ...samplePortfolio, holdings: [] }).day,
    ).toBeNull();
    const view = inspectHomeView({
      ...samplePortfolio,
      holdings: [{ ...samplePortfolio.holdings[0], price: 200 }],
    });
    expect(view.day!.value).toBeLessThan(0);
    expect(view.explanation).toContain("negative");
  });
  it("includes cash in the practice pie and uses the stored checkpoint, not current trading activity, for weekly movement", () => {
    let state = startPractice("market", "test");
    state = placeOrder(state, {
      id: "1",
      symbol: "CAFE",
      side: "buy",
      quantity: 10,
      expectedWeek: 0,
      expectedRun: "test",
    });
    state = advancePractice(state, 0);
    const view = practiceHomeView(state);
    expect(view.value).toBe(980);
    expect(view.allocations.reduce((sum, p) => sum + p.percent, 0)).toBeCloseTo(
      100,
    );
    expect(view.week?.value).toBe(-20);
    expect(view.day).toBeNull();
    expect(view.explanation).toMatch(/does not guarantee recovery/);
  });
  it("personalizes the next idea from saved completion and resumes unfinished learning", () => {
    const state = {
      ...emptyLearning,
      completed: [lessons[0].id],
      steps: { [lessons[2].id]: 2 },
    };
    const recap = personalizedHomeRecap(
      inspectHomeView(samplePortfolio),
      state,
    );
    expect(recap.learning).toContain("1 of 6");
    expect(recap.href).toBe("/learn/" + lessons[2].id);
  });
});
