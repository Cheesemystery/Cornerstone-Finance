"use client";

import { ArrowDownRight, ArrowRight, ArrowUpRight, BookOpen, ChevronDown, Clock3, ExternalLink, Info, LockKeyhole, RefreshCw, ShieldCheck } from "lucide-react";
import { useState } from "react";
import type { Briefing, PortfolioSnapshot } from "@/lib/domain";
import { marketValue, summarizePortfolio } from "@/lib/portfolio";

const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

export function BriefingDashboard({ briefing, portfolio }: { briefing: Briefing; portfolio: PortfolioSnapshot }) {
  const [expanded, setExpanded] = useState<string | null>(briefing.events[0]?.id ?? null);
  const summary = summarizePortfolio(portfolio);
  const positive = briefing.facts.dayChange >= 0;

  return (
    <>
      <section className="topbar">
        <div><p className="eyebrow">Tuesday, September 2</p><h1>Good evening, Alex.</h1></div>
        <div className="data-status"><span className="status-dot" /><div><strong>Market closed</strong><small>Data as of 4:00 PM ET · Delayed</small></div><button aria-label="Refresh data"><RefreshCw size={17} /></button></div>
      </section>

      <section className="briefing-hero">
        <div className="briefing-lead">
          <div className="section-label"><span>Today’s briefing</span><span className="source-pill"><ShieldCheck size={13} /> Sourced</span></div>
          <h2>Your portfolio finished <span className={positive ? "positive" : "negative"}>{positive ? "higher" : "lower"}</span> today.</h2>
          <p>{briefing.facts.topContributor} led the move. Your allocation remains broadly balanced, with one position worth reviewing for concentration.</p>
          <div className="hero-actions"><a href="#attention" className="button primary">Review what matters <ArrowDownRight size={17} /></a><a href="/discover" className="button secondary">Research a holding</a></div>
        </div>
        <div className="portfolio-total">
          <p>Portfolio value</p><strong>{money.format(briefing.facts.totalValue)}</strong>
          <span className={positive ? "change-positive" : "change-negative"}>{positive ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}{money.format(Math.abs(briefing.facts.dayChange))} ({Math.abs(briefing.facts.dayChangePercent).toFixed(2)}%) today</span>
          <div className="sparkline" aria-label="Illustrative intraday portfolio chart"><svg viewBox="0 0 320 70" role="img"><title>Portfolio value increased through the day</title><path d="M2 58 C34 54,52 63,80 47 S128 50,154 33 S203 42,226 24 S270 29,318 8" fill="none" stroke="currentColor" strokeWidth="2.5" /><path d="M2 58 C34 54,52 63,80 47 S128 50,154 33 S203 42,226 24 S270 29,318 8 V70 H2 Z" fill="url(#area)" /><defs><linearGradient id="area" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="currentColor" stopOpacity=".16"/><stop offset="1" stopColor="currentColor" stopOpacity="0"/></linearGradient></defs></svg></div>
          <small>Illustrative intraday movement · sample data</small>
        </div>
      </section>

      <section className="metrics-grid" aria-label="Portfolio summary">
        <div className="metric-card"><p>Today’s change</p><strong className="positive">+{money.format(Math.abs(briefing.facts.dayChange))}</strong><span>Across {portfolio.holdings.length} holdings</span></div>
        <div className="metric-card"><p>Largest position</p><strong>{briefing.facts.largestPositionPercent.toFixed(0)}%</strong><span>{summary.allocations[0]?.symbol} of total value</span></div>
        <div className="metric-card"><p>Diversification</p><strong>Good</strong><span>3 asset categories</span></div>
        <div className="metric-card"><p>Cash available</p><strong>$240</strong><span>3.5% of portfolio</span></div>
      </section>

      <section className="content-grid" id="attention">
        <div>
          <div className="section-heading"><div><p className="eyebrow">Prioritized for you</p><h2>What deserves attention</h2></div><span>{briefing.events.length} items</span></div>
          <div className="event-list">
            {briefing.events.map((event, index) => {
              const isOpen = expanded === event.id;
              return <article className="event-card" key={event.id}>
                <button className="event-summary" onClick={() => setExpanded(isOpen ? null : event.id)} aria-expanded={isOpen}>
                  <span className={`event-number priority-${event.priority}`}>{String(index + 1).padStart(2, "0")}</span>
                  <span className="event-copy"><small>{event.kind} · {event.symbols.join(", ") || "Market"}</small><strong>{event.headline}</strong></span>
                  <ChevronDown className={isOpen ? "rotate" : ""} size={18} />
                </button>
                {isOpen && <div className="event-detail"><p>{event.summary}</p><div className="event-footer"><span><Clock3 size={14} /> {event.sources[0]?.label} · 4:00 PM ET</span>{event.researchPrompt && <a href={`/discover?q=${encodeURIComponent(event.symbols[0] ?? "market")}`}>Investigate <ArrowRight size={15}/></a>}</div></div>}
              </article>;
            })}
          </div>
        </div>
        <aside className="side-stack">
          <div className="panel holdings-panel"><div className="panel-title"><div><p className="eyebrow">Allocation</p><h3>Your holdings</h3></div><a href="/portfolio">View details</a></div>
            {portfolio.holdings.map((holding) => {
              const value = marketValue(holding); const allocation = (value / summary.totalValue) * 100; const daily = ((holding.price - holding.previousClose) / holding.previousClose) * 100;
              return <div className="holding-row" key={holding.symbol}><div className="ticker">{holding.symbol.slice(0,2)}</div><div><strong>{holding.symbol}</strong><span>{holding.name}</span></div><div className="holding-value"><strong>{money.format(value)}</strong><span className={daily >= 0 ? "positive" : "negative"}>{daily >= 0 ? "+" : ""}{daily.toFixed(2)}%</span></div><div className="allocation-bar"><span style={{width:`${allocation}%`}} /></div></div>;
            })}
          </div>
          <div className="panel principle-card"><BookOpen size={20}/><p className="eyebrow">One useful principle</p><h3>Price movement is not a decision.</h3><p>A daily move tells you what happened—not what you should do. Start with the cause, then compare it with your time horizon.</p><a href="/learn">Learn about market volatility <ExternalLink size={14}/></a></div>
          <div className="security-strip"><LockKeyhole size={17}/><span><strong>Read-only portfolio.</strong> No trading permissions.</span><button aria-label="Learn about security"><Info size={16}/></button></div>
        </aside>
      </section>
      <p className="disclosure">{briefing.disclosure}</p>
    </>
  );
}
