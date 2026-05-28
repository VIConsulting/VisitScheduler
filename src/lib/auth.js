import { getUsers, saveUsers, getSession, saveSession, clearSession } from './storage.js';

export async function sha256(str) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function seedAdminIfNeeded() {
  const users = getUsers();
  if (users.length === 0) {
    const hash = await sha256('Bombsight');
    saveUsers([
      {
        id: crypto.randomUUID(),
        username: 'Vinnie',
        passwordHash: hash,
        role: 'admin',
        active: true,
      },
    ]);
  }
}

export async function login(username, password, remember) {
  const users = getUsers();
  const user = users.find(u => u.username.toLowerCase() === username.toLowerCase());
  if (!user) return { ok: false, reason: 'invalid' };
  if (!user.active) return { ok: false, reason: 'inactive' };
  const hash = await sha256(password);
  if (hash !== user.passwordHash) return { ok: false, reason: 'invalid' };
  saveSession(user, remember);
  return { ok: true, user };
}

export function logout() {
  clearSession();
}

export function currentSession() {
  return getSession();
}

export async function createUser(username, password, role) {
  const users = getUsers();
  if (users.find(u => u.username.toLowerCase() === username.toLowerCase())) {
    return { ok: false, reason: 'exists' };
  }
  const hash = await sha256(password);
  const user = {
    id: crypto.randomUUID(),
    username,
    passwordHash: hash,
    role,
    active: true,
  };
  saveUsers([...users, user]);
  return { ok: true, user };
}

export async function resetPassword(userId, newPassword) {
  const users = getUsers();
  const hash = await sha256(newPassword);
  saveUsers(users.map(u => u.id === userId ? { ...u, passwordHash: hash } : u));
}

export function setUserActive(userId, active) {
  const users = getUsers();
  saveUsers(users.map(u => u.id === userId ? { ...u, active } : u));
}

// Returns { ok, reason } — 'exists' if new username clashes with another user
export function updateUser(userId, { username, role }) {
  const users = getUsers();
  const clash = users.find(u => u.id !== userId && u.username.toLowerCase() === username.toLowerCase());
  if (clash) return { ok: false, reason: 'exists' };
  saveUsers(users.map(u => u.id === userId ? { ...u, username: username.trim(), role } : u));
  return { ok: true };
}
