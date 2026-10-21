import { apiFetch } from './apiClient';
import type { Cattle } from '~/types/Cattle';

export const cattleService = {
  async getAll(): Promise<Cattle[]> {
    return apiFetch<Cattle[]>('/cattle/');
  },

  async getById(id: string): Promise<Cattle> {
    return apiFetch<Cattle>(`/cattle/${id}`);
  },

  async create(cattle: Omit<Cattle, 'id'> | FormData): Promise<Cattle> {
    return apiFetch<Cattle>('/cattle/', {
      method: 'POST',
      body: cattle,
    });
  },

  async update(id: string, cattle: Partial<Cattle> | FormData): Promise<Cattle> {
    return apiFetch<Cattle>(`/cattle/${id}`, {
      method: 'PUT',
      body: cattle,
    });
  },

  async updateImage(id: string, file: File): Promise<Cattle> {
    const formData = new FormData();
    formData.append('image', file);
    return apiFetch<Cattle>(`/cattle/${id}/image`, {
      method: 'POST',
      body: formData,
    });
  },

  async uploadImage(file: File): Promise<{ imageUrl: string }> {
    const formData = new FormData();
    formData.append('image', file);
    return apiFetch<{ imageUrl: string }>('/cattle/upload-image', {
      method: 'POST',
      body: formData,
    });
  },


  async delete(id: string): Promise<void> {
    return apiFetch<void>(`/cattle/${id}/destroy`, {
      method: 'DELETE',
    });
  },
};
