if(process.env.NEXT_PUBLIC_SENTRY_DSN){
 void import("@sentry/nextjs").then(Sentry=>Sentry.init({dsn:process.env.NEXT_PUBLIC_SENTRY_DSN,sendDefaultPii:false,tracesSampleRate:0.05,enableLogs:false}));
}
if(process.env.NEXT_PUBLIC_POSTHOG_KEY){
 void import("posthog-js").then(({default:posthog})=>posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!,{api_host:process.env.NEXT_PUBLIC_POSTHOG_HOST||"https://us.i.posthog.com",autocapture:false,capture_pageview:false,capture_pageleave:false,disable_session_recording:true,persistence:"memory"}));
}
export function onRouterTransitionStart(...args:Parameters<typeof import("@sentry/nextjs").captureRouterTransitionStart>){
 if(process.env.NEXT_PUBLIC_SENTRY_DSN)void import("@sentry/nextjs").then(Sentry=>Sentry.captureRouterTransitionStart(...args));
}
