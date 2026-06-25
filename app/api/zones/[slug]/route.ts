import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

// GET /api/zones/:slug — ficha de la zona con refugios y reportes publicados.
export async function GET(
  _req: Request,
  { params }: { params: { slug: string } }
) {
  const zone = await prisma.zone.findUnique({
    where: { slug: params.slug },
    include: {
      shelters: { orderBy: { name: 'asc' } },
      reports: {
        where: { status: 'published' },
        orderBy: { reportedAt: 'desc' },
        take: 20,
      },
    },
  });
  if (!zone) {
    return NextResponse.json({ error: 'Zona no encontrada' }, { status: 404 });
  }
  return NextResponse.json(zone);
}
