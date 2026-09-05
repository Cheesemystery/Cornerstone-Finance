"use client";
import posthog from "posthog-js";
export type SafeProductEvent="recap_viewed"|"share_downloaded"|"classification_corrected"|"trial_started"|"subscription_changed";
export function captureSafeEvent(event:SafeProductEvent){if(process.env.NEXT_PUBLIC_POSTHOG_KEY)posthog.capture(event)}
