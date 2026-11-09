// @vitest-environment jsdom
import {cleanup,fireEvent,render,screen} from "@testing-library/react";
import {afterEach,beforeEach,expect,it,vi} from "vitest";
import {DemoProvider} from "./demo-provider";
import {MvpProvider,useMvp} from "./mvp-provider";
import {LessonReader} from "./lesson-reader";
import {OwnershipQuiz} from "./ownership-quiz";
import {emptyLearning} from "@/lib/learning-progress";
function Reset(){const {reset}=useMvp();return <button onClick={reset}>Reset fixture</button>;}
beforeEach(()=>{
 vi.stubGlobal("matchMedia",vi.fn(()=>({matches:true,addEventListener:vi.fn(),removeEventListener:vi.fn()})));
 Object.defineProperty(Element.prototype,"scrollIntoView",{configurable:true,value:vi.fn()});
});
afterEach(()=>{cleanup();localStorage.clear();vi.unstubAllGlobals();});
it("restarts an open quiz when another surface resets learning",()=>{
 localStorage.setItem("cornerstone-learning-v1",JSON.stringify({...emptyLearning,quizzes:{"what-you-own":{version:1,passed:2}}}));
 render(<MvpProvider><Reset/><OwnershipQuiz onFinish={vi.fn()} onMiss={vi.fn()}/></MvpProvider>);
 expect(screen.getByRole("heading",{name:"Question 3 of 3"})).toBeTruthy();
 fireEvent.click(screen.getByRole("button",{name:"Reset fixture"}));
 expect(screen.getByRole("heading",{name:"Question 1 of 3"})).toBeTruthy();
 expect(screen.queryByRole("button",{name:"Keep this idea"})).toBeNull();
});
it("clears a completed reader session on reset and on changing lessons",()=>{
 localStorage.setItem("cornerstone-learning-v1",JSON.stringify({...emptyLearning,completed:["what-you-own"]}));
 const ui=(id:string)=><DemoProvider><MvpProvider><Reset/><LessonReader id={id}/></MvpProvider></DemoProvider>;
 const view=render(ui("what-you-own"));
 expect(screen.getByRole("heading",{name:"One more idea, understood."})).toBeTruthy();
 fireEvent.click(screen.getByRole("button",{name:"Reset fixture"}));
 expect(screen.getByRole("button",{name:"Let’s try it"})).toBeTruthy();
 fireEvent.click(screen.getByRole("button",{name:"Let’s try it"}));
 view.rerender(ui("why-prices-move"));
 expect(screen.getByRole("button",{name:"Let’s try it"})).toBeTruthy();
});
it("places initial quiz focus on the question heading",()=>{
 localStorage.setItem("cornerstone-learning-v1",JSON.stringify({...emptyLearning,steps:{"what-you-own":2}}));
 render(<DemoProvider><MvpProvider><LessonReader id="what-you-own"/></MvpProvider></DemoProvider>);
 fireEvent.click(screen.getByRole("button",{name:"Try three quick checks"}));
 expect(document.activeElement).toBe(screen.getByRole("heading",{name:"Question 1 of 3"}));
});
it("focuses textual feedback after wrong and correct answers, then the next question",()=>{
 render(<MvpProvider><OwnershipQuiz onFinish={vi.fn()} onMiss={vi.fn()}/></MvpProvider>);
 fireEvent.click(screen.getByLabelText("Its value cannot fall."));
 fireEvent.click(screen.getByRole("button",{name:"Check answer"}));
 expect(document.activeElement).toBe(screen.getByRole("status"));
 expect(document.activeElement?.textContent).toContain("A useful thing to notice.");
 expect(screen.queryByRole("button",{name:"Continue"})).toBeNull();
 fireEvent.click(screen.getByLabelText("It can hold a basket of stocks or bonds."));
 fireEvent.click(screen.getByRole("button",{name:"Check answer"}));
 expect(document.activeElement).toBe(screen.getByRole("status"));
 expect(document.activeElement?.textContent).toContain("That’s the idea.");
 fireEvent.click(screen.getByRole("button",{name:"Continue"}));
 expect(document.activeElement).toBe(screen.getByRole("heading",{name:"Question 2 of 3"}));
});
