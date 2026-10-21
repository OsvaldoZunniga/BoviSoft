<template>
  <form class="cattle-form card" @submit.prevent="handleSubmit">
    <div class="form-grid">
      <div class="form-group">
        <label class="form-label" for="earTag">Número de arete</label>
        <input
          id="earTag"
          v-model="formData.earTag"
          type="text"
          class="form-input"
          placeholder="Ej. 1042"
        />
        <span class="form-helper">Opcional para terneros recién nacidos</span>
      </div>

      <div class="form-group">
        <label class="form-label" for="name">Nombre del animal *</label>
        <input
          id="name"
          v-model="formData.name"
          type="text"
          class="form-input"
          placeholder="Ej. Campanita, Torbellino"
          required
        />
      </div>

      <div class="form-group">
        <label class="form-label" for="gender">Género *</label>
        <select
          id="gender"
          v-model="formData.gender"
          class="form-select"
          required
        >
          <option value="" disabled>Seleccione el género</option>
          <option value="Hembra">Hembra</option>
          <option value="Macho">Macho</option>
        </select>
      </div>

      <div class="form-group">
        <label class="form-label" for="breed">Raza *</label>
        <select
          id="breed"
          v-model="formData.breed"
          class="form-select"
          required
        >
          <option value="" disabled>Seleccione una raza</option>
          <option value="Brahman">Brahman</option>
          <option value="Gyr">Gyr</option>
          <option value="Girolando">Girolando</option>
          <option value="Guzerá">Guzerá</option>
          <option value="Nelore">Nelore</option>
          <option value="Holstein">Holstein</option>
          <option value="Pardo Suizo">Pardo Suizo</option>
          <option value="Jersey">Jersey</option>
          <option value="Angus">Angus</option>
          <option value="Simmental">Simmental</option>
          <option value="Brangus">Brangus</option>
          <option value="Cruza / Mestizo">Cruza / Mestizo</option>
        </select>
      </div>

      <div class="form-group">
        <label class="form-label" for="birthday">Fecha de nacimiento *</label>
        <input
          id="birthday"
          v-model="formData.birthday"
          type="date"
          class="form-input"
          required
        />
      </div>

      <div class="form-group">
        <label class="form-label" for="weight">Peso actual (kg) *</label>
        <input
          id="weight"
          v-model.number="formData.weight"
          type="number"
          step="0.5"
          min="1"
          class="form-input"
          placeholder="Ej. 350.5"
          required
        />
      </div>

      <div class="form-group">
        <label class="form-label" for="ownerId">Propietario</label>
        <select
          id="ownerId"
          v-model="formData.ownerId"
          class="form-select"
        >
          <option value="">Sin asignar</option>
          <option
            v-for="owner in OWNERS"
            :key="owner.id"
            :value="owner.id"
          >
            {{ owner.name }}
          </option>
        </select>
      </div>

      <div class="form-group">
        <label class="form-label" for="statusId">Estado inicial</label>
        <select
          id="statusId"
          v-model.number="formData.statusId"
          class="form-select"
        >
          <option :value="1">Activo</option>
          <option :value="2">Vendido</option>
          <option :value="0">Inactivo</option>
        </select>
      </div>

      <div class="form-group form-group--full">
        <CattleGenealogySelect
          :mother-id="formData.motherId"
          :father-id="formData.fatherId"
          :current-id="currentId"
          :all-cattle="cattleList"
          @update:mother-id="formData.motherId = $event"
          @update:father-id="formData.fatherId = $event"
        />
      </div>

      <div class="form-group form-group--full">
        <CattleImageUploader
          :initial-image="initialData?.image || initialData?.imagePath"
          @update:file="selectedImageFile = $event"
        />
      </div>
    </div>

    <div class="form-actions">
      <NuxtLink to="/cattle" class="btn btn--secondary">
        Cancelar
      </NuxtLink>
      <button
        type="submit"
        class="btn btn--primary"
        :disabled="isSubmitting"
      >
        <span v-if="isSubmitting">Guardando...</span>
        <span v-else>{{ isEdit ? 'Actualizar ejemplar' : 'Registrar ejemplar' }}</span>
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import type { Cattle } from '~/types/Cattle';
import { OWNERS } from '~/constants/owners';
import CattleGenealogySelect from '~/components/cattle/CattleGenealogySelect.vue';
import CattleImageUploader from '~/components/cattle/CattleImageUploader.vue';
import { useCattle } from '~/composables/useCattle';

const props = defineProps<{
  initialData?: Cattle | null;
  currentId?: string;
  isEdit?: boolean;
  isSubmitting?: boolean;
}>();

const emit = defineEmits<{
  (e: 'submit', payload: FormData): void;
}>();

const { cattleList, fetchCattle } = useCattle();

onMounted(() => {
  if (cattleList.value.length === 0) {
    fetchCattle();
  }
});

const formData = reactive({
  earTag: props.initialData?.earTag || '',
  name: props.initialData?.name || '',
  breed: props.initialData?.breed || 'Brahman',
  gender: props.initialData?.gender || 'Hembra',
  birthday: props.initialData?.birthday || new Date().toISOString().split('T')[0],
  weight: props.initialData?.weight || 50,
  motherId: props.initialData?.motherId || 'none',
  fatherId: props.initialData?.fatherId || 'none',
  statusId: props.initialData?.statusId ?? 1,
  ownerId: props.initialData?.ownerId || '',
});

const selectedImageFile = ref<File | null>(null);

const handleSubmit = () => {
  const payload = new FormData();
  if (formData.earTag.trim()) {
    payload.append('earTag', formData.earTag.trim());
  }
  payload.append('name', formData.name.trim());
  payload.append('breed', formData.breed);
  payload.append('gender', formData.gender);
  payload.append('birthday', formData.birthday);
  payload.append('weight', String(formData.weight));
  payload.append('statusId', String(formData.statusId));
  payload.append('motherId', formData.motherId || 'none');
  payload.append('fatherId', formData.fatherId || 'none');

  if (formData.ownerId.trim()) {
    payload.append('ownerId', formData.ownerId.trim());
  }

  if (selectedImageFile.value) {
    payload.append('image', selectedImageFile.value);
  }

  emit('submit', payload);
};
</script>

<style scoped lang="scss">
.cattle-form {
  padding: 2rem;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.25rem;
}

.form-group--full {
  grid-column: span 2;
}

.form-helper {
  font-size: 0.76rem;
  color: var(--text-muted);
  margin-top: 0.25rem;
  display: block;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--border-color);
}

@media (max-width: 640px) {
  .cattle-form {
    padding: 1.25rem;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .form-group--full {
    grid-column: span 1;
  }
}
</style>
