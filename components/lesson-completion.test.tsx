// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { DemoProvider } from "./demo-provider";
import { MvpProvider } from "./mvp-provider";
import { LessonReader } from "./lesson-reader";
import { LearningSummary } from "./learning-summary";
import { emptyLearning } from "@/lib/learning-progress";
import { lessonQuiz } from "@/lib/lesson-quiz";
import { lessons } from "@/lib/lessons";
beforeEach(() => {
 vi.stubGlobal("matchMedia",vi.fn(()=>({matches:true,addEventListener:vi.fn(),removeEventListener:vi.fn()})));
 Object.defineProperty(Element.prototype,"scrollIntoView",{configurable:true,value:vi.fn()});
});
afterEach(()=>{cleanup();localStorage.clear();vi.unstubAllGlobals();});
it.each(lessons)("$id saves one completion before animation and restores it without a second brick", ({id}) => {
 localStorage.setItem("cornerstone-learning-v1",JSON.stringify({...emptyLearning,steps:{[id]:3}}));
 const ui = <DemoProvider><MvpProvider><LessonReader id={id}/><LearningSummary/></MvpProvider></DemoProvider>;
 const view = render(ui);
 expect(screen.queryByRole("button",{name:"Finish lesson"})).toBeNull();
 for (const q of lessonQuiz(id)) {
  fireEvent.click(screen.getByLabelText(q.options[q.correct]));
  fireEvent.click(screen.getByRole("button",{name:"Check answer"}));
  fireEvent.click(screen.getByRole("button",{name:"Continue"}));
 }
 fireEvent.click(screen.getByRole("button",{name:"Finish lesson"}));
 if(screen.queryByRole("button",{name:"Stay with this lesson"}))fireEvent.click(screen.getByRole("button",{name:"Stay with this lesson"}));
 expect(screen.getByRole("heading",{name:"+20 XP · One cornerstone earned"})).toBeTruthy();
 expect(screen.getByRole("button",{name:/Save this idea|Remove saved idea/})).toBeTruthy();
 const saved = JSON.parse(localStorage.getItem("cornerstone-learning-v1")!);
 expect(saved.completed).toEqual([id]);
 expect(saved.events.filter((event:{kind:string})=>event.kind === "lesson")).toHaveLength(1);
 expect(screen.getByRole("img",{name:"Your foundation: 1 of 8 cornerstones laid"})).toBeTruthy();
 view.unmount(); render(ui);
 expect(screen.getByRole("button",{name:"Review this lesson"})).toBeTruthy();
 expect(screen.queryByRole("heading",{name:"+20 XP · One cornerstone earned"})).toBeNull();
 expect(screen.getByRole("heading",{name:"Knowledge worth revisiting"})).toBeTruthy();
 expect(document.querySelector('[data-incoming="true"]')).toBeNull();
 expect(JSON.parse(localStorage.getItem("cornerstone-learning-v1")!).events).toEqual(saved.events);
});
