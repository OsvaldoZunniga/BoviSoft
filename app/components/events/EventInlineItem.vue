<template>
  <div :class="['event-inline-item', `event-inline-item--${typeClass}`]">
    <div class="event-inline-item__type-col">
      <span class="event-type-chip">{{ event.type }}</span>
    </div>

    <div class="event-inline-item__desc-col">
      <p class="event-desc">{{ event.description }}</p>
    </div>

    <div class="event-inline-item__date-col">
      <span class="event-date">{{ formattedDate }}</span>
    </div>

    <div class="event-inline-item__actions-col">
      <button
        type="button"
        class="btn btn--secondary btn--sm btn--icon-only"
        title="Editar evento"
        aria-label="Editar evento"
        @click="$emit('edit', event)"
      >
        <IconEdit />
      </button>
      <button
        type="button"
        class="btn btn--danger btn--sm btn--icon-only"
        title="Eliminar evento"
        aria-label="Eliminar evento"
        @click="$emit('delete', event)"
      >
        <IconTrash />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FarmEvent } from '~/types/FarmEvent';
import IconEdit from '~/components/icons/IconEdit.vue';
import IconTrash from '~/components/icons/IconTrash.vue';

const props = defineProps<{
  event: FarmEvent;
}>();

defineEmits<{
  (e: 'edit', event: FarmEvent): void;
  (e: 'delete', event: FarmEvent): void;
}>();

const typeClass = computed(() => {
  switch (props.event.type?.toLowerCase()) {
    case 'vacuna':
      return 'vacuna';
    case 'parto':
      return 'parto';
    case 'venta':
      return 'venta';
    case 'tratamiento':
      return 'tratamiento';
    default:
      return 'otro';
  }
});

const formattedDate = computed(() => {
  if (!props.event.date) return 'Sin fecha';
  try {
    const [y, m, d] = props.event.date.split('T')[0].split('-').map(Number);
    const dateObj = new Date(y, m - 1, d);
    return new Intl.DateTimeFormat('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(dateObj);
  } catch {
    return props.event.date;
  }
});
</script>

<style scoped lang="scss">
.event-inline-item {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  padding: 1rem 1.25rem;
  background-color: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-left-width: 4px;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: var(--shadow-md);
  }

  &--vacuna {
    border-left-color: var(--color-primary);
    .event-type-chip {
      background-color: var(--color-primary-subtle);
      color: var(--color-primary);
    }
  }

  &--parto {
    border-left-color: #2e7d32;
    .event-type-chip {
      background-color: #e8f5e9;
      color: #2e7d32;
    }
  }

  &--venta {
    border-left-color: var(--color-accent);
    .event-type-chip {
      background-color: var(--color-accent-subtle);
      color: var(--color-accent);
    }
  }

  &--tratamiento {
    border-left-color: #d84315;
    .event-type-chip {
      background-color: #fbe9e7;
      color: #d84315;
    }
  }

  &--otro {
    border-left-color: var(--border-color);
    .event-type-chip {
      background-color: var(--bg-surface-elevated);
      color: var(--text-muted);
    }
  }

  &__type-col {
    flex-shrink: 0;
  }

  &__desc-col {
    flex: 1;
    min-width: 0;
  }

  &__date-col {
    flex-shrink: 0;
    text-align: right;
  }

  &__actions-col {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    flex-shrink: 0;
  }
}

.event-type-chip {
  display: inline-block;
  padding: 0.3rem 0.75rem;
  border-radius: var(--radius-pill);
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.02em;
}

.event-desc {
  font-size: 0.92rem;
  color: var(--text-main);
  line-height: 1.45;
  white-space: pre-wrap;
  word-break: break-word;
}

.event-date {
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--text-muted);
}

.btn--icon-only {
  padding: 0.4rem;
  border-radius: var(--radius-sm);
  display: inline-flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 15px;
    height: 15px;
  }
}

@media (max-width: 680px) {
  .event-inline-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.65rem;

    &__date-col {
      text-align: left;
    }

    &__actions-col {
      width: 100%;
      justify-content: flex-end;
      border-top: 1px solid var(--border-color-subtle);
      padding-top: 0.5rem;
    }
  }
}
</style>
