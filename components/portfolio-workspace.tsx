"use client";
import { useState } from "react";
import { useDemo } from "./demo-provider";
import { HoldingsInput } from "./holdings-input";
import { WeekSource } from "./week-source";
import { DemoPortfolio } from "./demo-portfolio";
import { PracticeWorkspace } from "./practice-workspace";
import { PortfolioRecap } from "./portfolio-recap";
export function PortfolioWorkspace() {
  const [mode, setMode] = useState("holdings");
  const { historyStatus, history, week, retryHistory } = useDemo();
  return <>
    <div className="portfolio-mode-toggle" role="group" aria-label="Portfolio mode">
      <button aria-pressed={mode === "holdings"} onClick={() => setMode("holdings")}>Your holdings</button>
      <button aria-pressed={mode === "practice"} onClick={() => setMode("practice")}>Fictional practice</button>
    </div>
    {mode === "practice" ? <PracticeWorkspace /> : <>
      <section className="mvp-card holdings-manager"><h2>Holdings</h2><HoldingsInput manage /></section>
      {history && <WeekSource history={history} endDate={week?.endDate} />}
      {historyStatus === "ready" ? <DemoPortfolio /> : <p role="status">{historyStatus === "loading" ? "Checking dated closing prices…" : historyStatus === "empty" ? "Your saved holdings and their weekly breakdown will appear here." : "We need complete closes at least seven calendar days apart for every ticker. Try another set of holdings or use the sample."}</p>}
      {historyStatus === "error" && <button className="button secondary" onClick={retryHistory}>Retry closing prices</button>}
    </>}
    {(historyStatus === "ready" || mode === "practice") && <details className="portfolio-recap-fold" id="recap"><summary>Your recap & lesson history</summary><PortfolioRecap key={mode} embedded initialMode={mode === "practice" ? "practice" : "snapshot"} /></details>}
  </>;
}
