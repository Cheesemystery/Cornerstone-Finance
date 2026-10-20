"use client";
import Link from "next/link";
import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { quizFeedback } from "@/lib/lesson-activities";
import { reviewLessons, dayKey } from "@/lib/learning-progress";
import { useMvp } from "./mvp-provider";
import { ChoiceQuestion } from "./lesson-interaction";
export function DailyReview() {
  const { now } = useMvp();
  return now ? <ReviewSession /> : <p role="status">Preparing your review…</p>;
}
function ReviewSession() {
  const { learning, now, complete, updateLearning } = useMvp();
  const [index, setIndex] = useState(0),
    [ready, setReady] = useState(false),
    [finished, setFinished] = useState(false);
  const [queue] = useState(() => reviewLessons(learning, now ?? new Date()));
  const [reviewTarget] = useState(() => learning.dailyGoal === 2 && learning.events.some(event => event.id === "review:" + dayKey(now ?? new Date(), learning.timezone)) ? "daily-2" : "daily");
  if (!now) return <p role="status">Preparing your review…</p>;
  if (!queue.length)
    return (
      <section className="mvp-card">
        <h2>Your first idea is waiting.</h2>
        <p>Complete a lesson, then come back for a short review.</p>
        <Link className="button primary" href="/learn">
          Explore the path
        </Link>
      </section>
    );
  const lesson = queue[index];
  return (
    <section className="player-card review-card">
      {finished ? (
        <>
          <CheckCircle2 size={42} />
          <h2>A little more familiar.</h2>
          <p>
            Your first review each day earns 5 XP. You can always practice
            again.
          </p>
          <Link className="button primary" href="/">
            Back to Home
          </Link>
        </>
      ) : (
        <>
          <p className="eyebrow">
            Recall {index + 1} of {queue.length}
          </p>
          <ChoiceQuestion
            key={lesson.id}
            feedback={quizFeedback[lesson.id]}
            question={lesson.question}
            options={lesson.options}
            correct={lesson.correct}
            explanation={lesson.explanation}
            onReady={() => {
              setReady(true);
              updateLearning((state) => ({
                ...state,
                missed: {
                  ...state.missed,
                  [lesson.id]: Math.max(0, (state.missed[lesson.id] ?? 0) - 1),
                },
              }));
            }}
            onMiss={() =>
              updateLearning((state) => ({
                ...state,
                missed: {
                  ...state.missed,
                  [lesson.id]: (state.missed[lesson.id] ?? 0) + 1,
                },
              }))
            }
          />
          {ready && (
            <button
              className="button lime player-continue"
              onClick={() => {
                if (index === queue.length - 1) {
                  complete("review", reviewTarget);
                  setFinished(true);
                } else {
                  setIndex(index + 1);
                  setReady(false);
                }
              }}
            >
              {index === queue.length - 1 ? "Finish review" : "Next idea"}
            </button>
          )}
        </>
      )}
    </section>
  );
}
