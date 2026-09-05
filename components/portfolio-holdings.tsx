"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import type { PortfolioSnapshot } from "@/lib/domain";
import { marketValue, summarizePortfolio } from "@/lib/portfolio";
import styles from "./portfolio-holdings.module.css";

const colors = ["#2a8b62", "#8c77df", "#edb64e", "#68a8d5", "#db7f96", "#879a57"];
const money = new Intl.NumberFormat("en-US", { style:"currency", currency:"USD", maximumFractionDigits:2 });
const signedMoney = (value:number) => `${value < 0 ? "−" : "+"}${money.format(Math.abs(value))}`;

export function PortfolioHoldings({ portfolio }: { portfolio: PortfolioSnapshot }) {
  const summary = summarizePortfolio(portfolio);
  const [selected, setSelected] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [focused, setFocused] = useState<string | null>(null);
  const active = hovered ?? focused ?? selected;
  const activeHolding = portfolio.holdings.find(h => h.symbol === active);
  const activeAllocation = summary.allocations.find(h => h.symbol === active);
  const positive = summary.dayChange >= 0;
  const largest = summary.allocations[0];
  const toggle = (symbol:string) => setSelected(current => current === symbol ? null : symbol);
  const reset = () => { setSelected(null); setHovered(null); setFocused(null); };
  const totalGain = activeHolding?.costBasis !== undefined ? marketValue(activeHolding) - activeHolding.costBasis : undefined;
  const asOf = new Intl.DateTimeFormat("en-US", { month:"short", day:"numeric", year:"numeric", timeZone:"America/New_York" }).format(new Date(portfolio.asOf));

  return <div className={styles.workspace} onKeyDown={event => { if (event.key === "Escape") reset(); }}>
    <div className={styles.overview}>
      <div><p className={styles.label}>Total portfolio value</p><h2>{money.format(summary.totalValue)}</h2><p className={positive ? styles.up : styles.down}>{positive ? <ArrowUpRight size={19} aria-hidden="true"/> : <ArrowDownRight size={19} aria-hidden="true"/>}<strong>{signedMoney(summary.dayChange)} ({positive ? "+" : ""}{summary.dayChangePercent.toFixed(2)}%)</strong><span>today</span></p></div>
      <div className={styles.quickFacts}><div><strong>{portfolio.holdings.length}</strong><span>holdings</span></div><div><strong>{largest?.symbol ?? "—"}</strong><span>{largest ? `${largest.percent.toFixed(1)}% · biggest holding` : "No holdings yet"}</span></div></div>
    </div>

    <section className={styles.chartCard} aria-labelledby="holdings-chart-title">
      <div className={styles.sectionTop}><div><h2 id="holdings-chart-title">Where your money is.</h2><p>Tap a slice or a holding to explore.</p></div><button className={styles.reset} onClick={reset} disabled={!active}>Show all</button></div>
      <div className={styles.chartLayout}>
        <div className={styles.chartWrap}>
          <svg viewBox="0 0 300 300" className={styles.chart} role="group" aria-label="Interactive holdings chart">
            <circle cx="150" cy="150" r="108" fill="none" stroke="#eef1ed" strokeWidth="48"/>
            {summary.totalValue > 0 && summary.allocations.map((allocation, index) => {
              const offset = summary.allocations.slice(0,index).reduce((sum,h)=>sum+h.percent,0);
              if (allocation.percent <= 0) return null;
              return <circle key={allocation.symbol} cx="150" cy="150" r="108" fill="none" pathLength="100"
                stroke={colors[index % colors.length]} strokeWidth={active === allocation.symbol ? 58 : 48}
                strokeDasharray={`${Math.max(allocation.percent - Math.min(.8,allocation.percent / 10),0)} ${100 - Math.max(allocation.percent - Math.min(.8,allocation.percent / 10),0)}`}
                strokeDashoffset={-offset} transform="rotate(-90 150 150)"
                className={styles.slice} style={{opacity:active && active !== allocation.symbol ? .35 : 1}}
                tabIndex={0} role="button" aria-pressed={selected === allocation.symbol}
                aria-label={`${allocation.symbol}, ${allocation.percent.toFixed(1)}% of portfolio, ${money.format(allocation.value)}`}
                onMouseEnter={()=>setHovered(allocation.symbol)} onMouseLeave={()=>setHovered(null)}
                onFocus={()=>setFocused(allocation.symbol)} onBlur={()=>setFocused(null)}
                onClick={()=>toggle(allocation.symbol)} onKeyDown={event=>{if(event.key === "Enter" || event.key === " "){event.preventDefault();toggle(allocation.symbol);}}}>
                <title>{`${allocation.symbol}: ${allocation.percent.toFixed(1)}%`}</title>
              </circle>;
            })}
          </svg>
          <div className={styles.chartCenter} aria-live="polite"><span>{activeAllocation?.symbol ?? "Your portfolio"}</span><strong>{activeAllocation ? `${activeAllocation.percent.toFixed(1)}%` : summary.totalValue > 0 ? "100%" : "0%"}</strong><small>{money.format(activeAllocation?.value ?? summary.totalValue)}</small></div>
        </div>
        <div className={styles.legend} aria-label="Choose a holding">
          {summary.allocations.map((allocation,index) => {
            const holding = portfolio.holdings.find(h=>h.symbol === allocation.symbol)!;
            return <button key={allocation.symbol} className={`${styles.legendRow} ${active === allocation.symbol ? styles.active : ""}`} aria-pressed={selected === allocation.symbol} onClick={()=>toggle(allocation.symbol)} onMouseEnter={()=>setHovered(allocation.symbol)} onMouseLeave={()=>setHovered(null)} onFocus={()=>setFocused(allocation.symbol)} onBlur={()=>setFocused(null)}>
              <span className={styles.dot} style={{background:colors[index % colors.length]}}/>
              <span className={styles.holdingName}><strong>{allocation.symbol}</strong><small>{holding.name}</small></span>
              <span className={styles.holdingAmount}><strong>{allocation.percent.toFixed(1)}%</strong><small>{money.format(allocation.value)}</small></span>
            </button>;
          })}
          {!portfolio.holdings.length && <p>No holdings yet. Connect or import a portfolio to see your mix.</p>}
        </div>
      </div>
      <div className={styles.detail} aria-live="polite">
        {activeHolding && activeAllocation ? <><div><span className={styles.label}>Inside {activeHolding.symbol}</span><h3>{activeHolding.name}</h3></div><div className={styles.detailStats}><span><small>Shares</small><strong>{activeHolding.quantity}</strong></span><span><small>Price per share</small><strong>{money.format(activeHolding.price)}</strong></span><span><small>Gain / loss vs. cost</small><strong className={totalGain !== undefined && totalGain < 0 ? styles.down : styles.up}>{totalGain === undefined ? "Not available" : signedMoney(totalGain)}</strong></span></div><Link className={styles.research} href={`/discover?q=${encodeURIComponent(activeHolding.symbol)}`}>Research {activeHolding.symbol}<ArrowUpRight size={16} aria-hidden="true"/></Link></> : <><div><span className={styles.label}>The big picture</span><h3>{largest ? `${largest.symbol} is your biggest piece.` : "Your portfolio starts here."}</h3><p>{largest ? `About $${largest.percent.toFixed(0)} of every $100 is in ${largest.symbol}.` : "Your holdings will appear here once they’re added."}</p></div><span className={styles.detailHint}>Select a holding for the details.<br/>Press Escape to clear your selection.</span></>}
      </div>
    </section>

    <section className={styles.tableCard} aria-labelledby="all-holdings-title"><h2 id="all-holdings-title">Your holdings</h2><div className="table-wrap"><table className="table"><thead><tr><th scope="col">Investment</th><th scope="col">Shares</th><th scope="col">Your mix</th><th scope="col">Value</th><th scope="col">Today</th></tr></thead><tbody>{portfolio.holdings.map(holding=>{
      const value = marketValue(holding);
      const percent = summary.totalValue ? value / summary.totalValue * 100 : 0;
      const daily = holding.previousClose ? (holding.price - holding.previousClose) / holding.previousClose * 100 : null;
      const colorIndex = summary.allocations.findIndex(a=>a.symbol === holding.symbol);
      return <tr key={holding.symbol} className={selected === holding.symbol ? styles.selectedRow : ""}><td><span className={styles.tableSymbol}><span className={styles.dot} style={{background:colors[colorIndex % colors.length]}}/><strong>{holding.symbol}</strong></span><span className="muted small">{holding.name}</span></td><td>{holding.quantity}</td><td>{percent.toFixed(1)}%</td><td>{money.format(value)}</td><td className={daily !== null && daily < 0 ? "negative" : "positive"}>{daily === null ? "—" : `${daily >= 0 ? "+" : ""}${daily.toFixed(2)}%`}</td></tr>;
    })}</tbody></table></div></section>
    <p className={styles.source}>{portfolio.source === "sample" ? "Sample holdings" : "Portfolio holdings"} · {asOf} · Values and chart use the same holdings. Rounded percentages may not add up to exactly 100%.</p>
  </div>;
}
