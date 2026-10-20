"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, ArrowDownRight, ChevronRight } from "lucide-react";
import type { PortfolioSnapshot } from "@/lib/domain";
import { marketValue, summarizePortfolio } from "@/lib/portfolio";
import styles from "./portfolio-holdings.module.css";
import { PortfolioMovement, PortfolioStory } from "./portfolio-movement";

import { assetColor, snapshotAsOf, comparisonLabel } from "@/lib/presentation";
import { recordedGrowth } from "@/lib/portfolio-insights";
const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
});
const signedMoney = (value: number) =>
  `${value < 0 ? "−" : "+"}${money.format(Math.abs(value))}`;

export function PortfolioHoldings({
  portfolio,
}: {
  portfolio: PortfolioSnapshot;
}) {
  const summary = summarizePortfolio(portfolio);
  const [selected, setSelected] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [focused, setFocused] = useState<string | null>(null);
  const active = hovered ?? focused ?? selected;
  const activeHolding = portfolio.holdings.find((h) => h.symbol === active);
  const activeAllocation = summary.allocations.find((h) => h.symbol === active);
  const positive = summary.dayChange >= 0;
  const largest = summary.allocations[0];
  const toggle = (symbol: string) =>
    setSelected((current) => (current === symbol ? null : symbol));
  const reset = () => {
    setSelected(null);
    setHovered(null);
    setFocused(null);
  };
  const growth = recordedGrowth(
    activeHolding ? [activeHolding] : portfolio.holdings,
  );
  const totalGain =
    activeHolding?.costBasis !== undefined
      ? marketValue(activeHolding) - activeHolding.costBasis
      : undefined;
  function reveal(symbol: string) {
    setSelected(symbol);
    requestAnimationFrame(() => {
      const panel = document.getElementById("holding-details");
      panel?.focus({ preventScroll: true });
      panel?.scrollIntoView({ block: "center", behavior: "instant" });
    });
  }
  const asOf = snapshotAsOf(portfolio);

  return (
    <div
      className={styles.workspace}
      onKeyDown={(event) => {
        if (event.key === "Escape") reset();
      }}
    >
      <PortfolioStory portfolio={portfolio} />
      <section
        className={styles.chartCard}
        aria-labelledby="holdings-chart-title"
      >
        <div className={styles.sectionTop}>
          <div>
            <h2 id="holdings-chart-title">Where your money is.</h2>
            <p>{asOf}</p>
          </div>
          <button className={styles.reset} onClick={reset} disabled={!active}>
            Show all
          </button>
        </div>
        <div className={styles.chartLayout}>
          <div className={styles.chartVisual}>
            <div className={styles.chartWrap}>
              <svg
                viewBox="0 0 300 300"
                className={styles.chart}
                role="group"
                aria-label="Interactive holdings chart"
              >
                <circle
                  cx="150"
                  cy="150"
                  r="108"
                  fill="none"
                  stroke="#eef1ed"
                  strokeWidth="48"
                />
                {summary.totalValue > 0 &&
                  summary.allocations.map((allocation, index) => {
                    const offset = summary.allocations
                      .slice(0, index)
                      .reduce((sum, h) => sum + h.percent, 0);
                    if (allocation.percent <= 0) return null;
                    return (
                      <circle
                        key={allocation.symbol}
                        cx="150"
                        cy="150"
                        r="108"
                        fill="none"
                        pathLength="100"
                        stroke={assetColor(allocation.symbol)}
                        strokeWidth={active === allocation.symbol ? 58 : 48}
                        strokeDasharray={`${Math.max(allocation.percent - Math.min(0.8, allocation.percent / 10), 0)} ${100 - Math.max(allocation.percent - Math.min(0.8, allocation.percent / 10), 0)}`}
                        strokeDashoffset={-offset}
                        transform="rotate(-90 150 150)"
                        className={styles.slice}
                        style={{
                          opacity:
                            active && active !== allocation.symbol ? 0.35 : 1,
                        }}
                        tabIndex={0}
                        role="button"
                        aria-pressed={selected === allocation.symbol}
                        aria-label={`${allocation.symbol}, ${allocation.percent.toFixed(1)}% of portfolio, ${money.format(allocation.value)}`}
                        onMouseEnter={() => setHovered(allocation.symbol)}
                        onMouseLeave={() => setHovered(null)}
                        onFocus={() => setFocused(allocation.symbol)}
                        onBlur={() => setFocused(null)}
                        onClick={() => toggle(allocation.symbol)}
                        onKeyDown={(event) => {
                          if (event.key === "Enter" || event.key === " ") {
                            event.preventDefault();
                            toggle(allocation.symbol);
                          }
                        }}
                      >
                        <title>{`${allocation.symbol}: ${allocation.percent.toFixed(1)}%`}</title>
                      </circle>
                    );
                  })}
              </svg>
              <div className={styles.chartCenter} aria-live="polite">
                <span>{activeAllocation?.symbol ?? "Your portfolio"}</span>
                <strong>
                  {money.format(activeAllocation?.value ?? summary.totalValue)}
                </strong>
                <small>
                  {activeAllocation
                    ? activeAllocation.percent.toFixed(1) + "% of your mix"
                    : "Total value"}
                </small>
              </div>
            </div>
            <div className={styles.centerGrowth}>
              <b
                className={
                  growth && growth.value < 0
                    ? styles.down
                    : growth && growth.value > 0
                      ? styles.up
                      : styles.neutral
                }
              >
                {growth ? signedMoney(growth.value) : "Add recorded cost in your CSV"}
                {growth?.percent !== null && growth?.percent !== undefined && (
                  <em>
                    {" "}
                    ({growth.percent > 0 ? "+" : ""}
                    {growth.percent.toFixed(2)}%)
                  </em>
                )}
              </b>
              <small>
                {activeHolding ? "Position growth" : "Total growth"} · vs.
                recorded cost
              </small>
            </div>
          </div>
          <div className={styles.legend} aria-label="Choose a holding">
            {summary.allocations.map((allocation) => {
              const holding = portfolio.holdings.find(
                (h) => h.symbol === allocation.symbol,
              )!;
              return (
                <button
                  key={allocation.symbol}
                  className={`${styles.legendRow} ${active === allocation.symbol ? styles.active : ""}`}
                  aria-pressed={selected === allocation.symbol}
                  onClick={() => toggle(allocation.symbol)}
                  onMouseEnter={() => setHovered(allocation.symbol)}
                  onMouseLeave={() => setHovered(null)}
                  onFocus={() => setFocused(allocation.symbol)}
                  onBlur={() => setFocused(null)}
                >
                  <span
                    className={styles.dot}
                    style={{ background: assetColor(allocation.symbol) }}
                  />
                  <span className={styles.holdingName}>
                    <strong>{allocation.symbol}</strong>
                    <small>{holding.name}</small>
                  </span>
                  <span className={styles.holdingAmount}>
                    <strong>{allocation.percent.toFixed(1)}%</strong>
                    <small>{money.format(allocation.value)}</small>
                  </span>
                </button>
              );
            })}
            {!portfolio.holdings.length && (
              <p>
                No holdings yet. Practice with fictional money or inspect a
                sample portfolio.
              </p>
            )}
          </div>
        </div>
        <div className={styles.detail} aria-live="polite">
          {activeHolding && activeAllocation ? (
            <>
              <div>
                <span className={styles.label}>
                  Inside {activeHolding.symbol}
                </span>
                <h3>{activeHolding.name}</h3>
              </div>
              <p>{asOf}</p>
              <div className={styles.detailStats}>
                <span>
                  <small>Shares</small>
                  <strong>{activeHolding.quantity}</strong>
                </span>
                <span>
                  <small>Price per share</small>
                  <strong>{money.format(activeHolding.price)}</strong>
                </span>
                <span>
                  <small>Gain / loss vs. cost</small>
                  <strong
                    className={
                      totalGain !== undefined && totalGain < 0
                        ? styles.down
                        : styles.up
                    }
                  >
                    {totalGain === undefined
                      ? "Add recorded cost"
                      : signedMoney(totalGain)}
                  </strong>
                </span>
              </div>
              <Link
                className={styles.research}
                href={`/discover?q=${encodeURIComponent(activeHolding.symbol)}`}
              >
                Research {activeHolding.symbol}
                <ArrowUpRight size={16} aria-hidden="true" />
              </Link>
            </>
          ) : (
            <>
              <div>
                <span className={styles.label}>The big picture</span>
                <h3>
                  {largest
                    ? `${largest.symbol} is your biggest piece.`
                    : "Your portfolio starts here."}
                </h3>
                <p>
                  {largest
                    ? `About $${largest.percent.toFixed(0)} of every $100 is in ${largest.symbol}.`
                    : "Your holdings will appear here once they’re added."}
                </p>
              </div>
              <span className={styles.detailHint}>
                Select a holding for the details.
                <br />
                Press Escape to clear your selection.
              </span>
            </>
          )}
        </div>
      </section>

      <div className={styles.overview}>
        <div>
          <p className={styles.label}>Total portfolio value</p>
          <h2>{money.format(summary.totalValue)}</h2><small>{asOf}</small>
          <p className={positive ? styles.up : styles.down}>
            {positive ? (
              <ArrowUpRight size={19} aria-hidden="true" />
            ) : (
              <ArrowDownRight size={19} aria-hidden="true" />
            )}
            <strong>
              {signedMoney(summary.dayChange)} ({positive ? "+" : ""}
              {summary.dayChangePercent.toFixed(2)}%)
            </strong>
            <span>{comparisonLabel(portfolio)}</span>
          </p>
        </div>
        <div className={styles.quickFacts}>
          <div>
            <strong>{portfolio.holdings.length}</strong>
            <span>holdings</span>
          </div>
          <div>
            <strong>{largest?.symbol ?? "—"}</strong>
            <span>
              {largest
                ? `${largest.percent.toFixed(1)}% · biggest holding`
                : "No holdings yet"}
            </span>
          </div>
        </div>
      </div>

      <PortfolioMovement
        portfolio={portfolio}
        selected={selected}
        onSelect={toggle}
      />

      <section
        className={styles.tableCard}
        aria-labelledby="all-holdings-title"
      >
        <div className={styles.tableHeading}>
          <h2 id="all-holdings-title">Your holdings</h2>
          <span>
            Choose a row to explore <ChevronRight size={15} />
          </span>
        </div>
        <div className={styles.tableWrap}>
          <table className="table">
            <caption>{asOf}</caption>
            <thead>
              <tr>
                <th scope="col">Investment</th>
                <th scope="col">Shares</th>
                <th scope="col">Your mix</th>
                <th scope="col">Value</th>
                <th scope="col">{portfolio.comparisonPeriod === "week" ? "Week price change" : "Price change"}</th>
              </tr>
            </thead>
            <tbody>
              {portfolio.holdings.map((holding) => {
                const value = marketValue(holding);
                const percent = summary.totalValue
                  ? (value / summary.totalValue) * 100
                  : 0;
                const daily = holding.previousClose
                  ? ((holding.price - holding.previousClose) /
                      holding.previousClose) *
                    100
                  : null;

                return (
                  <tr
                    key={holding.symbol}
                    onClick={() => reveal(holding.symbol)}
                    className={
                      selected === holding.symbol ? styles.selectedRow : ""
                    }
                  >
                    <td>
                      <button
                        className={styles.holdingOpen}
                        aria-label={"Explore " + holding.symbol + " holding"}
                        aria-pressed={selected === holding.symbol}
                        onClick={(event) => {
                          event.stopPropagation();
                          reveal(holding.symbol);
                        }}
                      >
                        <span className={styles.tableSymbol}>
                          <span
                            className={styles.dot}
                            style={{ background: assetColor(holding.symbol) }}
                          />
                          <strong>{holding.symbol}</strong>
                        </span>
                        <span className="muted small">{holding.name}</span>
                        <span className={styles.rowArrow}>
                          Explore <ChevronRight size={16} />
                        </span>
                      </button>
                    </td>
                    <td>{holding.quantity}</td>
                    <td>{percent.toFixed(1)}%</td>
                    <td>{money.format(value)}</td>
                    <td
                      className={
                        daily === null ? styles.neutral : daily < 0 ? styles.down : styles.up
                      }
                    >
                      {daily === null
                        ? "—"
                        : `${daily >= 0 ? "+" : ""}${daily.toFixed(2)}%`}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
      <p className={styles.source}>
        {asOf} · Values and chart use the same
        holdings. Rounded percentages may not add up to exactly 100%.
      </p>
    </div>
  );
}
