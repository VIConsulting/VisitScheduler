import { json, requireAdmin, sha256, getUsers, saveUsers } from '../../_shared.js';

export async function onRequestPut({ request, env, params }) {
  const { session, error } = await requireAdmin(env, request);
  if (error) return error;

  const { id } = params;
  const { username, role, active, newPassword } = await request.json();

  const users = await getUsers(env);
  const user = users.find(u => u.id === id);
  if (!user) return json({ ok: false, reason: 'not found' }, 404);

  if (user.username === session.username && role !== undefined && role !== user.role) {
    return json({ ok: false, reason: 'cannot change own role' }, 400);
  }
  if (user.username === session.username && active === false) {
    return json({ ok: false, reason: 'cannot deactivate own account' }, 400);
  }

  if (username !== undefined && username.toLowerCase() !== user.username.toLowerCase()) {
    const clash = users.find(u => u.id !== id && u.username.toLowerCase() === username.toLowerCase());
    if (clash) return json({ ok: false, reason: 'exists' }, 409);
  }

  const updated = {
    ...user,
    username: username !== undefined ? username.trim() : user.username,
    role: role !== undefined ? role : user.role,
    active: active !== undefined ? active : user.active,
    passwordHash: newPassword ? await sha256(newPassword) : user.passwordHash,
  };

  await saveUsers(env, users.map(u => u.id === id ? updated : u));

  const { passwordHash, ...safeUser } = updated;
  return json({ ok: true, user: safeUser });
}
