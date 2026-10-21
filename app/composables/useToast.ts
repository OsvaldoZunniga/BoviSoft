import type { ToastItem, ToastType } from '~/types/Toast';

let toastCounter = 0;

export function useToast() {
  const toasts = useState<ToastItem[]>('bovisoft_toasts', () => []);

  const eliminarToast = (id: number) => {
    const index = toasts.value.findIndex((t) => t.id === id);
    if (index !== -1) {
      toasts.value.splice(index, 1);
    }
  };

  const mostrarToast = (
    mensaje: string,
    tipo: ToastType = 'success',
    duracion = 3500
  ): number => {
    const id = ++toastCounter;
    const toast: ToastItem = { id, mensaje, tipo, duracion };
    toasts.value.push(toast);

    if (duracion > 0 && typeof window !== 'undefined') {
      setTimeout(() => {
        eliminarToast(id);
      }, duracion);
    }

    return id;
  };

  return {
    toasts: readonly(toasts),
    mostrarToast,
    eliminarToast,
  };
}
