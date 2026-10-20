"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { BookOpen, CheckCircle2, Download, Sparkles } from "lucide-react";
import { useMvp } from "./mvp-provider";
import { learningStats } from "@/lib/learning-progress";
import { lessons } from "@/lib/lessons";
import { displayDate } from "@/lib/presentation";
import { learningShareSvg } from "@/lib/learning-share";
import { PageHeader } from "./page-header";
export function LearningRecap({ embedded = false }: { embedded?: boolean }) {
  const { learning, now } = useMvp();
  const [showShare, setShowShare] = useState(false),
    [includeLearning, setIncludeLearning] = useState(true),
    [includePractice, setIncludePractice] = useState(false);
  const stats = learningStats(
    learning,
    now ?? new Date("2026-01-01T12:00:00Z"),
  );
  const reflections = learning.events.filter(
    (event) => event.kind === "reflection",
  );
  const svg = learningShareSvg({
    lessons: learning.completed.length,
    total: lessons.length,
    xp: stats.xp,
    reflections: reflections.length,
    includeLearning,
    includePractice,
  });
  const image = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
  return (
    <>
      {!embedded && (
        <PageHeader
          eyebrow="A little perspective"
          title="Your Recap."
          description="The ideas you explored. The progress you made."
        />
      )}
      <div className="recap-learning-grid">
        <section className="mvp-card recap-learning-hero">
          <Sparkles size={28} />
          <p className="eyebrow">Understanding adds up</p>
          <h2>
            {learning.completed.length
              ? learning.completed.length +
                (learning.completed.length === 1
                  ? " lesson complete."
                  : " lessons complete.")
              : "Start with one lesson."}
          </h2>
          <p>
            {learning.completed.length
              ? "Every idea you understand is something you can carry with you. There’s no schedule to catch up with."
              : "Complete a lesson or reflect on a practice week. Your real activity will appear here."}
          </p>
          <Link className="demo-link" href="/learn">
            Visit my learning path →
          </Link>
        </section>
        <section className="mvp-card recap-small-stats">
          <div>
            <strong>{stats.xp}</strong>
            <span>learning XP</span>
          </div>
          <div>
            <strong>{reflections.length}</strong>
            <span>practice reflections</span>
          </div>
          <Link className="demo-link" href="/portfolio">
            Open my practice portfolio →
          </Link>
        </section>
      </div>
      <section className="mvp-card workspace">
        <h2>Milestones you’ve earned</h2>
        <div className="achievement-grid">
          {stats.achievements
            .filter((item) => item.earned)
            .map((item) => (
              <div className="achievement earned" key={item.id}>
                <CheckCircle2 size={23} />
                <strong>{item.title}</strong>
                <small>{item.description}</small>
              </div>
            ))}
        </div>
        {!stats.achievements.some((item) => item.earned) && (
          <p>No milestones yet. Your first lesson is a good place to start.</p>
        )}
      </section>
      <section className="mvp-card workspace">
        <h2>Your learning history</h2>
        {learning.events.length ? (
          <ol className="activity-timeline">
            {[...learning.events].reverse().map((event) => (
              <li key={event.id}>
                <span className="timeline-dot" />
                <BookOpen size={19} />
                <div>
                  <strong>
                    {event.kind === "lesson"
                      ? (lessons.find((lesson) => lesson.id === event.target)
                          ?.title ?? "Lesson completed")
                      : event.kind === "review"
                        ? "A short review completed"
                        : "A practice week reflected on"}
                  </strong>
                  <small>{displayDate(event.day)}</small>
                </div>
              </li>
            ))}
          </ol>
        ) : (
          <p>
            {learning.completed.length
              ? "Your earlier lesson completions are preserved. Their dates were not recorded; new activity will appear here."
              : "No activity yet. There’s room to begin whenever you’re ready."}
          </p>
        )}
      </section>
      <div className="step-actions workspace">
        <button
          className="button secondary"
          aria-expanded={showShare}
          onClick={() => {
            setShowShare(!showShare);
            setIncludeLearning(true);
            setIncludePractice(false);
          }}
        >
          {showShare ? "Close share preview" : "Share a learning recap"}
        </button>
        <Link className="demo-link" href="/learn/fees-and-time#calculator">
          Explore the free growth calculator →
        </Link>
      </div>
      {showShare && (
        <section className="mvp-card workspace">
          <h2>Choose what you share</h2>
          <p>No name, financial balances, holdings, or returns are included.</p>
          <label className="preference-row">
            <span>Include lesson count and XP</span>
            <input
              type="checkbox"
              checked={includeLearning}
              onChange={(event) => setIncludeLearning(event.target.checked)}
            />
          </label>
          <label className="preference-row">
            <span>Include practice reflection count</span>
            <input
              type="checkbox"
              checked={includePractice}
              onChange={(event) => setIncludePractice(event.target.checked)}
            />
          </label>
          {/* The preview and download use exactly the same generated bytes. */}
          <Image
            unoptimized
            width={1200}
            height={630}
            className="learning-share-image"
            src={image}
            alt="Your selected learning recap. No financial results included."
          />
          <a
            className="button primary"
            download="cornerstone-learning-recap.svg"
            href={image}
          >
            <Download size={17} /> Download this card
          </a>
        </section>
      )}
    </>
  );
}
