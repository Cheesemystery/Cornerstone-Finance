import { describe, it, expect } from "vitest";
import { lessonQuiz, ownershipQuiz, quizPassed } from "./lesson-quiz";
import { learningSchema, migrateLearning, recordActivity } from "./learning-progress";
import { lessons } from "./lessons";
import { laidBrickCount } from "./building";
describe("Phase 1 ownership quiz", () => {
 it("requires three checks and preserves checked progress through serialization", () => {
  expect(ownershipQuiz).toHaveLength(3);
  for (const passed of [0, 1, 2]) {
   const state = learningSchema.parse({quizzes:{"what-you-own":{version:1,passed}}});
   const resumed = migrateLearning(JSON.parse(JSON.stringify(state)));
   expect(resumed.quizzes["what-you-own"].passed).toBe(passed);
   expect(quizPassed(passed)).toBe(false);
  }
  expect(quizPassed(3)).toBe(true);
 });
 it("preserves legacy completion and awards exactly one dated brick on repeat", () => {
  const before = learningSchema.parse({});
  const once = recordActivity(before, "lesson", "what-you-own", new Date("2026-11-07T12:00:00Z"));
  const twice = recordActivity(migrateLearning(JSON.parse(JSON.stringify(once))), "lesson", "what-you-own");
  expect(twice.completed).toEqual(["what-you-own"]);
  expect(twice.events).toEqual(once.events);
  expect(laidBrickCount(twice.completed)).toBe(1);
  const legacy = migrateLearning({completed:["what-you-own"]});
  expect(legacy.completed).toEqual(["what-you-own"]);
  expect(legacy.events).toEqual([]);
 });
});


it("keeps complete quizzes and catalog-sized unique lifetime bricks across repeats", () => {
 let state = learningSchema.parse({});
 for (const lesson of lessons) {
  const questions = lessonQuiz(lesson.id);
  expect(questions).toHaveLength(3);
  expect(new Set(questions.map(q => q.id)).size).toBe(3);
  expect(questions[0].question).toBe(lesson.question);
  for (const q of questions) expect(q.options[q.correct]).toBeTruthy();
  state = recordActivity(state,"lesson",lesson.id);
 }
 const original = state;
 for (const lesson of lessons) state = recordActivity(state,"lesson",lesson.id);
 expect(state).toEqual(original);
 expect(laidBrickCount(state.completed)).toBe(lessons.length);
 expect(state.events).toHaveLength(lessons.length);
});
