// @vitest-environment jsdom
import axe from "axe-core";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import type { ReactNode } from "react";
import { AppShell } from "./app-shell";
import { DemoProvider } from "./demo-provider";
import { MvpProvider } from "./mvp-provider";
import { MvpSettings } from "./mvp-settings";
import { LessonInteraction } from "./lesson-interaction";
import { PortfolioHoldings } from "./portfolio-holdings";
import { PortfolioRecap } from "./portfolio-recap";
import { lessonActivities } from "@/lib/lesson-activities";
import { samplePortfolio } from "@/lib/sample-data";

vi.mock("next/navigation", () => ({ usePathname: () => "/settings" }));
const originalScroll = Object.getOwnPropertyDescriptor(Element.prototype, "scrollIntoView");
const originalShowModal = Object.getOwnPropertyDescriptor(HTMLDialogElement.prototype, "showModal");

beforeEach(() => {
  localStorage.clear();
  document.documentElement.lang = "en";
  document.title = "Cornerstone accessibility fixture";
  vi.stubGlobal("matchMedia", vi.fn(() => ({ matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() })));
  Object.defineProperty(Element.prototype, "scrollIntoView", { configurable: true, value: vi.fn() });
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(null);
  // Native dialog rendering is covered in the browser. JSDOM needs an open
  // attribute shim so axe can scan the exposed dialog's structural semantics.
  Object.defineProperty(HTMLDialogElement.prototype, "showModal", { configurable: true, value(this: HTMLDialogElement) { this.open = true; } });
});
afterEach(() => {
  cleanup(); localStorage.clear(); vi.restoreAllMocks(); vi.unstubAllGlobals();
  if (originalScroll) Object.defineProperty(Element.prototype, "scrollIntoView", originalScroll);
  else Reflect.deleteProperty(Element.prototype, "scrollIntoView");
  if (originalShowModal) Object.defineProperty(HTMLDialogElement.prototype, "showModal", originalShowModal);
  else Reflect.deleteProperty(HTMLDialogElement.prototype, "showModal");
});

function page(children: ReactNode) {
  return render(<DemoProvider><MvpProvider><AppShell>{children}</AppShell></MvpProvider></DemoProvider>);
}

async function accessible() {
  // JSDOM has no layout/paint engine. Contrast is checked separately in a real
  // browser; do not treat this structural scan as a contrast/compliance test.
  const results = await axe.run(document.body, { rules: { "color-contrast": { enabled: false } } });
  expect(results.violations.map(({ id, impact, nodes }) => ({
    id, impact, nodes: nodes.map(({ target, failureSummary }) => ({ target, failureSummary })),
  }))).toEqual([]);
  if (results.incomplete.length) console.warn("axe requires manual review:", results.incomplete.map(result => result.id));
}

it("scans the open mobile navigation and restores focus after Escape", async () => {
  page(<><h1>Accessibility fixture</h1><button>Page action</button></>);
  const trigger = screen.getByRole("button", { name: "Open navigation" });
  fireEvent.click(trigger);
  expect(screen.getByRole("dialog", { name: "Navigation" })).toBeTruthy();
  await accessible();
  fireEvent.keyDown(document.activeElement!, { key: "Escape" });
  await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
  await waitFor(() => expect(document.activeElement).toBe(trigger));
  await accessible();
});

it("scans a lesson challenge before and after mistake/correct feedback", async () => {
  page(<><h1>Price challenge</h1><LessonInteraction activity={lessonActivities["why-prices-move"]} onReady={vi.fn()} onMiss={vi.fn()} /></>);
  await accessible();
  fireEvent.click(screen.getByLabelText("The café will close."));
  fireEvent.click(screen.getByRole("button", { name: "Check answer" }));
  expect(screen.getByRole("status").textContent).toContain("reliable evidence");
  await accessible();
  fireEvent.click(screen.getByLabelText("One share costs $2 less than before."));
  fireEvent.click(screen.getByRole("button", { name: "Check answer" }));
  await accessible();
});

it("scans Portfolio before and after Explore transfers focus to holding details", async () => {
  page(<><h1>Portfolio</h1><PortfolioHoldings portfolio={samplePortfolio} /></>);
  await accessible();
  fireEvent.click(screen.getByRole("button", { name: "Explore VXUS holding" }));
  await waitFor(() => expect(document.activeElement?.id).toBe("holding-details"));
  await accessible();
  fireEvent.keyDown(document.activeElement!, { key: "Escape" });
  expect(screen.getByRole("button", { name: "Explore VXUS holding" }).getAttribute("aria-pressed")).toBe("false");
});

it("scans Recap with learning/history disclosures closed and open", async () => {
  page(<PortfolioRecap />);
  await accessible();
  fireEvent.click(screen.getByText("Learning milestones, history & sharing"));
  expect(document.querySelector("details")?.open).toBe(true);
  await accessible();
});

it("scans Settings and its controlled Reduce motion state", async () => {
  page(<><h1>Settings</h1><MvpSettings /></>);
  await accessible();
  const control = screen.getByRole("switch", { name: "Reduce motion" });
  fireEvent.click(control);
  expect(control.getAttribute("aria-checked")).toBe("true");
  await accessible();
  fireEvent.click(screen.getByRole("button", { name: "Reset local progress" }));
  expect(screen.getByRole("dialog", { name: "Reset local progress?" })).toBeTruthy();
  await accessible();
});

it("detects an intentionally unnamed button so the axe gate cannot silently pass", async () => {
  page(<><h1>Scanner control fixture</h1><button /></>);
  const results = await axe.run(document.body, { rules: { "color-contrast": { enabled: false } } });
  expect(results.violations.map(result => result.id)).toContain("button-name");
});
