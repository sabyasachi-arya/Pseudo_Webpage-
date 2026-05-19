import React, { useEffect, useMemo, useState } from 'react';
import { apiFetch } from '../api';
import type { Shipment } from '../types';

export default function Dashboard() {
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

  async function refresh() {
    setLoading(true);
    try {
      const res = await apiFetch('/shipments');
      const data = await res.json();
      setShipments(data.shipments || []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <div className="flex items-end justify-between">
        <div>
          <div className="text-2xl font-semibold">Dashboard</div>
          <div className="mt-1 text-sm text-white/60">Active shipments, quotes, and operations overview</div>
        </div>
        <button
          onClick={refresh}
          className="inline-flex items-center justify-center rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold hover:bg-white/10 transition-colors"
        >
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="mt-6 text-white/70">Loading…</div>
      ) : (
        <>
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
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

          <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
            <div className="px-5 py-4 border-b border-white/10">
              <div className="font-semibold">Shipments by Status</div>
              <div className="text-sm text-white/60">Booked → In Transit → Delivered</div>
            </div>
            <div className="p-5 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {Object.entries(grouped).map(([status, items]) => (
                <div key={status} className="rounded-2xl border border-white/10 bg-secondary-900/40 overflow-hidden">
                  <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
                    <div className="text-sm font-semibold capitalize">{status.replaceAll('_', ' ')}</div>
                    <div className="text-xs text-white/60">{items.length}</div>
                  </div>
                  <div className="p-3 space-y-3">
                    {items.slice(0, 5).map((s) => (
                      <div key={s.id} className="rounded-xl border border-white/10 bg-secondary-900/40 p-3">
                        <div className="text-sm font-semibold">{s.tracking_number}</div>
                        <div className="mt-1 text-xs text-white/60">{s.carrier_name ? `Carrier: ${s.carrier_name}` : 'Carrier: —'}</div>
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
  );
}
