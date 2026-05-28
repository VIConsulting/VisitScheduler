export function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function sha256(str) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function getSession(env, request) {
  const auth = request.headers.get('Authorization') || '';
  const token = auth.replace('Bearer ', '').trim();
  if (!token) return null;
  const data = await env.KV.get(`session:${token}`);
  return data ? JSON.parse(data) : null;
}

export async function requireAuth(env, request) {
  const session = await getSession(env, request);
  if (!session) return { error: json({ ok: false, reason: 'unauthorized' }, 401) };
  return { session };
}

export async function requireAdmin(env, request) {
  const result = await requireAuth(env, request);
  if (result.error) return result;
  if (result.session.role !== 'admin') return { error: json({ ok: false, reason: 'forbidden' }, 403) };
  return result;
}

export async function getUsers(env) {
  const data = await env.KV.get('users');
  return data ? JSON.parse(data) : [];
}

export async function saveUsers(env, users) {
  await env.KV.put('users', JSON.stringify(users));
}

export async function seedAdmin(env) {
  const users = await getUsers(env);
  if (users.length === 0) {
    const hash = await sha256('Bombsight');
    const admin = { id: crypto.randomUUID(), username: 'Vinnie', passwordHash: hash, role: 'admin', active: true };
    await saveUsers(env, [admin]);
    return [admin];
  }
  return users;
}
