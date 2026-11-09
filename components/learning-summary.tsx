"use client";
import Link from "next/link";
import { useMvp } from "./mvp-provider";
import { nextLesson } from "@/lib/learning-progress";
import { displayDate, pluralize } from "@/lib/presentation";
import { lessons } from "@/lib/lessons";
export function LearningSummary() {
 const {learning} = useMvp();
 const next = nextLesson(learning);
 const latest = [...learning.events].sort((a,b)=>b.at.localeCompare(a.at))[0];
 const undated = learning.completed.filter(id=>!learning.events.some(event=>event.kind === "lesson" && event.target === id)).length;
 const title = latest?.kind === "lesson" ? (lessons.find(lesson=>lesson.id === latest.target)?.title ?? "Lesson completed") : latest?.kind === "review" ? "A short review completed" : "A practice week reflected on";
 return <section className="mvp-card workspace" aria-label="Learning progress">
  <h2>Your learning</h2>
  <p>{learning.completed.length} of {lessons.length} lessons completed · {learning.completed.length} earned {pluralize(learning.completed.length,"brick")}</p>
  {latest ? <p>Latest activity: {title} · <time dateTime={latest.day}>{displayDate(latest.day)}</time></p> : <p>{learning.completed.length ? "Your earlier completions are preserved. Their dates were not recorded." : "No learning activity yet. Start whenever you’re ready."}</p>}
  {latest && undated > 0 && <p className="muted small">{undated} earlier {pluralize(undated,"completion")} without a recorded date.</p>}
  <Link className="button primary" href={next ? `/learn/${next.id}` : "/learn"}>{next ? `${(learning.steps[next.id] ?? 0) > 0 ? "Resume" : "Continue"}: ${next.title}` : "Review lessons"}</Link>
 </section>;
}
