import { useState } from 'react';
import { weeksInMonth, DAY_LABELS, PERIODS, slotKey } from '../lib/schedule.js';
import { getChipStyle } from '../lib/colours.js';
import SlotModal from './SlotModal.jsx';

// Returns banners that overlap this week, with their grid-column positions (1-indexed)
function getBannersForWeek(week, unavailability) {
  const banners = [];
  for (const entry of Object.values(unavailability)) {
    let startCol = -1, endCol = -1;
    for (let i = 0; i < 7; i++) {
      if (week[i] && week[i] >= entry.startDate && week[i] <= entry.endDate) {
        if (startCol === -1) startCol = i;
        endCol = i;
      }
    }
    if (startCol !== -1) {
      banners.push({ ...entry, startCol: startCol + 1, endCol: endCol + 1 });
    }
  }
  // Sort so banners for the same person group together visually
  return banners.sort((a, b) => a.startCol - b.startCol || a.name.localeCompare(b.name));
}

function BannerRow({ week, unavailability, canEdit, onDelete }) {
  const banners = getBannersForWeek(week, unavailability);
  if (banners.length === 0) return null;

  return (
    <div className="banner-row">
      {banners.map(b => {
        const style = getChipStyle(b.name);
        const text = b.label ? `${b.name} — ${b.label}` : b.name;
        return (
          <div
            key={b.id}
            className="banner"
            style={{ gridColumn: `${b.startCol} / ${b.endCol + 1}`, background: style.backgroundColor, color: style.color }}
            title={text + (canEdit ? ' — click to remove' : '')}
            onClick={() => canEdit && onDelete(b.id)}
          >
            <span className="banner-text">{text}</span>
            {canEdit && <span className="banner-remove">✕</span>}
          </div>
        );
      })}
    </div>
  );
}

function SlotCell({ slot, period, canEdit, onClick }) {
  return (
    <div className={`slot-cell ${canEdit ? 'slot-cell--editable' : ''}`} onClick={onClick}>
      <span className="slot-period">{period}</span>
      <div className="slot-chips">
        {(slot?.visitors || []).map(v => (
          <span key={v} className="chip" style={getChipStyle(v)}>{v}</span>
        ))}
      </div>
      {slot?.note && <div className="slot-note-preview" title={slot.note}>📝</div>}
    </div>
  );
}

export default function ScheduleGrid({ year, month, scheduleData, unavailability, canEdit, onToggleVisitor, onSetNote, onDeleteUnavailability }) {
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
          <div key={wi} className="grid-week-wrapper">
            <BannerRow
              week={week}
              unavailability={unavailability}
              canEdit={canEdit}
              onDelete={onDeleteUnavailability}
            />
            <div className="grid-week">
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
          </div>
        ))}
      </div>

      {modal && (
        <SlotModal
          date={modal.date}
          period={modal.period}
          slot={scheduleData[slotKey(modal.date, modal.period)] || { visitors: [], note: '' }}
          canEdit={canEdit}
          onClose={() => setModal(null)}
          onToggleVisitor={onToggleVisitor}
          onSetNote={onSetNote}
        />
      )}
    </>
  );
}
