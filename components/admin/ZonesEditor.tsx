'use client';

import { useEffect, useState } from 'react';
import type { Zone } from '@/lib/types';
import { adminFetch } from '@/lib/admin-client';

const DAMAGE = ['alto', 'medio', 'bajo', 'sin_datos'];
const SERVICE = ['normal', 'intermitente', 'sin_servicio', 'sin_datos'];
const SERVICE_FIELDS = [
  ['powerStatus', 'Luz'],
  ['waterStatus', 'Agua'],
  ['signalStatus', 'Señal'],
  ['roadsStatus', 'Vías'],
] as const;

const inputCls =
  'mt-1 w-full rounded border border-gray-300 px-2 py-1.5 text-sm focus:border-blue-500 focus:outline-none';

export default function ZonesEditor() {
  const [zones, setZones] = useState<Zone[]>([]);
  const [sel, setSel] = useState<Zone | null>(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  const load = () =>
    fetch('/api/zones', { cache: 'no-store' })
      .then((r) => r.json())
      .then(setZones)
      .catch(() => setMsg('No se pudieron cargar las zonas'));

  useEffect(() => {
    load();
  }, []);

  function set<K extends keyof Zone>(k: K, v: Zone[K]) {
    if (sel) setSel({ ...sel, [k]: v });
  }

  async function save() {
    if (!sel) return;
    setSaving(true);
    setMsg('');
    try {
      await adminFetch(`/api/admin/zones/${sel.slug}`, {
        method: 'PATCH',
        body: JSON.stringify({
          damageLevel: sel.damageLevel,
          powerStatus: sel.powerStatus,
          waterStatus: sel.waterStatus,
          signalStatus: sel.signalStatus,
          roadsStatus: sel.roadsStatus,
          summary: sel.summary || '',
          lastReportSource: sel.lastReportSource || '',
        }),
      });
      setMsg('✅ Guardado');
      load();
    } catch (e) {
      setMsg(e instanceof Error ? e.message : 'Error al guardar');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <div className="space-y-1 sm:col-span-1">
        {zones.map((z) => (
          <button
            key={z.id}
            onClick={() => {
              setSel(z);
              setMsg('');
            }}
            className={`block w-full rounded px-3 py-2 text-left text-sm ${
              sel?.id === z.id ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            {z.name} <span className="opacity-70">· {z.damageLevel}</span>
          </button>
        ))}
      </div>

      <div className="sm:col-span-2">
        {!sel ? (
          <p className="text-sm text-gray-500">Selecciona una zona para editarla.</p>
        ) : (
          <div className="space-y-3 rounded-lg border border-gray-200 p-4">
            <h3 className="font-semibold">{sel.name}</h3>

            <label className="block text-sm">
              Nivel de daño
              <select
                value={sel.damageLevel}
                onChange={(e) => set('damageLevel', e.target.value as Zone['damageLevel'])}
                className={inputCls}
              >
                {DAMAGE.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </label>

            <div className="grid grid-cols-2 gap-2">
              {SERVICE_FIELDS.map(([key, label]) => (
                <label key={key} className="block text-sm">
                  {label}
                  <select
                    value={sel[key] as string}
                    onChange={(e) => set(key, e.target.value as Zone['powerStatus'])}
                    className={inputCls}
                  >
                    {SERVICE.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </label>
              ))}
            </div>

            <label className="block text-sm">
              Resumen de la situación
              <textarea
                rows={3}
                value={sel.summary || ''}
                onChange={(e) => set('summary', e.target.value)}
                className={inputCls}
              />
            </label>

            <label className="block text-sm">
              Fuente del último reporte
              <input
                value={sel.lastReportSource || ''}
                onChange={(e) => set('lastReportSource', e.target.value)}
                className={inputCls}
              />
            </label>

            <div className="flex items-center gap-3">
              <button
                onClick={save}
                disabled={saving}
                className="rounded bg-blue-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
              >
                {saving ? 'Guardando…' : 'Guardar'}
              </button>
              {msg && <span className="text-sm text-gray-600">{msg}</span>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
