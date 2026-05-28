import { apiLogin, apiMe, apiLogout, setToken, clearToken } from './api.js';

export async function login(username, password, remember) {
  const result = await apiLogin(username, password, remember);
  if (result?.ok) setToken(result.token);
  return result;
}

export async function logout() {
  await apiLogout();
  clearToken();
}

export async function currentSession() {
  const result = await apiMe();
  return result?.ok ? result.user : null;
}
