"use client";
import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { useDemo } from "./demo-provider";
import { exportHoldings, importHoldings, parseSavedHoldingsCsv, savedHoldingSchema } from "@/lib/saved-holdings";

export function HoldingsInput({ manage = false }: { manage?: boolean }) {
  const { savedHoldings, replaceHoldings, selectSample, holdingsPersistence } = useDemo();
  const [manual, setManual] = useState(false), [ticker, setTicker] = useState(""), [shares, setShares] = useState(""), [cost, setCost] = useState("");
  const [error, setError] = useState(""), [notice, setNotice] = useState(""), [reading, setReading] = useState(false);
  const csvInput = useRef<HTMLInputElement>(null), jsonInput = useRef<HTMLInputElement>(null);
  async function load(event: ChangeEvent<HTMLInputElement>, kind: "csv" | "json") {
    const file = event.target.files?.[0]; event.target.value = "";
    if (!file) return;
    setError(""); setNotice(""); setReading(true);
    try {
      if (file.size > 2_000_000) throw new Error("Choose a file smaller than 2 MB.");
      const text = await file.text();
      if (kind === "csv") replaceHoldings(parseSavedHoldingsCsv(text), "user");
      else { const parsed = importHoldings(text); replaceHoldings(parsed.holdings, parsed.source); }
      setNotice("Holdings saved in this browser. Closing prices are checked separately.");
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Check your file and try again."); }
    finally { setReading(false); }
  }
  function add(event: FormEvent) {
    event.preventDefault(); setError(""); setNotice("");
    const result = savedHoldingSchema.safeParse({ ticker, shares: Number(shares), ...(cost.trim() ? { costBasis: Number(cost) } : {}) });
    if (!result.success) { setError("Enter a valid ticker, a positive share count, and an optional non-negative total cost basis."); return; }
    try {
      const next = savedHoldings.holdings.filter(h => h.ticker !== result.data.ticker);
      replaceHoldings([...next, result.data], "user");
      setTicker(""); setShares(""); setCost(""); setNotice("Holding saved. Closing prices are checked separately.");
    } catch { setError("Save at most 50 unique tickers."); }
  }
  function download() {
    const url = URL.createObjectURL(new Blob([exportHoldings(savedHoldings)], { type: "application/json" }));
    const link = document.createElement("a"); link.href = url; link.download = "cornerstone-holdings.json"; link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return <div className="holdings-input" id={manage ? "holdings-input" : undefined}>
    <div className="holdings-input-options" role="group" aria-label="Choose how to add holdings">
      <button type="button" className="button secondary" disabled={reading} onClick={() => csvInput.current?.click()}>Upload CSV</button>
      <button type="button" className="button secondary" aria-expanded={manual} onClick={() => setManual(value => !value)}>Add manually</button>
      <button type="button" className="button lime" disabled={reading} onClick={() => { selectSample(); setError(""); setNotice("Sample holdings selected. All sample prices are labeled."); }}>Use sample portfolio</button>
    </div>
    <input ref={csvInput} hidden aria-label="Upload holdings CSV" type="file" accept=".csv,text/csv" onChange={event => void load(event,"csv")} />
    {manual && <form className="holdings-manual" onSubmit={add}>
      <label className="demo-label">Ticker<input className="demo-input" value={ticker} onChange={e => setTicker(e.target.value)} maxLength={15} required placeholder="VTI" /></label>
      <label className="demo-label">Shares<input className="demo-input" type="number" min="0.000001" max="1000000" step="any" value={shares} onChange={e => setShares(e.target.value)} required /></label>
      <label className="demo-label">Total cost basis (optional)<input className="demo-input" type="number" min="0" max="1000000000000" step="any" value={cost} onChange={e => setCost(e.target.value)} /></label>
      <button className="button primary">Save holding</button>
      <small>Saving an existing ticker replaces its share count.</small>
    </form>}
    {manage && <>
      <p className="muted small">CSV columns: ticker, shares, optional cost_basis. Older symbol/quantity columns also work; file prices are ignored.</p>
      {!!savedHoldings.holdings.length && <ul className="saved-holdings-list" aria-label="Saved holdings">
        {savedHoldings.holdings.map(h => <li key={h.ticker}><strong>{h.ticker}</strong><span>{h.shares} shares</span><button type="button" className="demo-link" aria-label={"Remove " + h.ticker + " holding"} onClick={() => replaceHoldings(savedHoldings.holdings.filter(item => item.ticker !== h.ticker), savedHoldings.source)}>Remove</button></li>)}
      </ul>}
      <div className="holdings-data-controls">
        <button type="button" className="button secondary" onClick={download}>Export holdings JSON</button>
        <button type="button" className="button secondary" disabled={reading} onClick={() => jsonInput.current?.click()}>Import holdings JSON</button>
      </div>
      <input ref={jsonInput} hidden aria-label="Import holdings JSON" type="file" accept=".json,application/json" onChange={event => void load(event,"json")} />
      <p className="muted small">Holdings stay in this browser. Only tickers and requested dates go to the server for prices.</p>
    </>}
    {reading && <p role="status">Reading your holdings…</p>}
    {notice && <p role="status">{notice}</p>}
    {error && <p role="alert">{error}</p>}
    {holdingsPersistence !== "saved" && <p role="status">{holdingsPersistence === "session" ? "Browser storage needs attention. Holdings and weekly completion will last for this session; export JSON to keep a copy." : "Saved holdings could not be read fully. Check your rows or import your JSON backup."}</p>}
  </div>;
}
