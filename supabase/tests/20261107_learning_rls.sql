-- Run only against an isolated database after the prepared migration. Not run locally.
begin;
select plan(5);
insert into auth.users(id) values ('11111111-1111-4111-8111-111111111111'),('22222222-2222-4222-8222-222222222222');
insert into public.learning_account_state(user_id,state) values ('11111111-1111-4111-8111-111111111111','{}'),('22222222-2222-4222-8222-222222222222','{}');
insert into public.learning_account_completions(user_id,lesson_id) values ('22222222-2222-4222-8222-222222222222','read-earnings');
set local role authenticated;
select set_config('request.jwt.claims','{"sub":"11111111-1111-4111-8111-111111111111","role":"authenticated"}',true);
select is((select count(*)::int from public.learning_account_state),1,'only own state visible');
select is((select count(*)::int from public.learning_account_completions),0,'other completion rows unavailable');
select is(public.save_learning_progress(0,'{"completed":["what-you-own"],"events":[]}'),1::bigint,'first save succeeds');
select is(public.save_learning_progress(1,'{"completed":["what-you-own"],"events":[]}'),2::bigint,'repeat revision saves');
select is((select count(*)::int from public.learning_account_completions),1,'one completion per owner and lesson');
select * from finish();
rollback;
