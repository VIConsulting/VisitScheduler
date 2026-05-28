import { useState } from 'react';
import { getUsers } from '../lib/storage.js';
import { createUser, resetPassword, setUserActive, updateUser } from '../lib/auth.js';

function generateTempPassword() {
  return Math.random().toString(36).slice(2, 10) + Math.random().toString(36).slice(2, 6).toUpperCase();
}

const ROLE_LABELS = { admin: 'Admin', editor: 'Editor', viewer: 'Viewer' };

export default function UserManager({ currentUsername }) {
  const [users, setUsers] = useState(() => getUsers());
  const [form, setForm] = useState({ username: '', password: '', role: 'viewer' });
  const [formError, setFormError] = useState('');
  const [tempPwd, setTempPwd] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ username: '', role: 'viewer' });
  const [editError, setEditError] = useState('');

  function refresh() {
    setUsers(getUsers());
  }

  async function handleCreate(e) {
    e.preventDefault();
    setFormError('');
    setLoading(true);
    const result = await createUser(form.username.trim(), form.password, form.role);
    setLoading(false);
    if (!result.ok) { setFormError('Username already exists.'); return; }
    setForm({ username: '', password: '', role: 'viewer' });
    refresh();
  }

  async function handleResetPassword(user) {
    const pwd = generateTempPassword();
    await resetPassword(user.id, pwd);
    setTempPwd({ username: user.username, password: pwd });
    refresh();
  }

  function handleToggleActive(user) {
    if (user.username === currentUsername) return;
    setUserActive(user.id, !user.active);
    refresh();
  }

  function startEdit(user) {
    setEditingId(user.id);
    setEditForm({ username: user.username, role: user.role });
    setEditError('');
  }

  function cancelEdit() {
    setEditingId(null);
    setEditError('');
  }

  function handleSaveEdit(userId) {
    if (!editForm.username.trim()) { setEditError('Username cannot be empty.'); return; }
    const result = updateUser(userId, editForm);
    if (!result.ok) { setEditError('That username is already taken.'); return; }
    setEditingId(null);
    refresh();
  }

  return (
    <div className="admin-section">
      <h3>Users</h3>

      {tempPwd && (
        <div className="temp-pwd-banner">
          <strong>Temporary password for {tempPwd.username}:</strong>{' '}
          <code>{tempPwd.password}</code>{' '}
          <span className="temp-pwd-note">(shown once — copy it now)</span>
          <button className="btn btn--ghost btn--sm" onClick={() => setTempPwd(null)}>✕</button>
        </div>
      )}

      <table className="user-table">
        <thead>
          <tr>
            <th>Username</th>
            <th>Role</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <>
              <tr key={u.id} className={!u.active ? 'row--inactive' : ''}>
                <td>{u.username}</td>
                <td><span className={`role-badge role-badge--${u.role}`}>{ROLE_LABELS[u.role]}</span></td>
                <td>
                  <span className={`status-badge ${u.active ? 'status-badge--active' : 'status-badge--inactive'}`}>
                    {u.active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="actions-cell">
                  <button
                    className="btn btn--ghost btn--sm"
                    onClick={() => editingId === u.id ? cancelEdit() : startEdit(u)}
                  >
                    {editingId === u.id ? 'Cancel' : 'Edit'}
                  </button>
                  <button
                    className="btn btn--ghost btn--sm"
                    onClick={() => handleResetPassword(u)}
                  >
                    Reset Password
                  </button>
                  <button
                    className="btn btn--ghost btn--sm"
                    onClick={() => handleToggleActive(u)}
                    disabled={u.username === currentUsername}
                    title={u.username === currentUsername ? 'Cannot deactivate your own account' : ''}
                  >
                    {u.active ? 'Deactivate' : 'Reactivate'}
                  </button>
                </td>
              </tr>

              {editingId === u.id && (
                <tr key={`${u.id}-edit`} className="edit-row">
                  <td colSpan={4}>
                    <div className="edit-row-form">
                      <div className="field">
                        <label>Username</label>
                        <input
                          type="text"
                          value={editForm.username}
                          onChange={e => setEditForm(f => ({ ...f, username: e.target.value }))}
                        />
                      </div>
                      <div className="field">
                        <label>Role</label>
                        <select
                          value={editForm.role}
                          onChange={e => setEditForm(f => ({ ...f, role: e.target.value }))}
                          disabled={u.username === currentUsername}
                          title={u.username === currentUsername ? 'Cannot change your own role' : ''}
                        >
                          <option value="viewer">Viewer</option>
                          <option value="editor">Editor</option>
                          <option value="admin">Admin</option>
                        </select>
                      </div>
                      <button className="btn btn--primary btn--sm" onClick={() => handleSaveEdit(u.id)}>
                        Save
                      </button>
                      <button className="btn btn--ghost btn--sm" onClick={cancelEdit}>
                        Cancel
                      </button>
                      {editError && <span className="field-error">{editError}</span>}
                    </div>
                  </td>
                </tr>
              )}
            </>
          ))}
        </tbody>
      </table>

      <h4>Create New User</h4>
      <form onSubmit={handleCreate} className="create-user-form">
        <div className="form-row">
          <div className="field">
            <label>Username</label>
            <input
              type="text"
              value={form.username}
              onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
              required
              disabled={loading}
            />
          </div>
          <div className="field">
            <label>Password</label>
            <input
              type="password"
              value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              required
              minLength={6}
              disabled={loading}
            />
          </div>
          <div className="field">
            <label>Role</label>
            <select
              value={form.role}
              onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
              disabled={loading}
            >
              <option value="viewer">Viewer</option>
              <option value="editor">Editor</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <button type="submit" className="btn btn--primary" disabled={loading}>
            {loading ? 'Creating…' : 'Create User'}
          </button>
        </div>
        {formError && <div className="field-error">{formError}</div>}
      </form>
    </div>
  );
}
