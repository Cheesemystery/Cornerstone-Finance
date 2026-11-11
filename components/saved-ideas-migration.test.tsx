// @vitest-environment jsdom
import {cleanup,render,screen} from "@testing-library/react";
import {afterEach,expect,it} from "vitest";
import {useSavedIdeas} from "@/lib/saved-ideas";
const id="what-you-own";
function Fixture({owner="guest",generation=0}:{owner?:string;generation?:number}) {
 const {ids}=useSavedIdeas(owner,generation);
 return <output>{JSON.stringify(ids)}</output>;
}
afterEach(()=>{cleanup();localStorage.clear();});
it("adopts prototype data for the original guest without rewriting it",()=>{
 const old=JSON.stringify([id,id,"unknown"]);
 localStorage.setItem("cornerstone-ideas-v1",old);
 render(<Fixture/>);
 expect(screen.getByRole("status").textContent).toBe(JSON.stringify([id]));
 expect(localStorage.getItem("cornerstone-ideas-v1")).toBe(old);
});
it("prefers an explicitly empty current record to prototype bookmarks",()=>{
 localStorage.setItem("cornerstone-ideas-v1",JSON.stringify([id]));
 localStorage.setItem("cornerstone-ideas-v1:guest:0","[]");
 render(<Fixture/>);
 expect(screen.getByRole("status").textContent).toBe("[]");
});
it("does not migrate prototype bookmarks into reset or account namespaces",()=>{
 localStorage.setItem("cornerstone-ideas-v1",JSON.stringify([id]));
 const view=render(<Fixture generation={1}/>);
 expect(screen.getByRole("status").textContent).toBe("[]");
 view.rerender(<Fixture owner="fixture-account"/>);
 expect(screen.getByRole("status").textContent).toBe("[]");
});
