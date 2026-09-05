# Cornerstone security model

Cornerstone is read-only. It must never request brokerage trading or transfer permissions.

## Non-negotiable controls

- Provider credentials and Plaid access tokens remain server-side and encrypted at rest.
- Every user-owned table uses authenticated row-level security and denies anonymous access.
- Financial calculations are deterministic; AI can explain sourced facts but cannot place trades or issue individualized buy/sell instructions.
- Logs and analytics exclude holdings, balances, transactions, email addresses, access tokens, prompts containing portfolio data, and imported files.
- Webhooks must be signature-verified and idempotent before production access is enabled.
- Account deletion removes provider connections, encrypted tokens, portfolio records, generated briefings, and user preferences.

## Cornerstone Recap controls

- Contribution totals use confirmed external contribution events only. Provider suggestions are inert until a user confirms them; corrections create a new immutable recap revision.
- Plaid token exchange requires an authenticated user. Access tokens use AES-256-GCM at rest, never return to the browser, and are revoked before connection or account deletion.
- Plaid and Stripe webhook bodies are verified before parsing into state and claimed through unique provider-event digests. Do not store raw webhook payloads.
- Stripe entitlement periods come from verified webhooks. Client state never grants Pro, and cancellation keeps access only through the stored paid-period end.
- Recap images containing real totals require authentication and ownership. Financial values never appear in public URLs; new share cards hide amounts by default.
- Monthly email is explicit opt-in. Subject and preview omit financial values; each period has a unique delivery claim and Resend idempotency key. Unsubscribe links are signed and scoped.
- Campus results require explicit cohort opt-in, verified domain, six complete months of eligible history and at least 30 eligible users. Only percentile and cohort-size band leave the server. Verification challenges are deleted after success and expired challenges are purged.
- Account deletion revokes Plaid items, cancels active Stripe subscriptions, deletes the Stripe customer and then deletes the Supabase auth user so user-owned records cascade.
- Product analytics may record only allowlisted event names without properties. Keep amounts, holdings, symbols, transactions, email, school local parts and portfolio prompts out of analytics, provider metadata and logs.

## Release gate

Do not invite external users while any high or critical dependency finding, secret-scanning alert, cross-user authorization failure, unverified webhook, failed deletion/revocation check, email deduplication defect or financial-data integrity defect is unresolved. Compiled provider adapters and checked-in SQL are not evidence that these controls passed against live services.
