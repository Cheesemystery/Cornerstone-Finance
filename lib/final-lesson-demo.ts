import { lessons } from "./lessons";
import type { LearningState } from "./learning-progress";

// Explicit presentation fixture. Existing dates are kept; seeded lessons stay undated.
export function prepareFinalLessonDemo(state: LearningState): LearningState {
 const finalId = lessons[lessons.length - 1].id;
 const steps = {...state.steps};
 const quizzes = {...state.quizzes};
 const missed = {...state.missed};
 delete steps[finalId]; delete quizzes[finalId]; delete missed[finalId];
 return {...state, resetGeneration:state.resetGeneration+1,
  completed:lessons.slice(0,-1).map(lesson=>lesson.id), steps, quizzes, missed,
  events:state.events.filter(event=>!(event.kind==="lesson"&&event.target===finalId))};
}
