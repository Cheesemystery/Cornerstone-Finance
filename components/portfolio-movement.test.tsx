// @vitest-environment jsdom
import { cleanup, render, screen, fireEvent, act } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { PortfolioStory, PortfolioMovement } from "./portfolio-movement";
import { samplePortfolio } from "@/lib/sample-data";
const preference=vi.hoisted(()=>({reduced:false}));
vi.mock("./mvp-provider",()=>({useMvp:()=>({learning:{timezone:"America/Chicago",reducedMotion:preference.reduced},now:new Date("2026-09-02T20:00:00Z")})}));
beforeEach(()=>{preference.reduced=false;vi.useFakeTimers();vi.spyOn(document,"visibilityState","get").mockReturnValue("visible");vi.stubGlobal("matchMedia",()=>({matches:false,addEventListener:vi.fn(),removeEventListener:vi.fn()}))});
afterEach(()=>{cleanup();vi.useRealTimers();vi.restoreAllMocks();vi.unstubAllGlobals()});
it("rotates dated questions and allows the user to pause",()=>{render(<PortfolioStory portfolio={samplePortfolio}/>);expect(screen.getByRole("heading").textContent).toBe("What drove the move?");act(()=>vi.advanceTimersByTime(12000));expect(screen.getByRole("heading").textContent).toBe("What happened today?");fireEvent.click(screen.getByRole("button",{name:"Pause rotating heading"}));act(()=>vi.advanceTimersByTime(24000));expect(screen.getByRole("heading").textContent).toBe("What happened today?")});
it("keeps the heading still with the reduced-motion preference",()=>{preference.reduced=true;render(<PortfolioStory portfolio={samplePortfolio}/>);expect(screen.queryByRole("button",{name:"Pause rotating heading"})).toBeNull();act(()=>vi.advanceTimersByTime(36000));expect(screen.getByRole("heading").textContent).toBe("What drove the move?")});
it("retains holding selection and details through the contributor BarList",()=>{
 const select=vi.fn();
 const view=render(<PortfolioMovement portfolio={samplePortfolio} selected={null} onSelect={select}/>);
 fireEvent.click(screen.getByRole("button",{name:/VTI.*Positive contribution/}));
 expect(select).toHaveBeenCalledWith("VTI");
 view.rerender(<PortfolioMovement portfolio={samplePortfolio} selected="VTI" onSelect={select}/>);
 expect(screen.getByRole("button",{name:/VTI.*Positive contribution/}).getAttribute("aria-pressed")).toBe("true");
 expect(screen.getByRole("heading",{name:"Inside VTI"})).toBeTruthy();
 expect(screen.getByRole("link",{name:/Browse VTI news/}).getAttribute("href")).toBe("https://finance.yahoo.com/quote/VTI/news/");
});
