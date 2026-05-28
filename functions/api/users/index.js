import { json, requireAdmin, sha256, getUsers, saveUsers } from '../../_shared.js';

export async function onRequestGet({ request, env }) {
  const { error } = await requireAdmin(env, request);
  if (error) return error;
  const users = await getUsers(env);
  return json(users.map(({ passwordHash, ...u }) => u));
}

export async function onRequestPost({ request, env }) {
  const { error } = await requireAdmin(env, request);
  if (error) return error;

  const { username, password, role } = await request.json();
  if (!username || !password || !role) return json({ ok: false, reason: 'missing fields' }, 400);

  const users = await getUsers(env);
  if (users.find(u => u.username.toLowerCase() === username.toLowerCase())) {
    return json({ ok: false, reason: 'exists' }, 409);
  }

  const user = {
    id: crypto.randomUUID(),
    username: username.trim(),
    passwordHash: await sha256(password),
    role,
    active: true,
  };
  await saveUsers(env, [...users, user]);

  const { passwordHash, ...safeUser } = user;
  return json({ ok: true, user: safeUser }, 201);
}
