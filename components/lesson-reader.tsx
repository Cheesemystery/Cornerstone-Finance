"use client";
import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import { lessons } from "@/lib/lessons";
import { lessonActivities, quizFeedback } from "@/lib/lesson-activities";
import { useMvp } from "./mvp-provider";
import { useDemo } from "./demo-provider";
import { LessonVisual } from "./lesson-visual";
import { ChoiceQuestion, LessonInteraction } from "./lesson-interaction";
import { LessonBuildingCompletion } from "./learning-building";

const subscribeHash = (notify: () => void) => {
  window.addEventListener("hashchange", notify);
  return () => window.removeEventListener("hashchange", notify);
};
export function LessonReader({ id, weekly = false }: { id: string; weekly?: boolean }) {
  const lesson = lessons.find((item) => item.id === id)!;
  const activity = lessonActivities[id];
  const { finishWeek } = useDemo();
  const { learning, updateLearning, complete, now } = useMvp();
  const [step, setStep] = useState<number | null>(null);
  const [ready, setReady] = useState(false);
  const [newCompletion, setNewCompletion] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const hash = useSyncExternalStore(
    subscribeHash,
    () => window.location.hash,
    () => "",
  );
  const current =
    step ??
    (id === "fees-and-time" && hash === "#calculator"
      ? 1
      : learning.completed.includes(id)
        ? 0
        : Math.min(learning.steps[id] ?? 0, 4));
  useEffect(() => {
    if (step !== null && step !== 4) {
      heading.current?.focus({ preventScroll: true });
      heading.current?.scrollIntoView({ block: "start" });
    }
  }, [step]);
  function go(value: number) {
    setStep(value);
    setReady(false);
    updateLearning((state) => ({
      ...state,
      steps: { ...state.steps, [id]: Math.max(state.steps[id] ?? 0, value) },
    }));
    if (value === 4) { setNewCompletion(!learning.completed.includes(id)); complete("lesson", id); if (weekly) finishWeek(id); }
  }
  function miss() {
    updateLearning((state) => ({
      ...state,
      missed: { ...state.missed, [id]: (state.missed[id] ?? 0) + 1 },
    }));
  }
  return (
    <article className="interactive-lesson">
      <div className="player-top">
        <Link className="demo-link" href="/learn">
          <ArrowLeft size={17} /> Learning path
        </Link>
        <span>
          {lesson.minutes} min ·{" "}
          {current === 4 ? "Complete" : String(current + 1) + " of 4"}
        </span>
      </div>
      <progress
        className="lesson-progress"
        max={4}
        value={current}
        aria-label="Lesson progress"
      />
      <header className="player-heading">
        <p className="eyebrow">{lesson.tag}</p>
        <h1 ref={heading} tabIndex={-1}>
          {current === 4 ? "One more idea, understood." : lesson.title}
        </h1>
      </header>
      <section className="player-card" key={current}>
        {current === 0 && (
          <>
            <LessonVisual scene={activity.scene} />
            <h2>{activity.hook}</h2>
            <p className="lesson-story">{activity.story}</p>
            <button
              className="button primary"
              disabled={!now}
              onClick={() => go(1)}
            >
              Let’s try it <ArrowRight size={18} />
            </button>
          </>
        )}
        {current === 1 && (
          <>
            <LessonInteraction
              activity={activity}
              onReady={() => setReady(true)}
              onMiss={miss}
            />
            {ready && (
              <button
                className="button lime player-continue"
                onClick={() => go(2)}
              >
                Continue <ArrowRight size={18} />
              </button>
            )}
          </>
        )}
        {current === 2 && (
          <>
            <div className="idea-icon">
              <Sparkles size={30} />
            </div>
            <p className="eyebrow">Connect the dots</p>
            <h2>{lesson.sections[2].title}</h2>
            <p className="lesson-story">{lesson.sections[2].body}</p>
            <aside className="gentle-note">{activity.explanation}</aside>
            <button className="button primary" onClick={() => go(3)}>
              Try one quick check <ArrowRight size={18} />
            </button>
          </>
        )}
        {current === 3 && (
          <>
            <ChoiceQuestion
              feedback={quizFeedback[id]}
              question={lesson.question}
              options={lesson.options}
              correct={lesson.correct}
              explanation={lesson.explanation}
              onReady={() => setReady(true)}
              onMiss={miss}
            />
            {ready && (
              <button
                className="button lime player-continue"
                onClick={() => go(4)}
              >
                Keep this idea <CheckCircle2 size={18} />
              </button>
            )}
          </>
        )}
        {current === 4 && <LessonBuildingCompletion completed={learning.completed} newCompletion={newCompletion} reducedMotion={learning.reducedMotion} />}
      </section>
      <footer className="player-source">
        <a href={lesson.source} target="_blank" rel="noreferrer">
          Source: {lesson.sourceLabel}{" "}
          <span className="sr-only">(opens in a new tab)</span> ↗
        </a>
        <span>Examples are fictional. Learning is yours.</span>
      </footer>
    </article>
  );
}
