<template>
  <div class="container animate-fade-in">
    <div class="page-header">
      <div>
        <h1 class="page-title">Control de Ganado Bovino</h1>
        <p class="page-subtitle">Inventario, genealogía y seguimiento de ejemplares</p>
      </div>

      <NuxtLink to="/cattle/new" class="btn btn--primary">
        <IconPlus />
        Registrar bovino
      </NuxtLink>
    </div>

    <div class="stats-grid">
      <div class="stat-card card">
        <span class="stat-card__label">Total Hato</span>
        <span class="stat-card__value">{{ cattleList.length }}</span>
      </div>
      <div class="stat-card card">
        <span class="stat-card__label">Activos</span>
        <span class="stat-card__value stat-card__value--active">{{ activeCount }}</span>
      </div>
      <div class="stat-card card">
        <span class="stat-card__label">Vendidos</span>
        <span class="stat-card__value stat-card__value--sold">{{ soldCount }}</span>
      </div>
    </div>

    <div class="toolbar">
      <div class="toolbar__search">
        <SearchBar
          :model-value="searchQuery"
          placeholder="Buscar por arete o nombre..."
          :total="cattleList.length"
          :visible="filteredCattle.length"
          @update:model-value="searchQuery = $event"
        />
      </div>

      <div class="toolbar__filters">
        <select v-model="statusFilter" class="form-select toolbar__select">
          <option :value="null">Todos los estados</option>
          <option :value="1">Activos</option>
          <option :value="0">Inactivos</option>
          <option :value="2">Vendidos</option>
        </select>

        <select v-model="ownerFilter" class="form-select toolbar__select">
          <option :value="null">Todos los propietarios</option>
          <option value="unassigned">Sin asignar</option>
          <option v-for="owner in OWNERS" :key="owner.id" :value="owner.id">
            {{ owner.name }}
          </option>
        </select>

        <select v-model="breedFilter" class="form-select toolbar__select">
          <option :value="null">Todas las razas</option>
          <option v-for="breed in uniqueBreeds" :key="breed" :value="breed">
            {{ breed }}
          </option>
        </select>
      </div>
    </div>

    <div v-if="loading && cattleList.length === 0" class="loading-state">
      <p>Cargando información del ganado...</p>
    </div>

    <div v-else-if="filteredCattle.length > 0" class="cattle-grid">
      <CattleCard
        v-for="cattle in filteredCattle"
        :key="cattle.id"
        :cattle="cattle"
      />
    </div>

    <EmptyState
      v-else
      title="No se encontraron bovinos"
      description="Pruebe cambiando los términos de búsqueda o los filtros seleccionados."
    >
      <template #action>
        <button
          type="button"
          class="btn btn--secondary btn--sm"
          @click="clearFilters"
        >
          Limpiar filtros
        </button>
      </template>
    </EmptyState>
  </div>
</template>

<script setup lang="ts">
import SearchBar from '~/components/SearchBar.vue';
import CattleCard from '~/components/cattle/CattleCard.vue';
import EmptyState from '~/components/ui/EmptyState.vue';
import IconPlus from '~/components/icons/IconPlus.vue';
import { useCattle } from '~/composables/useCattle';
import { OWNERS } from '~/constants/owners';

const {
  cattleList,
  filteredCattle,
  loading,
  searchQuery,
  statusFilter,
  ownerFilter,
  breedFilter,
  fetchCattle,
} = useCattle();

statusFilter.value = 1;

onMounted(() => {
  fetchCattle();
});

const activeCount = computed(
  () => cattleList.value.filter((c) => c.statusId === 1).length
);

const soldCount = computed(
  () => cattleList.value.filter((c) => c.statusId === 2).length
);

const uniqueBreeds = computed(() => {
  const breeds = cattleList.value.map((c) => c.breed).filter(Boolean);
  return Array.from(new Set(breeds));
});

const clearFilters = () => {
  searchQuery.value = '';
  statusFilter.value = null;
  ownerFilter.value = null;
  breedFilter.value = null;
};
</script>

<style scoped lang="scss">
.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.page-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--text-main);
  letter-spacing: -0.02em;
  margin: 0;
}

.page-subtitle {
  color: var(--text-muted);
  font-size: 0.95rem;
  margin-top: 0.25rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.25rem;
  margin-bottom: 1.5rem;
}

.stat-card {
  padding: 1.15rem 1.4rem;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;

  &__label {
    font-size: 0.82rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: var(--text-muted);
  }

  &__value {
    font-size: 2rem;
    font-weight: 700;
    font-family: 'Space Grotesk', sans-serif;
    color: var(--text-main);

    &--active {
      color: var(--status-active);
    }

    &--sold {
      color: var(--status-sold);
    }
  }
}

.toolbar {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  align-items: center;

  &__search {
    flex: 1;
    min-width: 280px;
  }

  &__filters {
    display: flex;
    gap: 0.75rem;
    flex-wrap: wrap;
  }

  &__select {
    width: auto;
    min-width: 170px;
  }
}

.cattle-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  gap: 1.25rem;
}

.loading-state {
  text-align: center;
  padding: 3rem 0;
  color: var(--text-muted);
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }

  .cattle-grid {
    grid-template-columns: 1fr;
  }

  .toolbar {
    flex-direction: column;
    align-items: stretch;

    &__filters {
      flex-direction: column;
    }

    &__select {
      width: 100%;
    }
  }
}
</style>
