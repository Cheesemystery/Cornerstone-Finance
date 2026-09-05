import Link from "next/link";
export default function NotFound(){return <main className="not-found"><span className="eyebrow">Wrong turn, good company</span><h1>This page wandered off.</h1><p>Let’s get you back to something useful.</p><div><Link className="button primary" href="/">Back to Home</Link><Link className="button secondary" href="/discover">Explore Discover</Link></div></main>}
