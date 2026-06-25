import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { citizenReportSchema } from '@/lib/validation';

export const dynamic = 'force-dynamic';

// GET /api/reports?zone=slug&limit=30 — feed de reportes PUBLICADOS.
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const zone = searchParams.get('zone');
  const limit = Number(searchParams.get('limit')) || 30;

  const reports = await prisma.report.findMany({
    where: {
      status: 'published',
      ...(zone ? { zone: { slug: zone } } : {}),
    },
    orderBy: { reportedAt: 'desc' },
    take: Math.min(limit, 100),
    include: { zone: { select: { name: true, slug: true } } },
  });
  return NextResponse.json(reports);
}

// POST /api/reports — reporte ciudadano. Entra a la cola de moderación
// (status="pending") y NO se publica automáticamente.
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = citizenReportSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Datos inválidos', details: parsed.error.flatten() },
      { status: 400 }
    );
  }
  const data = parsed.data;

  const zone = await prisma.zone.findUnique({ where: { id: data.zoneId } });
  if (!zone) {
    return NextResponse.json({ error: 'Zona inválida' }, { status: 400 });
  }

  const report = await prisma.report.create({
    data: {
      zoneId: data.zoneId,
      title: data.title,
      body: data.body,
      damageLevel: data.damageLevel ?? null,
      sourceName: data.sourceName || null,
      sourceUrl: data.sourceUrl || null,
      reporterName: data.reporterName || null,
      reporterContact: data.reporterContact || null,
      origin: 'citizen',
      status: 'pending', // forzado en el servidor: nunca se publica directo
    },
  });

  return NextResponse.json(
    {
      message:
        'Gracias. Tu reporte fue enviado y está en revisión antes de publicarse.',
      id: report.id,
      status: report.status,
    },
    { status: 201 }
  );
}
