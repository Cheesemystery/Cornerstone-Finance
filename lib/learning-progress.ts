import { array, boolean, enum as enumSchema, type infer as Infer, iso, literal, number, object, record, string, union } from "zod";
import { lessons } from "./lessons";

const eventSchema = object({
  id: string(),
  kind: enumSchema(["lesson", "review", "reflection"]),
  target: string(),
  day: iso.date(),
  at: iso.datetime(),
});
export const learningSchema = object({
  version: literal(1).default(1),
  onboarded: boolean().default(false),
  timezone: string()
    .refine((value) => {
      try {
        new Intl.DateTimeFormat("en", { timeZone: value });
        return true;
      } catch {
        return false;
      }
    })
    .default("America/Chicago"),
  dailyGoal: union([literal(1), literal(2)]).default(1),
  showStreak: boolean().default(false),
  reducedMotion: boolean().default(false),
  completed: array(string()).default([]),
  steps: record(string(), number().int().min(0).max(6)).default({}),
  missed: record(string(), number().int().nonnegative()).default({}),
  events: array(eventSchema).default([]),
});
export type LearningState = Infer<typeof learningSchema>;
export type LearningEvent = Infer<typeof eventSchema>;
export const emptyLearning = learningSchema.parse({});
const ids = new Set<string>(lessons.map((lesson) => lesson.id));
export function migrateLearning(
  raw: unknown,
  legacy: unknown = {},
  timezone = "America/Chicago",
): LearningState {
  const parsed = learningSchema.safeParse(raw);
  if (parsed.success)
    return {
      ...parsed.data,
      completed: [
        ...new Set(parsed.data.completed.filter((id) => ids.has(id))),
      ],
      events: [
        ...new Map(
          parsed.data.events.map((event) => [event.id, event]),
        ).values(),
      ],
    };
  const old = object({ completed: array(string()).optional() })
    .safeParse(legacy);
  return learningSchema.parse({
    timezone,
    completed: old.success
      ? [...new Set((old.data.completed ?? []).filter((id) => ids.has(id)))]
      : [],
  });
}
export function dayKey(now: Date, timezone: string) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}
const dayNumber = (day: string) =>
  Math.floor(Date.parse(`${day}T12:00:00Z`) / 86400000);
export function recordActivity(
  state: LearningState,
  kind: LearningEvent["kind"],
  target: string,
  now = new Date(),
): LearningState {
  const day = dayKey(now, state.timezone);
  const secondReview = kind === "review" && target === "daily-2" && state.dailyGoal === 2 && state.events.some(event => event.id === `review:${day}`);
  const id = kind === "review" ? `review:${day}${secondReview ? ":2" : ""}` : `${kind}:${target}`;
  if (
    state.events.some((event) => event.id === id) ||
    (kind === "lesson" && state.completed.includes(target))
  )
    return state;
  if (kind === "lesson" && !ids.has(target)) return state;
  return {
    ...state,
    completed:
      kind === "lesson"
        ? [...new Set([...state.completed, target])]
        : state.completed,
    steps: kind === "lesson" ? { ...state.steps, [target]: 6 } : state.steps,
    events: [...state.events, { id, kind, target, day, at: now.toISOString() }],
  };
}
export function learningStats(state: LearningState, now: Date) {
  const today = dayKey(now, state.timezone);
  const learningEvents = state.events.filter(
    (event) => event.kind !== "reflection",
  );
  const days = [...new Set(learningEvents.map((event) => event.day))].sort();
  const todayActivities = learningEvents.filter(
    (event) => event.day === today,
  ).length;
  // A missing day is bridged only once per rolling seven days. No points are ever removed.
  let run = 0,
    best = 0,
    previous = -Infinity,
    lastGrace = -Infinity;
  for (const day of days) {
    const current = dayNumber(day),
      gap = current - previous;
    if (gap === 1) run += 1;
    else if (gap === 2 && current - 1 - lastGrace >= 7) {
      run += 1;
      lastGrace = current - 1;
    } else {
      run = 1;
    }
    previous = current;
    best = Math.max(best, run);
  }
  const gap = dayNumber(today) - previous;
  const streak =
    gap <= 1 || (gap === 2 && dayNumber(today) - 1 - lastGrace >= 7) ? run : 0;
  const weekday = new Date(`${today}T12:00:00Z`).getUTCDay();
  const monday = dayNumber(today) - ((weekday + 6) % 7);
  const weekDays = days.filter(
    (day) => dayNumber(day) >= monday && dayNumber(day) <= dayNumber(today),
  ).length;
  const xp =
    state.completed.length * 20 +
    new Set(state.events.filter((event) => event.kind === "review").map(event => event.day)).size * 5;
  const achievements = [
    {
      id: "first",
      title: "First small step",
      description: "Complete your first lesson",
      earned: state.completed.length >= 1,
    },
    {
      id: "three",
      title: "Making connections",
      description: "Complete three lessons",
      earned: state.completed.length >= 3,
    },
    {
      id: "foundation",
      title: "Foundation builder",
      description: "Complete the learning path",
      earned: state.completed.length >= lessons.length,
    },
    {
      id: "practice",
      title: "Thoughtful explorer",
      description: "Reflect on a practice week",
      earned: state.events.some((event) => event.kind === "reflection"),
    },
    {
      id: "seven",
      title: "Seven days wiser",
      description: "Learn on seven different days",
      earned: days.length >= 7,
    },
  ];
  return {
    today,
    todayActivities,
    goalMet: todayActivities >= state.dailyGoal,
    weekDays,
    days,
    xp,
    streak,
    best,
    achievements,
  };
}
export function nextLesson(state: LearningState) {
  return (
    lessons.find(
      (lesson) =>
        !state.completed.includes(lesson.id) &&
        (state.steps[lesson.id] ?? 0) > 0,
    ) ?? lessons.find((lesson) => !state.completed.includes(lesson.id))
  );
}
export function reviewLessons(state: LearningState, now: Date) {
  const completed = lessons.filter((lesson) =>
    state.completed.includes(lesson.id),
  );
  const rotation = dayNumber(dayKey(now, state.timezone));
  return completed
    .map((lesson, index) => ({
      lesson,
      priority: state.missed[lesson.id] ?? 0,
      order: (index + rotation) % Math.max(1, completed.length),
    }))
    .sort((a, b) => b.priority - a.priority || a.order - b.order)
    .slice(0, 3)
    .map((item) => item.lesson);
}


