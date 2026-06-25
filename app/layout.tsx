import type { Metadata } from 'next';
import Link from 'next/link';
import { DESAPARECIDOS_URL } from '@/lib/types';
import './globals.css';

export const metadata: Metadata = {
  title: 'Mapa de Zonas Afectadas Venezuela',
  description:
    'Información por zona tras el terremoto del 24 de junio de 2026: nivel de daño, servicios, refugios y reportes.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-screen text-gray-900 antialiased">
        <header className="border-b border-gray-200 bg-white">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-lg font-bold">🇻🇪 Zonas Afectadas</span>
              <span className="hidden text-sm text-gray-400 sm:inline">
                Terremoto 24 jun 2026
              </span>
            </Link>
            <div className="flex items-center gap-2">
              <a
                href={DESAPARECIDOS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700"
              >
                Desaparecidos
              </a>
              <Link
                href="/reportar"
                className="rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
              >
                Reportar
              </Link>
            </div>
          </div>
        </header>
        {children}
        <footer className="mt-12 border-t border-gray-200 bg-white">
          <div className="mx-auto max-w-6xl px-4 py-6 text-sm text-gray-500">
            Proyecto comunitario sin fines de lucro. Los datos provienen de reportes
            de fuentes diversas y pueden no estar verificados — confirma siempre con
            fuentes oficiales y servicios de emergencia.
          </div>
        </footer>
      </body>
    </html>
  );
}
