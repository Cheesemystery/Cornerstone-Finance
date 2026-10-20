import { weeklyCopy, type PortfolioWeek } from "./weekly-portfolio";

// Percentage points, before display rounding. Keep editorial tuning here.
export const QUIET_WEEK_THRESHOLD = 0.5;
export const STRONG_WEEK_THRESHOLD = 2;
export const WEEK_PERCENT_DECIMALS = 2;
export type WeeklyWeather = "partly-cloudy" | "mostly-sunny" | "sunny" | "overcast" | "light-rain";

export function weeklyEditorial(percent: number) {
  const magnitude = Math.abs(percent);
  const direction = percent < 0 ? "down" : "up";
  const formatted = magnitude.toFixed(WEEK_PERCENT_DECIMALS);
  let title: string;
  let weather: WeeklyWeather;
  if (magnitude < QUIET_WEEK_THRESHOLD) {
    title = "A quiet week"; weather = "partly-cloudy";
  } else if (percent >= STRONG_WEEK_THRESHOLD) {
    title = "A clear week"; weather = "sunny";
  } else if (percent >= QUIET_WEEK_THRESHOLD) {
    title = "A bright week"; weather = "mostly-sunny";
  } else if (percent <= -STRONG_WEEK_THRESHOLD) {
    title = "A rainy stretch"; weather = "light-rain";
  } else {
    title = "An overcast week"; weather = "overcast";
  }
  return { headline: `${title}: ${direction} ${formatted}%`, weather };
}

export function weeklySubline(week: PortfolioWeek) {
  const first = weeklyCopy(week)[0];
  // Preserve the existing attribution; shorten the positive template for Home.
  if (week.percent > 0) return first.replace("made the biggest positive contribution", "lifted the week");
  const attribution = first.replace(/^Most of the decline came from (\S+) \(([^)]+)\)\.$/, "$1 contributed $2.");
  return `${attribution} Week-to-week moves are mostly noise.`;
}

export function editionRange(start: string, end: string) {
  const format = (date: string, year: boolean) => new Intl.DateTimeFormat("en-US", {
    month: "short", day: "numeric", ...(year ? { year: "numeric" } : {}), timeZone: "UTC",
  }).format(new Date(`${date}T12:00:00Z`));
  return `Week of ${format(start, start.slice(0, 4) !== end.slice(0, 4))} – ${format(end, true)}`;
}
