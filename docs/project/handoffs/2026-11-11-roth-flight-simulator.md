# Roth IRA flight simulator
Date: 2026-11-11
Status: Complete
Area: Portfolio / learning

## Roth IRA flight simulator — 2026-11-11
Portfolio practice tab now launches the four-step Roth simulator, retaining the existing sandbox in a disclosure. Home/Learn launch /portfolio#roth-simulator. All transfers, quotes and orders are fictional. VTI supports market/limit teaching; FXAIX uses next-NAV fund purchase. Corrected 2026 under-50 annual IRA cap to $7,500, compensation/income constraints and qualified withdrawal conditions. Removed unsupported 4-in-10 statistic. End-of-month contributions at hypothetical 8%/12 for 480 months derive the projection. Bonus is a separate browser-local one-time flag, never catalog completion.
Validation: typecheck, lint, production build and three simulator tests pass. Browser completed $50 VTI market flow through preview/receipt, focus progression and projection. Full suite and mobile viewport checks not run. No real financial requests, new dependencies, account activation or deployment.

Files: components/roth-flight-simulator.tsx, module.css, test.tsx; portfolio-workspace.tsx, home-dashboard.tsx, learning-library.tsx. Complete files in Cornerstone-Roth-Simulator.zip. Existing sidebar, Ask, portfolio data and legacy practice retained. No remaining implementation work; uncommitted. Source references are linked inside the simulator.
