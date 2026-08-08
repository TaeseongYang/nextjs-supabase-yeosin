alter table public.review_summaries add column bullets text[] not null default '{}';
update public.review_summaries set bullets = positive_bullets || negative_bullets;
alter table public.review_summaries drop column positive_bullets;
alter table public.review_summaries drop column negative_bullets;
