import { expect,it } from "vitest";
import { emptySavedHoldings, exportHoldings, importHoldings, parseSavedHoldingsCsv, sampleSavedHoldings } from "./saved-holdings";
it("round-trips holdings JSON without prices, credentials, weekly completion, or learning progress",()=>{
  const text=exportHoldings({...emptySavedHoldings,source:"sample",holdings:sampleSavedHoldings});
  expect(importHoldings(text)).toEqual({version:1,source:"sample",holdings:sampleSavedHoldings});
  expect(text).not.toMatch(/price|completedWeeks|activeWeek|key|timezone/);
});
it("imports ticker/shares CSV with optional cost basis and ignores file prices",()=>{
  expect(parseSavedHoldingsCsv('ticker,shares,cost_basis,price\n"vti",1.5,100,999')).toEqual([{ticker:"VTI",shares:1.5,costBasis:100}]);
  expect(parseSavedHoldingsCsv("symbol,quantity,name,price\nAAPL,2,Apple,999")).toEqual([{ticker:"AAPL",shares:2}]);
});
it.each(["ticker,shares\nVTI,-1","ticker,shares\nVTI,0","ticker,shares\nVTI,Infinity","ticker,shares\nVTI,2\nvti,3","ticker,shares\n<script>,2"])("rejects invalid CSV without partial application",text=>expect(()=>parseSavedHoldingsCsv(text)).toThrow());
it("rejects malformed JSON, unknown fields, duplicates, and oversized lists",()=>{
  expect(()=>importHoldings('{"version":1,"source":"user","holdings":[{"ticker":"VTI","shares":1,"price":123}]}')).toThrow();
  expect(()=>importHoldings(JSON.stringify({version:1,source:"user",holdings:Array.from({length:51},(_,i)=>({ticker:"T"+i,shares:1}))}))).toThrow();
});
