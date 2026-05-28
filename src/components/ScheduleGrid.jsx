import { useState } from 'react';
import { weeksInMonth, DAY_LABELS, PERIODS, getSlot, addVisitor, removeVisitor, setNote } from '../lib/schedule.js';
import { getChipStyle } from '../lib/colours.js';
import SlotModal from './SlotModal.jsx';

function VisitorChip({ name }) {
  const style = getChipStyle(name);
  return <span className="chip" style={style}>{name}</span>;
}

function SlotCell({ date, period, canEdit, onClick }) {
  const slot = getSlot(date, period);
  return (
    <div
      className={`slot-cell ${canEdit ? 'slot-cell--editable' : ''}`}
      onClick={() => onClick(date, period)}
    >
      <span className="slot-period">{period}</span>
      <div className="slot-chips">
        {slot.visitors.map(v => <VisitorChip key={v} name={v} />)}
      </div>
      {slot.note && <div className="slot-note-preview" title={slot.note}>📝</div>}
    </div>
  );
}

export default function ScheduleGrid({ year, month, canEdit, onDataChange }) {
  const [modal, setModal] = useState(null); // { date, period }
  const today = new Date().toISOString().slice(0, 10);
  const weeks = weeksInMonth(year, month);

  function openModal(date, period) {
    setModal({ date, period });
  }

  function closeModal() {
    setModal(null);
    onDataChange();
  }

  function handleToggleVisitor(date, period, name) {
    const slot = getSlot(date, period);
    if (slot.visitors.includes(name)) {
      removeVisitor(date, period, name);
    } else {
      addVisitor(date, period, name);
    }
    onDataChange();
  }

  function handleSetNote(date, period, note) {
    setNote(date, period, note);
    onDataChange();
  }

  return (
    <>
      <div className="schedule-grid">
        {/* Header row */}
        <div className="grid-header">
          {DAY_LABELS.map(d => (
            <div key={d} className="grid-header-cell">{d}</div>
          ))}
        </div>

        {/* Week rows */}
        {weeks.map((week, wi) => (
          <div key={wi} className="grid-week">
            {week.map((date, di) => (
              <div
                key={di}
                className={`grid-day ${date === today ? 'grid-day--today' : ''} ${!date ? 'grid-day--empty' : ''}`}
              >
                {date && (
                  <>
                    <div className="grid-day-number">
                      {new Date(date + 'T00:00:00').getDate()}
                    </div>
                    <div className="grid-slots">
                      {PERIODS.map(p => (
                        <SlotCell
                          key={p}
                          date={date}
                          period={p}
                          canEdit={canEdit}
                          onClick={openModal}
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
          canEdit={canEdit}
          onClose={closeModal}
          onToggleVisitor={handleToggleVisitor}
          onSetNote={handleSetNote}
        />
      )}
    </>
  );
}
