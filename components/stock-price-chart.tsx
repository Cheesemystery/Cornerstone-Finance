"use client";
import { useEffect, useRef, useState } from "react";
import type { ResearchStock } from "@/lib/stock-research";
import { examplePriceSeries, exampleResearchDate } from "@/lib/stock-research";
import { money } from "@/lib/presentation";

function ExamplePriceChart({ stock }: { stock: ResearchStock }) {
  const [period, setPeriod] = useState<"1M" | "3M" | "1Y">("1M");
  const [selected, setSelected] = useState<number | null>(null);
  const values = examplePriceSeries(stock, period),
    min = Math.min(...values) * 0.985,
    max = Math.max(...values) * 1.015;
  const x = (index: number) => 36 + (index / (values.length - 1)) * 628;
  const y = (value: number) => 260 - ((value - min) / (max - min)) * 224;
  const points = values
    .map((value, index) => x(index) + "," + y(value))
    .join(" ");
  const index = selected ?? values.length - 1;
  return (
    <div className="example-price-chart">
      <div className="example-chart-toolbar">
        <span className="data-tag">Sample data - as of {exampleResearchDate} · authored curve</span>
        <div
          className="demo-tabs"
          role="group"
          aria-label="Example chart period"
        >
          {(["1M", "3M", "1Y"] as const).map((item) => (
            <button
              key={item}
              aria-pressed={period === item}
              onClick={() => {
                setPeriod(item);
                setSelected(null);
              }}
            >
              {item}
            </button>
          ))}
        </div>
      </div>
      <div className="example-quote example-curve-quote">
        <span>Authored example quote</span>
        <strong>{money(stock.example.price)}</strong>
        <small>{stock.example.dailyPercent > 0 ? "+" : ""}{stock.example.dailyPercent.toFixed(2)}% · illustrative daily move</small>
      </div>
      <svg
        viewBox="0 0 700 310"
        role="img"
        aria-label={
          stock.symbol +
          " authored example price curve, " +
          period +
          ". Use the slider below to inspect points."
        }
      >
        <defs>
          <linearGradient
            id={"price-fill-" + stock.symbol}
            x1="0"
            x2="0"
            y1="0"
            y2="1"
          >
            <stop offset="0%" stopColor="#278662" stopOpacity=".2" />
            <stop offset="100%" stopColor="#278662" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0, 1, 2, 3].map((i) => (
          <g key={i}>
            <line
              x1="36"
              x2="664"
              y1={36 + i * 74}
              y2={36 + i * 74}
              stroke="#e4ebe2"
            />
            <text x="36" y={27 + i * 74} fill="#667567" fontSize="11">
              {money(max - ((max - min) * i) / 3)}
            </text>
          </g>
        ))}
        <polygon
          points={"36,274 " + points + " 664,274"}
          fill={"url(#price-fill-" + stock.symbol + ")"}
        />
        <polyline
          points={points}
          fill="none"
          stroke="#278662"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <line
          x1={x(index)}
          x2={x(index)}
          y1="34"
          y2="274"
          stroke="#9ba99d"
          strokeDasharray="4 4"
        />
        <circle
          cx={x(index)}
          cy={y(values[index])}
          r="5"
          fill="#173e2e"
          stroke="white"
          strokeWidth="2"
        />
        <text x="36" y="300" fontSize="11" fill="#667567">
          Example start
        </text>
        <text x="664" y="300" textAnchor="end" fontSize="11" fill="#667567">
          Example end
        </text>
      </svg>
      <label className="example-point">
        <span>
          Inspect example point{" "}
          <strong>
            {index + 1}: {money(values[index])}
          </strong>
        </span>
        <input
          type="range"
          min="0"
          max={values.length - 1}
          value={index}
          onChange={(event) => setSelected(Number(event.target.value))}
        />
      </label>
    </div>
  );
}

export function TradingViewChart({
  symbol,
  fallback,
}: {
  symbol: string;
  fallback?: ResearchStock;
}) {
  const container = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<"loading" | "loaded" | "error">(
    "loading",
  );
  const [attempt, setAttempt] = useState(0);
  const [showExample, setShowExample] = useState(false);
  useEffect(() => {
    if (showExample) return;
    const host = container.current;
    if (!host) return;
    const wrapper = document.createElement("div");
    wrapper.className = "tradingview-widget-container";
    wrapper.style.height = "100%";
    wrapper.style.width = "100%";
    const widget = document.createElement("div");
    widget.className = "tradingview-widget-container__widget";
    widget.style.height = "100%";
    widget.style.width = "100%";
    wrapper.appendChild(widget);
    host.appendChild(wrapper);
    let active = true;
    const timer = setTimeout(() => {
      if (active)
        setStatus((current) => (current === "loaded" ? current : "error"));
    }, 12000);
    const observer = new MutationObserver(() => {
      const frame = wrapper.querySelector("iframe");
      if (frame) {
        frame.title = symbol + " price chart by TradingView";
        frame.addEventListener(
          "load",
          () => {
            if (active) {
              setStatus("loaded");
              clearTimeout(timer);
            }
          },
          { once: true },
        );
      }
    });
    observer.observe(wrapper, { childList: true, subtree: true });
    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.async = true;
    script.textContent = JSON.stringify({
      autosize: true,
      symbol,
      interval: "D",
      timezone: "Etc/UTC",
      theme: "light",
      style: "3",
      locale: "en",
      allow_symbol_change: false,
      calendar: false,
      details: false,
      hide_side_toolbar: true,
      hide_top_toolbar: false,
      hide_legend: true,
      hide_volume: true,
      hotlist: false,
      save_image: false,
      withdateranges: true,
      backgroundColor: "#ffffff",
      gridColor: "rgba(46,46,46,0.06)",
      support_host: "https://www.tradingview.com",
    });
    script.onerror = () => {
      if (active) {
        setStatus("error");
        clearTimeout(timer);
      }
    };
    // Strict Mode cleans up the first effect before it can launch the widget.
    const mountTimer = setTimeout(() => { if (active && wrapper.isConnected) wrapper.appendChild(script); }, 0);
    return () => {
      active = false;
      clearTimeout(mountTimer);
      clearTimeout(timer);
      observer.disconnect();
      wrapper.remove();
    };
  }, [symbol, attempt, showExample]);
  return (
    <div className="provider-price-chart">
      <p className="chart-as-of">Chart prices use the dates on the horizontal axis (UTC). Select a point for its as-of date. Provider data may be delayed.</p>
      <div className="chart-source-row">
        <span className="data-tag">
          {showExample ? "Example chart" : "TradingView chart"}
        </span>
        <div>
          {fallback && (
            <button
              className="demo-link"
              onClick={() => {
                setShowExample(!showExample);
                setStatus("loading");
              }}
            >
              {showExample ? "Use provider chart" : "View example chart"}
            </button>
          )}
        </div>
      </div>
      {!showExample && (
        <>
          <div
            ref={container}
            className={
              "tradingview-chart-host " +
              (status === "error" ? "chart-provider-failed" : "")
            }
          />
          {status !== "loaded" && (
            <div className="chart-loading-state" role="status">
              <strong>
                {status === "loading"
                  ? "Loading the provider chart…"
                  : "The chart could not load."}
              </strong>
              <p>
                {status === "loading"
                  ? "No account or API key needed."
                  : "Retry the chart or open TradingView directly."}
              </p>
              {status === "error" && (
                <button
                  className="button secondary"
                  onClick={() => {
                    setStatus("loading");
                    setAttempt(attempt + 1);
                  }}
                >
                  Retry chart
                </button>
              )}
            </div>
          )}
        </>
      )}
      {(showExample || status === "error") && fallback && (
        <ExamplePriceChart stock={fallback} />
      )}
      <div className="chart-attribution">
        <a
          href={
            "https://www.tradingview.com/chart/?symbol=" +
            encodeURIComponent(symbol)
          }
          target="_blank"
          rel="noopener noreferrer"
        >
          {showExample || status === "error" ? "Open TradingView chart ↗" : "Chart by TradingView ↗"}
        </a>
        <span>
          {showExample
            ? "Authored example only."
            : "Provider data may be delayed; availability varies by exchange."}
        </span>
      </div>
    </div>
  );
}
