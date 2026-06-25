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
  // Merge: solo se actualizan los campos enviados (undefined = no tocar),
  // para no borrar cifras si una actualización automática omite algún valor.
  const data: Record<string, unknown> = {};
  if (d.deaths !== undefined) data.deaths = d.deaths;
  if (d.injured !== undefined) data.injured = d.injured;
  if (d.missing !== undefined) data.missing = d.missing;
  if (d.asOf !== undefined) data.asOf = d.asOf ? new Date(d.asOf) : null;
  if (d.sourceName !== undefined) data.sourceName = d.sourceName || null;
  if (d.sourceUrl !== undefined) data.sourceUrl = d.sourceUrl || null;
  if (d.note !== undefined) data.note = d.note || null;

  const info = await prisma.siteInfo.upsert({
    where: { id: 1 },
    create: { id: 1, ...data },
    update: data,
  });
  return NextResponse.json(info);
}
