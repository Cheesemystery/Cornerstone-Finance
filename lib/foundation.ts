import { lessons } from "./lessons";
/** Completion order keeps every laid stone in place when another lesson is earned. */
export function foundationLessons(completed: readonly string[]) {
 const earned = [...new Set(completed)].flatMap(id => { const lesson=lessons.find(item=>item.id===id);return lesson?[lesson]:[]; });
 return {earned, ordered:[...earned,...lessons.filter(lesson=>!earned.some(item=>item.id===lesson.id))]};
}
