"use client";
import Link from "next/link";
import { ArrowRight, Check, Sparkles } from "lucide-react";
import { useMvp } from "./mvp-provider";
import { useDemo } from "./demo-provider";
import { lessons } from "@/lib/lessons";
import { learningStats, nextLesson } from "@/lib/learning-progress";
import { moneyStory } from "@/lib/money-story";
import { money, signedMoney, sourceLabel, displayDate } from "@/lib/presentation";
import { practiceValue, scenarioFor } from "@/lib/practice";

export function NextLessonLink() {
  const { learning } = useMvp();
  const next = nextLesson(learning);
  return (
    <Link
      className="button lime"
      href={next ? "/learn/" + next.id : "/learn/review"}
    >
      {next
        ? learning.completed.length || (learning.steps[next.id] ?? 0) > 0
          ? "Continue your lesson"
          : "Start your first lesson"
        : "Review a lesson"}
      <ArrowRight size={18} />
    </Link>
  );
}
export function ProgressSummary() {
  const { learning, now } = useMvp();
  const stats = learningStats(
    learning,
    now ?? new Date("2026-01-01T12:00:00Z"),
  );
  return (
    <div className="progress-summary" aria-label="Your lesson progress">
      {now && <small>As of {displayDate(now.toISOString())}</small>}
      <div>
        <Sparkles size={18} />
        <strong>{stats.xp} XP</strong>
        <span>earned by learning</span>
      </div>
      <div>
        <strong>
          {learning.completed.length}/{lessons.length}
        </strong>
        <span>lessons complete</span>
      </div>
      <div>
        <strong>
          {now ? Math.min(stats.todayActivities, learning.dailyGoal) : 0}/
          {learning.dailyGoal}
        </strong>
        <span>
          {stats.goalMet && now ? (
            <>
              <Check size={14} /> Daily goal complete
            </>
          ) : (
            "today’s learning goal"
          )}
        </span>
      </div>
      <div>
        <strong>{now ? stats.weekDays : 0} days</strong>
        <span>learning this week</span>
      </div>
      {learning.showStreak && (
        <div>
          <strong>{now ? stats.streak : 0} day streak</strong>
          <span>Personal best: {stats.best}</span>
        </div>
      )}
    </div>
  );
}
export function PortfolioSummary() {
  const { practice } = useMvp();
  const { portfolio } = useDemo();
  const last = practice.checkpoints.at(-1);
  if (practice.runId) {
    const change = last ? last.afterCents - last.beforeCents : 0;
    return (
      <section className="mvp-card compact-portfolio">
        <div>
          <p className="eyebrow">
            {last ? "Your practice week" : "Your practice snapshot"} · Fictional
            money
          </p>
          <h2>{money(practiceValue(practice) / 100)}</h2>
          <p>
            {scenarioFor(practice).title} ·{" "}
            {last ? "Simulated week " + last.week : "Before week 1"}
          </p>
          {last && (
            <p className="calm-change">
              {signedMoney(change / 100)} over the last simulated week
            </p>
          )}
        </div>
        <div>
          <p>
            {change < 0
              ? "Your practice portfolio fell this week. Short-term declines can happen. A longer time horizon changes how investors assess them, but it does not guarantee recovery."
              : last
                ? "This is one fictional week. A short-term result does not measure investing skill."
                : "Advance a scenario when you want to explore how a mix can change."}
          </p>
          <Link className="demo-link" href="/portfolio">
            Understand this change <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    );
  }
  const story = moneyStory(portfolio);
  return (
    <section className="mvp-card compact-portfolio">
      <div>
        <p className="eyebrow">Latest available snapshot</p>
        <h2>{money(story.summary.totalValue)}</h2>
        <p>
          {sourceLabel(portfolio)} · {story.asOf}
        </p>
        <p className="calm-change">
          {signedMoney(story.summary.dayChange)} vs. previous close
        </p>
      </div>
      <div>
        <p>
          An example to explore, with prices from the date shown. Start a
          fictional-money scenario when you’re curious.
        </p>
        <Link className="demo-link" href="/portfolio">
          Explore practice <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  );
}
