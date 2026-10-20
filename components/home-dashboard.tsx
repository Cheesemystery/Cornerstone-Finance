"use client";
import Link from "next/link";
import { useDemo } from "./demo-provider";
import { HoldingsInput } from "./holdings-input";
import { WeekSource } from "./week-source";
import { signedMoney } from "@/lib/presentation";
import { editionRange, weeklyEditorial, weeklySubline, WEEK_PERCENT_DECIMALS } from "@/lib/weekly-editorial";
import { WeeklyWeatherIcon } from "./weekly-weather";
import { WeeklyTugChart } from "./weekly-tug-chart";
import { LearningWall } from "./learning-wall";
import { useMvp } from "./mvp-provider";
import { WeeklyStory } from "./weekly-story";
import { dayKey } from "@/lib/learning-progress";
import { HomeProHoldings } from "./home-pro-holdings";
import styles from "./home-dashboard.module.css";

export function HomeDashboard() {
  const { historyStatus, history, week, beginWeek, weekDone, retryHistory, savedHoldings, preferences } = useDemo();
  const ready = historyStatus === "ready" && week && history;
  const {learning,now} = useMvp();
  const done = ready && weekDone && learning.completed.includes(week.lessonId);
  const editorial = ready ? weeklyEditorial(week.percent) : null;
  const percentLabel = ready ? `${Math.abs(week.percent).toFixed(WEEK_PERCENT_DECIMALS)}%` : "";
  return <div className={`weekly-home ${styles.frontPage} ${preferences.proView ? styles.pro : ""}`} data-pro-view={preferences.proView || undefined}>
    <header className={styles.masthead}>
      <p className={styles.name}>The Cornerstone Weekly</p>
      {ready && <p className={styles.edition}>{editionRange(week.startDate, week.endDate)}</p>}
      {ready && <WeeklyStory week={week} history={history} completed={learning.completed} learningAsOf={dayKey(now ?? new Date(),learning.timezone)} reducedMotion={learning.reducedMotion} beginWeek={beginWeek} />}
      {ready && <div className={styles.source}><WeekSource history={history} endDate={week.endDate} /></div>}
    </header>
    <section className={`week-hero ${styles.hero}`} aria-labelledby="your-week-title">
      {ready ? <>
        {history.mode === "sample" && savedHoldings.source !== "sample" && <small>Sample closes applied to your saved share counts.</small>}
        <div className={styles.forecast}>
          <h1 id="your-week-title" className={styles.headline}>{preferences.proView ? <>{editorial!.headline.slice(0,-percentLabel.length)}<span className={styles.proNumeral}>{percentLabel}</span></> : editorial!.headline}</h1>
          <WeeklyWeatherIcon weather={editorial!.weather} />
        </div>
        <p className={styles.subline}>{weeklySubline(week)}</p>
        <div className={styles.result} aria-label="Portfolio week change"><strong>{signedMoney(Number(week.change.toFixed(2)))}</strong></div>
        <WeeklyTugChart key={week.identity} week={week} compact={preferences.proView} />
        {preferences.proView && <HomeProHoldings week={week} />}
      </> : <>
        <h1 id="your-week-title" className={styles.headline}>Your week</h1>
        <p>{historyStatus === "loading" ? "Checking your saved holdings and dated closes…" : historyStatus === "empty" ? "Add your holdings to see your week, or explore the sample portfolio." : historyStatus === "error" ? "We couldn’t check the closing prices. Try again, adjust your holdings, or explore the sample." : "Your holdings need closes at least seven calendar days apart on shared dates. Adjust your holdings or explore the sample."}</p>
        {history && <WeekSource history={history} />}
        {historyStatus !== "loading" && <HoldingsInput />}
        {historyStatus === "error" && <button className="button secondary" onClick={retryHistory}>Retry closing prices</button>}
      </>}
    </section>
    {ready && (done ? <p className={styles.done} role="status">This week’s stone is laid. See you Monday.</p> : <Link className="button lime week-lesson-action" href={"/learn/" + week.lessonId + "?weekly=1"} onClick={beginWeek}>Start your 2-minute lesson</Link>)}
    <LearningWall animationsReady={historyStatus !== "loading"} chartEntranceMs={ready ? 400 + Math.max(0, week.positions.length - 1) * 60 : 0} />
  </div>;
}
