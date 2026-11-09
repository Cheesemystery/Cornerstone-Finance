"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { BUILDING_CAPACITY, BRICK_DROP_MS, buildingSkins, laidBrickCount, useBuildingChoice, type BuildingSkin } from "@/lib/building";
import { stoneAppearance } from "@/lib/stone-wall";
import { useMvp } from "./mvp-provider";
import styles from "./learning-building.module.css";

function subscribeMotion(notify: () => void) {
  const media = matchMedia("(prefers-reduced-motion: reduce)");
  media.addEventListener("change", notify);
  return () => media.removeEventListener("change", notify);
}

export function BuildingDrawing({ completed, skin, incomingIndex = null, reduced = false, onSettled, decorative = false }: {
  completed: readonly string[];
  skin: BuildingSkin;
  incomingIndex?: number | null;
  reduced?: boolean;
  onSettled?: () => void;
  decorative?: boolean;
}) {
  const count = laidBrickCount(completed);
  return <svg viewBox="0 0 400 400" className={styles.drawing} role={decorative ? undefined : "img"}
    aria-hidden={decorative || undefined} aria-label={decorative ? undefined : `Your building: ${count} of ${BUILDING_CAPACITY} bricks laid`}
    data-skin={skin} data-reduced-motion={reduced || undefined}>
    <g className={styles.frame}>
      {skin === "campus" ? <><path d="M18 64 200 10 382 64ZM26 374H374M30 70V367M370 70V367" /><path d="M20 76H38M362 76H380M20 362H38M362 362H380" /></>
        : skin === "library" ? <><path d="M30 50H370V70H30ZM36 70V370H364V70M20 378H380" /><path d="M60 50V70M130 50V70M200 50V70M270 50V70M340 50V70" /></>
          : <><path d="M30 370V64H95V38H160V12H240V38H305V64H370V370ZM20 378H380" />{[90,140,190,240,290,340].map(y => <g key={y}><rect x="15" y={y} width="12" height="20" /><rect x="373" y={y} width="12" height="20" /></g>)}</>}
    </g>
    {Array.from({length:BUILDING_CAPACITY}, (_, index) => {
      const appearance = stoneAppearance(`building-brick-${index}`);
      const laid = index < count;
      const incoming = laid && index === incomingIndex;
      return <g key={index} transform={`translate(${43 + index % 4 * 80} ${76 + (5 - Math.floor(index / 4)) * 48})`} data-brick={index + 1} data-laid={laid}>
        <g className={incoming ? styles.incoming : undefined} data-incoming={incoming || undefined} onAnimationEnd={incoming ? onSettled : undefined}>
          <path d={appearance.path} transform="scale(.74 .65625)" className={laid ? styles.laid : styles.empty} fill={laid ? appearance.tint : undefined} />
        </g>
      </g>;
    })}
  </svg>;
}

function BuildingPicker({ completed, skin, onChoose }: {completed:readonly string[];skin:BuildingSkin;onChoose:(skin:BuildingSkin)=>void}) {
  const first = useRef<HTMLButtonElement>(null);
  useEffect(() => { first.current?.focus(); }, []);
  return <div>
    <h2>Choose your building</h2>
    <div className={styles.picker} role="group" aria-label="Building choices">
      {buildingSkins.map((option, index) => <button ref={index === 0 ? first : undefined} type="button" key={option.id} className={styles.skin} aria-pressed={skin === option.id} onClick={() => onChoose(option.id)}>
        <BuildingDrawing completed={completed} skin={option.id} decorative />
        <span>{option.label}</span>
      </button>)}
    </div>
  </div>;
}

export function LearningBuildingCard() {
  const {learning} = useMvp();
  const {choice, choose} = useBuildingChoice();
  const [picking, setPicking] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const wasPicking = useRef(false);
  useEffect(() => {
    if (wasPicking.current && !picking) trigger.current?.focus();
    wasPicking.current = picking;
  }, [picking]);
  return <section className={`mvp-card ${styles.compact} tabular-nums`} aria-labelledby={picking ? undefined : "your-building-title"} aria-label={picking ? "Your building" : undefined}>
    {picking ? <BuildingPicker completed={learning.completed} skin={choice.skin} onChoose={skin => {choose(skin);setPicking(false);}} /> : <>
      <div className={styles.preview}><BuildingDrawing completed={learning.completed} skin={choice.skin} /></div>
      <div><h2 id="your-building-title">Your building</h2><p className="muted small">{laidBrickCount(learning.completed)} of {BUILDING_CAPACITY} bricks</p>
        <button ref={trigger} type="button" className="demo-link" onClick={() => setPicking(true)}>Change building</button>
      </div>
    </>}
  </section>;
}

export function LessonBuildingCompletion({ completed, newCompletion, reducedMotion, phaseOne, nextHref = "/learn", nextTitle = "Continue", saved = true, saveLabel }: {completed:readonly string[];newCompletion:boolean;reducedMotion:boolean;phaseOne?:boolean;nextHref?:string;nextTitle?:string;saved?:boolean;saveLabel?:string}) {
  const {choice, choose, persistence} = useBuildingChoice();
  const [changing, setChanging] = useState(false);
  const [animationDone, setAnimationDone] = useState(false);
  const next = useRef<HTMLAnchorElement>(null);
  const systemReduced = useSyncExternalStore(subscribeMotion, () => matchMedia("(prefers-reduced-motion: reduce)").matches, () => false);
  const reduced = reducedMotion || systemReduced;
  const count = laidBrickCount(completed);
  const added = newCompletion && count > 0 && new Set(completed).size <= BUILDING_CAPACITY;
  const choosing = (!phaseOne && !choice.chosen) || changing;
  const settled = reduced || !added || animationDone;
  // Navigation is available immediately; animation must never move focus later.
  useEffect(() => {
    if (!choosing) next.current?.focus();
  }, [choosing]);
  useEffect(() => {
    if (choosing) return;
    if (!added || animationDone) return;
    // Animation-end is primary; this fallback also covers interrupted CSS animations.
    const timer = setTimeout(() => setAnimationDone(true), reduced ? 200 : BRICK_DROP_MS + 100);
    return () => clearTimeout(timer);
  }, [choosing, added, animationDone, reduced]);

  return <div className={`${styles.completion} tabular-nums`}>
    {choosing ? <BuildingPicker completed={added ? completed.slice(0,-1) : completed} skin={choice.skin} onChoose={skin => {choose(skin);setChanging(false);}} /> : <>
      <div className={styles.building}><BuildingDrawing completed={completed} skin={choice.skin} incomingIndex={added && !animationDone ? count - 1 : null} reduced={reduced} onSettled={() => setAnimationDone(true)} /></div>
      <h2>{added ? `Brick ${count} laid.` : "Your building"}</h2>
      <p role="status">{saveLabel ?? (!saved ? "Available for this session" : "Saved in this browser")}</p>
      <p>Each idea you keep becomes part of your building.</p>
      <p className="muted small">{count} of {BUILDING_CAPACITY} bricks</p>
      <div className={styles.actions}><Link ref={next} className="button primary" href={nextHref}>{nextTitle}</Link>
        <Link className="demo-link" href="/recap">View my Recap</Link><Link className="demo-link" href="/learn">Return later</Link>
        <button type="button" className="demo-link" onClick={() => setChanging(true)}>Change building</button></div>
    </>}
    <span className="sr-only" aria-live="polite" aria-atomic="true">{!choosing && settled ? added ? `Brick ${count} of ${BUILDING_CAPACITY} laid` : `Your building: ${count} of ${BUILDING_CAPACITY} bricks laid` : ""}</span>
    {persistence !== "saved" && <p className="muted small" role="status">Your building choice is available for this visit. Browser storage needs attention.</p>}
  </div>;
}
