create table if not exists landing_events (
  id text primary key,
  application_id text not null,
  event_name text not null,
  occurred_at text not null,
  received_at text not null,
  page_url text,
  session_id text,
  source text,
  metadata text
);

create index if not exists idx_landing_events_application on landing_events(application_id);
create index if not exists idx_landing_events_occurred_at on landing_events(occurred_at);
