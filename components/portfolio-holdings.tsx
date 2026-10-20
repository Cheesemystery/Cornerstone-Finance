"use client";

import { useState, type ReactNode } from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import type { PortfolioSnapshot } from "@/lib/domain";
import { marketValue, summarizePortfolio } from "@/lib/portfolio";
import styles from "./portfolio-holdings.module.css";
import { PortfolioMovement } from "./portfolio-movement";

import { assetColor, comparisonLabel, pluralize, holdingSubtitle } from "@/lib/presentation";
const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
});
const signedMoney = (value: number) =>
  `${value < 0 ? "−" : "+"}${money.format(Math.abs(value))}`;

export function PortfolioHoldings({
  portfolio,
  controls,
}: {
  portfolio: PortfolioSnapshot;
  controls?: ReactNode;
}) {
  const summary = summarizePortfolio(portfolio);
  const [selected, setSelected] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [focused, setFocused] = useState<string | null>(null);
  const active = hovered ?? focused ?? selected;
  const positive = summary.dayChange >= 0;
  const largest = summary.allocations[0];
  const toggle = (symbol: string) =>
    setSelected((current) => (current === symbol ? null : symbol));
  const reset = () => {
    setSelected(null);
    setHovered(null);
    setFocused(null);
  };
  function reveal(symbol: string) {
    setSelected(symbol);
    requestAnimationFrame(() => {
      const panel = document.getElementById("holding-" + symbol);
      panel?.focus({ preventScroll: true });
      panel?.scrollIntoView({ block: "center", behavior: "instant" });
    });
  }

  return (
    <div
      className={styles.workspace}
      onKeyDown={(event) => {
        if (event.key === "Escape") reset();
      }}
    >
      <section className={styles.overview} aria-label="Total portfolio value">
        <div>
          <p className={styles.label}>Total portfolio value</p>
          <h2>{money.format(summary.totalValue)}</h2>
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
            <span>{pluralize(portfolio.holdings.length, "holding")}</span>
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
      </section>

      <section
        className={styles.chartCard}
        aria-labelledby="holdings-chart-title"
      >
        <div className={styles.sectionTop}>
          <div>
            <h2 id="holdings-chart-title">Where your money is.</h2>
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
                        aria-label={`${allocation.symbol}, ${allocation.percent.toFixed(1)}% of portfolio`}
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
                <span>Your portfolio</span>
                <strong>{money.format(summary.totalValue)}</strong>
                <small>Total value</small>
              </div>
            </div>

          </div>
          <div className={styles.legend} aria-label="Choose a holding">
            {summary.allocations.map((allocation) => {
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
                  </span>
                  <span className={styles.holdingAmount}>
                    <strong>{allocation.percent.toFixed(1)}%</strong>
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

      </section>

      <PortfolioMovement
        portfolio={portfolio}
        selected={selected}
        onSelect={reveal}
      />

      <section
        className={styles.tableCard}
        aria-labelledby="all-holdings-title"
      >
        <div className={styles.tableHeading}>
          <h2 id="all-holdings-title">Your holdings</h2>
          <span>
            Select a row to highlight it
          </span>
        </div>
        <div className={styles.tableWrap}>
          <table className="table" aria-labelledby="all-holdings-title">
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
                        id={"holding-" + holding.symbol}
                        aria-label={"Select " + holding.symbol + " holding"}
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
                        {holdingSubtitle(holding.symbol) && <span className="muted small">{holdingSubtitle(holding.symbol)}</span>}

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
        Values and chart use the same
        holdings. Rounded percentages may not add up to exactly 100%.
      </p>
      {controls}
    </div>
  );
}
