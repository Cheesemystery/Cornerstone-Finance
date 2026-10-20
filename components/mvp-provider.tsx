"use client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { createBrowserStore } from "@/lib/browser-store";
import {
  emptyLearning,
  learningSchema,
  migrateLearning,
  recordActivity,
  type LearningEvent,
} from "@/lib/learning-progress";
import { emptyPractice, practiceSchema } from "@/lib/practice";
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
);
const practiceStore = createBrowserStore(
  "cornerstone-practice-v1",
  emptyPractice,
  (raw) => practiceSchema.parse(raw),
);
function useMvpState() {
  const learning = learningStore.useStore(),
    practice = practiceStore.useStore();
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    const tick = () => setNow(new Date());
    tick();
    const timer = setInterval(tick, 60000);
    return () => clearInterval(timer);
  }, []);
  function complete(kind: LearningEvent["kind"], target: string) {
    learning.update((state) => {
      const result = recordActivity(state, kind, target);
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
    learning: learning.value,
    updateLearning: learning.update,
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
      learningStore.reset();
      practiceStore.reset();
    },
  };
}
const MvpContext = createContext<ReturnType<typeof useMvpState> | null>(null);
export function MvpProvider({ children }: { children: ReactNode }) {
  const value = useMvpState();
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
