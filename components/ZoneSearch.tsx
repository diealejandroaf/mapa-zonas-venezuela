'use client';

import { useMemo, useState } from 'react';
import type { Zone } from '@/lib/types';
import { DAMAGE } from '@/lib/constants';

interface Props {
  zones: Zone[];
  onSelect: (slug: string) => void;
}

const norm = (s: string) =>
  s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

export default function ZoneSearch({ zones, onSelect }: Props) {
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(false);

  const results = useMemo(() => {
    const term = norm(q.trim());
    if (!term) return zones;
    return zones.filter((z) => norm(z.name).includes(term));
  }, [q, zones]);

  return (
    <div className="relative">
      <input
        type="text"
        value={q}
        onChange={(e) => {
          setQ(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        placeholder="Buscar por estado o ciudad…"
        className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-base shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
      />
      {open && results.length > 0 && (
        <ul className="absolute z-[1000] mt-1 max-h-72 w-full overflow-auto rounded-lg border border-gray-200 bg-white shadow-lg">
          {results.map((z) => (
            <li key={z.id}>
              <button
                className="flex w-full items-center justify-between px-4 py-2.5 text-left hover:bg-gray-50"
                onMouseDown={() => {
                  onSelect(z.slug);
                  setQ(z.name);
                  setOpen(false);
                }}
              >
                <span>{z.name}</span>
                <span
                  className="rounded-full px-2 py-0.5 text-xs font-medium"
                  style={{
                    backgroundColor: DAMAGE[z.damageLevel].color,
                    color: DAMAGE[z.damageLevel].text,
                  }}
                >
                  {DAMAGE[z.damageLevel].label}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
