import { afterEach, expect, it, vi } from "vitest";
vi.mock("server-only",()=>({}));
import { getHistoricalCloses } from "./server/historical-closes";
import { POST } from "@/app/api/prices/history/route";
afterEach(()=>{vi.unstubAllEnvs();vi.unstubAllGlobals();});
it("returns one fully labeled sample response with dated closes when no key is configured",async()=>{
  vi.stubEnv("TWELVE_DATA_API_KEY",""); const fetcher=vi.fn();vi.stubGlobal("fetch",fetcher);
  const data=await getHistoricalCloses(["VTI","UNKNOWN"],"2026-08-24","2026-09-02");
  expect(data.mode).toBe("sample");expect(data.asOf).toBe("2026-09-02");
  expect(data.series.UNKNOWN).toEqual([]);expect(data.series.VTI.at(-1)?.date).toBe("2026-09-02");
  expect(fetcher).not.toHaveBeenCalled();
});
it("requests dated closes on the server with a private header and validates USD",async()=>{
  vi.stubEnv("TWELVE_DATA_API_KEY","test-key-never-production");
  const fetcher=vi.fn().mockResolvedValue(new Response(JSON.stringify({meta:{symbol:"VTI",currency:"USD",interval:"1day"},values:[{datetime:"2026-10-09",close:"100.12"},{datetime:"2026-10-16",close:"101.50"}]})));
  vi.stubGlobal("fetch",fetcher);
  const data=await getHistoricalCloses(["VTI"],"2026-10-09","2026-10-16");
  expect(data.mode).toBe("provider");expect(data.series.VTI[0].close).toBe(100.12);
  const [url,options]=fetcher.mock.calls[0];
  expect(url.toString()).not.toContain("test-key");expect(url.searchParams.get("interval")).toBe("1day");
  expect(options.headers.Authorization).toBe("apikey test-key-never-production");
});
it("does not mix a failed live symbol with fixture rows",async()=>{
  vi.stubEnv("TWELVE_DATA_API_KEY","test-key");
  vi.stubGlobal("fetch",vi.fn().mockResolvedValue(new Response(JSON.stringify({status:"error",message:"provider private message"}))));
  await expect(getHistoricalCloses(["BAD"],"2026-10-01","2026-10-16")).rejects.toThrow();
});
it("rejects quantities and invalid dates at the server route, and returns no key or portfolio information",async()=>{
  vi.stubEnv("TWELVE_DATA_API_KEY","");
  const request=(body:unknown)=>new Request("http://localhost/api/prices/history",{method:"POST",body:JSON.stringify(body)});
  expect((await POST(request({tickers:["VTI"],shares:2}))).status).toBe(400);
  expect((await POST(request({tickers:["VTI"],fromDate:"2026-02-30"}))).status).toBe(400);
  const response=await POST(request({tickers:["VTI"],sample:true}));
  expect(response.status).toBe(200);expect(response.headers.get("cache-control")).toBe("private, no-store");
  expect(await response.text()).not.toMatch(/apikey|shares|costBasis/);
});
