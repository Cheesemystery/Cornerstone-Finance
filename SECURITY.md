# Cornerstone security model

Cornerstone is read-only. It must never request brokerage trading or transfer permissions.

## Non-negotiable controls

- Provider credentials and Plaid access tokens remain server-side and encrypted at rest.
- Every user-owned table uses authenticated row-level security and denies anonymous access.
- Financial calculations are deterministic; AI can explain sourced facts but cannot place trades or issue individualized buy/sell instructions.
- Logs and analytics exclude holdings, balances, transactions, email addresses, access tokens, prompts containing portfolio data, and imported files.
- Webhooks must be signature-verified and idempotent before production access is enabled.
- Account deletion removes provider connections, encrypted tokens, portfolio records, generated briefings, and user preferences.

## Release gate

Do not invite external users while any high or critical dependency finding, secret-scanning alert, cross-user authorization failure, unverified webhook, or financial-data integrity defect is unresolved.
