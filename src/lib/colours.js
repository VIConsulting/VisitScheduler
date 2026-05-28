// Visitor chip colour legend matching original spreadsheet
export const VISITOR_COLOURS = {
  Nadia:  { bg: '#9c27b0', fg: '#fff', label: 'Nadia' },
  Howard: { bg: '#e91e63', fg: '#fff', label: 'Howard Away' },
  Kem:    { bg: '#212121', fg: '#fff', label: 'Kem Work (MK)' },
  Kerim:  { bg: '#00bcd4', fg: '#000', label: 'Kerim' },
  Vinnie: { bg: '#ff9800', fg: '#000', label: 'Vinnie' },
};

export const STATUS_COLOURS = {
  hospital: { bg: '#f44336', fg: '#fff', label: 'Hospital Visit' },
  away:     { bg: '#ffeb3b', fg: '#000', label: 'Away / Holiday' },
  work:     { bg: '#212121', fg: '#fff', label: 'Work Conflict' },
  cannot:   { bg: '#00bcd4', fg: '#000', label: 'Cannot Attend' },
};

export function getChipStyle(visitorName) {
  const c = VISITOR_COLOURS[visitorName];
  if (c) return { backgroundColor: c.bg, color: c.fg };
  // fallback for custom visitors
  return { backgroundColor: '#607d8b', color: '#fff' };
}
