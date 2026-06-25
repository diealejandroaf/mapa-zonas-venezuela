import type { DamageLevel, ServiceStatus, ShelterStatus } from './types';

// Colores y etiquetas por nivel de daño (usados en mapa, badges y leyenda).
export const DAMAGE: Record<DamageLevel, { label: string; color: string; text: string }> = {
  alto: { label: 'Alto', color: '#dc2626', text: '#fff' },
  medio: { label: 'Medio', color: '#f59e0b', text: '#1f2937' },
  bajo: { label: 'Bajo', color: '#16a34a', text: '#fff' },
  sin_datos: { label: 'Sin datos', color: '#9ca3af', text: '#fff' },
};

export const SERVICE: Record<ServiceStatus, { label: string; color: string }> = {
  normal: { label: 'Normal', color: '#16a34a' },
  intermitente: { label: 'Intermitente', color: '#f59e0b' },
  sin_servicio: { label: 'Sin servicio', color: '#dc2626' },
  sin_datos: { label: 'Sin datos', color: '#9ca3af' },
};

export const SHELTER: Record<ShelterStatus, { label: string; color: string }> = {
  abierto: { label: 'Abierto', color: '#16a34a' },
  lleno: { label: 'Lleno', color: '#f59e0b' },
  cerrado: { label: 'Cerrado', color: '#dc2626' },
  sin_datos: { label: 'Sin datos', color: '#9ca3af' },
};

// Servicios mostrados en la ficha de zona, en orden.
export const SERVICE_FIELDS: { key: keyof ServiceFieldMap; label: string }[] = [
  { key: 'powerStatus', label: 'Luz' },
  { key: 'waterStatus', label: 'Agua' },
  { key: 'signalStatus', label: 'Señal' },
  { key: 'roadsStatus', label: 'Vías' },
];

type ServiceFieldMap = {
  powerStatus: ServiceStatus;
  waterStatus: ServiceStatus;
  signalStatus: ServiceStatus;
  roadsStatus: ServiceStatus;
};

export function formatDate(iso: string | null): string {
  if (!iso) return 'Sin fecha';
  return new Date(iso).toLocaleString('es-VE', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}
