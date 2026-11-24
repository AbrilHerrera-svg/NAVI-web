import { apiFetch } from '../../../lib/api';
import type { ExtraItem, NewExtraInput, UpdateExtraInput } from '../types';

export const listExtrasApi = (): Promise<ExtraItem[]> => apiFetch<ExtraItem[]>('/extras');

export const createExtraApi = (input: NewExtraInput): Promise<ExtraItem> =>
  apiFetch<ExtraItem>('/extras', { method: 'POST', body: input });

export const updateExtraApi = (id: string, input: UpdateExtraInput): Promise<{ ok: boolean }> =>
  apiFetch(`/extras/${id}`, { method: 'PUT', body: input });

export const deleteExtraApi = (id: string): Promise<{ ok: boolean }> =>
  apiFetch(`/extras/${id}`, { method: 'DELETE' });
