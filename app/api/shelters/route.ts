import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

// GET /api/shelters?zone=slug — refugios (opcionalmente filtrados por zona).
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const zone = searchParams.get('zone');

  const shelters = await prisma.shelter.findMany({
    where: zone ? { zone: { slug: zone } } : {},
    orderBy: { name: 'asc' },
    include: { zone: { select: { name: true, slug: true } } },
  });
  return NextResponse.json(shelters);
}
