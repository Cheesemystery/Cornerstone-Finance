// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import type { ReactNode } from "react";
import AboutPage from "@/app/about/page";
import { aboutContent, CONTACT_EMAIL, PRIVACY_COPY } from "@/content/about";

vi.mock("./app-shell", () => ({AppShell:({children}:{children:ReactNode}) => <main>{children}</main>}));
afterEach(() => {cleanup();aboutContent.supporters.text="";});

it("renders the centralized copy, shared privacy, mailto and disabled waitlist without a form", () => {
  const {container} = render(<AboutPage />);
  expect(screen.getByRole("heading",{level:1}).textContent).toBe(aboutContent.title);
  expect(screen.getByText(aboutContent.subtitle)).toBeTruthy();
  expect(aboutContent.privacy).toBe(PRIVACY_COPY);
  for (const text of PRIVACY_COPY.paragraphs) expect(screen.getByText(text)).toBeTruthy();
  expect(screen.getByRole("link",{name:CONTACT_EMAIL}).getAttribute("href")).toBe(`mailto:${CONTACT_EMAIL}`);
  expect(screen.getByRole("button",{name:"Coming soon"}).hasAttribute("disabled")).toBe(true);
  expect(container.querySelector("form")).toBeNull();
  expect(screen.queryByRole("heading",{name:"Supporters"})).toBeNull();
  expect(container.textContent).not.toMatch(/PNC|Howard/);
});

it("renders Supporters only when the content file supplies non-whitespace text", () => {
  aboutContent.supporters.text="   ";
  const view=render(<AboutPage />);
  expect(screen.queryByRole("heading",{name:"Supporters"})).toBeNull();
  aboutContent.supporters.text="Placeholder supporter text.";
  view.rerender(<AboutPage />);
  expect(screen.getByText("Placeholder supporter text.")).toBeTruthy();
});
