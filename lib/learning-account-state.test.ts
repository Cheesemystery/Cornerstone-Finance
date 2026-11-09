import { expect,it } from "vitest";
import { emptyLearning,recordActivity } from "./learning-progress";
import { learningImport,mergeLearning } from "./learning-account-state";
it("imports only learning, preserves account preferences and deduplicates genuine dates",()=>{
 const account=recordActivity({...emptyLearning,timezone:"UTC"},"lesson","what-you-own",new Date("2026-10-01T12:00:00Z"));
 const guest=recordActivity({...emptyLearning,quizzes:{"read-earnings":{version:1,passed:2}}},"lesson","what-you-own",new Date("2026-11-01T12:00:00Z"));
 const result=learningImport(guest,account);
 expect(result.completed).toEqual(["what-you-own"]);
 expect(result.events).toEqual(account.events);
 expect(result.timezone).toBe("UTC");
 expect(result.quizzes["read-earnings"].passed).toBe(2);
 expect(learningImport(guest,result)).toEqual(result);
 expect(Object.keys(result)).not.toContain("holdings");
});
it("merges concurrent distinct lessons and does not date a legacy completion",()=>{
 const legacy={...emptyLearning,completed:["what-you-own"]};
 const incoming=recordActivity(recordActivity(emptyLearning,"lesson","what-you-own"),"lesson","read-earnings");
 const merged=mergeLearning(legacy,incoming);
 expect(merged.completed).toEqual(["what-you-own","read-earnings"]);
 expect(merged.events.map(e=>e.target)).toEqual(["read-earnings"]);
 expect(mergeLearning(merged,incoming)).toEqual(merged);
});
