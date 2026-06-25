'use client';

export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <html lang="es">
      <body
        style={{
          fontFamily: 'system-ui, sans-serif',
          padding: 40,
          textAlign: 'center',
          color: '#111',
        }}
      >
        <h2>Algo salió mal</h2>
        <p style={{ color: '#555' }}>
          Por favor recarga la página. Si el problema continúa, vuelve más tarde.
        </p>
        <button
          onClick={() => reset()}
          style={{
            marginTop: 16,
            padding: '8px 16px',
            background: '#2563eb',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            cursor: 'pointer',
          }}
        >
          Reintentar
        </button>
      </body>
    </html>
  );
}
