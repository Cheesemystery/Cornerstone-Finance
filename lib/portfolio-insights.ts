import type { Holding } from "./domain";
import { marketValue } from "./portfolio";
export function recordedGrowth(holdings: Holding[]) {
  const positions = holdings.filter((holding) => holding.quantity > 0);
  if (
    !positions.length ||
    positions.some(
      (holding) =>
        holding.costBasis === undefined ||
        !Number.isFinite(holding.costBasis) ||
        holding.costBasis! < 0,
    )
  )
    return null;
  const cost = positions.reduce((sum, holding) => sum + holding.costBasis!, 0);
  const value = positions.reduce(
    (sum, holding) => sum + marketValue(holding),
    0,
  );
  return {
    value: value - cost,
    percent: cost > 0 ? ((value - cost) / cost) * 100 : null,
    cost,
  };
}
export function movementHeading(
  index: number,
  changePercent: number,
  isToday: boolean,
) {
  if (changePercent > 10 && index % 12 === 11)
    return isToday ? "Big day! What changed?" : "Big move! What shaped it?";
  const headings = [
    "What drove the move?",
    isToday ? "What happened today?" : "What changed in this snapshot?",
    "Which holdings shaped your result?",
    "Your money story. What changed?",
  ];
  return headings[index % headings.length];
}
export const exampleMonth = {
  month: "2026-09",
  label: "September 2026",
  values: [1000, 1008, 996, 1014, 1021, 1006, 1018, 1030, 1026, 1037],
  note: "A fictional $1,000 portfolio across an example month. No deposits or withdrawals are modeled.",
};
export function monthlyComparison(
  points: { date: string; value: number }[],
  month: string,
) {
  if (!/^\d{4}-\d{2}$/.test(month)) return null;
  const [year, part] = month.split("-").map(Number);
  if (part < 1 || part > 12) return null;
  const lastDay = new Date(Date.UTC(year, part, 0)).toISOString().slice(0, 10);
  const previousDay = new Date(Date.UTC(year, part - 1, 0))
    .toISOString()
    .slice(0, 10);
  const start = points.find((point) => point.date === previousDay);
  const end = points.find((point) => point.date === lastDay);
  if (
    !start ||
    !end ||
    !Number.isFinite(start.value) ||
    !Number.isFinite(end.value) ||
    start.value <= 0
  )
    return null;
  return {
    value: end.value - start.value,
    percent: ((end.value - start.value) / start.value) * 100,
  };
}
