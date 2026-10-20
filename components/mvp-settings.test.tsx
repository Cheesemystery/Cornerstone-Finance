// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, it } from "vitest";
import { MvpSettings } from "./mvp-settings";
import { MvpProvider } from "./mvp-provider";
import { DemoProvider } from "./demo-provider";
import { emptyLearning } from "@/lib/learning-progress";

afterEach(() => { cleanup(); localStorage.clear(); });
it("saves Reduce motion without changing learning progress or practice records", () => {
  const learning = { ...emptyLearning, completed: ["what-you-own"], steps: { "what-you-own": 6 }, onboarded: true };
  const practice = '{"version":1,"runId":"preserved-run"}';
  localStorage.setItem("cornerstone-learning-v1", JSON.stringify(learning));
  localStorage.setItem("cornerstone-practice-v1", practice);
  render(<DemoProvider><MvpProvider><MvpSettings /></MvpProvider></DemoProvider>);
  const control = screen.getByRole("switch", { name: "Reduce motion" });
  expect(control.getAttribute("aria-describedby")).toBe("reduce-motion-description");
  fireEvent.click(control);
  expect(control.getAttribute("aria-checked")).toBe("true");
  expect(JSON.parse(localStorage.getItem("cornerstone-learning-v1")!)).toEqual({ ...learning, reducedMotion: true });
  expect(localStorage.getItem("cornerstone-practice-v1")).toBe(practice);
  fireEvent.click(screen.getByText("Reduce motion"));
  expect(control.getAttribute("aria-checked")).toBe("false");
  expect(JSON.parse(localStorage.getItem("cornerstone-learning-v1")!)).toEqual(learning);
});
