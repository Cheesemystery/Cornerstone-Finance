// @vitest-environment jsdom
import { act, cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { AppShell } from "./app-shell";

const state = vi.hoisted(() => ({ reducedMotion: false }));
vi.mock("next/navigation", () => ({ usePathname: () => "/settings" }));
vi.mock("./demo-provider", () => ({ useDemo: () => ({ preferences: { compact: false, name: "Alex" } }) }));
vi.mock("./mvp-provider", () => ({ useMvp: () => ({ learning: { completed: [], reducedMotion: state.reducedMotion } }) }));
let desktop = false;
let resize: () => void;
beforeEach(() => {
  state.reducedMotion = false;
  desktop = false;
  vi.stubGlobal("matchMedia", vi.fn(() => ({
    get matches() { return desktop; },
    addEventListener: (_: string, listener: () => void) => { resize = listener; },
    removeEventListener: vi.fn(),
  })));
});
afterEach(() => { cleanup(); vi.unstubAllGlobals(); });

function openNavigation() {
  const trigger = screen.getByRole("button", { name: "Open navigation" });
  fireEvent.click(trigger);
  return trigger;
}

it("provides one named modal with the four destinations and isolates the background", () => {
  render(<AppShell><button>Page action</button></AppShell>);
  openNavigation();
  const dialog = screen.getByRole("dialog", { name: "Navigation" });
  const links = within(dialog).getByRole("navigation", { name: "Primary navigation" }).querySelectorAll("a");
  expect([...links].map(link => link.getAttribute("href"))).toEqual([
    "/", "/learn", "/portfolio", "/assistant",
  ]);
  expect(document.activeElement).toBe(within(dialog).getByRole("button", { name: "Close navigation" }));
  expect(screen.queryByRole("button", { name: "Page action" })).toBeNull();
  expect(getComputedStyle(document.body).overflow).toBe("hidden");
});

it("wraps Tab and Shift+Tab, then restores focus and scrolling after Escape", async () => {
  render(<AppShell>Page content</AppShell>);
  const trigger = openNavigation();
  const dialog = screen.getByRole("dialog", { name: "Navigation" });
  const first = within(dialog).getByRole("link", { name: "Cornerstone." });
  const last = within(dialog).getByRole("link", { name: /Saved on this browser/ });
  last.focus();
  fireEvent.keyDown(last, { key: "Tab" });
  expect(document.activeElement).toBe(first);
  fireEvent.keyDown(first, { key: "Tab", shiftKey: true });
  expect(document.activeElement).toBe(last);
  fireEvent.keyDown(last, { key: "Escape" });
  await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
  await waitFor(() => expect(document.activeElement).toBe(trigger));
  expect(document.body.style.overflow).toBe("");
});

it("dismisses through its close button and through navigation", async () => {
  render(<AppShell>Page content</AppShell>);
  const trigger = openNavigation();
  fireEvent.click(screen.getByRole("button", { name: "Close navigation" }));
  await waitFor(() => expect(document.activeElement).toBe(trigger));
  fireEvent.click(trigger);
  const settings = within(screen.getByRole("dialog")).getByRole("navigation").querySelector('a[href="/portfolio"]')!;
  settings.addEventListener("click", event => event.preventDefault(), { once: true });
  fireEvent.click(settings);
  await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
});

it("marks both portal layers for local reduced motion", () => {
  state.reducedMotion = true;
  render(<AppShell>Page content</AppShell>);
  openNavigation();
  expect(screen.getByRole("dialog").getAttribute("data-reduced-motion")).toBe("true");
  expect(document.querySelector('[data-slot="sheet-overlay"]')?.getAttribute("data-reduced-motion")).toBe("true");
});

it("closes on a desktop resize and focuses the visible active destination", async () => {
  render(<AppShell>Page content</AppShell>);
  openNavigation();
  act(() => { desktop = true; resize(); });
  await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
  const active = document.querySelector('.desktop-sidebar [aria-current="page"]');
  await waitFor(() => expect(document.activeElement).toBe(active));
});
