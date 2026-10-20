"use client";

import { Dialog } from "radix-ui";
import Link from "next/link";
import { useRef, useState, type PointerEvent } from "react";
import type { HistoricalData } from "@/lib/historical-data";
import type { PortfolioWeek } from "@/lib/weekly-portfolio";
import { weeklyCopy } from "@/lib/weekly-portfolio";
import { lessons } from "@/lib/lessons";
import { editionRange, weeklyEditorial } from "@/lib/weekly-editorial";
import { displayDate, signedMoney } from "@/lib/presentation";
import { WeeklyWeatherIcon } from "./weekly-weather";
import { LearningWallSnapshot } from "./learning-wall-snapshot";
import { WeeklySharePreview } from "./weekly-share-preview";
import styles from "./weekly-story.module.css";

type StoryData = {week:PortfolioWeek;history:HistoricalData;completed:readonly string[];reducedMotion:boolean;learningAsOf:string};
type Props = StoryData & {beginWeek:() => void};
const CARD_COUNT = 4;
const SWIPE_DISTANCE = 45;

export function WeeklyStory({beginWeek,...data}: Props) {
  const [open,setOpen] = useState(false);
  const [snapshot,setSnapshot] = useState<StoryData | null>(null);
  return <Dialog.Root open={open} onOpenChange={value => { if (value) setSnapshot(data); setOpen(value); }}>
    <Dialog.Trigger className={styles.replay}>Replay your week</Dialog.Trigger>
    {open && snapshot && <Dialog.Portal>
      <Dialog.Overlay className={styles.overlay} />
      <Dialog.Content className={styles.dialog} aria-modal="true" data-reduced-motion={data.reducedMotion || undefined}>
        <Dialog.Title className="sr-only">Replay your week</Dialog.Title>
        <StoryCards {...snapshot} beginWeek={beginWeek} close={() => setOpen(false)} />
      </Dialog.Content>
    </Dialog.Portal>}
  </Dialog.Root>;
}

function StoryCards({week,history,completed,learningAsOf,beginWeek,close}: StoryData & {beginWeek:() => void;close:() => void}) {
  const [card,setCard] = useState(0);
  const [sharing,setSharing] = useState(false);
  const pointer = useRef<{x:number;y:number} | null>(null);
  const suppressTap = useRef(false);
  const editorial = weeklyEditorial(week.percent);
  const lesson = lessons.find(lesson => lesson.id === week.lessonId) ?? lessons[0];
  const titles = [editorial.headline,"The biggest driver",lesson.title,"See you Monday"];
  const move = (delta: number) => { setCard(current => Math.max(0,Math.min(CARD_COUNT - 1,current + delta))); setSharing(false); };
  function swipeEnd(event: PointerEvent<HTMLDivElement>) {
    if (!pointer.current || sharing) return;
    const dx = event.clientX - pointer.current.x, dy = event.clientY - pointer.current.y;
    pointer.current = null;
    if (Math.abs(dx) >= SWIPE_DISTANCE && Math.abs(dx) > Math.abs(dy) * 1.3) { suppressTap.current = true; move(dx < 0 ? 1 : -1); }
  }
  return <div className={styles.shell} onKeyDown={event => {
    if (sharing || (event.target instanceof Element && event.target.closest("input"))) return;
    if (event.key === "ArrowRight" || event.key === "ArrowLeft") { event.preventDefault(); move(event.key === "ArrowRight" ? 1 : -1); }
  }}>
    <header className={styles.header}>
      <div><p className={styles.masthead}>The Cornerstone Weekly</p><Dialog.Description className={styles.edition}>{editionRange(week.startDate,week.endDate)}<br />{history.mode === "sample" ? "Sample data - as of " : "Closing prices - as of "}{displayDate(week.endDate)}</Dialog.Description></div>
      <Dialog.Close className={styles.close}>Close</Dialog.Close>
    </header>
    <div className={styles.viewport} onPointerDown={event => { if (event.pointerType !== "mouse") pointer.current = {x:event.clientX,y:event.clientY}; }} onPointerUp={swipeEnd} onPointerCancel={() => {pointer.current = null;}}
      onClick={event => {
        if (suppressTap.current) { suppressTap.current = false; return; }
        if (sharing || (event.target instanceof Element && event.target.closest("button,a,input,label,canvas"))) return;
        const bounds = event.currentTarget.getBoundingClientRect(); move(event.clientX < bounds.left + bounds.width / 2 ? -1 : 1);
      }}>
      <section key={card} className={`${styles.card} ${card === 0 ? styles.darkCard : ""} ${sharing ? styles.sharingCard : ""}`} role="group" aria-roledescription="slide" aria-label={`Card ${card + 1} of ${CARD_COUNT}`}>
        {card === 0 && <><WeeklyWeatherIcon weather={editorial.weather} /><h2>{editorial.headline}</h2></>}
        {card === 1 && <><h2>The biggest driver</h2>{week.driver ? <>
          <p className={styles.driverLabel}>{week.driver.ticker} <span>{signedMoney(Number(week.driver.contribution.toFixed(2)))}</span></p>
          <svg className={styles.driverBar} viewBox="0 0 100 28" preserveAspectRatio="none" width="100%" height="28" role="img" aria-label={`${week.driver.ticker} ${week.driver.contribution < 0 ? "pulled down" : week.driver.contribution > 0 ? "lifted" : "left unchanged"} the portfolio by ${signedMoney(Number(week.driver.contribution.toFixed(2)))} as of ${displayDate(week.endDate)}`}>
            <line x1="50" x2="50" y1="0" y2="28" stroke="#52614f" vectorEffect="non-scaling-stroke" />
            <rect x={week.driver.contribution < 0 ? 3 : 50} y="7" width={week.driver.contribution === 0 ? 0 : 47} height="14" rx="1" fill={week.driver.contribution < 0 ? "#ba9979" : "#849d77"} />
          </svg><p>{weeklyCopy(week)[0]}</p>
        </> : <p>No holding made a material contribution this week.</p>}</>}
        {card === 2 && <><h2>{lesson.title}</h2><Link className="button lime" href={`/learn/${lesson.id}?weekly=1`} onClick={() => {beginWeek();close();}}>Start lesson</Link></>}
        {card === 3 && <><h2>See you Monday</h2>{sharing ? <WeeklySharePreview week={week} history={history} completed={completed} learningAsOf={learningAsOf} /> : <><LearningWallSnapshot completed={completed} asOf={learningAsOf} /><button type="button" className="button lime" onClick={() => setSharing(true)}>Share</button></>}</>}
      </section>
    </div>
    <footer className={styles.navigation}>
      <button type="button" className={styles.arrow} aria-label="Previous card" disabled={card === 0} onClick={() => move(-1)}>←</button>
      <div className={styles.dots} aria-label="Story cards">{titles.map((title,index) => <button type="button" key={index} aria-label={`Card ${index + 1}: ${title}`} aria-current={index === card ? "step" : undefined} onClick={() => {setCard(index);setSharing(false);}}><span /></button>)}</div>
      <button type="button" className={styles.arrow} aria-label="Next card" disabled={card === CARD_COUNT - 1} onClick={() => move(1)}>→</button>
    </footer>
    <span className="sr-only" aria-live="polite" aria-atomic="true">Card {card + 1} of {CARD_COUNT}: {titles[card]}</span>
  </div>;
}
