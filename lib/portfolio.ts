import type { Briefing, Holding, PortfolioSnapshot } from "./domain";

export const marketValue = (holding: Holding) => holding.quantity * holding.price;

export function summarizePortfolio(snapshot: PortfolioSnapshot) {
  const totalValue = snapshot.holdings.reduce((sum, holding) => sum + marketValue(holding), 0);
  const previousValue = snapshot.holdings.reduce(
    (sum, holding) => sum + holding.quantity * holding.previousClose,
    0
  );
  const dayChange = totalValue - previousValue;
  const dayChangePercent = previousValue ? (dayChange / previousValue) * 100 : 0;
  const allocations = snapshot.holdings
    .map((holding) => ({
      symbol: holding.symbol,
      value: marketValue(holding),
      percent: totalValue ? (marketValue(holding) / totalValue) * 100 : 0
    }))
    .sort((a, b) => b.value - a.value);
  const contributors = snapshot.holdings
    .map((holding) => ({
      symbol: holding.symbol,
      value: holding.quantity * (holding.price - holding.previousClose)
    }))
    .sort((a, b) => b.value - a.value);

  return { totalValue, previousValue, dayChange, dayChangePercent, allocations, contributors };
}

export function buildBriefing(snapshot: PortfolioSnapshot): Briefing {
  const summary = summarizePortfolio(snapshot);
  const largest = summary.allocations[0];
  const top = movementSummary(snapshot).driver;
  const direction = summary.dayChange > 0.005 ? "up" : summary.dayChange < -0.005 ? "down" : "unchanged";
  const events: Briefing["events"] = [
    {
      id: "daily-move",
      kind: "performance",
      priority: "high",
      headline: summary.totalValue === 0 ? "No holdings to summarize" : direction === "unchanged" ? "No net change in this snapshot" : `Latest available change: ${direction} ${Math.abs(summary.dayChangePercent).toFixed(2)}%`,
      summary: top ? `${top.symbol} made the largest ${direction === "down" ? "negative" : "positive"} contribution versus the supplied previous close. This is arithmetic attribution, not an explanation of why prices moved.` : "No directional driver is implied by an empty or unchanged snapshot.",
      symbols: top ? [top.symbol] : [],
      sources: [{ label: "Portfolio holdings", asOf: snapshot.asOf }],
      researchPrompt: top ? `What does this snapshot show for ${top.symbol}?` : undefined
    }
  ];

  if (largest && largest.percent >= 40) {
    events.push({
      id: "concentration",
      kind: "risk",
      priority: "medium",
      headline: `${largest.symbol} represents ${largest.percent.toFixed(0)}% of the portfolio`,
      summary: "A large position can drive both gains and losses. Compare this exposure with your time horizon and risk tolerance.",
      symbols: [largest.symbol],
      sources: [{ label: "Calculated from current holdings", asOf: snapshot.asOf }],
      researchPrompt: `How does concentration risk work for ${largest.symbol}?`
    });
  }

  events.push({
    id: "research-next",
    kind: "news",
    priority: "low",
    headline: `Research the companies driving ${top?.symbol ?? "your portfolio"}`,
    summary: "Open original sources and check their dates. This snapshot does not establish why a price moved.",
    symbols: top ? [top.symbol] : [],
    sources: [{ label: "Educational research prompt", asOf: snapshot.asOf }],
    researchPrompt: top ? `Show sourced news for ${top.symbol}` : "Open the research checklist"
  });

  return {
    id: `briefing-${snapshot.id}`,
    portfolioId: snapshot.id,
    generatedAt: new Date().toISOString(),
    marketStatus: "closed",
    facts: {
      totalValue: summary.totalValue,
      dayChange: summary.dayChange,
      dayChangePercent: summary.dayChangePercent,
      topContributor: top?.symbol ?? "—",
      largestPositionPercent: largest?.percent ?? 0
    },
    events,
    disclosure: "Educational information only. Cornerstone does not provide individualized investment advice or execute trades."
  };
}

export const freeEntitlements = {
  plan: "free",
  maxPortfolios: 1,
  aiExplanationsPerMonth: 20,
  advancedBriefings: false,
  customAlerts: false
} as const;


/** Direction-aware attribution shared by every snapshot summary. */
export function movementSummary(snapshot: PortfolioSnapshot) {
  const summary = summarizePortfolio(snapshot);
  const direction = summary.dayChange < -0.005 ? "lower" : summary.dayChange > 0.005 ? "higher" : "unchanged";
  const ranked = [...summary.contributors].sort((a,b) => direction === "lower" ? a.value-b.value : b.value-a.value);
  const driver = direction === "unchanged" ? undefined : ranked.find(item => direction === "lower" ? item.value < 0 : item.value > 0);
  const offset = direction === "unchanged" ? undefined : [...ranked].reverse().find(item => direction === "lower" ? item.value > 0 : item.value < 0);
  return { summary, direction, ranked, driver, offset };
}
