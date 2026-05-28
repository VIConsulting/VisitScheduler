import { json } from '../../_shared.js';

export async function onRequestPost({ request, env }) {
  const auth = request.headers.get('Authorization') || '';
  const token = auth.replace('Bearer ', '').trim();
  if (token) await env.KV.delete(`session:${token}`);
  return json({ ok: true });
}
