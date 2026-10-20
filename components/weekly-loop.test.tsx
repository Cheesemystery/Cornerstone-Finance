// @vitest-environment jsdom
import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { useEffect, type ReactNode } from "react";
import { DemoProvider, useDemo } from "./demo-provider";
import { MvpProvider } from "./mvp-provider";
import { HomeDashboard } from "./home-dashboard";
import { LessonReader } from "./lesson-reader";
import { HoldingsInput } from "./holdings-input";
import { emptySavedHoldings, holdingsIdentity, sampleSavedHoldings } from "@/lib/saved-holdings";
import { calendarWeek } from "@/lib/weekly-portfolio";
import { emptyLearning } from "@/lib/learning-progress";
import { getSampleHistoricalCloses } from "@/lib/sample-history";
import type { HistoricalData } from "@/lib/historical-data";

let demo: ReturnType<typeof useDemo>;
function Probe() { const value = useDemo(); useEffect(() => { demo = value; }, [value]); return null; }
function Providers({children}:{children:ReactNode}) {return <DemoProvider><MvpProvider><Probe/>{children}</MvpProvider></DemoProvider>;}
const data = getSampleHistoricalCloses(sampleSavedHoldings.map(h=>h.ticker),"2026-08-24","2026-09-02");
beforeEach(()=>{
  localStorage.setItem("cornerstone-holdings-v1",JSON.stringify({...emptySavedHoldings,timezone:"America/Chicago"}));
  localStorage.setItem("cornerstone-learning-v1",JSON.stringify({...emptyLearning,completed:["why-prices-move"],steps:{"why-prices-move":6}}));
  vi.stubGlobal("fetch",vi.fn().mockImplementation(async()=>new Response(JSON.stringify(data))));
  vi.stubGlobal("matchMedia",vi.fn(()=>({matches:false,addEventListener:vi.fn(),removeEventListener:vi.fn()})));
  Object.defineProperty(Element.prototype,"scrollIntoView",{configurable:true,value:vi.fn()});
});
afterEach(()=>{cleanup();vi.restoreAllMocks();demo?.clearHoldings();localStorage.clear();vi.unstubAllGlobals();vi.useRealTimers();});

it("offers exactly three holdings input choices for an empty portfolio without fabricated values",()=>{
  const {container}=render(<Providers><HomeDashboard/></Providers>);
  expect(screen.getByRole("button",{name:"Upload CSV"})).toBeTruthy();
  expect(screen.getByRole("button",{name:"Add manually"})).toBeTruthy();
  expect(screen.getByRole("button",{name:"Use sample portfolio"})).toBeTruthy();
  expect(container.textContent).not.toMatch(/\$|Unavailable|XP|streak/);
});

it("completes a related existing lesson, persists done for this week on reload, and sends no share counts to the price route",async()=>{
  const view=render(<Providers><HomeDashboard/></Providers>);
  fireEvent.click(screen.getByRole("button",{name:"Use sample portfolio"}));
  const lesson=await screen.findByRole("link",{name:"Start your 2-minute lesson"});
  expect(screen.getByText(/Sample data - as of Sep 2, 2026/)).toBeTruthy();
  const [url,options]=vi.mocked(fetch).mock.calls[0];
  expect(url).toBe("/api/prices/history");
  expect(Object.keys(JSON.parse(options!.body as string)).sort()).toEqual(["sample","tickers"]);
  fireEvent.click(lesson);
  expect(demo.savedHoldings.activeWeek?.lessonId).toBe("why-prices-move");
  view.rerender(<Providers><LessonReader id="why-prices-move" weekly /></Providers>);
  fireEvent.click(screen.getByRole("button",{name:/Let’s try it/}));
  fireEvent.click(screen.getByLabelText("One share costs $2 less than before."));
  fireEvent.click(screen.getByRole("button",{name:"Check answer"}));
  fireEvent.click(screen.getByRole("button",{name:"Continue"}));
  fireEvent.click(screen.getByRole("button",{name:"Try one quick check"}));
  fireEvent.click(screen.getByLabelText("The price fell; you need more context."));
  fireEvent.click(screen.getByRole("button",{name:"Check answer"}));
  fireEvent.click(screen.getByRole("button",{name:"Keep this idea"}));
  expect(screen.getByRole("link",{name:/Back to your week/}).getAttribute("href")).toBe("/");
  view.rerender(<Providers><HomeDashboard/></Providers>);
  expect(screen.getByRole("status").textContent).toBe("This week’s stone is laid. See you Monday.");
  expect(screen.queryByRole("link",{name:"Start your 2-minute lesson"})).toBeNull();
  expect(JSON.parse(localStorage.getItem("cornerstone-learning-v1")!).completed).toEqual(["why-prices-move"]);
  view.unmount();
  render(<Providers><HomeDashboard/></Providers>);
  await screen.findByText("This week’s stone is laid. See you Monday.");
});

it("does not let a previously completed lesson, a wrong lesson, or stale holdings finish the weekly loop",async()=>{
  localStorage.setItem("cornerstone-holdings-v1",JSON.stringify({...emptySavedHoldings,holdings:sampleSavedHoldings,source:"sample"}));
  render(<Providers><HomeDashboard/></Providers>);
  await screen.findByRole("link",{name:"Start your 2-minute lesson"});
  expect(demo.weekDone).toBe(false);
  act(()=>{demo.beginWeek();demo.finishWeek("what-you-own");});
  expect(demo.weekDone).toBe(false);
  act(()=>demo.replaceHoldings([{ticker:"VTI",shares:2}],"user"));
  await waitFor(()=>expect(demo.historyStatus).toBe("ready"));
  act(()=>demo.finishWeek("why-prices-move"));
  expect(demo.weekDone).toBe(false);
});

it("reopens the task on Monday in the saved timezone without losing the previous completion",async()=>{
  vi.useFakeTimers({toFake:["Date"]});vi.setSystemTime(new Date("2026-10-18T20:00:00Z"));
  localStorage.setItem("cornerstone-holdings-v1",JSON.stringify({...emptySavedHoldings,holdings:sampleSavedHoldings,source:"sample"}));
  const view=render(<Providers><HomeDashboard/></Providers>);
  await screen.findByRole("link",{name:"Start your 2-minute lesson"});
  act(()=>demo.beginWeek());act(()=>demo.finishWeek("why-prices-move"));
  expect(demo.weekDone).toBe(true);view.unmount();
  vi.setSystemTime(new Date("2026-10-19T06:00:00Z"));
  render(<Providers><HomeDashboard/></Providers>);
  await screen.findByRole("link",{name:"Start your 2-minute lesson"});
  expect(demo.weekDone).toBe(false);
  expect(Object.keys(demo.savedHoldings.completedWeeks)).toHaveLength(1);
});

it("keeps the action visible when this week's stored completion belongs to another recommended lesson",async()=>{
  const key = `${calendarWeek(new Date(),emptySavedHoldings.timezone)}:sample:${holdingsIdentity(sampleSavedHoldings)}`;
  localStorage.setItem("cornerstone-holdings-v1", JSON.stringify({...emptySavedHoldings,holdings:sampleSavedHoldings,source:"sample",completedWeeks:{[key]:{lessonId:"spread-your-risk",completedAt:new Date().toISOString()}}}));
  render(<Providers><HomeDashboard /></Providers>);
  await screen.findByRole("link",{name:"Start your 2-minute lesson"});
  expect(demo.weekDone).toBe(false);
  expect(screen.queryByText("This week’s stone is laid. See you Monday.")).toBeNull();
});

it("requires actual lesson completion as well as the matching weekly receipt",async()=>{
  const key = `${calendarWeek(new Date(),emptySavedHoldings.timezone)}:sample:${holdingsIdentity(sampleSavedHoldings)}`;
  localStorage.setItem("cornerstone-learning-v1",JSON.stringify({...emptyLearning,completed:[]}));
  localStorage.setItem("cornerstone-holdings-v1", JSON.stringify({...emptySavedHoldings,holdings:sampleSavedHoldings,source:"sample",completedWeeks:{[key]:{lessonId:"why-prices-move",completedAt:new Date().toISOString()}}}));
  render(<Providers><HomeDashboard /></Providers>);
  await screen.findByRole("link",{name:"Start your 2-minute lesson"});
  expect(screen.queryByText("This week’s stone is laid. See you Monday.")).toBeNull();
});

it("keeps short history and unsupported tickers in a friendly input state, without a partial portfolio",async()=>{
  localStorage.setItem("cornerstone-holdings-v1",JSON.stringify({...emptySavedHoldings,holdings:[{ticker:"MISSING",shares:2}]}));
  render(<Providers><HomeDashboard/></Providers>);
  await screen.findByRole("button",{name:"Use sample portfolio"});
  expect(demo.historyStatus).toBe("insufficient");
  expect(demo.portfolio.holdings).toEqual([]);
  expect(screen.queryByText("Unavailable")).toBeNull();
});

it("imports CSV and JSON atomically and keeps the last valid holdings after invalid input",async()=>{
  render(<Providers><HoldingsInput manage /></Providers>);
  const upload=async(label:string,text:string)=>{
    const file=new File([text],"holdings",{type:"text/plain"});Object.defineProperty(file,"text",{value:async()=>text});
    await act(async()=>fireEvent.change(screen.getByLabelText(label),{target:{files:[file]}}));
  };
  await upload("Upload holdings CSV","ticker,shares,cost_basis,price\nVTI,3.5,300,999");
  expect(demo.savedHoldings.holdings).toEqual([{ticker:"VTI",shares:3.5,costBasis:300}]);
  await upload("Import holdings JSON",'{"version":1,"source":"user","holdings":[{"ticker":"BND","shares":4}]}');
  expect(demo.savedHoldings.holdings).toEqual([{ticker:"BND",shares:4}]);
  await upload("Import holdings JSON",'{"version":1,"source":"user","holdings":[{"ticker":"BND","shares":-4}]}');
  expect(screen.getByRole("alert")).toBeTruthy();
  expect(demo.savedHoldings.holdings).toEqual([{ticker:"BND",shares:4}]);
});

it("does not accept an obsolete price request after holdings change",async()=>{
  let finish!: (response:Response)=>void;
  vi.mocked(fetch).mockImplementationOnce(()=>new Promise(resolve=>{finish=resolve;}));
  localStorage.setItem("cornerstone-holdings-v1",JSON.stringify({...emptySavedHoldings,holdings:[{ticker:"VTI",shares:1}]}));
  render(<Providers><HomeDashboard/></Providers>);
  act(()=>demo.replaceHoldings([{ticker:"BND",shares:2}]));
  await waitFor(()=>expect(demo.historyStatus).toBe("ready"));
  const old:HistoricalData={...data,series:{VTI:data.series.VTI}};
  await act(async()=>finish(new Response(JSON.stringify(old))));
  expect(demo.week?.positions[0].ticker).toBe("BND");
});

it("shows a visible storage warning even after the priced Home replaces its input controls",async()=>{
  const original=Storage.prototype.setItem;
  vi.spyOn(Storage.prototype,"setItem").mockImplementation(function(this:Storage,key:string,value:string){
    if(key.startsWith("cornerstone-holdings-v1")) throw new Error("quota");
    return original.call(this,key,value);
  });
  render(<Providers><HomeDashboard/></Providers>);
  fireEvent.click(screen.getByRole("button",{name:"Use sample portfolio"}));
  await screen.findByRole("link",{name:"Start your 2-minute lesson"});
  expect(screen.getByText(/This browser could not fully save or read holdings/)).toBeTruthy();
  expect(demo.holdingsPersistence).toBe("session");
});
