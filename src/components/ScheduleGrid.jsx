import { useState } from 'react';
import { weeksInMonth, DAY_LABELS, PERIODS, slotKey } from '../lib/schedule.js';
import { getChipStyle } from '../lib/colours.js';
import SlotModal from './SlotModal.jsx';

function SlotCell({ slot, period, canEdit, onClick }) {
  const visitors = slot?.visitors || [];
  const unavailable = slot?.unavailable || [];
  return (
    <div className={`slot-cell ${canEdit ? 'slot-cell--editable' : ''}`} onClick={onClick}>
      <span className="slot-period">{period}</span>
      <div className="slot-chips">
        {visitors.map(v => (
          <span key={v} className="chip" style={getChipStyle(v)}>{v}</span>
        ))}
        {unavailable.map(v => (
          <span key={v} className="chip chip--unavailable">✗ {v}</span>
        ))}
      </div>
      {slot?.note && <div className="slot-note-preview" title={slot.note}>📝</div>}
    </div>
  );
}

export default function ScheduleGrid({ year, month, scheduleData, canEdit, onToggleVisitor, onToggleUnavailable, onSetNote }) {
  const [modal, setModal] = useState(null);
  const _t = new Date();
  const today = `${_t.getFullYear()}-${String(_t.getMonth()+1).padStart(2,'0')}-${String(_t.getDate()).padStart(2,'0')}`;
  const weeks = weeksInMonth(year, month);

  return (
    <>
      <div className="schedule-grid">
        <div className="grid-header">
          {DAY_LABELS.map(d => <div key={d} className="grid-header-cell">{d}</div>)}
        </div>

        {weeks.map((week, wi) => (
          <div key={wi} className="grid-week">
            {week.map((date, di) => (
              <div key={di} className={`grid-day ${date === today ? 'grid-day--today' : ''} ${!date ? 'grid-day--empty' : ''}`}>
                {date && (
                  <>
                    <div className="grid-day-number">{new Date(date + 'T00:00:00').getDate()}</div>
                    <div className="grid-slots">
                      {PERIODS.map(p => (
                        <SlotCell
                          key={p}
                          slot={scheduleData[slotKey(date, p)]}
                          period={p}
                          canEdit={canEdit}
                          onClick={() => setModal({ date, period: p })}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>

      {modal && (
        <SlotModal
          date={modal.date}
          period={modal.period}
          slot={scheduleData[slotKey(modal.date, modal.period)] || { visitors: [], unavailable: [], note: '' }}
          canEdit={canEdit}
          onClose={() => setModal(null)}
          onToggleVisitor={onToggleVisitor}
          onToggleUnavailable={onToggleUnavailable}
          onSetNote={onSetNote}
        />
      )}
    </>
  );
}
