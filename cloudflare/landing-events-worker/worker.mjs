const corsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, OPTIONS',
  'access-control-allow-headers': 'authorization, content-type, x-moura-event-token',
};

const eventLabels = new Set([
  'page_view',
  'return_visit',
  'video_start',
  'video_25',
  'video_50',
  'video_75',
  'video_complete',
  'pdf_open',
  'cta_click',
]);

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, 'content-type': 'application/json; charset=utf-8' },
  });
}

function bearerToken(request) {
  const value = request.headers.get('authorization') || '';
  return value.replace(/^Bearer\s+/i, '').trim();
}

function normalizeEvent(payload = {}) {
  const metadata = payload.metadata && typeof payload.metadata === 'object'
    ? payload.metadata
    : payload.payload && typeof payload.payload === 'object'
      ? payload.payload
      : {};

  return {
    id: String(payload.id || crypto.randomUUID()).trim(),
    applicationId: String(payload.applicationId || payload.leadId || payload.lead_id || '').trim(),
    event: String(payload.event || payload.eventName || payload.event_name || '').trim(),
    occurredAt: String(payload.occurredAt || payload.occurred_at || new Date().toISOString()).trim(),
    receivedAt: new Date().toISOString(),
    pageUrl: String(payload.pageUrl || payload.page_url || metadata.pageUrl || metadata.page || '').trim(),
    sessionId: String(payload.sessionId || payload.session_id || metadata.sessionId || '').trim(),
    source: String(payload.source || 'cloudflare-worker').trim(),
    metadata,
  };
}

function validateEvent(event) {
  return [
    !event.applicationId && 'applicationId',
    !event.event && 'event',
    !eventLabels.has(event.event) && `event desconhecido (${event.event})`,
  ].filter(Boolean);
}

function parseMetadata(value) {
  if (!value) return {};
  if (typeof value === 'object') return value;
  try { return JSON.parse(value); } catch { return {}; }
}

async function readBody(request) {
  try { return await request.json(); } catch { return {}; }
}

async function trackEvent(request, env) {
  const payload = await readBody(request);
  const requestToken = String(payload.token || request.headers.get('x-moura-event-token') || '').trim();

  if (env.PUBLIC_EVENT_TOKEN && requestToken !== env.PUBLIC_EVENT_TOKEN) {
    return json({ ok: false, errors: ['Token público inválido.'] }, 401);
  }

  const event = normalizeEvent(payload);
  const errors = validateEvent(event);
  if (errors.length > 0) return json({ ok: false, errors }, 400);
  if (!env.DB) return json({ ok: false, errors: ['Binding D1 DB ausente.'] }, 500);

  await env.DB.prepare(`
    insert into landing_events (
      id, application_id, event_name, occurred_at, received_at, page_url, session_id, source, metadata
    ) values (?, ?, ?, ?, ?, ?, ?, ?, ?)
    on conflict(id) do nothing
  `).bind(
    event.id,
    event.applicationId,
    event.event,
    event.occurredAt,
    event.receivedAt,
    event.pageUrl,
    event.sessionId,
    event.source,
    JSON.stringify(event.metadata || {})
  ).run();

  return json({ ok: true, event });
}

async function listEvents(request, env) {
  if (!env.EVENTS_API_TOKEN || bearerToken(request) !== env.EVENTS_API_TOKEN) {
    return json({ ok: false, errors: ['Não autorizado.'] }, 401);
  }
  if (!env.DB) return json({ ok: false, errors: ['Binding D1 DB ausente.'] }, 500);

  const url = new URL(request.url);
  const since = url.searchParams.get('since') || '1970-01-01T00:00:00.000Z';
  const limit = Math.max(1, Math.min(500, Number(url.searchParams.get('limit') || 200)));
  const { results } = await env.DB.prepare(`
    select id, application_id, event_name, occurred_at, received_at, page_url, session_id, source, metadata
    from landing_events
    where occurred_at > ?
    order by occurred_at asc
    limit ?
  `).bind(since, limit).all();

  const events = (results || []).map((row) => ({
    id: row.id,
    applicationId: row.application_id,
    event: row.event_name,
    occurredAt: row.occurred_at,
    receivedAt: row.received_at,
    pageUrl: row.page_url,
    sessionId: row.session_id,
    source: row.source,
    metadata: parseMetadata(row.metadata),
  }));

  return json({ ok: true, events, count: events.length });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    if (request.method === 'POST' && url.pathname === '/track') {
      return trackEvent(request, env);
    }

    if (request.method === 'GET' && url.pathname === '/events') {
      return listEvents(request, env);
    }

    return json({ ok: false, errors: ['Rota não encontrada.'] }, 404);
  },
};

export { normalizeEvent, validateEvent };
