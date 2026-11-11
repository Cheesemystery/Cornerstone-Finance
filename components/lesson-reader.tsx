"use client";
import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { LearningAccountControls } from "./learning-account-controls";
import { OwnershipQuiz } from "./ownership-quiz";
import { learningStats, nextLesson } from "@/lib/learning-progress";
import { quizPassed } from "@/lib/lesson-quiz";
import { lessons } from "@/lib/lessons";
import { lessonActivities } from "@/lib/lesson-activities";
import { useMvp } from "./mvp-provider";
import { useDemo } from "./demo-provider";
import { LessonVisual } from "./lesson-visual";
import { LessonInteraction } from "./lesson-interaction";
import { CornerstoneReward } from "./cornerstone-reward";

import { LessonCelebration } from "./lesson-celebration";
import { SavedIdeas } from "./saved-ideas";

const subscribeHash = (notify: () => void) => {
  window.addEventListener("hashchange", notify);
  return () => window.removeEventListener("hashchange", notify);
};
type LessonReaderProps = { id: string; weekly?: boolean };
export function LessonReader(props:LessonReaderProps) {
  const {learning,account}=useMvp();
  return <LessonSession key={`${props.id}:${props.weekly ? "weekly" : "lesson"}:${account.account?.userId ?? "guest"}:${learning.resetGeneration}`} {...props}/>;
}
function LessonSession({ id, weekly = false }:LessonReaderProps) {
  const lesson = lessons.find((item) => item.id === id)!;
  const activity = lessonActivities[id];
  const { finishWeek } = useDemo();
  const { learning, updateLearning, complete, now, persistence, account } = useMvp();
  const [step, setStep] = useState<number | null>(null);
  const [ready, setReady] = useState(false);
  const [newCompletion, setNewCompletion] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const next = nextLesson(learning);
  const stats = learningStats(learning, now ?? new Date("2026-01-01T12:00:00Z"));
  const stages = ["Learn", "Apply", "Understand", "Answer", "Complete"];
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
        ? (weekly ? 0 : 4)
        : Math.min(learning.steps[id] ?? 0, 4));
  useEffect(() => {
    if (current === 4 || (step !== null && step !== 3)) {
      heading.current?.focus({ preventScroll: true });
      heading.current?.scrollIntoView({ block: "start" });
    }
  }, [step, current]);
  function go(value: number) {
    if (value === 4 && !quizPassed(learning.quizzes[id]?.passed ?? 0)) return;
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
      {account.account && <LearningAccountControls key={account.account.userId}/>}
      <div className="player-top">
        <Link className="demo-link" href="/learn">
          <ArrowLeft size={17} /> Learning path
        </Link>
        <span>
          {lesson.minutes} min ·{" "}
          {current === 4 ? "Complete" : stages[current]}
        </span>
      </div>
      <progress
        className="lesson-progress"
        max={4}
        value={current}
        aria-label="Lesson progress"
      />
      <ol className="lesson-stage-rail" aria-label="Lesson stages">{stages.map((label, index) => <li key={label} aria-current={current === index ? "step" : undefined} data-done={current > index}><span aria-hidden="true">{index + 1}</span>{label}</li>)}</ol>
      <header className="player-heading">
        <p className="eyebrow">{lesson.tag} · {stages[current]}</p>
        <h1 ref={heading} tabIndex={-1}>
          {current === 4 ? "One more idea, understood." : lesson.title}
        </h1>
      </header>
      <section className={`player-card ${current === 2 ? "understand-card" : ""}`} key={current}>
        {current === 0 && (
          <>
            <LessonVisual scene={activity.scene} />
            <h2>{activity.hook}</h2>
            <p className="lesson-story">{activity.story}</p>
            <aside className="lesson-concept"><p className="eyebrow">The concept</p><h3>{lesson.sections[0].title}</h3><p>{lesson.sections[0].body}</p></aside>
            <p className="lesson-step-hint">Next: try the idea in a short, fictional example.</p>
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
            <p className="lesson-step-hint">Try it yourself. You’ll see why your answer works before moving on.</p>
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
            <div className="understand-opening"><div><p className="eyebrow">Your next cornerstone</p><h2>Connect the dots.</h2><p>Take the idea with you.</p></div><svg className="concept-stone" viewBox="0 0 180 150" aria-hidden="true"><path d="M22 52 85 22 155 49 91 81Z" fill="#c9d5b5"/><path d="M22 52 91 81 91 131 22 100Z" fill="#225347"/><path d="M91 81 155 49 155 99 91 131Z" fill="#123b32"/><path d="m49 67 41 17 39-18" fill="none" stroke="#e1ed9d" strokeWidth="2"/><path d="m75 45 12 11 23-17" fill="none" stroke="#225347" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg></div>
            <div className="understand-sections">
            {(id === "what-you-own" ? lesson.sections.slice(2) : lesson.sections).map((section,index) => <section className="understand-point" key={section.title}><span className="understand-number" aria-hidden="true">{String(index+1).padStart(2,"0")}</span><div><h3>{section.title}</h3><p className="lesson-story">{section.body}</p></div></section>)}
            </div>
            <aside className="gentle-note">{activity.explanation}</aside>
            <button className="button primary" onClick={() => go(3)}>
              Try three quick checks <ArrowRight size={18} />
            </button>
          </>
        )}
        {current === 3 && <OwnershipQuiz key={id} id={id} onFinish={() => go(4)} onMiss={miss} />}
        {current === 4 && <div className="lesson-receipt" role="status"><div><p className="eyebrow">{newCompletion ? "Lesson completed" : "Already part of your foundation"}</p><h2>{newCompletion ? "+20 XP · One cornerstone earned" : "Knowledge worth revisiting"}</h2><p>{newCompletion ? "You checked all three answers correctly. Your progress is updated." : "Your original XP and cornerstone are preserved. Review never adds a duplicate reward."}</p></div><div className="lesson-receipt-stats"><strong>{learning.completed.length}/{lessons.length}</strong><span>lessons complete</span><strong>{stats.xp} XP</strong><span>total learning XP</span></div></div>}
        {current === 4 && <SavedIdeas lessonId={id} />}
        {current === 4 && <button className="demo-link" onClick={() => go(0)}>Review this lesson</button>}
        {current === 4 && <CornerstoneReward completed={learning.completed} lessonId={id} newCompletion={newCompletion} reducedMotion={learning.reducedMotion} nextHref={next ? `/learn/${next.id}` : "/learn"} nextTitle={next?.title ?? "Review lessons"} saveLabel={account.account ? (account.account.status === "saved" ? "Saved to your account" : account.account.status === "pending" ? "Saving to your account…" : "Account save needs attention. Open Settings to retry.") : persistence === "session" ? "Available for this session" : "Saved in this browser"} />}
      </section>
      {current === 4 && newCompletion && <LessonCelebration id={id} reducedMotion={learning.reducedMotion}/> }
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
