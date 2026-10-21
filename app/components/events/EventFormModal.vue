<template>
  <BaseModal
    :is-open="isOpen"
    :title="modalTitle"
    :size="modalSize"
    @close="$emit('close')"
  >
    <form class="event-form" @submit.prevent="handleSubmit">
      <div class="event-section">
        <div class="form-grid-2">
          <div class="form-group">
            <label class="form-label" for="eventType">Tipo de evento *</label>
            <select
              id="eventType"
              v-model="formData.type"
              class="form-select"
              required
              :disabled="isEdit"
            >
              <option v-for="t in eventTypes" :key="t" :value="t">
                {{ t }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label" for="eventDate">Fecha *</label>
            <input
              id="eventDate"
              v-model="formData.date"
              type="date"
              class="form-input"
              required
            />
          </div>
        </div>

        <div class="form-group">
          <label class="form-label" for="eventDesc">Descripción detallada *</label>
          <textarea
            id="eventDesc"
            v-model="formData.description"
            class="form-textarea"
            placeholder="Detalles de la labor, comprador, precio o condiciones"
            rows="3"
            required
          ></textarea>
        </div>
      </div>

      <CalfFormSection
        v-if="!isEdit && formData.type === 'Parto'"
        ref="calfSectionRef"
        :cattle-list="cattleList"
        :event-date="formData.date"
      />

      <div class="modal-actions">
        <button
          type="button"
          class="btn btn--secondary"
          @click="$emit('close')"
        >
          Cancelar
        </button>
        <button
          type="submit"
          class="btn btn--primary"
          :disabled="isSubmitting"
        >
          <span v-if="isSubmitting">Guardando...</span>
          <span v-else>{{ isEdit ? 'Actualizar evento' : 'Guardar evento' }}</span>
        </button>
      </div>
    </form>
  </BaseModal>
</template>

<script setup lang="ts">
import type { FarmEvent } from '~/types/FarmEvent';
import type { Cattle } from '~/types/Cattle';
import BaseModal from '~/components/ui/BaseModal.vue';
import CalfFormSection from '~/components/events/CalfFormSection.vue';
import { EVENT_TYPES } from '~/composables/useFarmEvents';
import { useCattle } from '~/composables/useCattle';

const props = defineProps<{
  isOpen: boolean;
  initialData?: FarmEvent | null;
  isSubmitting?: boolean;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (
    e: 'submit',
    payload: {
      event: Omit<FarmEvent, 'id'>;
      calf?: Omit<Cattle, 'id'>;
    }
  ): void;
}>();

const { cattleList, fetchCattle } = useCattle();

onMounted(() => {
  if (cattleList.value.length === 0) {
    fetchCattle();
  }
});

const isEdit = computed(() => Boolean(props.initialData?.id));
const eventTypes = EVENT_TYPES;

const formData = reactive({
  type: 'Vacuna',
  date: new Date().toISOString().split('T')[0],
  description: '',
});

const calfSectionRef = ref<InstanceType<typeof CalfFormSection> | null>(null);

watch(
  () => props.initialData,
  (val) => {
    if (val) {
      formData.type = val.type || 'Vacuna';
      formData.date = val.date ? val.date.split('T')[0] : new Date().toISOString().split('T')[0];
      formData.description = val.description || '';
    } else {
      formData.type = 'Vacuna';
      formData.date = new Date().toISOString().split('T')[0];
      formData.description = '';
    }
  },
  { immediate: true }
);

const modalTitle = computed(() => {
  if (isEdit.value) return 'Editar Evento de la Finca';
  if (formData.type === 'Parto') return 'Registrar Parto y Nuevo Ternero';
  return 'Registrar Evento de la Finca';
});

const modalSize = computed(() => {
  return !isEdit.value && formData.type === 'Parto' ? 'lg' : 'md';
});

const handleSubmit = () => {
  const eventPayload: Omit<FarmEvent, 'id'> = {
    type: formData.type,
    date: formData.date,
    description: formData.description.trim(),
  };

  let calfPayload: Omit<Cattle, 'id'> | undefined;
  if (!isEdit.value && formData.type === 'Parto' && calfSectionRef.value) {
    calfPayload = calfSectionRef.value.getCalfPayload();
  }

  emit('submit', { event: eventPayload, calf: calfPayload });
};
</script>

<style scoped lang="scss">
.event-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.event-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-grid-2 {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.form-textarea {
  width: 100%;
  resize: vertical;
}

.modal-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.75rem;
  padding-top: 1.25rem;
  border-top: 1px solid var(--border-color);
  margin-top: 0.5rem;
}

@media (max-width: 600px) {
  .form-grid-2 {
    grid-template-columns: 1fr;
  }
}
</style>
