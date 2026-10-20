# Private beta gates

Rollout stages: sample demo, internal connected accounts, 10 trusted monthly-recap testers, 25 Pro/campus testers, then at most 100 users.

Advance only when the prior stage has no high-severity security or data-integrity issue. Never send balances, contributions, holdings, transactions, symbols, emails, school local parts or portfolio prompts to analytics.

## Cornerstone Recap north star

Prioritize whether students understand their portfolio and can find useful learning or activity information without pressure to contribute on a schedule. The 2026-09-15 student pace direction supersedes the contribution-cadence target. Do not optimize for trade count, contributed dollars, portfolio value or consecutive contributing months.

Allowed product events are recap viewed, private share downloaded, classification corrected, trial started and subscription changed. They carry no financial or identity properties.

## Staged release

1. **Sample demo:** validate the overall portfolio picture, neutral activity and zero/withdrawal language, optional goals, amount-hidden sharing, duplicate warnings, keyboard flow, reduced motion and responsive layouts. No automatic monthly slideshow, contribution streak or campus percentile should appear.
2. **Data foundation:** in an isolated Supabase/Plaid sandbox, apply migrations and pgTAP tests; verify sign normalization, subtype suggestions, grouped/individual confirmation, pagination, cancellations, delayed/out-of-order webhooks, reconnects, revision rebuilding, RLS isolation, revocation and deletion. Billing and email stay disabled.
3. **Monthly beta:** enable free monthly recaps and explicit email opt-in for trusted testers. Verify timezone boundaries, Resend unsubscribe/deduplication and authenticated recap links. Watch correction rate, disconnections, opt-outs, support issues and incorrect-total reports.
4. **Pro:** verify Stripe Checkout/Portal/webhook replay, trial and cancellation periods, existing entitlements, private downloads and optional scenario tools. Campus contribution comparison is no longer part of the Recap experience.

Keep the free monthly headline outside the paywall. Stop rollout for any cross-user access, incorrect contribution total, unverified webhook, public amount leak, provider revocation failure, duplicate email, broken unsubscribe or incomplete account deletion.

Existing broader beta targets remain useful: 70% authentication completion, 50% portfolio connection/import, median first briefing under three minutes, and 35% of activated users returning in at least three of their first four weeks.

## Learning-first MVP gate — 2026-10-12

The public candidate is guest learning plus fixed fictional-money practice. This supersedes the connected monthly-recap rollout as the next release. Keep NEXT_PUBLIC_CONNECTED_FEATURES_ENABLED=false. The integration stages above remain deferred requirements, not current UI promises.

Before promotion:
- Pass lint, typecheck, domain/UI tests and production build.
- Resolve high/critical dependency advisories, including development-tool advisories or record a separately reviewed release decision. Do not blindly force a framework downgrade.
- Test keyboard navigation, mobile menu isolation, visible focus, storage failure, reload, duplicate rewards/orders and layouts at 320/390/768/desktop.
- Run three cold production mobile Lighthouse audits; median performance target >=90 is a laboratory target, not a real-user claim.
- Have five target students independently find their first lesson within 30 seconds and finish within four minutes; at least four must succeed. Observe practice and a next-day return. Do not invent participants or results.
- Keep source/date labels and fictional-money disclosures. Sharing must contain only selected learning/reflection counts; no financial values.
- Cross-device retention is not measurable reliably with this browser-only MVP.

Learning analytics allow onboarding_completed, lesson_completed, review_completed and practice_reflected with no custom properties. Retention means learning and return visits, never trading frequency or simulated profit.
