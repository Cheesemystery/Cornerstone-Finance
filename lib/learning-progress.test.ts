import { describe, expect, it } from "vitest";
import {
  dayKey,
  emptyLearning,
  learningStats,
  migrateLearning,
  nextLesson,
  recordActivity,
  reviewLessons,
} from "./learning-progress";
import { lessons } from "./lessons";
const date = (day: string) => new Date(day + "T18:00:00Z");
describe("learning progress and gentle rewards", () => {
  it("migrates valid legacy completions without fabricated dates", () => {
    const state = migrateLearning(undefined, {
      completed: [lessons[0].id, "unknown"],
    });
    expect(state.completed).toEqual([lessons[0].id]);
    expect(state.events).toEqual([]);
    expect(learningStats(state, date("2026-10-12")).xp).toBe(20);
  });
  it("resumes unfinished lessons before the next untouched lesson", () =>
    expect(
      nextLesson({ ...emptyLearning, steps: { [lessons[2].id]: 2 } })?.id,
    ).toBe(lessons[2].id));
  it("awards first completions and daily reviews exactly once", () => {
    let s = recordActivity(
      emptyLearning,
      "lesson",
      lessons[0].id,
      date("2026-10-12"),
    );
    expect(recordActivity(s, "lesson", lessons[0].id, date("2026-10-13"))).toBe(
      s,
    );
    s = recordActivity(s, "review", "daily", date("2026-10-12"));
    expect(recordActivity(s, "review", "another", date("2026-10-12"))).toBe(s);
    expect(learningStats(s, date("2026-10-12")).xp).toBe(25);
  });
  it("uses saved timezone across midnight and daylight saving transitions", () => {
    expect(dayKey(new Date("2026-10-13T04:59:00Z"), "America/Chicago")).toBe(
      "2026-10-12",
    );
    expect(dayKey(new Date("2026-10-13T05:00:00Z"), "America/Chicago")).toBe(
      "2026-10-13",
    );
    expect(dayKey(new Date("2026-11-01T07:30:00Z"), "America/Chicago")).toBe(
      "2026-11-01",
    );
  });
  it("bridges one grace day per seven days and preserves best after a gap", () => {
    let s = emptyLearning;
    for (const day of ["2026-10-01", "2026-10-03", "2026-10-04", "2026-10-06"])
      s = recordActivity(s, "review", "daily", date(day));
    const stats = learningStats(s, date("2026-10-10"));
    expect(stats.streak).toBe(0);
    expect(stats.best).toBe(3);
    expect(stats.xp).toBe(20);
  });
  it("preserves achievements and does not reward trading performance", () => {
    const s = recordActivity(
      emptyLearning,
      "reflection",
      "run:1",
      date("2026-10-12"),
    );
    expect(
      learningStats(s, date("2026-10-12")).achievements.find(
        (a) => a.id === "practice",
      )?.earned,
    ).toBe(true);
    expect(learningStats(s, date("2026-10-12")).xp).toBe(0);
  });
  it("prioritizes missed concepts in reviews and caps the queue at three", () => {
    const s = {
      ...emptyLearning,
      completed: lessons.map((l) => l.id),
      missed: { [lessons[5].id]: 4 },
    };
    const queue = reviewLessons(s, date("2026-10-12"));
    expect(queue).toHaveLength(3);
    expect(queue[0].id).toBe(lessons[5].id);
  });
  it("recovers corrupt learning data and ignores unknown lessons", () => {
    expect(migrateLearning({ version: 99 })).toEqual(emptyLearning);
    expect(recordActivity(emptyLearning, "lesson", "invented")).toBe(
      emptyLearning,
    );
  });
});

it("allows a second daily goal review without extra XP",()=>{
 let state={...emptyLearning,dailyGoal:2 as const};
 state=recordActivity(state,"review","daily",date("2026-10-12")) as typeof state;
 state=recordActivity(state,"review","daily-2",date("2026-10-12")) as typeof state;
 expect(learningStats(state,date("2026-10-12")).goalMet).toBe(true);
 expect(learningStats(state,date("2026-10-12")).xp).toBe(5);
 expect(recordActivity(state,"review","daily-2",date("2026-10-12"))).toBe(state);
});
