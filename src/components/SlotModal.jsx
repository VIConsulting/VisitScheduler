import { useState } from 'react';
import { KNOWN_VISITORS } from '../lib/schedule.js';
import { getChipStyle } from '../lib/colours.js';

export default function SlotModal({ date, period, slot, canEdit, onClose, onToggleVisitor, onToggleUnavailable, onSetNote }) {
  const [note, setNote] = useState(slot.note || '');
  const [noteSaved, setNoteSaved] = useState(false);

  const visitors = slot.visitors || [];
  const unavailable = slot.unavailable || [];

  const displayDate = new Date(date + 'T00:00:00').toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long',
  });

  async function handleNoteBlur() {
    if (!canEdit) return;
    await onSetNote(date, period, note);
    setNoteSaved(true);
    setTimeout(() => setNoteSaved(false), 1500);
  }

  return (
    <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <div>
            <div className="modal-title">{period}</div>
            <div className="modal-subtitle">{displayDate}</div>
          </div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          <p className="modal-section-label">Attending</p>
          <div className="visitor-toggles">
            {KNOWN_VISITORS.map(name => {
              const active = visitors.includes(name);
              return (
                <button
                  key={name}
                  className={`visitor-toggle ${active ? 'visitor-toggle--active' : ''}`}
                  style={active ? getChipStyle(name) : {}}
                  onClick={() => canEdit && onToggleVisitor(date, period, name)}
                  disabled={!canEdit}
                >
                  {active ? '✓ ' : '+ '}{name}
                </button>
              );
            })}
          </div>

          <p className="modal-section-label">Unavailable</p>
          <div className="visitor-toggles">
            {KNOWN_VISITORS.map(name => {
              const active = unavailable.includes(name);
              return (
                <button
                  key={name}
                  className={`visitor-toggle ${active ? 'visitor-toggle--unavailable' : ''}`}
                  onClick={() => canEdit && onToggleUnavailable(date, period, name)}
                  disabled={!canEdit}
                >
                  {active ? '✗ ' : '– '}{name}
                </button>
              );
            })}
          </div>

          <p className="modal-section-label">Note</p>
          <textarea
            className="slot-note"
            value={note}
            onChange={e => setNote(e.target.value)}
            onBlur={handleNoteBlur}
            placeholder={canEdit ? 'Add a note…' : 'No note'}
            readOnly={!canEdit}
            rows={3}
          />
          {noteSaved && <span className="save-indicator">Saved</span>}
        </div>

        <div className="modal-footer">
          <button className="btn btn--secondary" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}
