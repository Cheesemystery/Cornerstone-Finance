// @vitest-environment jsdom
import {cleanup,fireEvent,render,screen} from "@testing-library/react";
import {afterEach,expect,it,vi} from "vitest";
import {MvpProvider} from "./mvp-provider";
import {FinalLessonDemoReset} from "./final-lesson-demo-reset";
import {emptyLearning} from "@/lib/learning-progress";
import {lessons} from "@/lib/lessons";
const push=vi.fn();
vi.mock("next/navigation",()=>({useRouter:()=>({push})}));
afterEach(()=>{cleanup();localStorage.clear();vi.restoreAllMocks();});
it("preserves saved field notes and unrelated data while preparing the final lesson",()=>{
 localStorage.setItem("cornerstone-learning-v1",JSON.stringify({...emptyLearning,completed:lessons.map(l=>l.id),steps:{inflation:6},quizzes:{inflation:{version:1,passed:3}}}));
 localStorage.setItem("cornerstone-ideas-v1:guest:0",JSON.stringify(["what-you-own","inflation"]));
 localStorage.setItem("cornerstone-holdings-v1",'untouched');
 render(<MvpProvider><FinalLessonDemoReset/></MvpProvider>);
 fireEvent.click(screen.getByRole("button",{name:"Replay final lesson"}));
 const state=JSON.parse(localStorage.getItem("cornerstone-learning-v1")!);
 expect(state.completed).toHaveLength(7);expect(state.completed).not.toContain("inflation");
 expect(state.quizzes.inflation).toBeUndefined();
 expect(JSON.parse(localStorage.getItem(`cornerstone-ideas-v1:guest:${state.resetGeneration}`)!)).toEqual(["what-you-own","inflation"]);
 expect(localStorage.getItem("cornerstone-holdings-v1")).toBe('untouched');
 expect(JSON.parse(localStorage.getItem("cornerstone-wall-seen-v1")!)).toEqual(state.completed);
 expect(push).toHaveBeenCalledWith("/learn/inflation");
});
