// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { DemoProvider } from "./demo-provider";
import { MvpProvider, useMvp } from "./mvp-provider";
import { LessonReader } from "./lesson-reader";
import { LearningSummary } from "./learning-summary";
import { emptyLearning } from "@/lib/learning-progress";

const key = "cornerstone-learning-v1";
function SaveFixture() {
  const { updateLearning } = useMvp();
  return <button onClick={() => updateLearning(state => state)}>Retry fixture save</button>;
}
function Journey() {
  return <DemoProvider><MvpProvider><SaveFixture/><LessonReader id="what-you-own"/><LearningSummary/></MvpProvider></DemoProvider>;
}
beforeEach(() => {
  vi.stubGlobal("matchMedia", vi.fn(() => ({ matches:true, addEventListener:vi.fn(), removeEventListener:vi.fn() })));
  Object.defineProperty(Element.prototype,"scrollIntoView",{ configurable:true, value:vi.fn() });
  localStorage.setItem(key,JSON.stringify({...emptyLearning,steps:{"what-you-own":3},quizzes:{"what-you-own":{version:1,passed:2}}}));
});
afterEach(() => { cleanup(); vi.restoreAllMocks(); localStorage.clear(); vi.unstubAllGlobals(); });

it.each(["blocked","full"])("keeps a completed lesson and matching Recap usable when storage is %s, then persists it once storage works", failure => {
  const view=render(<Journey/>);
  expect(screen.getByRole("heading",{name:"Question 3 of 3"})).toBeTruthy();
  const originalGet=Storage.prototype.getItem, originalSet=Storage.prototype.setItem;
  vi.spyOn(Storage.prototype,"setItem").mockImplementation(function(this:Storage,name,value) {
    if(name===key) throw new DOMException("Synthetic storage failure",failure==="full"?"QuotaExceededError":"SecurityError");
    return originalSet.call(this,name,value);
  });
  if(failure==="blocked") vi.spyOn(Storage.prototype,"getItem").mockImplementation(function(this:Storage,name) {
    if(name===key) throw new DOMException("Synthetic blocked storage","SecurityError");
    return originalGet.call(this,name);
  });
  fireEvent.click(screen.getByLabelText("Lending money under payment terms, with risks"));
  fireEvent.click(screen.getByRole("button",{name:"Check answer"}));
  fireEvent.click(screen.getByRole("button",{name:"Continue"}));
  fireEvent.click(screen.getByRole("button",{name:"Finish lesson"}));
 if(screen.queryByRole("button",{name:"Stay with this lesson"}))fireEvent.click(screen.getByRole("button",{name:"Stay with this lesson"}));
  expect(screen.getByRole("img",{name:"Your foundation: 1 of 8 cornerstones laid"})).toBeTruthy();
  expect(screen.getByRole("region",{name:"Learning progress"}).textContent).toContain("1 of 8 lessons completed · 1 earned brick");
  expect(screen.getByText("Available for this session")).toBeTruthy();
  expect(screen.getByText(/Browser storage is unavailable/).textContent).toContain("may disappear when you close or reload");
  expect(screen.getByRole("link",{name:"Why did the price move?"})).toBeTruthy();

  vi.restoreAllMocks();
  fireEvent.click(screen.getByRole("button",{name:"Retry fixture save"}));
  const saved=JSON.parse(localStorage.getItem(key)!);
  expect(saved.completed).toEqual(["what-you-own"]);
  expect(saved.events).toHaveLength(1);
  expect(saved.quizzes["what-you-own"].passed).toBe(3);
  expect(screen.getByRole("region",{name:"Learning progress"}).querySelector("time")?.getAttribute("datetime")).toBe(saved.events[0].day);
  view.unmount();
  render(<Journey/>);
  expect(screen.getByRole("button",{name:"Review this lesson"})).toBeTruthy();
  expect(screen.getByRole("img",{name:"Your foundation: 1 of 8 cornerstones laid"})).toBeTruthy();
  expect(JSON.parse(localStorage.getItem(key)!).events).toEqual(saved.events);
});
