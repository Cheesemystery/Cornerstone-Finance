// @vitest-environment jsdom
import {act,cleanup,render,screen} from "@testing-library/react";
import {afterEach,beforeEach,expect,it,vi} from "vitest";
import {LearningLibrary} from "./learning-library";
import {emptyLearning} from "@/lib/learning-progress";
import {lessons} from "@/lib/lessons";
let learning={...emptyLearning};
vi.mock("./mvp-provider",()=>({useMvp:()=>({learning,now:new Date(),account:{account:null}})}));
beforeEach(()=>{
 vi.useFakeTimers();learning={...emptyLearning,completed:lessons.map(l=>l.id)};
 window.history.replaceState({},"","/learn?justCompleted=8");
 vi.stubGlobal("matchMedia",vi.fn(()=>({matches:false,addEventListener:vi.fn(),removeEventListener:vi.fn()})));
 Object.defineProperty(Element.prototype,"scrollIntoView",{configurable:true,value:vi.fn()});
});
afterEach(()=>{cleanup();vi.useRealTimers();vi.unstubAllGlobals();localStorage.clear();window.history.replaceState({},"","/");});
it("selects and lays the saved eighth stone, fills the counter, and consumes the arrival query",()=>{
 const original=JSON.stringify(learning);const view=render(<LearningLibrary/>);
 const stone=screen.getByRole("button",{name:/What will your money buy.*earned/});
 expect(stone.getAttribute("aria-pressed")).toBe("true");expect(stone.getAttribute("data-placing")).toBe("true");
 expect(screen.getByText("7 of 8 lessons")).toBeTruthy();
 act(()=>vi.advanceTimersByTime(2000));
 expect(screen.getByText(/8 of 8 lessons · Foundation Complete/)).toBeTruthy();
 expect(view.container.querySelector('[data-placing="true"]')).toBeNull();
 expect(window.location.search).toBe("");expect(JSON.stringify(learning)).toBe(original);
});
it("never turns a query parameter into an unearned completion",()=>{
 learning={...emptyLearning,completed:lessons.slice(0,7).map(l=>l.id)};
 const view=render(<LearningLibrary/>);
 expect(view.container.querySelector('[data-placing="true"]')).toBeNull();
 expect(screen.getByRole("link",{name:"Continue Lesson 8"}).getAttribute("href")).toBe("/learn/inflation");
 expect(screen.getByRole("button",{name:/What will your money buy.*unfinished/}).getAttribute("aria-pressed")).toBe("true");
});
