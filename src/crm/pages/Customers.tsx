import React, { useEffect, useMemo, useState } from 'react';
import { apiJson } from '../api';
import type { Customer } from '../types';

type CustomersResponse = { customers: Customer[] };

const regions: Customer['region'][] = ['GCC', 'China', 'India', 'Africa', 'International'];

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const selectedCustomer = useMemo(
    () => customers.find((c) => c.id === selectedCustomerId) || null,
    [customers, selectedCustomerId],
  );

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Customer | null>(null);

  async function refresh() {
    setLoading(true);
    setError(null);
    try {
      const data = await apiJson<CustomersResponse>('/customers');
      setCustomers(data.customers || []);
      if (selectedCustomerId && !(data.customers || []).some((c) => c.id === selectedCustomerId)) {
        setSelectedCustomerId(null);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load customers');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function submit(form: {
    company_name: string;
    contact_person: string;
    email: string;
    phone: string;
    region: Customer['region'];
    tax_id: string;
  }) {
    setError(null);
    try {
      const payload = {
        company_name: form.company_name,
        contact_person: form.contact_person || null,
        email: form.email || null,
        phone: form.phone || null,
        region: form.region,
        tax_id: form.tax_id || null,
      };

      if (editing) {
        await apiJson<{ customer: Customer }>(`/customers/${editing.id}`, { method: 'PATCH', body: JSON.stringify(payload) });
      } else {
        await apiJson<{ customer: Customer }>(`/customers`, { method: 'POST', body: JSON.stringify(payload) });
      }

      setShowForm(false);
      setEditing(null);
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to save customer');
    }
  }

  return (
    <div>
      <div className="flex items-end justify-between">
        <div>
          <div className="text-2xl font-semibold">Customers</div>
          <div className="mt-1 text-sm text-white/60">Manage customer accounts and contact details</div>
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
            New Customer
          </button>
        </div>
      </div>

      {error && <div className="mt-4 rounded-lg border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-100">{error}</div>}

      <div className="mt-6 grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-1 rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
          <div className="px-5 py-4 border-b border-white/10">
            <div className="font-semibold">Customer List</div>
            <div className="text-sm text-white/60">Select a customer to view details</div>
          </div>
          <div className="p-3">
            {loading ? (
              <div className="text-white/70 p-3">Loading…</div>
            ) : customers.length === 0 ? (
              <div className="text-white/60 p-3 text-sm">No customers yet</div>
            ) : (
              <div className="space-y-2">
                {customers.map((c) => {
                  const active = c.id === selectedCustomerId;
                  return (
                    <button
                      key={c.id}
                      onClick={() => setSelectedCustomerId(c.id)}
                      className={[
                        'w-full text-left rounded-xl border px-4 py-3 transition-colors',
                        active ? 'border-primary-500/40 bg-primary-500/10' : 'border-white/10 bg-secondary-900/30 hover:bg-secondary-900/40',
                      ].join(' ')}
                    >
                      <div className="flex items-center justify-between">
                        <div className="font-semibold">{c.company_name}</div>
                        <div className="text-xs text-white/60">{c.region}</div>
                      </div>
                      <div className="mt-1 text-xs text-white/60">{c.contact_person || '—'}</div>
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
              <div className="font-semibold">Customer Details</div>
              <div className="text-sm text-white/60">View and update customer details</div>
            </div>
            <button
              disabled={!selectedCustomer}
              onClick={() => {
                if (!selectedCustomer) return;
                setEditing(selectedCustomer);
                setShowForm(true);
              }}
              className="inline-flex items-center justify-center rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold hover:bg-white/10 transition-colors disabled:opacity-50"
            >
              Edit
            </button>
          </div>
          <div className="p-5">
            {!selectedCustomer ? (
              <div className="text-white/60 text-sm">Select a customer to view details.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-xl border border-white/10 bg-secondary-900/40 p-4">
                  <div className="text-xs text-white/60">Contact</div>
                  <div className="mt-1 text-sm">{selectedCustomer.contact_person || '—'}</div>
                  <div className="mt-2 text-xs text-white/60">Email</div>
                  <div className="mt-1 text-sm break-all">{selectedCustomer.email || '—'}</div>
                  <div className="mt-2 text-xs text-white/60">Phone</div>
                  <div className="mt-1 text-sm">{selectedCustomer.phone || '—'}</div>
                </div>
                <div className="rounded-xl border border-white/10 bg-secondary-900/40 p-4">
                  <div className="text-xs text-white/60">Region</div>
                  <div className="mt-1 text-sm">{selectedCustomer.region}</div>
                  <div className="mt-2 text-xs text-white/60">Tax ID</div>
                  <div className="mt-1 text-sm">{selectedCustomer.tax_id || '—'}</div>
                  <div className="mt-2 text-xs text-white/60">Assigned To</div>
                  <div className="mt-1 text-sm">{selectedCustomer.assigned_to || '—'}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {showForm && <CustomerForm initial={editing} onClose={() => { setShowForm(false); setEditing(null); }} onSubmit={submit} />}
    </div>
  );
}

function CustomerForm({
  initial,
  onClose,
  onSubmit,
}: {
  initial: Customer | null;
  onClose: () => void;
  onSubmit: (v: {
    company_name: string;
    contact_person: string;
    email: string;
    phone: string;
    region: Customer['region'];
    tax_id: string;
  }) => void;
}) {
  const [form, setForm] = useState({
    company_name: initial?.company_name || '',
    contact_person: initial?.contact_person || '',
    email: initial?.email || '',
    phone: initial?.phone || '',
    region: (initial?.region || 'International') as Customer['region'],
    tax_id: initial?.tax_id || '',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl rounded-2xl border border-white/10 bg-secondary-900 shadow-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
          <div className="font-semibold">{initial ? 'Edit Customer' : 'New Customer'}</div>
          <button onClick={onClose} className="text-white/70 hover:text-white">Close</button>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-white/70">Company Name</label>
            <input
              value={form.company_name}
              onChange={(e) => setForm((s) => ({ ...s, company_name: e.target.value }))}
              className="mt-2 w-full rounded-lg bg-secondary-900/60 border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Company name"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-white/70">Region</label>
            <select
              value={form.region}
              onChange={(e) => setForm((s) => ({ ...s, region: e.target.value as Customer['region'] }))}
              className="mt-2 w-full rounded-lg bg-secondary-900/60 border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {regions.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-white/70">Tax ID</label>
            <input
              value={form.tax_id}
              onChange={(e) => setForm((s) => ({ ...s, tax_id: e.target.value }))}
              className="mt-2 w-full rounded-lg bg-secondary-900/60 border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Optional"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-white/70">Contact Person</label>
            <input
              value={form.contact_person}
              onChange={(e) => setForm((s) => ({ ...s, contact_person: e.target.value }))}
              className="mt-2 w-full rounded-lg bg-secondary-900/60 border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Name"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-white/70">Email</label>
            <input
              value={form.email}
              onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))}
              className="mt-2 w-full rounded-lg bg-secondary-900/60 border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="email@company.com"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-white/70">Phone</label>
            <input
              value={form.phone}
              onChange={(e) => setForm((s) => ({ ...s, phone: e.target.value }))}
              className="mt-2 w-full rounded-lg bg-secondary-900/60 border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Phone"
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
