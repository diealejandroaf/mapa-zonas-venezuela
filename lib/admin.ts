import { NextResponse } from 'next/server';

// Protección simple por token para los endpoints de moderación.
// Enviar el header:  x-admin-token: <ADMIN_TOKEN>
// Devuelve una respuesta de error si no está autorizado, o null si todo bien.
export function requireAdmin(req: Request): NextResponse | null {
  if (!process.env.ADMIN_TOKEN) {
    return NextResponse.json(
      { error: 'ADMIN_TOKEN no está configurado en el servidor' },
      { status: 500 }
    );
  }
  if (req.headers.get('x-admin-token') !== process.env.ADMIN_TOKEN) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }
  return null;
}
