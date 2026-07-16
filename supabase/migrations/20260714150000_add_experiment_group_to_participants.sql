alter table public.participants
  add column experiment_group text not null default 'a'
    check (experiment_group in ('a', 'b'));
