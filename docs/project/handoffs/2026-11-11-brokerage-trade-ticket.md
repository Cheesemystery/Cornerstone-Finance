# Brokerage-style simulator ticket
Date: 2026-11-11
Status: Complete
Area: Portfolio practice

## Simulator trade ticket — 2026-11-11
Trade ticket now uses brokerage-style account/quote strips and labeled Symbol, Buy/Sell, Dollars/Shares, and Market/Limit selects. Quantity starts empty and accepts user entry; preview validates positive finite values, available practice cash and owned practice shares. Market fills adjust in-session cash/positions; another-order control supports buy then sell. Limit orders remain open with no balance mutation; buy max/sell min descriptions and receipts reflect action. FXAIX retains next-NAV behavior (no ETF market/limit). Real portfolio state unaffected.
Checks: typecheck/lint and four simulator tests pass, including empty field, cash validation, limit handling, mutual-fund distinction and buy/sell receipt. Browser verified empty-input ticket and dropdown layout. Production build run separately. No dependency, brokerage connection or deployment.

Files: components/roth-flight-simulator.tsx, module.css, test.tsx. Full drop-in files in Cornerstone-Trade-Ticket.zip. No commits. Fixed illustrative prices, simplified fills and in-session-only balances remain educational assumptions.
