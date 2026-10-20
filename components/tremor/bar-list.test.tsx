// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { BarList } from "./bar-list";
import { signedMoney } from "@/lib/presentation";

afterEach(cleanup);
it("compares signed contributions by magnitude without changing order, values or labels", () => {
  const data = Object.freeze([
    Object.freeze({ key: "LOSS", name: "LOSS", description: "A declining holding", value: -9 }),
    Object.freeze({ key: "GAIN", name: "GAIN", description: "A positive offset", value: 3 }),
  ]);
  const { container } = render(<BarList data={[...data]} sortOrder="none" valueFormatter={signedMoney} />);
  const rows = within(screen.getByRole("list", { name: "Price contributions" })).getAllByRole("listitem");
  expect(rows[0].textContent).toContain("LOSS");
  expect(rows[0].textContent).toContain("−$9.00Negative contribution");
  expect(rows[1].textContent).toContain("+$3.00Positive contribution");
  const bars = container.querySelectorAll<HTMLElement>('[aria-hidden="true"]');
  expect(bars[0].style.width).toBe("100%");
  expect(parseFloat(bars[1].style.width)).toBeCloseTo(100 / 3);
  expect(data.map(item => item.value)).toEqual([-9, 3]);
});
it("handles all-negative and zero records without invalid or negative widths", () => {
  const { container } = render(<BarList data={[
    { key: "A", name: "A", value: -4 }, { key: "B", name: "B", value: -2 }, { key: "C", name: "C", value: 0 },
  ]} sortOrder="none" valueFormatter={signedMoney} />);
  const widths = [...container.querySelectorAll<HTMLElement>('[aria-hidden="true"]')].map(bar => bar.style.width);
  expect(widths).toEqual(["100%", "50%", "0%"]);
  expect(screen.getByText("No price change")).toBeTruthy();
});
it("does not present nonfinite contributions as invented zero amounts", () => {
  const format = vi.fn(signedMoney);
  const { container } = render(<BarList data={[
    { key: "bad", name: "Unknown", value: Number.NaN },
    { key: "infinite", name: "Unknown 2", value: Number.POSITIVE_INFINITY },
  ]} valueFormatter={format} />);
  expect(screen.getAllByText("Unavailable")).toHaveLength(2);
  expect(format).not.toHaveBeenCalled();
  expect([...container.querySelectorAll<HTMLElement>('[aria-hidden="true"]')].every(bar => bar.style.width === "0%")).toBe(true);
});
it("keeps semantic selection buttons with a pressed state", () => {
  const select = vi.fn();
  render(<BarList data={[{ key: "VTI", name: "VTI", value: 25.47 }]} selectedKey="VTI" onValueChange={select} valueFormatter={signedMoney} />);
  const button = screen.getByRole("button", { name: /VTI.*Positive contribution/ });
  expect(button.getAttribute("aria-pressed")).toBe("true");
  fireEvent.click(button);
  expect(select).toHaveBeenCalledWith(expect.objectContaining({ key: "VTI", value: 25.47 }));
});
it("keeps internal links and all amounts available as text", () => {
  render(<BarList data={[{ key: "VXUS", name: "VXUS", description: "International stocks", value: -7.7, href: "/discover?q=VXUS" }]} tone="dark" valueFormatter={signedMoney} />);
  const link = screen.getByRole("link", { name: /VXUS.*International stocks.*Negative contribution/ });
  expect(link.getAttribute("href")).toBe("/discover?q=VXUS");
  expect(link.getAttribute("target")).toBeNull();
  expect(link.textContent).toContain("−$7.70");
});
