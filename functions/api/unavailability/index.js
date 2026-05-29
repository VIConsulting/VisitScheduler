import { json, requireAuth } from '../../_shared.js';

export async function onRequestGet({ request, env }) {
  const { error } = await requireAuth(env, request);
  if (error) return error;
  const data = await env.KV.get('unavailability');
  return json(data ? JSON.parse(data) : {});
}

export async function onRequestPost({ request, env }) {
  const { session, error } = await requireAuth(env, request);
  if (error) return error;
  if (session.role === 'viewer') return json({ ok: false, reason: 'forbidden' }, 403);

  const { name, startDate, endDate, label } = await request.json();
  if (!name || !startDate || !endDate) return json({ ok: false, reason: 'missing fields' }, 400);
  if (endDate < startDate) return json({ ok: false, reason: 'end before start' }, 400);

  const data = await env.KV.get('unavailability');
  const entries = data ? JSON.parse(data) : {};
  const id = crypto.randomUUID();
  entries[id] = { id, name, startDate, endDate, label: label || '' };
  await env.KV.put('unavailability', JSON.stringify(entries));
  return json({ ok: true, entry: entries[id] }, 201);
}
