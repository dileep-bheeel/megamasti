create extension if not exists pgcrypto;

create table public.posts (
  id uuid primary key default gen_random_uuid(),
  content text not null check (char_length(content) between 10 and 600),
  category text not null check (category in ('Life','Friendship','Study','Family','Work','Random')),
  mood text not null default 'Honest',
  hearts integer not null default 0 check (hearts >= 0),
  reply_count integer not null default 0 check (reply_count >= 0),
  status text not null default 'published' check (status in ('pending','published','hidden','removed')),
  fingerprint_hash text,
  created_at timestamptz not null default now()
);
create table public.replies (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  content text not null check (char_length(content) between 2 and 400),
  status text not null default 'published' check (status in ('pending','published','hidden','removed')),
  created_at timestamptz not null default now()
);
create table public.reports (
  id uuid primary key default gen_random_uuid(),
  post_id uuid references public.posts(id) on delete cascade,
  reply_id uuid references public.replies(id) on delete cascade,
  reason text not null,
  details text,
  created_at timestamptz not null default now(),
  check ((post_id is not null) <> (reply_id is not null))
);
alter table public.posts enable row level security;
alter table public.replies enable row level security;
alter table public.reports enable row level security;
create policy "Public reads published posts" on public.posts for select using (status='published');
create policy "Anonymous creates posts" on public.posts for insert to anon with check (status='published' and hearts=0 and reply_count=0);
create policy "Public reads published replies" on public.replies for select using (status='published');
create policy "Anonymous creates replies" on public.replies for insert to anon with check (status='published');
create policy "Anonymous creates reports" on public.reports for insert to anon with check (true);
create index posts_created_at_idx on public.posts(created_at desc);
create index posts_category_idx on public.posts(category) where status='published';
create index replies_post_id_idx on public.replies(post_id,created_at);