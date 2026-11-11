"use client";
import Link from "next/link";
import { CampusLeaderboard } from "./campus-leaderboard";
import { RothSimulatorLaunch } from "./roth-flight-simulator";
import { FinalCornerstoneHook } from "./final-cornerstone-hook";
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
import { dayKey, nextLesson } from "@/lib/learning-progress";
import styles from "./home-dashboard.module.css";
export function HomeDashboard() {
 const {historyStatus,history,week,beginWeek,weekDone,retryHistory,savedHoldings,preferences}=useDemo();
 const ready=historyStatus==="ready"&&week&&history;
 const {learning,now}=useMvp();
 const next=nextLesson(learning),beginner=!learning.completed.length;
 const completed=lessons.filter(lesson=>learning.completed.includes(lesson.id)).length;
 const done=ready&&weekDone&&learning.completed.includes(week.lessonId);
 const editorial=ready?weeklyEditorial(week.percent):null;
 const percentLabel=ready?`${Math.abs(week.percent).toFixed(WEEK_PERCENT_DECIMALS)}%`:"";
 const recommended=ready?lessons.find(l=>l.id===week.lessonId):undefined;
 const loading=historyStatus==="loading",failed=historyStatus==="error";
 return <div className={`weekly-home tabular-nums ${styles.frontPage} ${preferences.proView?styles.pro:""}`} data-pro-view={preferences.proView||undefined} data-beginner={beginner}>
 <CampusLeaderboard compact/>
 <RothSimulatorLaunch/>
 <FinalCornerstoneHook/>
 {beginner&&<section className="beginner-invitation" aria-labelledby="beginner-invitation-title"><div><p className="eyebrow">New to investing? You’re in the right place.</p><h2 id="beginner-invitation-title">Understand your money, one idea at a time.</h2><p>Cornerstone teaches investing through short lessons and fictional examples. You don’t need an account, a portfolio, or any investing experience.</p><p className="beginner-route">Learn a concept → Try it → Check your understanding → Build your foundation</p></div><div><Link className="button primary" href="/learn/what-you-own">Start learning · {lessons[0].minutes} min</Link><small>Stocks, bonds and funds · progress saved in this browser</small></div></section>}
 <header className={styles.masthead}><p className={styles.name}>The Cornerstone Weekly</p>{ready&&<p className={styles.edition}>{editionRange(week.startDate,week.endDate)}</p>}{ready&&<WeeklyStory week={week} history={history} completed={learning.completed} learningAsOf={dayKey(now??new Date(),learning.timezone)} reducedMotion={learning.reducedMotion} beginWeek={beginWeek}/>}{history&&<div className={styles.source}><WeekSource history={history} endDate={week?.endDate}/></div>}</header>
 {ready&&recommended&&<section className="weekly-learning-bridge" aria-label="This week’s learning concept"><div><p className="eyebrow">{done ? "Your next cornerstone" : "From this week’s numbers to a useful idea"}</p><h2>{done ? next?.title ?? "A foundation worth keeping." : recommended.title}</h2><p>{done ? next?.takeaway ?? "Keep your knowledge fresh with a short review." : recommended.takeaway}</p><small>{done ? next ? `${next.minutes} min · One new lesson, one new stone` : "All lessons completed · Review whenever you like" : `${recommended.minutes} min · ${recommended.tag} · educational lesson`}</small></div>{done?<div><div className={styles.foundationSummary}><p className={styles.done} role="status">{completed===lessons.length ? `All ${lessons.length} foundation stones complete! Review any lesson at your pace.` : `Foundation Progress: ${completed} of ${lessons.length} stones laid`}</p><div className={styles.foundationPills} aria-hidden="true">{lessons.map(lesson=><span key={lesson.id} data-laid={learning.completed.includes(lesson.id)}/>)}</div></div><Link className="button primary week-lesson-action" href={next ? `/learn/${next.id}` : "/learn/review"}>{next ? `Continue learning: ${next.title} →` : "Practice what you’ve learned →"}</Link></div>:<Link className="button primary week-lesson-action" href={`/learn/${week.lessonId}?weekly=1`} onClick={beginWeek}>Explore this week’s lesson</Link>}</section>}
 <section className={`week-hero ${styles.hero}`} aria-labelledby="your-week-title">{ready?<>
 {history.mode==="sample"&&savedHoldings.source!=="sample"&&<small>Sample closes applied to your saved share counts.</small>}
 <div className={styles.forecast}><h1 id="your-week-title" className={styles.headline}>{preferences.proView?<>{editorial!.headline.slice(0,-percentLabel.length)}<span className={styles.proNumeral}>{percentLabel}</span></>:editorial!.headline}{" "}<span className={styles.result}>({signedMoney(Number(week.change.toFixed(2)))})</span></h1><WeeklyWeatherIcon weather={editorial!.weather}/></div>
 <p className="weekly-context">Closing-price change · {editionRange(week.startDate,week.endDate)} · {week.change<0?"Value decreased":week.change>0?"Value increased":"Value unchanged"}</p><WeeklyTugChart key={week.identity} week={week} compact={preferences.proView}/><p className={styles.subline}>Week-to-week moves are mostly noise.</p>
 </>:<><h1 id="your-week-title" className={styles.headline}>{loading?"Putting your edition together":failed?"Your edition needs a moment":"Your first edition is waiting"}</h1>{loading?<><p role="status" className={styles.stateCopy}>Checking your saved holdings and dated closes…</p><div className={styles.skeleton} aria-hidden="true"><span/><span/><span/></div></>:<><p className={styles.stateCopy} role={failed?"alert":undefined}>{failed?"We couldn’t check closing prices just now. Your saved holdings are still here. Try again, or explore the sample while you wait.":historyStatus==="empty"?"Add your holdings or explore the sample. You can start learning while your first edition takes shape.":"We need closing prices at least seven calendar days apart for all your holdings. Try different holdings or explore the sample. You can start learning in the meantime."}</p>{failed&&<button className="button secondary" type="button" onClick={retryHistory}>Retry closing prices</button>}<HoldingsInput/></>}</>}</section>

 {!ready&&!loading&&<Link className={`button ${beginner?"secondary":"lime"} week-lesson-action`} href={next?`/learn/${next.id}`:"/learn/review"}>{beginner?"Start your first lesson":next?"Continue learning":"Review a lesson"}</Link>}
 <LearningWall animationsReady={historyStatus!=="loading"} chartEntranceMs={ready?400+Math.max(0,week.positions.length-1)*60:0}/>
 </div>;
}
