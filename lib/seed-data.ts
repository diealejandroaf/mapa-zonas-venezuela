// Datos sembrados de DEMOSTRACIÓN, compartidos por el seed de CLI (prisma/seed.ts)
// y el endpoint de siembra en la nube (app/api/admin/seed/route.ts).
// ⚠️ Ilustrativos, NO verificados — reemplazar con fuentes oficiales antes de publicar.

export const QUAKE = new Date('2026-06-24T16:42:00-04:00'); // sismo, hora de Venezuela
export const hoursAfter = (h: number) => new Date(QUAKE.getTime() + h * 60 * 60 * 1000);

export interface SeedReport {
  title: string;
  body: string;
  damageLevel?: string;
  sourceName?: string;
  sourceUrl?: string;
  origin: string;
  reportedAt: Date;
}

export interface SeedShelter {
  name: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  capacity?: number;
  occupancy?: number;
  contactPhone?: string;
  servicesOffered?: string;
  status: string;
  sourceName?: string;
}

export interface SeedZone {
  name: string;
  slug: string;
  isoCode: string;
  damageLevel: string;
  powerStatus: string;
  waterStatus: string;
  signalStatus: string;
  roadsStatus: string;
  summary: string;
  latitude: number;
  longitude: number;
  lastReportAt: Date;
  lastReportSource: string;
  reports: SeedReport[];
  shelters: SeedShelter[];
}

export const seedZones: SeedZone[] = [
  {
    name: 'Yaracuy',
    slug: 'yaracuy',
    isoCode: 'VE-U',
    damageLevel: 'alto',
    powerStatus: 'sin_servicio',
    waterStatus: 'sin_servicio',
    signalStatus: 'intermitente',
    roadsStatus: 'sin_servicio',
    summary:
      'Zona cercana al epicentro. Daños estructurales severos en San Felipe y Nirgua; varias vías principales bloqueadas por derrumbes.',
    latitude: 10.33,
    longitude: -68.74,
    lastReportAt: hoursAfter(20),
    lastReportSource: 'Protección Civil Yaracuy (demo)',
    reports: [
      {
        title: 'Colapso de viviendas en casco central de San Felipe',
        body: 'Equipos de rescate trabajan en edificaciones colapsadas en el centro de San Felipe. Se pide a la población no acercarse a estructuras agrietadas.',
        damageLevel: 'alto',
        sourceName: 'Protección Civil (demo)',
        sourceUrl: 'https://example.org/yaracuy/rescate',
        origin: 'official',
        reportedAt: hoursAfter(3),
      },
      {
        title: 'Vía Nirgua–San Felipe cerrada por derrumbe',
        body: 'Reportan derrumbe que mantiene incomunicado el tramo. Maquinaria en camino para despeje.',
        damageLevel: 'alto',
        sourceName: 'Reporte vial (demo)',
        sourceUrl: 'https://example.org/yaracuy/vias',
        origin: 'seed',
        reportedAt: hoursAfter(20),
      },
    ],
    shelters: [
      {
        name: 'Polideportivo de San Felipe',
        address: 'Av. La Patria, San Felipe',
        latitude: 10.337,
        longitude: -68.74,
        capacity: 400,
        occupancy: 260,
        contactPhone: '0254-000-0000',
        servicesOffered: 'comida, agua, primeros auxilios, pernocta',
        status: 'abierto',
        sourceName: 'Alcaldía (demo)',
      },
      {
        name: 'Escuela Bolivariana Nirgua',
        address: 'Calle Páez, Nirgua',
        latitude: 10.15,
        longitude: -68.56,
        capacity: 150,
        occupancy: 150,
        servicesOffered: 'agua, pernocta',
        status: 'lleno',
        sourceName: 'Comunidad (demo)',
      },
    ],
  },
  {
    name: 'Carabobo',
    slug: 'carabobo',
    isoCode: 'VE-G',
    damageLevel: 'alto',
    powerStatus: 'intermitente',
    waterStatus: 'sin_servicio',
    signalStatus: 'intermitente',
    roadsStatus: 'intermitente',
    summary:
      'Daños considerables en Valencia y Puerto Cabello. Cortes de agua generalizados; servicio eléctrico inestable.',
    latitude: 10.17,
    longitude: -68.0,
    lastReportAt: hoursAfter(18),
    lastReportSource: 'Bomberos Carabobo (demo)',
    reports: [
      {
        title: 'Grietas en edificios del norte de Valencia',
        body: 'Inspecciones en curso en urbanizaciones del norte. Se recomienda evacuar edificaciones con daños visibles hasta evaluación técnica.',
        damageLevel: 'alto',
        sourceName: 'Bomberos (demo)',
        sourceUrl: 'https://example.org/carabobo/valencia',
        origin: 'official',
        reportedAt: hoursAfter(5),
      },
      {
        title: 'Suministro de agua suspendido en el municipio Valencia',
        body: 'Hidrocentro reporta suspensión preventiva del bombeo por revisión de tuberías matrices.',
        sourceName: 'Servicio de agua (demo)',
        sourceUrl: 'https://example.org/carabobo/agua',
        origin: 'seed',
        reportedAt: hoursAfter(18),
      },
    ],
    shelters: [
      {
        name: 'Gimnasio Misael Delgado',
        address: 'Av. Las Ferias, Valencia',
        latitude: 10.19,
        longitude: -68.0,
        capacity: 600,
        occupancy: 320,
        contactPhone: '0241-000-0000',
        servicesOffered: 'comida, agua, primeros auxilios, pernocta',
        status: 'abierto',
        sourceName: 'Alcaldía (demo)',
      },
    ],
  },
  {
    name: 'La Guaira',
    slug: 'la-guaira',
    isoCode: 'VE-X',
    damageLevel: 'medio',
    powerStatus: 'intermitente',
    waterStatus: 'intermitente',
    signalStatus: 'normal',
    roadsStatus: 'intermitente',
    summary:
      'Deslizamientos en la carretera vieja Caracas–La Guaira. Daños moderados en viviendas del litoral.',
    latitude: 10.6,
    longitude: -66.93,
    lastReportAt: hoursAfter(12),
    lastReportSource: 'Tránsito (demo)',
    reports: [
      {
        title: 'Deslizamientos en la carretera vieja Caracas–La Guaira',
        body: 'Paso restringido por caída de material en varios puntos. Se sugiere usar la autopista mientras se evalúa la vía.',
        damageLevel: 'medio',
        sourceName: 'Tránsito (demo)',
        sourceUrl: 'https://example.org/laguaira/vias',
        origin: 'official',
        reportedAt: hoursAfter(8),
      },
    ],
    shelters: [
      {
        name: 'Refugio Maiquetía',
        address: 'Sector Pariata, Maiquetía',
        latitude: 10.6,
        longitude: -66.97,
        capacity: 200,
        occupancy: 90,
        servicesOffered: 'agua, pernocta',
        status: 'abierto',
        sourceName: 'Comunidad (demo)',
      },
    ],
  },
  {
    name: 'Distrito Capital (Caracas)',
    slug: 'caracas',
    isoCode: 'VE-A',
    damageLevel: 'medio',
    powerStatus: 'intermitente',
    waterStatus: 'normal',
    signalStatus: 'intermitente',
    roadsStatus: 'normal',
    summary:
      'Daños moderados y dispersos. Saturación de la red móvil; cortes eléctricos por zonas. Metro operando con retrasos.',
    latitude: 10.49,
    longitude: -66.88,
    lastReportAt: hoursAfter(10),
    lastReportSource: 'Metro de Caracas (demo)',
    reports: [
      {
        title: 'Metro de Caracas con servicio parcial',
        body: 'Operación restringida en algunas líneas mientras se realizan inspecciones de seguridad en estaciones.',
        sourceName: 'Metro (demo)',
        sourceUrl: 'https://example.org/caracas/metro',
        origin: 'official',
        reportedAt: hoursAfter(6),
      },
      {
        title: 'Saturación de la red móvil en el área metropolitana',
        body: 'Operadoras reportan congestión por alto volumen de llamadas. Se recomienda usar mensajería de datos.',
        sourceName: 'Telecom (demo)',
        sourceUrl: 'https://example.org/caracas/senal',
        origin: 'seed',
        reportedAt: hoursAfter(10),
      },
    ],
    shelters: [
      {
        name: 'Gimnasio Cubierto Parque Naciones Unidas',
        address: 'El Paraíso, Caracas',
        latitude: 10.49,
        longitude: -66.93,
        capacity: 500,
        occupancy: 140,
        contactPhone: '0212-000-0000',
        servicesOffered: 'comida, agua, primeros auxilios',
        status: 'abierto',
        sourceName: 'Alcaldía (demo)',
      },
    ],
  },
  {
    name: 'Aragua',
    slug: 'aragua',
    isoCode: 'VE-D',
    damageLevel: 'medio',
    powerStatus: 'intermitente',
    waterStatus: 'intermitente',
    signalStatus: 'intermitente',
    roadsStatus: 'intermitente',
    summary:
      'Afectaciones en Maracay y La Victoria. Cortes intermitentes de servicios; algunas vías con paso restringido.',
    latitude: 10.25,
    longitude: -67.6,
    lastReportAt: hoursAfter(14),
    lastReportSource: 'Protección Civil Aragua (demo)',
    reports: [
      {
        title: 'Evaluación de daños en Maracay y La Victoria',
        body: 'Cuadrillas inspeccionan viviendas y centros de salud. Hospitales operativos con generadores.',
        damageLevel: 'medio',
        sourceName: 'Protección Civil (demo)',
        sourceUrl: 'https://example.org/aragua/danos',
        origin: 'official',
        reportedAt: hoursAfter(7),
      },
    ],
    shelters: [
      {
        name: 'Polideportivo de Maracay',
        address: 'Av. Las Delicias, Maracay',
        latitude: 10.26,
        longitude: -67.6,
        capacity: 350,
        occupancy: 110,
        servicesOffered: 'agua, pernocta, primeros auxilios',
        status: 'abierto',
        sourceName: 'Alcaldía (demo)',
      },
    ],
  },
  {
    name: 'Miranda',
    slug: 'miranda',
    isoCode: 'VE-M',
    damageLevel: 'bajo',
    powerStatus: 'normal',
    waterStatus: 'normal',
    signalStatus: 'normal',
    roadsStatus: 'intermitente',
    summary:
      'Afectación baja. Daños menores en los Altos Mirandinos; servicios mayormente operativos.',
    latitude: 10.34,
    longitude: -66.93,
    lastReportAt: hoursAfter(9),
    lastReportSource: 'Bomberos Miranda (demo)',
    reports: [
      {
        title: 'Daños menores en Los Teques',
        body: 'Reportes puntuales de grietas sin riesgo estructural. Servicios funcionando con normalidad.',
        damageLevel: 'bajo',
        sourceName: 'Bomberos (demo)',
        sourceUrl: 'https://example.org/miranda/teques',
        origin: 'official',
        reportedAt: hoursAfter(9),
      },
    ],
    shelters: [],
  },
];
