import { describe,it,expect } from "vitest";
import { parseHoldingsCsv } from "./csv";
import { summarizePortfolio } from "./portfolio";
import { demoAnswer } from "./demo-assistant";
import { growthExample } from "./learning-tools";
import { samplePortfolio } from "./sample-data";
const header="symbol,name,quantity,price,previous_close,cost_basis,sector,asset_class\n";
describe("demo portfolio import integrity",()=>{
 it("preserves explicit zero previous close and fund classification",()=>{const [holding]=parseHoldingsCsv(header+"FUND,Example fund,2,10,0,15,International,fund");expect(holding.previousClose).toBe(0);expect(holding.assetClass).toBe("fund");});
 it("rejects missing numbers and duplicate tickers instead of producing misleading totals",()=>{expect(()=>parseHoldingsCsv("symbol,name,quantity,price\nAAA,Example,,20")).toThrow(/invalid holding/i);expect(()=>parseHoldingsCsv("symbol,name,quantity,price\nAAA,Example,1,20\naaa,Example,2,20")).toThrow(/duplicate symbol/i);});
 it("reads quoted commas, escaped quotes and multiline names",()=>{const [holding]=parseHoldingsCsv('symbol,name,quantity,price\nAAA,"Example, ""global""\nfund",1,20');expect(holding.name).toBe('Example, "global"\nfund');});
 it("rejects malformed rows and unclosed quotes",()=>{expect(()=>parseHoldingsCsv('symbol,name,quantity,price\nAAA,"Example,1,20')).toThrow(/closing quote/i);expect(()=>parseHoldingsCsv('symbol,name,quantity,price\nAAA,Example,1,20,30')).toThrow(/column count/i);});
 it("handles an all-zero portfolio with finite math",()=>{const holdings=parseHoldingsCsv("symbol,name,quantity,price\nAAA,Example,0,0");const summary=summarizePortfolio({...samplePortfolio,holdings});expect(summary.totalValue).toBe(0);expect(summary.dayChangePercent).toBe(0);expect(summary.allocations[0].percent).toBe(0);});
});
describe("learning calculator",()=>{
 it("matches contributions when return and fees are zero",()=>{expect(growthExample(1000,50,10,0,0)).toEqual({gross:7000,net:7000,contributed:7000});});
 it("compounds an initial balance at the supplied annual rate",()=>{expect(growthExample(1000,0,10,6,0).gross).toBeCloseTo(1000*Math.pow(1.06,10),6);});
 it("reduces ending value for fees and handles negative returns",()=>{const result=growthExample(1000,50,10,-5,1);expect(result.net).toBeLessThan(result.gross);expect(result.gross).toBeLessThan(result.contributed);expect(result.net).toBeGreaterThan(0);});
});
describe("demo guide boundaries",()=>{
 it("uses current holdings rather than hardcoded sample values",()=>{const portfolio={...samplePortfolio,source:"csv" as const,holdings:[{...samplePortfolio.holdings[3],symbol:"TEST",name:"Test holding",quantity:2,price:10,previousClose:8}]};const answer=demoAnswer("Explain TEST",portfolio);expect(answer.text).toContain("$20.00");expect(answer.text).toContain("100.0%");expect(answer.text).toContain("CSV preview");expect(answer.href).toBe("/discover?q=TEST");});
 it("does not give buy or sell instructions",()=>{expect(demoAnswer("Should I buy AAPL?",samplePortfolio).text).toContain("won’t tell you what to buy or sell");});
 it("states its limits on unsupported questions",()=>{expect(demoAnswer("What will happen in 2030?",samplePortfolio).text).toContain("not a live AI model");});
});
