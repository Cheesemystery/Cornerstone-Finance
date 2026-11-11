"use client";

import { useEffect, useId, useRef, useState, type CSSProperties } from "react";
import { foundationLessons } from "@/lib/foundation";
import { lessons } from "@/lib/lessons";
import { displayDate, pluralize } from "@/lib/presentation";
import { readSeenStones, saveSeenStones, stoneAppearance, STONE_LAY_MS } from "@/lib/stone-wall";
import { useMvp } from "./mvp-provider";
import styles from "./learning-wall.module.css";

export function LearningWall({ chartEntranceMs = 0, animationsReady = true }: { chartEntranceMs?: number; animationsReady?: boolean }) {
  const {learning, now} = useMvp();
  const prefix = useId();
  const wall = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [announcement, setAnnouncement] = useState("");
  const [open, setOpen] = useState<string | null>(null);
  const {earned, ordered} = foundationLessons(learning.completed);
  const completed = earned.map(lesson => lesson.id);
  const completedKey = JSON.stringify(completed);
  const ready = now !== null && animationsReady;

  useEffect(() => {
    const node = wall.current;
    if (!node) return;
    if (typeof IntersectionObserver === "undefined") {
      const timer = setTimeout(() => setVisible(true), 0);
      return () => clearTimeout(timer);
    }
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) { setVisible(true); observer.disconnect(); }
    }, {threshold:0.2});
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!ready) return;
    const ids = JSON.parse(completedKey) as string[];
    const seen = readSeenStones();
    // First visit adopts existing progress quietly; only later additions are new.
    if (seen === null) { saveSeenStones(ids); return; }
    const retained = seen.filter(id => ids.includes(id));
    saveSeenStones(retained);
    if (!visible) return;
    const pending = ids.filter(id => !retained.includes(id));
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let reduced = learning.reducedMotion || motion.matches;
    let timer: ReturnType<typeof setTimeout>;
    let index = 0;
    let cancelled = false;
    const next = () => {
      if (cancelled) return;
      const id = pending[index++];
      if (!id) { setActive(null); return; }
      // Receipt is written when the animation starts, so navigating away cannot replay it.
      saveSeenStones([...(readSeenStones() ?? retained), id]);
      setActive(id);
      setAnnouncement(`Stone laid: ${lessons.find(lesson => lesson.id === id)!.title}`);
      timer = setTimeout(next, reduced ? 0 : STONE_LAY_MS);
    };
    const changeMotion = (event: MediaQueryListEvent) => {
      reduced = learning.reducedMotion || event.matches;
      if (reduced) { clearTimeout(timer); timer = setTimeout(next, 0); }
    };
    motion.addEventListener("change", changeMotion);
    timer = setTimeout(next, reduced ? 0 : chartEntranceMs);
    return () => { cancelled = true; clearTimeout(timer); motion.removeEventListener("change", changeMotion); };
  }, [completedKey, ready, visible, learning.reducedMotion, chartEntranceMs]);

  const columns=8;
  const courses = Array.from({length:Math.max(5,Math.ceil(ordered.length/columns))}, (_, row) => Array.from({length:columns},(_,col)=>ordered[row*columns+col]));
  return <figure ref={wall} className={styles.wall} aria-labelledby={`${prefix}-caption`}>
    <header className={styles.heading}><div><p>BUILT BY YOU</p><h2>Your knowledge. Set in stone.</h2><span>Every lesson you understand adds to your foundation.</span></div><strong>{completed.length}<small>stones laid</small></strong></header>
    <div className={styles.courses}>
      {courses.map((course, courseIndex) => <div key={courseIndex} className={styles.course} data-course={courseIndex % 2} style={{order:courses.length-courseIndex}}>
        {course.map((lesson,slotIndex) => {
          if(!lesson)return <div key={`empty-${slotIndex}`} className={styles.blank} aria-hidden="true"/>;
          const appearance = stoneAppearance(lesson.id);
          const laid = completed.includes(lesson.id);
          const event = learning.events.find(event => event.kind === "lesson" && event.target === lesson.id);
          const date = laid ? event ? `Laid ${displayDate(event.day)}` : "Date not recorded" : "Ready when you are";
          const tooltipId = `${prefix}-${lesson.id}-details`;

          return <div key={lesson.id} className={styles.slot}
            onPointerEnter={event => { if (event.pointerType !== "touch") setOpen(lesson.id); }}
            onPointerLeave={event => { if (!event.currentTarget.contains(document.activeElement)) setOpen(null); }}>
            <button type="button" className={styles.stone} data-laid={laid} data-laying={active === lesson.id || undefined}
              style={{"--stone-tint":appearance.tint} as CSSProperties}
              aria-label={`${lesson.title} ${laid ? "Stone laid." : "Stone not laid."} ${date}.`}
              aria-expanded={open === lesson.id} aria-controls={tooltipId} aria-describedby={open === lesson.id ? tooltipId : undefined}
              onFocus={() => setOpen(lesson.id)} onBlur={() => setOpen(null)} onClick={() => setOpen(lesson.id)}
              onKeyDown={event => { if (event.key === "Escape") { setOpen(null); event.stopPropagation(); } }}>
              {laid&&<><span className={styles.number}>{String(lessons.findIndex(item=>item.id===lesson.id)+1).padStart(2,"0")} <span>✓</span></span><span className={styles.topic}>{lesson.title}</span></>}
            </button>
            <div id={tooltipId} role="tooltip" hidden={open !== lesson.id} className={styles.tooltip}><strong>{lesson.title}</strong><span>{date}</span></div>
          </div>;
        })}
      </div>)}
    </div>
    <figcaption id={`${prefix}-caption`}><strong>{completed.length} of {lessons.length} {pluralize(lessons.length, "stone")} laid</strong><span>Blank spaces leave room for what comes next. More challenges to come.</span></figcaption>
    <span className="sr-only" aria-live="polite" aria-atomic="true">{announcement}</span>
  </figure>;
}
