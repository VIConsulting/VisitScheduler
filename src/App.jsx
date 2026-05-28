import { useState, useEffect } from 'react';
import { currentSession, logout } from './lib/auth.js';
import LoginPage from './components/LoginPage.jsx';
import ScheduleView from './components/ScheduleView.jsx';
import AdminPortal from './components/AdminPortal.jsx';

export default function App() {
  const [session, setSession] = useState(null);
  const [ready, setReady] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);

  useEffect(() => {
    currentSession().then(s => {
      setSession(s);
      setReady(true);
    });
  }, []);

  async function handleLogin(user) {
    setSession(user);
  }

  async function handleLogout() {
    await logout();
    setSession(null);
    setShowAdmin(false);
  }

  if (!ready) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner" />
      </div>
    );
  }

  if (!session) return <LoginPage onLogin={handleLogin} />;

  return (
    <>
      <ScheduleView session={session} onLogout={handleLogout} onAdmin={() => setShowAdmin(true)} />
      {showAdmin && session.role === 'admin' && (
        <AdminPortal session={session} onClose={() => setShowAdmin(false)} />
      )}
    </>
  );
}
