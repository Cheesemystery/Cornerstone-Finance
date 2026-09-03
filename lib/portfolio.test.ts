import { describe, expect, it } from "vitest";
import { buildBriefing, summarizePortfolio } from "./portfolio";
import { samplePortfolio } from "./sample-data";
describe("portfolio calculations",()=>{
  it("calculates value, change, and complete allocation",()=>{const r=summarizePortfolio(samplePortfolio);expect(r.totalValue).toBeGreaterThan(0);expect(r.dayChange).toBeCloseTo(r.totalValue-r.previousValue,8);expect(r.allocations.reduce((s,i)=>s+i.percent,0)).toBeCloseTo(100,6)});
  it("ranks allocations and contributors",()=>{const r=summarizePortfolio(samplePortfolio);expect(r.allocations[0].percent).toBeGreaterThanOrEqual(r.allocations.at(-1)!.percent);expect(r.contributors[0].value).toBeGreaterThanOrEqual(r.contributors.at(-1)!.value)});
  it("creates a sourced, educational briefing",()=>{const b=buildBriefing(samplePortfolio);expect(b.facts.totalValue).toBeGreaterThan(0);expect(b.events[0].sources.length).toBeGreaterThan(0);expect(b.disclosure).toMatch(/does not provide individualized investment advice/i)});
});
