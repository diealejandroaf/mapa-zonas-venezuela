'use client';

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <main className="mx-auto max-w-md px-4 py-16 text-center">
      <h2 className="text-lg font-semibold text-gray-900">
        Algo salió mal al cargar esta sección
      </h2>
      <p className="mt-2 text-sm text-gray-600">
        Por favor intenta de nuevo. Si el problema persiste, vuelve más tarde.
      </p>
      <button
        onClick={() => reset()}
        className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
      >
        Reintentar
      </button>
    </main>
  );
}
