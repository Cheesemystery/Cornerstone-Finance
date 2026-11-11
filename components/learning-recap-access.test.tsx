// @vitest-environment jsdom
import {cleanup,fireEvent,render,screen,within} from "@testing-library/react";
import {afterEach,beforeEach,expect,it,vi} from "vitest";
import {MvpProvider} from "./mvp-provider";
import {LearningSummary} from "./learning-summary";
import {PortfolioWorkspace} from "./portfolio-workspace";
import {emptyLearning,recordActivity} from "@/lib/learning-progress";
import {lessons} from "@/lib/lessons";
const state=vi.hoisted(()=>({historyStatus:"empty"}));
vi.mock("./demo-provider",()=>({useDemo:()=>({historyStatus:state.historyStatus,history:null,week:null,retryHistory:vi.fn()})}));
vi.mock("./holdings-input",()=>({HoldingsInput:()=> <button>Import holdings fixture</button>}));
vi.mock("./demo-portfolio",()=>({DemoPortfolio:()=> <p>Portfolio fixture</p>}));
vi.mock("./portfolio-recap",()=>({PortfolioRecap:()=> <p>Financial recap fixture</p>}));
vi.mock("./practice-workspace",()=>({PracticeWorkspace:()=> <p>Practice fixture</p>}));
beforeEach(()=>{localStorage.setItem("cornerstone-learning-v1",JSON.stringify({...recordActivity(emptyLearning,"lesson","what-you-own",new Date("2026-11-07T12:00:00Z")),steps:{"read-earnings":3}}));});
afterEach(()=>{cleanup();localStorage.clear();window.history.replaceState({},"","/");vi.restoreAllMocks();});
it.each(["empty","loading","insufficient","error","ready"])("exposes matching learning totals, latest date and resume without financial setup: %s",status=>{
 state.historyStatus=status;
 const view=render(<MvpProvider><PortfolioWorkspace/></MvpProvider>);
 const summary=screen.getByRole("region",{name:"Learning progress"});
 expect(summary.textContent).toContain("1 of 8 lessons completed · 1 earned brick");
 expect(summary.querySelector("time")?.getAttribute("datetime")).toBe("2026-11-07");
 expect(within(summary).getByRole("link",{name:"Resume: Read past the headline."}).getAttribute("href")).toBe("/learn/read-earnings");
 expect(view.container.querySelector("#recap")).toContain(summary);
 fireEvent.click(screen.getByText("Learning milestones, history & sharing"));
 expect(screen.getByRole("heading",{name:"Your learning history"})).toBeTruthy();
 fireEvent.click(screen.getByRole("button",{name:"Practice Sandbox"}));
 expect(screen.getByRole("region",{name:"Learning progress"}).textContent).toContain("1 of 8");
});
it("preserves undated legacy progress and offers review when all six are complete",()=>{
 localStorage.setItem("cornerstone-learning-v1",JSON.stringify({...emptyLearning,completed:lessons.map(l=>l.id)}));
 const view=render(<MvpProvider><LearningSummary/></MvpProvider>);
 expect(screen.getByRole("link",{name:"Review lessons"}).getAttribute("href")).toBe("/learn");
 expect(screen.getByText(/Their dates were not recorded/)).toBeTruthy();
 expect(view.container.querySelector("time")).toBeNull();
});

it("focuses the learning recap anchor when financial history is unavailable",()=>{
 state.historyStatus="loading";
 window.history.replaceState({},"","/portfolio#recap");
 const scroll=vi.fn();Object.defineProperty(Element.prototype,"scrollIntoView",{configurable:true,value:scroll});
 render(<MvpProvider><PortfolioWorkspace/></MvpProvider>);
 expect(document.activeElement).toBe(screen.getByRole("region",{name:"Learning recap"}));
 expect(scroll).toHaveBeenCalled();
});

it("shows the actual latest activity after events arrive out of order",()=>{
 const older={id:"lesson:what-you-own",kind:"lesson",target:"what-you-own",day:"2026-11-01",at:"2026-11-01T12:00:00Z"};
 const newer={id:"review:2026-11-07",kind:"review",target:"daily",day:"2026-11-07",at:"2026-11-07T12:00:00Z"};
 localStorage.setItem("cornerstone-learning-v1",JSON.stringify({...emptyLearning,completed:["what-you-own","read-earnings"],events:[newer,older]}));
 render(<MvpProvider><LearningSummary/></MvpProvider>);
 const summary=screen.getByRole("region",{name:"Learning progress"});
 expect(summary.textContent).toContain("Latest activity: A short review completed");
 expect(summary.querySelector("time")?.getAttribute("datetime")).toBe("2026-11-07");
 expect(summary.textContent).toContain("1 earlier completion without a recorded date");
});
