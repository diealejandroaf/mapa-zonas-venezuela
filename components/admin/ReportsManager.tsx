'use client';

import { useEffect, useState } from 'react';
import type { Zone, Report } from '@/lib/types';
import { adminFetch } from '@/lib/admin-client';

const inputCls =
  'mt-1 w-full rounded border border-gray-300 px-2 py-1.5 text-sm focus:border-blue-500 focus:outline-none';

const empty = { zoneId: '', title: '', body: '', sourceName: '', sourceUrl: '', damageLevel: '' };

export default function ReportsManager() {
  const [zones, setZones] = useState<Zone[]>([]);
  const [pending, setPending] = useState<Report[]>([]);
  const [published, setPublished] = useState<Report[]>([]);
  const [form, setForm] = useState({ ...empty });
  const [msg, setMsg] = useState('');

  const loadZones = () =>
    fetch('/api/zones', { cache: 'no-store' }).then((r) => r.json()).then(setZones);
  const loadPending = () =>
    adminFetch<Report[]>('/api/admin/reports?status=pending').then(setPending).catch(() => {});
  const loadPublished = () =>
    adminFetch<Report[]>('/api/admin/reports?status=published').then(setPublished).catch(() => {});

  useEffect(() => {
    loadZones();
    loadPending();
    loadPublished();
  }, []);

  async function create(e: React.FormEvent) {
    e.preventDefault();
    setMsg('');
    try {
      await adminFetch('/api/admin/reports', {
        method: 'POST',
        body: JSON.stringify({
          zoneId: Number(form.zoneId),
          title: form.title,
          body: form.body,
          sourceName: form.sourceName || undefined,
          sourceUrl: form.sourceUrl || undefined,
          damageLevel: form.damageLevel || undefined,
        }),
      });
      setForm({ ...empty });
      setMsg('✅ Reporte publicado');
      loadPublished();
    } catch (e) {
      setMsg(e instanceof Error ? e.message : 'Error');
    }
  }

  async function moderate(id: number, status: 'published' | 'rejected') {
    await adminFetch(`/api/admin/reports/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
    loadPending();
    loadPublished();
  }

  async function remove(id: number) {
    await adminFetch(`/api/admin/reports/${id}`, { method: 'DELETE' });
    loadPublished();
  }

  return (
    <div className="space-y-6">
      {/* Crear reporte oficial */}
      <form onSubmit={create} className="space-y-3 rounded-lg border border-gray-200 p-4">
        <h3 className="font-semibold">Publicar reporte oficial</h3>
        <div className="grid gap-2 sm:grid-cols-2">
          <select
            required
            value={form.zoneId}
            onChange={(e) => setForm({ ...form, zoneId: e.target.value })}
            className={inputCls}
          >
            <option value="">Zona…</option>
            {zones.map((z) => (
              <option key={z.id} value={z.id}>
                {z.name}
              </option>
            ))}
          </select>
          <select
            value={form.damageLevel}
            onChange={(e) => setForm({ ...form, damageLevel: e.target.value })}
            className={inputCls}
          >
            <option value="">Nivel de daño (opcional)…</option>
            {['alto', 'medio', 'bajo', 'sin_datos'].map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>
        <input
          required
          placeholder="Título"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className={inputCls}
        />
        <textarea
          required
          rows={2}
          placeholder="Descripción"
          value={form.body}
          onChange={(e) => setForm({ ...form, body: e.target.value })}
          className={inputCls}
        />
        <div className="grid gap-2 sm:grid-cols-2">
          <input
            placeholder="Fuente (ej. Protección Civil)"
            value={form.sourceName}
            onChange={(e) => setForm({ ...form, sourceName: e.target.value })}
            className={inputCls}
          />
          <input
            type="url"
            placeholder="Link de la fuente (https://…)"
            value={form.sourceUrl}
            onChange={(e) => setForm({ ...form, sourceUrl: e.target.value })}
            className={inputCls}
          />
        </div>
        <div className="flex items-center gap-3">
          <button className="rounded bg-blue-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-blue-700">
            Publicar
          </button>
          {msg && <span className="text-sm text-gray-600">{msg}</span>}
        </div>
      </form>

      {/* Moderación */}
      <div className="rounded-lg border border-gray-200 p-4">
        <h3 className="mb-2 font-semibold">
          Cola de moderación ({pending.length})
        </h3>
        {pending.length === 0 ? (
          <p className="text-sm text-gray-500">Sin reportes pendientes.</p>
        ) : (
          <ul className="space-y-2">
            {pending.map((r) => (
              <li key={r.id} className="rounded border border-amber-200 bg-amber-50 p-2 text-sm">
                <div className="font-medium">
                  {r.zone?.name}: {r.title}
                </div>
                <p className="text-gray-600">{r.body}</p>
                <div className="mt-1 flex gap-2">
                  <button
                    onClick={() => moderate(r.id, 'published')}
                    className="rounded bg-green-600 px-2 py-1 text-xs text-white"
                  >
                    Aprobar
                  </button>
                  <button
                    onClick={() => moderate(r.id, 'rejected')}
                    className="rounded bg-red-600 px-2 py-1 text-xs text-white"
                  >
                    Rechazar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Publicados */}
      <div className="rounded-lg border border-gray-200 p-4">
        <h3 className="mb-2 font-semibold">Publicados ({published.length})</h3>
        <ul className="space-y-1">
          {published.map((r) => (
            <li key={r.id} className="flex items-center justify-between gap-2 text-sm">
              <span className="truncate">
                <span className="text-gray-400">{r.zone?.name}:</span> {r.title}
              </span>
              <button
                onClick={() => remove(r.id)}
                className="shrink-0 rounded px-2 py-0.5 text-xs text-red-600 hover:bg-red-50"
              >
                Borrar
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
