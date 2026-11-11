import {expect,it} from "vitest";
import {lessons} from "./lessons";
import {emptyLearning,recordActivity} from "./learning-progress";
import {prepareFinalLessonDemo} from "./final-lesson-demo";
import {mergeGuestLearning} from "./guest-learning";
it("prepares seven earned lessons, clears the final quiz and awards exactly one eighth stone",()=>{
 let state={...emptyLearning};
 for(const lesson of lessons)state=recordActivity(state,"lesson",lesson.id);
 const last=lessons[7].id;
 state={...state,quizzes:{[last]:{version:1,passed:3}},missed:{[last]:2},steps:{...state.steps,[last]:6}};
 const reset=prepareFinalLessonDemo(state);
 expect(reset.completed).toEqual(lessons.slice(0,7).map(l=>l.id));
 expect(reset.quizzes[last]).toBeUndefined();expect(reset.steps[last]).toBeUndefined();
 expect(reset.events.some(e=>e.kind==="lesson"&&e.target===last)).toBe(false);
 expect(reset.events).toEqual(state.events.filter(e=>e.target!==last));
 expect(mergeGuestLearning(reset,state)).toEqual(reset);
 const finished=recordActivity(reset,"lesson",last);
 expect(finished.completed).toHaveLength(8);
 expect(recordActivity(finished,"lesson",last)).toEqual(finished);
 expect(prepareFinalLessonDemo(finished).completed).toHaveLength(7);
});
it("keeps preferences and does not invent dated activity when preparing a fresh demo",()=>{
 const reset=prepareFinalLessonDemo({...emptyLearning,reducedMotion:true,timezone:"America/New_York"});
 expect(reset.completed).toHaveLength(7);expect(reset.events).toEqual([]);
 expect(reset.reducedMotion).toBe(true);expect(reset.timezone).toBe("America/New_York");
});
