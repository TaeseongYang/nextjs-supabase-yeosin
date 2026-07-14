create type public.review_sentiment as enum ('positive', 'negative', 'neutral');

alter table public.review_attribute_tags
  add column sentiment public.review_sentiment not null default 'neutral';
