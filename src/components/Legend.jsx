import { VISITOR_COLOURS, STATUS_COLOURS } from '../lib/colours.js';

export default function Legend() {
  return (
    <div className="legend">
      <span className="legend-title">Legend:</span>
      {Object.values(VISITOR_COLOURS).map(c => (
        <span key={c.label} className="legend-item" style={{ backgroundColor: c.bg, color: c.fg }}>
          {c.label}
        </span>
      ))}
      {Object.values(STATUS_COLOURS).map(c => (
        <span key={c.label} className="legend-item" style={{ backgroundColor: c.bg, color: c.fg }}>
          {c.label}
        </span>
      ))}
    </div>
  );
}
