'use client';

import { useEffect, useState } from 'react';
import type { Zone, Shelter } from '@/lib/types';
import { adminFetch } from '@/lib/admin-client';

const STATUS = ['abierto', 'lleno', 'cerrado', 'sin_datos'];
const inputCls =
  'w-full rounded border border-gray-300 px-2 py-1.5 text-sm focus:border-blue-500 focus:outline-none';

const empty = {
  name: '',
  address: '',
  status: 'abierto',
  capacity: '',
  contactPhone: '',
  servicesOffered: '',
  sourceName: '',
};

export default function SheltersManager() {
  const [zones, setZones] = useState<Zone[]>([]);
  const [zoneId, setZoneId] = useState('');
  const [shelters, setShelters] = useState<Shelter[]>([]);
  const [form, setForm] = useState({ ...empty });
  const [msg, setMsg] = useState('');

  useEffect(() => {
    fetch('/api/zones', { cache: 'no-store' }).then((r) => r.json()).then(setZones);
  }, []);

  const loadShelters = (zid: string) => {
    const z = zones.find((x) => String(x.id) === zid);
    if (!z) return setShelters([]);
    adminFetch<Shelter[]>(`/api/admin/shelters?zone=${z.slug}`).then(setShelters).catch(() => {});
  };

  useEffect(() => {
    if (zoneId) loadShelters(zoneId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zoneId, zones]);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    setMsg('');
    try {
      await adminFetch('/api/admin/shelters', {
        method: 'POST',
        body: JSON.stringify({
          zoneId: Number(zoneId),
          name: form.name,
          address: form.address || undefined,
          status: form.status,
          capacity: form.capacity ? Number(form.capacity) : undefined,
          contactPhone: form.contactPhone || undefined,
          servicesOffered: form.servicesOffered || undefined,
          sourceName: form.sourceName || undefined,
        }),
      });
      setForm({ ...empty });
      setMsg('✅ Refugio agregado');
      loadShelters(zoneId);
    } catch (e) {
      setMsg(e instanceof Error ? e.message : 'Error');
    }
  }

  async function updateStatus(id: number, status: string) {
    await adminFetch(`/api/admin/shelters/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
    loadShelters(zoneId);
  }

  async function remove(id: number) {
    await adminFetch(`/api/admin/shelters/${id}`, { method: 'DELETE' });
    loadShelters(zoneId);
  }

  return (
    <div className="space-y-4">
      <select value={zoneId} onChange={(e) => setZoneId(e.target.value)} className={inputCls}>
        <option value="">Elige una zona…</option>
        {zones.map((z) => (
          <option key={z.id} value={z.id}>
            {z.name}
          </option>
        ))}
      </select>

      {zoneId && (
        <>
          <ul className="space-y-2">
            {shelters.length === 0 && (
              <li className="text-sm text-gray-500">Sin refugios en esta zona.</li>
            )}
            {shelters.map((s) => (
              <li
                key={s.id}
                className="flex items-center justify-between gap-2 rounded border border-gray-200 p-2 text-sm"
              >
                <span>
                  <span className="font-medium">{s.name}</span>
                  {s.address && <span className="text-gray-500"> · {s.address}</span>}
                </span>
                <span className="flex items-center gap-2">
                  <select
                    value={s.status}
                    onChange={(e) => updateStatus(s.id, e.target.value)}
                    className="rounded border border-gray-300 px-1 py-0.5 text-xs"
                  >
                    {STATUS.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => remove(s.id)}
                    className="rounded px-2 py-0.5 text-xs text-red-600 hover:bg-red-50"
                  >
                    Borrar
                  </button>
                </span>
              </li>
            ))}
          </ul>

          <form onSubmit={add} className="space-y-2 rounded-lg border border-gray-200 p-3">
            <h3 className="text-sm font-semibold">Agregar refugio</h3>
            <input
              required
              placeholder="Nombre del refugio"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className={inputCls}
            />
            <input
              placeholder="Dirección"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className={inputCls}
            />
            <div className="grid grid-cols-2 gap-2">
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className={inputCls}
              >
                {STATUS.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
              <input
                type="number"
                placeholder="Capacidad"
                value={form.capacity}
                onChange={(e) => setForm({ ...form, capacity: e.target.value })}
                className={inputCls}
              />
            </div>
            <input
              placeholder="Teléfono de contacto"
              value={form.contactPhone}
              onChange={(e) => setForm({ ...form, contactPhone: e.target.value })}
              className={inputCls}
            />
            <input
              placeholder="Servicios (comida, agua, primeros auxilios…)"
              value={form.servicesOffered}
              onChange={(e) => setForm({ ...form, servicesOffered: e.target.value })}
              className={inputCls}
            />
            <input
              placeholder="Fuente (quién lo reporta)"
              value={form.sourceName}
              onChange={(e) => setForm({ ...form, sourceName: e.target.value })}
              className={inputCls}
            />
            <div className="flex items-center gap-3">
              <button className="rounded bg-blue-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-blue-700">
                Agregar
              </button>
              {msg && <span className="text-sm text-gray-600">{msg}</span>}
            </div>
          </form>
        </>
      )}
    </div>
  );
}
