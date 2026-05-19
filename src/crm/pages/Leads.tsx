import React, { useEffect, useMemo, useState } from 'react';
import { apiJson } from '../api';
import type { Lead, LeadActivity } from '../types';

type LeadsResponse = { leads: Lead[] };
type LeadActivitiesResponse = { lead: Lead; activities: LeadActivity[] };

const statuses: Lead['outreach_status'][] = ['new', 'contacted', 'responded', 'qualified', 'lost'];
const regions: Lead['region'][] = ['GCC', 'China', 'India', 'Africa', 'International'];
const activityTypes: LeadActivity['activity_type'][] = ['call', 'whatsapp', 'email', 'meeting', 'note'];

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const selectedLead = useMemo(() => leads.find((l) => l.id === selectedLeadId) || null, [leads, selectedLeadId]);

  const [activities, setActivities] = useState<LeadActivity[]>([]);
  const [activitiesLoading, setActivitiesLoading] = useState(false);

  const [showLeadForm, setShowLeadForm] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);

  const [newActivity, setNewActivity] = useState({
    activity_type: 'note' as LeadActivity['activity_type'],
    notes: '',
  });

  async function refresh() {
    setLoading(true);
    setError(null);
    try {
      const data = await apiJson<LeadsResponse>('/leads');
      setLeads(data.leads || []);
      if (selectedLeadId && !(data.leads || []).some((l) => l.id === selectedLeadId)) {
        setSelectedLeadId(null);
        setActivities([]);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load leads');
    } finally {
      setLoading(false);
    }
  }

  async function loadActivities(leadId: string) {
    setActivitiesLoading(true);
    setError(null);
    try {
      const data = await apiJson<LeadActivitiesResponse>(`/leads/${leadId}/activities`);
      setActivities(data.activities || []);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load lead activities');
    } finally {
      setActivitiesLoading(false);
    }
  }

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function submitLead(form: {
    company_name: string;
    contact_person: string;
    email: string;
    phone: string;
    region: Lead['region'];
    source: string;
    outreach_status: Lead['outreach_status'];
    response_summary: string;
    last_contacted_at: string;
    next_follow_up_at: string;
  }) {
    setError(null);
    try {
      const payload = {
        company_name: form.company_name,
        contact_person: form.contact_person || null,
        email: form.email || null,
        phone: form.phone || null,
        region: form.region,
        source: form.source || null,
        outreach_status: form.outreach_status,
        response_summary: form.response_summary || null,
        last_contacted_at: form.last_contacted_at || null,
        next_follow_up_at: form.next_follow_up_at || null,
      };

      if (editingLead) {
        await apiJson<{ lead: Lead }>(`/leads/${editingLead.id}`, {
          method: 'PATCH',
          body: JSON.stringify(payload),
        });
      } else {
        await apiJson<{ lead: Lead }>(`/leads`, {
          method: 'POST',
          body: JSON.stringify(payload),
        });
      }

      setShowLeadForm(false);
      setEditingLead(null);
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to save lead');
    }
  }

  async function submitActivity() {
    if (!selectedLeadId) return;
    setError(null);
    try {
      await apiJson<{ activity: LeadActivity }>(`/leads/${selectedLeadId}/activities`, {
        method: 'POST',
        body: JSON.stringify({
          activity_type: newActivity.activity_type,
          notes: newActivity.notes || null,
        }),
      });
      setNewActivity({ activity_type: 'note', notes: '' });
      await loadActivities(selectedLeadId);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to add activity');
    }
  }

  return (
    <div>
      <div className="flex items-end justify-between">
        <div>
          <div className="text-2xl font-semibold">Leads</div>
          <div className="mt-1 text-sm text-white/60">Track outreach status, responses, and follow-ups</div>
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
              setEditingLead(null);
              setShowLeadForm(true);
            }}
            className="btn-primary"
          >
            New Lead
          </button>
        </div>
      </div>

      {error && <div className="mt-4 rounded-lg border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-100">{error}</div>}

      <div className="mt-6 grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-1 rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
          <div className="px-5 py-4 border-b border-white/10">
            <div className="font-semibold">Lead List</div>
            <div className="text-sm text-white/60">Select a lead to view outreach activities</div>
          </div>
          <div className="p-3">
            {loading ? (
              <div className="text-white/70 p-3">Loading…</div>
            ) : leads.length === 0 ? (
              <div className="text-white/60 p-3 text-sm">No leads yet</div>
            ) : (
              <div className="space-y-2">
                {leads.map((l) => {
                  const active = l.id === selectedLeadId;
                  return (
                    <button
                      key={l.id}
                      onClick={() => {
                        setSelectedLeadId(l.id);
                        loadActivities(l.id);
                      }}
                      className={[
                        'w-full text-left rounded-xl border px-4 py-3 transition-colors',
                        active ? 'border-primary-500/40 bg-primary-500/10' : 'border-white/10 bg-secondary-900/30 hover:bg-secondary-900/40',
                      ].join(' ')}
                    >
                      <div className="flex items-center justify-between">
                        <div className="font-semibold">{l.company_name}</div>
                        <div className="text-xs text-white/60">{l.outreach_status}</div>
                      </div>
                      <div className="mt-1 text-xs text-white/60">{l.contact_person || '—'}</div>
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
                <div className="font-semibold">Lead Details</div>
                <div className="text-sm text-white/60">Update status and response info</div>
              </div>
              <button
                disabled={!selectedLead}
                onClick={() => {
                  if (!selectedLead) return;
                  setEditingLead(selectedLead);
                  setShowLeadForm(true);
                }}
                className="inline-flex items-center justify-center rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold hover:bg-white/10 transition-colors disabled:opacity-50"
              >
                Edit
              </button>
            </div>
            <div className="p-5">
              {!selectedLead ? (
                <div className="text-white/60 text-sm">Select a lead to view details.</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="rounded-xl border border-white/10 bg-secondary-900/40 p-4">
                    <div className="text-xs text-white/60">Contact</div>
                    <div className="mt-1 text-sm">{selectedLead.contact_person || '—'}</div>
                    <div className="mt-2 text-xs text-white/60">Email</div>
                    <div className="mt-1 text-sm break-all">{selectedLead.email || '—'}</div>
                    <div className="mt-2 text-xs text-white/60">Phone</div>
                    <div className="mt-1 text-sm">{selectedLead.phone || '—'}</div>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-secondary-900/40 p-4">
                    <div className="text-xs text-white/60">Region</div>
                    <div className="mt-1 text-sm">{selectedLead.region}</div>
                    <div className="mt-2 text-xs text-white/60">Source</div>
                    <div className="mt-1 text-sm">{selectedLead.source || '—'}</div>
                    <div className="mt-2 text-xs text-white/60">Response Summary</div>
                    <div className="mt-1 text-sm">{selectedLead.response_summary || '—'}</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
            <div className="px-5 py-4 border-b border-white/10">
              <div className="font-semibold">Outreach Activities</div>
              <div className="text-sm text-white/60">Log calls, WhatsApp messages, emails, and notes</div>
            </div>
            <div className="p-5">
              {!selectedLeadId ? (
                <div className="text-white/60 text-sm">Select a lead first.</div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-white/70">Type</label>
                      <select
                        value={newActivity.activity_type}
                        onChange={(e) => setNewActivity((s) => ({ ...s, activity_type: e.target.value as LeadActivity['activity_type'] }))}
                        className="mt-2 w-full rounded-lg bg-secondary-900/60 border border-white/10 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        {activityTypes.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-semibold text-white/70">Notes</label>
                      <input
                        value={newActivity.notes}
                        onChange={(e) => setNewActivity((s) => ({ ...s, notes: e.target.value }))}
                        className="mt-2 w-full rounded-lg bg-secondary-900/60 border border-white/10 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="What happened? Any response?"
                      />
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <button onClick={submitActivity} className="btn-primary">
                      Add Activity
                    </button>
                  </div>

                  <div className="mt-6">
                    {activitiesLoading ? (
                      <div className="text-white/70">Loading activities…</div>
                    ) : activities.length === 0 ? (
                      <div className="text-white/60 text-sm">No activities yet</div>
                    ) : (
                      <div className="space-y-3">
                        {activities.map((a) => (
                          <div key={a.id} className="rounded-xl border border-white/10 bg-secondary-900/40 p-4">
                            <div className="flex items-center justify-between">
                              <div className="text-sm font-semibold">{a.activity_type}</div>
                              <div className="text-xs text-white/60">{new Date(a.created_at).toLocaleString()}</div>
                            </div>
                            <div className="mt-2 text-sm text-white/80">{a.notes || '—'}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {showLeadForm && (
        <LeadForm
          initial={editingLead}
          onClose={() => {
            setShowLeadForm(false);
            setEditingLead(null);
          }}
          onSubmit={submitLead}
        />
      )}
    </div>
  );
}

function LeadForm({
  initial,
  onClose,
  onSubmit,
}: {
  initial: Lead | null;
  onClose: () => void;
  onSubmit: (v: {
    company_name: string;
    contact_person: string;
    email: string;
    phone: string;
    region: Lead['region'];
    source: string;
    outreach_status: Lead['outreach_status'];
    response_summary: string;
    last_contacted_at: string;
    next_follow_up_at: string;
  }) => void;
}) {
  const [form, setForm] = useState({
    company_name: initial?.company_name || '',
    contact_person: initial?.contact_person || '',
    email: initial?.email || '',
    phone: initial?.phone || '',
    region: (initial?.region || 'International') as Lead['region'],
    source: initial?.source || '',
    outreach_status: (initial?.outreach_status || 'new') as Lead['outreach_status'],
    response_summary: initial?.response_summary || '',
    last_contacted_at: initial?.last_contacted_at ? initial.last_contacted_at.slice(0, 10) : '',
    next_follow_up_at: initial?.next_follow_up_at ? initial.next_follow_up_at.slice(0, 10) : '',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl rounded-2xl border border-white/10 bg-secondary-900 shadow-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
          <div className="font-semibold">{initial ? 'Edit Lead' : 'New Lead'}</div>
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
            <label className="block text-xs font-semibold text-white/70">Outreach Status</label>
            <select
              value={form.outreach_status}
              onChange={(e) => setForm((s) => ({ ...s, outreach_status: e.target.value as Lead['outreach_status'] }))}
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
            <label className="block text-xs font-semibold text-white/70">Region</label>
            <select
              value={form.region}
              onChange={(e) => setForm((s) => ({ ...s, region: e.target.value as Lead['region'] }))}
              className="mt-2 w-full rounded-lg bg-secondary-900/60 border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {regions.map((t) => (
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

          <div>
            <label className="block text-xs font-semibold text-white/70">Source</label>
            <input
              value={form.source}
              onChange={(e) => setForm((s) => ({ ...s, source: e.target.value }))}
              className="mt-2 w-full rounded-lg bg-secondary-900/60 border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="LinkedIn, Website, Referral"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-white/70">Last Contacted</label>
            <input
              type="date"
              value={form.last_contacted_at}
              onChange={(e) => setForm((s) => ({ ...s, last_contacted_at: e.target.value }))}
              className="mt-2 w-full rounded-lg bg-secondary-900/60 border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-white/70">Next Follow-up</label>
            <input
              type="date"
              value={form.next_follow_up_at}
              onChange={(e) => setForm((s) => ({ ...s, next_follow_up_at: e.target.value }))}
              className="mt-2 w-full rounded-lg bg-secondary-900/60 border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-white/70">Response Summary</label>
            <textarea
              value={form.response_summary}
              onChange={(e) => setForm((s) => ({ ...s, response_summary: e.target.value }))}
              className="mt-2 w-full min-h-24 rounded-lg bg-secondary-900/60 border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="What did the lead respond? Any requirements?"
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
