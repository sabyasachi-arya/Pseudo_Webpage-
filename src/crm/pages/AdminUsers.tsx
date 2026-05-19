import React, { useEffect, useMemo, useState } from 'react';
import { apiJson } from '../api';
import type { AdminUser, Role } from '../types';

type UsersResponse = { users: AdminUser[] };

const roles: Role[] = ['admin', 'sales', 'operations', 'accountant'];

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const selectedUser = useMemo(() => users.find((u) => u.id === selectedUserId) || null, [users, selectedUserId]);

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<AdminUser | null>(null);

  async function refresh() {
    setLoading(true);
    setError(null);
    try {
      const data = await apiJson<UsersResponse>('/admin/users');
      setUsers(data.users || []);
      if (selectedUserId && !(data.users || []).some((u) => u.id === selectedUserId)) {
        setSelectedUserId(null);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load users');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function submit(form: { email: string; full_name: string; role: Role; password: string }) {
    setError(null);
    try {
      if (editing) {
        await apiJson<{ user: AdminUser }>(`/admin/users/${editing.id}`, {
          method: 'PATCH',
          body: JSON.stringify({
            full_name: form.full_name,
            role: form.role,
            password: form.password || undefined,
          }),
        });
      } else {
        await apiJson<{ user: AdminUser }>(`/admin/users`, {
          method: 'POST',
          body: JSON.stringify({
            email: form.email,
            full_name: form.full_name,
            role: form.role,
            password: form.password,
          }),
        });
      }

      setShowForm(false);
      setEditing(null);
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to save user');
    }
  }

  return (
    <div>
      <div className="flex items-end justify-between">
        <div>
          <div className="text-2xl font-semibold">User Management</div>
          <div className="mt-1 text-sm text-white/60">Create users and assign roles (admin-only)</div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={refresh}
            className="inline-flex items-center justify-center rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold hover:bg-white/10 transition-colors"
          >
            Refresh
          </button>
          <button
            onClick={() => {
              setEditing(null);
              setShowForm(true);
            }}
            className="btn-primary"
          >
            New User
          </button>
        </div>
      </div>

      {error && <div className="mt-4 rounded-lg border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-100">{error}</div>}

      <div className="mt-6 grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-1 rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
          <div className="px-5 py-4 border-b border-white/10">
            <div className="font-semibold">Users</div>
            <div className="text-sm text-white/60">Select a user to edit</div>
          </div>
          <div className="p-3">
            {loading ? (
              <div className="text-white/70 p-3">Loading…</div>
            ) : users.length === 0 ? (
              <div className="text-white/60 p-3 text-sm">No users</div>
            ) : (
              <div className="space-y-2">
                {users.map((u) => {
                  const active = u.id === selectedUserId;
                  return (
                    <button
                      key={u.id}
                      onClick={() => setSelectedUserId(u.id)}
                      className={[
                        'w-full text-left rounded-xl border px-4 py-3 transition-colors',
                        active ? 'border-primary-500/40 bg-primary-500/10' : 'border-white/10 bg-secondary-900/30 hover:bg-secondary-900/40',
                      ].join(' ')}
                    >
                      <div className="flex items-center justify-between">
                        <div className="font-semibold break-all">{u.email}</div>
                        <div className="text-xs text-white/60">{u.role}</div>
                      </div>
                      <div className="mt-1 text-xs text-white/60">{u.full_name}</div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="xl:col-span-2 rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
          <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
            <div>
              <div className="font-semibold">User Details</div>
              <div className="text-sm text-white/60">Update name, role, and password</div>
            </div>
            <button
              disabled={!selectedUser}
              onClick={() => {
                if (!selectedUser) return;
                setEditing(selectedUser);
                setShowForm(true);
              }}
              className="inline-flex items-center justify-center rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold hover:bg-white/10 transition-colors disabled:opacity-50"
            >
              Edit
            </button>
          </div>
          <div className="p-5">
            {!selectedUser ? (
              <div className="text-white/60 text-sm">Select a user to view details.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-xl border border-white/10 bg-secondary-900/40 p-4">
                  <div className="text-xs text-white/60">Email</div>
                  <div className="mt-1 text-sm break-all">{selectedUser.email}</div>
                  <div className="mt-2 text-xs text-white/60">Name</div>
                  <div className="mt-1 text-sm">{selectedUser.full_name}</div>
                </div>
                <div className="rounded-xl border border-white/10 bg-secondary-900/40 p-4">
                  <div className="text-xs text-white/60">Role</div>
                  <div className="mt-1 text-sm">{selectedUser.role}</div>
                  <div className="mt-2 text-xs text-white/60">Created</div>
                  <div className="mt-1 text-sm">{new Date(selectedUser.created_at).toLocaleString()}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {showForm && <UserForm initial={editing} onClose={() => { setShowForm(false); setEditing(null); }} onSubmit={submit} />}
    </div>
  );
}

function UserForm({
  initial,
  onClose,
  onSubmit,
}: {
  initial: AdminUser | null;
  onClose: () => void;
  onSubmit: (v: { email: string; full_name: string; role: Role; password: string }) => void;
}) {
  const [form, setForm] = useState({
    email: initial?.email || '',
    full_name: initial?.full_name || '',
    role: (initial?.role || 'sales') as Role,
    password: '',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl rounded-2xl border border-white/10 bg-secondary-900 shadow-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
          <div className="font-semibold">{initial ? 'Edit User' : 'New User'}</div>
          <button onClick={onClose} className="text-white/70 hover:text-white">Close</button>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-white/70">Email</label>
            <input
              value={form.email}
              onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))}
              disabled={!!initial}
              className="mt-2 w-full rounded-lg bg-secondary-900/60 border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-60"
              placeholder="user@ajiva.com"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-white/70">Full Name</label>
            <input
              value={form.full_name}
              onChange={(e) => setForm((s) => ({ ...s, full_name: e.target.value }))}
              className="mt-2 w-full rounded-lg bg-secondary-900/60 border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Full name"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-white/70">Role</label>
            <select
              value={form.role}
              onChange={(e) => setForm((s) => ({ ...s, role: e.target.value as Role }))}
              className="mt-2 w-full rounded-lg bg-secondary-900/60 border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {roles.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-white/70">{initial ? 'New Password (optional)' : 'Password'}</label>
            <input
              value={form.password}
              onChange={(e) => setForm((s) => ({ ...s, password: e.target.value }))}
              type="password"
              className="mt-2 w-full rounded-lg bg-secondary-900/60 border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder={initial ? 'Leave blank to keep existing password' : 'Password'}
            />
          </div>
        </div>

        <div className="px-6 py-4 border-t border-white/10 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="inline-flex items-center justify-center rounded-lg border border-white/10 bg-white/0 px-4 py-2 text-sm font-semibold text-white/90 hover:bg-white/5 transition-colors"
          >
            Cancel
          </button>
          <button onClick={() => onSubmit(form)} className="btn-primary">
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
