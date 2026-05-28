import { json, sha256, seedAdmin } from '../../_shared.js';

export async function onRequestPost({ request, env }) {
  try {
    const { username, password, remember } = await request.json();
    const users = await seedAdmin(env);
    const user = users.find(u => u.username.toLowerCase() === username.toLowerCase());

    if (!user) return json({ ok: false, reason: 'invalid' });
    if (!user.active) return json({ ok: false, reason: 'inactive' });

    const hash = await sha256(password);
    if (hash !== user.passwordHash) return json({ ok: false, reason: 'invalid' });

    const token = crypto.randomUUID();
    const ttl = remember ? 60 * 60 * 24 * 30 : 60 * 60 * 24;
    await env.KV.put(
      `session:${token}`,
      JSON.stringify({ userId: user.id, username: user.username, role: user.role }),
      { expirationTtl: ttl },
    );

    return json({ ok: true, token, user: { username: user.username, role: user.role } });
  } catch {
    return json({ ok: false, reason: 'error' }, 500);
  }
}
