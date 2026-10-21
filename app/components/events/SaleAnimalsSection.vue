<template>
  <div class="sale-animals-section card">
    <div class="section-header">
      <h4 class="section-title">Animales vendidos en esta operación</h4>
      <p class="section-subtitle">
        Indique qué ejemplares formaron parte de la venta. Al guardar, se marcarán automáticamente como vendidos.
      </p>
    </div>

    <div class="pills-container">
      <div
        v-for="cattle in selectedCattle"
        :key="cattle.id"
        class="animal-pill"
      >
        <span class="animal-pill__name">
          {{ cattle.name }}
          <strong v-if="cattle.earTag">(#{{ cattle.earTag }})</strong>
        </span>
        <button
          type="button"
          class="animal-pill__remove"
          title="Quitar de la venta"
          aria-label="Quitar selección"
          @click="removeAnimal(cattle.id!)"
        >
          &times;
        </button>
      </div>

      <div ref="dropdownRef" class="picker-wrapper">
        <button
          type="button"
          class="add-pill-btn"
          @click="togglePicker"
        >
          <span class="plus-symbol">+</span>
          <span>Añadir animal</span>
        </button>

        <div v-if="isPickerOpen" class="picker-menu">
          <input
            v-if="availableCattle.length > 4"
            v-model="searchFilter"
            type="text"
            class="form-input picker-search"
            placeholder="Buscar por nombre o arete..."
            @click.stop
          />

          <div class="picker-options">
            <button
              v-for="animal in filteredAvailableCattle"
              :key="animal.id"
              type="button"
              class="picker-option"
              @click="addAnimal(animal.id!)"
            >
              <div class="picker-option__main">
                <span class="picker-option__name">{{ animal.name }}</span>
                <span v-if="animal.earTag" class="picker-option__tag">Arete #{{ animal.earTag }}</span>
              </div>
              <span class="picker-option__breed">{{ animal.breed }}</span>
            </button>

            <div v-if="filteredAvailableCattle.length === 0" class="picker-empty">
              No hay ejemplares activos disponibles
            </div>
          </div>
        </div>
      </div>
    </div>

    <p v-if="selectedCattleIds.length > 0" class="selection-notice">
      {{ selectedCattleIds.length }} {{ selectedCattleIds.length === 1 ? 'ejemplar pasará' : 'ejemplares pasarán' }} a estado Vendido.
    </p>
  </div>
</template>

<script setup lang="ts">
import type { Cattle } from '~/types/Cattle';

const props = defineProps<{
  cattleList: readonly Cattle[];
}>();

const selectedCattleIds = ref<string[]>([]);
const isPickerOpen = ref(false);
const searchFilter = ref('');
const dropdownRef = ref<HTMLElement | null>(null);

const availableCattle = computed(() => {
  return props.cattleList.filter(
    (c) => c.id && c.statusId === 1 && !selectedCattleIds.value.includes(c.id)
  );
});

const filteredAvailableCattle = computed(() => {
  if (!searchFilter.value.trim()) {
    return availableCattle.value;
  }
  const q = searchFilter.value.toLowerCase().trim();
  return availableCattle.value.filter(
    (c) =>
      c.name.toLowerCase().includes(q) ||
      (c.earTag && c.earTag.toLowerCase().includes(q))
  );
});

const selectedCattle = computed(() => {
  return selectedCattleIds.value
    .map((id) => props.cattleList.find((c) => c.id === id))
    .filter(Boolean) as Cattle[];
});

const togglePicker = () => {
  isPickerOpen.value = !isPickerOpen.value;
  if (isPickerOpen.value) {
    searchFilter.value = '';
  }
};

const addAnimal = (id: string) => {
  if (!selectedCattleIds.value.includes(id)) {
    selectedCattleIds.value.push(id);
  }
  isPickerOpen.value = false;
  searchFilter.value = '';
};

const removeAnimal = (id: string) => {
  selectedCattleIds.value = selectedCattleIds.value.filter((i) => i !== id);
};

const handleClickOutside = (event: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    isPickerOpen.value = false;
  }
};

onMounted(() => {
  if (typeof window !== 'undefined') {
    window.addEventListener('click', handleClickOutside);
  }
});

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('click', handleClickOutside);
  }
});

defineExpose({
  getSoldCattleIds: (): string[] => [...selectedCattleIds.value],
});
</script>

<style scoped lang="scss">
.sale-animals-section {
  padding: 1.25rem;
  background-color: var(--status-sold-bg);
  border: 1px solid var(--status-sold);
  border-radius: var(--radius-md);
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.section-title {
  font-size: 0.98rem;
  font-weight: 700;
  color: var(--status-sold);
  margin: 0;
}

.section-subtitle {
  font-size: 0.78rem;
  color: var(--text-secondary);
  margin: 0.2rem 0 0 0;
}

.pills-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
  align-items: center;
}

.animal-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.35rem 0.8rem;
  border-radius: var(--radius-pill);
  background-color: var(--bg-surface);
  color: var(--status-sold);
  border: 1px solid var(--status-sold);
  font-size: 0.85rem;
  font-weight: 600;
  box-shadow: var(--shadow-sm);
  animation: fadeIn 0.2s ease;

  &__name {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;

    strong {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 0.78rem;
    }
  }

  &__remove {
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    font-size: 1.2rem;
    line-height: 1;
    color: var(--status-sold);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0.7;
    transition: opacity 0.2s ease, transform 0.2s ease;

    &:hover {
      opacity: 1;
      transform: scale(1.15);
    }
  }
}

.picker-wrapper {
  position: relative;
  display: inline-block;
}

.add-pill-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.38rem 0.9rem;
  border-radius: var(--radius-pill);
  border: 1.5px dashed var(--status-sold);
  background-color: transparent;
  color: var(--status-sold);
  font-size: 0.84rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: var(--bg-surface);
    border-style: solid;
    transform: translateY(-1px);
  }

  .plus-symbol {
    font-size: 1rem;
    line-height: 1;
  }
}

.picker-menu {
  position: absolute;
  top: calc(100% + 0.4rem);
  left: 0;
  z-index: 1000;
  width: 280px;
  max-height: 240px;
  background-color: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-lg);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: dropdownIn 0.2s ease;
}

.picker-search {
  padding: 0.5rem 0.75rem;
  font-size: 0.82rem;
  border: none;
  border-bottom: 1px solid var(--border-color);
  border-radius: 0;
  outline: none;
  background-color: var(--bg-surface-elevated);
}

.picker-options {
  overflow-y: auto;
  max-height: 190px;
  display: flex;
  flex-direction: column;
}

.picker-option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.6rem 0.85rem;
  border: none;
  background: none;
  cursor: pointer;
  text-align: left;
  border-bottom: 1px solid var(--border-color-subtle);
  transition: background-color 0.15s ease;

  &:hover {
    background-color: var(--bg-surface-hover);
  }

  &:last-child {
    border-bottom: none;
  }

  &__main {
    display: flex;
    align-items: center;
    gap: 0.4rem;
  }

  &__name {
    font-size: 0.88rem;
    font-weight: 600;
    color: var(--text-main);
  }

  &__tag {
    font-size: 0.75rem;
    font-family: 'Space Grotesk', sans-serif;
    color: var(--color-primary);
    font-weight: 700;
  }

  &__breed {
    font-size: 0.74rem;
    color: var(--text-muted);
  }
}

.picker-empty {
  padding: 1rem;
  font-size: 0.8rem;
  color: var(--text-muted);
  text-align: center;
  font-style: italic;
}

.selection-notice {
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--status-sold);
  margin: 0;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes dropdownIn {
  from {
    opacity: 0;
    transform: translateY(-6px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
