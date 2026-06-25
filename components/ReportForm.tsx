'use client';

import { useState } from 'react';
import type { Zone } from '@/lib/types';
import { submitReport } from '@/lib/api';

const DAMAGE_OPTIONS = [
  { value: '', label: '— Sin especificar —' },
  { value: 'alto', label: 'Alto' },
  { value: 'medio', label: 'Medio' },
  { value: 'bajo', label: 'Bajo' },
];

export default function ReportForm({ zones }: { zones: Zone[] }) {
  const [form, setForm] = useState({
    zoneId: '',
    title: '',
    body: '',
    damageLevel: '',
    sourceName: '',
    sourceUrl: '',
    reporterName: '',
    reporterContact: '',
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'ok' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('sending');
    setMessage('');
    try {
      const res = await submitReport({
        zoneId: Number(form.zoneId),
        title: form.title,
        body: form.body,
        damageLevel: form.damageLevel || undefined,
        sourceName: form.sourceName || undefined,
        sourceUrl: form.sourceUrl || undefined,
        reporterName: form.reporterName || undefined,
        reporterContact: form.reporterContact || undefined,
      });
      setStatus('ok');
      setMessage(res.message);
      setForm({
        zoneId: '',
        title: '',
        body: '',
        damageLevel: '',
        sourceName: '',
        sourceUrl: '',
        reporterName: '',
        reporterContact: '',
      });
    } catch (err) {
      setStatus('error');
      setMessage(err instanceof Error ? err.message : 'Error al enviar');
    }
  }

  if (status === 'ok') {
    return (
      <div className="rounded-lg border border-green-200 bg-green-50 p-6 text-center">
        <p className="text-lg font-semibold text-green-800">¡Reporte recibido!</p>
        <p className="mt-1 text-sm text-green-700">{message}</p>
        <button
          onClick={() => setStatus('idle')}
          className="mt-4 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
        >
          Enviar otro reporte
        </button>
      </div>
    );
  }

  const labelCls = 'block text-sm font-medium text-gray-700';
  const inputCls =
    'mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500';

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <p className="rounded-lg bg-amber-50 p-3 text-sm text-amber-800">
        Tu reporte entra a una cola de moderación y <strong>no se publica
        automáticamente</strong>. Un revisor lo verifica antes de mostrarlo.
      </p>

      <div>
        <label className={labelCls}>Zona *</label>
        <select required value={form.zoneId} onChange={set('zoneId')} className={inputCls}>
          <option value="">Selecciona un estado…</option>
          {zones.map((z) => (
            <option key={z.id} value={z.id}>
              {z.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className={labelCls}>Título *</label>
        <input
          required
          minLength={4}
          maxLength={160}
          value={form.title}
          onChange={set('title')}
          placeholder="Ej. Sin agua en sector La Pradera"
          className={inputCls}
        />
      </div>

      <div>
        <label className={labelCls}>Descripción *</label>
        <textarea
          required
          minLength={10}
          maxLength={2000}
          rows={4}
          value={form.body}
          onChange={set('body')}
          placeholder="Describe la situación: qué pasó, dónde, qué se necesita…"
          className={inputCls}
        />
      </div>

      <div>
        <label className={labelCls}>Nivel de daño (opcional)</label>
        <select value={form.damageLevel} onChange={set('damageLevel')} className={inputCls}>
          {DAMAGE_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelCls}>Fuente (opcional)</label>
          <input
            value={form.sourceName}
            onChange={set('sourceName')}
            placeholder="Ej. Vecino, medio, institución"
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls}>Link de la fuente (opcional)</label>
          <input
            type="url"
            value={form.sourceUrl}
            onChange={set('sourceUrl')}
            placeholder="https://…"
            className={inputCls}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelCls}>Tu nombre (opcional)</label>
          <input
            value={form.reporterName}
            onChange={set('reporterName')}
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls}>Contacto (opcional, no se publica)</label>
          <input
            value={form.reporterContact}
            onChange={set('reporterContact')}
            placeholder="Email o teléfono"
            className={inputCls}
          />
        </div>
      </div>

      {status === 'error' && (
        <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{message}</p>
      )}

      <button
        type="submit"
        disabled={status === 'sending'}
        className="w-full rounded-lg bg-blue-600 px-4 py-2.5 font-medium text-white hover:bg-blue-700 disabled:opacity-60"
      >
        {status === 'sending' ? 'Enviando…' : 'Enviar reporte'}
      </button>
    </form>
  );
}
