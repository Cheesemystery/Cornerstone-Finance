"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { ArrowRight, Sprout } from "lucide-react";
import { useDemo } from "./demo-provider";
import { useMvp } from "./mvp-provider";
import { BuildingDrawing } from "./learning-building";
import { nextLesson } from "@/lib/learning-progress";
import { captureSafeEvent } from "@/lib/analytics";
export function OnboardingFlow({ inline = false }: { inline?: boolean }) {
  const router = useRouter(),
    { update } = useDemo(),
    { learning, updateLearning, now, account } = useMvp();
  const [name, setName] = useState("");
  function finish(event: FormEvent) {
    event.preventDefault();
    if (name.trim()) update({ name: name.trim() });
    updateLearning((state) => ({ ...state, onboarded: true }));
    captureSafeEvent("onboarding_completed");
    router.push("/learn/" + (nextLesson(learning)?.id ?? "what-you-own"));
  }
  if (learning.onboarded && now) return <section className="welcome-setup"><h1>Welcome back.</h1><Link className="button primary" href={nextLesson(learning) ? `/learn/${nextLesson(learning)!.id}` : "/recap"}>Continue learning</Link></section>;
  return (
    <section className="welcome-setup">
      <div>
        <span className="daily-label">
          <Sprout size={18} /> START SMALL
        </span>
        {inline ? (
          <h2>Start with one small lesson.</h2>
        ) : (
          <h1>
            Investing can make sense.
            <br />
            Start with one small lesson.
          </h1>
        )}
        <p>
          Meet stocks, bonds, and funds through a fictional campus café. No
          account needed.
        </p>
        <Link className="demo-link" href="/sign-in?returnTo=/onboarding">Account sign-in</Link>
        <form onSubmit={finish}>
          <label className="demo-label" htmlFor="welcome-name">
            What should we call you? <span className="muted">(optional)</span>
          </label>
          <input
            className="demo-input"
            id="welcome-name"
            placeholder="Your nickname"
            maxLength={40}
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
          <button className="button lime" disabled={!now}>
            {account.account ? "Continue learning" : "Continue as guest"} <ArrowRight size={18} />
          </button>
          <Link
            className="demo-link"
            href="/learn"
            onClick={() =>
              updateLearning((state) => ({ ...state, onboarded: true }))
            }
          >
            Explore first
          </Link>
        </form>
        <small>
          {account.account ? "Learning saves to your account when connected." : "Progress stays in this browser."}
        </small>
      </div>
      <div style={{maxWidth:320}}><BuildingDrawing completed={learning.completed} skin="campus" reduced /><p>Your starting foundation. Each completed lesson adds one brick.</p></div>
    </section>
  );
}
