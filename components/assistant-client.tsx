"use client";
import Link from "next/link";
import { ArrowUp, ArrowUpRight, Sparkles, RotateCcw } from "lucide-react";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { useDemo } from "./demo-provider";
import { demoAnswer } from "@/lib/demo-assistant";
import { snapshotAsOf } from "@/lib/presentation";
type Turn = { question: string; asOf: string; answer: ReturnType<typeof demoAnswer> };
const prompts = [
  "Explain my portfolio",
  "How do I spread my risk?",
  "What is an ETF?",
  "How do fees affect growth?",
];
export function AssistantClient() {
  const { portfolio, savedHoldings, historyStatus } = useDemo();
  const tickers = savedHoldings ? savedHoldings.holdings.map(h => h.ticker) : portfolio.holdings.map(h => h.symbol);
  const priced = historyStatus === undefined || historyStatus === "ready";
  const [question, setQuestion] = useState("");
  const [turns, setTurns] = useState<Turn[]>([]);
  const input = useRef<HTMLInputElement>(null);
  const thread = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (thread.current) thread.current.scrollTop = thread.current.scrollHeight;
  }, [turns]);
  const [error, setError] = useState("");
  function ask(value: string) {
    const text = value.trim();
    if (!text) return;
    if (text.length > 500) {
      setError("Keep your question under 500 characters.");
      return;
    }
    setTurns((current) => [
      ...current.slice(-9),
      {
        question: text,
        asOf: priced ? snapshotAsOf(portfolio) : "Saved holdings · a priced result needs dated history",
        answer: !priced && /portfolio|holdings|ticker/i.test(text) ? { text: "Your saved holdings need complete closing prices before I can quote a value or change. Open Portfolio to check the history or use the sample.", href: "/portfolio", label: "Check holdings and dates" } : !priced && tickers.some(ticker => text.toUpperCase().split(/\s+/).includes(ticker)) ? { text: "This ticker is saved, but I cannot quote a value or change without dated closing prices.", href: "/portfolio", label: "Check holdings and dates" } : demoAnswer(text, portfolio),
      },
    ]);
    setQuestion("");
    setError("");
    input.current?.focus();
  }
  function submit(event: FormEvent) {
    event.preventDefault();
    ask(question);
  }
  return (
    <div className="workspace guide-layout">
      <section className="guide-main">
        <div className="guide-top">
          <span>
            <Sparkles size={17} /> Guided Q&A
          </span>
          <button
            className="demo-link"
            disabled={!turns.length}
            onClick={() => {
              setTurns([]);
              setError("");
              input.current?.focus();
            }}
          >
            <RotateCcw size={14} /> Start over
          </button>
        </div>
        <div
          ref={thread}
          className="guide-thread"
          role="log"
          aria-label="Guided Q&A conversation"
          aria-live="polite"
        >
          {!turns.length ? (
            <div className="guide-welcome">
              <span className="guide-orb">
                <Sparkles size={35} />
              </span>
              <div className="guide-prompts">
                {prompts.map((p) => (
                  <button key={p} onClick={() => ask(p)}>
                    {p}
                    <ArrowUpRight size={16} />
                  </button>
                ))}
              </div>
            </div>
          ) : (
            turns.map((turn, i) => (
              <div className="guide-turn" key={i}>
                <div className="guide-question">
                  <span>You</span>
                  <p>{turn.question}</p>
                </div>
                <div className="guide-answer">
                  <span>
                    <Sparkles size={14} /> Cornerstone guided Q&A
                  </span>
                  {turn.answer.text.split("\n").map((line, j) => (
                    <p key={j}>{line}</p>
                  ))}
                  <small>{turn.asOf}</small>
                  <Link className="demo-link" href={turn.answer.href}>
                    {turn.answer.label}
                    <ArrowUpRight size={15} />
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
        <form className="guide-composer" onSubmit={submit}>
          <label className="sr-only" htmlFor="question">
            Ask Cornerstone
          </label>
          <input
            ref={input}
            id="question"
            value={question}
            maxLength={500}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask a question about money…"
          />
          <button
            className="button primary"
            disabled={!question.trim()}
            aria-label="Send question"
          >
            <ArrowUp size={18} />
          </button>
        </form>
        {error && (
          <p role="alert" className="demo-status">
            {error}
          </p>
        )}
        <p className="demo-muted">
          Curated demo answers and portfolio math. Not live AI or market news.
          Chat clears on reload; the latest 10 questions stay visible.
        </p>
      </section>
      <aside className="guide-aside">
        <div className="demo-card tone-purple">
          <h3>Got a ticker in mind?</h3>
          <div className="demo-tabs">
            {tickers.slice(0, 6).map((ticker) => (
              <button key={ticker} onClick={() => ask(`Explain ${ticker}`)}>
                {ticker}
              </button>
            ))}
          </div>
          <p>{priced ? snapshotAsOf(portfolio) : "Your saved tickers; closing prices are being checked."}</p>
          {!tickers.length && <Link href="/portfolio">Add holdings to ask about a ticker →</Link>}
        </div>
      </aside>
    </div>
  );
}
