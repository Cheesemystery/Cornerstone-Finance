begin;
create extension if not exists pgtap with schema extensions;
select plan(6);

insert into auth.users (id,aud,role,email,created_at,updated_at) values
  ('00000000-0000-4000-8000-000000000001','authenticated','authenticated','recap-a@example.test',now(),now()),
  ('00000000-0000-4000-8000-000000000002','authenticated','authenticated','recap-b@example.test',now(),now());

insert into contribution_events (id,user_id,occurred_on,amount,direction,source,status) values
  ('10000000-0000-4000-8000-000000000001','00000000-0000-4000-8000-000000000001','2026-08-04',100,'contribution','manual','confirmed'),
  ('10000000-0000-4000-8000-000000000002','00000000-0000-4000-8000-000000000002','2026-08-04',200,'contribution','manual','confirmed');
insert into recap_preferences (user_id,email_opt_in) values
  ('00000000-0000-4000-8000-000000000001',false),
  ('00000000-0000-4000-8000-000000000002',false);

set local role authenticated;
select set_config('request.jwt.claim.sub','00000000-0000-4000-8000-000000000001',true);
select is((select count(*)::int from contribution_events),1,'user sees only their own contribution events');
select is((select amount::int from contribution_events limit 1),100,'the visible contribution belongs to the signed-in user');
select is((select count(*)::int from recap_preferences),1,'user sees only their own recap preferences');
select throws_ok($$update contribution_events set amount=999 where true$$,'42501',null,'clients cannot mutate contributions directly');
select throws_ok($$insert into recap_preferences (user_id) values ('00000000-0000-4000-8000-000000000001')$$,'42501',null,'clients cannot bypass server-mediated preference writes');

reset role;
delete from auth.users where id='00000000-0000-4000-8000-000000000001';
select is((select count(*)::int from contribution_events where user_id='00000000-0000-4000-8000-000000000001'),0,'auth deletion cascades through contribution data');

select * from finish();
rollback;
