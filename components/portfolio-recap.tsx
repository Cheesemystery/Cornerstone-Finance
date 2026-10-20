"use client";
import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight, ArrowDownRight, ChevronDown } from "lucide-react";
import { useDemo } from "./demo-provider";
import { useMvp } from "./mvp-provider";
import { PageHeader } from "./page-header";
import { CornerstoneMark } from "./cornerstone-mark";
import { LearningRecap } from "./learning-recap";
import { BarList } from "./tremor/bar-list";
import { summarizePortfolio } from "@/lib/portfolio";
import {
  money,
  signedMoney,
  sourceLabel,
  snapshotAsOf,
  comparisonLabel,
  displayDate,
} from "@/lib/presentation";
import { exampleMonth, monthlyComparison } from "@/lib/portfolio-insights";
import { practiceValue, scenarioFor, practiceAsOf } from "@/lib/practice";
import {
  snapshotMovers,
  practiceMovers,
} from "@/lib/recap-movers";

function RecapLine({
  values,
  example,
}: {
  values: number[];
  example: boolean;
}) {
  const low = Math.min(...values) * 0.99,
    high = Math.max(...values) * 1.01;
  const points = values
    .map(
      (value, index) =>
        24 +
        (index / Math.max(1, values.length - 1)) * 592 +
        "," +
        (225 - ((value - low) / (high - low)) * 190),
    )
    .join(" ");
  return (
    <svg
      className="recap-month-line"
      viewBox="0 0 640 280"
      role="img"
      aria-label={
        (example ? "Fictional example month" : "Stored practice checkpoints") +
        " from " +
        money(values[0]) +
        " to " +
        money(values.at(-1)!)
      }
    >
      {[50, 125, 200].map((y) => (
        <line key={y} x1="24" x2="616" y1={y} y2={y} stroke="#ffffff16" />
      ))}
      <polyline
        points={points}
        fill="none"
        stroke="#d6f58d"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      {values.map((value, index) => (
        <circle
          key={index}
          cx={24 + (index / Math.max(1, values.length - 1)) * 592}
          cy={225 - ((value - low) / (high - low)) * 190}
          r={index === values.length - 1 ? 5 : 2.5}
          fill="#d6f58d"
        />
      ))}
      <text x="24" y="266" fill="#adc69d" fontSize="12">
        {example ? "Aug 31 · example" : "Scenario start"}
      </text>
      <text x="616" y="266" textAnchor="end" fill="#adc69d" fontSize="12">
        {example ? "Sep 30 · example" : "Latest checkpoint"}
      </text>
    </svg>
  );
}
function RecapGraphic({ values, example }: { values: number[]; example: boolean }) {
  if (values.length < 2) return null;
  return <div className="monthly-card-graphic"><RecapLine values={values} example={example} /><p className="monthly-chart-caption">{example ? exampleMonth.note : "Saved scenario checkpoints · fixed fictional prices"}</p></div>;
}

function RecapMovers({ movers, example, simulated, period }: {
  movers: ReturnType<typeof snapshotMovers>;
  example: boolean;
  simulated: boolean;
  period: string;
}) {
  return (
    <section className="recap-movers" aria-labelledby="recap-movers-title">
      <div className="recap-movers-heading">
        <h3 id="recap-movers-title">
          {simulated
            ? "What moved your last practice week"
            : "The biggest movers in this snapshot"}
        </h3>
        <span>
          {simulated
            ? "Simulated price contributions"
            : "Price contributions · " + period}
        </span>
      </div>
      {movers.length ? (
        <BarList
          aria-label={simulated ? "Last practice week price contributions" : "Snapshot price contributions"}
          data={movers.map(item => ({
            key: item.symbol,
            name: item.symbol,
            description: item.name,
            value: item.value,
            href: simulated ? "/portfolio" : "/discover?q=" + encodeURIComponent(item.symbol),
          }))}
          sortOrder="none"
          tone="dark"
          valueFormatter={signedMoney}
        />
      ) : (
        <p>
          {example
            ? "This example models a portfolio total, without individual stock history."
            : simulated
              ? "Advance a week with invested fictional holdings to see their contributions. Unchanged cash has no price movement."
              : "No nonzero price contributions are available in this snapshot."}
        </p>
      )}
      {!!movers.length && (
        <small>
          Largest absolute price contributions, not news explanations or a
          monthly return.
        </small>
      )}
    </section>
  );
}

export function PortfolioRecap({ embedded = false, initialMode = "snapshot" }: { embedded?: boolean; initialMode?: "snapshot" | "practice" }) {
  const { portfolio } = useDemo(),
    { practice } = useMvp();
  const [selected, setSelected] = useState<"snapshot" | "example" | "practice">(
    initialMode,
  );
  const mode =
    selected === "practice" && !practice.runId ? "snapshot" : selected;
  const summary = summarizePortfolio(portfolio);
  const example = mode === "example",
    simulated = mode === "practice";
  const movers = example
    ? []
    : simulated
      ? practiceMovers(practice)
      : snapshotMovers(portfolio);
  const updatedAt = simulated ? practiceAsOf(practice) : portfolio.asOf;
  const updatedLabel = example ? "Sample data - as of Sep 30, 2026" : simulated ? "Sample scenario state - as of " + displayDate(updatedAt) : snapshotAsOf(portfolio);
  const values = example
    ? [...exampleMonth.values]
    : simulated
      ? [1000, ...practice.checkpoints.map((point) => point.afterCents / 100)]
      : [];
  const value = example
    ? values.at(-1)!
    : simulated
      ? practiceValue(practice) / 100
      : summary.totalValue;
  const comparison =
    mode === "snapshot"
      ? monthlyComparison(
          [{ date: portfolio.asOf.slice(0, 10), value: summary.totalValue }],
          portfolio.asOf.slice(0, 7),
        )
      : example
        ? monthlyComparison(
            [
              { date: "2026-08-31", value: values[0] },
              { date: "2026-09-30", value },
            ],
            exampleMonth.month,
          )
        : null;
  const change = simulated
    ? values.length > 1
      ? value - values[0]
      : null
    : (comparison?.value ?? null);
  const percent = change !== null ? (change / values[0]) * 100 : null;
  const month = new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(portfolio.asOf));
  const top = summary.allocations[0];
  const explanation = example
    ? "An example month can have both dips and gains. The ending result is one part of the story; the path matters too."
    : simulated
      ? "Your scenario shows how your choices behaved at fixed weekly prices. A simulated result does not predict real returns."
      : top
        ? top.symbol +
          " made up " +
          top.percent.toFixed(1) +
          "% of this snapshot. A complete month of dated values is needed to show your monthly result."
        : "Your monthly story will take shape once there are dated portfolio values to compare.";
  return (
    <div className="portfolio-recap-page">
      {!embedded && <PageHeader
        eyebrow="Your money, in perspective"
        title="Your Recap."
        description="Your saved portfolio and lesson history."
      />}
      <div
        className="demo-tabs recap-source-switch"
        role="group"
        aria-label="Recap source"
      >
        <button
          aria-pressed={mode === "snapshot"}
          onClick={() => setSelected("snapshot")}
        >
          {portfolio.source === "csv"
            ? "My CSV snapshot"
            : "My portfolio snapshot"}
        </button>
        <button
          aria-pressed={mode === "example"}
          onClick={() => setSelected("example")}
        >
          Preview an example month
        </button>
        {practice.runId && (
          <button
            aria-pressed={mode === "practice"}
            onClick={() => setSelected("practice")}
          >
            My practice timeline
          </button>
        )}
      </div>
      <section
        className="monthly-portfolio-card"
        aria-labelledby="monthly-recap-title"
      >
        <div className="recap-foundation-art" aria-hidden="true">
          <CornerstoneMark />
        </div>
        <header className="monthly-card-heading">
          <div className="recap-cornerstone-brand">
            <CornerstoneMark />
            <span>Cornerstone Recap</span>
          </div>
          <span className="recap-source-pill">
            {example
              ? "Fictional example · not your account"
              : simulated
                ? "Fictional practice · saved in this browser"
                : sourceLabel(portfolio) + " · available snapshot"}
          </span>
        </header>
        <div
          className={
            "recap-update-status" +
            " status-still"
          }
        >
          <i aria-hidden="true" />
          <span>{updatedLabel}</span>
          <small>
            {example
              ? "Authored preview"
              : simulated
                ? "Saved practice · fixed prices"
                : "Saved snapshot · no live feed"}
          </small>
        </div>
        <div className={"monthly-card-body" + (values.length < 2 ? " recap-snapshot-body" : "")}>
          <div className="monthly-card-story">
            <p className="eyebrow">
              {example
                ? exampleMonth.label
                : simulated
                  ? "Simulated weeks · not a calendar month"
                  : month}
            </p>
            <h2 id="monthly-recap-title">
              {example
                ? "Small moves. A bigger picture."
                : simulated
                  ? "Your practice, in perspective."
                  : "Your month has a story."}
            </h2>
            <p className="monthly-card-description">{explanation}</p>
            <div className="recap-value">
              <span>
                {example
                  ? "Example month-end value"
                  : simulated
                    ? "Current fictional value"
                    : "Latest available value"}
              </span>
              <strong>{money(value)}</strong>
              <small>
                {example
                  ? "Fictional starting value: $1,000 · as of Aug 31, 2026"
                  : simulated
                    ? scenarioFor(practice).title + " · As of " + displayDate(updatedAt)
                    : portfolio.source === "csv"
                      ? "Prices as of " +
                        displayDate(portfolio.asOf) +
                        " · file prices"
                      : "As of " + displayDate(portfolio.asOf)}
              </small>
            </div>
            <div className="monthly-change">
              <span>
                {example
                  ? "Example month change"
                  : simulated
                    ? "Change since scenario start"
                    : "Monthly change"}
              </span>
              {change !== null ? (
                <strong
                  className={change < 0 ? "recap-negative" : "recap-positive"}
                >
                  {change < 0 ? (
                    <ArrowDownRight size={20} />
                  ) : (
                    <ArrowUpRight size={20} />
                  )}{" "}
                  {signedMoney(change)}{" "}
                  <small>
                    ({percent! > 0 ? "+" : ""}
                    {percent!.toFixed(2)}%)
                  </small>
                </strong>
              ) : (
                <>
                  <strong className="monthly-unavailable">
                    Add dated history to compare this period
                  </strong>
                  <p>
                    {simulated
                      ? "Advance a simulated week to begin your timeline."
                      : "This snapshot contains a price comparison, not a full month of dated portfolio values."}
                  </p>
                  <Link className="demo-link" href="/portfolio">View dated holdings →</Link>
                </>
              )}
            </div>
          </div>
          <RecapGraphic values={values} example={example} />
        </div>
        <p className="recap-as-of">{updatedLabel}</p>
        <RecapMovers movers={movers} example={example} simulated={simulated} period={comparisonLabel(portfolio)} />
        <footer className="monthly-card-footer">
          <div>
            <CornerstoneMark />
            <span>
              {example
                ? "An illustration of the monthly recap experience."
                : simulated
                  ? "Built from your saved practice checkpoints."
                  : portfolio.source === "csv"
                    ? "Built from your imported holdings."
                    : "Built from this sample portfolio."}
            </span>
          </div>
          {!embedded && <Link href="/portfolio">
            Explore your portfolio <ArrowUpRight size={16} />
          </Link>}
        </footer>
      </section>
      <details className="recap-learning-disclosure">
        <summary>
          Learning milestones, history & sharing <ChevronDown size={17} />
        </summary>
        <LearningRecap embedded />
      </details>
    </div>
  );
}
