import Link from "next/link";
import { SignInForm } from "@/components/sign-in-form";
import { connectedFeaturesEnabled } from "@/lib/features";
import { learningAccountsReady } from "@/lib/server/learning-account";
import { internalPath } from "@/lib/internal-path";
export const dynamic = "force-dynamic";
export default async function SignInPage({searchParams}:{searchParams:Promise<{returnTo?:string;error?:string}>}) {
 const params = await searchParams;
 const ready = await learningAccountsReady();
 const enabled = ready || connectedFeaturesEnabled;
 return <main className="entry-page"><div className="entry-panel"><Link className="wordmark" href="/">Cornerstone.</Link><header><p className="eyebrow">Start where you are</p><h1>{enabled ? "Your space. One secure link." : "You can start without an account."}</h1><p>{enabled ? "New or returning? Use an email link to sign in." : "Account sign-in and cross-device learning are not available here yet. You can finish every lesson as a guest."}</p></header>{params.error && <p role="alert">That sign-in link could not be used. It may have expired or already been used. Request a new link, or continue as a guest.</p>}{enabled ? <SignInForm returnTo={internalPath(params.returnTo)}/> : <Link className="button primary" href="/onboarding">Continue as guest →</Link>}<p className="muted small">Guest progress stays in this browser.</p><Link href="/learn" className="demo-link workspace">Back to Learn</Link></div></main>;
}
