import { describe, it, expect } from "vitest";
import { samplePortfolio } from "./sample-data";
import {
  snapshotMovers,
  practiceMovers,
  practiceUpdatedAt,
} from "./recap-movers";
import { startPractice, placeOrder, advancePractice } from "./practice";

describe("Recap price attribution and source timestamps", () => {
  it("ranks gains and offsets by absolute contribution", () => {
    const movers = snapshotMovers(samplePortfolio);
    expect(movers.map((item) => item.symbol)).toEqual(["VTI", "VXUS", "AAPL"]);
    expect(movers[0].value).toBeCloseTo(25.47, 2);
    expect(movers[1].value).toBeCloseTo(-7.7, 2);
    expect(snapshotMovers({ ...samplePortfolio, holdings: [] })).toEqual([]);
  });
  it("attributes a saved week to positions held before it, even after a sale", () => {
    let state = placeOrder(
      startPractice("market", "run"),
      {
        id: "buy",
        symbol: "CAFE",
        side: "buy",
        quantity: 10,
        expectedWeek: 0,
        expectedRun: "run",
      },
      new Date("2026-10-12T10:00:00Z"),
    );
    state = advancePractice(state, 0, new Date("2026-10-12T11:00:00Z"));
    state = placeOrder(
      state,
      {
        id: "sell",
        symbol: "CAFE",
        side: "sell",
        quantity: 10,
        expectedWeek: 1,
        expectedRun: "run",
      },
      new Date("2026-10-12T12:00:00Z"),
    );
    expect(practiceMovers(state)).toEqual([
      { symbol: "CAFE", name: "Campus Café", value: -20 },
    ]);
    expect(practiceUpdatedAt(state)).toBe("2026-10-12T12:00:00.000Z");
    state = {
      ...state,
      checkpoints: state.checkpoints.map((point) => ({
        ...point,
        reflected: true,
      })),
    };
    state = advancePractice(state, 1);
    expect(practiceMovers(state)).toEqual([]);
  });
  it("does not invent activity or price contributions for cash-only practice", () => {
    const state = startPractice("market", "run");
    expect(practiceUpdatedAt(state)).toBeNull();
    expect(practiceMovers(state)).toEqual([]);
    expect(practiceMovers(advancePractice(state, 0))).toEqual([]);
  });
});
