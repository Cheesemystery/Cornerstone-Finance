// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { emptyLearning } from "@/lib/learning-progress";
import { lessons } from "@/lib/lessons";
import { LearningLibrary } from "./learning-library";
let state={...emptyLearning};
vi.mock("./mvp-provider",()=>({useMvp:()=>({learning:state,now:new Date("2026-11-09T12:00:00Z"),account:{account:null}})}));
afterEach(()=>{cleanup();localStorage.clear();});
it.each([0,2,lessons.length])("renders %i real completions without invented blocks",count=>{
 state={...emptyLearning,completed:lessons.slice(0,count).map(l=>l.id)};
 const view=render(<LearningLibrary/>);
 expect(view.container.querySelectorAll('.foundation-stones button')).toHaveLength(lessons.length);
 expect(view.container.querySelectorAll('.foundation-stones button[data-earned="true"]')).toHaveLength(count);
 expect(screen.getByText(new RegExp(`${count} of ${lessons.length} lessons`))).toBeTruthy();
 if(count<lessons.length) expect(screen.getByRole("link",{name:count?`Continue Lesson ${count+1}`:"Start learning"}).getAttribute("href")).toBe(`/learn/${lessons[count].id}`);
 else expect(screen.getByRole("link",{name:"Review Your Foundation"}).getAttribute("href")).toBe("/learn/review");
});
it("prioritizes a resumed lesson and allows review through earned stones",()=>{
 state={...emptyLearning,completed:[lessons[0].id],steps:{[lessons[3].id]:2}};
 render(<LearningLibrary/>);
 expect(screen.getByRole("link",{name:"Continue Lesson 4"}).getAttribute("href")).toBe(`/learn/${lessons[3].id}`);
 fireEvent.click(screen.getByRole("button",{name:`${lessons[0].title} — earned`}));
 expect(screen.getByRole("link",{name:"Review this lesson"}).getAttribute("href")).toBe(`/learn/${lessons[0].id}`);
 expect(screen.getByRole("link",{name:"Continue Lesson 4"})).toBeTruthy();
});
