import type { Cattle } from '~/types/Cattle';
import { cattleService } from '~/services/cattleService';
import { useToast } from '~/composables/useToast';

export function useCattle() {
  const cattleList = useState<Cattle[]>('bovisoft_cattle_list', () => []);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const searchQuery = ref('');
  const statusFilter = ref<number | null>(null);
  const ownerFilter = ref<string | null>(null);
  const breedFilter = ref<string | null>(null);

  const { mostrarToast } = useToast();

  const fetchCattle = async () => {
    loading.value = true;
    error.value = null;
    try {
      cattleList.value = await cattleService.getAll();
    } catch (err: any) {
      error.value = err?.message || 'Error al cargar la lista de bovinos';
      mostrarToast('No se pudo conectar con el servidor de ganado', 'error');
    } finally {
      loading.value = false;
    }
  };

  const filteredCattle = computed(() => {
    return cattleList.value.filter((cattle) => {
      if (searchQuery.value.trim()) {
        const query = searchQuery.value.toLowerCase().trim();
        const matchesName = cattle.name?.toLowerCase().includes(query) ?? false;
        const matchesEarTag = cattle.earTag?.toLowerCase().includes(query) ?? false;
        if (!matchesName && !matchesEarTag) {
          return false;
        }
      }

      if (statusFilter.value !== null) {
        if (cattle.statusId !== statusFilter.value) {
          return false;
        }
      }

      if (ownerFilter.value !== null && ownerFilter.value !== '') {
        if (ownerFilter.value === 'unassigned') {
          if (cattle.ownerId && cattle.ownerId.trim() !== '') {
            return false;
          }
        } else {
          if (cattle.ownerId !== ownerFilter.value) {
            return false;
          }
        }
      }

      if (breedFilter.value !== null && breedFilter.value !== '') {
        if (cattle.breed !== breedFilter.value) {
          return false;
        }
      }

      return true;
    });
  });

  const getCattleById = (id: string): Cattle | undefined => {
    return cattleList.value.find((c) => c.id === id);
  };

  const createCattle = async (data: Omit<Cattle, 'id'> | FormData): Promise<Cattle | null> => {
    loading.value = true;
    try {
      const created = await cattleService.create(data);
      cattleList.value.unshift(created);
      mostrarToast('Bovino registrado exitosamente', 'success');
      return created;
    } catch (err: any) {
      const msg = err?.message || 'Error al registrar el bovino';
      mostrarToast(msg, 'error');
      return null;
    } finally {
      loading.value = false;
    }
  };

  const updateCattle = async (id: string, data: Partial<Cattle> | FormData): Promise<boolean> => {
    loading.value = true;
    try {
      const updated = await cattleService.update(id, data);
      const index = cattleList.value.findIndex((c) => c.id === id);
      if (index !== -1) {
        cattleList.value[index] = { ...cattleList.value[index], ...updated };
      }
      mostrarToast('Datos del bovino actualizados', 'success');
      return true;
    } catch (err: any) {
      const msg = err?.message || 'Error al actualizar el bovino';
      mostrarToast(msg, 'error');
      return false;
    } finally {
      loading.value = false;
    }
  };

  const updateCattleImage = async (id: string, file: File): Promise<boolean> => {
    loading.value = true;
    try {
      const updated = await cattleService.updateImage(id, file);
      const index = cattleList.value.findIndex((c) => c.id === id);
      if (index !== -1) {
        cattleList.value[index] = { ...cattleList.value[index], ...updated };
      }
      mostrarToast('Foto del ejemplar actualizada', 'success');
      return true;
    } catch (err: any) {
      const msg = err?.message || 'Error al actualizar la foto';
      mostrarToast(msg, 'error');
      return false;
    } finally {
      loading.value = false;
    }
  };

  const deleteCattle = async (id: string): Promise<boolean> => {
    loading.value = true;
    try {
      await cattleService.delete(id);
      const index = cattleList.value.findIndex((c) => c.id === id);
      if (index !== -1) {
        cattleList.value[index].statusId = 0;
      }
      mostrarToast('Bovino dado de baja lógicamente', 'info');
      return true;
    } catch (err: any) {
      const msg = err?.message || 'Error al dar de baja al bovino';
      mostrarToast(msg, 'error');
      return false;
    } finally {
      loading.value = false;
    }
  };

  return {
    cattleList: readonly(cattleList),
    filteredCattle,
    loading: readonly(loading),
    error: readonly(error),
    searchQuery,
    statusFilter,
    ownerFilter,
    breedFilter,
    fetchCattle,
    getCattleById,
    createCattle,
    updateCattle,
    updateCattleImage,
    deleteCattle,
  };
}
