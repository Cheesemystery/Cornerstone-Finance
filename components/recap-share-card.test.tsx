// @vitest-environment jsdom
import { cleanup,fireEvent,render,screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { afterEach,describe,expect,it } from "vitest";
import { RecapShareCard } from "./recap-share-card";
import type { RecapSummary } from "@/lib/recap";

const summary:RecapSummary={period:"2026-08",contributed:240,withdrawn:0,previousContributed:120,changeFromPrevious:120,lifetimeContributed:990,streak:3,pending:0,nextMilestone:1000,months:[]};
afterEach(cleanup);

describe("private recap share card",()=>{
  it("starts hidden and downloads the hidden state",()=>{render(<RecapShareCard summary={summary}/>);expect(screen.queryByText("$240")).toBeNull();expect(screen.getByRole("link",{name:/download/i})).toHaveAttribute("href","/api/recaps/sample/card?period=2026-08&amounts=hidden")});
  it("reveals only after the eye control is used and keeps the download in sync",()=>{render(<RecapShareCard summary={summary} source="server"/>);fireEvent.click(screen.getByRole("button",{name:/show amount/i}));expect(screen.getByText("$240")).toBeTruthy();expect(screen.getByRole("link",{name:/download/i})).toHaveAttribute("href","/api/recaps/current/card?period=2026-08&amounts=shown")});
});
