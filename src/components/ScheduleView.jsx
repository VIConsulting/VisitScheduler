import { useState } from 'react';
import ScheduleGrid from './ScheduleGrid.jsx';
import Legend from './Legend.jsx';

const MONTH_NAMES = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
];

export default function ScheduleView({ session, onLogout, onAdmin }) {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [tick, setTick] = useState(0); // force re-render on data change

  const canEdit = session.role === 'admin' || session.role === 'editor';

  function prevMonth() {
    if (month === 0) { setYear(y => y - 1); setMonth(11); }
    else setMonth(m => m - 1);
  }

  function nextMonth() {
    if (month === 11) { setYear(y => y + 1); setMonth(0); }
    else setMonth(m => m + 1);
  }

  function goToday() {
    setYear(now.getFullYear());
    setMonth(now.getMonth());
  }

  return (
    <div className="app-layout">
      <header className="app-header">
        <div className="header-left">
          <span className="header-logo">🏠</span>
          <span className="header-title">NxtGen Staff</span>
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
        <ScheduleGrid
          key={`${year}-${month}-${tick}`}
          year={year}
          month={month}
          canEdit={canEdit}
          onDataChange={() => setTick(t => t + 1)}
        />
      </div>
    </div>
  );
}
