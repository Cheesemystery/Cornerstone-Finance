// @vitest-environment jsdom
import { cleanup,fireEvent,render,screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { afterEach,beforeEach,describe,expect,it,vi } from "vitest";
import { RecapShareCard } from "./recap-share-card";
import type { RecapSummary } from "@/lib/recap";

const summary:RecapSummary={period:"2026-08",contributed:240,withdrawn:0,previousContributed:120,changeFromPrevious:120,lifetimeContributed:990,streak:3,pending:0,nextMilestone:1000,months:[]};
const fillText=vi.fn();
beforeEach(()=>{
 vi.spyOn(HTMLCanvasElement.prototype,"getContext").mockReturnValue({fillRect:vi.fn(),fillText} as unknown as CanvasRenderingContext2D);
 vi.spyOn(HTMLCanvasElement.prototype,"toBlob").mockImplementation(callback=>callback(new Blob(["png"],{type:"image/png"})));
 vi.spyOn(HTMLAnchorElement.prototype,"click").mockImplementation(()=>undefined);
 vi.stubGlobal("URL",Object.assign(URL,{createObjectURL:vi.fn(()=>"blob:recap"),revokeObjectURL:vi.fn()}));
});
afterEach(()=>{cleanup();vi.restoreAllMocks();fillText.mockClear()});

describe("private recap share card",()=>{
  it("starts hidden and excludes the amount from the downloaded canvas",()=>{render(<RecapShareCard summary={summary}/>);expect(screen.queryByText("$240")).toBeNull();fireEvent.click(screen.getByRole("button",{name:/download/i}));expect(fillText.mock.calls.some(call=>String(call[0]).includes("$240"))).toBe(false);expect(fillText.mock.calls.some(call=>call[0]==="••••")).toBe(true)});
  it("downloads the current edited amount only after it is revealed",()=>{render(<RecapShareCard summary={{...summary,contributed:315}} source="server"/>);fireEvent.click(screen.getByRole("button",{name:/show amount/i}));expect(screen.getByText("$315")).toBeTruthy();fireEvent.click(screen.getByRole("button",{name:/download/i}));expect(fillText.mock.calls.some(call=>call[0]==="$315")).toBe(true);expect(screen.queryByText(/streak/i)).toBeNull()});
  it("starts hidden again on a fresh render",()=>{const view=render(<RecapShareCard summary={summary}/>);fireEvent.click(screen.getByRole("button",{name:/show amount/i}));view.unmount();render(<RecapShareCard summary={summary}/>);expect(screen.queryByText("$240")).toBeNull()});
});
