import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { seedZones, hoursAfter } from '../lib/seed-data';

const prisma = new PrismaClient();

async function main() {
  console.log('Limpiando datos previos…');
  await prisma.report.deleteMany();
  await prisma.shelter.deleteMany();
  await prisma.zone.deleteMany();

  console.log('Sembrando zonas, reportes y refugios…');
  for (const z of seedZones) {
    const { reports, shelters, ...zone } = z;
    await prisma.zone.create({
      data: {
        ...zone,
        type: 'estado',
        reports: {
          create: reports.map((r) => ({ ...r, status: 'published' })),
        },
        shelters: { create: shelters },
      },
    });
    console.log(`  ✓ ${z.name} (${reports.length} reportes, ${shelters.length} refugios)`);
  }

  // Un reporte ciudadano de ejemplo, en cola de moderación (no se muestra públicamente).
  const yaracuy = await prisma.zone.findUnique({ where: { slug: 'yaracuy' } });
  if (yaracuy) {
    await prisma.report.create({
      data: {
        zoneId: yaracuy.id,
        title: '[Ejemplo en moderación] Familia necesita agua en sector La Pradera',
        body: 'Reporte ciudadano de ejemplo que ilustra la cola de moderación. Sólo es visible en el panel de admin hasta ser aprobado.',
        origin: 'citizen',
        status: 'pending',
        reporterName: 'Vecino anónimo',
        reportedAt: hoursAfter(21),
      },
    });
    console.log('  ✓ 1 reporte ciudadano de ejemplo (pendiente de moderación)');
  }

  console.log('Listo.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
