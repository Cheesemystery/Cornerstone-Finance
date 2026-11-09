import { z } from "zod";
import { learningSchema, migrateLearning, type LearningState } from "./learning-progress";
export const accountSnapshotSchema = z.object({userId:z.string().uuid(),revision:z.number().int().nonnegative(),state:learningSchema});
export type AccountSnapshot = z.infer<typeof accountSnapshotSchema>;
// Monotone learning receipts merge without adding dates to legacy completions.
// The server's existing lesson event wins, preserving its original earned date.
export function mergeLearning(existing: LearningState, incoming: LearningState): LearningState {
 const events = new Map(existing.events.map(e => [e.id,e]));
 for (const event of incoming.events) if (!events.has(event.id) && !(event.kind === "lesson" && existing.completed.includes(event.target))) events.set(event.id,event);
 const steps = {...existing.steps}; const missed = {...existing.missed}; const quizzes = {...existing.quizzes};
 for (const [id,step] of Object.entries(incoming.steps)) steps[id] = Math.max(steps[id] ?? 0,step);
 for (const [id,count] of Object.entries(incoming.missed)) missed[id] = Math.max(missed[id] ?? 0,count);
 for (const [id,quiz] of Object.entries(incoming.quizzes)) quizzes[id] = {version:1,passed:Math.max(quizzes[id]?.passed ?? 0,quiz.passed)};
 return migrateLearning({...incoming,onboarded:existing.onboarded || incoming.onboarded,completed:[...existing.completed,...incoming.completed],events:[...events.values()],steps,missed,quizzes});
}
export function learningImport(guest: LearningState, account: LearningState) {
 // Import learning only. Keep the account's preferences and timezone.
 return mergeLearning(account, {...guest,timezone:account.timezone,dailyGoal:account.dailyGoal,showStreak:account.showStreak,reducedMotion:account.reducedMotion});
}
