import { json, requireAdmin } from '../../_shared.js';

export async function onRequestPost({ request, env }) {
  const { error } = await requireAdmin(env, request);
  if (error) return error;

  const { schedule } = await request.json();
  if (typeof schedule !== 'object' || Array.isArray(schedule)) {
    return json({ ok: false, reason: 'invalid format' }, 400);
  }

  await env.KV.put('schedule', JSON.stringify(schedule));
  return json({ ok: true, count: Object.keys(schedule).length });
}
