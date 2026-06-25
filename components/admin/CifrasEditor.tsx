'use client';

import { useEffect, useState } from 'react';
import type { SiteInfo } from '@/lib/types';
import { adminFetch } from '@/lib/admin-client';

const inputCls =
  'mt-1 w-full rounded border border-gray-300 px-2 py-1.5 text-sm focus:border-blue-500 focus:outline-none';

export default function CifrasEditor() {
  const [form, setForm] = useState({
    deaths: '',
    injured: '',
    missing: '',
    sourceName: '',
    sourceUrl: '',
    note: '',
  });
  const [msg, setMsg] = useState('');

  useEffect(() => {
    fetch('/api/site-info', { cache: 'no-store' })
      .then((r) => r.json())
      .then((d: SiteInfo) =>
        setForm({
          deaths: d.deaths != null ? String(d.deaths) : '',
          injured: d.injured != null ? String(d.injured) : '',
          missing: d.missing != null ? String(d.missing) : '',
          sourceName: d.sourceName || '',
          sourceUrl: d.sourceUrl || '',
          note: d.note || '',
        })
      )
      .catch(() => {});
  }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setMsg('');
    try {
      await adminFetch('/api/admin/site-info', {
        method: 'PATCH',
        body: JSON.stringify({
          deaths: form.deaths ? Number(form.deaths) : null,
          injured: form.injured ? Number(form.injured) : null,
          missing: form.missing ? Number(form.missing) : null,
          asOf: new Date().toISOString(),
          sourceName: form.sourceName || undefined,
          sourceUrl: form.sourceUrl || undefined,
          note: form.note || undefined,
        }),
      });
      setMsg('✅ Guardado (fecha actualizada a ahora)');
    } catch (e) {
      setMsg(e instanceof Error ? e.message : 'Error');
    }
  }

  const num = (k: 'deaths' | 'injured' | 'missing', label: string) => (
    <label className="block text-sm">
      {label}
      <input
        type="number"
        min={0}
        value={form[k]}
        onChange={(e) => setForm({ ...form, [k]: e.target.value })}
        className={inputCls}
      />
    </label>
  );

  return (
    <form onSubmit={save} className="max-w-md space-y-3 rounded-lg border border-gray-200 p-4">
      <h3 className="font-semibold">Balance nacional</h3>
      <p className="text-xs text-gray-500">
        Cifras preliminares. Al guardar se marca la fecha de actualización automáticamente.
      </p>
      <div className="grid grid-cols-3 gap-2">
        {num('deaths', 'Fallecidos')}
        {num('injured', 'Heridos')}
        {num('missing', 'Desaparecidos')}
      </div>
      <label className="block text-sm">
        Fuente
        <input
          value={form.sourceName}
          onChange={(e) => setForm({ ...form, sourceName: e.target.value })}
          className={inputCls}
          placeholder="Ej. Protección Civil / agencia"
        />
      </label>
      <label className="block text-sm">
        Link de la fuente
        <input
          type="url"
          value={form.sourceUrl}
          onChange={(e) => setForm({ ...form, sourceUrl: e.target.value })}
          className={inputCls}
          placeholder="https://…"
        />
      </label>
      <div className="flex items-center gap-3">
        <button className="rounded bg-blue-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-blue-700">
          Guardar
        </button>
        {msg && <span className="text-sm text-gray-600">{msg}</span>}
      </div>
    </form>
  );
}
