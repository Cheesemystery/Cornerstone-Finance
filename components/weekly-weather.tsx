import type { WeeklyWeather } from "@/lib/weekly-editorial";
import { weatherLabels, weatherPaths } from "@/lib/weekly-weather-art";

export function WeeklyWeatherIcon({ weather }: { weather: WeeklyWeather }) {
  return <svg viewBox="0 0 88 88" width="88" height="88" role="img" aria-label={weatherLabels[weather]} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {weatherPaths(weather).map((path,index) => <path key={index} d={path.d} transform={path.offset ? `translate(${path.offset.join(" ")})` : undefined} />)}
  </svg>;
}
