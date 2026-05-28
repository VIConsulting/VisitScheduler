import { useState } from 'react';
import UserManager from './UserManager.jsx';
import ScheduleDataTab from './ScheduleDataTab.jsx';

export default function AdminPortal({ session, onClose }) {
  const [tab, setTab] = useState('users');

  return (
    <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal modal--wide">
        <div className="modal-header">
          <div>
            <div className="modal-title">Admin Portal</div>
            <div className="modal-subtitle">Signed in as {session.username}</div>
          </div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="tab-bar">
          <button
            className={`tab-btn ${tab === 'users' ? 'tab-btn--active' : ''}`}
            onClick={() => setTab('users')}
          >
            Users
          </button>
          <button
            className={`tab-btn ${tab === 'data' ? 'tab-btn--active' : ''}`}
            onClick={() => setTab('data')}
          >
            Schedule Data
          </button>
        </div>

        <div className="modal-body modal-body--scroll">
          {tab === 'users' && <UserManager currentUsername={session.username} />}
          {tab === 'data' && <ScheduleDataTab />}
        </div>
      </div>
    </div>
  );
}
