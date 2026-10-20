"use client";
import Link from "next/link";
import { ArrowRight, BookOpen, Check, Sparkles } from "lucide-react";
import { lessons } from "@/lib/lessons";
import { learningStats, nextLesson } from "@/lib/learning-progress";
import { useMvp } from "./mvp-provider";
import { ProgressSummary, NextLessonLink } from "./mvp-ui";
export function LearningLibrary() {
  const { learning, now } = useMvp();
  const next = nextLesson(learning);
  const stats = learningStats(
    learning,
    now ?? new Date("2026-01-01T12:00:00Z"),
  );
  return (
    <div className="learning-path">
      <section className="path-intro">
        <div>
          <p className="eyebrow">Small ideas. Real understanding.</p>
          <h2>
            {next
              ? "Make your next money move a smarter one."
              : "Your foundation, built."}
          </h2>
          <p>
            Short investing lessons. Try an answer, learn from the feedback,
            and build your understanding.
          </p>
          <NextLessonLink />
        </div>
        <ProgressSummary />
      </section>
      <ol className="path-list">
        {lessons.map((lesson, index) => {
          const done = learning.completed.includes(lesson.id),
            current = next?.id === lesson.id;
          return (
            <li
              key={lesson.id}
              className={done ? "path-done" : current ? "path-current" : ""}
            >
              <span className="path-node" aria-hidden="true">
                {done ? <Check size={22} /> : index + 1}
              </span>
              <Link className="path-card" href={"/learn/" + lesson.id}>
                <div>
                  <p className="eyebrow">
                    {done
                      ? "Complete · review anytime"
                      : current
                        ? "Up next"
                        : lesson.tag}
                  </p>
                  <h3>{lesson.title}</h3>
                  <p>{lesson.intro}</p>
                  <span className="path-meta">
                    {lesson.minutes} min · interactive lesson
                    {(learning.steps[lesson.id] ?? 0) > 0 && !done
                      ? " · In progress"
                      : ""}
                  </span>
                </div>
                <ArrowRight size={21} />
              </Link>
            </li>
          );
        })}
      </ol>
      {learning.completed.length > 0 && (
        <section className="mvp-card review-invitation">
          <BookOpen />
          <div>
            <h2>A little recall goes a long way.</h2>
            <p>A short review uses ideas you’ve already explored.</p>
          </div>
          <Link className="button secondary" href="/learn/review">
            Review a lesson
          </Link>
        </section>
      )}
      <section className="mvp-card">
        <div className="section-heading">
          <h2>
            <Sparkles size={21} /> Milestones along the way
          </h2>
          <Link className="demo-link" href="/portfolio#recap">
            See my recap →
          </Link>
        </div>
        <div className="achievement-grid">
          {stats.achievements.map((item) => (
            <div
              key={item.id}
              className={item.earned ? "achievement earned" : "achievement"}
            >
              <Check size={20} />
              <strong>{item.title}</strong>
              <small>{item.description}</small>
              <span>{item.earned ? "Earned" : "At your pace"}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
