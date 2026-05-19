import React, { useEffect, useMemo, useState } from 'react';
import { apiJson } from '../api';
import type { Vendor, VendorRateCard } from '../types';

type VendorsResponse = { vendors: Vendor[] };
type RateCardsResponse = { vendor: Vendor; rate_cards: VendorRateCard[] };

const vendorTypes: Vendor['vendor_type'][] = ['carrier', 'shipping_line', 'agent', 'warehouse', 'other'];
const statuses: Vendor['status'][] = ['active', 'inactive'];
const laneTypes: VendorRateCard['lane_type'][] = ['FCL', 'LCL', 'Air', 'Road_FTL', 'Road_LTL'];
const currencies: VendorRateCard['currency'][] = ['AED', 'USD', 'SAR'];

function toArray(value: string) {
  return value
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

export default function VendorsPage() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedVendorId, setSelectedVendorId] = useState<string | null>(null);
  const selectedVendor = useMemo(() => vendors.find((v) => v.id === selectedVendorId) || null, [vendors, selectedVendorId]);

  const [rateCards, setRateCards] = useState<VendorRateCard[]>([]);
  const [rateCardsLoading, setRateCardsLoading] = useState(false);

  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);
  const [showVendorForm, setShowVendorForm] = useState(false);

  const [newRateCard, setNewRateCard] = useState({
    lane_type: 'Road_FTL' as VendorRateCard['lane_type'],
    origin_country: '',
    origin_city: '',
    destination_country: '',
    destination_city: '',
    currency: 'AED' as VendorRateCard['currency'],
    base_rate: '',
    min_charge: '',
    valid_from: '',
    valid_to: '',
    notes: '',
  });

  async function refresh() {
    setLoading(true);
    setError(null);
    try {
      const data = await apiJson<VendorsResponse>('/vendors');
      setVendors(data.vendors || []);
      if (selectedVendorId && !(data.vendors || []).some((v) => v.id === selectedVendorId)) {
        setSelectedVendorId(null);
        setRateCards([]);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load vendors');
    } finally {
      setLoading(false);
    }
  }

  async function loadRateCards(vendorId: string) {
    setRateCardsLoading(true);
    setError(null);
    try {
      const data = await apiJson<RateCardsResponse>(`/vendors/${vendorId}/rate-cards`);
      setRateCards(data.rate_cards || []);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load rate cards');
    } finally {
      setRateCardsLoading(false);
    }
  }

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function submitVendor(form: {
    vendor_name: string;
    vendor_type: Vendor['vendor_type'];
    contact_person: string;
    email: string;
    phone: string;
    whatsapp: string;
    address: string;
    country: string;
    countries_supported: string;
    status: Vendor['status'];
    notes: string;
  }) {
    setError(null);
    try {
      const payload = {
        vendor_name: form.vendor_name,
        vendor_type: form.vendor_type,
        contact_person: form.contact_person || null,
        email: form.email || null,
        phone: form.phone || null,
        whatsapp: form.whatsapp || null,
        address: form.address || null,
        country: form.country || null,
        countries_supported: form.countries_supported ? toArray(form.countries_supported) : null,
        status: form.status,
        notes: form.notes || null,
      };

      if (editingVendor) {
        await apiJson<{ vendor: Vendor }>(`/vendors/${editingVendor.id}`, {
          method: 'PATCH',
          body: JSON.stringify(payload),
        });
      } else {
        await apiJson<{ vendor: Vendor }>(`/vendors`, {
          method: 'POST',
          body: JSON.stringify(payload),
        });
      }

      setShowVendorForm(false);
      setEditingVendor(null);
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to save vendor');
    }
  }

  async function submitRateCard() {
    if (!selectedVendorId) return;
    setError(null);
    try {
      await apiJson<{ rate_card: VendorRateCard }>(`/vendors/${selectedVendorId}/rate-cards`, {
        method: 'POST',
        body: JSON.stringify({
          lane_type: newRateCard.lane_type,
          origin_country: newRateCard.origin_country || null,
          origin_city: newRateCard.origin_city || null,
          destination_country: newRateCard.destination_country || null,
          destination_city: newRateCard.destination_city || null,
          currency: newRateCard.currency,
          base_rate: Number(newRateCard.base_rate || 0),
          min_charge: newRateCard.min_charge ? Number(newRateCard.min_charge) : null,
          valid_from: newRateCard.valid_from || null,
          valid_to: newRateCard.valid_to || null,
          notes: newRateCard.notes || null,
        }),
      });

      setNewRateCard({
        lane_type: 'Road_FTL',
        origin_country: '',
        origin_city: '',
        destination_country: '',
        destination_city: '',
        currency: 'AED',
        base_rate: '',
        min_charge: '',
        valid_from: '',
        valid_to: '',
        notes: '',
      });

      await loadRateCards(selectedVendorId);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to add rate card');
    }
  }

  return (
    <div>
      <div className="flex items-end justify-between">
        <div>
          <div className="text-2xl font-semibold">Vendors</div>
          <div className="mt-1 text-sm text-white/60">Create vendors and maintain their price lists (rate cards)</div>
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
              setEditingVendor(null);
              setShowVendorForm(true);
            }}
            className="btn-primary"
          >
            New Vendor
          </button>
        </div>
      </div>

      {error && <div className="mt-4 rounded-lg border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-100">{error}</div>}

      <div className="mt-6 grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-1 rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
          <div className="px-5 py-4 border-b border-white/10">
            <div className="font-semibold">Vendor List</div>
            <div className="text-sm text-white/60">Select a vendor to manage rate cards</div>
          </div>
          <div className="p-3">
            {loading ? (
              <div className="text-white/70 p-3">Loading…</div>
            ) : vendors.length === 0 ? (
              <div className="text-white/60 p-3 text-sm">No vendors yet</div>
            ) : (
              <div className="space-y-2">
                {vendors.map((v) => {
                  const active = v.id === selectedVendorId;
                  return (
                    <button
                      key={v.id}
                      onClick={() => {
                        setSelectedVendorId(v.id);
                        loadRateCards(v.id);
                      }}
                      className={[
                        'w-full text-left rounded-xl border px-4 py-3 transition-colors',
                        active ? 'border-primary-500/40 bg-primary-500/10' : 'border-white/10 bg-secondary-900/30 hover:bg-secondary-900/40',
                      ].join(' ')}
                    >
                      <div className="flex items-center justify-between">
                        <div className="font-semibold">{v.vendor_name}</div>
                        <div className="text-xs text-white/60">{v.status}</div>
                      </div>
                      <div className="mt-1 text-xs text-white/60">{v.vendor_type}</div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="xl:col-span-2 space-y-6">
          <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
            <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
              <div>
                <div className="font-semibold">Vendor Details</div>
                <div className="text-sm text-white/60">Edit vendor info and manage rate cards</div>
              </div>
              <button
                disabled={!selectedVendor}
                onClick={() => {
                  if (!selectedVendor) return;
                  setEditingVendor(selectedVendor);
                  setShowVendorForm(true);
                }}
                className="inline-flex items-center justify-center rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold hover:bg-white/10 transition-colors disabled:opacity-50"
              >
                Edit
              </button>
            </div>
            <div className="p-5">
              {!selectedVendor ? (
                <div className="text-white/60 text-sm">Select a vendor to view details.</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="rounded-xl border border-white/10 bg-secondary-900/40 p-4">
                    <div className="text-xs text-white/60">Contact</div>
                    <div className="mt-1 text-sm">{selectedVendor.contact_person || '—'}</div>
                    <div className="mt-2 text-xs text-white/60">Email</div>
                    <div className="mt-1 text-sm break-all">{selectedVendor.email || '—'}</div>
                    <div className="mt-2 text-xs text-white/60">Phone / WhatsApp</div>
                    <div className="mt-1 text-sm">{selectedVendor.phone || '—'} {selectedVendor.whatsapp ? ` / ${selectedVendor.whatsapp}` : ''}</div>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-secondary-900/40 p-4">
                    <div className="text-xs text-white/60">Coverage</div>
                    <div className="mt-1 text-sm">{selectedVendor.country || '—'}</div>
                    <div className="mt-2 text-xs text-white/60">Countries Supported</div>
                    <div className="mt-1 text-sm">{selectedVendor.countries_supported && selectedVendor.countries_supported.length ? selectedVendor.countries_supported.join(', ') : '—'}</div>
                    <div className="mt-2 text-xs text-white/60">Address</div>
                    <div className="mt-1 text-sm">{selectedVendor.address || '—'}</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
            <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
              <div>
                <div className="font-semibold">Vendor Price List (Rate Cards)</div>
                <div className="text-sm text-white/60">Add rates by lane type and route</div>
              </div>
            </div>

            <div className="p-5">
              {!selectedVendorId ? (
                <div className="text-white/60 text-sm">Select a vendor first.</div>
              ) : (
                <>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-white/70">Lane Type</label>
                      <select
                        value={newRateCard.lane_type}
                        onChange={(e) => setNewRateCard((s) => ({ ...s, lane_type: e.target.value as VendorRateCard['lane_type'] }))}
                        className="mt-2 w-full rounded-lg bg-secondary-900/60 border border-white/10 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        {laneTypes.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-white/70">Currency</label>
                      <select
                        value={newRateCard.currency}
                        onChange={(e) => setNewRateCard((s) => ({ ...s, currency: e.target.value as VendorRateCard['currency'] }))}
                        className="mt-2 w-full rounded-lg bg-secondary-900/60 border border-white/10 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        {currencies.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-white/70">Base Rate</label>
                      <input
                        value={newRateCard.base_rate}
                        onChange={(e) => setNewRateCard((s) => ({ ...s, base_rate: e.target.value }))}
                        className="mt-2 w-full rounded-lg bg-secondary-900/60 border border-white/10 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-white/70">Origin Country / City</label>
                      <div className="mt-2 grid grid-cols-2 gap-2">
                        <input
                          value={newRateCard.origin_country}
                          onChange={(e) => setNewRateCard((s) => ({ ...s, origin_country: e.target.value }))}
                          className="w-full rounded-lg bg-secondary-900/60 border border-white/10 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                          placeholder="UAE"
                        />
                        <input
                          value={newRateCard.origin_city}
                          onChange={(e) => setNewRateCard((s) => ({ ...s, origin_city: e.target.value }))}
                          className="w-full rounded-lg bg-secondary-900/60 border border-white/10 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                          placeholder="Dubai"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-white/70">Destination Country / City</label>
                      <div className="mt-2 grid grid-cols-2 gap-2">
                        <input
                          value={newRateCard.destination_country}
                          onChange={(e) => setNewRateCard((s) => ({ ...s, destination_country: e.target.value }))}
                          className="w-full rounded-lg bg-secondary-900/60 border border-white/10 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                          placeholder="KSA"
                        />
                        <input
                          value={newRateCard.destination_city}
                          onChange={(e) => setNewRateCard((s) => ({ ...s, destination_city: e.target.value }))}
                          className="w-full rounded-lg bg-secondary-900/60 border border-white/10 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                          placeholder="Riyadh"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-white/70">Valid From / To</label>
                      <div className="mt-2 grid grid-cols-2 gap-2">
                        <input
                          type="date"
                          value={newRateCard.valid_from}
                          onChange={(e) => setNewRateCard((s) => ({ ...s, valid_from: e.target.value }))}
                          className="w-full rounded-lg bg-secondary-900/60 border border-white/10 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                        <input
                          type="date"
                          value={newRateCard.valid_to}
                          onChange={(e) => setNewRateCard((s) => ({ ...s, valid_to: e.target.value }))}
                          className="w-full rounded-lg bg-secondary-900/60 border border-white/10 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                      </div>
                    </div>
                    <div className="lg:col-span-3">
                      <label className="block text-xs font-semibold text-white/70">Notes</label>
                      <input
                        value={newRateCard.notes}
                        onChange={(e) => setNewRateCard((s) => ({ ...s, notes: e.target.value }))}
                        className="mt-2 w-full rounded-lg bg-secondary-900/60 border border-white/10 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="Optional"
                      />
                    </div>
                  </div>

                  <div className="mt-4 flex justify-end">
                    <button onClick={submitRateCard} className="btn-primary">
                      Add Rate
                    </button>
                  </div>

                  <div className="mt-6">
                    {rateCardsLoading ? (
                      <div className="text-white/70">Loading rate cards…</div>
                    ) : rateCards.length === 0 ? (
                      <div className="text-white/60 text-sm">No rate cards yet</div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                          <thead className="text-white/70">
                            <tr>
                              <th className="text-left font-semibold py-2">Lane</th>
                              <th className="text-left font-semibold py-2">Route</th>
                              <th className="text-left font-semibold py-2">Rate</th>
                              <th className="text-left font-semibold py-2">Validity</th>
                            </tr>
                          </thead>
                          <tbody>
                            {rateCards.map((rc) => (
                              <tr key={rc.id} className="border-t border-white/10">
                                <td className="py-2">{rc.lane_type}</td>
                                <td className="py-2 text-white/80">
                                  {(rc.origin_city || rc.origin_country || '—') + ' → ' + (rc.destination_city || rc.destination_country || '—')}
                                </td>
                                <td className="py-2">{rc.currency} {rc.base_rate}</td>
                                <td className="py-2 text-white/70">{rc.valid_from || '—'} {rc.valid_to ? `→ ${rc.valid_to}` : ''}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {showVendorForm && (
        <VendorForm
          initial={editingVendor}
          onClose={() => {
            setShowVendorForm(false);
            setEditingVendor(null);
          }}
          onSubmit={submitVendor}
        />
      )}
    </div>
  );
}

function VendorForm({
  initial,
  onClose,
  onSubmit,
}: {
  initial: Vendor | null;
  onClose: () => void;
  onSubmit: (v: {
    vendor_name: string;
    vendor_type: Vendor['vendor_type'];
    contact_person: string;
    email: string;
    phone: string;
    whatsapp: string;
    address: string;
    country: string;
    countries_supported: string;
    status: Vendor['status'];
    notes: string;
  }) => void;
}) {
  const [form, setForm] = useState({
    vendor_name: initial?.vendor_name || '',
    vendor_type: (initial?.vendor_type || 'other') as Vendor['vendor_type'],
    contact_person: initial?.contact_person || '',
    email: initial?.email || '',
    phone: initial?.phone || '',
    whatsapp: initial?.whatsapp || '',
    address: initial?.address || '',
    country: initial?.country || '',
    countries_supported: initial?.countries_supported ? initial.countries_supported.join(', ') : '',
    status: (initial?.status || 'active') as Vendor['status'],
    notes: initial?.notes || '',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl rounded-2xl border border-white/10 bg-secondary-900 shadow-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
          <div className="font-semibold">{initial ? 'Edit Vendor' : 'New Vendor'}</div>
          <button onClick={onClose} className="text-white/70 hover:text-white">Close</button>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-white/70">Vendor Name</label>
            <input
              value={form.vendor_name}
              onChange={(e) => setForm((s) => ({ ...s, vendor_name: e.target.value }))}
              className="mt-2 w-full rounded-lg bg-secondary-900/60 border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Vendor name"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-white/70">Vendor Type</label>
            <select
              value={form.vendor_type}
              onChange={(e) => setForm((s) => ({ ...s, vendor_type: e.target.value as Vendor['vendor_type'] }))}
              className="mt-2 w-full rounded-lg bg-secondary-900/60 border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {vendorTypes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-white/70">Status</label>
            <select
              value={form.status}
              onChange={(e) => setForm((s) => ({ ...s, status: e.target.value as Vendor['status'] }))}
              className="mt-2 w-full rounded-lg bg-secondary-900/60 border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {statuses.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
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
              placeholder="email@vendor.com"
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

          <div>
            <label className="block text-xs font-semibold text-white/70">WhatsApp</label>
            <input
              value={form.whatsapp}
              onChange={(e) => setForm((s) => ({ ...s, whatsapp: e.target.value }))}
              className="mt-2 w-full rounded-lg bg-secondary-900/60 border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="WhatsApp"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-white/70">Country</label>
            <input
              value={form.country}
              onChange={(e) => setForm((s) => ({ ...s, country: e.target.value }))}
              className="mt-2 w-full rounded-lg bg-secondary-900/60 border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="UAE"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-white/70">Countries Supported (comma-separated)</label>
            <input
              value={form.countries_supported}
              onChange={(e) => setForm((s) => ({ ...s, countries_supported: e.target.value }))}
              className="mt-2 w-full rounded-lg bg-secondary-900/60 border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="UAE, KSA, Qatar"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-white/70">Address</label>
            <input
              value={form.address}
              onChange={(e) => setForm((s) => ({ ...s, address: e.target.value }))}
              className="mt-2 w-full rounded-lg bg-secondary-900/60 border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Address"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-white/70">Notes</label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm((s) => ({ ...s, notes: e.target.value }))}
              className="mt-2 w-full min-h-24 rounded-lg bg-secondary-900/60 border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Notes"
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
