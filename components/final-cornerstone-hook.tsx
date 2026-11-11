"use client";
import Link from "next/link";
import { useMvp } from "./mvp-provider";
import { lessons } from "@/lib/lessons";
import styles from "./final-cornerstone-hook.module.css";
export function FinalCornerstoneHook(){
 const {learning}=useMvp();
 if(learning.completed.includes("inflation")||!lessons.slice(0,7).every(l=>learning.completed.includes(l.id)))return null;
 return <section className={styles.hook} aria-label="Your final cornerstone"><div><p className="eyebrow">FINAL CORNERSTONE · LESSON 08 OF 08 (1 STONE LEFT)</p><h2>The Silent Thief in Your Checking Account</h2><p>Why $1,000 sitting &apos;safely&apos; in cash is quietly shrinking—and how to protect what your money will actually buy.</p><Link className="button primary" href="/learn/inflation">Unlock Lesson 08: What Will Your Money Buy? (3 min) →</Link></div><div className={styles.progress}><strong>7 of 8 Foundation Stones Laid</strong><div className={styles.segments} aria-hidden="true">{lessons.map((l,i)=><span key={l.id} data-pending={i===7}/>)}</div></div></section>;
}
