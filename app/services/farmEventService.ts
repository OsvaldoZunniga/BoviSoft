import { apiFetch } from './apiClient';
import type { FarmEvent } from '~/types/FarmEvent';

export const farmEventService = {
  async getAll(): Promise<FarmEvent[]> {
    return apiFetch<FarmEvent[]>('/farmEvents/');
  },

  async getById(id: string): Promise<FarmEvent> {
    return apiFetch<FarmEvent>(`/farmEvents/${id}`);
  },

  async create(event: Omit<FarmEvent, 'id'>): Promise<FarmEvent> {
    return apiFetch<FarmEvent>('/farmEvents/', {
      method: 'POST',
      body: event,
    });
  },

  async update(id: string, event: Partial<FarmEvent>): Promise<FarmEvent> {
    return apiFetch<FarmEvent>(`/farmEvents/${id}`, {
      method: 'PUT',
      body: event,
    });
  },

  async delete(id: string): Promise<void> {
    return apiFetch<void>(`/farmEvents/${id}`, {
      method: 'DELETE',
    });
  },
};
