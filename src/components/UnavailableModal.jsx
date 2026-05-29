import { useState } from 'react';
import { KNOWN_VISITORS } from '../lib/schedule.js';

function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

export default function UnavailableModal({ onClose, onSave }) {
  const [name, setName] = useState(KNOWN_VISITORS[0]);
  const [startDate, setStartDate] = useState(todayStr());
  const [endDate, setEndDate] = useState(todayStr());
  const [label, setLabel] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    if (!startDate || !endDate) { setError('Please select both dates.'); return; }
    if (endDate < startDate) { setError('End date must be on or after start date.'); return; }
    setSaving(true);
    await onSave({ name, startDate, endDate, label: label.trim() });
    setSaving(false);
    onClose();
  }

  return (
    <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <div>
            <div className="modal-title">Mark Unavailable</div>
            <div className="modal-subtitle">Block out dates for a visitor</div>
          </div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          <div className="field">
            <label>Person</label>
            <select value={name} onChange={e => setName(e.target.value)}>
              {KNOWN_VISITORS.map(v => <option key={v} value={v}>{v}</option>)}
            </select>
          </div>
          <div className="unavail-dates">
            <div className="field">
              <label>From</label>
              <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
            </div>
            <div className="field">
              <label>To</label>
              <input type="date" value={endDate} min={startDate} onChange={e => setEndDate(e.target.value)} />
            </div>
          </div>
          <div className="field">
            <label>Reason <span style={{fontWeight:400, color:'var(--text-muted)'}}>optional</span></label>
            <input type="text" placeholder="e.g. Holiday, Work (MK)" value={label}
              onChange={e => setLabel(e.target.value)} />
          </div>
          {error && <div className="field-error">{error}</div>}
        </div>

        <div className="modal-footer">
          <button className="btn btn--ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn--primary" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}
