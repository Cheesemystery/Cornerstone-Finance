"use client";
import Link from "next/link";
export default function ErrorPage({reset}:{reset:()=>void}){return <main className="not-found"><p className="eyebrow">Let’s try that again</p><h1>A small bump in the road.</h1><p>This page couldn’t load. Your demo is still here.</p><div><button className="button primary" onClick={reset}>Try again</button><Link className="button secondary" href="/">Back to Home</Link></div></main>}
