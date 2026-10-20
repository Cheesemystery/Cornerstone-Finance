"use client";
import { useRef, useState, type FormEvent } from "react";
import { useDemo } from "./demo-provider";
import { useMvp } from "./mvp-provider";
import { Switch } from "./ui/switch";
export function MvpSettings() {
  const { preferences, update, reset: resetDemo } = useDemo();
  const { learning, updateLearning, reset, persistence } = useMvp();
  const [name, setName] = useState<string | null>(null),
    [notice, setNotice] = useState("");
  const dialog = useRef<HTMLDialogElement>(null);
  function save(event: FormEvent) {
    event.preventDefault();
    update({ name: (name ?? preferences.name).trim() || "Alex" });
    setNotice("Your preferences have been updated.");
  }
  return (
    <div className="settings-grid workspace">
      <div className="demo-stack">
        <form className="mvp-card" onSubmit={save}>
          <h2>Make yourself at home</h2>
          <label className="demo-label">
            Nickname <span className="muted">(optional)</span>
            <input
              className="demo-input"
              maxLength={40}
              value={
                name ?? (preferences.name === "Alex" ? "" : preferences.name)
              }
              onChange={(event) => setName(event.target.value)}
            />
          </label>
          <button className="button primary workspace">Save nickname</button>
        </form>
        <section className="mvp-card">
          <h2>Your learning pace</h2>
          <label className="demo-label">
            Daily learning goal
            <select
              className="demo-input"
              value={learning.dailyGoal}
              onChange={(event) =>
                updateLearning((state) => ({
                  ...state,
                  dailyGoal: Number(event.target.value) as 1 | 2,
                }))
              }
            >
              <option value="1">One lesson or review</option>
              <option value="2">Two learning activities</option>
            </select>
          </label>
          <p className="muted small">
            Goals are an invitation. Missed days never remove XP or
            achievements.
          </p>
          <label className="preference-row">
            <span>
              <strong>Show my learning streak</strong>
              <small>One automatic grace day per rolling seven days.</small>
            </span>
            <input
              type="checkbox"
              role="switch"
              checked={learning.showStreak}
              onChange={(event) =>
                updateLearning((state) => ({
                  ...state,
                  showStreak: event.target.checked,
                }))
              }
            />
          </label>
          <div className="preference-row">
            <span>
              <label htmlFor="reduce-motion"><strong>Reduce motion</strong></label>
              <small id="reduce-motion-description">
                Your device’s motion preference is also respected. Sound is off.
              </small>
            </span>
            <Switch
              id="reduce-motion"
              aria-describedby="reduce-motion-description"
              checked={learning.reducedMotion}
              onCheckedChange={(checked) =>
                updateLearning((state) => ({
                  ...state,
                  reducedMotion: checked,
                }))
              }
            />
          </div>
          <label className="preference-row">
            <span>
              <strong>Compact layout</strong>
              <small>Use a narrower workspace.</small>
            </span>
            <input
              type="checkbox"
              role="switch"
              checked={preferences.compact}
              onChange={(event) => update({ compact: event.target.checked })}
            />
          </label>
          <div className="preference-row">
            <span>
              <label htmlFor="pro-view">Pro view</label>
              <small id="pro-view-description">A compact, dark Home with holding contributions.</small>
            </span>
            <Switch id="pro-view" aria-describedby="pro-view-description" checked={preferences.proView}
              onCheckedChange={checked => update({proView:checked})} />
          </div>
          <p className="muted small">
            Learning-day timezone: {learning.timezone}
          </p>
        </section>
      </div>
      <aside className="demo-stack" aria-label="Privacy and local data">
        <section className="mvp-card" id="privacy">
          <h2>Your data stays yours.</h2>
          <p>
            Holdings, weekly completion, learning progress, your nickname, saved research, and fictional
            practice are stored in this browser. They do not sync across
            devices.
          </p>
          <p>
            Holdings imported from CSV or JSON persist in this browser. Files and share counts are not uploaded; tickers and requested dates go to the server for historical closes. Guide conversations clear on reload.
          </p>
          <p>
            Fictional practice. No real money moved.
            Account access, email, and billing are deferred.
          </p>
          <p role="status">
            {persistence === "saved"
              ? "Browser storage is available."
              : "Browser storage needs attention. See the notice below."}
          </p>
        </section>
        <section className="mvp-card">
          <h2>A fresh start</h2>
          <p>
            Reset this browser’s holdings, weekly completion, learning, fictional practice, nickname, and
            saved preferences.
          </p>
          <button
            className="button secondary"
            onClick={() => dialog.current?.showModal()}
          >
            Reset local progress
          </button>
        </section>
      </aside>
      {notice && <p role="status">{notice}</p>}
      <dialog className="demo-dialog" ref={dialog} aria-labelledby="reset-progress-title">
        <h2 id="reset-progress-title">Reset local progress?</h2>
        <p>
          This clears learning progress, XP, achievements, fictional orders, and
          browser preferences. It cannot be undone. No external account is
          affected.
        </p>
        <div className="step-actions">
          <button
            className="button secondary"
            onClick={() => dialog.current?.close()}
          >
            Keep my progress
          </button>
          <button
            className="button primary"
            onClick={() => {
              resetDemo();
              reset();
              setName("");
              setNotice("Local progress reset.");
              dialog.current?.close();
            }}
          >
            Reset this browser
          </button>
        </div>
      </dialog>
    </div>
  );
}
