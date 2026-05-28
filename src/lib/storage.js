const KEYS = {
  USERS: 'nxtgen_users',
  SESSION: 'nxtgen_session',
  SCHEDULE: 'nxtgen_schedule',
  REMEMBER: 'nxtgen_remember',
};

export function getUsers() {
  try {
    return JSON.parse(localStorage.getItem(KEYS.USERS)) || [];
  } catch {
    return [];
  }
}

export function saveUsers(users) {
  localStorage.setItem(KEYS.USERS, JSON.stringify(users));
}

export function getSession() {
  try {
    const s = sessionStorage.getItem(KEYS.SESSION) || localStorage.getItem(KEYS.REMEMBER);
    return s ? JSON.parse(s) : null;
  } catch {
    return null;
  }
}

export function saveSession(user, remember) {
  const payload = JSON.stringify({ username: user.username, role: user.role });
  sessionStorage.setItem(KEYS.SESSION, payload);
  if (remember) {
    localStorage.setItem(KEYS.REMEMBER, payload);
  }
}

export function clearSession() {
  sessionStorage.removeItem(KEYS.SESSION);
  localStorage.removeItem(KEYS.REMEMBER);
}

export function getSchedule() {
  try {
    return JSON.parse(localStorage.getItem(KEYS.SCHEDULE)) || {};
  } catch {
    return {};
  }
}

export function saveSchedule(schedule) {
  localStorage.setItem(KEYS.SCHEDULE, JSON.stringify(schedule));
}

export function clearSchedule() {
  localStorage.removeItem(KEYS.SCHEDULE);
}
