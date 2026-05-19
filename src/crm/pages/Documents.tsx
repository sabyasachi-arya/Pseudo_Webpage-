import React, { useState } from 'react';
import { apiJson } from '../api';
import type { ShipmentDocument } from '../types';

type DocumentsResponse = { documents: ShipmentDocument[] };

export default function DocumentsPage() {
  const [shipmentId, setShipmentId] = useState('');
  const [documents, setDocuments] = useState<ShipmentDocument[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [newDoc, setNewDoc] = useState({ doc_type: '', file_url: '' });

  async function load() {
    if (!shipmentId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await apiJson<DocumentsResponse>(`/shipments/${shipmentId}/documents`);
      setDocuments(data.documents || []);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load documents');
    } finally {
      setLoading(false);
    }
  }

  async function upload() {
    if (!shipmentId) return;
    setError(null);
    try {
      await apiJson<{ document: ShipmentDocument }>(`/shipments/${shipmentId}/documents`, {
        method: 'POST',
        body: JSON.stringify({ doc_type: newDoc.doc_type, file_url: newDoc.file_url }),
      });
      setNewDoc({ doc_type: '', file_url: '' });
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to upload document');
    }
  }

  return (
    <div>
      <div>
        <div className="text-2xl font-semibold">Documents</div>
        <div className="mt-1 text-sm text-white/60">Upload and view shipment documents</div>
      </div>

      {error && <div className="mt-4 rounded-lg border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-100">{error}</div>}

      <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
        <div className="px-5 py-4 border-b border-white/10">
          <div className="font-semibold">Find Shipment</div>
          <div className="text-sm text-white/60">Enter a shipment ID to list/upload documents</div>
        </div>
        <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-white/70">Shipment ID</label>
            <input
              value={shipmentId}
              onChange={(e) => setShipmentId(e.target.value)}
              className="mt-2 w-full rounded-lg bg-secondary-900/60 border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Paste shipment UUID"
            />
          </div>
          <div className="flex gap-3">
            <button
              onClick={load}
              className="inline-flex w-full items-center justify-center rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold hover:bg-white/10 transition-colors"
            >
              Load
            </button>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
        <div className="px-5 py-4 border-b border-white/10">
          <div className="font-semibold">Upload Document</div>
          <div className="text-sm text-white/60">Requires admin/operations role</div>
        </div>
        <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
          <div>
            <label className="block text-xs font-semibold text-white/70">Doc Type</label>
            <input
              value={newDoc.doc_type}
              onChange={(e) => setNewDoc((s) => ({ ...s, doc_type: e.target.value }))}
              className="mt-2 w-full rounded-lg bg-secondary-900/60 border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="invoice / BL / packing_list"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-white/70">File URL</label>
            <input
              value={newDoc.file_url}
              onChange={(e) => setNewDoc((s) => ({ ...s, file_url: e.target.value }))}
              className="mt-2 w-full rounded-lg bg-secondary-900/60 border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="https://..."
            />
          </div>
          <div className="md:col-span-3 flex justify-end">
            <button onClick={upload} className="btn-primary">
              Upload
            </button>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
        <div className="px-5 py-4 border-b border-white/10">
          <div className="font-semibold">Documents</div>
          <div className="text-sm text-white/60">{shipmentId ? `Shipment: ${shipmentId}` : 'No shipment selected'}</div>
        </div>
        <div className="p-5">
          {loading ? (
            <div className="text-white/70">Loading…</div>
          ) : documents.length === 0 ? (
            <div className="text-white/60 text-sm">No documents</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="text-white/70">
                  <tr>
                    <th className="text-left font-semibold py-2">Type</th>
                    <th className="text-left font-semibold py-2">URL</th>
                    <th className="text-left font-semibold py-2">Uploaded</th>
                  </tr>
                </thead>
                <tbody>
                  {documents.map((d) => (
                    <tr key={d.id} className="border-t border-white/10">
                      <td className="py-2">{d.doc_type}</td>
                      <td className="py-2">
                        <a href={d.file_url} target="_blank" rel="noreferrer" className="text-primary-300 hover:text-primary-200 break-all">
                          {d.file_url}
                        </a>
                      </td>
                      <td className="py-2 text-white/70">{new Date(d.created_at).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
