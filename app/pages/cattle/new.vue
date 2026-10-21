<template>
  <div class="container animate-fade-in">
    <div class="form-page-header">
      <h1 class="page-title">Registrar Nuevo Bovino</h1>
      <p class="page-subtitle">Ingrese los datos zootécnicos del ejemplar</p>
    </div>

    <div class="form-wrapper">
      <CattleForm
        :is-submitting="isSubmitting"
        @submit="handleSubmit"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import CattleForm from '~/components/cattle/CattleForm.vue';
import { useCattle } from '~/composables/useCattle';

const { createCattle } = useCattle();
const isSubmitting = ref(false);

const handleSubmit = async (payload: FormData) => {
  isSubmitting.value = true;
  try {
    const created = await createCattle(payload);
    if (created) {
      await navigateTo('/cattle');
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
</style>
