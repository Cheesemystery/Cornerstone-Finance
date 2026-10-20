// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { ChoiceQuestion, LessonInteraction } from "./lesson-interaction";
import { lessonActivities } from "@/lib/lesson-activities";
afterEach(cleanup);
it("explains mistakes, permits retries, and accepts the correct answer once", () => {
  const ready = vi.fn(),
    miss = vi.fn();
  render(
    <ChoiceQuestion
      question="What is ownership?"
      options={["A loan", "A share"]}
      correct={1}
      explanation="A stock is ownership."
      feedback={["A loan is debt, not ownership.", "A share is ownership."]}
      onReady={ready}
      onMiss={miss}
    />,
  );
  fireEvent.click(screen.getByLabelText("A loan"));
  fireEvent.click(screen.getByText("Check answer"));
  expect(screen.getByRole("status").textContent).toContain("debt");
  expect(ready).not.toHaveBeenCalled();
  expect(miss).toHaveBeenCalledOnce();
  fireEvent.click(screen.getByLabelText("A share"));
  fireEvent.click(screen.getByText("Check answer"));
  expect(ready).toHaveBeenCalledOnce();
});
it("matches ownership, loans, and baskets before continuing", () => {
  const ready = vi.fn();
  render(
    <LessonInteraction
      activity={lessonActivities["what-you-own"]}
      onReady={ready}
      onMiss={() => undefined}
    />,
  );
  for (const [label, value] of [
    ["A small ownership share of the café", "stock"],
    ["A loan to the café with payment terms", "bond"],
    ["A basket holding several investments", "fund"],
  ])
    fireEvent.change(screen.getByLabelText(label), { target: { value } });
  fireEvent.click(screen.getByText("Check my matches"));
  expect(ready).toHaveBeenCalledOnce();
});
it("offers tap controls for moving allocation tokens without dragging", () => {
  const ready = vi.fn();
  render(
    <LessonInteraction
      activity={lessonActivities["spread-your-risk"]}
      onReady={ready}
      onMiss={() => undefined}
    />,
  );
  fireEvent.click(screen.getByText("Move one to broad"));
  fireEvent.click(screen.getByText("Explore this mix"));
  expect(ready).toHaveBeenCalledOnce();
  expect(screen.getByRole("status").textContent).toContain("basket");
});
it("reorders research steps through labeled buttons", () => {
  const ready = vi.fn();
  render(
    <LessonInteraction
      activity={lessonActivities["research-checklist"]}
      onReady={ready}
      onMiss={() => undefined}
    />,
  );
  fireEvent.click(
    screen.getByLabelText(
      "Move Consider how it fits your needs and existing mix down",
    ),
  );
  fireEvent.click(
    screen.getByLabelText(
      "Move Consider how it fits your needs and existing mix down",
    ),
  );
  fireEvent.click(screen.getByText("Check this order"));
  expect(ready).toHaveBeenCalledOnce();
});
