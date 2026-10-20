export const recapDemoEnabled=process.env.NEXT_PUBLIC_RECAP_DEMO_ENABLED!=="false";
// Explicitly deferred for the guest learning MVP. Keys alone never enable these flows.
export const connectedFeaturesEnabled=process.env.NEXT_PUBLIC_CONNECTED_FEATURES_ENABLED==="true";
