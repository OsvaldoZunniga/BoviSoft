<template>
  <div class="container animate-fade-in">
    <div class="page-header">
      <div>
        <h1 class="page-title">Eventos de la Finca</h1>
        <p class="page-subtitle">Agenda en línea de labores, tratamientos, partos y vacunaciones</p>
      </div>

      <button type="button" class="btn btn--primary" @click="openCreateModal">
        <IconPlus />
        Registrar evento
      </button>
    </div>

    <div class="events-toolbar">
      <div class="filter-pills">
        <button
          type="button"
          :class="['pill-btn', { 'pill-btn--active': selectedType === null }]"
          @click="selectedType = null"
        >
          Todos
        </button>
        <button
          v-for="t in eventTypes"
          :key="t"
          type="button"
          :class="['pill-btn', { 'pill-btn--active': selectedType === t }]"
          @click="selectedType = t"
        >
          {{ t }}
        </button>
      </div>
    </div>

    <div v-if="loading && events.length === 0" class="loading-state">
      <p>Cargando eventos de la finca...</p>
    </div>

    <div v-else-if="filteredGroups.length > 0" class="timeline-container">
      <div
        v-for="group in filteredGroups"
        :key="group.date"
        class="timeline-group"
      >
        <div class="timeline-group__header">
          <IconCalendar class="timeline-calendar-icon" />
          <h2 class="timeline-group__date">{{ group.formattedDate }}</h2>
          <span class="timeline-group__count">{{ group.items.length }}</span>
        </div>

        <div class="timeline-group__items">
          <EventInlineItem
            v-for="item in group.items"
            :key="item.id"
            :event="item"
            @edit="openEditModal(item)"
            @delete="handleDeleteEvent(item)"
          />
        </div>
      </div>
    </div>

    <EmptyState
      v-else
      title="No hay eventos registrados"
      description="No se encontraron eventos para el filtro seleccionado. Registre una nueva labor para iniciar el historial."
    >
      <template #action>
        <button type="button" class="btn btn--primary btn--sm" @click="openCreateModal">
          <IconPlus />
          Registrar primer evento
        </button>
      </template>
    </EmptyState>

    <EventFormModal
      :is-open="isModalOpen"
      :is-submitting="isSubmitting"
      :initial-data="selectedEventToEdit"
      @close="closeModal"
      @submit="handleEventSubmit"
    />
  </div>
</template>

<script setup lang="ts">
import type { FarmEvent } from '~/types/FarmEvent';
import type { Cattle } from '~/types/Cattle';
import EventInlineItem from '~/components/events/EventInlineItem.vue';
import EventFormModal from '~/components/events/EventFormModal.vue';
import EmptyState from '~/components/ui/EmptyState.vue';
import IconPlus from '~/components/icons/IconPlus.vue';
import IconCalendar from '~/components/icons/IconCalendar.vue';
import { useFarmEvents } from '~/composables/useFarmEvents';
import { useCattle } from '~/composables/useCattle';

const {
  events,
  groupedEvents,
  loading,
  eventTypes,
  fetchEvents,
  createEvent,
  updateEvent,
  deleteEvent,
} = useFarmEvents();

const { createCattle } = useCattle();

const selectedType = ref<string | null>(null);
const isModalOpen = ref(false);
const isSubmitting = ref(false);
const selectedEventToEdit = ref<FarmEvent | null>(null);

onMounted(() => {
  fetchEvents();
});

const filteredGroups = computed(() => {
  if (!selectedType.value) {
    return groupedEvents.value;
  }
  return groupedEvents.value
    .map((g) => ({
      ...g,
      items: g.items.filter((item) => item.type === selectedType.value),
    }))
    .filter((g) => g.items.length > 0);
});

const openCreateModal = () => {
  selectedEventToEdit.value = null;
  isModalOpen.value = true;
};

const openEditModal = (event: FarmEvent) => {
  selectedEventToEdit.value = event;
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
  selectedEventToEdit.value = null;
};

const handleEventSubmit = async (payload: {
  event: Omit<FarmEvent, 'id'>;
  calf?: Omit<Cattle, 'id'>;
}) => {
  isSubmitting.value = true;
  try {
    if (selectedEventToEdit.value?.id) {
      await updateEvent(selectedEventToEdit.value.id, payload.event);
    } else {
      await createEvent(payload.event);
      if (payload.calf) {
        await createCattle(payload.calf);
      }
    }
    closeModal();
  } finally {
    isSubmitting.value = false;
  }
};

const handleDeleteEvent = async (event: FarmEvent) => {
  if (!event.id) return;
  const confirmed = window.confirm(`¿Desea eliminar el evento "${event.type}" del ${event.date}?`);
  if (confirmed) {
    await deleteEvent(event.id);
  }
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

.events-toolbar {
  margin-bottom: 2rem;
}

.filter-pills {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.pill-btn {
  padding: 0.45rem 1.1rem;
  border-radius: var(--radius-pill);
  border: 1px solid var(--border-color);
  background-color: var(--bg-surface);
  color: var(--text-secondary);
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: var(--color-primary);
    color: var(--text-main);
  }

  &--active {
    background-color: var(--color-primary);
    color: var(--text-inverse);
    border-color: var(--color-primary);

    &:hover {
      background-color: var(--color-primary-hover);
      color: var(--text-inverse);
    }
  }
}

.timeline-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.timeline-group {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;

  &__header {
    display: flex;
    align-items: center;
    gap: 0.65rem;
    padding-bottom: 0.5rem;
    border-bottom: 2px solid var(--border-color);
  }

  &__date {
    font-size: 1.05rem;
    font-weight: 700;
    color: var(--text-main);
    margin: 0;
  }

  &__count {
    font-size: 0.75rem;
    font-weight: 700;
    padding: 0.15rem 0.5rem;
    background-color: var(--color-primary-subtle);
    color: var(--color-primary);
    border-radius: var(--radius-pill);
  }

  &__items {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }
}

.timeline-calendar-icon {
  width: 18px;
  height: 18px;
  color: var(--color-primary);
}

.loading-state {
  padding: 3rem 0;
  text-align: center;
  color: var(--text-muted);
}
</style>
