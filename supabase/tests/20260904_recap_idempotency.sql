begin;
create extension if not exists pgtap with schema extensions;
select plan(3);

insert into provider_webhook_events (provider,event_digest,event_type) values ('stripe','same-event','customer.subscription.updated');
select throws_ok($$insert into provider_webhook_events (provider,event_digest,event_type) values ('stripe','same-event','customer.subscription.updated')$$,'23505',null,'a repeated provider event cannot be processed twice');

insert into auth.users (id,aud,role,email,created_at,updated_at) values ('00000000-0000-4000-8000-000000000003','authenticated','authenticated','recap-mail@example.test',now(),now());
insert into recap_snapshots (id,user_id,period_kind,period_start,period_end,next_milestone,revision,source_as_of) values ('20000000-0000-4000-8000-000000000001','00000000-0000-4000-8000-000000000003','monthly','2026-08-01','2026-08-31',100,1,now());
select throws_ok($$insert into recap_snapshots (user_id,period_kind,period_start,period_end,next_milestone,revision,source_as_of) values ('00000000-0000-4000-8000-000000000003','monthly','2026-08-01','2026-08-31',100,1,now())$$,'23505',null,'a snapshot revision is immutable and unique');
insert into recap_email_deliveries (user_id,recap_id,idempotency_key,status) values ('00000000-0000-4000-8000-000000000003','20000000-0000-4000-8000-000000000001','monthly-user-2026-08','pending');
select throws_ok($$insert into recap_email_deliveries (user_id,recap_id,idempotency_key,status) values ('00000000-0000-4000-8000-000000000003','20000000-0000-4000-8000-000000000001','monthly-user-2026-08','pending')$$,'23505',null,'a monthly recap email has one delivery claim');

select * from finish();
rollback;
