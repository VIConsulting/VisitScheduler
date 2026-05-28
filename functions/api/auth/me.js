import { json, getSession } from '../../_shared.js';

export async function onRequestGet({ request, env }) {
  const session = await getSession(env, request);
  if (!session) return json({ ok: false });
  return json({ ok: true, user: { username: session.username, role: session.role } });
}
