import { describe,expect,it } from "vitest";
import { campusConsistencyPercentile,contributionSeries,isPossibleDuplicate,monthKeyInTimeZone,normalizePlaidInvestmentActivity,shiftMonth,summarizeRecap,weekStart,type ContributionEvent } from "./recap";
const event=(id:string,date:string,amount:number,kind:"contribution"|"withdrawal"="contribution",status:"suggested"|"confirmed"|"excluded"|"deleted"="confirmed"):ContributionEvent=>({id,occurredOn:date,amount,currency:"USD",kind,status,source:"manual"});
describe("contribution normalization",()=>{
 it("normalizes Plaid cash-credit signs and only suggests external deposits",()=>{expect(normalizePlaidInvestmentActivity({id:"1",date:"2026-08-02",amount:-240,type:"cash",subtype:"deposit"})).toMatchObject({amount:240,kind:"contribution",status:"suggested"});expect(normalizePlaidInvestmentActivity({id:"2",date:"2026-08-02",amount:240,type:"buy",subtype:"buy"})).toBeNull()});
 it("separates withdrawals and rejects cancelled activity",()=>{expect(normalizePlaidInvestmentActivity({id:"1",date:"2026-08-02",amount:50,type:"cash",subtype:"withdrawal"})).toMatchObject({amount:50,kind:"withdrawal"});expect(normalizePlaidInvestmentActivity({id:"2",date:"2026-08-02",amount:-50,type:"cash",subtype:"deposit",cancelTransactionId:"old"})).toBeNull()});
 it("detects same-amount activity within two days",()=>{const events=[event("one","2026-08-01",100)];expect(isPossibleDuplicate(events,{occurredOn:"2026-08-03",amount:100})).toBe(true);expect(isPossibleDuplicate(events,{occurredOn:"2026-08-04",amount:100})).toBe(false)});
});
describe("recap calculations",()=>{
 it("counts confirmed contributions only",()=>{const result=summarizeRecap([event("a","2026-08-01",100),event("b","2026-08-02",500,"contribution","suggested"),event("c","2026-08-03",300,"contribution","excluded")],"2026-08");expect(result.contributed).toBe(100);expect(result.pending).toBe(1)});
 it("tracks withdrawals without erasing a contributing month",()=>{const result=summarizeRecap([event("a","2026-08-01",100),event("b","2026-08-02",120,"withdrawal")],"2026-08");expect(result.contributed).toBe(100);expect(result.withdrawn).toBe(120);expect(result.streak).toBe(1)});
 it("calculates a consecutive contribution streak and previous-period change",()=>{const events=[event("a","2026-06-01",50),event("b","2026-07-01",70),event("c","2026-08-01",90)];const result=summarizeRecap(events,"2026-08");expect(result.streak).toBe(3);expect(result.previousContributed).toBe(70);expect(result.changeFromPrevious).toBe(20)});
 it("stops a streak at a quiet month",()=>{const result=summarizeRecap([event("a","2026-06-01",50),event("b","2026-08-01",90)],"2026-08");expect(result.streak).toBe(1)});
 it("moves correctly across year boundaries",()=>{expect(shiftMonth("2026-01",-1)).toBe("2025-12");expect(shiftMonth("2026-12",1)).toBe("2027-01")});
 it("uses UTC calendar boundaries for weekly periods",()=>{expect(weekStart("2026-01-01")).toBe("2025-12-29");expect(weekStart("2026-01-04")).toBe("2025-12-29");expect(weekStart("2026-01-05")).toBe("2026-01-05")});
 it("keeps the month open until midnight in the user’s timezone",()=>{const instant=new Date("2026-10-01T02:00:00Z");expect(monthKeyInTimeZone(instant,"America/Chicago")).toBe("2026-09");expect(monthKeyInTimeZone(instant,"UTC")).toBe("2026-10")});
 it("selects the next lifetime milestone",()=>{expect(summarizeRecap([event("a","2026-08-01",920)],"2026-08").nextMilestone).toBe(1000)});
 it("builds a user-selected history window",()=>{const series=contributionSeries([event("a","2026-01-01",25),event("b","2026-08-01",90)],"2026-08",8);expect(series).toHaveLength(8);expect(series[0]).toMatchObject({period:"2026-01",contributed:25});expect(series[7]).toMatchObject({period:"2026-08",contributed:90})});
});
describe("campus privacy threshold",()=>{
 it("suppresses small cohorts",()=>{expect(campusConsistencyPercentile(Array(29).fill(3),3)).toBeNull()});
 it("returns only a percentile at the minimum cohort size",()=>{expect(campusConsistencyPercentile([...Array(15).fill(2),...Array(15).fill(5)],2)).toBe(50)});
 it("treats tied consistency scores equally",()=>{expect(campusConsistencyPercentile(Array(30).fill(4),4)).toBe(100)});
});
