-- Prepared only; do not apply to a live database without separate authorization.
-- These records are learning convenience data, never financial entitlements.
create table public.learning_account_state (
 user_id uuid primary key references auth.users(id) on delete cascade,
 revision bigint not null default 0 check (revision >= 0),
 state jsonb not null check (jsonb_typeof(state) = 'object')
);
create table public.learning_account_completions (
 user_id uuid not null references auth.users(id) on delete cascade,
 lesson_id text not null check (lesson_id in ('what-you-own','why-prices-move','spread-your-risk','read-earnings','fees-and-time','research-checklist')),
 completed_at timestamptz,
 primary key (user_id,lesson_id)
);
alter table public.learning_account_state enable row level security;
alter table public.learning_account_completions enable row level security;
create policy own_learning_state on public.learning_account_state for all to authenticated using (auth.uid()=user_id) with check (auth.uid()=user_id);
create policy own_learning_completions on public.learning_account_completions for all to authenticated using (auth.uid()=user_id) with check (auth.uid()=user_id);
revoke all on public.learning_account_state, public.learning_account_completions from anon;
grant select,insert,update,delete on public.learning_account_state, public.learning_account_completions to authenticated;
create function public.learning_schema_ready() returns boolean language sql stable set search_path = '' as $$ select true $$;
revoke all on function public.learning_schema_ready() from public;
grant execute on function public.learning_schema_ready() to anon, authenticated;
create function public.save_learning_progress(expected_revision bigint, progress jsonb)
returns bigint language plpgsql security invoker set search_path = '' as $$
declare owner_id uuid := auth.uid(); new_revision bigint; item text; earned_at timestamptz;
begin
 if owner_id is null then raise exception 'Authentication required'; end if;
 if jsonb_typeof(progress) <> 'object' or jsonb_typeof(progress->'completed') <> 'array' then raise exception 'Invalid progress'; end if;
 insert into public.learning_account_state(user_id,revision,state) values(owner_id,0,'{}') on conflict do nothing;
 update public.learning_account_state set state=progress, revision=revision+1 where user_id=owner_id and revision=expected_revision returning revision into new_revision;
 if new_revision is null then raise exception 'Learning revision conflict' using errcode='40001'; end if;
 for item in select jsonb_array_elements_text(progress->'completed') loop
  select (e->>'at')::timestamptz into earned_at from jsonb_array_elements(progress->'events') e where e->>'kind'='lesson' and e->>'target'=item limit 1;
  insert into public.learning_account_completions(user_id,lesson_id,completed_at) values(owner_id,item,earned_at) on conflict do nothing;
 end loop;
 return new_revision;
end $$;
revoke all on function public.save_learning_progress(bigint,jsonb) from public, anon;
grant execute on function public.save_learning_progress(bigint,jsonb) to authenticated;
