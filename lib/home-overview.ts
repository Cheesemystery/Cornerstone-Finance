import type { PortfolioSnapshot } from "./domain";
import { moneyStory } from "./money-story";
import {
  practiceAssets,
  practiceAsOf,
  practiceValue,
  priceCents,
  scenarioFor,
  type PracticeState,
} from "./practice";
import { lessons } from "./lessons";
import { nextLesson, type LearningState } from "./learning-progress";
import { displayDate, sourceLabel, snapshotAsOf } from "./presentation";

export interface HomePortfolioView {
  title: string;
  value: number;
  source: string;
  period: string;
  asOf: string;
  allocations: {
    symbol: string;
    name: string;
    value: number;
    percent: number;
  }[];
  day: { value: number; percent: number } | null;
  week: { value: number; percent: number } | null;
  dayNote: string;
  weekNote: string;
  explanation: string;
}
export function inspectHomeView(
  portfolio: PortfolioSnapshot,
): HomePortfolioView {
  const story = moneyStory(portfolio);
  return {
    title: "Your portfolio",
    value: story.summary.totalValue,
    source: sourceLabel(portfolio),
    asOf: snapshotAsOf(portfolio),
    period:
      portfolio.source === "csv"
        ? "Prices from your file"
        : story.asOf,
    allocations: story.summary.allocations.map((item) => ({
      ...item,
      name:
        portfolio.holdings.find((h) => h.symbol === item.symbol)?.name ??
        item.symbol,
    })),
    day: portfolio.holdings.length
      ? {
          value: story.summary.dayChange,
          percent: story.summary.dayChangePercent,
        }
      : null,
    week: null,
    dayNote:
      portfolio.source === "csv"
        ? "Supplied previous-close comparison"
        : "Snapshot vs. previous close",
    weekNote: "Weekly price history is not connected.",
    explanation: story.explanation,
  };
}
export function practiceHomeView(practice: PracticeState): HomePortfolioView {
  const value = practiceValue(practice) / 100,
    last = practice.checkpoints.at(-1);
  const allocations = [
    { symbol: "CASH", name: "Fictional cash", value: practice.cashCents / 100 },
    ...practiceAssets.map((asset) => ({
      symbol: asset.symbol,
      name: asset.name,
      value:
        ((practice.positions[asset.symbol]?.quantity ?? 0) *
          priceCents(practice, asset.symbol)) /
        100,
    })),
  ]
    .filter((item) => item.value > 0)
    .map((item) => ({
      ...item,
      percent: value ? (item.value / value) * 100 : 0,
    }))
    .sort((a, b) => b.value - a.value);
  const change = last ? (last.afterCents - last.beforeCents) / 100 : 0;
  return {
    title: "Your practice portfolio",
    value,
    source: "Fictional money",
    asOf: "Sample scenario state - as of " + displayDate(practiceAsOf(practice)),
    period: scenarioFor(practice).title + " · Simulated week " + practice.week,
    allocations,
    day: null,
    dayNote: "Scenarios advance weekly, not daily.",
    week: last
      ? {
          value: change,
          percent: last.beforeCents
            ? (change / (last.beforeCents / 100)) * 100
            : 0,
        }
      : null,
    weekNote: last
      ? "Stored simulated week " + last.week
      : "Advance a simulated week to see a result.",
    explanation: last
      ? change < 0
        ? "Your fictional mix fell this week. Short-term declines can happen; a longer horizon does not guarantee recovery."
        : change > 0
          ? "Your fictional mix rose this week. One result cannot predict future returns."
          : "Your fictional mix finished this week unchanged. Keeping your holdings or cash unchanged is a valid choice."
      : "You have room to experiment with fictional money. Try a mix or keep cash while you explore.",
  };
}
export function personalizedHomeRecap(
  view: HomePortfolioView,
  learning: LearningState,
) {
  const next = nextLesson(learning);
  const progress =
    learning.completed.length +
    " of " +
    lessons.length +
    " lessons complete.";
  return {
    observation: view.explanation,
    learning:
      progress +
      " " +
      (next
        ? "Your next lesson: " + next.title
        : "A short review can help your new ideas stick."),
    href: next ? "/learn/" + next.id : "/learn/review",
  };
}
