'use client';

const KEY = 'mzv_admin_token';

export const getToken = (): string =>
  (typeof window !== 'undefined' ? localStorage.getItem(KEY) : '') || '';
export const setToken = (t: string) => localStorage.setItem(KEY, t);
export const clearToken = () => localStorage.removeItem(KEY);

// fetch con el header de admin. Lanza error en respuestas no-OK.
export async function adminFetch<T = unknown>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(path, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'x-admin-token': getToken(),
      ...(options.headers || {}),
    },
    cache: 'no-store',
  });
  const data = await res.json().catch(() => ({}));
  if (res.status === 401) throw new Error('Token inválido o no autorizado');
  if (!res.ok) throw new Error((data as { error?: string })?.error || `Error ${res.status}`);
  return data as T;
}
