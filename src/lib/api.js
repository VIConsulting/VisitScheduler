const TOKEN_KEY = 'visitsch_token';

export function getToken() { return localStorage.getItem(TOKEN_KEY); }
export function setToken(t) { localStorage.setItem(TOKEN_KEY, t); }
export function clearToken() { localStorage.removeItem(TOKEN_KEY); }

async function req(path, options = {}) {
  const token = getToken();
  const res = await fetch(path, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  if (res.status === 401) { clearToken(); window.location.reload(); return; }
  return res.json();
}

// Auth
export async function apiLogin(username, password, remember) {
  return req('/api/auth/login', { method: 'POST', body: JSON.stringify({ username, password, remember }) });
}
export async function apiMe() { return req('/api/auth/me'); }
export async function apiLogout() {
  await req('/api/auth/logout', { method: 'POST' });
  clearToken();
}

// Users (admin)
export async function apiGetUsers() { return req('/api/users'); }
export async function apiCreateUser(username, password, role) {
  return req('/api/users', { method: 'POST', body: JSON.stringify({ username, password, role }) });
}
export async function apiUpdateUser(id, data) {
  return req(`/api/users/${id}`, { method: 'PUT', body: JSON.stringify(data) });
}

// Unavailability
export async function apiGetUnavailability() { return req('/api/unavailability'); }
export async function apiAddUnavailability(entry) {
  return req('/api/unavailability', { method: 'POST', body: JSON.stringify(entry) });
}
export async function apiDeleteUnavailability(id) {
  return req(`/api/unavailability/${id}`, { method: 'DELETE' });
}

// Schedule
export async function apiGetSchedule() { return req('/api/schedule'); }
export async function apiUpdateSlot(date, period, slot) {
  return req('/api/schedule', { method: 'PUT', body: JSON.stringify({ key: `${date}:${period}`, slot }) });
}
export async function apiImportSchedule(schedule) {
  return req('/api/schedule/import', { method: 'POST', body: JSON.stringify({ schedule }) });
}
export async function apiClearSchedule() {
  return req('/api/schedule', { method: 'DELETE' });
}
