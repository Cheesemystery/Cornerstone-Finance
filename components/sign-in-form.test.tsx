// @vitest-environment jsdom
import {act,cleanup,fireEvent,render,screen} from "@testing-library/react";
import {afterEach,expect,it,vi} from "vitest";
import {SignInForm} from "./sign-in-form";
afterEach(()=>{cleanup();vi.unstubAllGlobals();});
it("blocks duplicate email submissions while pending and keeps guest access on failure",async()=>{
 let finish!:(value:Response)=>void;
 const fetcher=vi.fn(()=>new Promise<Response>(resolve=>{finish=resolve;}));vi.stubGlobal("fetch",fetcher);
 const view=render(<SignInForm returnTo="/learn/what-you-own"/>);
 fireEvent.change(screen.getByLabelText("Email address"),{target:{value:"learner@example.test"}});
 const form=view.container.querySelector("form")!;
 fireEvent.submit(form);fireEvent.submit(form);
 expect(fetcher).toHaveBeenCalledTimes(1);
 await act(async()=>{finish(Response.json({error:"Unavailable"},{status:503}));});
 expect(screen.getByRole("status").textContent).toContain("not enabled");
 expect(screen.getByRole("link",{name:/Continue as guest/}).getAttribute("href")).toBe("/onboarding");
 expect(screen.getByRole("button",{name:"Email me a sign-in link"})).toBeTruthy();
});
