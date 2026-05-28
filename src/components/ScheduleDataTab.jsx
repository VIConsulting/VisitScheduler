import { useState, useRef } from 'react';
import { getSchedule, saveSchedule, clearSchedule } from '../lib/storage.js';

export default function ScheduleDataTab() {
  const [importError, setImportError] = useState('');
  const [importSuccess, setImportSuccess] = useState('');
  const [confirmClear, setConfirmClear] = useState(false);
  const fileRef = useRef();

  function handleExport() {
    const data = getSchedule();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `schedule-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleImport(e) {
    const file = e.target.files[0];
    if (!file) return;
    setImportError('');
    setImportSuccess('');
    const reader = new FileReader();
    reader.onload = ev => {
      try {
        const data = JSON.parse(ev.target.result);
        if (typeof data !== 'object' || Array.isArray(data)) throw new Error('Invalid format');
        saveSchedule(data);
        setImportSuccess(`Imported ${Object.keys(data).length} slot entries.`);
      } catch {
        setImportError('Invalid JSON file. Import cancelled.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  }

  function handleClear() {
    if (!confirmClear) { setConfirmClear(true); return; }
    clearSchedule();
    setConfirmClear(false);
    setImportSuccess('Schedule cleared.');
  }

  return (
    <div className="admin-section">
      <h3>Schedule Data</h3>

      <div className="data-action-group">
        <h4>Export</h4>
        <p>Download the current schedule as a JSON file for backup or transfer.</p>
        <button className="btn btn--primary" onClick={handleExport}>Export JSON</button>
      </div>

      <div className="data-action-group">
        <h4>Import</h4>
        <p>Import a previously exported JSON file. This will <strong>replace</strong> the current schedule.</p>
        <button className="btn btn--secondary" onClick={() => fileRef.current.click()}>Choose File…</button>
        <input ref={fileRef} type="file" accept=".json,application/json" style={{ display: 'none' }} onChange={handleImport} />
        {importError && <div className="field-error">{importError}</div>}
        {importSuccess && <div className="field-success">{importSuccess}</div>}
      </div>

      <div className="data-action-group">
        <h4>Clear All Data</h4>
        <p>Permanently remove all schedule entries. This cannot be undone.</p>
        {confirmClear ? (
          <div className="confirm-group">
            <span>Are you sure? This will delete all schedule data.</span>
            <button className="btn btn--danger" onClick={handleClear}>Yes, Clear Everything</button>
            <button className="btn btn--ghost" onClick={() => setConfirmClear(false)}>Cancel</button>
          </div>
        ) : (
          <button className="btn btn--danger" onClick={handleClear}>Clear Schedule</button>
        )}
      </div>
    </div>
  );
}
