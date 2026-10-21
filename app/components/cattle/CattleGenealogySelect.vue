<template>
  <div class="genealogy-grid">
    <div class="form-group">
      <label class="form-label" for="motherSelect">Madre (Hembra)</label>
      <select
        id="motherSelect"
        :value="motherId"
        class="form-select"
        @change="$emit('update:motherId', ($event.target as HTMLSelectElement).value)"
      >
        <option value="none">Sin madre registrada / Desconocida</option>
        <option
          v-for="cow in availableMothers"
          :key="cow.id"
          :value="cow.id"
        >
          {{ cow.name }} {{ cow.earTag ? `(Arete #${cow.earTag})` : '' }} - {{ cow.breed }}
        </option>
      </select>
    </div>

    <div class="form-group">
      <label class="form-label" for="fatherSelect">Padre (Macho)</label>
      <select
        id="fatherSelect"
        :value="fatherId"
        class="form-select"
        @change="$emit('update:fatherId', ($event.target as HTMLSelectElement).value)"
      >
        <option value="none">Sin padre registrado / Desconocido</option>
        <option
          v-for="bull in availableFathers"
          :key="bull.id"
          :value="bull.id"
        >
          {{ bull.name }} {{ bull.earTag ? `(Arete #${bull.earTag})` : '' }} - {{ bull.breed }}
        </option>
      </select>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Cattle } from '~/types/Cattle';

const props = defineProps<{
  motherId: string;
  fatherId: string;
  currentId?: string;
  allCattle: readonly Cattle[];
}>();

defineEmits<{
  (e: 'update:motherId', val: string): void;
  (e: 'update:fatherId', val: string): void;
}>();

const availableMothers = computed(() => {
  return props.allCattle.filter((c) => {
    if (props.currentId && c.id === props.currentId) return false;
    const g = c.gender ? c.gender.toLowerCase().trim() : '';
    return g === 'hembra' || g === 'female';
  });
});

const availableFathers = computed(() => {
  return props.allCattle.filter((c) => {
    if (props.currentId && c.id === props.currentId) return false;
    const g = c.gender ? c.gender.toLowerCase().trim() : '';
    return g === 'macho' || g === 'male';
  });
});
</script>

<style scoped lang="scss">
.genealogy-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.25rem;
}

@media (max-width: 640px) {
  .genealogy-grid {
    grid-template-columns: 1fr;
  }
}
</style>
