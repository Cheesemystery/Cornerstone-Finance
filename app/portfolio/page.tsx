import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";
import { samplePortfolio } from "@/lib/sample-data";
import { marketValue, summarizePortfolio } from "@/lib/portfolio";

const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

export default function PortfolioPage() {
  const summary = summarizePortfolio(samplePortfolio);
  return <AppShell>
    <PageHeader eyebrow="Sample portfolio" title="Portfolio" description="See what you own, how it is allocated, and what is driving performance." action={<button className="button primary">Connect or import</button>} />
    <div className="workspace two-column">
      <section className="card"><h2>Holdings</h2><div className="table-wrap"><table className="table"><thead><tr><th>Investment</th><th>Quantity</th><th>Allocation</th><th>Value</th><th>Today</th></tr></thead><tbody>{samplePortfolio.holdings.map((holding) => { const value=marketValue(holding); const pct=value/summary.totalValue*100; const daily=(holding.price-holding.previousClose)/holding.previousClose*100; return <tr key={holding.symbol}><td><strong>{holding.symbol}</strong><br/><span className="muted small">{holding.name}</span></td><td>{holding.quantity}</td><td>{pct.toFixed(1)}%</td><td>{money.format(value)}</td><td className={daily>=0?"positive":"negative"}>{daily>=0?"+":""}{daily.toFixed(2)}%</td></tr>; })}</tbody></table></div></section>
      <aside className="card"><p className="eyebrow">Allocation review</p><h2>Broadly balanced</h2><p className="muted small">Your largest position is {summary.allocations[0]?.symbol} at {summary.allocations[0]?.percent.toFixed(0)}%. Cornerstone highlights concentration; it does not tell you what to buy or sell.</p><div className="security-strip" style={{marginTop:20}}><span><strong>Updated from sample data</strong><br/>Sep 2 · 4:00 PM ET</span></div></aside>
    </div>
  </AppShell>;
}
