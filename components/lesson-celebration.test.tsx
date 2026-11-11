// @vitest-environment jsdom
import {cleanup,fireEvent,render,screen} from "@testing-library/react";
import {afterEach,expect,it} from "vitest";
import {LessonCelebration} from "./lesson-celebration";
afterEach(cleanup);
it("announces the earned lesson and focuses its foundation destination",()=>{
 render(<LessonCelebration id="inflation" reducedMotion={false}/>);
 expect(screen.getByRole("dialog",{name:"Cornerstone #08 Earned: Purchasing Power"})).toBeTruthy();
 const action=screen.getByRole("link",{name:"Lay Stone on Your Foundation →"});
 expect(action.getAttribute("href")).toBe("/learn?justCompleted=8");expect(document.activeElement).toBe(action);
 fireEvent.click(screen.getByRole("button",{name:"Stay with this lesson"}));
 expect(screen.queryByRole("dialog")).toBeNull();
});
