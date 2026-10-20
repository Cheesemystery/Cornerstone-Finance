"use client";
import Link from "next/link";
import { useDemo } from "./demo-provider";
import { HoldingsInput } from "./holdings-input";
import { WeekSource } from "./week-source";
import { signedMoney } from "@/lib/presentation";
import { editionRange, weeklyEditorial, WEEK_PERCENT_DECIMALS } from "@/lib/weekly-editorial";
import { lessons } from "@/lib/lessons";
import { WeeklyWeatherIcon } from "./weekly-weather";
import { WeeklyTugChart } from "./weekly-tug-chart";
import { LearningWall } from "./learning-wall";
import { useMvp } from "./mvp-provider";
import { WeeklyStory } from "./weekly-story";
import { dayKey } from "@/lib/learning-progress";
import styles from "./home-dashboard.module.css";

export function HomeDashboard() {
  const { historyStatus, history, week, beginWeek, weekDone, retryHistory, savedHoldings, preferences } = useDemo();
  const ready = historyStatus === "ready" && week && history;
  const {learning,now} = useMvp();
  const done = ready && weekDone && learning.completed.includes(week.lessonId);
  const editorial = ready ? weeklyEditorial(week.percent) : null;
  const percentLabel = ready ? `${Math.abs(week.percent).toFixed(WEEK_PERCENT_DECIMALS)}%` : "";
  const loading = historyStatus === "loading";
  const failed = historyStatus === "error";
  return <div className={`weekly-home tabular-nums ${styles.frontPage} ${preferences.proView ? styles.pro : ""}`} data-pro-view={preferences.proView || undefined}>
    <header className={styles.masthead}>
      <p className={styles.name}>The Cornerstone Weekly</p>
      {ready && <p className={styles.edition}>{editionRange(week.startDate, week.endDate)}</p>}
      {ready && <WeeklyStory week={week} history={history} completed={learning.completed} learningAsOf={dayKey(now ?? new Date(),learning.timezone)} reducedMotion={learning.reducedMotion} beginWeek={beginWeek} />}
      {history && <div className={styles.source}><WeekSource history={history} endDate={week?.endDate} /></div>}
    </header>
    <section className={`week-hero ${styles.hero}`} aria-labelledby="your-week-title">
      {ready ? <>
        {history.mode === "sample" && savedHoldings.source !== "sample" && <small>Sample closes applied to your saved share counts.</small>}
        <div className={styles.forecast}>
          <h1 id="your-week-title" className={styles.headline}>{preferences.proView ? <>{editorial!.headline.slice(0,-percentLabel.length)}<span className={styles.proNumeral}>{percentLabel}</span></> : editorial!.headline}{" "}<span className={styles.result}>({signedMoney(Number(week.change.toFixed(2)))})</span></h1>
          <WeeklyWeatherIcon weather={editorial!.weather} />
        </div>
        <WeeklyTugChart key={week.identity} week={week} compact={preferences.proView} />
        <p className={styles.subline}>Week-to-week moves are mostly noise.</p>
      </> : <>
        <h1 id="your-week-title" className={styles.headline}>{loading ? "Putting your edition together" : failed ? "Your edition needs a moment" : "Your first edition is waiting"}</h1>
        {loading ? <>
          <p role="status" className={styles.stateCopy}>Checking your saved holdings and dated closes…</p>
          <div className={styles.skeleton} aria-hidden="true"><span /><span /><span /></div>
        </> : <>
          <p className={styles.stateCopy} role={failed ? "alert" : undefined}>{failed ? "We couldn’t check closing prices just now. Your saved holdings are still here. Try again, or explore the sample while you wait." : historyStatus === "empty" ? "Add your holdings or explore the sample. You can start learning while your first edition takes shape." : "We need closing prices at least seven calendar days apart for all your holdings. Try different holdings or explore the sample. You can start learning in the meantime."}</p>
          {failed && <button type="button" className="button secondary" onClick={retryHistory}>Retry closing prices</button>}
          <HoldingsInput />
        </>}
      </>}
    </section>
    {ready && (done ? <p className={styles.done} role="status">This week’s stone is laid. See you Monday.</p> : <Link className="button lime week-lesson-action" href={"/learn/" + week.lessonId + "?weekly=1"} onClick={beginWeek}>Start your 2-minute lesson</Link>)}
    {!ready && !loading && <Link className="button lime week-lesson-action" href={"/learn/" + lessons[0].id}>Start your first lesson</Link>}
    <LearningWall animationsReady={historyStatus !== "loading"} chartEntranceMs={ready ? 400 + Math.max(0, week.positions.length - 1) * 60 : 0} />
  </div>;
}
