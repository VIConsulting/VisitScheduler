export const PERIODS = ['AM', 'LUNCH', 'PM'];
export const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
export const KNOWN_VISITORS = ['Nadia', 'Kem', 'Kerim', 'Howard', 'Vinnie'];

export function slotKey(date, period) {
  return `${date}:${period}`;
}

function localDateStr(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function daysInMonth(year, month) {
  const days = [];
  const d = new Date(year, month, 1);
  while (d.getMonth() === month) {
    days.push(localDateStr(d));
    d.setDate(d.getDate() + 1);
  }
  return days;
}

export function weeksInMonth(year, month) {
  const days = daysInMonth(year, month);
  const first = new Date(year, month, 1);
  const startPad = (first.getDay() + 6) % 7;
  const cells = [...Array(startPad).fill(null), ...days];
  while (cells.length % 7 !== 0) cells.push(null);
  const weeks = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return weeks;
}
