<template>
  <div class="empty-state">
    <div class="empty-state__icon-box">
      <slot name="icon">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </slot>
    </div>
    <h4 class="empty-state__title">{{ title }}</h4>
    <p v-if="description" class="empty-state__desc">{{ description }}</p>
    <div v-if="$slots.action" class="empty-state__action">
      <slot name="action" />
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    title?: string;
    description?: string;
  }>(),
  {
    title: "No se encontraron registros",
    description: "",
  }
);
</script>

<style scoped lang="scss">
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3.5rem 1.5rem;
  text-align: center;
  border-radius: var(--radius-lg);
  border: 1px dashed var(--border-color);
  background-color: var(--bg-surface-elevated);

  &__icon-box {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 3.5rem;
    height: 3.5rem;
    margin-bottom: 1rem;
    border-radius: 50%;
    background-color: var(--color-primary-subtle);
    color: var(--color-primary);
  }

  &__title {
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--text-main);
    margin-bottom: 0.35rem;
  }

  &__desc {
    font-size: 0.9rem;
    color: var(--text-muted);
    max-width: 360px;
    margin-bottom: 1.25rem;
  }

  &__action {
    margin-top: 0.5rem;
  }
}
</style>
