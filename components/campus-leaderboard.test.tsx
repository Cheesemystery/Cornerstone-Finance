// @vitest-environment jsdom
import {cleanup,fireEvent,render,screen,act} from "@testing-library/react";
import {afterEach,expect,it} from "vitest";
import {CampusLeaderboard} from "./campus-leaderboard";
import {contributeCampusStone} from "@/lib/campus-foundations";
afterEach(()=>{cleanup();localStorage.clear();});
it("shares selection and deduplicated live awards between full and compact standings",()=>{
 render(<><CampusLeaderboard/><CampusLeaderboard compact/></>);
 expect(screen.getByText("1,428 Stones Laid")).toBeTruthy();
 act(()=>contributeCampusStone("lesson:inflation"));
 expect(screen.getByText("1,429 Stones Laid")).toBeTruthy();
 expect(screen.getByRole("link",{name:/Tuskegee University.*1,429/})).toBeTruthy();
 act(()=>contributeCampusStone("lesson:inflation"));
 expect(screen.getByText("1,429 Stones Laid")).toBeTruthy();
 fireEvent.change(screen.getByLabelText("Your Campus"),{target:{value:"Howard University"}});
 act(()=>contributeCampusStone("simulator"));
 expect(screen.getByText("1,396 Stones Laid")).toBeTruthy();
 expect(screen.getByText("1,429 Stones Laid")).toBeTruthy();
 act(()=>contributeCampusStone("simulator"));
 expect(screen.getByRole("link",{name:/Howard University.*1,396/})).toBeTruthy();
 expect(JSON.parse(localStorage.getItem("cornerstone-campus-foundations-v1")!).campus).toBe("Howard University");
});
