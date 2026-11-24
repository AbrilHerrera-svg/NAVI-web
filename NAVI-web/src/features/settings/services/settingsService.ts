import { apiFetch } from '../../../lib/api';
import type { BusinessInfo, NotificationSetting } from '../types';

// GET/PUT /api/settings/business
// El backend devuelve null si nadie ha guardado nada todavía (negocio nuevo).
export const obtenerNegocio = async (): Promise<BusinessInfo> => {
  const datos = await apiFetch<BusinessInfo | null>('/settings/business');
  return datos ?? { name: '', address: '', phone: '', hours: '' };
};

export const actualizarNegocio = (info: BusinessInfo) =>
  apiFetch<{ ok: boolean }>('/settings/business', { method: 'PUT', body: info });

// GET/PUT /api/settings/notifications
export const obtenerNotificaciones = () => apiFetch<NotificationSetting[]>('/settings/notifications');

export const actualizarNotificaciones = (items: NotificationSetting[]) =>
  apiFetch<{ ok: boolean }>('/settings/notifications', { method: 'PUT', body: { items } });
