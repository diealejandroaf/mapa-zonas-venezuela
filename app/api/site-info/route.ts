import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

// GET /api/site-info — balance nacional (público).
export async function GET() {
  const info = await prisma.siteInfo.findUnique({ where: { id: 1 } });
  return NextResponse.json(info ?? {});
}
