'use client';

// Muestra el error real del segmento (temporal, para depurar).
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div style={{ fontFamily: 'monospace', padding: 20 }}>
      <h2>⚠️ Error capturado (segmento)</h2>
      <pre style={{ whiteSpace: 'pre-wrap', color: '#b00' }}>{String(error?.message)}</pre>
      <pre>digest: {String(error?.digest)}</pre>
      <pre style={{ whiteSpace: 'pre-wrap', fontSize: 11, color: '#666' }}>
        {String(error?.stack)}
      </pre>
      <button onClick={() => reset()}>Reintentar</button>
    </div>
  );
}
