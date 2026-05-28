import { getSchedule, saveSchedule } from './storage.js';

export const PERIODS = ['AM', 'LUNCH', 'PM'];

// slotKey: "YYYY-MM-DD:PERIOD"
export function slotKey(date, period) {
  return `${date}:${period}`;
}

export function getSlot(date, period) {
  const schedule = getSchedule();
  return schedule[slotKey(date, period)] || { visitors: [], note: '' };
}

export function addVisitor(date, period, visitorName) {
  const schedule = getSchedule();
  const key = slotKey(date, period);
  const slot = schedule[key] || { visitors: [], note: '' };
  if (!slot.visitors.includes(visitorName)) {
    slot.visitors = [...slot.visitors, visitorName];
  }
  saveSchedule({ ...schedule, [key]: slot });
}

export function removeVisitor(date, period, visitorName) {
  const schedule = getSchedule();
  const key = slotKey(date, period);
  const slot = schedule[key] || { visitors: [], note: '' };
  slot.visitors = slot.visitors.filter(v => v !== visitorName);
  saveSchedule({ ...schedule, [key]: slot });
}

export function setNote(date, period, note) {
  const schedule = getSchedule();
  const key = slotKey(date, period);
  const slot = schedule[key] || { visitors: [], note: '' };
  slot.note = note;
  saveSchedule({ ...schedule, [key]: slot });
}

// Returns all days in the given month as "YYYY-MM-DD" strings
export function daysInMonth(year, month) {
  const days = [];
  const d = new Date(year, month, 1);
  while (d.getMonth() === month) {
    days.push(d.toISOString().slice(0, 10));
    d.setDate(d.getDate() + 1);
  }
  return days;
}

// Returns weeks (arrays of 7 day strings or null for padding) for the month
export function weeksInMonth(year, month) {
  const days = daysInMonth(year, month);
  const first = new Date(year, month, 1);
  // Monday-first: 0=Mon, 6=Sun
  const startPad = (first.getDay() + 6) % 7;
  const cells = [...Array(startPad).fill(null), ...days];
  while (cells.length % 7 !== 0) cells.push(null);
  const weeks = [];
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7));
  }
  return weeks;
}

export const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export const KNOWN_VISITORS = ['Nadia', 'Kem', 'Kerim', 'Howard', 'Vinnie'];
