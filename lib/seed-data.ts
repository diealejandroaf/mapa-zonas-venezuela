// Datos compartidos por el seed de CLI (prisma/seed.ts) y el endpoint de siembra
// (app/api/admin/seed/route.ts).
//
// FUENTES REALES (sismo del 24-jun-2026). Cada entrada lleva su enlace y fecha.
// Lo NO verificado por una fuente se deja como "sin_datos" / "por confirmar" — NO se
// inventa. Las cifras de víctimas son preliminares y varían entre fuentes.
// Actualizar/refinar desde el panel de administración (/admin) a medida que lleguen
// reportes oficiales (Protección Civil, FUNVISIS, gobernaciones, Cruz Roja, OCHA).

export const QUAKE = new Date('2026-06-24T17:04:00-04:00'); // ~17:04 hora de Venezuela
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

const SRC = {
  univision:
    'https://www.univision.com/noticias/america-latina/sismo-de-magnitud-7-1-sacude-venezuela',
  infobae:
    'https://www.infobae.com/venezuela/2026/06/24/un-terremoto-de-magnitud-71-sacudio-varias-regiones-de-venezuela-hay-alerta-de-tsunami-para-aruba-curazao-y-bonaire/',
  espectador:
    'https://www.elespectador.com/mundo/venezuela/sismo-en-venezuela-en-vivo-terremoto-de-magnitud-71-sacude-al-pais-las-zonas-afectadas/',
  funvisis: 'http://www.funvisis.gob.ve/',
  wikipedia: 'https://es.wikipedia.org/wiki/Terremotos_de_Venezuela_de_2026',
  gestion:
    'https://gestion.pe/mix/respuestas/terremoto-en-venezuela-se-reporta-164-fallecidos-971-heridos-y-30-replicas-nnda-nnrt-noticia/',
};

export const seedZones: SeedZone[] = [
  {
    name: 'Yaracuy',
    slug: 'yaracuy',
    isoCode: 'VE-U',
    damageLevel: 'alto',
    powerStatus: 'sin_datos',
    waterStatus: 'sin_datos',
    signalStatus: 'intermitente',
    roadsStatus: 'sin_datos',
    summary:
      'Estado del epicentro del doblete sísmico (M~7,2 y M~7,5), a ~21 km al oeste de Morón. Daños severos reportados en el eje Yaracuy–Carabobo. Estado de servicios por confirmar con fuentes oficiales.',
    latitude: 10.33,
    longitude: -68.74,
    lastReportAt: hoursAfter(2),
    lastReportSource: 'USGS / FUNVISIS (preliminar)',
    reports: [
      {
        title: 'Doblete sísmico de magnitud ~7,2 y ~7,5 con epicentro en Yaracuy',
        body: 'Según el USGS, dos terremotos fuertes ocurrieron con segundos de diferencia la tarde del 24-jun-2026 (~17:04 hora local), con epicentro en Yaracuy, a ~21 km al oeste de Morón. La magnitud preliminar (7,1) fue actualizada al alza. Cifras y parámetros pueden cambiar.',
        damageLevel: 'alto',
        sourceName: 'Univision / USGS',
        sourceUrl: SRC.univision,
        origin: 'official',
        reportedAt: hoursAfter(0.5),
      },
      {
        title: 'Gobierno activa gestión de riesgo; FUNVISIS habilita reporte de daños',
        body: 'El Sistema Nacional de Gestión de Riesgo fue activado. FUNVISIS habilitó formularios para que la población reporte daños estructurales y monitorea las réplicas.',
        sourceName: 'FUNVISIS',
        sourceUrl: SRC.funvisis,
        origin: 'official',
        reportedAt: hoursAfter(2),
      },
      {
        title: 'Cifras de víctimas preliminares y cambiantes (dato nacional)',
        body: 'Los reportes iniciales de víctimas varían entre fuentes y no están confirmados oficialmente: van desde decenas hasta más de un centenar de fallecidos a nivel nacional. Tratar como preliminar y verificar.',
        sourceName: 'Gestión / agencias',
        sourceUrl: SRC.gestion,
        origin: 'official',
        reportedAt: hoursAfter(6),
      },
      {
        title: 'Refugios habilitados en escuelas e instalaciones deportivas',
        body: 'Se reporta la habilitación de refugios temporales en escuelas, instalaciones deportivas y espacios comunitarios. Ubicaciones específicas por confirmar con Protección Civil / la alcaldía.',
        sourceName: 'Cobertura de prensa',
        sourceUrl: SRC.espectador,
        origin: 'official',
        reportedAt: hoursAfter(4),
      },
    ],
    shelters: [],
  },
  {
    name: 'Carabobo',
    slug: 'carabobo',
    isoCode: 'VE-G',
    damageLevel: 'alto',
    powerStatus: 'sin_datos',
    waterStatus: 'sin_datos',
    signalStatus: 'intermitente',
    roadsStatus: 'sin_datos',
    summary:
      'Cercano al epicentro (zona costera, cerca de Morón). Daños importantes reportados en infraestructura y viviendas en el eje Yaracuy–Carabobo. Estado de servicios por confirmar.',
    latitude: 10.17,
    longitude: -68.0,
    lastReportAt: hoursAfter(1),
    lastReportSource: 'Infobae',
    reports: [
      {
        title: 'Epicentro frente a la costa de Carabobo, cerca de Morón',
        body: 'El epicentro se ubicó en la zona costera próxima a Morón, con profundidad superficial (<30 km), lo que amplificó el impacto en el norte del estado.',
        damageLevel: 'alto',
        sourceName: 'Infobae',
        sourceUrl: SRC.infobae,
        origin: 'official',
        reportedAt: hoursAfter(1),
      },
      {
        title: 'Alerta de tsunami para Aruba, Curazao y Bonaire (luego cancelada)',
        body: 'Se emitió una alerta de tsunami para las islas ABC en el Caribe sur, que fue cancelada posteriormente.',
        sourceName: 'Infobae',
        sourceUrl: SRC.infobae,
        origin: 'official',
        reportedAt: hoursAfter(1.5),
      },
    ],
    shelters: [],
  },
  {
    name: 'Distrito Capital (Caracas)',
    slug: 'caracas',
    isoCode: 'VE-A',
    damageLevel: 'medio',
    powerStatus: 'sin_datos',
    waterStatus: 'sin_datos',
    signalStatus: 'intermitente',
    roadsStatus: 'sin_datos',
    summary:
      'Daños estructurales y colapso de al menos una estructura; evacuaciones masivas de edificios y pánico generalizado. Estado de servicios por confirmar.',
    latitude: 10.49,
    longitude: -66.88,
    lastReportAt: hoursAfter(1),
    lastReportSource: 'El Espectador',
    reports: [
      {
        title: 'Daños estructurales y colapso de estructura en Caracas; evacuaciones',
        body: 'Se reportan daños en edificios, el colapso de al menos una estructura y evacuaciones masivas en la capital. Equipos de rescate iniciaron labores en zonas afectadas.',
        damageLevel: 'medio',
        sourceName: 'El Espectador',
        sourceUrl: SRC.espectador,
        origin: 'official',
        reportedAt: hoursAfter(1),
      },
    ],
    shelters: [],
  },
  {
    name: 'Aragua',
    slug: 'aragua',
    isoCode: 'VE-D',
    damageLevel: 'sin_datos',
    powerStatus: 'sin_datos',
    waterStatus: 'sin_datos',
    signalStatus: 'sin_datos',
    roadsStatus: 'sin_datos',
    summary:
      'Sin reportes verificados específicos para este estado todavía. Por su cercanía al eje afectado conviene precaución; verificar estado con Protección Civil / la gobernación.',
    latitude: 10.25,
    longitude: -67.6,
    lastReportAt: hoursAfter(3),
    lastReportSource: 'Sin reporte verificado',
    reports: [],
    shelters: [],
  },
  {
    name: 'Miranda',
    slug: 'miranda',
    isoCode: 'VE-M',
    damageLevel: 'sin_datos',
    powerStatus: 'sin_datos',
    waterStatus: 'sin_datos',
    signalStatus: 'sin_datos',
    roadsStatus: 'sin_datos',
    summary:
      'Sin reportes verificados específicos para este estado todavía. Verificar estado con Protección Civil / la gobernación.',
    latitude: 10.34,
    longitude: -66.93,
    lastReportAt: hoursAfter(3),
    lastReportSource: 'Sin reporte verificado',
    reports: [],
    shelters: [],
  },
  {
    name: 'La Guaira',
    slug: 'la-guaira',
    isoCode: 'VE-X',
    damageLevel: 'sin_datos',
    powerStatus: 'sin_datos',
    waterStatus: 'sin_datos',
    signalStatus: 'sin_datos',
    roadsStatus: 'sin_datos',
    summary:
      'Sin reportes verificados específicos para este estado costero todavía. Verificar estado con Protección Civil / la gobernación.',
    latitude: 10.6,
    longitude: -66.93,
    lastReportAt: hoursAfter(3),
    lastReportSource: 'Sin reporte verificado',
    reports: [],
    shelters: [],
  },
];
