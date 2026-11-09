// @vitest-environment jsdom
import {cleanup,fireEvent,render,screen} from "@testing-library/react";
import {afterEach,expect,it,vi} from "vitest";
import {DemoProvider} from "./demo-provider";
import {MvpProvider} from "./mvp-provider";
import {LessonReader} from "./lesson-reader";
import {LearningSummary} from "./learning-summary";
import {lessons} from "@/lib/lessons";
import {lessonActivities} from "@/lib/lesson-activities";
import {lessonQuiz} from "@/lib/lesson-quiz";
import {emptyLearning} from "@/lib/learning-progress";
afterEach(()=>{cleanup();localStorage.clear();vi.unstubAllGlobals();});
function activity(id:string) {
 const model=lessonActivities[id];
 if(model.kind==="match") {
  fireEvent.change(screen.getByLabelText("A small ownership share of the café"),{target:{value:"stock"}});
  fireEvent.change(screen.getByLabelText("A loan to the café with payment terms"),{target:{value:"bond"}});
  fireEvent.change(screen.getByLabelText("A basket holding several investments"),{target:{value:"fund"}});
  fireEvent.click(screen.getByRole("button",{name:"Check my matches"}));
 } else if(model.kind==="choice") {
  fireEvent.click(screen.getByLabelText(model.options![model.correct!]));
  fireEvent.click(screen.getByRole("button",{name:"Check answer"}));
 } else if(model.kind==="allocate") {
  fireEvent.click(screen.getByRole("button",{name:"Move one to broad"}));
  fireEvent.click(screen.getByRole("button",{name:"Explore this mix"}));
 } else if(model.kind==="fees") {
  fireEvent.click(screen.getByLabelText("The one with lower ongoing fees."));
  fireEvent.click(screen.getByRole("button",{name:"Check answer"}));
  fireEvent.change(screen.getByRole("slider",{name:/Annual fee/}),{target:{value:"1"}});
  fireEvent.click(screen.getByRole("button",{name:"I explored the difference"}));
 } else {
  fireEvent.click(screen.getByRole("button",{name:"Move Consider how it fits your needs and existing mix down"}));
  fireEvent.click(screen.getByRole("button",{name:"Move Consider how it fits your needs and existing mix down"}));
  fireEvent.click(screen.getByRole("button",{name:"Check this order"}));
 }
 fireEvent.click(screen.getByRole("button",{name:"Continue"}));
 fireEvent.click(screen.getByRole("button",{name:"Try three quick checks"}));
}
it("walks all six real activities and quizzes, restores the final review state and never adds a seventh brick",()=>{
 vi.stubGlobal("matchMedia",vi.fn(()=>({matches:true,addEventListener:vi.fn(),removeEventListener:vi.fn()})));
 Object.defineProperty(Element.prototype,"scrollIntoView",{configurable:true,value:vi.fn()});
 localStorage.setItem("cornerstone-learning-v1",JSON.stringify(emptyLearning));
 const ui=(id:string)=><DemoProvider><MvpProvider><LessonReader id={id}/></MvpProvider></DemoProvider>;
 const view=render(ui(lessons[0].id));
 for (const [index,lesson] of lessons.entries()) {
  if(index)view.rerender(ui(lesson.id));
  fireEvent.click(screen.getByRole("button",{name:"Let’s try it"}));
  activity(lesson.id);
  for(const q of lessonQuiz(lesson.id)) {
   fireEvent.click(screen.getByLabelText(q.options[q.correct]));
   fireEvent.click(screen.getByRole("button",{name:"Check answer"}));
   fireEvent.click(screen.getByRole("button",{name:"Continue"}));
  }
  fireEvent.click(screen.getByRole("button",{name:"Keep this idea"}));
  expect(screen.getByRole("img",{name:`Your building: ${index+1} of 24 bricks laid`})).toBeTruthy();
  const saved=JSON.parse(localStorage.getItem("cornerstone-learning-v1")!);
  expect(saved.completed).toHaveLength(index+1);expect(saved.events).toHaveLength(index+1);
  expect(screen.getByRole("link",{name:lessons[index+1]?.title ?? "Review lessons"})).toBeTruthy();
 }
 fireEvent.click(screen.getByRole("button",{name:"Review this lesson"}));
 fireEvent.click(screen.getByRole("button",{name:"Let’s try it"}));
 activity("research-checklist");
 fireEvent.click(screen.getByRole("button",{name:"Keep this idea"}));
 expect(JSON.parse(localStorage.getItem("cornerstone-learning-v1")!).events).toHaveLength(6);
 view.unmount();
 render(<MvpProvider><LearningSummary/></MvpProvider>);
 expect(screen.getByRole("link",{name:"Review lessons"}).getAttribute("href")).toBe("/learn");
 expect(screen.getByRole("region",{name:"Learning progress"}).textContent).toContain("6 of 6 lessons completed · 6 earned bricks");
});
