import { json, requireAuth } from '../../_shared.js';

export async function onRequestDelete({ request, env, params }) {
  const { session, error } = await requireAuth(env, request);
  if (error) return error;
  if (session.role === 'viewer') return json({ ok: false, reason: 'forbidden' }, 403);

  const data = await env.KV.get('unavailability');
  const entries = data ? JSON.parse(data) : {};
  delete entries[params.id];
  await env.KV.put('unavailability', JSON.stringify(entries));
  return json({ ok: true });
}
