import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAdmin } from '@/lib/admin';

export const dynamic = 'force-dynamic';

// GET /api/admin/reports?status=pending — cola de moderación (requiere token).
export async function GET(req: Request) {
  const unauthorized = requireAdmin(req);
  if (unauthorized) return unauthorized;

  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status') || 'pending';

  const reports = await prisma.report.findMany({
    where: { status },
    orderBy: { createdAt: 'desc' },
    include: { zone: { select: { name: true, slug: true } } },
  });
  return NextResponse.json(reports);
}
