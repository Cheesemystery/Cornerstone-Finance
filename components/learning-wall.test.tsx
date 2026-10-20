// @vitest-environment jsdom
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { StrictMode } from "react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { emptyLearning, type LearningState } from "@/lib/learning-progress";
import { lessons } from "@/lib/lessons";
import { stoneAppearance, WALL_SEEN_KEY, STONE_LAY_MS } from "@/lib/stone-wall";
import { LearningWall } from "./learning-wall";

const state = vi.hoisted(() => ({learning:null as LearningState | null, now:null as Date | null}));
vi.mock("./mvp-provider", () => ({useMvp:() => ({learning:state.learning!,now:state.now})}));
beforeEach(() => {
  localStorage.clear(); vi.useFakeTimers();
  state.learning = {...emptyLearning,completed:[],events:[]}; state.now = new Date("2026-10-19T12:00:00Z");
  vi.stubGlobal("matchMedia", vi.fn(() => ({matches:false,addEventListener:vi.fn(),removeEventListener:vi.fn()})));
});
afterEach(() => { cleanup(); vi.useRealTimers(); vi.unstubAllGlobals(); });
const settle = () => { act(() => vi.runAllTimers()); act(() => vi.runAllTimers()); };

it("uses every catalog lesson and stable seeded shapes, and adopts pre-existing stones quietly", () => {
  state.learning!.completed = [lessons[0].id];
  const {container} = render(<StrictMode><LearningWall /></StrictMode>);
  settle();
  expect(screen.getAllByRole("button")).toHaveLength(lessons.length);
  expect(screen.getByText(`1 of ${lessons.length} stones laid`)).toBeTruthy();
  expect(container.querySelectorAll('[data-laying="true"]')).toHaveLength(0);
  expect(JSON.parse(localStorage.getItem(WALL_SEEN_KEY)!)).toEqual([lessons[0].id]);
  expect(stoneAppearance(lessons[0].id)).toEqual(stoneAppearance(lessons[0].id));
  expect(stoneAppearance(lessons[0].id)).not.toEqual(stoneAppearance(lessons[1].id));
});

it("waits for hydrated learning before adopting existing completions", () => {
  state.now = null;
  const view = render(<LearningWall />); settle();
  expect(localStorage.getItem(WALL_SEEN_KEY)).toBeNull();
  state.learning!.completed = [lessons[0].id]; state.now = new Date("2026-10-19T12:00:00Z");
  view.rerender(<LearningWall />); settle();
  expect(JSON.parse(localStorage.getItem(WALL_SEEN_KEY)!)).toEqual([lessons[0].id]);
  expect(view.container.querySelector('[data-laying="true"]')).toBeNull();
});

it("lays multiple new stones sequentially after the chart, announces them and never replays on return", () => {
  localStorage.setItem(WALL_SEEN_KEY, "[]");
  state.learning!.completed = lessons.slice(0,2).map(lesson => lesson.id);
  const view = render(<StrictMode><LearningWall chartEntranceMs={580} /></StrictMode>);
  act(() => vi.advanceTimersByTime(0));
  act(() => vi.advanceTimersByTime(579));
  expect(view.container.querySelector('[data-laying="true"]')).toBeNull();
  act(() => vi.advanceTimersByTime(1));
  expect(view.container.querySelectorAll('[data-laying="true"]')).toHaveLength(1);
  expect(view.container.querySelector('[aria-live]')!.textContent).toBe(`Stone laid: ${lessons[0].title}`);
  expect(JSON.parse(localStorage.getItem(WALL_SEEN_KEY)!)).toEqual([lessons[0].id]);
  act(() => vi.advanceTimersByTime(STONE_LAY_MS));
  expect(view.container.querySelectorAll('[data-laying="true"]')).toHaveLength(1);
  expect(view.container.querySelector('[aria-live]')!.textContent).toBe(`Stone laid: ${lessons[1].title}`);
  settle(); view.unmount();
  const next = render(<StrictMode><LearningWall /></StrictMode>); settle();
  expect(next.container.querySelector('[data-laying="true"]')).toBeNull();
  expect(next.container.querySelector('[aria-live]')!.textContent).toBe("");
});

it("does not consume an unplayed stone when leaving during a sequence", () => {
  localStorage.setItem(WALL_SEEN_KEY, "[]");
  state.learning!.completed = lessons.slice(0,2).map(lesson => lesson.id);
  const view = render(<LearningWall />);
  act(() => vi.advanceTimersByTime(0)); act(() => vi.advanceTimersByTime(0));
  view.unmount();
  expect(JSON.parse(localStorage.getItem(WALL_SEEN_KEY)!)).toEqual([lessons[0].id]);
  const next = render(<LearningWall />); settle();
  expect(next.container.querySelector('[aria-live]')!.textContent).toBe(`Stone laid: ${lessons[1].title}`);
});

it("waits for price loading to settle before starting the chart-then-wall sequence", () => {
  localStorage.setItem(WALL_SEEN_KEY, "[]");
  state.learning!.completed = [lessons[0].id];
  const view = render(<LearningWall animationsReady={false} />); settle();
  expect(JSON.parse(localStorage.getItem(WALL_SEEN_KEY)!)).toEqual([]);
  expect(view.container.querySelector('[data-laying="true"]')).toBeNull();
  view.rerender(<LearningWall animationsReady chartEntranceMs={580} />);
  act(() => vi.advanceTimersByTime(579));
  expect(view.container.querySelector('[data-laying="true"]')).toBeNull();
  act(() => vi.advanceTimersByTime(1));
  expect(view.container.querySelector('[data-laying="true"]')).toBeTruthy();
});

it.each(["saved", "device"])("makes the sequence instant with %s reduced motion", source => {
  localStorage.setItem(WALL_SEEN_KEY, "[]");
  state.learning!.completed = lessons.slice(0,2).map(lesson => lesson.id);
  state.learning!.reducedMotion = source === "saved";
  if (source === "device") vi.stubGlobal("matchMedia", vi.fn(() => ({matches:true,addEventListener:vi.fn(),removeEventListener:vi.fn()})));
  const view = render(<LearningWall chartEntranceMs={580} />); settle();
  expect(vi.getTimerCount()).toBe(0);
  expect(view.container.querySelector('[data-laying="true"]')).toBeNull();
  expect(JSON.parse(localStorage.getItem(WALL_SEEN_KEY)!)).toEqual(state.learning!.completed);
});

it("shows real laid dates or an honest missing-date label, supports focus/Escape and never resets on Monday", () => {
  state.learning!.completed = lessons.slice(0,2).map(lesson => lesson.id);
  state.learning!.events = [{id:`lesson:${lessons[0].id}`,kind:"lesson",target:lessons[0].id,at:"2026-10-16T23:00:00Z",day:"2026-10-16"}];
  const view = render(<LearningWall />); settle();
  const buttons = screen.getAllByRole("button");
  fireEvent.focus(buttons[0]); expect(screen.getByRole("tooltip").textContent).toContain("Laid Oct 16, 2026");
  fireEvent.keyDown(buttons[0],{key:"Escape"}); expect(screen.queryByRole("tooltip")).toBeNull();
  fireEvent.focus(buttons[1]); expect(screen.getByRole("tooltip").textContent).toContain("Date not recorded");
  state.now = new Date("2026-10-26T12:00:00Z"); view.rerender(<LearningWall />); settle();
  expect(screen.getByText(`2 of ${lessons.length} stones laid`)).toBeTruthy();
});
