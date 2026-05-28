import { useState, useEffect, useCallback } from 'react';
import ScheduleGrid from './ScheduleGrid.jsx';
import Legend from './Legend.jsx';
import { apiGetSchedule, apiUpdateSlot } from '../lib/api.js';
import { slotKey } from '../lib/schedule.js';

const MONTH_NAMES = ['January','February','March','April','May','June',
  'July','August','September','October','November','December'];

export default function ScheduleView({ session, onLogout, onAdmin }) {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [scheduleData, setScheduleData] = useState({});
  const [loadingSchedule, setLoadingSchedule] = useState(true);

  const canEdit = session.role === 'admin' || session.role === 'editor';

  const fetchSchedule = useCallback(async () => {
    setLoadingSchedule(true);
    const data = await apiGetSchedule();
    setScheduleData(data || {});
    setLoadingSchedule(false);
  }, []);

  useEffect(() => { fetchSchedule(); }, [fetchSchedule]);

  function prevMonth() {
    if (month === 0) { setYear(y => y - 1); setMonth(11); }
    else setMonth(m => m - 1);
  }
  function nextMonth() {
    if (month === 11) { setYear(y => y + 1); setMonth(0); }
    else setMonth(m => m + 1);
  }
  function goToday() { setYear(now.getFullYear()); setMonth(now.getMonth()); }

  async function handleToggleVisitor(date, period, name) {
    const key = slotKey(date, period);
    const slot = scheduleData[key] || { visitors: [], note: '' };
    const newSlot = {
      ...slot,
      visitors: slot.visitors.includes(name)
        ? slot.visitors.filter(v => v !== name)
        : [...slot.visitors, name],
    };
    setScheduleData(prev => ({ ...prev, [key]: newSlot }));
    await apiUpdateSlot(date, period, newSlot);
  }

  async function handleSetNote(date, period, note) {
    const key = slotKey(date, period);
    const slot = scheduleData[key] || { visitors: [], note: '' };
    const newSlot = { ...slot, note };
    setScheduleData(prev => ({ ...prev, [key]: newSlot }));
    await apiUpdateSlot(date, period, newSlot);
  }

  return (
    <div className="app-layout">
      <header className="app-header">
        <div className="header-left">
          <span className="header-logo">🏠</span>
          <span className="header-title">Visit Scheduler</span>
        </div>
        <div className="header-right">
          <span className="header-user">👤 {session.username}</span>
          {session.role === 'admin' && (
            <button className="btn btn--ghost" onClick={onAdmin}>Admin</button>
          )}
          <button className="btn btn--ghost" onClick={onLogout}>Sign out</button>
        </div>
      </header>

      <div className="schedule-controls">
        <div className="month-nav">
          <button className="btn btn--icon" onClick={prevMonth}>‹</button>
          <h2 className="month-label">{MONTH_NAMES[month]} {year}</h2>
          <button className="btn btn--icon" onClick={nextMonth}>›</button>
        </div>
        <button className="btn btn--secondary btn--sm" onClick={goToday}>Today</button>
      </div>

      <Legend />

      <div className="schedule-wrapper">
        {loadingSchedule ? (
          <div className="schedule-loading"><div className="loading-spinner" /></div>
        ) : (
          <ScheduleGrid
            year={year}
            month={month}
            scheduleData={scheduleData}
            canEdit={canEdit}
            onToggleVisitor={handleToggleVisitor}
            onSetNote={handleSetNote}
          />
        )}
      </div>
    </div>
  );
}
