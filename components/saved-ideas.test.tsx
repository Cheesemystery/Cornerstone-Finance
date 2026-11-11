// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { SavedIdeas } from "./saved-ideas";
import { MvpProvider } from "./mvp-provider";
import { validIdeaIds, useSavedIdeas, legacyGuestIdeas } from "@/lib/saved-ideas";
import { emptyLearning } from "@/lib/learning-progress";
const id = "what-you-own";
afterEach(() => { cleanup(); localStorage.clear(); });
it("saves a completed takeaway across remounts and removes it", () => {
 localStorage.setItem("cornerstone-ideas-v1:guest:0","[]");
 localStorage.setItem("cornerstone-learning-v1", JSON.stringify({...emptyLearning, completed:[id]}));
 const ui=<MvpProvider><SavedIdeas lessonId={id}/><SavedIdeas/></MvpProvider>;
 const view=render(ui);
 fireEvent.click(screen.getByRole("button",{name:"Save this idea"}));
 expect(screen.getByRole("button",{name:"Remove saved idea"}).getAttribute("aria-pressed")).toBe("true");
 expect(screen.getByRole("link",{name:/Review: What/})).toBeTruthy();
 view.unmount(); render(ui);
 expect(screen.getByRole("button",{name:"Remove saved idea"})).toBeTruthy();
 fireEvent.click(screen.getByRole("button",{name:"Remove idea from What do you actually own?"}));
 expect(screen.queryByRole("link",{name:/Review: What/})).toBeNull();
});
it("does not offer a reward for incomplete learning or expose ideas after reset", () => {
 localStorage.setItem("cornerstone-ideas-v1:guest:0",JSON.stringify([id]));
 localStorage.setItem("cornerstone-learning-v1",JSON.stringify({...emptyLearning,resetGeneration:1}));
 render(<MvpProvider><SavedIdeas lessonId={id}/><SavedIdeas/></MvpProvider>);
 expect(screen.queryByRole("button",{name:"Save this idea"})).toBeNull();
 expect(screen.queryByRole("link",{name:/Review: What/})).toBeNull();
});

it("normalizes duplicate and unknown saved IDs without creating concepts",()=>{
 expect(validIdeaIds([id,id,"not-a-lesson",null,14])).toEqual([id]);
 expect(validIdeaIds({ids:[id]})).toEqual([]);
});
it("renders one idea for repeated stored IDs and removes it from persistence",()=>{
 localStorage.setItem("cornerstone-learning-v1",JSON.stringify({...emptyLearning,completed:[id]}));
 localStorage.setItem("cornerstone-ideas-v1:guest:0",JSON.stringify([id,id]));
 render(<MvpProvider><SavedIdeas/></MvpProvider>);
 expect(screen.getAllByRole("link",{name:/Review: What/})).toHaveLength(1);
 expect(screen.getByText("1 saved")).toBeTruthy();
 fireEvent.click(screen.getByRole("button",{name:"Remove idea from What do you actually own?"}));
 expect(JSON.parse(localStorage.getItem("cornerstone-ideas-v1:guest:0")!)).toEqual([]);
 expect(document.activeElement?.textContent).toContain("Ideas worth keeping.");
});

function IdeaStoreFixture({owner}:{owner:string}) {
 const {ids,save}=useSavedIdeas(owner,0);
 return <><button onClick={()=>{save(id);save(id);}}>Save twice</button><output>{ids.length} bookmarks</output></>;
}
it("makes repeated saves idempotent and keeps owners separate",()=>{
 const view=render(<IdeaStoreFixture owner="fixture-a"/>);
 fireEvent.click(screen.getByRole("button",{name:"Save twice"}));
 expect(screen.getByText("1 bookmarks")).toBeTruthy();
 view.rerender(<IdeaStoreFixture owner="fixture-b"/>);
 expect(screen.getByText("0 bookmarks")).toBeTruthy();
 view.rerender(<IdeaStoreFixture owner="fixture-a"/>);
 expect(screen.getByText("1 bookmarks")).toBeTruthy();
});

it("recovers valid prototype guest bookmarks without deleting the old record",()=>{
 localStorage.setItem("cornerstone-ideas-v1",JSON.stringify([id,id,"unknown"]));
 expect(legacyGuestIdeas()).toEqual([id]);
 expect(localStorage.getItem("cornerstone-ideas-v1")).toBe(JSON.stringify([id,id,"unknown"]));
 localStorage.setItem("cornerstone-ideas-v1","broken");
 expect(legacyGuestIdeas()).toEqual([]);
});

it("reveals and focuses the collection when arriving through its saved-ideas link",()=>{
 const original=Element.prototype.scrollIntoView;
 const scroll=vi.fn();Element.prototype.scrollIntoView=scroll;
 history.replaceState(null,"","/learn#saved-ideas");
 try {
  render(<MvpProvider><SavedIdeas/></MvpProvider>);
  expect(scroll).toHaveBeenCalledWith({block:"start",behavior:"instant"});
  expect(document.activeElement?.textContent).toContain("Ideas worth keeping.");
 } finally {
  history.replaceState(null,"","/");Element.prototype.scrollIntoView=original;
 }
});

it("offers two accurate starter notes only when no prototype record exists",()=>{expect(legacyGuestIdeas()).toEqual(["what-you-own","read-earnings"]);localStorage.setItem("cornerstone-ideas-v1","[]");expect(legacyGuestIdeas()).toEqual([]);});
