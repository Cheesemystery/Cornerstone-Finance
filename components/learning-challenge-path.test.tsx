// @vitest-environment jsdom
import {cleanup,fireEvent,render,screen,within} from "@testing-library/react";
import {afterEach,expect,it,vi} from "vitest";
import {LearningChallengePath} from "./learning-challenge-path";
import {emptyLearning} from "@/lib/learning-progress";
import {lessons} from "@/lib/lessons";
const state={...emptyLearning,completed:lessons.slice(0,7).map(l=>l.id)};
vi.mock("./mvp-provider",()=>({useMvp:()=>({learning:state})}));
afterEach(cleanup);
it("filters chapters and reveals earned pocket takeaways",()=>{render(<LearningChallengePath/>);fireEvent.click(screen.getByRole("button",{name:"In Progress (1)"}));expect(screen.getByRole("heading",{name:"Think like a long-term investor"})).toBeTruthy();expect(screen.queryByRole("heading",{name:"Know what you own"})).toBeNull();fireEvent.click(screen.getByRole("button",{name:"Completed (3)"}));fireEvent.click(screen.getByRole("button",{name:"Show Key Takeaways"}));expect(screen.getByText(lessons[0].takeaway)).toBeTruthy();});
it("provides warmup feedback and a completion preview without awarding progress",()=>{const before=JSON.stringify(state);render(<LearningChallengePath/>);fireEvent.click(screen.getByRole("button",{name:/Quick warm-up/}));fireEvent.click(screen.getByRole("button",{name:"Stays the same"}));expect(screen.getByText(/It buys about \$744/)).toBeTruthy();fireEvent.click(screen.getByRole("button",{name:/Preview laying/}));expect(screen.getByRole("heading",{name:"First-Gen Foundation Complete"})).toBeTruthy();expect(screen.getByText("8/8")).toBeTruthy();expect(JSON.stringify(state)).toBe(before);fireEvent.click(screen.getByRole("button",{name:/Return to saved/}));expect(screen.getByText("7/8")).toBeTruthy();});
it("lets keyboard and pointer users inspect individual earned stones",()=>{render(<LearningChallengePath/>);const wall=screen.getByRole("group",{name:"Eight cornerstone lessons"});expect(within(wall).getAllByRole("button")).toHaveLength(8);fireEvent.focus(within(wall).getAllByRole("button")[0]);expect(screen.getByText(lessons[0].takeaway)).toBeTruthy();});
