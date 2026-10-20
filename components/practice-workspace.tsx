"use client";
import Link from "next/link";
import { useRef, useState, type FormEvent } from "react";
import {
  ArrowRight,
  CheckCircle2,
  RotateCcw,
  Wallet,
} from "lucide-react";
import { useMvp } from "./mvp-provider";
import {
  startPractice,
  scenarios,
  scenarioFor,
  practiceAssets,
  practiceAsOf,
  scenarioDataAsOf,
  practiceValue,
  priceCents,
  placeOrder,
  advancePractice,
  type OrderInput,
  type PracticeState,
} from "@/lib/practice";
import { assetColor, money, signedMoney, displayDate } from "@/lib/presentation";
import { ChoiceQuestion } from "./lesson-interaction";

export function PracticeWorkspace() {
  const { practice, updatePractice, complete, now } = useMvp();
  const [symbol, setSymbol] = useState("CAFE"),
    [side, setSide] = useState<"buy" | "sell">("buy"),
    [quantity, setQuantity] = useState("1"),
    [preview, setPreview] = useState<OrderInput | null>(null),
    [error, setError] = useState(""),
    [message, setMessage] = useState("");
  const [replacement, setReplacement] = useState<
      PracticeState["scenarioId"] | null
    >(null),
    [reflectionReady, setReflectionReady] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null),
    resultHeading = useRef<HTMLHeadingElement>(null),
    formRef = useRef<HTMLSelectElement>(null),
    confirming = useRef(false);
  const scenario = scenarioFor(practice),
    last = practice.checkpoints.at(-1),
    total = practiceValue(practice);
  const asOf = "Sample scenario state - as of " + displayDate(practiceAsOf(practice));
  function start(id: PracticeState["scenarioId"]) {
    updatePractice(() => startPractice(id, crypto.randomUUID()));
    setPreview(null);
    setError("");
    setMessage("");
    setReflectionReady(false);
    dialog.current?.close();
  }
  function choose(id: PracticeState["scenarioId"]) {
    if (practice.runId) {
      setReplacement(id);
      dialog.current?.showModal();
    } else start(id);
  }
  function previewOrder(event: FormEvent) {
    event.preventDefault();
    setError("");
    setMessage("");
    const input: OrderInput = {
      id: crypto.randomUUID(),
      symbol,
      side,
      quantity: Number(quantity),
      expectedWeek: practice.week,
      expectedRun: practice.runId,
    };
    try {
      placeOrder(practice, input);
      setPreview(input);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "This order could not be prepared.",
      );
    }
  }
  function confirm() {
    if (!preview || confirming.current) return;
    confirming.current = true;
    try {
      updatePractice((state) => placeOrder(state, preview));
      setMessage("Practice allocation recorded.");
      setPreview(null);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Preview the order again.",
      );
      setPreview(null);
    } finally {
      confirming.current = false;
    }
  }
  function advance() {
    setError("");
    setPreview(null);
    try {
      updatePractice((state) => state.runId === practice.runId ? advancePractice(state, practice.week) : state);
      setReflectionReady(false);
      setMessage("Your next fictional week is ready. Explore what changed.");
      requestAnimationFrame(() => {
        resultHeading.current?.focus({ preventScroll: true });
        resultHeading.current?.scrollIntoView({ block: "start" });
      });
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "This week could not advance.",
      );
    }
  }
  return (
    <div className="practice-workspace">
      <p className="data-tag">{asOf} · fixed fictional prices</p>
      {!practice.runId ? (
        <>
          <section className="practice-intro">
            <div>
              <p className="eyebrow">A safe place to be curious</p>
              <h2>
                Try an idea.
                <br />
                See what happens.
              </h2>
              <p>
                Start with $1,000 in fictional cash. Choose a scenario, build a
                mix, and move through three imagined weeks.
              </p>
            </div>
            <div className="practice-cash-art" aria-hidden="true">
              <Wallet size={35} />
              <strong>$1,000</strong>
              <span>Scenario baseline · as of {displayDate(scenarioDataAsOf)}</span>
            </div>
          </section>
          <div className="scenario-grid">
            {scenarios.map((item, index) => (
              <section className="mvp-card scenario-card" key={item.id}>
                <span className="scenario-number">0{index + 1}</span>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <button
                  className="button primary"
                  disabled={!now}
                  onClick={() => choose(item.id)}
                >
                  Try this scenario <ArrowRight size={17} />
                </button>
              </section>
            ))}
          </div>
        </>
      ) : (
        <>
          <section className="mvp-card practice-overview">
            <div>
              <p className="eyebrow">{scenario.title}</p>
              <h2>{money(total / 100)}</h2><small>{asOf}</small>
              <p>Cash + investments · Simulated week {practice.week} of 3</p>
            </div>
            <div className="cash-balance">
              <span>Available fictional cash</span>
              <strong>{money(practice.cashCents / 100)}</strong>
              <button
                className="demo-link"
                onClick={() => choose(practice.scenarioId)}
              >
                <RotateCcw size={15} /> Restart or change scenario
              </button>
            </div>
          </section>
          {last && (
            <section className="mvp-card practice-result" aria-live="polite">
              <p className="eyebrow">Your practice week {last.week}</p>
              <h2 ref={resultHeading} tabIndex={-1}>{signedMoney((last.afterCents - last.beforeCents) / 100)}</h2>
              <p>
                {money(last.beforeCents / 100)} → {money(last.afterCents / 100)}{" "}
                at this week’s prices, including cash. As of {displayDate(last.at)}.
              </p>
              <p>{scenario.notes[last.week - 1]}</p>
              {last.afterCents < last.beforeCents && (
                <p className="gentle-note">
                  Short-term declines can happen. A longer time horizon changes
                  how investors assess them, but it does not guarantee recovery.
                </p>
              )}
              {!last.reflected ? (
                <div className="reflection-check">
                  <ChoiceQuestion
                    key={practice.runId + last.week}
                    question="What can you take from this practice week?"
                    options={[
                      "The best-performing asset is guaranteed to keep winning.",
                      "My mix affected this result; one fictional week cannot predict the future.",
                      "A loss means I failed the lesson.",
                    ]}
                    correct={1}
                    explanation="The useful result is understanding how your mix behaved. Profit, loss, and choosing not to trade can all teach you something."
                    onReady={() => setReflectionReady(true)}
                    onMiss={() => undefined}
                  />
                  {reflectionReady && (
                    <button
                      className="button lime player-continue"
                      onClick={() => {
                        let recorded = false;
                        updatePractice((state) => {
                          if (state.runId !== practice.runId) return state;
                          recorded = true;
                          return {
                                ...state,
                                checkpoints: state.checkpoints.map((point) =>
                                  point.week === last.week
                                    ? { ...point, reflected: true }
                                    : point,
                                ),
                              };
                        });
                        if (recorded) complete(
                          "reflection",
                          practice.scenarioId +
                            ":" +
                            practice.runId +
                            ":" +
                            last.week,
                        );
                      }}
                    >
                      Save my reflection <CheckCircle2 size={17} />
                    </button>
                  )}
                </div>
              ) : (
                <p className="demo-link">
                  <CheckCircle2 size={17} /> Reflection saved
                </p>
              )}
            </section>
          )}
          <section className="mvp-card">
            <div className="section-heading">
              <h2>Your practice mix</h2>
              <span>{asOf}</span>
            </div>
            <div
              className="practice-allocation"
              role="img"
              aria-label={
                "Cash " +
                money(practice.cashCents / 100) +
                ". " +
                practiceAssets
                  .map(
                    (asset) =>
                      asset.name +
                      ": " +
                      (practice.positions[asset.symbol]?.quantity ?? 0) +
                      " shares",
                  )
                  .join(". ")
              }
            >
              <span
                style={{
                  width: (total ? (practice.cashCents / total) * 100 : 0) + "%",
                  background: "#dfe7d9",
                }}
              />
              {practiceAssets.map((asset) => (
                <span
                  key={asset.symbol}
                  style={{
                    width:
                      (total
                        ? (((practice.positions[asset.symbol]?.quantity ?? 0) *
                            priceCents(practice, asset.symbol)) /
                            total) *
                          100
                        : 0) + "%",
                    background: assetColor(asset.symbol),
                  }}
                />
              ))}
            </div>
            <div className="practice-holdings">
              {practiceAssets.map((asset) => {
                const position = practice.positions[asset.symbol];
                return (
                  <article key={asset.symbol}>
                    <div
                      className="asset-icon"
                      style={{ background: assetColor(asset.symbol) }}
                      aria-hidden="true"
                    >
                      {asset.symbol.slice(0, 1)}
                    </div>
                    <div>
                      <h3>{asset.name}</h3>
                      <small>{asset.kind}</small>
                    </div>
                    <div>
                      <strong>
                        {money(priceCents(practice, asset.symbol) / 100)}
                      </strong>
                      <small>per share · {position?.quantity ?? 0} held</small>
                      <small>As of {displayDate(practiceAsOf(practice))}</small>
                      {position && position.quantity > 0 && (
                        <small>
                          Cost: {money(position.costCents / 100)} · Value:{" "}
                          {money(
                            (position.quantity *
                              priceCents(practice, asset.symbol)) /
                              100,
                          )}
                        </small>
                      )}
                    </div>
                    {practice.week < 3 && (
                      <button
                        className="button secondary"
                        onClick={() => {
                          setSymbol(asset.symbol);
                          setPreview(null);
                          formRef.current?.focus();
                        }}
                      >
                        Practice order
                      </button>
                    )}
                  </article>
                );
              })}
            </div>
          </section>
          {practice.week < 3 ? (
            <section className="mvp-card" id="practice-order">
              <h2>Try a practice order</h2>
              <p>
                As of {displayDate(practiceAsOf(practice))}. Whole shares at the displayed price. You can also keep your mix
                unchanged.
              </p>
              <form className="practice-order" onSubmit={previewOrder}>
                <label className="demo-label">
                  Investment
                  <select
                    ref={formRef}
                    className="demo-input"
                    value={symbol}
                    onChange={(event) => {
                      setSymbol(event.target.value);
                      setPreview(null);
                    }}
                  >
                    {practiceAssets.map((asset) => (
                      <option key={asset.symbol} value={asset.symbol}>
                        {asset.name}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="demo-label">
                  Action
                  <select
                    className="demo-input"
                    value={side}
                    onChange={(event) => {
                      setSide(event.target.value as "buy" | "sell");
                      setPreview(null);
                    }}
                  >
                    <option value="buy">Add to mix</option>
                    <option value="sell">Remove from mix</option>
                  </select>
                </label>
                <label className="demo-label">
                  Whole shares
                  <input
                    className="demo-input"
                    type="number"
                    min="1"
                    step="1"
                    required
                    value={quantity}
                    onChange={(event) => {
                      setQuantity(event.target.value);
                      setPreview(null);
                    }}
                  />
                </label>
                <button className="button primary">Preview order</button>
              </form>
              {error && (
                <p className="inline-error" role="alert">
                  {error}
                </p>
              )}
              {message && (
                <p className="gentle-note" role="status">
                  {message}
                </p>
              )}
              {preview && (
                <div
                  className="order-preview"
                  role="region"
                  aria-label="Practice order preview"
                >
                  <h3>Confirm your fictional order</h3>
                  <p>
                    {preview.side === "buy" ? "Add" : "Remove"} {preview.quantity}{" "}
                    shares of{" "}
                    {
                      practiceAssets.find(
                        (asset) => asset.symbol === preview.symbol,
                      )?.name
                    }{" "}
                    for{" "}
                    {money(
                      (preview.quantity *
                        priceCents(practice, preview.symbol)) /
                        100,
                    )}
                    . As of {displayDate(practiceAsOf(practice))}.
                  </p>
                  <div className="step-actions">
                    <button className="button primary" onClick={confirm}>
                      Confirm practice order
                    </button>
                    <button
                      className="button secondary"
                      onClick={() => setPreview(null)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
              <div className="advance-week">
                <p>
                  Ready to see the next week? Orders earn no XP. Your reflection
                  is what counts.
                </p>
                <button
                  className="button lime"
                  disabled={!!last && !last.reflected}
                  onClick={advance}
                >
                  Advance one simulated week <ArrowRight size={17} />
                </button>
                <button
                  className="demo-link"
                  disabled={!!last && !last.reflected}
                  onClick={advance}
                >
                  Keep my portfolio unchanged and advance
                </button>
              </div>
            </section>
          ) : (
            last?.reflected && (
              <section className="mvp-card scenario-finished">
                <CheckCircle2 size={32} />
                <h2>A scenario explored. An idea made clearer.</h2>
                <p>
                  Keep these results, or start a different scenario. Your
                  learning achievements stay with you.
                </p>
                <div className="step-actions">
                  {scenarios
                    .filter((item) => item.id !== practice.scenarioId)
                    .map((item) => (
                      <button
                        className="button secondary"
                        key={item.id}
                        onClick={() => choose(item.id)}
                      >
                        {item.title}
                      </button>
                    ))}
                  <Link className="demo-link" href="/portfolio#recap">
                    See my recap →
                  </Link>
                </div>
              </section>
            )
          )}
          <section className="mvp-card">
            <h2>Practice order history</h2>
            {practice.orders.length ? (
              <ol className="activity-timeline">
                {[...practice.orders].reverse().map((order) => (
                  <li key={order.id}>
                    <span className="timeline-dot" />
                    <div>
                      <strong>
                        {order.side === "buy" ? "Added" : "Removed"}{" "}
                        {order.quantity} {order.symbol}
                      </strong>
                      <small>
                        Simulated week {order.week} ·{" "}
                        {money(order.priceCents / 100)} per share · As of {displayDate(order.at)}
                      </small>
                    </div>
                    <span>
                      {money((order.quantity * order.priceCents) / 100)}
                    </span>
                  </li>
                ))}
              </ol>
            ) : (
              <p>
                No orders yet. Holding fictional cash is a valid starting point.
              </p>
            )}
          </section>
        </>
      )}
      <p className="muted small">
        An educational model with fixed fictional prices. Fees, taxes,
        dividends, and real-world execution are not included.
      </p>
      <dialog className="demo-dialog" ref={dialog}>
        <h2>Start a new practice run?</h2>
        <p>
          This replaces the current fictional cash, holdings, and order history.
          Your lesson progress and earned milestones stay saved.
        </p>
        <label className="demo-label">
          Scenario
          <select
            className="demo-input"
            value={replacement ?? practice.scenarioId}
            onChange={(event) =>
              setReplacement(event.target.value as PracticeState["scenarioId"])
            }
          >
            {scenarios.map((item) => (
              <option key={item.id} value={item.id}>
                {item.title}
              </option>
            ))}
          </select>
        </label>
        <div className="step-actions">
          <button
            className="button secondary"
            onClick={() => dialog.current?.close()}
          >
            Keep this run
          </button>
          <button
            className="button primary"
            onClick={() => start(replacement ?? practice.scenarioId)}
          >
            Start fresh
          </button>
        </div>
      </dialog>
    </div>
  );
}
