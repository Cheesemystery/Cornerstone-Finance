// @vitest-environment jsdom
import {renderToString} from "react-dom/server";
import {act,cleanup,fireEvent,render,screen} from "@testing-library/react";
import {afterEach,beforeEach,expect,it,vi} from "vitest";
import {CornerstoneReward,PLACEMENT_MS} from "./cornerstone-reward";
import {foundationLessons} from "@/lib/foundation";
const id="why-prices-move";
const props={completed:["what-you-own",id],lessonId:id,newCompletion:true,reducedMotion:false,nextHref:"/learn/spread-your-risk",nextTitle:"Next lesson",saveLabel:"Saved in this browser"};
let reduced=false;
beforeEach(()=>{reduced=false;vi.stubGlobal("matchMedia",vi.fn(()=>({get matches(){return reduced;},addEventListener:vi.fn(),removeEventListener:vi.fn()})));});
afterEach(()=>{cleanup();vi.useRealTimers();vi.unstubAllGlobals();});
it("places only the just-earned stone, keeps navigation open and settles without moving focus",()=>{
 vi.useFakeTimers();const view=render(<CornerstoneReward {...props}/>);
 expect(view.container.querySelectorAll('[data-incoming="true"]')).toHaveLength(1);
 expect(view.container.querySelector('[data-cornerstone="why-prices-move"] [data-incoming="true"]')).toBeTruthy();
 expect(view.container.querySelectorAll('[data-laid="true"]')).toHaveLength(2);
 const next=screen.getByRole("link",{name:"Next lesson"});next.focus();
 act(()=>vi.advanceTimersByTime(PLACEMENT_MS+150));
 expect(screen.getByRole("status").textContent).toBe("2 of 8 cornerstones laid");
 expect(document.activeElement).toBe(next);
 expect(screen.queryByRole("button",{name:"Skip animation"})).toBeNull();
});
it("skips immediately and never replays a restored completion",()=>{
 const view=render(<CornerstoneReward {...props}/>);
 const skip=screen.getByRole("button",{name:"Skip animation"});skip.focus();
 fireEvent.click(skip);
 expect(document.activeElement).toBe(screen.getByRole("button",{name:"Animation skipped"}));
 expect(view.container.querySelector('[data-incoming="true"]')).toBeNull();
 view.unmount();const restored=render(<CornerstoneReward {...props} newCompletion={false}/>);
 expect(restored.container.querySelector('[data-incoming="true"]')).toBeNull();
});
it.each(["saved","device"])("honors %s reduced motion",source=>{
 reduced=source==="device";
 const view=render(<CornerstoneReward {...props} reducedMotion={source==="saved"}/>);
 expect(view.container.querySelector('[data-incoming="true"]')).toBeNull();
 expect(screen.getByRole("status").textContent).toBe("2 of 8 cornerstones laid");
});
it("keeps earlier stones fixed even when lessons are completed out of catalog order",()=>{
 const first=foundationLessons([id]);const next=foundationLessons([id,"what-you-own",id,"invalid"]);
 expect(first.ordered[0].id).toBe(next.ordered[0].id);
 expect(next.earned.map(l=>l.id)).toEqual([id,"what-you-own"]);
 expect(next.ordered).toHaveLength(8);
});

it("keeps static reward markup identical with or without a browser observer",()=>{
 const fallback=renderToString(<CornerstoneReward {...props} newCompletion={false}/>);
 vi.stubGlobal("IntersectionObserver",class {});
 const browser=renderToString(<CornerstoneReward {...props} newCompletion={false}/>);
 expect(browser).toBe(fallback);
 expect(browser).not.toContain("data-started");
});
