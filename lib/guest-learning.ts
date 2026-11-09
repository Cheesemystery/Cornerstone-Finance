import { emptyLearning, learningSchema, migrateLearning, type LearningState } from "./learning-progress";
import { mergeLearning } from "./learning-account-state";
// A reset generation is a deletion receipt, never an earned-progress total.
export function mergeGuestLearning(known:LearningState,incoming:LearningState):LearningState {
 if(incoming.resetGeneration !== known.resetGeneration) return incoming.resetGeneration > known.resetGeneration ? incoming : known;
 return mergeLearning(known,incoming);
}
export function recoverGuestLearning(raw:unknown,known:LearningState):LearningState {
 const fields:Record<string,unknown>={...emptyLearning};
 if(!raw || typeof raw!=="object" || Array.isArray(raw)) return known;
 const source=raw as Record<string,unknown>;
 for(const [key,schema] of Object.entries(learningSchema.shape)) {
  const parsed=schema.safeParse(source[key]);
  if(parsed.success)fields[key]=parsed.data;
 }
 if(Array.isArray(source.completed))fields.completed=source.completed.filter(id=>typeof id === "string");
 if(Array.isArray(source.events))fields.events=source.events.filter(event=>learningSchema.shape.events.safeParse([event]).success);
 for(const key of ["steps","quizzes","missed"] as const) {
  const entries=source[key];
  if(entries && typeof entries === "object" && !Array.isArray(entries)) {
   fields[key]=Object.fromEntries(Object.entries(entries).filter(([id,value])=>learningSchema.shape[key].safeParse({[id]:value}).success));
  }
 }
 return mergeGuestLearning(known,migrateLearning(learningSchema.parse(fields)));
}
