"use client";
import { useState, type FormEvent } from "react";
import {
  Search,
} from "lucide-react";
import {
  researchStocks,
  resolveResearchStock,
  customResearchStock,
  type ResearchStock,
} from "@/lib/stock-research";
import { TradingViewChart } from "./stock-price-chart";
import { DiscoverSearch } from "./discover-search";

type Selection = Pick<ResearchStock, "symbol" | "name" | "exchange" | "kind"> &
  Partial<
    Pick<ResearchStock, "example" | "headlines" | "customers" | "suppliers">
  >;
export function StockResearcher({
  initialQuery = "",
}: {
  initialQuery?: string;
}) {
  const initial =
    resolveResearchStock(initialQuery) ??
    customResearchStock(initialQuery) ??
    researchStocks[0];
  const [selected, setSelected] = useState<Selection>(initial),
    [query, setQuery] = useState(initialQuery),
    [error, setError] = useState("");
  const matches = researchStocks.filter((stock) =>
    (stock.symbol + " " + stock.name)
      .toLowerCase()
      .includes(query.toLowerCase().trim()),
  );
  const providerSymbol =
    (selected.exchange ? selected.exchange + ":" : "") + selected.symbol;
  function choose(stock: Selection) {
    setSelected(stock);
    setQuery("");
    setError("");
    const url = new URL(window.location.href);
    url.searchParams.set("q", stock.symbol);
    window.history.replaceState(null, "", url);
  }
  function search(event: FormEvent) {
    event.preventDefault();
    const stock = resolveResearchStock(query) ?? customResearchStock(query);
    if (stock) choose(stock);
    else setError("Choose an example below, or enter a ticker such as AAPL.");
  }
  return (
    <div className="stock-researcher">
      <form className="stock-search-row" onSubmit={search}>
        <label className="searchbox">
          <Search size={19} />
          <span className="sr-only">Search stock ticker or company</span>
          <input
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setError("");
            }}
            placeholder="Search a company or ticker, e.g. AAPL"
          />
        </label>
        <button className="button primary" disabled={!query.trim()}>
          Research
        </button>
      </form>
      {error && (
        <p role="alert" className="inline-error">
          {error}
        </p>
      )}
      <div className="stock-picker" role="group" aria-label="Research examples">
        {matches.slice(0, 9).map((stock) => {
          return (
            <button
              key={stock.symbol}
              aria-pressed={selected.symbol === stock.symbol}
              onClick={() => choose(stock)}
              title={stock.name}
            >
              <strong>
                {stock.symbol}

              </strong>
              <span>{stock.name}</span>
            </button>
          );
        })}
        {!matches.length && (
          <p className="muted">
            No matching example. Enter a ticker to request its provider chart.
          </p>
        )}
      </div>
      <div className="research-dashboard research-chart-only">
        <div className="research-main">
          <section className="mvp-card stock-chart-card">
            <header className="stock-chart-heading">
              <div>
                <h2>
                  {selected.name} <span>{selected.symbol}</span>
                </h2>
                <p>
                  {selected.exchange || "Symbol lookup"} ·{" "}
                  {selected.kind === "fund" ? "Fund" : "Stock"}
                </p>
              </div>
            </header>
            <TradingViewChart
              key={providerSymbol}
              symbol={providerSymbol}
            />
          </section>
          <details className="research-explainers">
            <summary>
              Keep building your research skills · saved explainers
            </summary>
            <DiscoverSearch
              initialQuery={
                resolveResearchStock(initialQuery) ? initialQuery : ""
              }
            />
          </details>
        </div>
      </div>
    </div>
  );
}
