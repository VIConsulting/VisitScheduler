import { json, requireAuth, requireAdmin } from '../../_shared.js';

export async function onRequestGet({ request, env }) {
  const { error } = await requireAuth(env, request);
  if (error) return error;
  const data = await env.KV.get('schedule');
  return json(data ? JSON.parse(data) : {});
}

export async function onRequestPut({ request, env }) {
  const { session, error } = await requireAuth(env, request);
  if (error) return error;
  if (session.role === 'viewer') return json({ ok: false, reason: 'forbidden' }, 403);

  const { key, slot } = await request.json();
  if (!key) return json({ ok: false, reason: 'missing key' }, 400);

  const data = await env.KV.get('schedule');
  const schedule = data ? JSON.parse(data) : {};
  schedule[key] = slot;
  await env.KV.put('schedule', JSON.stringify(schedule));
  return json({ ok: true });
}

export async function onRequestDelete({ request, env }) {
  const { error } = await requireAdmin(env, request);
  if (error) return error;
  await env.KV.put('schedule', JSON.stringify({}));
  return json({ ok: true });
}
