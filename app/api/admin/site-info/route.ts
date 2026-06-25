import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAdmin } from '@/lib/admin';
import { siteInfoSchema } from '@/lib/validation';

export const dynamic = 'force-dynamic';

// PATCH /api/admin/site-info — actualiza el balance nacional (requiere token).
export async function PATCH(req: Request) {
  const unauthorized = requireAdmin(req);
  if (unauthorized) return unauthorized;

  const body = await req.json().catch(() => null);
  const parsed = siteInfoSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Datos inválidos', details: parsed.error.flatten() },
      { status: 400 }
    );
  }
  const d = parsed.data;
  const data = {
    deaths: d.deaths ?? null,
    injured: d.injured ?? null,
    missing: d.missing ?? null,
    asOf: d.asOf ? new Date(d.asOf) : null,
    sourceName: d.sourceName || null,
    sourceUrl: d.sourceUrl || null,
    note: d.note || null,
  };

  const info = await prisma.siteInfo.upsert({
    where: { id: 1 },
    create: { id: 1, ...data },
    update: data,
  });
  return NextResponse.json(info);
}
