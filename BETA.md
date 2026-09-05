# Private beta gates

Rollout stages: sample demo, internal connected accounts, 10 trusted monthly-recap testers, 25 Pro/campus testers, then at most 100 users.

Advance only when the prior stage has no high-severity security or data-integrity issue. Never send balances, contributions, holdings, transactions, symbols, emails, school local parts or portfolio prompts to analytics.

## Cornerstone Recap north star

Measure investing consistency: the percentage of activated users with at least one confirmed contribution in two of three completed calendar months. Return visits and Pro conversion are secondary. Do not optimize for trade count, contributed dollars or portfolio value.

Allowed product events are recap viewed, private share downloaded, classification corrected, trial started and subscription changed. They carry no financial or identity properties.

## Staged release

1. **Sample demo:** validate the $240 headline, three-month streak story, seven-step recap, zero/withdrawal language, amount-hidden sharing, duplicate warnings, keyboard flow, reduced motion and responsive layouts.
2. **Data foundation:** in an isolated Supabase/Plaid sandbox, apply migrations and pgTAP tests; verify sign normalization, subtype suggestions, grouped/individual confirmation, pagination, cancellations, delayed/out-of-order webhooks, reconnects, revision rebuilding, RLS isolation, revocation and deletion. Billing and email stay disabled.
3. **Monthly beta:** enable free monthly recaps and explicit email opt-in for trusted testers. Verify timezone boundaries, Resend unsubscribe/deduplication and authenticated recap links. Watch correction rate, disconnections, opt-outs, support issues and incorrect-total reports.
4. **Pro and campus:** verify Stripe Checkout/Portal/webhook replay, trial and cancellation periods, weekly/full-history entitlements, private downloads and custom insights. Enable campus percentile only when verification, six-month history and the 30-user threshold all pass.

Keep the free monthly headline outside the paywall. Stop rollout for any cross-user access, incorrect contribution total, unverified webhook, public amount leak, provider revocation failure, duplicate email, broken unsubscribe or incomplete account deletion.

Existing broader beta targets remain useful: 70% authentication completion, 50% portfolio connection/import, median first briefing under three minutes, and 35% of activated users returning in at least three of their first four weeks.
