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
