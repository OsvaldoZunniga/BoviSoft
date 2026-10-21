export type ToastType = 'success' | 'error' | 'info';

export interface ToastItem {
  id: number;
  mensaje: string;
  tipo: ToastType;
  duracion?: number;
}
