'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getToken, setToken, clearToken, adminFetch } from '@/lib/admin-client';
import ZonesEditor from '@/components/admin/ZonesEditor';
import ReportsManager from '@/components/admin/ReportsManager';
import SheltersManager from '@/components/admin/SheltersManager';
import CifrasEditor from '@/components/admin/CifrasEditor';

type Tab = 'zonas' | 'reportes' | 'refugios' | 'cifras';

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [checking, setChecking] = useState(true);
  const [tokenInput, setTokenInput] = useState('');
  const [error, setError] = useState('');
  const [tab, setTab] = useState<Tab>('zonas');

  // Valida un token llamando a un endpoint protegido.
  async function validate() {
    try {
      await adminFetch('/api/admin/reports?status=pending');
      setAuthed(true);
      setError('');
    } catch {
      setAuthed(false);
    }
  }

  useEffect(() => {
    if (getToken()) validate().finally(() => setChecking(false));
    else setChecking(false);
  }, []);

  async function login(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setToken(tokenInput.trim());
    try {
      await adminFetch('/api/admin/reports?status=pending');
      setAuthed(true);
    } catch {
      clearToken();
      setError('Token incorrecto.');
    }
  }

  if (checking) {
    return <main className="mx-auto max-w-md px-4 py-16 text-center text-gray-500">Cargando…</main>;
  }

  if (!authed) {
    return (
      <main className="mx-auto max-w-sm px-4 py-16">
        <h1 className="text-xl font-bold">Panel de administración</h1>
        <p className="mt-1 text-sm text-gray-600">Ingresa el token de administración.</p>
        <form onSubmit={login} className="mt-4 space-y-3">
          <input
            type="password"
            value={tokenInput}
            onChange={(e) => setTokenInput(e.target.value)}
            placeholder="ADMIN_TOKEN"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
            Entrar
          </button>
        </form>
        <Link href="/" className="mt-4 block text-sm text-blue-600 hover:underline">
          ← Volver al mapa
        </Link>
      </main>
    );
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: 'zonas', label: 'Zonas' },
    { id: 'reportes', label: 'Reportes' },
    { id: 'refugios', label: 'Refugios' },
    { id: 'cifras', label: 'Cifras' },
  ];

  return (
    <main className="mx-auto max-w-4xl px-4 py-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">Panel de administración</h1>
        <div className="flex items-center gap-3 text-sm">
          <Link href="/" className="text-blue-600 hover:underline">
            Ver sitio
          </Link>
          <button
            onClick={() => {
              clearToken();
              setAuthed(false);
            }}
            className="text-gray-500 hover:underline"
          >
            Salir
          </button>
        </div>
      </div>

      <div className="mb-4 flex gap-2 border-b border-gray-200">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`-mb-px border-b-2 px-3 py-2 text-sm font-medium ${
              tab === t.id
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'zonas' && <ZonesEditor />}
      {tab === 'reportes' && <ReportsManager />}
      {tab === 'refugios' && <SheltersManager />}
      {tab === 'cifras' && <CifrasEditor />}
    </main>
  );
}
