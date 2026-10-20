// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { WeeklyStory } from "./weekly-story";
import { getSampleHistoricalCloses } from "@/lib/sample-history";
import { sampleSavedHoldings } from "@/lib/saved-holdings";
import { calculateWeek } from "@/lib/weekly-portfolio";
import { WALL_SEEN_KEY } from "@/lib/stone-wall";
import { lessons } from "@/lib/lessons";

const history = getSampleHistoricalCloses(sampleSavedHoldings.map(h => h.ticker),"2026-08-24","2026-09-02");
const week = calculateWeek(sampleSavedHoldings,history)!;
const beginWeek = vi.fn();
beforeEach(() => {
  localStorage.clear(); beginWeek.mockClear();
  vi.stubGlobal("Path2D",class {});
  vi.spyOn(HTMLCanvasElement.prototype,"getContext").mockReturnValue(new Proxy({measureText:(text:string) => ({width:text.length * 35})},{get:(target,key) => key in target ? Reflect.get(target,key) : vi.fn()}) as unknown as CanvasRenderingContext2D);
});
afterEach(() => { cleanup(); vi.restoreAllMocks(); vi.unstubAllGlobals(); });
const mount = () => render(<WeeklyStory week={week} history={history} completed={[lessons[0].id]} learningAsOf="2026-10-19" reducedMotion={false} beginWeek={beginWeek} />);
async function openStory() { fireEvent.click(screen.getByRole("button",{name:"Replay your week"})); return screen.findByRole("dialog"); }

it("opens an accessible four-card modal, navigates by arrows/dots and restores trigger focus", async () => {
  mount();
  const trigger = screen.getByRole("button",{name:"Replay your week"}); trigger.focus();
  const dialog = await openStory();
  expect(dialog.getAttribute("aria-modal")).toBe("true");
  expect(screen.getByRole("heading",{name:"A quiet week: down 0.16%"})).toBeTruthy();
  fireEvent.keyDown(screen.getByRole("button",{name:"Close"}),{key:"ArrowRight"});
  expect(screen.getByRole("heading",{name:"The biggest driver"})).toBeTruthy();
  expect(screen.getByRole("img",{name:/VTI pulled down/})).toBeTruthy();
  fireEvent.click(screen.getByRole("button",{name:"Next card"}));
  expect(screen.getByRole("link",{name:"Start lesson"}).getAttribute("href")).toBe("/learn/why-prices-move?weekly=1");
  fireEvent.click(screen.getByRole("button",{name:"Card 4: See you Monday"}));
  expect(screen.getByRole("img",{name:/Cumulative learning wall: 1 of/})).toBeTruthy();
  expect(localStorage.getItem(WALL_SEEN_KEY)).toBeNull();
  fireEvent.keyDown(dialog,{key:"Escape"});
  await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
  expect(document.activeElement).toBe(trigger);
});

it("starts the existing weekly lesson without completing it by replay navigation",async () => {
  mount(); await openStory();
  fireEvent.click(screen.getByRole("button",{name:/Card 3:/}));
  expect(beginWeek).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole("link",{name:"Start lesson"}));
  expect(beginWeek).toHaveBeenCalledOnce();
  expect(screen.queryByRole("dialog")).toBeNull();
});

it("resets dollar privacy on every fresh preview and keeps it off in canvas descriptions",async () => {
  mount(); await openStory();
  fireEvent.click(screen.getByRole("button",{name:"Card 4: See you Monday"}));
  fireEvent.click(screen.getByRole("button",{name:"Share"}));
  const checkbox = screen.getByRole("checkbox",{name:"Include dollar amounts"});
  expect((checkbox as HTMLInputElement).checked).toBe(false);
  expect(screen.getByRole("img",{name:/Dollar amounts and holding tickers hidden/})).toBeTruthy();
  fireEvent.click(checkbox);
  expect(screen.getByRole("img",{name:/Dollar amounts included: −\$11.23; VTI −\$41.04/})).toBeTruthy();
  fireEvent.click(screen.getByRole("button",{name:"Close"}));
  await openStory();
  fireEvent.click(screen.getByRole("button",{name:"Card 4: See you Monday"}));
  fireEvent.click(screen.getByRole("button",{name:"Share"}));
  expect((screen.getByRole("checkbox",{name:"Include dollar amounts"}) as HTMLInputElement).checked).toBe(false);
  expect(screen.queryByRole("button",{name:"Web Share"})).toBeNull();
});

it("shows a friendly failure when image generation cannot start",async () => {
  vi.mocked(HTMLCanvasElement.prototype.getContext).mockReturnValue(null);
  mount(); await openStory();
  fireEvent.click(screen.getByRole("button",{name:"Card 4: See you Monday"})); fireEvent.click(screen.getByRole("button",{name:"Share"}));
  expect(await screen.findByRole("alert")).toHaveProperty("textContent",expect.stringContaining("Close and reopen"));
  expect((screen.getByRole("button",{name:"Download image"}) as HTMLButtonElement).disabled).toBe(true);
});

it("supports tap halves and a horizontal touch swipe without also advancing on its synthetic click",async () => {
  vi.stubGlobal("PointerEvent",class extends MouseEvent {pointerType:string; constructor(type:string,init:PointerEventInit) {super(type,init);this.pointerType=init.pointerType ?? "touch";}});
  mount(); await openStory();
  const viewport = screen.getByRole("group",{name:"Card 1 of 4"}).parentElement!;
  vi.spyOn(viewport,"getBoundingClientRect").mockReturnValue({left:0,width:300} as DOMRect);
  fireEvent.click(screen.getByRole("heading",{name:"A quiet week: down 0.16%"}),{clientX:250});
  expect(screen.getByRole("heading",{name:"The biggest driver"})).toBeTruthy();
  fireEvent.click(screen.getByRole("heading",{name:"The biggest driver"}),{clientX:50});
  expect(screen.getByRole("group",{name:"Card 1 of 4"})).toBeTruthy();
  fireEvent.pointerDown(viewport,{pointerType:"touch",clientX:250,clientY:100});
  fireEvent.pointerUp(viewport,{pointerType:"touch",clientX:100,clientY:105});
  fireEvent.click(viewport,{clientX:100});
  expect(screen.getByRole("group",{name:"Card 2 of 4"})).toBeTruthy();
});

it("uses Web Share only when file sharing is supported and passes the PNG file",async () => {
  const share = vi.fn().mockResolvedValue(undefined);
  const previousShare = Object.getOwnPropertyDescriptor(navigator,"share");
  const previousCanShare = Object.getOwnPropertyDescriptor(navigator,"canShare");
  Object.defineProperty(navigator,"share",{configurable:true,value:share});
  Object.defineProperty(navigator,"canShare",{configurable:true,value:() => true});
  vi.spyOn(HTMLCanvasElement.prototype,"toBlob").mockImplementation(callback => callback(new Blob(["image"],{type:"image/png"})));
  try {
    mount(); await openStory();
    fireEvent.click(screen.getByRole("button",{name:"Card 4: See you Monday"})); fireEvent.click(screen.getByRole("button",{name:"Share"}));
    const native = await screen.findByRole("button",{name:"Web Share"});
    await waitFor(() => expect((native as HTMLButtonElement).disabled).toBe(false));
    fireEvent.click(native);
    await waitFor(() => expect(share).toHaveBeenCalledOnce());
    expect(share.mock.calls[0][0].files[0]).toMatchObject({name:"cornerstone-week-2026-09-02.png",type:"image/png"});
  } finally {
    if (previousShare) Object.defineProperty(navigator,"share",previousShare); else Reflect.deleteProperty(navigator,"share");
    if (previousCanShare) Object.defineProperty(navigator,"canShare",previousCanShare); else Reflect.deleteProperty(navigator,"canShare");
  }
});
