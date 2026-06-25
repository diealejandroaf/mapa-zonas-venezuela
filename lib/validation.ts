import { z } from 'zod';

// Valores controlados (validados a nivel de aplicación para mantener el esquema portable).
export const DAMAGE_LEVELS = ['alto', 'medio', 'bajo', 'sin_datos'] as const;
export const SERVICE_STATUSES = ['normal', 'intermitente', 'sin_servicio', 'sin_datos'] as const;
export const SHELTER_STATUSES = ['abierto', 'lleno', 'cerrado', 'sin_datos'] as const;
export const REPORT_STATUSES = ['pending', 'published', 'rejected'] as const;

// Reporte ciudadano (entra a moderación). El status NO se acepta del cliente:
// siempre se fuerza a "pending" en el servidor.
export const citizenReportSchema = z.object({
  zoneId: z.number().int().positive(),
  title: z.string().trim().min(4).max(160),
  body: z.string().trim().min(10).max(2000),
  damageLevel: z.enum(DAMAGE_LEVELS).optional(),
  sourceName: z.string().trim().max(160).optional(),
  sourceUrl: z.string().trim().url().max(500).optional().or(z.literal('')),
  reporterName: z.string().trim().max(120).optional(),
  reporterContact: z.string().trim().max(160).optional(),
});

// Acción de moderación.
export const moderationSchema = z.object({
  status: z.enum(['published', 'rejected']),
});

// --- Admin: edición de zona (parcial; solo campos enviados) ---
export const zoneUpdateSchema = z.object({
  damageLevel: z.enum(DAMAGE_LEVELS).optional(),
  powerStatus: z.enum(SERVICE_STATUSES).optional(),
  waterStatus: z.enum(SERVICE_STATUSES).optional(),
  signalStatus: z.enum(SERVICE_STATUSES).optional(),
  roadsStatus: z.enum(SERVICE_STATUSES).optional(),
  summary: z.string().trim().max(1000).optional(),
  lastReportSource: z.string().trim().max(200).optional(),
});

// --- Admin: crear reporte oficial (se publica directo) ---
export const adminReportSchema = z.object({
  zoneId: z.number().int().positive(),
  title: z.string().trim().min(4).max(200),
  body: z.string().trim().min(5).max(2000),
  damageLevel: z.enum(DAMAGE_LEVELS).optional(),
  sourceName: z.string().trim().max(200).optional(),
  sourceUrl: z.string().trim().url().max(500).optional().or(z.literal('')),
  reportedAt: z.string().datetime().optional(),
});

// --- Admin: crear/editar refugio ---
export const shelterCreateSchema = z.object({
  zoneId: z.number().int().positive(),
  name: z.string().trim().min(2).max(200),
  address: z.string().trim().max(300).optional(),
  status: z.enum(SHELTER_STATUSES).default('sin_datos'),
  capacity: z.number().int().nonnegative().optional(),
  occupancy: z.number().int().nonnegative().optional(),
  contactPhone: z.string().trim().max(80).optional(),
  servicesOffered: z.string().trim().max(300).optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  sourceName: z.string().trim().max(200).optional(),
  sourceUrl: z.string().trim().url().max(500).optional().or(z.literal('')),
});

export const shelterUpdateSchema = shelterCreateSchema.partial().omit({ zoneId: true });
