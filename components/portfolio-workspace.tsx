"use client";
import { useEffect, useRef, useState } from "react";
import { useDemo } from "./demo-provider";
import { HoldingsInput } from "./holdings-input";
import { editionRange } from "@/lib/weekly-editorial";
import { WeekSource } from "./week-source";
import { DemoPortfolio } from "./demo-portfolio";
import { PracticeWorkspace } from "./practice-workspace";
import Link from "next/link";
import { LearningSummary } from "./learning-summary";
import { LearningRecap } from "./learning-recap";
import { PortfolioRecap } from "./portfolio-recap";
export function PortfolioWorkspace() {
  const recap = useRef<HTMLDivElement>(null);
  useEffect(()=>{
    const reveal=()=>{if(window.location.hash === "#recap") {recap.current?.focus({preventScroll:true});recap.current?.scrollIntoView({block:"start"});}};
    reveal();window.addEventListener("hashchange",reveal);
    return ()=>window.removeEventListener("hashchange",reveal);
  },[]);
  const [mode, setMode] = useState("holdings");
  const { historyStatus, history, week, retryHistory } = useDemo();
  return <div className="tabular-nums">
    {mode === "holdings" && history && (history.mode === "sample" && week ? <p className="week-source week-sample-banner" role="note">Demo Portfolio · {editionRange(week.startDate,week.endDate)}</p> : <WeekSource history={history} endDate={week?.endDate} />)}
    <div className="portfolio-mode-toggle" role="group" aria-label="Portfolio mode">
      <button aria-pressed={mode === "holdings"} onClick={() => setMode("holdings")}>My Portfolio</button>
      <button aria-pressed={mode === "practice"} onClick={() => setMode("practice")}>Practice Sandbox</button>
    </div>
    {mode === "practice" ? <PracticeWorkspace /> : <>
      {historyStatus === "ready" ? <DemoPortfolio controls={<details className="privacy-detail"><summary>Manage holdings</summary><HoldingsInput manage /></details>} /> : <>
        <section className="mvp-card holdings-manager"><h2>Holdings</h2><HoldingsInput manage /></section>
        <p role="status">{historyStatus === "loading" ? "Checking dated closing prices…" : historyStatus === "empty" ? "Your saved holdings and their weekly breakdown will appear here." : "We need complete closes at least seven calendar days apart for every ticker. Try another set of holdings or use the sample."}</p>
      </>}
      {historyStatus === "error" && <button className="button secondary" onClick={retryHistory}>Retry closing prices</button>}
    </>}
    <div id="recap" ref={recap} tabIndex={-1} role="region" aria-label="Learning recap" className="workspace">
      <LearningSummary />
      <Link className="demo-link" href="/recap">Open full Recap →</Link>
      <details className="recap-learning-disclosure"><summary>Learning milestones, history & sharing</summary><LearningRecap embedded /></details>
      {(historyStatus === "ready" || mode === "practice") && <details className="portfolio-recap-fold"><summary>Your portfolio recap</summary><PortfolioRecap key={mode} embedded showLearning={false} initialMode={mode === "practice" ? "practice" : "snapshot"} /></details>}
    </div>
  </div>;
}
