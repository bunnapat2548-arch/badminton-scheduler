-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Bookings table
create table if not exists public.bookings (
  id            uuid primary key default uuid_generate_v4(),
  customer_name text        not null,
  court_number  int         not null check (court_number between 1 and 6),
  booking_date  date        not null,
  start_time    time        not null,
  end_time      time        not null,
  note          text,
  color         text        not null default '#DBEAFE',
  created_at    timestamptz not null default now(),

  constraint valid_time_range check (end_time > start_time),
  constraint valid_start_hour check (
    extract(hour from start_time) >= 10 and
    extract(hour from start_time) < 22
  ),
  constraint valid_end_hour check (
    extract(hour from end_time) > 10 and
    (extract(hour from end_time) < 22 or
     (extract(hour from end_time) = 22 and extract(minute from end_time) = 0))
  )
);

-- Index for fast daily lookups
create index if not exists bookings_date_idx on public.bookings (booking_date);
create index if not exists bookings_court_date_idx on public.bookings (court_number, booking_date);

-- Function to check overlapping bookings
create or replace function check_booking_overlap()
returns trigger as $$
begin
  if exists (
    select 1 from public.bookings
    where id != coalesce(new.id, '00000000-0000-0000-0000-000000000000'::uuid)
      and court_number = new.court_number
      and booking_date = new.booking_date
      and start_time < new.end_time
      and end_time > new.start_time
  ) then
    raise exception 'มีการจองทับซ้อนในคอร์ทและช่วงเวลานี้แล้ว';
  end if;
  return new;
end;
$$ language plpgsql;

-- Trigger for overlap check on insert
create trigger bookings_no_overlap_insert
  before insert on public.bookings
  for each row execute function check_booking_overlap();

-- Trigger for overlap check on update
create trigger bookings_no_overlap_update
  before update on public.bookings
  for each row execute function check_booking_overlap();

-- Row Level Security
alter table public.bookings enable row level security;

-- Policy: authenticated users can do everything (admin-only system)
create policy "Authenticated users can read bookings"
  on public.bookings for select
  to authenticated
  using (true);

create policy "Authenticated users can insert bookings"
  on public.bookings for insert
  to authenticated
  with check (true);

create policy "Authenticated users can update bookings"
  on public.bookings for update
  to authenticated
  using (true)
  with check (true);

create policy "Authenticated users can delete bookings"
  on public.bookings for delete
  to authenticated
  using (true);

-- Enable Realtime
alter publication supabase_realtime add table public.bookings;
