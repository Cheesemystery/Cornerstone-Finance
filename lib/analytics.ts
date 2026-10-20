"use client";
export type SafeProductEvent="recap_viewed"|"share_downloaded"|"classification_corrected"|"trial_started"|"subscription_changed"|"onboarding_completed"|"lesson_completed"|"review_completed"|"practice_reflected";
export function captureSafeEvent(event:SafeProductEvent){if(process.env.NEXT_PUBLIC_POSTHOG_KEY)void import("posthog-js").then(({default:posthog})=>posthog.capture(event)).catch(()=>undefined)}
