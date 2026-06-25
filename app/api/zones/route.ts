import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

// GET /api/zones — lista para el mapa y el buscador.
export async function GET() {
  const zones = await prisma.zone.findMany({
    orderBy: { name: 'asc' },
    include: { _count: { select: { shelters: true } } },
  });
  return NextResponse.json(zones);
}
