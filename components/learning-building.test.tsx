// @vitest-environment jsdom
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { BuildingDrawing, LearningBuildingCard, LessonBuildingCompletion } from "./learning-building";
import { MvpProvider } from "./mvp-provider";
import { BUILDING_STORAGE_KEY, laidBrickCount, BRICK_DROP_MS } from "@/lib/building";
import { emptyLearning } from "@/lib/learning-progress";
import { lessons } from "@/lib/lessons";

const five = lessons.slice(0,5).map(lesson => lesson.id);
const six = lessons.map(lesson => lesson.id);
let deviceReduced=false;
beforeEach(() => {
  deviceReduced=false;
  localStorage.setItem(BUILDING_STORAGE_KEY,JSON.stringify({version:1,skin:"campus",chosen:false}));
  vi.stubGlobal("matchMedia",vi.fn(() => ({get matches(){return deviceReduced;},addEventListener:vi.fn(),removeEventListener:vi.fn()})));
});
afterEach(() => {cleanup();localStorage.clear();vi.unstubAllGlobals();vi.useRealTimers();});

it("backfills five lessons into a fixed grid, bottom to top and left to right, and caps future progress", () => {
  const view=render(<BuildingDrawing completed={five} skin="campus" />);
  expect(screen.getByRole("img").getAttribute("aria-label")).toBe("Your building: 5 of 24 bricks laid");
  expect(view.container.querySelectorAll('[data-brick]')).toHaveLength(24);
  expect(view.container.querySelectorAll('[data-laid="true"]')).toHaveLength(5);
  expect(view.container.querySelector('[data-brick="1"]')?.getAttribute("transform")).toBe("translate(43 316)");
  expect(view.container.querySelector('[data-brick="4"]')?.getAttribute("transform")).toBe("translate(283 316)");
  expect(view.container.querySelector('[data-brick="5"]')?.getAttribute("transform")).toBe("translate(43 268)");
  const future=Array.from({length:30},(_,index)=>String(index));
  view.rerender(<BuildingDrawing completed={future} skin="skyscraper" />);
  expect(view.container.querySelectorAll('[data-laid="true"]')).toHaveLength(24);
  expect(laidBrickCount([...five,...five])).toBe(5);
});

it("asks for a skin before the first drop, persists only the choice, and focuses Continue immediately", () => {
  vi.useFakeTimers();
  const view=render(<LessonBuildingCompletion completed={six} newCompletion reducedMotion={false} />);
  expect(screen.getByRole("heading",{name:"Choose your building"})).toBeTruthy();
  expect(screen.queryByRole("link",{name:"Continue"})).toBeNull();
  fireEvent.click(screen.getByRole("button",{name:"Library"}));
  expect(JSON.parse(localStorage.getItem(BUILDING_STORAGE_KEY)!)).toEqual({version:1,skin:"library",chosen:true});
  expect(view.container.querySelectorAll('[data-incoming="true"]')).toHaveLength(1);
  expect(screen.getByRole("img").getAttribute("aria-label")).toBe("Your building: 6 of 24 bricks laid");
  expect(screen.getByRole("link",{name:"Continue"}).getAttribute("href")).toBe("/learn");
  expect(document.activeElement).toBe(screen.getByRole("link",{name:"Continue"}));
  act(()=>vi.advanceTimersByTime(BRICK_DROP_MS+100));
  expect(document.activeElement).toBe(screen.getByRole("link",{name:"Continue"}));
  expect(view.container.querySelector('[aria-live="polite"]')?.textContent).toBe("Brick 6 of 24 laid");
  view.unmount();
  render(<LessonBuildingCompletion completed={six} newCompletion={false} reducedMotion={false} />);
  expect(screen.getByRole("img").getAttribute("data-skin")).toBe("library");
  expect(document.querySelector('[data-incoming="true"]')).toBeNull();
});

it.each(["setting","device"])("skips the drop and focuses immediately for the %s reduced-motion preference", preference => {
  vi.useFakeTimers();
  localStorage.setItem(BUILDING_STORAGE_KEY,JSON.stringify({version:1,skin:"campus",chosen:true}));
  deviceReduced=preference==="device";
  const view=render(<LessonBuildingCompletion completed={six} newCompletion reducedMotion={preference==="setting"} />);
  expect(screen.getByRole("img").getAttribute("data-reduced-motion")).toBe("true");
  expect(document.activeElement).toBe(screen.getByRole("link",{name:"Continue"}));
  act(()=>vi.advanceTimersByTime(200));
  expect(view.container.querySelector('[data-incoming="true"]')).toBeNull();
});

it("shows saved progress quietly in Learn and changing skins never changes that progress", () => {
  localStorage.setItem("cornerstone-learning-v1",JSON.stringify({...emptyLearning,completed:five}));
  const saved=localStorage.getItem("cornerstone-learning-v1");
  const view=render(<MvpProvider><LearningBuildingCard /></MvpProvider>);
  expect(screen.getByText("5 of 24 bricks")).toBeTruthy();
  expect(view.container.querySelector('[data-incoming="true"]')).toBeNull();
  fireEvent.click(screen.getByRole("button",{name:"Change building"}));
  fireEvent.click(screen.getByRole("button",{name:"Skyscraper"}));
  expect(screen.getByRole("img").getAttribute("data-skin")).toBe("skyscraper");
  expect(localStorage.getItem("cornerstone-learning-v1")).toBe(saved);
  expect(document.activeElement).toBe(screen.getByRole("button",{name:"Change building"}));
});

it("never takes focus back when the brick animation finishes", () => {
  vi.useFakeTimers();
  render(<LessonBuildingCompletion completed={six} newCompletion reducedMotion={false} phaseOne />);
  expect(document.activeElement).toBe(screen.getByRole("link",{name:"Continue"}));
  const recap=screen.getByRole("link",{name:"View my Recap"});
  recap.focus();
  act(()=>vi.advanceTimersByTime(BRICK_DROP_MS+100));
  expect(document.activeElement).toBe(recap);
});

it("falls back to the default picker without crashing on corrupt storage", () => {
  localStorage.setItem(BUILDING_STORAGE_KEY,"not json");
  render(<LessonBuildingCompletion completed={six} newCompletion reducedMotion={false} />);
  expect(screen.getByRole("button",{name:"Campus hall"}).getAttribute("aria-pressed")).toBe("true");
  fireEvent.click(screen.getByRole("button",{name:"Campus hall"}));
  expect(screen.getByText("6 of 24 bricks")).toBeTruthy();
});
