"use client";
import { useEffect, useState, useSyncExternalStore } from "react";
import { Pause, Play, ArrowUpRight, ArrowDownRight } from "lucide-react";
import type { PortfolioSnapshot } from "@/lib/domain";
import { moneyStory, signedAmount } from "@/lib/money-story";
import { snapshotAsOf, comparisonLabel } from "@/lib/presentation";
import { movementHeading } from "@/lib/portfolio-insights";
import { dayKey } from "@/lib/learning-progress";
import { useMvp } from "./mvp-provider";
import { CornerstoneMark } from "./cornerstone-mark";
import { BarList } from "./tremor/bar-list";
import styles from "./portfolio-movement.module.css";

function subscribeMotion(notify: () => void) {
  const media = matchMedia("(prefers-reduced-motion: reduce)");
  media.addEventListener("change", notify);
  return () => media.removeEventListener("change", notify);
}
export function PortfolioStory({
  portfolio,
}: {
  portfolio: PortfolioSnapshot;
}) {
  const story = moneyStory(portfolio),
    { learning, now } = useMvp();
  const systemReduced = useSyncExternalStore(
    subscribeMotion,
    () => matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );
  const reduced = systemReduced || learning.reducedMotion;
  const [index, setIndex] = useState(0),
    [paused, setPaused] = useState(false);
  useEffect(() => {
    if (reduced || paused) return;
    const timer = setInterval(() => {
      if (document.visibilityState === "visible")
        setIndex((value) => value + 1);
    }, 12000);
    return () => clearInterval(timer);
  }, [reduced, paused]);
  const today =
    !!now &&
    dayKey(now, learning.timezone) ===
      dayKey(new Date(portfolio.asOf), learning.timezone) &&
    portfolio.source !== "csv" && portfolio.comparisonPeriod !== "week";
  const change = story.summary.dayChange;
  return (
    <section
      className={styles.storyHero}
      aria-labelledby="portfolio-story-title"
    >
      <div className={styles.storyBrand}>
        <CornerstoneMark />
        <span>Cornerstone perspective</span>
        <small>
          {portfolio.source === "sample"
            ? "Tailored to this sample"
            : portfolio.source === "csv"
              ? "Tailored to your CSV holdings"
              : "Tailored to your holdings"}
        </small>
      </div>
      <div className={styles.storyBody}>
        <div>
          <div className={styles.storyHeading}>
            <h2 id="portfolio-story-title">
              {movementHeading(
                reduced ? 0 : index,
                story.summary.dayChangePercent,
                today,
              )}
            </h2>
            {!reduced && (
              <button
                className={styles.rotationControl}
                aria-label={
                  paused ? "Resume rotating heading" : "Pause rotating heading"
                }
                onClick={() => setPaused(!paused)}
              >
                {paused ? <Play size={14} /> : <Pause size={14} />}
              </button>
            )}
          </div>
          <p className={styles.personalStory}>{story.explanation}</p>
          <p className={styles.storySource}>
            {snapshotAsOf(portfolio)} · Based on {portfolio.holdings.length}{" "}
            holdings
          </p>
        </div>
        <div className={styles.heroMetric}>
          <span>{portfolio.comparisonPeriod === "week" ? "Net weekly price change" : "Net price change"}</span>
          <strong
            className={
              change < 0 ? styles.loss : change > 0 ? styles.gain : styles.flat
            }
          >
            {change < 0 ? (
              <ArrowDownRight size={23} />
            ) : change > 0 ? (
              <ArrowUpRight size={23} />
            ) : null}
            {signedAmount(change)}
          </strong>
          <b
            className={
              change < 0 ? styles.loss : change > 0 ? styles.gain : styles.flat
            }
          >
            {story.summary.dayChangePercent > 0 ? "+" : ""}
            {story.summary.dayChangePercent.toFixed(2)}%
          </b>
          <small>{comparisonLabel(portfolio)} · {snapshotAsOf(portfolio)}</small>
        </div>
      </div>
    </section>
  );
}
export function PortfolioMovement({
  portfolio,
  selected,
  onSelect,
}: {
  portfolio: PortfolioSnapshot;
  selected: string | null;
  onSelect: (symbol: string) => void;
}) {
  const story = moneyStory(portfolio);
  const active = portfolio.holdings.find(
    (holding) => holding.symbol === selected,
  );
  return (
    <section
      id="movement"
      tabIndex={-1}
      className={styles.card}
      aria-labelledby="movement-title"
    >
      <p className={styles.meta}>The arithmetic behind your story</p>
      <h2 id="movement-title">Inside the move</h2>
      <p>{snapshotAsOf(portfolio)}</p>
      <BarList
        aria-label="Holding price contributions"
        data={story.ranked.map(item => ({
          key: item.symbol,
          name: item.symbol,
          description: portfolio.holdings.find(holding => holding.symbol === item.symbol)?.name,
          value: item.value,
        }))}
        sortOrder="none"
        valueFormatter={signedAmount}
        selectedKey={selected}
        onValueChange={item => onSelect(item.key)}
      />
      <p className={styles.note}>
        Each contribution is shares × price change. This snapshot excludes
        deposits, withdrawals, dividends and fees; it is not a total-return
        calculation. Your current share counts are used at both closes; past positions are not reconstructed.
      </p>
      <div
        id="holding-details"
        tabIndex={-1}
        className={styles.reporting}
        aria-live="polite"
      >
        <h3>{active ? "Inside " + active.symbol : "Explore a holding"}</h3>
        {active ? (
          <>
            <p>
              {active.name} ·{" "}
              {story.summary.allocations
                .find((item) => item.symbol === active.symbol)
                ?.percent.toFixed(1)}
              % of your portfolio ·{" "}
              {signedAmount(
                active.quantity * (active.price - active.previousClose),
              )}{" "}
              contribution. As of {story.asOf}.
            </p>
            <h4>Keep exploring</h4>
            <p>
              Open current reporting for context. No verified articles are
              connected to this snapshot.
            </p>
            <a
              href={
                "https://finance.yahoo.com/quote/" +
                encodeURIComponent(active.symbol) +
                "/news/"
              }
              target="_blank"
              rel="noopener noreferrer"
            >
              Browse {active.symbol} news on Yahoo Finance ↗
            </a>
            <small>
              Current coverage may describe a different period. A headline alone
              does not establish why a price moved.
            </small>
          </>
        ) : (
          <p>
            Select a holding or contribution to explore its allocation and
            related reporting.
          </p>
        )}
      </div>
    </section>
  );
}
