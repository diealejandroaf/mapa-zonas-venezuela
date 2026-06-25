'use client';

// Muestra el error real (temporal, para depurar el crash en producción).
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="es">
      <body style={{ fontFamily: 'monospace', padding: 20, background: '#fff', color: '#111' }}>
        <h2>⚠️ Error capturado (global)</h2>
        <pre style={{ whiteSpace: 'pre-wrap', color: '#b00' }}>{String(error?.message)}</pre>
        <pre>name: {String(error?.name)}</pre>
        <pre>digest: {String(error?.digest)}</pre>
        <pre style={{ whiteSpace: 'pre-wrap', fontSize: 11, color: '#666' }}>
          {String(error?.stack)}
        </pre>
        <button onClick={() => reset()}>Reintentar</button>
      </body>
    </html>
  );
}
