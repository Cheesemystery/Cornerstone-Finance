import { beforeEach,expect,it,vi } from "vitest";
import { NextRequest } from "next/server";
const mock=vi.hoisted(()=>({ready:vi.fn(),exchange:vi.fn(),otp:vi.fn(),client:vi.fn()}));
vi.mock("@/lib/server/learning-account",()=>({learningAccountsReady:mock.ready}));
vi.mock("@/lib/supabase/server",()=>({createSupabaseServerClient:mock.client}));
vi.mock("@/lib/env",()=>({env:{},integrations:{supabase:true}}));
vi.mock("@/lib/features",()=>({connectedFeaturesEnabled:false}));
import { POST } from "./magic-link/route";
import { GET } from "../../auth/callback/route";
beforeEach(()=>{vi.resetAllMocks();mock.ready.mockResolvedValue(true);mock.client.mockResolvedValue({auth:{exchangeCodeForSession:mock.exchange,signInWithOtp:mock.otp}});mock.otp.mockResolvedValue({error:null});});
const request=(redirectTo:string,origin="http://localhost:3000")=>new NextRequest("http://localhost:3000/api/auth/magic-link",{method:"POST",headers:{origin,"Content-Type":"application/json"},body:JSON.stringify({email:"learner@example.test",redirectTo})});
it("rejects cross-origin submissions and unavailable accounts without sending email",async()=>{
 expect((await POST(request("/learn","https://evil.test"))).status).toBe(403);
 mock.ready.mockResolvedValue(false);
 expect((await POST(request("/learn"))).status).toBe(503);
 expect(mock.otp).not.toHaveBeenCalled();
});
it("uses a safe callback return path",async()=>{
 expect((await POST(request("//evil.test"))).status).toBe(200);
 const url=new URL(mock.otp.mock.calls[0][0].options.emailRedirectTo);
 expect(url.origin).toBe("http://localhost:3000"); expect(url.searchParams.get("next")).toBe("/learn");
});
it.each([undefined,"expired"])("does not redirect to a lesson after invalid or missing code",async code=>{
 mock.exchange.mockResolvedValue({data:{session:null},error:{message:"invalid"}});
 const response=await GET(new NextRequest("http://localhost:3000/auth/callback?next=/learn/what-you-own"+(code?"&code="+code:"")));
 expect(response.headers.get("location")).toContain("/sign-in?");
});
it("returns an authenticated learner to a safe lesson path",async()=>{
 mock.exchange.mockResolvedValue({data:{session:{}},error:null});
 const response=await GET(new NextRequest("http://localhost:3000/auth/callback?code=valid&next="+encodeURIComponent("/learn/what-you-own?weekly=1")));
 expect(response.headers.get("location")).toBe("http://localhost:3000/learn/what-you-own?weekly=1");
});
