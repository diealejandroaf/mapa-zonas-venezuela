// Tipos que reflejan las respuestas del backend.

export type DamageLevel = 'alto' | 'medio' | 'bajo' | 'sin_datos';
export type ServiceStatus = 'normal' | 'intermitente' | 'sin_servicio' | 'sin_datos';
export type ShelterStatus = 'abierto' | 'lleno' | 'cerrado' | 'sin_datos';

export interface Zone {
  id: number;
  name: string;
  slug: string;
  type: string;
  isoCode: string | null;
  damageLevel: DamageLevel;
  powerStatus: ServiceStatus;
  waterStatus: ServiceStatus;
  signalStatus: ServiceStatus;
  roadsStatus: ServiceStatus;
  summary: string | null;
  latitude: number | null;
  longitude: number | null;
  population: number | null;
  lastReportAt: string | null;
  lastReportSource: string | null;
  _count?: { shelters: number };
}

export interface Report {
  id: number;
  zoneId: number;
  title: string;
  body: string;
  damageLevel: DamageLevel | null;
  sourceName: string | null;
  sourceUrl: string | null;
  origin: string;
  status: string;
  reportedAt: string;
  zone?: { name: string; slug: string };
}

export interface Shelter {
  id: number;
  zoneId: number;
  name: string;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  capacity: number | null;
  occupancy: number | null;
  contactPhone: string | null;
  servicesOffered: string | null;
  status: ShelterStatus;
  sourceName: string | null;
  sourceUrl: string | null;
}

// Ficha completa de zona (incluye refugios y reportes publicados).
export interface ZoneDetail extends Zone {
  shelters: Shelter[];
  reports: Report[];
}
