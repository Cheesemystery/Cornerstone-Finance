"use client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { mergeGuestLearning, recoverGuestLearning } from "@/lib/guest-learning";
import { useAccountLearning } from "./use-account-learning";
import { createBrowserStore } from "@/lib/browser-store";
import {
  emptyLearning,
  learningSchema,
  migrateLearning,
  recordActivity,
  type LearningEvent,
} from "@/lib/learning-progress";
import { emptyPractice, practiceSchema } from "@/lib/practice";
import { contributeCampusStone } from "@/lib/campus-foundations";
import { captureSafeEvent } from "@/lib/analytics";

const learningStore = createBrowserStore(
  "cornerstone-learning-v1",
  emptyLearning,
  (raw) => migrateLearning(learningSchema.parse(raw)),
  () => {
    let legacy: unknown = {};
    try {
      legacy = JSON.parse(localStorage.getItem("cornerstone-demo-v1") ?? "{}");
    } catch {}
    return migrateLearning(
      undefined,
      legacy,
      Intl.DateTimeFormat().resolvedOptions().timeZone,
    );
  },
  mergeGuestLearning,
  recoverGuestLearning,
);
const practiceStore = createBrowserStore(
  "cornerstone-practice-v1",
  emptyPractice,
  (raw) => practiceSchema.parse(raw),
);
function useMvpState(accountsEnabled:boolean) {
  const learning = learningStore.useStore(),
    practice = practiceStore.useStore();
  const account = useAccountLearning(accountsEnabled);
  const activeLearning = account.account?.state ?? learning.value;
  const updateActiveLearning = account.account ? account.update : learning.update;
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    const tick = () => setNow(new Date());
    tick();
    const timer = setInterval(tick, 60000);
    return () => clearInterval(timer);
  }, []);
  function complete(kind: LearningEvent["kind"], target: string) {
    updateActiveLearning((state) => {
      const result = recordActivity(state, kind, target);
      if(kind==="lesson"&&!state.completed.includes(target)&&result.completed.includes(target))contributeCampusStone(`lesson:${target}`);
      if (result !== state)
        captureSafeEvent(
          kind === "lesson"
            ? "lesson_completed"
            : kind === "review"
              ? "review_completed"
              : "practice_reflected",
        );
      return result;
    });
    setNow(new Date());
  }
  return {
    learning: activeLearning,
    guestLearning: learning.value,
    account,
    updateLearning: updateActiveLearning,
    practice: practice.value,
    updatePractice: practice.update,
    now,
    complete,
    persistence:
      learning.persistence === "session" || practice.persistence === "session"
        ? "session"
        : learning.persistence === "recovered" ||
            practice.persistence === "recovered"
          ? "recovered"
          : "saved",
    reset: () => {
      learning.update(state=>({...emptyLearning,timezone:state.timezone,resetGeneration:state.resetGeneration+1}));
      practiceStore.reset();
    },
  };
}
const MvpContext = createContext<ReturnType<typeof useMvpState> | null>(null);
export function MvpProvider({ children, accountsEnabled = false }: { children: ReactNode; accountsEnabled?:boolean }) {
  const value = useMvpState(accountsEnabled);
  if (value.account.checking) return <main className="entry-page"><p role="status">Checking your learning session…</p></main>;
  if (value.account.locked) return <main className="entry-page"><div className="mvp-card"><h1>Your learning is kept safe.</h1><p>Account learning could not be loaded or saved. Keep this page open while you recover your session. Working progress stays separate from guest learning.</p><button className="button primary" onClick={()=>void value.account.retry()}>Reload and retry</button><a className="demo-link" href="/sign-in?returnTo=/learn" target="_blank" rel="noopener">Sign in again (opens a new tab)</a><button className="demo-link" onClick={()=>void value.account.signOut()}>Sign out and continue as guest</button></div></main>;
  return (
    <MvpContext.Provider value={value}>
      <div data-reduced-motion={value.learning.reducedMotion || undefined}>
        {children}
      </div>
      {value.persistence !== "saved" && (
        <div className="storage-notice" role="status">
          {value.persistence === "session"
            ? "Browser storage is unavailable. You can keep exploring, but this session’s progress may disappear when you close or reload."
            : "Some saved progress could not be read. Your usable progress is still here; new activity will save a fresh copy."}
        </div>
      )}
    </MvpContext.Provider>
  );
}
export function useMvp() {
  const value = useContext(MvpContext);
  if (!value) throw new Error("MvpProvider is required");
  return value;
}
