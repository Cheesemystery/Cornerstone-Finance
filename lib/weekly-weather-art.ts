import type { WeeklyWeather } from "./weekly-editorial";

export const weatherLabels: Record<WeeklyWeather, string> = {
  "partly-cloudy":"Partly cloudy", "mostly-sunny":"Mostly sunny", sunny:"Sunny",
  overcast:"Overcast", "light-rain":"Light rain, passing",
};
export function weatherPaths(weather: WeeklyWeather) {
  const paths: {d:string; offset?:[number,number]}[] = [];
  if (["sunny","mostly-sunny","partly-cloudy"].includes(weather)) {
    const offset: [number,number] = weather === "sunny" ? [13,12] : [0,0];
    paths.push({d:"M31 19c8-1 15 5 15 13s-6 15-14 14c-8 0-14-6-14-13s5-13 13-14Z",offset},
      {d:"m31 7 1 5m17 2-4 5m12 12-6 1m-1 17-5-4M14 14l5 5M7 32l6 1m1 17 5-5m13 7-1 6",offset});
  }
  if (weather !== "sunny") paths.push({d:weather === "mostly-sunny"
    ? "M43 61h23c8 0 11-10 4-14-3-8-14-10-20-3-9-4-17 6-12 13 1 3 3 4 5 4Z"
    : "M24 62h43c13-1 15-17 4-22-2-16-23-22-34-9-12-6-25 4-22 16-10 4-7 15 9 15Z"});
  if (weather === "overcast") paths.push({d:"M28 21c5-8 18-10 26-3 8-3 17 0 20 8"});
  if (weather === "light-rain") paths.push({d:"m31 71-3 6m18-6-3 6m18-6-3 6"});
  return paths;
}
