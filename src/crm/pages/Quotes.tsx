import React, { useEffect, useMemo, useState } from 'react';
import { apiJson } from '../api';
import type { Customer, Quote } from '../types';

type QuotesResponse = { quotes: Quote[] };
type CustomersResponse = { customers: Customer[] };

const statuses: Quote['status'][] = ['draft', 'sent', 'approved', 'rejected'];

export default function QuotesPage() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedQuoteId, setSelectedQuoteId] = useState<string | null>(null);
  const selectedQuote = useMemo(() => quotes.find((q) => q.id === selectedQuoteId) || null, [quotes, selectedQuoteId]);

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Quote | null>(null);

  async function refresh() {
    setLoading(true);
    setError(null);
    try {
      const [q, c] = await Promise.all([apiJson<QuotesResponse>('/quotes'), apiJson<CustomersResponse>('/customers')]);
      setQuotes(q.quotes || []);
      setCustomers(c.customers || []);
      if (selectedQuoteId && !(q.quotes || []).some((x) => x.id === selectedQuoteId)) {
        setSelectedQuoteId(null);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load quotes');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function submit(form: {
    customer_id: string;
    origin_city: string;
    destination_city: string;
    cargo_type: string;
    total_amount: string;
    currency: string;
    status: Quote['status'];
    valid_until: string;
  }) {
    setError(null);
    try {
      const payload = {
        customer_id: form.customer_id,
        origin_city: form.origin_city,
        destination_city: form.destination_city,
        cargo_type: form.cargo_type,
        total_amount: form.total_amount ? Number(form.total_amount) : 0,
        currency: form.currency || 'AED',
        status: form.status,
        valid_until: form.valid_until || null,
      };

      if (editing) {
        await apiJson<{ quote: Quote }>(`/quotes/${editing.id}`, { method: 'PATCH', body: JSON.stringify(payload) });
      } else {
        await apiJson<{ quote: Quote }>(`/quotes`, { method: 'POST', body: JSON.stringify(payload) });
      }

      setShowForm(false);
      setEditing(null);
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to save quote');
    }
  }

  const selectedCustomer = useMemo(() => {
    if (!selectedQuote) return null;
    return customers.find((c) => c.id === selectedQuote.customer_id) || selectedQuote.customer || null;
  }, [customers, selectedQuote]);

  return (
    <div>
      <div className="flex items-end justify-between">
        <div>
          <div className="text-2xl font-semibold">Quotes</div>
          <div className="mt-1 text-sm text-white/60">Create and update quotes (approving a quote auto-creates a shipment)</div>
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
            New Quote
          </button>
        </div>
      </div>

      {error && <div className="mt-4 rounded-lg border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-100">{error}</div>}

      <div className="mt-6 grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-1 rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
          <div className="px-5 py-4 border-b border-white/10">
            <div className="font-semibold">Quote List</div>
            <div className="text-sm text-white/60">Select a quote to view details</div>
          </div>
          <div className="p-3">
            {loading ? (
              <div className="text-white/70 p-3">Loading…</div>
            ) : quotes.length === 0 ? (
              <div className="text-white/60 p-3 text-sm">No quotes yet</div>
            ) : (
              <div className="space-y-2">
                {quotes.map((q) => {
                  const active = q.id === selectedQuoteId;
                  const cust = customers.find((c) => c.id === q.customer_id) || q.customer;
                  return (
                    <button
                      key={q.id}
                      onClick={() => setSelectedQuoteId(q.id)}
                      className={[
                        'w-full text-left rounded-xl border px-4 py-3 transition-colors',
                        active ? 'border-primary-500/40 bg-primary-500/10' : 'border-white/10 bg-secondary-900/30 hover:bg-secondary-900/40',
                      ].join(' ')}
                    >
                      <div className="flex items-center justify-between">
                        <div className="font-semibold">{cust?.company_name || 'Customer'}</div>
                        <div className="text-xs text-white/60">{q.status}</div>
                      </div>
                      <div className="mt-1 text-xs text-white/60">{q.origin_city} → {q.destination_city}</div>
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
              <div className="font-semibold">Quote Details</div>
              <div className="text-sm text-white/60">View and update quote</div>
            </div>
            <button
              disabled={!selectedQuote}
              onClick={() => {
                if (!selectedQuote) return;
                setEditing(selectedQuote);
                setShowForm(true);
              }}
              className="inline-flex items-center justify-center rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold hover:bg-white/10 transition-colors disabled:opacity-50"
            >
              Edit
            </button>
          </div>
          <div className="p-5">
            {!selectedQuote ? (
              <div className="text-white/60 text-sm">Select a quote to view details.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-xl border border-white/10 bg-secondary-900/40 p-4">
                  <div className="text-xs text-white/60">Customer</div>
                  <div className="mt-1 text-sm">{selectedCustomer?.company_name || selectedQuote.customer_id}</div>
                  <div className="mt-2 text-xs text-white/60">Route</div>
                  <div className="mt-1 text-sm">{selectedQuote.origin_city} → {selectedQuote.destination_city}</div>
                  <div className="mt-2 text-xs text-white/60">Cargo</div>
                  <div className="mt-1 text-sm">{selectedQuote.cargo_type}</div>
                </div>
                <div className="rounded-xl border border-white/10 bg-secondary-900/40 p-4">
                  <div className="text-xs text-white/60">Amount</div>
                  <div className="mt-1 text-sm">{selectedQuote.currency} {selectedQuote.total_amount}</div>
                  <div className="mt-2 text-xs text-white/60">Status</div>
                  <div className="mt-1 text-sm">{selectedQuote.status}</div>
                  <div className="mt-2 text-xs text-white/60">Valid Until</div>
                  <div className="mt-1 text-sm">{selectedQuote.valid_until ? selectedQuote.valid_until.slice(0, 10) : '—'}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {showForm && (
        <QuoteForm
          initial={editing}
          customers={customers}
          onClose={() => {
            setShowForm(false);
            setEditing(null);
          }}
          onSubmit={submit}
        />
      )}
    </div>
  );
}

function QuoteForm({
  initial,
  customers,
  onClose,
  onSubmit,
}: {
  initial: Quote | null;
  customers: Customer[];
  onClose: () => void;
  onSubmit: (v: {
    customer_id: string;
    origin_city: string;
    destination_city: string;
    cargo_type: string;
    total_amount: string;
    currency: string;
    status: Quote['status'];
    valid_until: string;
  }) => void;
}) {
  const [form, setForm] = useState({
    customer_id: initial?.customer_id || (customers[0]?.id || ''),
    origin_city: initial?.origin_city || '',
    destination_city: initial?.destination_city || '',
    cargo_type: initial?.cargo_type || '',
    total_amount: initial?.total_amount ? String(initial.total_amount) : '0',
    currency: initial?.currency || 'AED',
    status: (initial?.status || 'draft') as Quote['status'],
    valid_until: initial?.valid_until ? initial.valid_until.slice(0, 10) : '',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl rounded-2xl border border-white/10 bg-secondary-900 shadow-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
          <div className="font-semibold">{initial ? 'Edit Quote' : 'New Quote'}</div>
          <button onClick={onClose} className="text-white/70 hover:text-white">Close</button>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-white/70">Customer</label>
            <select
              value={form.customer_id}
              onChange={(e) => setForm((s) => ({ ...s, customer_id: e.target.value }))}
              className="mt-2 w-full rounded-lg bg-secondary-900/60 border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.company_name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-white/70">Origin City</label>
            <input
              value={form.origin_city}
              onChange={(e) => setForm((s) => ({ ...s, origin_city: e.target.value }))}
              className="mt-2 w-full rounded-lg bg-secondary-900/60 border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Dubai"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-white/70">Destination City</label>
            <input
              value={form.destination_city}
              onChange={(e) => setForm((s) => ({ ...s, destination_city: e.target.value }))}
              className="mt-2 w-full rounded-lg bg-secondary-900/60 border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Riyadh"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-white/70">Cargo Type</label>
            <input
              value={form.cargo_type}
              onChange={(e) => setForm((s) => ({ ...s, cargo_type: e.target.value }))}
              className="mt-2 w-full rounded-lg bg-secondary-900/60 border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="FCL / LCL / Air / Road"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-white/70">Status</label>
            <select
              value={form.status}
              onChange={(e) => setForm((s) => ({ ...s, status: e.target.value as Quote['status'] }))}
              className="mt-2 w-full rounded-lg bg-secondary-900/60 border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {statuses.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-white/70">Currency</label>
            <input
              value={form.currency}
              onChange={(e) => setForm((s) => ({ ...s, currency: e.target.value }))}
              className="mt-2 w-full rounded-lg bg-secondary-900/60 border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="AED"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-white/70">Total Amount</label>
            <input
              value={form.total_amount}
              onChange={(e) => setForm((s) => ({ ...s, total_amount: e.target.value }))}
              className="mt-2 w-full rounded-lg bg-secondary-900/60 border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="0"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-white/70">Valid Until</label>
            <input
              type="date"
              value={form.valid_until}
              onChange={(e) => setForm((s) => ({ ...s, valid_until: e.target.value }))}
              className="mt-2 w-full rounded-lg bg-secondary-900/60 border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
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
