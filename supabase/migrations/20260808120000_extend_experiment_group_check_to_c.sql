-- 실험 그룹에 C(총평형 요약 전용)를 추가하기 위해 기존 check 제약을 (a, b, c)로 확장한다.
alter table public.participants
  drop constraint participants_experiment_group_check;

alter table public.participants
  add constraint participants_experiment_group_check
  check (experiment_group in ('a', 'b', 'c'));
