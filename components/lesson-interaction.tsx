"use client";
import { useState } from "react";
import { ArrowUp, ArrowDown, CheckCircle2, Lightbulb } from "lucide-react";
import type { LessonActivity } from "@/lib/lesson-activities";
import { GrowthCalculator } from "./growth-calculator";

function Feedback({
  correct,
  children,
}: {
  correct: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`lesson-feedback ${correct ? "is-correct" : ""}`}
      role="status"
    >
      {correct ? <CheckCircle2 size={22} /> : <Lightbulb size={22} />}
      <div>
        <strong>
          {correct ? "That’s the idea." : "A useful thing to notice."}
        </strong>
        <p>{children}</p>
      </div>
    </div>
  );
}
export function ChoiceQuestion({
  question,
  options,
  correct,
  explanation,
  feedback,
  onReady,
  onMiss,
}: {
  question: string;
  options: readonly string[];
  correct: number;
  explanation: string;
  feedback?: readonly string[];
  onReady: () => void;
  onMiss: () => void;
}) {
  const [answer, setAnswer] = useState<number | null>(null),
    [checked, setChecked] = useState(false);
  const right = answer === correct;
  return (
    <>
      <fieldset className="activity-choices">
        <legend>{question}</legend>
        {options.map((option, index) => (
          <label
            key={option}
            className={`activity-choice ${answer === index ? "selected" : ""}`}
          >
            <input
              type="radio"
              name={question}
              value={index}
              checked={answer === index}
              onChange={() => {
                setAnswer(index);
                setChecked(false);
              }}
              disabled={checked && right}
            />
            <span>{option}</span>
          </label>
        ))}
      </fieldset>
      {checked && (
        <Feedback correct={right}>
          {feedback?.[answer!] ??
            (right
              ? explanation
              : `${explanation} Try applying that idea to the options.`)}
        </Feedback>
      )}
      <button
        className="button primary"
        disabled={answer === null || (checked && right)}
        onClick={() => {
          setChecked(true);
          if (right) onReady();
          else onMiss();
        }}
      >
        {checked && right ? "Answer checked" : "Check answer"}
      </button>
    </>
  );
}
export function LessonInteraction({
  activity,
  onReady,
  onMiss,
}: {
  activity: LessonActivity;
  onReady: () => void;
  onMiss: () => void;
}) {
  const [matches, setMatches] = useState(["", "", ""]),
    [checked, setChecked] = useState(false),
    [tokens, setTokens] = useState(10),
    [changed, setChanged] = useState(false);
  const [order, setOrder] = useState([2, 0, 1]);
  const [predicted, setPredicted] = useState(false);
  const labels = [
    "Understand what the investment owns",
    "Verify costs and risks in original documents",
    "Consider how it fits your needs and existing mix",
  ];
  if (activity.kind === "choice")
    return (
      <ChoiceQuestion
        question={activity.prompt}
        options={activity.options!}
        correct={activity.correct!}
        feedback={activity.feedback}
        explanation={activity.explanation}
        onReady={onReady}
        onMiss={onMiss}
      />
    );
  if (activity.kind === "fees")
    return (
      <>
        <ChoiceQuestion
          question="Same contributions, same return before fees: which example should finish with more money?"
          options={["The one with lower ongoing fees.", "The one with higher ongoing fees.", "Fees cannot change the result."]}
          correct={0}
          explanation="Lower ongoing fees leave more money invested in this model. Change the fee slider and compare the results."
          feedback={["That is the prediction. Now test it with the slider.", "A larger fee takes more money out; it does not add to the return.", "Ongoing fees reduce the balance and the amount available for future growth."]}
          onReady={() => setPredicted(true)}
          onMiss={onMiss}
        />
        <div id="calculator">
          <GrowthCalculator onExplore={() => setChanged(true)} />
        </div>
        <p className="muted">
          Move any slider, then compare the amount you contributed with the
          hypothetical result.
        </p>
        <button
          className="button primary"
          disabled={!changed || !predicted || checked}
          onClick={() => {
            setChecked(true);
            onReady();
          }}
        >
          I explored the difference
        </button>
        {checked && <Feedback correct>{activity.explanation}</Feedback>}
      </>
    );
  if (activity.kind === "match") {
    const correct = matches.every(
      (value, index) => value === ["stock", "bond", "fund"][index],
    );
    return (
      <>
        <h2>{activity.prompt}</h2>
        <div className="match-rows">
          {[
            "A small ownership share of the café",
            "A loan to the café with payment terms",
            "A basket holding several investments",
          ].map((label, index) => (
            <label key={label}>
              <span>{label}</span>
              <select
                aria-label={label}
                value={matches[index]}
                disabled={checked && correct}
                onChange={(event) => {
                  setChecked(false);
                  setMatches((values) =>
                    values.map((value, i) =>
                      i === index ? event.target.value : value,
                    ),
                  );
                }}
              >
                <option value="">Choose one</option>
                <option value="stock">Stock</option>
                <option value="bond">Bond</option>
                <option value="fund">Fund</option>
              </select>
            </label>
          ))}
        </div>
        {checked && (
          <Feedback correct={correct}>{activity.explanation}</Feedback>
        )}
        <button
          className="button primary"
          disabled={matches.some((value) => !value) || (checked && correct)}
          onClick={() => {
            setChecked(true);
            if (correct) onReady();
            else onMiss();
          }}
        >
          Check my matches
        </button>
      </>
    );
  }
  if (activity.kind === "allocate")
    return (
      <>
        <h2>{activity.prompt}</h2>
        <div className="token-baskets">
          <div>
            <strong>Café basket · {tokens}</strong>
            <div aria-label={`${tokens} tokens in the café basket`}>
              {Array.from({ length: tokens }, (_, i) => (
                <i key={i}>☕</i>
              ))}
            </div>
          </div>
          <div>
            <strong>Broad basket · {10 - tokens}</strong>
            <div aria-label={`${10 - tokens} tokens in the broad basket`}>
              {Array.from({ length: 10 - tokens }, (_, i) => (
                <i key={i}>{["☕", "⌂", "⚙", "♧"][i % 4]}</i>
              ))}
            </div>
          </div>
        </div>
        <label className="range-field">
          <span>
            Tokens in café basket <strong>{tokens} of 10</strong>
          </span>
          <input
            type="range"
            min={0}
            max={10}
            disabled={checked}
            value={tokens}
            onChange={(event) => {
              setTokens(Number(event.target.value));
              setChecked(false);
            }}
          />
        </label>
        <div className="step-actions">
          <button
            className="button secondary"
            disabled={tokens === 0 || checked}
            onClick={() => {
              setTokens(tokens - 1);
              setChecked(false);
            }}
          >
            Move one to broad
          </button>
          <button
            className="button secondary"
            disabled={tokens === 10 || checked}
            onClick={() => {
              setTokens(tokens + 1);
              setChecked(false);
            }}
          >
            Move one to café
          </button>
        </div>
        <p aria-live="polite">
          {tokens === 10
            ? "All tokens depend on the café basket."
            : `${10 - tokens} tokens now include other kinds of businesses. The broad basket can still fall in value.`}
        </p>
        {checked && <Feedback correct>{activity.explanation}</Feedback>}
        <button
          className="button primary"
          disabled={tokens === 10 || checked}
          onClick={() => {
            setChecked(true);
            onReady();
          }}
        >
          Explore this mix
        </button>
      </>
    );
  const correct = order.every((value, index) => value === index);
  function move(index: number, direction: number) {
    setChecked(false);
    setOrder((current) => {
      const next = [...current];
      [next[index], next[index + direction]] = [
        next[index + direction],
        next[index],
      ];
      return next;
    });
  }
  return (
    <>
      <h2>{activity.prompt}</h2>
      <ol className="order-steps">
        {order.map((value, index) => (
          <li key={value}>
            <span>
              {index + 1}. {labels[value]}
            </span>
            <div>
              <button
                className="icon-button"
                aria-label={`Move ${labels[value]} up`}
                disabled={index === 0 || (checked && correct)}
                onClick={() => move(index, -1)}
              >
                <ArrowUp size={18} />
              </button>
              <button
                className="icon-button"
                aria-label={`Move ${labels[value]} down`}
                disabled={index === 2 || (checked && correct)}
                onClick={() => move(index, 1)}
              >
                <ArrowDown size={18} />
              </button>
            </div>
          </li>
        ))}
      </ol>
      {checked && <Feedback correct={correct}>{activity.explanation}</Feedback>}
      <button
        className="button primary"
        disabled={checked && correct}
        onClick={() => {
          setChecked(true);
          if (correct) onReady();
          else onMiss();
        }}
      >
        Check this order
      </button>
    </>
  );
}
