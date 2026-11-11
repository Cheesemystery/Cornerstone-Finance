// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { MvpProvider } from "./mvp-provider";
import { OwnershipQuiz } from "./ownership-quiz";
import { emptyLearning } from "@/lib/learning-progress";
import { lessons } from "@/lib/lessons";
import { lessonQuiz } from "@/lib/lesson-quiz";
afterEach(() => {cleanup(); localStorage.clear();});
it.each(lessons)("$id gates completion and resumes checked answers", ({id}) => {
 const ownershipQuiz = lessonQuiz(id);
 localStorage.setItem("cornerstone-learning-v1",JSON.stringify(emptyLearning));
 const finish = vi.fn(); const miss = vi.fn();
 const ui = <MvpProvider><OwnershipQuiz id={id} onFinish={finish} onMiss={miss}/></MvpProvider>;
 const view = render(ui);
 fireEvent.click(screen.getByLabelText(ownershipQuiz[0].options[(ownershipQuiz[0].correct + 1) % 3]));
 fireEvent.click(screen.getByRole("button",{name:"Check answer"}));
 expect(miss).toHaveBeenCalledOnce();
 expect(screen.queryByRole("button",{name:"Finish lesson"})).toBeNull();
 fireEvent.click(screen.getByLabelText(ownershipQuiz[0].options[ownershipQuiz[0].correct]));
 fireEvent.click(screen.getByRole("button",{name:"Check answer"}));
 view.unmount();
 render(ui);
 expect(screen.getByRole("heading",{name:"Question 2 of 3"})).toBeTruthy();
 for (const q of ownershipQuiz.slice(1)) {
  fireEvent.click(screen.getByLabelText(q.options[q.correct]));
  fireEvent.click(screen.getByRole("button",{name:"Check answer"}));
  fireEvent.click(screen.getByRole("button",{name:"Continue"}));
 }
 fireEvent.click(screen.getByRole("button",{name:"Finish lesson"}));
 expect(finish).toHaveBeenCalledOnce();
 expect(JSON.parse(localStorage.getItem("cornerstone-learning-v1")!).quizzes[id]).toEqual({version:1,passed:3});
});
