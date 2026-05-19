import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_BASE_DEFAULT = '/api';

function normalizeBase(base: string) {
  return base.endsWith('/') ? base.slice(0, -1) : base;
}

function getApiBase() {
  return normalizeBase(process.env.REACT_APP_API_BASE || API_BASE_DEFAULT);
}

function getToken() {
  return localStorage.getItem('ajiva_token');
}

function clearToken() {
  localStorage.removeItem('ajiva_token');
}

type MeResponse = {
  user: { id: string; email: string; full_name: string; role: string; created_at: string };
};

type Shipment = {
  id: string;
  tracking_number: string;
  current_status: string;
  carrier_name: string | null;
  estimated_delivery: string | null;
  actual_delivery: string | null;
};

export default function Crm() {
  const navigate = useNavigate();
  const [me, setMe] = useState<MeResponse['user'] | null>(null);
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);

  const grouped = useMemo(() => {
    const buckets: Record<string, Shipment[]> = {
      booked: [],
      at_origin: [],
      in_transit: [],
      customs_clearance: [],
      out_for_delivery: [],
      delivered: [],
    };
    shipments.forEach((s) => {
      (buckets[s.current_status] || (buckets[s.current_status] = [])).push(s);
    });
    return buckets;
  }, [shipments]);

  async function fetchMeAndData() {
    const token = getToken();
    if (!token) {
      navigate('/login?from=/crm', { replace: true });
      return;
    }

    try {
      const meRes = await fetch(`${getApiBase()}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!meRes.ok) {
        clearToken();
        navigate('/login?from=/crm', { replace: true });
        return;
      }
      const meData: MeResponse = await meRes.json();
      setMe(meData.user);

      const sRes = await fetch(`${getApiBase()}/shipments`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const sData = await sRes.json();
      setShipments(sData.shipments || []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchMeAndData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function logout() {
    clearToken();
    navigate('/');
  }

  return (
    <div className="min-h-screen bg-secondary-900 text-white">
      <div className="border-b border-white/10 bg-secondary-900/80 backdrop-blur-sm">
        <div className="container-custom py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-600 flex items-center justify-center">
              <span className="font-bold">AG</span>
            </div>
            <div className="leading-tight">
              <div className="font-semibold">Ajiva Global CRM</div>
              <div className="text-xs text-white/70">Deal-to-Shipment Workflow</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {me && (
              <div className="hidden sm:block text-right">
                <div className="text-sm font-medium">{me.full_name}</div>
                <div className="text-xs text-white/60">{me.role}</div>
              </div>
            )}
            <button onClick={logout} className="inline-flex items-center justify-center rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold hover:bg-white/10 transition-colors">
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="container-custom py-8">
        {loading ? (
          <div className="text-white/70">Loading CRM…</div>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <div className="text-sm text-white/70">Active Shipments</div>
                <div className="mt-2 text-3xl font-semibold">{shipments.length}</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <div className="text-sm text-white/70">In Transit</div>
                <div className="mt-2 text-3xl font-semibold">{(grouped.in_transit || []).length}</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <div className="text-sm text-white/70">Customs Clearance</div>
                <div className="mt-2 text-3xl font-semibold">{(grouped.customs_clearance || []).length}</div>
              </div>
            </div>

            <div className="mt-8">
              <div className="flex items-end justify-between">
                <div>
                  <div className="text-xl font-semibold">Shipment Kanban</div>
                  <div className="text-sm text-white/60">Booked → In Transit → Delivered</div>
                </div>
                <button
                  onClick={() => fetchMeAndData()}
                  className="inline-flex items-center justify-center rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold hover:bg-white/10 transition-colors"
                >
                  Refresh
                </button>
              </div>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {Object.entries(grouped).map(([status, items]) => (
                  <div key={status} className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
                    <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
                      <div className="text-sm font-semibold capitalize">{status.replaceAll('_', ' ')}</div>
                      <div className="text-xs text-white/60">{items.length}</div>
                    </div>
                    <div className="p-3 space-y-3">
                      {items.slice(0, 8).map((s) => (
                        <div key={s.id} className="rounded-xl border border-white/10 bg-secondary-900/40 p-3">
                          <div className="text-sm font-semibold">{s.tracking_number}</div>
                          <div className="mt-1 text-xs text-white/60">
                            {s.carrier_name ? `Carrier: ${s.carrier_name}` : 'Carrier: —'}
                          </div>
                        </div>
                      ))}
                      {items.length === 0 && <div className="text-xs text-white/50">No shipments</div>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
