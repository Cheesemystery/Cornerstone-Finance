import { describe, expect, it } from "vitest";
import { moneyStory } from "./money-story";
import type { PortfolioSnapshot } from "./domain";
const snapshot = (changes:number[]):PortfolioSnapshot => ({id:"test",source:"sample",asOf:"2026-09-02T20:00:00Z",freshness:"delayed",currency:"USD",holdings:changes.map((change,index)=>({symbol:`H${index}`,name:`Holding ${index}`,quantity:1,price:100+change,previousClose:100,sector:"Test",assetClass:"equity"}))});
describe("money story attribution",()=>{
  it("explains the largest loss and positive offset on a down period",()=>{const story=moneyStory(snapshot([-20,5,-3]));expect(story.direction).toBe("lower");expect(story.ranked[0].symbol).toBe("H0");expect(story.explanation).toContain("H0 made the largest negative contribution");expect(story.explanation).toContain("H1 offset");});
  it("explains the largest gain and negative offset on an up period",()=>{const story=moneyStory(snapshot([-3,20,5]));expect(story.direction).toBe("higher");expect(story.explanation).toContain("H1 made the largest positive contribution");expect(story.explanation).toContain("H0 offset");});
  it("does not claim a winner for a flat or empty portfolio",()=>{expect(moneyStory(snapshot([-5,5])).direction).toBe("unchanged");expect(moneyStory(snapshot([])).title).toBe("Your money story starts here.");});
  it("uses position size rather than the largest price move",()=>{const input=snapshot([-5,-10]);input.holdings[0].quantity=10;expect(moneyStory(input).ranked[0].symbol).toBe("H0");});
});
