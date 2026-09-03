import * as Sentry from "@sentry/nextjs";
import posthog from "posthog-js";

if(process.env.NEXT_PUBLIC_SENTRY_DSN){
  Sentry.init({dsn:process.env.NEXT_PUBLIC_SENTRY_DSN,sendDefaultPii:false,tracesSampleRate:0.05,enableLogs:false});
}

if(process.env.NEXT_PUBLIC_POSTHOG_KEY){
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY,{api_host:process.env.NEXT_PUBLIC_POSTHOG_HOST||"https://us.i.posthog.com",autocapture:false,capture_pageview:false,capture_pageleave:false,disable_session_recording:true,persistence:"memory"});
}

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
