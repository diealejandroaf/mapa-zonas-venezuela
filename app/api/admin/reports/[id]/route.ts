import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAdmin } from '@/lib/admin';
import { moderationSchema } from '@/lib/validation';

export const dynamic = 'force-dynamic';

// DELETE /api/admin/reports/:id — elimina un reporte (requiere token).
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const unauthorized = requireAdmin(req);
  if (unauthorized) return unauthorized;
  const id = Number(params.id);
  const existing = await prisma.report.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: 'Reporte no encontrado' }, { status: 404 });
  }
  await prisma.report.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}

// PATCH /api/admin/reports/:id  { status: "published" | "rejected" }  (requiere token)
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const unauthorized = requireAdmin(req);
  if (unauthorized) return unauthorized;

  const body = await req.json().catch(() => null);
  const parsed = moderationSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Estado inválido' }, { status: 400 });
  }

  const id = Number(params.id);
  const existing = await prisma.report.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: 'Reporte no encontrado' }, { status: 404 });
  }

  const report = await prisma.report.update({
    where: { id },
    data: { status: parsed.data.status },
  });

  // Al publicar, actualizar la marca de "último reporte" de la zona.
  if (parsed.data.status === 'published') {
    await prisma.zone.update({
      where: { id: report.zoneId },
      data: {
        lastReportAt: report.reportedAt,
        lastReportSource: report.sourceName || 'Reporte ciudadano',
      },
    });
  }

  return NextResponse.json(report);
}
