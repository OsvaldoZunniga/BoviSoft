import type { FarmEvent } from '~/types/FarmEvent';
import { farmEventService } from '~/services/farmEventService';
import { useToast } from '~/composables/useToast';

export const EVENT_TYPES = [
  'Vacuna',
  'Parto',
  'Venta',
  'Compra',
  'Tratamiento',
  'Otro',
] as const;

export type FarmEventType = (typeof EVENT_TYPES)[number];

export function useFarmEvents() {
  const events = useState<FarmEvent[]>('bovisoft_farm_events_list', () => []);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const { mostrarToast } = useToast();

  const fetchEvents = async () => {
    loading.value = true;
    error.value = null;
    try {
      events.value = await farmEventService.getAll();
    } catch (err: any) {
      error.value = err?.message || 'Error al cargar los eventos';
      mostrarToast('No se pudo cargar la lista de eventos', 'error');
    } finally {
      loading.value = false;
    }
  };

  const createEvent = async (data: Omit<FarmEvent, 'id'>): Promise<FarmEvent | null> => {
    loading.value = true;
    try {
      const created = await farmEventService.create(data);
      events.value.unshift(created);
      mostrarToast('Evento registrado correctamente', 'success');
      return created;
    } catch (err: any) {
      const msg = err?.message || 'Error al registrar el evento';
      mostrarToast(msg, 'error');
      return null;
    } finally {
      loading.value = false;
    }
  };

  const updateEvent = async (id: string, data: Partial<FarmEvent>): Promise<boolean> => {
    loading.value = true;
    try {
      const updated = await farmEventService.update(id, data);
      const index = events.value.findIndex((e) => e.id === id);
      if (index !== -1) {
        events.value[index] = { ...events.value[index], ...updated };
      }
      mostrarToast('Evento actualizado', 'success');
      return true;
    } catch (err: any) {
      const msg = err?.message || 'Error al actualizar el evento';
      mostrarToast(msg, 'error');
      return false;
    } finally {
      loading.value = false;
    }
  };

  const deleteEvent = async (id: string): Promise<boolean> => {
    loading.value = true;
    try {
      await farmEventService.delete(id);
      events.value = events.value.filter((e) => e.id !== id);
      mostrarToast('Evento eliminado', 'info');
      return true;
    } catch (err: any) {
      const msg = err?.message || 'Error al eliminar el evento';
      mostrarToast(msg, 'error');
      return false;
    } finally {
      loading.value = false;
    }
  };

  const groupedEvents = computed(() => {
    const sorted = [...events.value].sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

    const groups: {
      date: string;
      formattedDate: string;
      items: FarmEvent[];
    }[] = [];

    sorted.forEach((event) => {
      const eventDateStr = event.date ? event.date.split('T')[0] : 'Sin fecha';
      let existingGroup = groups.find((g) => g.date === eventDateStr);
      if (!existingGroup) {
        let formattedDate = eventDateStr;
        try {
          const [y, m, d] = eventDateStr.split('-').map(Number);
          const dateObj = new Date(y, m - 1, d);
          formattedDate = new Intl.DateTimeFormat('es-ES', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          }).format(dateObj);
          formattedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
        } catch {
        }

        existingGroup = {
          date: eventDateStr,
          formattedDate,
          items: [],
        };
        groups.push(existingGroup);
      }
      existingGroup.items.push(event);
    });

    return groups;
  });

  return {
    events: readonly(events),
    groupedEvents,
    loading: readonly(loading),
    error: readonly(error),
    eventTypes: EVENT_TYPES,
    fetchEvents,
    createEvent,
    updateEvent,
    deleteEvent,
  };
}
