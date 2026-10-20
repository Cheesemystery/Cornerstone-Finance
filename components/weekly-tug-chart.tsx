"use client";

import { useId, useState, type CSSProperties } from "react";
import { displayDate, money, signedMoney } from "@/lib/presentation";
import type { PortfolioWeek } from "@/lib/weekly-portfolio";
import styles from "./weekly-tug-chart.module.css";

const GROW_DURATION_MS = 400;
const BAR_STAGGER_MS = 60;
const signedContribution = (value: number) => {
  const rounded = Number(value.toFixed(2));
  return rounded === 0 ? "+$0.00" : signedMoney(rounded);
};
const direction = (value: number) => Number(value.toFixed(2)) === 0 ? "Unchanged" : value < 0 ? "Pulled down" : "Lifted";
const sharesLabel = (value: number) => new Intl.NumberFormat("en-US", {maximumFractionDigits:20}).format(value);

export function WeeklyTugChart({ week, compact = false }: { week: PortfolioWeek; compact?: boolean }) {
  const id = useId();
  const [open, setOpen] = useState<string | null>(null);
  const positions = [...week.positions].sort((a, b) => Math.abs(b.contribution) - Math.abs(a.contribution) || a.ticker.localeCompare(b.ticker));
  const largest = Math.max(...positions.map(position => Math.abs(position.contribution)), 0);
  return <figure className={styles.chart} data-compact={compact || undefined} aria-labelledby={`${id}-title`}>
    <figcaption id={`${id}-title`} className="sr-only">Weekly holding contributions, as of {displayDate(week.endDate)}</figcaption>
    <div className={styles.legend} aria-hidden="true"><span>− Pulled down</span><span>+ Lifted</span></div>
    <div className={styles.rows}>
      {positions.map((position, index) => {
        const { ticker, contribution } = position;
        const width = largest ? Math.abs(contribution) / largest * 48 : 0;
        const down = contribution < 0;
        const tooltipId = `${id}-${index}-details`;
        return <div key={ticker} className={styles.row}
          onPointerEnter={event => { if (event.pointerType !== "touch") setOpen(ticker); }}
          onPointerLeave={event => { if (!event.currentTarget.contains(document.activeElement)) setOpen(null); }}>
          <button type="button" className={styles.holding} aria-label={`${ticker}: ${signedContribution(contribution)}, ${direction(contribution).toLowerCase()}. Show contribution details.`}
            aria-describedby={open === ticker ? tooltipId : undefined} aria-expanded={open === ticker} aria-controls={tooltipId}
            onFocus={() => setOpen(ticker)} onBlur={() => setOpen(null)} onClick={() => setOpen(ticker)}
            onKeyDown={event => { if (event.key === "Escape") { setOpen(null); event.stopPropagation(); } }}>
            <span className={styles.labels} aria-hidden="true"><span>{ticker}</span><span>{signedContribution(contribution)}</span></span>
            <svg viewBox="0 0 100 24" preserveAspectRatio="none" width="100%" height="24" aria-hidden="true">
              <line x1="50" x2="50" y1="0" y2="24" className={styles.axis} vectorEffect="non-scaling-stroke" />
              <rect x={down ? 50 - width : 50} y="6" width={width} height="12" rx="1"
                className={`${styles.bar} ${down ? styles.down : styles.up}`}
                style={{ "--grow-duration":`${GROW_DURATION_MS}ms`, "--bar-delay":`${index * BAR_STAGGER_MS}ms` } as CSSProperties} />
              {contribution === 0 && <circle cx="50" cy="12" r="1" className={styles.zero} />}
            </svg>
          </button>
          <div id={tooltipId} role="tooltip" className={styles.tooltip} hidden={open !== ticker}>
            <strong>{ticker} · {direction(contribution)}</strong>
            <dl>
              <div><dt>Shares</dt><dd>{sharesLabel(position.shares)}</dd></div>
              <div><dt>Contribution</dt><dd>{signedContribution(contribution)}</dd></div>
              <div><dt>Start · {displayDate(week.startDate)}</dt><dd>{money(position.startClose)}</dd></div>
              <div><dt>End · {displayDate(week.endDate)}</dt><dd>{money(position.endClose)}</dd></div>
            </dl>
            <small>As of {displayDate(week.endDate)}</small>
          </div>
        </div>;
      })}
    </div>
    <ul className="sr-only" aria-label="Contribution text equivalent">
      {positions.map(position => <li key={position.ticker}>
        {position.ticker}: {direction(position.contribution)}, {signedContribution(position.contribution)}; {sharesLabel(position.shares)} shares.
        Start close {money(position.startClose)} on {displayDate(week.startDate)}; end close {money(position.endClose)} on {displayDate(week.endDate)}.
        Contribution as of {displayDate(week.endDate)}.
      </li>)}
    </ul>
  </figure>;
}
