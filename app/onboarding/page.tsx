import Link from "next/link";
import { OnboardingFlow } from "@/components/onboarding-flow";
export default function OnboardingPage(){return <main style={{padding:'clamp(28px,6vw,72px) 20px'}}><div style={{maxWidth:760,margin:'0 auto 42px'}}><Link className="wordmark" href="/">Cornerstone</Link></div><OnboardingFlow/></main>}
