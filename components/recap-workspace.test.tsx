// @vitest-environment jsdom
import { cleanup,fireEvent,render,screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { afterEach,beforeEach,describe,expect,it,vi } from "vitest";
import type { ContributionEvent } from "@/lib/recap";
import { RecapWorkspace } from "./recap-workspace";
import { MonthlyRecapModal } from "./recap-home";

const demo=vi.hoisted(()=>({contributions:[] as ContributionEvent[],setContributions:vi.fn(),contributionMode:"sample",recapTimezone:"America/Chicago",portfolio:{id:"empty",source:"sample",asOf:"2026-09-02",freshness:"delayed",currency:"USD",holdings:[]},preferences:{completed:[]},announce:vi.fn()}));
vi.mock("./demo-provider",()=>({useDemo:()=>demo}));
vi.mock("./mvp-provider",()=>({useMvp:()=>({learning:{completed:[]}})}));
beforeEach(()=>{demo.contributions=[]});
afterEach(cleanup);
describe("Recap at your own pace",()=>{
 it("shows an empty portfolio without a missed-month message or duplicate donut",()=>{render(<RecapWorkspace/>);expect(screen.getByRole("heading",{name:"Your overall picture"})).toBeVisible();expect(screen.getByText("No activity yet")).toBeVisible();expect(screen.queryByText(/streak|percentile|month unlocked|up.*last month|down.*last month/i)).toBeNull();expect(screen.queryByRole("img",{name:"No holdings yet"})).toBeNull()});
 it("keeps contribution totals distinct from withdrawals",()=>{demo.contributions=[{id:"a",occurredOn:"2026-09-01",amount:100,currency:"USD",kind:"contribution",status:"confirmed",source:"sample"},{id:"b",occurredOn:"2026-09-02",amount:60,currency:"USD",kind:"withdrawal",status:"confirmed",source:"sample"}];render(<RecapWorkspace/>);expect(screen.getAllByText("$100")).toHaveLength(2);expect(screen.queryByText("$40")).toBeNull()});
 it("makes goals optional and hides progress while paused",()=>{render(<RecapWorkspace/>);expect(screen.queryByRole("progressbar")).toBeNull();fireEvent.click(screen.getByText("A goal, if you want one"));fireEvent.change(screen.getByLabelText("Contribution target"),{target:{value:"1000"}});fireEvent.click(screen.getByRole("button",{name:"Set target"}));expect(screen.getByRole("progressbar")).toBeInTheDocument();fireEvent.click(screen.getByRole("button",{name:"Pause"}));expect(screen.getByText("Goal paused")).toBeVisible();expect(screen.queryByRole("progressbar")).toBeNull();fireEvent.click(screen.getByRole("button",{name:"Resume"}));expect(screen.getByRole("progressbar")).toBeInTheDocument()});
 it("does not interrupt Home with an automatic recap",()=>{const {container}=render(<MonthlyRecapModal/>);expect(container).toBeEmptyDOMElement()});
});
