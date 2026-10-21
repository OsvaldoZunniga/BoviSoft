<template>
  <BaseModal
    :is-open="isOpen"
    title="Confirmar Baja de Bovino"
    @close="$emit('cancel')"
  >
    <div v-if="cattle" class="delete-modal-content">
      <p class="delete-modal-text">
        ¿Está seguro de que desea dar de baja al ejemplar
        <strong>{{ cattle.name }}</strong>
        <span v-if="cattle.earTag"> (Arete #{{ cattle.earTag }})</span>
        <span v-else> (Sin arete)</span>?
      </p>

      <div class="delete-modal-note">
        <p>Esta acción cambiará el estado del bovino a <strong>Inactivo</strong> mediante baja lógica, preservando su historial y genealogía en el sistema.</p>
      </div>
    </div>

    <template #footer>
      <button
        type="button"
        class="btn btn--secondary"
        @click="$emit('cancel')"
      >
        Cancelar
      </button>
      <button
        type="button"
        class="btn btn--danger"
        @click="$emit('confirm')"
      >
        Confirmar baja
      </button>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import type { Cattle } from '~/types/Cattle';
import BaseModal from '~/components/ui/BaseModal.vue';

defineProps<{
  isOpen: boolean;
  cattle: Cattle | null;
}>();

defineEmits<{
  (e: 'confirm'): void;
  (e: 'cancel'): void;
}>();
</script>

<style scoped lang="scss">
.delete-modal-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.delete-modal-text {
  font-size: 0.95rem;
  color: var(--text-main);
  line-height: 1.5;
}

.delete-modal-note {
  padding: 0.85rem 1rem;
  border-radius: var(--radius-md);
  background-color: var(--status-danger-bg);
  border: 1px solid var(--status-danger);
  color: var(--status-danger);
  font-size: 0.82rem;
  line-height: 1.45;
}
</style>
