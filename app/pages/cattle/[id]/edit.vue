<template>
  <div class="container animate-fade-in">
    <div class="form-page-header">
      <h1 class="page-title">Editar Datos del Bovino</h1>
      <p class="page-subtitle">Modificación de ficha técnica y asignación</p>
    </div>

    <div v-if="loading && !cattle" class="loading-state">
      <p>Cargando información del ejemplar...</p>
    </div>

    <div v-else-if="cattle" class="form-wrapper">
      <CattleForm
        :initial-data="cattle"
        :current-id="cattleId"
        :is-edit="true"
        :is-submitting="isSubmitting"
        @submit="handleSubmit"
      />
    </div>

    <EmptyState
      v-else
      title="Bovino no encontrado"
      description="No se pudo encontrar el ejemplar para editar."
    >
      <template #action>
        <NuxtLink to="/cattle" class="btn btn--primary btn--sm">
          Regresar al listado
        </NuxtLink>
      </template>
    </EmptyState>
  </div>
</template>

<script setup lang="ts">
import CattleForm from '~/components/cattle/CattleForm.vue';
import EmptyState from '~/components/ui/EmptyState.vue';
import { useCattle } from '~/composables/useCattle';

const route = useRoute();
const cattleId = route.params.id as string;

const { cattleList, fetchCattle, updateCattle, loading } = useCattle();
const isSubmitting = ref(false);

onMounted(async () => {
  if (cattleList.value.length === 0) {
    await fetchCattle();
  }
});

const cattle = computed(() => {
  return cattleList.value.find((c) => c.id === cattleId);
});

const handleSubmit = async (payload: FormData) => {
  isSubmitting.value = true;
  try {
    const success = await updateCattle(cattleId, payload);
    if (success) {
      await navigateTo(`/cattle/${cattleId}`);
    }
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style scoped lang="scss">
.form-page-header {
  margin-bottom: 1.5rem;
}

.page-title {
  font-size: 1.65rem;
  font-weight: 700;
  color: var(--text-main);
  margin: 0;
}

.page-subtitle {
  font-size: 0.9rem;
  color: var(--text-muted);
  margin-top: 0.25rem;
}

.form-wrapper {
  max-width: 840px;
}

.loading-state {
  padding: 3rem;
  text-align: center;
  color: var(--text-muted);
}
</style>
